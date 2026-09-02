import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import PageTransition from '../../components/PageTransition';
import Timer from '../../components/Timer';
import QuestionPalette from '../../components/QuestionPalette';
import Modal from '../../components/Modal';
import { Flag, ChevronLeft, ChevronRight, Send, AlertTriangle, Clock, ListChecks, ShieldAlert, Maximize, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ExamPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const storageKey = `exam_progress_${user?._id || user?.id || 'guest'}_${id}`;
  
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [answers, setAnswers] = useState({});
  const [flagged, setFlagged] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Security & Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [violationsCount, setViolationsCount] = useState(0);
  const [showSecurityWarningModal, setShowSecurityWarningModal] = useState(false);
  const [securityReason, setSecurityReason] = useState('');

  // Timer & Attempt state
  const [timeTaken, setTimeTaken] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const endTimeRef = useRef(null);
  const violationsRef = useRef(0);
  const isSubmittingRef = useRef(false);

  const [attemptId, setAttemptId] = useState(null);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  // Keep track of viewport width for responsive layout recalculation (e.g., after Fullscreen)
  useEffect(() => {
    const handleLayoutRecalculate = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    window.addEventListener('resize', handleLayoutRecalculate);
    document.addEventListener('fullscreenchange', handleLayoutRecalculate);
    return () => {
      window.removeEventListener('resize', handleLayoutRecalculate);
      document.removeEventListener('fullscreenchange', handleLayoutRecalculate);
    };
  }, []);

  // ─── 1. FETCH & INITIALIZE EXAM ───────────────────────────────────────────
  useEffect(() => {
    const fetchExamAndQuestions = async () => {
      try {
        const attemptRes = await api.post('/attempts/start', { examId: id });
        const attemptData = attemptRes.data.data;
        
        const examRes = await api.get(`/exams/${id}`);
        const examData = examRes.data.data || examRes.data;

        setExam(examData);
        setAttemptId(attemptData._id);

        const formattedQuestions = (attemptData.generatedQuestions || []).map(g => {
          const qDoc = (g.question && typeof g.question === 'object')
            ? (g.question._doc || g.question)
            : {};
          return {
            ...qDoc,
            _id: qDoc._id || g.question,
            question: qDoc.question || qDoc.questionText || qDoc.title || qDoc.text || '',
            type: qDoc.type || 'mcq',
            options: (g.shuffledOptions && g.shuffledOptions.length > 0)
              ? g.shuffledOptions
              : (qDoc.options || []),
            marks: qDoc.marks || 5
          };
        });
        setQuestions(formattedQuestions);

        // Resume saved progress if valid
        const savedProgress = localStorage.getItem(storageKey);
        if (savedProgress) {
          const parsed = JSON.parse(savedProgress);
          if (parsed.endTime && Date.now() < parsed.endTime) {
            setAnswers(parsed.answers || {});
            setFlagged(new Set(parsed.flagged || []));
            setCurrentIndex(parsed.currentIndex || 1);
            endTimeRef.current = parsed.endTime;
            setRemainingSeconds(Math.floor((parsed.endTime - Date.now()) / 1000));
            toast.success('Exam progress restored!');
          } else {
            endTimeRef.current = Date.now() + (examData.duration || 30) * 60 * 1000;
            setRemainingSeconds((examData.duration || 30) * 60);
          }
        } else {
          endTimeRef.current = Date.now() + (examData.duration || 30) * 60 * 1000;
          setRemainingSeconds((examData.duration || 30) * 60);
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to generate exam paper');
        navigate('/student/exams');
      } finally {
        setLoading(false);
      }
    };
    fetchExamAndQuestions();

    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = 'Leaving will forfeit your exam attempt. Are you sure?';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [id, navigate, storageKey]);

  // ─── 2. SAVE LOCAL PROGRESS ───────────────────────────────────────────────
  useEffect(() => {
    if (!loading && exam && endTimeRef.current) {
      const stateToSave = {
        answers,
        flagged: Array.from(flagged),
        currentIndex,
        endTime: endTimeRef.current
      };
      localStorage.setItem(storageKey, JSON.stringify(stateToSave));
    }
  }, [answers, flagged, currentIndex, loading, exam, storageKey]);

  // ─── 3. SUBMIT EXAM LOGIC ──────────────────────────────────────────────────
  const answersRef = useRef(answers);
  useEffect(() => { answersRef.current = answers; }, [answers]);
  useEffect(() => { isSubmittingRef.current = isSubmitting; }, [isSubmitting]);

  const submitExam = useCallback(async (autoReason) => {
    if (isSubmittingRef.current) return;
    setIsSubmitting(true);
    
    const formattedAnswers = Object.entries(answersRef.current).map(([idx, val]) => ({
      questionId: questions[Number(idx) - 1]._id,
      selectedAnswer: val
    }));

    try {
      const actualRemaining = Math.max(0, Math.floor((endTimeRef.current - Date.now()) / 1000));
      const calculatedTimeTaken = exam ? ((exam.duration || 30) * 60) - actualRemaining : 0;

      const res = await api.post('/attempts/submit', {
        attemptId,
        answers: formattedAnswers,
        timeTaken: calculatedTimeTaken,
        autoSubmitted: !!autoReason,
        submissionReason: autoReason || 'Student submitted'
      });

      // Exit fullscreen if active
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }

      window.removeEventListener('beforeunload', () => {});
      localStorage.removeItem(storageKey); 
      toast.success(autoReason || 'Exam submitted successfully!');
      navigate(`/student/results/${res.data.data._id}`);
    } catch (err) {
      toast.error('Failed to submit exam. Retrying...');
      setIsSubmitting(false);
    }
  }, [attemptId, navigate, questions, storageKey, exam]);

  // ─── 3.5 EXIT & SAVE LOGIC ─────────────────────────────────────────────
  const handleExitAndSave = async () => {
    try {
      if (endTimeRef.current) {
        const stateToSave = {
          answers: answersRef.current,
          flagged: Array.from(flagged),
          currentIndex,
          endTime: endTimeRef.current
        };
        localStorage.setItem(storageKey, JSON.stringify(stateToSave));
      }

      if (document.fullscreenElement) {
        await document.exitFullscreen().catch(() => {});
      }

      window.removeEventListener('beforeunload', () => {});
      toast.success('Exam exited successfully. Your progress has been saved.');
      navigate('/student/exams');
    } catch (err) {
      console.error('Error exiting exam:', err);
      navigate('/student/exams');
    }
  };

  // ─── 4. FULLSCREEN & INTEGRITY MONITORING ────────────────────────────────
  const requestFullscreenMode = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      }
      setIsFullscreen(true);
      setShowSecurityWarningModal(false);
    } catch (err) {
      toast.error('Fullscreen request was denied. Fullscreen is required for this secure exam.');
    }
  };

  const handleSecurityViolation = useCallback(async (type, message) => {
    if (isSubmittingRef.current || loading || !exam) return;

    violationsRef.current += 1;
    const currentWarn = violationsRef.current;
    setViolationsCount(currentWarn);
    setSecurityReason(message);
    setShowSecurityWarningModal(true);

    // Log violation to MongoDB backend
    try {
      await api.post('/violations', {
        examId: exam._id,
        attemptId,
        type,
        warningNumber: currentWarn,
        metadata: {
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent
        }
      });
    } catch (err) {
      console.error('Failed to log violation:', err);
    }

    if (currentWarn >= 3) {
      toast.error('🚨 Maximum security violations reached! Exam auto-submitting...', { duration: 6000 });
      submitExam('Exam automatically submitted due to repeated focus & security violations.');
    }
  }, [exam, attemptId, loading, submitExam]);

  useEffect(() => {
    if (loading || !exam || isSubmitting) return;

    // Detect Fullscreen exit
    const handleFullscreenChange = () => {
      const isFs = !!document.fullscreenElement;
      setIsFullscreen(isFs);
      if (!isFs && !isSubmittingRef.current) {
        handleSecurityViolation('fullscreen_exit', 'You exited fullscreen mode.');
      }
    };

    // Detect Visibility change (Tab switch)
    const handleVisibilityChange = () => {
      if (document.hidden && !isSubmittingRef.current) {
        handleSecurityViolation('tab_switch', 'You switched tabs or minimized the browser.');
      }
    };

    // Detect Window Blur (Focus loss / switching windows)
    const handleWindowBlur = () => {
      if (!isSubmittingRef.current) {
        handleSecurityViolation('window_blur', 'Browser focus was lost or another window was opened.');
      }
    };

    // Prevent copy, paste, cut, contextmenu, drag
    const preventDefaultSecurity = (e) => {
      e.preventDefault();
      toast.error('Security Restriction: Action disabled during examination.', { id: 'sec-toast' });
      handleSecurityViolation('copy_paste_attempt', 'Attempted copy/paste or context menu action.');
    };

    // Prevent key shortcuts (Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+U, Ctrl+P, F12)
    const handleKeyDown = (e) => {
      if (
        (e.ctrlKey || e.metaKey) && 
        ['c', 'v', 'x', 'u', 'p', 'a', 's'].includes(e.key.toLowerCase())
      ) {
        e.preventDefault();
        toast.error(`Shortcut Ctrl+${e.key.toUpperCase()} is disabled during the exam.`, { id: 'key-toast' });
      }
      if (e.key === 'F12') {
        e.preventDefault();
        toast.error('Developer tools access is disabled.', { id: 'f12-toast' });
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    document.addEventListener('contextmenu', preventDefaultSecurity);
    document.addEventListener('copy', preventDefaultSecurity);
    document.addEventListener('paste', preventDefaultSecurity);
    document.addEventListener('cut', preventDefaultSecurity);
    document.addEventListener('dragstart', preventDefaultSecurity);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      document.removeEventListener('contextmenu', preventDefaultSecurity);
      document.removeEventListener('copy', preventDefaultSecurity);
      document.removeEventListener('paste', preventDefaultSecurity);
      document.removeEventListener('cut', preventDefaultSecurity);
      document.removeEventListener('dragstart', preventDefaultSecurity);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [loading, exam, isSubmitting, handleSecurityViolation]);

  const handleAnswer = (val) => setAnswers(prev => ({ ...prev, [currentIndex]: val }));

  const toggleFlag = () => {
    setFlagged(prev => {
      const newSet = new Set(prev);
      if (newSet.has(currentIndex)) newSet.delete(currentIndex);
      else newSet.add(currentIndex);
      return newSet;
    });
  };

  const formatTime = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60);
    const s = Math.floor(totalSeconds % 60);
    return `${m}m ${s < 10 ? '0' : ''}${s}s`;
  };

  const formatQuestionText = (text) => {
    if (typeof text !== 'string') return '';
    return text
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
  };

  if (loading) return (
    <div className="flex flex-col h-screen items-center justify-center bg-cream dark:bg-gray-950">
      <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-6"></div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Preparing Secure Exam Environment...</h2>
      <p className="text-gray-500 animate-pulse">Configuring integrity monitoring & questions...</p>
    </div>
  );
  if (!exam || questions.length === 0) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-cream dark:bg-gray-950 p-6 text-center">
        <div className="bg-white dark:bg-gray-900 max-w-md w-full p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-2xl space-y-4">
          <div className="w-16 h-16 bg-amber-100 dark:bg-amber-950/50 text-amber-600 rounded-full flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Exam Not Found</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">The requested examination paper could not be loaded or contains no active questions.</p>
          <div className="flex gap-3 pt-4 justify-center">
            <button onClick={() => navigate('/student/exams')} className="btn btn-primary py-3 px-6 rounded-xl font-bold">
              Return to Exams
            </button>
            <button onClick={() => window.location.reload()} className="btn btn-outline py-3 px-6 rounded-xl font-bold">
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex - 1] || {};
  const qType = typeof currentQ.type === 'string' ? currentQ.type : 'mcq';
  const answeredCount = Object.keys(answers).length;
  const progressPercent = (answeredCount / questions.length) * 100;

  return (
    <div className="exam-fullscreen-container fixed inset-0 w-full h-full bg-cream dark:bg-gray-950 flex flex-col z-50 select-none overflow-hidden font-sans box-border">
      
      {/* ─── INITIAL FULLSCREEN ENTRY OVERLAY ─── */}
      {!isFullscreen && !showSecurityWarningModal && (
        <div className="fixed inset-0 bg-gray-950/90 backdrop-blur-md z-50 flex items-center justify-center p-6 text-center">
          <div className="bg-white dark:bg-gray-900 max-w-lg w-full p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-2xl space-y-6">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto">
              <Maximize className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">Secure Fullscreen Required</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">
                To maintain assessment integrity, this exam must be taken in Fullscreen Mode with tab switch monitoring enabled.
              </p>
            </div>
            <div className="bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs p-4 rounded-xl font-medium text-left space-y-1">
              <p>• Fullscreen mode will be requested immediately.</p>
              <p>• Tab switching or focus loss will record a security violation.</p>
              <p>• 3 security violations will trigger immediate auto-submission.</p>
            </div>
            <button
              onClick={requestFullscreenMode}
              className="w-full py-4 bg-primary hover:bg-primary-dark text-white font-extrabold rounded-2xl shadow-xl shadow-primary/30 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 text-base"
            >
              <Maximize className="w-5 h-5" /> Enter Fullscreen & Begin Exam
            </button>
          </div>
        </div>
      )}

      {/* ─── Sticky Header ─── */}
      <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 h-16 md:h-20 flex items-center justify-between px-6 shrink-0 shadow-sm">
        <div className="flex items-center gap-6 flex-1">
          <img src="/logo/qezmora-logo-horizontal.png" alt="Qezmora" className="h-8 hidden dark:hidden md:block" />
          <img src="/logo/qezmora-logo-inverted.png" alt="Qezmora" className="h-8 hidden dark:md:block" />
          <img src="/logo/qezmora-icon-light.png" alt="Qezmora Icon" className="h-8 md:hidden" />
          
          <div className="hidden sm:block border-l pl-6 border-gray-200 dark:border-gray-700">
            <h1 className="font-bold text-gray-900 dark:text-white truncate max-w-md text-lg">{exam.title}</h1>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="font-medium">{questions.length} Questions</span>
              <span>&bull;</span>
              <span className="font-semibold text-emerald-600">Auto-Graded</span>
              <span>&bull;</span>
              <span className="font-bold text-red-500 flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" /> Violations: {violationsCount}/3
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 md:gap-5">
          <Timer 
            endTime={endTimeRef.current} 
            onTimeUp={() => {
              if (!isSubmitting) {
                toast.error('Time is up! Auto-submitting the exam...');
                submitExam('Timer expired');
              }
            }}
            onTick={(timeLeft) => {
              setTimeTaken(((exam.duration || 30) * 60) - timeLeft);
              setRemainingSeconds(timeLeft);
            }}
          />

          <button
            type="button"
            onClick={() => setShowExitModal(true)}
            className="px-3 py-2 md:px-4 md:py-2.5 rounded-xl font-bold text-xs md:text-sm bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 transition-all flex items-center gap-2 group shadow-sm shrink-0"
          >
            <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span className="hidden sm:inline">Exit Exam</span>
          </button>

          <div className="flex items-center gap-3 pl-3 md:pl-5 border-l border-gray-200 dark:border-gray-700">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-bold text-gray-900 dark:text-white">{user?.name || 'Student'}</span>
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider">{user?.role || 'student'}</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-bold shadow-md">
              {user?.name?.charAt(0).toUpperCase() || 'S'}
            </div>
          </div>
        </div>
      </header>

      {/* ─── Progress Bar ─── */}
      <div className="h-1.5 bg-gray-200 dark:bg-gray-800 w-full shrink-0 z-10 relative">
        <div 
          className="h-full transition-all duration-500 ease-out bg-primary" 
          style={{ width: `${progressPercent}%` }}
        />
        <div className="absolute top-3 left-1/2 -translate-x-1/2 text-xs font-bold text-gray-500 bg-white dark:bg-gray-900 px-3 py-1 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm">
          Question {currentIndex} of {questions.length} &bull; {Math.round(progressPercent)}% Completed
        </div>
      </div>

      <div className="exam-body-row flex-1 min-h-0 flex flex-col lg:flex-row w-full overflow-hidden relative box-border">
        {/* ─── Main Exam Content Area ─── */}
        <main className="flex-1 min-w-0 h-full flex flex-col relative z-0 overflow-y-auto box-border">
          <div className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col">
            <div className="max-w-[900px] w-full mx-auto flex-1 flex flex-col">
              {/* Question Card */}
              <section className="flex-1 relative mt-4 md:mt-8" aria-labelledby="question-header">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="bg-white dark:bg-gray-900 p-8 md:p-12 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-800 mb-6 relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between mb-8">
                      <span className="text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-wider">
                        Question {currentIndex}
                      </span>
                      <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs font-bold text-gray-500 uppercase tracking-wider">
                        {qType.replace('-', ' ')}
                      </span>
                    </div>

                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-10 whitespace-pre-wrap leading-relaxed relative z-10">
                      {formatQuestionText(currentQ.question)}
                    </h2>

                    <div className="relative z-10 space-y-4">
                      {qType === 'mcq' && (
                        currentQ.options?.map((opt, i) => {
                          const isSelected = answers[currentIndex] === opt;
                          const inputId = `q${currentIndex}-opt${i}`;
                          return (
                            <label htmlFor={inputId} key={i} className={`flex items-center p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                              isSelected 
                                ? 'border-primary bg-primary/5 shadow-md shadow-primary/10 ring-4 ring-primary/10' 
                                : 'border-gray-100 dark:border-gray-800 hover:border-primary/30 hover:bg-cream dark:hover:bg-gray-800/50'
                            }`}>
                              <input 
                                type="radio" 
                                id={inputId}
                                name={`question-${currentIndex}`} 
                                value={opt} 
                                checked={isSelected}
                                onChange={() => handleAnswer(opt)}
                                className="sr-only"
                              />
                              <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${isSelected ? 'border-primary' : 'border-gray-300 dark:border-gray-600'}`} aria-hidden="true">
                                {isSelected && <div className="w-3.5 h-3.5 rounded-full bg-primary" />}
                              </div>
                              <span className={`ml-4 text-lg transition-colors ${isSelected ? 'text-primary font-bold' : 'text-gray-700 dark:text-gray-300 font-medium'}`}>
                                {opt}
                              </span>
                            </label>
                          );
                        })
                      )}

                      {qType === 'true-false' && (
                        <div className="flex gap-4">
                          {['True', 'False'].map((opt, i) => {
                            const isSelected = answers[currentIndex] === opt;
                            const inputId = `q${currentIndex}-tf${i}`;
                            return (
                              <label htmlFor={inputId} key={opt} className={`flex-1 flex items-center justify-center p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                                isSelected 
                                  ? 'border-primary bg-primary/5 shadow-md shadow-primary/10 ring-4 ring-primary/10' 
                                  : 'border-gray-100 dark:border-gray-800 hover:border-primary/30 hover:bg-cream'
                              }`}>
                                <input 
                                  type="radio" 
                                  id={inputId}
                                  name={`question-${currentIndex}`} 
                                  value={opt} 
                                  checked={isSelected}
                                  onChange={() => handleAnswer(opt)}
                                  className="sr-only"
                                />
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${isSelected ? 'border-primary' : 'border-gray-300 dark:border-gray-600'}`} aria-hidden="true">
                                  {isSelected && <div className="w-3 h-3 rounded-full bg-primary" />}
                                </div>
                                <span className={`ml-3 text-xl transition-colors ${isSelected ? 'text-primary font-bold' : 'text-gray-700 dark:text-gray-300 font-medium'}`}>{opt}</span>
                              </label>
                            );
                          })}
                        </div>
                      )}

                      {(currentQ.type === 'fill-blank' || currentQ.type === 'short-answer') && (
                        <>
                          <label htmlFor={`q${currentIndex}-text`} className="sr-only">Type your answer</label>
                          <textarea
                            id={`q${currentIndex}-text`}
                            value={answers[currentIndex] || ''}
                            onChange={(e) => handleAnswer(e.target.value)}
                            placeholder="Type your exact answer here..."
                            className="w-full p-5 border-2 border-gray-100 dark:border-gray-800 rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/20 dark:bg-gray-950 resize-none h-40 text-lg shadow-inner transition-all bg-cream/50"
                          />
                        </>
                      )}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </section>
            </div>
          </div>

          {/* ─── Bottom Navigation Bar ─── */}
          <nav aria-label="Exam Navigation" className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-4 md:px-8 flex items-center justify-between shrink-0 shadow-sm z-10">
            <div className="flex gap-3 max-w-[900px] w-full mx-auto">
              <button
                type="button"
                onClick={() => setCurrentIndex(prev => Math.max(1, prev - 1))}
                disabled={currentIndex === 1}
                className="btn btn-secondary bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-200 flex-1 md:flex-none justify-center rounded-2xl py-3.5 h-auto text-base font-bold shadow-sm"
              >
                <ChevronLeft className="w-5 h-5" aria-hidden="true" /> <span className="hidden sm:inline">Previous</span>
              </button>
              
              <button
                type="button"
                onClick={toggleFlag}
                className={`btn gap-2 transition-all border-2 flex-1 md:flex-none justify-center rounded-2xl py-3.5 h-auto text-base font-bold shadow-sm ${
                  flagged.has(currentIndex) 
                    ? 'bg-warning/10 text-warning border-warning' 
                    : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-warning/50'
                }`}
              >
                <Flag className={`w-5 h-5 ${flagged.has(currentIndex) ? 'fill-warning' : ''}`} aria-hidden="true" /> 
                <span className="hidden lg:inline">{flagged.has(currentIndex) ? 'Flagged' : 'Flag for Review'}</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentIndex(prev => Math.min(questions.length, prev + 1))}
                disabled={currentIndex === questions.length}
                className="btn btn-primary gap-2 flex-1 justify-center rounded-2xl py-3.5 h-auto text-base font-bold shadow-lg shadow-primary/20"
              >
                Next <ChevronRight className="w-5 h-5" aria-hidden="true" />
              </button>

              <button
                onClick={() => setShowSubmitModal(true)}
                className="btn bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 gap-2 flex-1 md:flex-none justify-center rounded-2xl py-3.5 h-auto text-base font-bold shadow-lg"
              >
                <Send className="w-5 h-5" /> <span className="hidden sm:inline">Submit</span>
              </button>
            </div>
          </nav>
        </main>

        {/* ─── Mobile Palette Toggle ─── */}
        <button 
          onClick={() => setIsPaletteOpen(true)}
          className="lg:hidden fixed bottom-24 right-4 w-14 h-14 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center z-40 hover:scale-105 transition-transform"
        >
          <ListChecks className="w-6 h-6" />
        </button>

        {/* ─── Question Palette Sidebar ─── */}
        {isDesktop ? (
          <aside className="exam-palette-sidebar w-[300px] xl:w-[320px] shrink-0 h-full bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 p-5 flex flex-col z-20 overflow-y-auto box-border">
            <QuestionPalette 
              total={questions.length}
              answers={answers}
              flagged={flagged}
              current={currentIndex}
              onSelect={(idx) => setCurrentIndex(idx)}
            />
          </aside>
        ) : (
          <AnimatePresence>
            {isPaletteOpen && (
              <>
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40"
                  onClick={() => setIsPaletteOpen(false)}
                />
                
                <motion.aside 
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="fixed bottom-0 left-0 right-0 w-full bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-5 flex flex-col shrink-0 shadow-2xl z-50 max-h-[80vh] rounded-t-3xl box-border"
                >
                  <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-4" />
                  
                  <QuestionPalette 
                    total={questions.length}
                    answers={answers}
                    flagged={flagged}
                    current={currentIndex}
                    onSelect={(idx) => {
                      setCurrentIndex(idx);
                      setIsPaletteOpen(false);
                    }}
                  />
                </motion.aside>
              </>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* ─── SECURITY WARNING BLOCKING MODAL ─── */}
      <Modal isOpen={showSecurityWarningModal} onClose={() => {}} title="⚠ Exam Security Warning">
        <div className="p-6 text-center space-y-6">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-950/60 text-red-600 rounded-full flex items-center justify-center mx-auto">
            <ShieldAlert className="w-10 h-10" />
          </div>

          <div>
            <h3 className="text-xl font-black text-gray-900 dark:text-white">Exam Focus Lost</h3>
            <p className="text-sm font-semibold text-red-600 dark:text-red-400 mt-1">
              {securityReason || 'Focus change or fullscreen exit detected.'}
            </p>
          </div>

          <div className="bg-cream dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Security Violation Count</p>
            <p className="text-2xl font-black text-red-600 mt-1">
              Violation {violationsCount} of 3
            </p>
            {violationsCount >= 3 ? (
              <p className="text-xs text-red-500 font-bold mt-1">Auto-submitting exam now...</p>
            ) : (
              <p className="text-xs text-gray-500 mt-1">3 violations will result in automatic submission.</p>
            )}
          </div>

          {violationsCount < 3 && (
            <div className="flex gap-3 justify-center">
              <button
                onClick={requestFullscreenMode}
                className="w-full py-3.5 bg-primary hover:bg-primary-dark text-white rounded-xl font-extrabold shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
              >
                <Maximize className="w-4 h-4" /> Return to Fullscreen & Resume Exam
              </button>
            </div>
          )}
        </div>
      </Modal>

      {/* ─── Submit Confirmation Modal ─── */}
      <Modal isOpen={showSubmitModal} onClose={() => setShowSubmitModal(false)} title="Submit Examination">
        <div className="p-6 space-y-6">
          <div className="bg-cream dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 space-y-4">
            <div className="flex justify-between items-center text-gray-700 dark:text-gray-300">
              <span className="flex items-center gap-2 font-medium"><ListChecks className="w-5 h-5 text-emerald-600" /> Answered Questions</span>
              <span className="font-bold text-lg text-gray-900 dark:text-white">{answeredCount}</span>
            </div>
            <div className="flex justify-between items-center text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700 pt-4">
              <span className="flex items-center gap-2 font-medium"><AlertTriangle className="w-5 h-5 text-amber-500" /> Unanswered</span>
              <span className="font-bold text-lg text-gray-900 dark:text-white">{questions.length - answeredCount}</span>
            </div>
            <div className="flex justify-between items-center text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700 pt-4">
              <span className="flex items-center gap-2 font-medium"><Clock className="w-5 h-5 text-primary" /> Remaining Time</span>
              <span className="font-bold text-lg text-gray-900 dark:text-white">{formatTime(remainingSeconds)}</span>
            </div>
          </div>
          
          {questions.length - answeredCount > 0 && (
            <p className="text-amber-700 dark:text-amber-300 bg-amber-500/10 p-4 rounded-xl font-medium border border-amber-500/20 text-sm">
              ⚠️ You have {questions.length - answeredCount} unanswered questions. Are you sure you want to submit?
            </p>
          )}

          <div className="flex gap-4 justify-end">
            <button 
              onClick={() => setShowSubmitModal(false)} 
              className="btn btn-outline"
            >
              Back to Exam
            </button>
            <button 
              onClick={() => submitExam('Student submitted')} 
              disabled={isSubmitting}
              className="btn btn-primary gap-2"
            >
              {isSubmitting ? 'Submitting...' : 'Confirm Submit'}
            </button>
          </div>
        </div>
      </Modal>

      {/* ─── Exit Exam Confirmation Modal ─── */}
      <Modal isOpen={showExitModal} onClose={() => setShowExitModal(false)} title="Exit Examination">
        <div className="p-6 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-red-100 dark:bg-red-950/60 text-red-600 rounded-full flex items-center justify-center mx-auto mb-2">
              <LogOut className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">Exit & Save Progress?</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              You are about to leave the exam environment. Your current answers and remaining time will be saved, allowing you to resume later.
            </p>
          </div>

          <div className="bg-cream dark:bg-gray-800/60 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 space-y-3">
            <div className="flex justify-between items-center text-sm text-gray-700 dark:text-gray-300">
              <span className="flex items-center gap-2 font-medium"><Clock className="w-4 h-4 text-primary" /> Remaining Time</span>
              <span className="font-bold text-gray-900 dark:text-white">{formatTime(remainingSeconds)}</span>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-700 dark:text-gray-300 border-t border-gray-200/60 dark:border-gray-700/60 pt-3">
              <span className="flex items-center gap-2 font-medium"><ListChecks className="w-4 h-4 text-emerald-600" /> Answered Questions</span>
              <span className="font-bold text-gray-900 dark:text-white">{answeredCount} / {questions.length}</span>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-700 dark:text-gray-300 border-t border-gray-200/60 dark:border-gray-700/60 pt-3">
              <span className="flex items-center gap-2 font-medium"><Flag className="w-4 h-4 text-amber-500" /> Flagged for Review</span>
              <span className="font-bold text-gray-900 dark:text-white">{flagged.size}</span>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <button 
              type="button"
              onClick={() => setShowExitModal(false)} 
              className="btn btn-outline flex-1 py-3"
            >
              Continue Exam
            </button>
            <button 
              type="button"
              onClick={handleExitAndSave} 
              className="btn bg-red-600 hover:bg-red-700 text-white flex-1 py-3 font-bold gap-2 shadow-lg shadow-red-600/20"
            >
              <LogOut className="w-4 h-4" /> Exit & Save
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ExamPage;
