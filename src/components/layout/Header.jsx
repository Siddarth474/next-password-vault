'use client';

import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LogOut } from 'lucide-react';
import { handleError, handleSuccess } from '@/utils/notification';

export default function Header() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.post('/api/auth/logout');
      handleSuccess(response.data.message);
    } catch (error) {
      handleError('Logout failed. Please try again.');
      console.error('Logout failed:', error);
    } finally {
      router.push('/login');
    }
  };

  if (!mounted) return null;

  return (
    <header className="shadow bg-orange-500 p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">PassVault</h1>
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-3 py-1 bg-white text-black rounded font-semibold 
        cursor-pointer hover:shadow-lg"
        aria-label="Logout">
        <LogOut size={18} strokeWidth={2.2} className="mr-1" />
        Logout
      </button>
    </header>
  );
}