// app/(auth)/register/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios, { AxiosError } from 'axios';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { HardHat } from 'lucide-react';

const RegisterPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.name || !formData.email || !formData.password) {
        toast.error("All fields are required.");
        setIsLoading(false);
        return;
    }

    try {
      await axios.post('/api/register', formData);
      toast.success('Registration successful! Please log in.');
      router.push('/login');
    } catch (error) {
      // --- MODIFICATION: Properly type the error ---
      const axiosError = error as AxiosError;
      const errorMessage = (axiosError.response?.data as string) || 'Something went wrong!';
      toast.error(errorMessage);
      console.error('Registration failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
       <div className="text-center mb-8">
          <Link href="/" className="flex items-center justify-center gap-2">
            <HardHat className="w-8 h-8 text-gray-800" />
            <h1 className="text-3xl font-bold text-gray-900">FixIt Hostel</h1>
          </Link>
        </div>
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg border border-gray-200">
        <div className="text-left">
          <h2 className="text-2xl font-bold text-gray-900">Create an Account</h2>
          <p className="mt-2 text-sm text-gray-600">Join to report and track maintenance issues.</p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="name"
              className="text-sm font-medium text-gray-700"
            >
              Full Name
            </label>
            <input
              placeholder='username'
              id="name"
              name="name"
              type="text"
              required
              className="w-full px-4 py-2 mt-1 text-gray-900 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-800"
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              placeholder='via - @nitjsr.ac.in'
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-4 py-2 mt-1 text-gray-900 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-800"
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-4 py-2 mt-1 text-gray-900 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-800"
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-3 text-base font-semibold text-white bg-gray-800 rounded-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 disabled:bg-gray-500"
            >
              {isLoading ? 'Registering...' : 'Create Account'}
            </button>
          </div>
        </form>
         <p className="text-sm text-center text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-black hover:underline">
                Log in
            </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
