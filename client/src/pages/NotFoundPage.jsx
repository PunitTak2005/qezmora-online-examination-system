import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, Home, Search } from 'lucide-react';
import PageTransition from '../components/PageTransition';

const NotFoundPage = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-cream dark:bg-gray-950 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="max-w-xl w-full bg-white dark:bg-gray-900 p-10 md:p-16 rounded-[40px] shadow-2xl border border-gray-100 dark:border-gray-800 text-center relative overflow-hidden"
        >
          {/* Decorative background */}
          <div className="absolute top-0 left-0 w-full h-32 bg-primary/5 -z-10 rounded-b-full scale-150 blur-2xl"></div>
          
          <div className="w-24 h-24 bg-danger/10 text-danger rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-white dark:border-gray-900 shadow-xl relative z-10">
            <AlertTriangle className="w-12 h-12" />
          </div>
          
          <h1 className="text-8xl font-black text-gray-900 dark:text-white mb-2 tracking-tighter">404</h1>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Page Not Found</h2>
          
          <p className="text-gray-500 dark:text-gray-400 mb-10 text-lg leading-relaxed">
            Oops! The page you are looking for does not exist, has been removed, or is temporarily unavailable.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/" className="btn btn-primary w-full sm:w-auto px-8 py-4 rounded-xl text-lg font-bold gap-2 shadow-xl shadow-primary/20">
              <Home className="w-5 h-5" /> Return Home
            </Link>
            <Link to="/exams" className="btn btn-outline w-full sm:w-auto px-8 py-4 rounded-xl text-lg font-bold gap-2">
              <Search className="w-5 h-5" /> Browse Exams
            </Link>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default NotFoundPage;
