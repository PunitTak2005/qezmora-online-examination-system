import React, { useState } from 'react';
import Logo from '../components/common/Logo';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import PageTransition from '../components/PageTransition';
import { Eye, EyeOff, Mail, Lock, AlertCircle, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LoginPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({ mode: 'onChange' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const onSubmit = async (data) => {
    setLoading(true);
    setServerError('');
    try {
      const response = await api.post('/auth/login', data);
      login(response.data.user, response.data.token);
      toast.success(`Welcome back, ${response.data.user.name.split(' ')[0]}!`);
      navigate(`/${response.data.user.role}/dashboard`);
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Incorrect email or password. Please try again.';
      setServerError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const InputError = ({ error }) => (
    <AnimatePresence>
      {error && (
        <motion.p 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="text-sm text-danger mt-1.5 flex items-center gap-1 font-medium"
        >
          <AlertCircle className="w-4 h-4" /> {error.message}
        </motion.p>
      )}
    </AnimatePresence>
  );

  return (
    <PageTransition>
      <div className="min-h-[calc(100vh-64px)] flex">
        {/* Left Side - Image/Gradient */}
        <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary to-secondary p-12 text-white flex-col justify-center relative overflow-hidden">
          {/* Animated Blobs */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
          
          <div className="relative z-10 max-w-lg">
            <h1 className="text-5xl font-extrabold mb-6 tracking-tight">Welcome Back!</h1>
            <p className="text-xl text-white/80 leading-relaxed">
              Log in to continue your learning journey, manage your examinations, and track your performance in real-time.
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-white dark:bg-gray-950">
          <motion.section 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full max-w-md"
            aria-labelledby="login-heading"
          >
            <header className="text-center mb-8">
              <div className="flex justify-center mb-6">
                <img src="/logo/qezmora-logo-primary.png" alt="Qezmora" className="h-12 hidden dark:hidden sm:block mx-auto" />
                <img src="/logo/qezmora-logo-inverted.png" alt="Qezmora" className="h-12 hidden dark:sm:block mx-auto" />
                <img src="/logo/qezmora-icon-light.png" alt="Qezmora Icon" className="h-10 w-10 sm:hidden mx-auto" />
              </div>
              <h1 id="login-heading" className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Sign In</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">Qezmora — Smart Exams. Simplified.</p>
            </header>

            {/* Server Error Alert Banner */}
            <AnimatePresence>
              {serverError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 flex items-start gap-3 shadow-sm"
                >
                  <XCircle className="w-5 h-5 shrink-0 text-rose-500 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-extrabold text-sm text-rose-800 dark:text-rose-200">Authentication Failed</h4>
                    <p className="text-xs mt-0.5 font-medium leading-relaxed">{serverError}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="email" className="label-base">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                    <Mail className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Please enter a valid email address'
                      }
                    })}
                    onChange={() => { if (serverError) setServerError(''); }}
                    className={`input-base pl-11 ${errors.email || serverError ? 'border-danger focus:ring-danger/20' : ''}`}
                    placeholder="you@example.com"
                  />
                </div>
                <InputError error={errors.email} />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label htmlFor="password" className="label-base mb-0">Password</label>
                  <Link to="/forgot-password" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">Forgot password?</Link>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                    <Lock className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    {...register('password', { required: 'Password is required' })}
                    onChange={() => { if (serverError) setServerError(''); }}
                    className={`input-base pl-11 pr-11 ${errors.password || serverError ? 'border-danger focus:ring-danger/20' : ''}`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded-r-lg"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" aria-hidden="true" /> : <Eye className="h-5 w-5" aria-hidden="true" />}
                  </button>
                </div>
                <InputError error={errors.password} />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full py-3.5 text-lg mt-2 shadow-lg shadow-primary/25"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
                    Authenticating...
                  </span>
                ) : 'Sign In'}
              </button>
            </form>

            <p className="mt-8 text-center text-gray-600 dark:text-gray-400 font-medium">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary hover:text-primary/80 font-bold hover:underline transition-all">
                Create Account
              </Link>
            </p>
          </motion.section>
        </div>
      </div>
    </PageTransition>
  );
};

export default LoginPage;
