import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Clock, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Accurate, Drift-Free Countdown Timer using absolute timestamp (endTime)
 * Features distinct visual states and animated warnings at 10m, 5m, and 1m.
 */
const Timer = ({ endTime, onTimeUp, onTick }) => {
  const [timeLeft, setTimeLeft] = useState(null);
  
  const onTimeUpRef = useRef(onTimeUp);
  const onTickRef = useRef(onTick);
  
  // Track warnings to prevent duplicate toasts
  const warned10 = useRef(false);
  const warned5 = useRef(false);
  const warned1 = useRef(false);

  // Keep callback refs fresh
  useEffect(() => { onTimeUpRef.current = onTimeUp; }, [onTimeUp]);
  useEffect(() => { onTickRef.current = onTick; }, [onTick]);

  useEffect(() => {
    if (!endTime) return;

    // Reset warnings if a new, far-future end time is provided
    const initialRemaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
    if (initialRemaining > 600) warned10.current = false;
    if (initialRemaining > 300) warned5.current = false;
    if (initialRemaining > 60) warned1.current = false;

    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
      setTimeLeft(remaining);
      
      if (onTickRef.current) onTickRef.current(remaining);

      // Warning Thresholds
      if (remaining <= 600 && remaining > 595 && !warned10.current) {
        warned10.current = true;
        toast('⚠️ 10 minutes remaining.', { icon: '⏳' });
      }
      
      if (remaining <= 300 && remaining > 295 && !warned5.current) {
        warned5.current = true;
        toast.error('⚠️ 5 minutes remaining! Please review your answers.', { duration: 4000 });
      }
      
      if (remaining <= 60 && remaining > 55 && !warned1.current) {
        warned1.current = true;
        toast.error('🚨 1 minute remaining! Submit now or it will auto-submit!', { duration: 5000 });
      }

      // Time Up
      if (remaining <= 0) {
        clearInterval(interval);
        onTimeUpRef.current?.();
      }
    }, 500); // 500ms polling ensures UI updates right on the second boundary

    // Immediate initial sync
    const currentRemaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
    setTimeLeft(currentRemaining);
    if (onTickRef.current) onTickRef.current(currentRemaining);

    return () => clearInterval(interval);
  }, [endTime]);

  // Handle SSR / Initial undefined state gracefully
  if (timeLeft === null) return null;

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) {
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Determine styling based on thresholds
  let containerStyle = "bg-primary/10 text-primary border-primary/20 shadow-inner";
  let iconClass = "text-primary";
  let showWarningIcon = false;

  if (timeLeft <= 60) {
    // Last 1 minute: Red warning with noticeable pulse
    containerStyle = "bg-danger/10 text-danger border-danger shadow-[0_0_15px_rgba(239,68,68,0.3)] animate-pulse";
    iconClass = "text-danger";
    showWarningIcon = true;
  } else if (timeLeft <= 300) {
    // Last 5 minutes: Gold warning with subtle animation
    containerStyle = "bg-gold/10 text-gold border-gold/40";
    iconClass = "text-gold animate-pulse";
  } else if (timeLeft <= 600) {
    // Last 10 minutes: Gold indicator
    containerStyle = "bg-gold/10 text-gold border-gold/40";
    iconClass = "text-gold";
  }

  return (
    <div className={`flex items-center gap-2.5 px-4 py-2 rounded-xl border-2 font-mono font-bold text-lg tracking-wider transition-colors duration-500 ${containerStyle}`}>
      {showWarningIcon ? (
        <AlertCircle className={`w-5 h-5 ${iconClass}`} />
      ) : (
        <Clock className={`w-5 h-5 ${iconClass}`} />
      )}
      <span className="min-w-[4.5rem] text-center">{formatTime(timeLeft)}</span>
    </div>
  );
};

export default Timer;
