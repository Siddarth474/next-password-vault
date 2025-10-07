'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { handleError, handleSuccess } from '@/utils/notification';

export default function SignupPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [show, setShow] = useState({
        password: false,
        confirmPassword: false
    });

    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            handleError('Email and password are required.');
            return;
        }
        if (formData.password.length < 8) {
            handleError('Password must be at least 8 characters.');
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            handleError('Passwords do not match.');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post('/api/auth/signup', formData);
            handleSuccess(response.data.message || 'Account created successfully!');
            setFormData({ email: '', password: '', confirmPassword: '' });
            router.push('/login');
            
        } catch (err) {
            if (err.response) {
                setLoading(false);
                const data = err.response.data;
                handleError(data.error || 'Invalid email or password.');
            }
            else {
                handleError('Network error. Please check your connection.', err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='flex items-center justify-center min-h-screen bg-orange-300 p-4'>
            <div className="bg-white max-w-[400px] w-full shadow-lg rounded-xl p-6">
                <h1 className="text-2xl font-bold text-center mb-6">Create Account</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-2 outline rounded text-black
                        focus:outline-none focus:ring-2 focus:ring-orange-500 "
                        placeholder="Enter your email"
                        disabled={loading}
                    />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
                        <div className="w-full flex justify-between gap-2 items-center p-2 outline rounded
                        focus-within:ring-2 focus-within:ring-orange-500 focus-within:outline-0 text-black">
                            <input
                            id="password"
                            name="password"
                            type={show.password ? 'text' : 'password'}
                            value={formData.password}
                            onChange={handleChange}
                            className='w-full bg-transparent outline-none'
                            placeholder="••••••••"
                            disabled={loading} />

                            { show.password ? <Eye size={20} className="cursor-pointer"
                            onClick={() => setShow({...show, password: !show.password})} /> :
                            <EyeOff size={20} className="cursor-pointer"
                            onClick={() => setShow({...show, password: !show.password})} /> 
                            }
                        </div>
                        <p className="text-xs text-gray-500 mt-1">At least 8 characters</p>
                    </div>

                    <div >
                        <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">Confirm Password</label>
                        <div className="w-full flex justify-between gap-2 items-center p-2 rounded
                           outline text-black focus-within:outline-0
                            focus-within:ring-2 focus-within:ring-orange-500">
                            <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={show.confirmPassword ? 'text' : 'password'}
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className='w-full bg-transparent outline-none'
                            placeholder="••••••••"
                            disabled={loading} />

                            { show.confirmPassword ? <Eye size={20} className="cursor-pointer"
                            onClick={() => setShow({...show, confirmPassword: !show.confirmPassword})} /> :
                            <EyeOff size={20} className="cursor-pointer"
                            onClick={() => setShow({...show, confirmPassword: !show.confirmPassword})} /> 
                            }
                        </div>
                    </div>

                    <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-2 px-4 rounded font-medium ${
                        loading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-orange-600 hover:bg-orange-500 text-white'
                    }`}
                    >
                    {loading ? 'Creating...' : 'Sign Up'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm">
                    <p>
                    Already have an account?{' '}
                    <a href="/login" className="text-orange-600 hover:underline">
                        Log in
                    </a>
                    </p>
                </div>
            </div>
        </div>
    );
}