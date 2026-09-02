import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Tooltip = ({ 
  children, 
  content, 
  title, 
  position = 'top', 
  delay = 120,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);
  const timeoutRef = useRef(null);

  if (!content && !title) return children;

  const updateCoords = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    let top = 0;
    let left = 0;

    if (position === 'right') {
      left = rect.right + 12;
      top = rect.top + rect.height / 2;
    } else if (position === 'left') {
      left = rect.left - 12;
      top = rect.top + rect.height / 2;
    } else if (position === 'bottom') {
      left = rect.left + rect.width / 2;
      top = rect.bottom + 8;
    } else {
      // top
      left = rect.left + rect.width / 2;
      top = rect.top - 8;
    }

    setCoords({ top, left });
  };

  const handleMouseEnter = () => {
    updateCoords();
    timeoutRef.current = setTimeout(() => {
      updateCoords();
      setIsVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };

  const handleFocus = () => {
    updateCoords();
    setIsVisible(true);
  };
  const handleBlur = () => setIsVisible(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsVisible(false);
    };
    const handleScrollOrResize = () => {
      if (isVisible) updateCoords();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll', handleScrollOrResize, true);
    window.addEventListener('resize', handleScrollOrResize);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [isVisible]);

  const transformStyles = {
    top: 'translate(-50%, -100%)',
    bottom: 'translate(-50%, 0)',
    left: 'translate(-100%, -50%)',
    right: 'translate(0, -50%)'
  };

  const positionVariants = {
    top: { initial: { opacity: 0, scale: 0.95, y: 4 }, animate: { opacity: 1, scale: 1, y: 0 }, exit: { opacity: 0, scale: 0.95, y: 4 } },
    bottom: { initial: { opacity: 0, scale: 0.95, y: -4 }, animate: { opacity: 1, scale: 1, y: 0 }, exit: { opacity: 0, scale: 0.95, y: -4 } },
    left: { initial: { opacity: 0, scale: 0.95, x: 4 }, animate: { opacity: 1, scale: 1, x: 0 }, exit: { opacity: 0, scale: 0.95, x: 4 } },
    right: { initial: { opacity: 0, scale: 0.95, x: -4 }, animate: { opacity: 1, scale: 1, x: 0 }, exit: { opacity: 0, scale: 0.95, x: -4 } }
  };

  return (
    <>
      <div 
        ref={triggerRef}
        className="inline-flex items-center justify-center max-w-full"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onClick={() => {
          updateCoords();
          setIsVisible(prev => !prev);
        }}
      >
        {children}
      </div>

      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isVisible && (
            <motion.div
              role="tooltip"
              initial={positionVariants[position].initial}
              animate={positionVariants[position].animate}
              exit={positionVariants[position].exit}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              style={{
                position: 'fixed',
                top: `${coords.top}px`,
                left: `${coords.left}px`,
                transform: transformStyles[position],
                zIndex: 9999,
                pointerEvents: 'none'
              }}
              className={className}
            >
              <div className="bg-white/95 dark:bg-[#162032]/95 border border-gray-200/90 dark:border-[#2A3441] shadow-2xl rounded-xl px-3.5 py-2.5 text-left max-w-xs whitespace-normal box-border backdrop-blur-md">
                {title && (
                  <div className="text-xs font-extrabold text-[#0F5132] dark:text-[#F8FAFC] tracking-tight">
                    {title}
                  </div>
                )}
                {content && (
                  <div className={`text-[11px] font-medium leading-snug ${title ? 'text-gray-600 dark:text-[#CBD5E1] mt-0.5' : 'text-gray-900 dark:text-white'}`}>
                    {content}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};

export default Tooltip;
