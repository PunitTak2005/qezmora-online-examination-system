import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../api/axios';
import PageTransition from '../components/PageTransition';
import { Lock } from 'lucide-react';

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const password = watch('password');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await api.put(`/auth/reset-password/${token}`, { password: data.password });
      toast.success('Password has been reset successfully!');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password. Link may be invalid or expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <main className="min-h-[calc(100vh-64px)] flex items-center justify-center p-8 bg-cream dark:bg-gray-900">
        <section aria-labelledby="reset-password-title" className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
          <header className="text-center mb-8">
            <h2 id="reset-password-title" className="text-3xl font-bold text-gray-900 dark:text-white">Reset Password</h2>
            <p className="text-gray-500 mt-2">Enter your new password below</p>
          </header>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">New Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock className="h-5 w-5" aria-hidden="true" />
                </div>
                <input
                  id="password"
                  type="password"
                  {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Minimum 6 characters' } })}
                  className="block w-full pl-10 pr-3 py-2 border rounded-lg bg-cream dark:bg-gray-900 dark:border-gray-700 focus:ring-primary text-gray-900 dark:text-white"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <p className="text-sm text-danger mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Confirm New Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock className="h-5 w-5" aria-hidden="true" />
                </div>
                <input
                  id="confirmPassword"
                  type="password"
                  {...register('confirmPassword', { validate: value => value === password || 'Passwords do not match' })}
                  className="block w-full pl-10 pr-3 py-2 border rounded-lg bg-cream dark:bg-gray-900 dark:border-gray-700 focus:ring-primary text-gray-900 dark:text-white"
                  placeholder="••••••••"
                />
              </div>
              {errors.confirmPassword && <p className="text-sm text-danger mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors mt-6 font-medium disabled:opacity-50"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        </section>
      </main>
    </PageTransition>
  );
};

export default ResetPasswordPage;
