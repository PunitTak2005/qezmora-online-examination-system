import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { slideUpVariants } from '../animations/variants';

const StatCard = ({ title, value, subtitle, icon: Icon, colorClass = "text-primary bg-primary/10", delay = 0 }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      variants={shouldReduceMotion ? { hidden: { opacity: 0 }, visible: { opacity: 1 } } : slideUpVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay, duration: 0.3, ease: 'easeOut' }}
      whileHover={shouldReduceMotion ? {} : { y: -4, transition: { duration: 0.2 } }}
      className="card card-p flex items-start gap-4 hover:shadow-md transition-shadow"
    >
      <div className={`p-3 rounded-xl ${colorClass}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">{title}</h3>
        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
        {subtitle && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
        )}
      </div>
    </motion.div>
  );
};

export default StatCard;
