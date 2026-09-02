import React, { useState, useEffect } from 'react';
import Logo from '../components/common/Logo';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../api/axios';
import PageTransition from '../components/PageTransition';
import { User, Mail, Lock, ShieldCheck, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const RegisterPage = () => {
  const { 
    register, 
    handleSubmit, 
    watch, 
    formState: { errors, isValid, isDirty } 
  } = useForm({ mode: 'onChange' });
  
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, text: '', color: 'bg-gray-200' });
  const navigate = useNavigate();
  
  const password = watch('password');
  const name = watch('name');

  // Real-time password strength calculation
  useEffect(() => {
    if (!password) {
      setPasswordStrength({ score: 0, text: 'Enter a password', color: 'bg-gray-200' });
      return;
    }
    
    let score = 0;
    if (password.length > 5) score += 1;
    if (password.length > 7) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 2) setPasswordStrength({ score, text: 'Weak', color: 'bg-danger' });
    else if (score <= 4) setPasswordStrength({ score, text: 'Good', color: 'bg-warning' });
    else setPasswordStrength({ score, text: 'Strong', color: 'bg-success' });
  }, [password]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await api.post('/auth/register', {
        name: data.name,
        email: data.email,
        password: data.password,
        role: 'student' 
      });
      toast.success('Registration successful! Welcome aboard. 🚀');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed.');
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
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 md:p-8 bg-cream dark:bg-gray-950 relative overflow-hidden">
        {/* Background blobs for premium feel */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold/20 rounded-full blur-3xl opacity-60"></div>

        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-8 md:p-10 rounded-3xl shadow-2xl border border-white/50 dark:border-gray-700/50 relative z-10"
          aria-labelledby="register-heading"
        >
          <header className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <img src="/logo/qezmora-logo-primary.png" alt="Qezmora" className="h-12 hidden dark:hidden sm:block mx-auto" />
              <img src="/logo/qezmora-logo-inverted.png" alt="Qezmora" className="h-12 hidden dark:sm:block mx-auto" />
              <img src="/logo/qezmora-icon-light.png" alt="Qezmora Icon" className="h-10 w-10 sm:hidden mx-auto" />
            </div>
            <h1 id="register-heading" className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Create Account</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">
              Join Qezmora — Smart Exams. Simplified.
            </p>
          </header>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="label-base">Full Name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                  <User className="h-5 w-5" aria-hidden="true" />
                </div>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  {...register('name', { 
                    required: 'Full name is required',
                    minLength: { value: 3, message: 'Must be at least 3 characters' }
                  })}
                  className={`input-base pl-11 ${errors.name ? 'border-danger focus:ring-danger/20' : ''}`}
                  placeholder="e.g. John Doe"
                />
                {name && !errors.name && (
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center text-success">
                    <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                  </div>
                )}
              </div>
              <InputError error={errors.name} />
            </div>

            {/* Email Field */}
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
                  className={`input-base pl-11 ${errors.email ? 'border-danger focus:ring-danger/20' : ''}`}
                  placeholder="john@example.com"
                />
              </div>
              <InputError error={errors.email} />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="label-base">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                  <Lock className="h-5 w-5" aria-hidden="true" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: { value: 8, message: 'Must be at least 8 characters' },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
                      message: 'Must contain uppercase, lowercase, and a number'
                    }
                  })}
                  className={`input-base pl-11 pr-11 ${errors.password ? 'border-danger focus:ring-danger/20' : ''}`}
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
              
              {/* Password Strength Meter */}
              {password && (
                <div className="mt-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Password strength:</span>
                    <span className={`text-xs font-bold ${
                      passwordStrength.score <= 2 ? 'text-danger' : 
                      passwordStrength.score <= 4 ? 'text-warning' : 'text-success'
                    }`}>
                      {passwordStrength.text}
                    </span>
                  </div>
                  <div className="flex gap-1 h-1.5">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div 
                        key={level} 
                        className={`flex-1 rounded-full transition-all duration-300 ${
                          passwordStrength.score >= level ? passwordStrength.color : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="label-base">Confirm Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                  <Lock className="h-5 w-5" aria-hidden="true" />
                </div>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  {...register('confirmPassword', { 
                    required: 'Please confirm your password',
                    validate: value => value === password || 'Passwords do not match'
                  })}
                  className={`input-base pl-11 pr-11 ${errors.confirmPassword ? 'border-danger focus:ring-danger/20' : ''}`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded-r-lg"
                  aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" aria-hidden="true" /> : <Eye className="h-5 w-5" aria-hidden="true" />}
                </button>
              </div>
              <InputError error={errors.confirmPassword} />
            </div>

            <button
              type="submit"
              disabled={loading || (isDirty && !isValid)}
              className="btn btn-primary w-full py-3.5 mt-4 text-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating Account...
                </span>
              ) : 'Register Account'}
            </button>
          </form>

          <p className="mt-8 text-center text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:text-primary/80 font-bold hover:underline transition-all">
              Sign In
            </Link>
          </p>
        </motion.section>
      </div>
    </PageTransition>
  );
};

export default RegisterPage;
