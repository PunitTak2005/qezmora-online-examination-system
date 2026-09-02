import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../api/axios';
import PageTransition from '../components/PageTransition';
import { Mail, ArrowLeft } from 'lucide-react';

const ForgotPasswordPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', data);
      setSuccess(true);
      toast.success('Password reset link sent to your email.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <main className="min-h-[calc(100vh-64px)] flex items-center justify-center p-8 bg-cream dark:bg-gray-900">
        <section aria-labelledby="forgot-password-title" className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
          <header className="text-center mb-8">
            <h2 id="forgot-password-title" className="text-3xl font-bold text-gray-900 dark:text-white">Forgot Password</h2>
            <p className="text-gray-500 mt-2">Enter your email to receive a reset link</p>
          </header>

          {success ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-4" aria-hidden="true">
                <Mail className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Check your email</h3>
              <p className="text-gray-500 mb-6">We've sent a password reset link to your email address.</p>
              <Link to="/login" className="text-primary hover:underline font-medium inline-flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Mail className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    {...register('email', { required: 'Email is required' })}
                    className="block w-full pl-10 pr-3 py-2 border rounded-lg bg-cream dark:bg-gray-900 dark:border-gray-700 focus:ring-primary text-gray-900 dark:text-white"
                    placeholder="you@example.com"
                  />
                </div>
                {errors.email && <p className="text-sm text-danger mt-1">{errors.email.message}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors mt-6 font-medium disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>

              <div className="text-center mt-6">
                <Link to="/login" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors inline-flex items-center gap-1">
                  <ArrowLeft className="w-4 h-4" /> Back to Login
                </Link>
              </div>
            </form>
          )}
        </section>
      </main>
    </PageTransition>
  );
};

export default ForgotPasswordPage;
