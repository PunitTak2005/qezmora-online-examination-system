import React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';
import { fadeVariants, modalVariants } from '../animations/variants';

const Modal = ({ isOpen, onClose, title, children }) => {
  const shouldReduceMotion = useReducedMotion();
  const activeModalVariants = shouldReduceMotion ? fadeVariants : modalVariants;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            variants={fadeVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
              variants={activeModalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="card shadow-xl w-full max-w-md pointer-events-auto overflow-hidden flex flex-col max-h-[90vh]"
            >
              <header className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-gray-700">
                <h3 id="modal-title" className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close modal"
                  className="p-1 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </header>
              <div className="p-4 overflow-y-auto">
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;
