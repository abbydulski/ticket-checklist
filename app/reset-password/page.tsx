'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  
  const { updatePassword } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    const { error } = await updatePassword(newPassword);
    
    if (error) {
      setError(error.message);
    } else {
      setMessage('Password updated successfully! Redirecting to dashboard...');
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#D3D3D3' }}>
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Image 
            src="/logo.svg" 
            alt="Company Logo" 
            width={200} 
            height={67}
            className="object-contain"
          />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
          Reset Password
        </h1>
        <p className="text-gray-600 mb-6 text-center">
          Enter your new password below
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-900"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-900"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-black disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => router.push('/login')}
            className="text-gray-600 hover:text-gray-900 text-sm"
          >
            Back to sign in
          </button>
        </div>
      </div>
    </div>
  );
}

