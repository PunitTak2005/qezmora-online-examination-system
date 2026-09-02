import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { formatNumber } from '../../utils/formatNumber';

const AnimatedValue = ({ value, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const numericValue = typeof value === 'number' ? value : parseFloat(value) || 0;

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const targetVal = numericValue;
    const step = Math.ceil(targetVal / 30) || 1;
    const timer = setInterval(() => {
      start += step;
      if (start >= targetVal) {
        setCount(targetVal);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 30);
    return () => clearInterval(timer);
  }, [isInView, numericValue]);

  return (
    <span ref={ref}>
      {formatNumber(count)}{suffix}
    </span>
  );
};

const StatCard = ({
  icon: Icon,
  value,
  label,
  subtitle,
  suffix = '',
  loading = false,
  delay = 0,
  className = ''
}) => {
  if (loading) {
    return (
      <div className="bg-white dark:bg-[#162032] rounded-2xl p-6 border border-gray-100 dark:border-[#2A3441] shadow-sm animate-pulse flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-gray-200 dark:bg-gray-800 shrink-0" />
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
          <div className="h-7 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ y: -4 }}
      className={`bg-white dark:bg-[#162032] rounded-2xl p-6 border border-gray-100 dark:border-[#2A3441] shadow-sm hover:shadow-xl transition-all flex items-center gap-4 ${className}`}
    >
      {Icon && (
        <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary dark:bg-amber-500/10 dark:text-amber-400 flex items-center justify-center shrink-0">
          <Icon className="w-6 h-6" />
        </div>
      )}
      <div>
        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          {label}
        </p>
        <h4 className="text-3xl font-black text-gray-900 dark:text-white mt-0.5">
          <AnimatedValue value={value} suffix={suffix} />
        </h4>
        {subtitle && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{subtitle}</p>
        )}
      </div>
    </motion.div>
  );
};

export default StatCard;
