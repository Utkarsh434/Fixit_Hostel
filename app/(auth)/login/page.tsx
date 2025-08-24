'use client';

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { HardHat } from 'lucide-react';

const LoginPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    signIn('credentials', {
      ...formData,
      redirect: false,
    })
    .then((callback) => {
      setIsLoading(false);
      if (callback?.ok) {
        toast.success('Logged in successfully!');
        router.push('/dashboard');
      }
      if (callback?.error) {
        toast.error(callback.error);
      }
    });
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
          <h2 className="text-2xl font-bold text-gray-900">Sign in to your account</h2>
          <p className="mt-2 text-sm text-gray-600">Welcome back to FixIt Hostel.</p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
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
              className="w-full px-4 py-2 mt-1 text-gray-700 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black"
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
              className="w-full px-4 py-2 mt-1 text-gray-700 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black"
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-3 text-base font-semibold text-white bg-black rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:bg-gray-500"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>
        </form>
         <p className="text-sm text-center text-gray-600">
            {/* --- MODIFICATION: Escaped the apostrophe --- */}
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-medium text-black hover:underline">
                Sign up
            </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
