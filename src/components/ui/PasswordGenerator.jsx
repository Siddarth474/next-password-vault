'use client';
import { useState } from 'react';

export default function PasswordGenerator({ onGenerate }) {
  const [length, setLength] = useState(16);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeLookAlikes, setExcludeLookAlikes] = useState(true);

  const generate = () => {
    let charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    if (excludeLookAlikes) {
      charset = charset.replace(/[il1Lo0O]/g, '');
    }

    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    onGenerate(password);
  };

  return (
    <div className="space-y-4 p-4 border-2 rounded-xl">
      <div>
        <label className="block">Length: {length}</label>
        <input
          type="range"
          min="8"
          max="32"
          value={length}
          onChange={(e) => setLength(e.target.value)}
          className="w-full"
        />
      </div>
      <div className="flex flex-col justify-between md:flex-row gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={includeNumbers}
            onChange={(e) => setIncludeNumbers(e.target.checked)}
          />
          Numbers
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={includeSymbols}
            onChange={(e) => setIncludeSymbols(e.target.checked)}
          />
          Symbols
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={excludeLookAlikes}
            onChange={(e) => setExcludeLookAlikes(e.target.checked)}
          />
          Exclude look-alikes (i, l, 1, O, 0)
        </label>
      </div>
      <button onClick={generate} 
      className="bg-orange-600 text-white w-full px-3 py-2 rounded-md hover:bg-orange-500 cursor-pointer">
        Generate
      </button>
    </div>
  );
}