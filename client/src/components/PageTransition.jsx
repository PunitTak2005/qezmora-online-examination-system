import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { pageVariants } from '../animations/variants';

const PageTransition = ({ children }) => {
  const shouldReduceMotion = useReducedMotion();

  // If reduced motion is preferred, only animate opacity, not scale or y-position
  const reducedMotionVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } }
  };

  return (
    <motion.div
      variants={shouldReduceMotion ? reducedMotionVariants : pageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
