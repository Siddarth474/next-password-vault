'use client';

import { useEffect, useState } from 'react';
import PasswordGenerator from '@/components/ui/PasswordGenerator';
import CopyButton from '@/components/ui/CopyButton';
import { encryptData, decryptData } from '@/lib/crypto';
import { Download, Eye, EyeOff, Import, LockKeyholeOpen, Save, SquarePen, Trash } from 'lucide-react';
import axios from 'axios';
import Header from '@/components/layout/Header';
import { handleError, handleSuccess } from '@/utils/notification';

export default function VaultPage() {
  const [vault, setVault] = useState([]);
  const [search, setSearch] = useState('');
  const [password, setPassword] = useState(''); 
  const [showPassword, setShowPassword] = useState(false);
  const [newItem, setNewItem] = useState({ title: '', username: '', password: '', url: '', notes: '' });
  const [decryptedVault, setDecryptedVault] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const loadVault = async () => {
      try {
        const res = await fetch('/api/vault');
        const data = await res.json();
        if (data.success) {
          setVault(data.vault || []);
        }
      } catch (err) {
        console.error('Failed to load vault:', err);
      }
    };
    loadVault();
  }, []);

  const decryptVault = async () => {
    if (!password) return;
    if (vault.length === 0) {
      setDecryptedVault([]);
      handleSuccess('Vault is empty');
      return;
    }
    try {
      const decrypted = await Promise.all(
        vault.map(item => decryptData(item, password))
      );
      setDecryptedVault(decrypted);
      handleSuccess('Vault unlocked!');
    } catch (e) {
      handleError('Wrong password or corrupted data');
      setDecryptedVault([]);
    }
  };

  const saveVault = async (vaultToSave = null) => {

    const vaultData = Array.isArray(vaultToSave) 
      ? vaultToSave 
      : Array.isArray(decryptedVault) 
        ? decryptedVault 
        : [];

    if (vaultData.length === 0) return;
    if (!password) {
      handleError('⚠️ Please enter your master password to save.');
      return;
    }

    try {
      const encryptedVault = await Promise.all(
        vaultData.map(async (item) => {
          const itemSalt = Array.from(crypto.getRandomValues(new Uint8Array(32)))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
          return encryptData(item, password, itemSalt);
        })
      );

      await axios.post('/api/vault', { vault: encryptedVault });
      setVault(encryptedVault);
      handleSuccess(' Vault saved securely!');

    } catch (err) {
      console.error('Save failed:', err);
      handleError(' Save failed: ' + (err.response?.data?.error || err.message || 'Unknown error'));
      throw err;
    }
  };

  const filtered = decryptedVault.filter(item =>
    (item.title && item.title.toLowerCase().includes(search.toLowerCase())) ||
    (item.username && item.username.toLowerCase().includes(search.toLowerCase())) ||
    (item.url && item.url.toLowerCase().includes(search.toLowerCase()))
  );

  const deleteItem = async (idToDelete) => {
    if (!password) {
      handleError('⚠️ Please enter your master password to delete.');
      return;
    }

    const itemToDelete = decryptedVault.find(item => item.id === idToDelete);
    if (!itemToDelete) return;

    const updatedVault = decryptedVault.filter(item => item.id !== idToDelete);

    try {
      const encryptedVault = await Promise.all(
        updatedVault.map(async (item) => {
          const salt = Array.from(crypto.getRandomValues(new Uint8Array(32)))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
          return encryptData(item, password, salt);
        })
      );
      await axios.post('/api/vault', { vault: encryptedVault });

      setDecryptedVault(updatedVault);
      setVault(encryptedVault);
      handleSuccess('✅ Item permanently deleted');

    } catch (err) {
      console.error('Delete failed:', err);
      handleError('❌ Failed to delete item from vault.');
    }
  };

  const handleFormSubmit = () => {
    if (!newItem.title.trim() || !newItem.username.trim() || !newItem.password.trim()) {
      handleError('Please fill in title, username, and password.');
      return;
    }

    if (editingId) {
      setDecryptedVault(prev =>
        prev.map(item =>
          item.id === editingId ? { ...newItem, id: editingId } : item
        )
      );
      handleSuccess(' Entry updated (not saved yet)');
    } else {
      const newItemWithId = { ...newItem, id: crypto.randomUUID?.() || Date.now() };
      setDecryptedVault(prev => [...prev, newItemWithId]);
      handleSuccess(' Entry added (not saved yet)');
    }
    setNewItem({ title: '', username: '', password: '', url: '', notes: '' });
    setEditingId(null);
  };

  const handleExport = async () => {
    if (!password) {
      handleError('Please enter your master password to encrypt the export.');
      return;
    }

    const salt = Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    const encryptedVault = await Promise.all(
      decryptedVault.map(item => encryptData(item, password, salt))
    );

    const exportData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      vault: encryptedVault,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `passvault-export-${new Date().toISOString().split('T')[0]}.vault.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!password) {
      handleError('Please enter your master password to decrypt the import.');
      return;
    }

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (!data.vault || !Array.isArray(data.vault)) {
        throw new Error('Invalid file format');
      }

      const decryptedImport = await Promise.all(
        data.vault.map(item => decryptData(item, password))
      );

      setDecryptedVault(decryptedImport);
      handleSuccess('Import successful!');
    } catch (err) {
      console.error(err);
      handleError('Failed to import: ' + (err.message || 'Invalid password or file'));
    }
  };

  return (
    <div className='min-h-screen'>
      <Header />
      <div className='flex flex-col m-5 md:flex-row md:justify-center md:items-start gap-10 md:gap-20'>
        <div className=" self-center md:self-auto max-w-[600px] p-5 bg-white shadow-xl rounded-xl">
          <h1 className="text-2xl font-bold mb-4">Password Vault</h1>

          <div className="mb-4">
            <div className="w-full flex justify-between gap-2 items-center p-2 outline rounded
               text-black focus-within:ring-2 focus-within:outline-0 focus-within:ring-orange-500">
                <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='w-full bg-transparent outline-none'
                placeholder="Enter your master password to unlock"/>

                { showPassword ? <Eye size={20} className="cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)} /> :
                    <EyeOff size={20} className="cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)} />
                } 
            </div>
            <p className='text-xs text-orange-400 my-2'>
              * Enter your <strong>account password</strong> (the one you use to log in).
              This unlocks your vault. <strong>Do not use a generated password here. *</strong>
            </p>
            <div onClick={decryptVault}
              className='flex hover:underline text-orange-500 items-center mb-4 gap-2 cursor-pointer'>
              <LockKeyholeOpen size={19} strokeWidth={2.2} />
              <button type="button" className="font-bold"> Unlock </button>
            </div>
          </div>

          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 outline rounded w-full mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />

          <PasswordGenerator onGenerate={(pwd) => setNewItem({ ...newItem, password: pwd })} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-5">
            {['title', 'username', 'password', 'url', 'notes'].map(field => (
              <input
                key={field}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={newItem[field]}
                onChange={(e) => setNewItem({ ...newItem, [field]: e.target.value })}
                className={`p-2 outline rounded w-full mb-2 focus:outline-none focus:ring-2 focus:ring-orange-500
                  ${field === 'title' ? 'sm:col-span-2' : 'sm:col-span-1'}`}
                type="text"
              />
            ))}
          </div>
          <button onClick={handleFormSubmit} className="bg-orange-600 w-full text-white px-3 py-2 
          rounded-md hover:bg-orange-700 cursor-pointer">{editingId ? 'Update Entry' : 'Add Entry'}</button>
          {editingId && (
            <button
              onClick={() => {
                setNewItem({ title: '', username: '', password: '', url: '', notes: '' });
                setEditingId(null);
              }}
              className="mt-2 w-full text-white bg-gray-500 px-3 py-2 hover:bg-gray-400 rounded-md" >
              Cancel Edit
            </button>
          )}
        </div>

        <div className='w-full md:w-max'>
          {filtered.map((item, i) => (
            <div key={item.id || i} className="flex flex-col p-4 bg-white shadow-xl rounded-xl mb-3">
                <h3 className="font-bold capitalize">{item.title}</h3>
                <p>Username:<span className='ml-2'>{item.username}</span></p>
                <p className='flex-wrap'>Password:<span className='ml-2 '>{item.password}</span>
                  <CopyButton text={item.password} className="ml-5" />
                </p>
                {item.url && <p>URL: <a href={item.url} target="_blank" rel="noopener noreferrer" 
                className="text-blue-500">{item.url}</a></p>}
                {item.notes && <p>Notes: {item.notes}</p>}

                <div className="mt-2 flex items-center gap-2">
                    <button
                      onClick={() => {
                        setNewItem({
                          title: item.title || '',
                          username: item.username || '',
                          password: item.password || '',
                          url: item.url || '',
                          notes: item.notes || ''
                        });
                        setEditingId(item.id);
                      }}
                      className="text-green-500 hover:underline text-sm cursor-pointer">
                      <SquarePen size={18} strokeWidth={2.2} className="inline mb-0.5 mr-1" />
                    </button>

                    <button onClick={() => deleteItem(item.id)}
                      className="text-red-500 hover:underline text-sm cursor-pointer">
                      <Trash size={18} strokeWidth={2.2} className="inline mb-0.5 mr-1" /> 
                  </button>
                </div>
            </div>
          ))}
          <div className='flex gap-2 items-center'>
            {decryptedVault.length > 0 && (
            <button onClick={saveVault} className="flex items-center mt-4 ml-2 bg-orange-600 text-white px-3
             py-2 rounded-md hover:bg-orange-500 cursor-pointer">
              <Save size={18} strokeWidth={2.2} className="mr-2" /> 
              Save Vault
              </button>
          )}

          {decryptedVault.length > 0 && (<div className="mt-4 flex gap-2">
            
            <button onClick={handleExport} className="px-3 flex items-center py-2 bg-green-600
             text-white rounded cursor-pointer">
              <Download size={18} strokeWidth={2.2} className="mr-2" /> Export
            </button>
            <label className="flex items-center px-3 py-2 bg-blue-600 text-white rounded cursor-pointer">
              <Import size={18} strokeWidth={2.2} className="mr-2" />
              Import
              <input
                type="file"
                accept=".json,.vault"
                className="hidden"
                onChange={handleImport}
              />
            </label>
          </div>)}
          </div>
        </div>
      </div>
    </div>
  );
}