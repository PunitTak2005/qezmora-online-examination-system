import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { History, Search, Filter, ChevronLeft, ChevronRight, CheckCircle, XCircle, Clock, Calendar, HelpCircle, Award, ArrowRight, Sparkles, RefreshCcw } from 'lucide-react';
import api from '../../api/axios';
import PageTransition from '../../components/PageTransition';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import { motion, AnimatePresence } from 'framer-motion';

const categoryBadgeConfig = {
  programming:         'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20',
  mathematics:         'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20',
  science:             'bg-green-500/10 text-green-700 dark:text-green-300 border-green-500/20',
  aptitude:            'bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-500/20',
  english:             'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20',
  advanced:            'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20',
  'general knowledge': 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20'
};

const getCategoryBadgeClass = (subject) => {
  if (!subject) return 'bg-gray-100 text-gray-700 border-gray-200';
  const key = subject.toLowerCase().trim();
  return categoryBadgeConfig[key] || 'bg-primary/10 text-primary border-primary/20';
};

const getScorePerformanceLabel = (pct) => {
  if (pct >= 90) return { label: 'Excellent Performance', color: 'text-emerald-600 dark:text-emerald-400' };
  if (pct >= 75) return { label: 'Good Performance', color: 'text-emerald-500' };
  if (pct >= 60) return { label: 'Average Performance', color: 'text-amber-500' };
  return { label: 'Needs Improvement', color: 'text-rose-500' };
};

const AttemptHistoryPage = () => {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalAttempts, setTotalAttempts] = useState(0);
  
  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // All, Passed, Failed
  const [sort, setSort] = useState('-submittedAt'); // -submittedAt, -score

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const statusParam = statusFilter === 'Passed' ? 'passed' : statusFilter === 'Failed' ? 'failed' : '';
      const res = await api.get('/attempts/my-attempts', {
        params: { page, limit: 12, search, status: statusParam, sort }
      });
      setAttempts(res.data.data || []);
      setTotalPages(res.data.pages || 1);
      setTotalAttempts(res.data.total || (res.data.data ? res.data.data.length : 0));
    } catch (err) {
      toast.error('Failed to load exam history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchHistory();
    }, 350);
    return () => clearTimeout(delayDebounceFn);
  }, [page, search, statusFilter, sort]);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  const formatDuration = (seconds) => {
    if (!seconds) return 'N/A';
    const mins = Math.floor(seconds / 60);
    return `${mins} min taken`;
  };

  return (
    <PageTransition>
      <div className="space-y-8 max-w-7xl mx-auto pb-16">
        
        {/* ─── Header Section ─── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#162032] p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl relative overflow-hidden">
          <div className="space-y-1 z-10">
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
              <History className="w-8 h-8 text-primary" /> Exam History
            </h1>
            <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">
              Review your past performances, detailed answer sheets, and score breakdowns.
            </p>
          </div>
          
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full font-extrabold text-sm z-10 w-fit">
            <Sparkles className="w-4 h-4" /> {totalAttempts} Total Attempts
          </div>
        </div>

        {/* ─── Filter & Search Bar ─── */}
        <div className="bg-white dark:bg-[#162032] p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* Search Input */}
          <div className="w-full md:w-80 relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              placeholder="Search history by title..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="block w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-700/80 rounded-xl bg-cream/50 dark:bg-gray-900 text-gray-900 dark:text-white text-xs font-medium focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          {/* Status Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto scrollbar-none">
            {['All', 'Passed', 'Failed'].map(st => (
              <button
                key={st}
                onClick={() => { setStatusFilter(st); setPage(1); }}
                className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all shrink-0 ${
                  statusFilter === st
                    ? 'bg-primary text-white shadow-md shadow-primary/25 scale-105'
                    : 'bg-cream/50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-gray-800 hover:bg-primary/10 hover:text-primary'
                }`}
              >
                {st}
              </button>
            ))}

            <button
              onClick={() => { setSort(s => s === '-submittedAt' ? '-score' : '-submittedAt'); setPage(1); }}
              className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all shrink-0 border ${
                sort === '-score'
                  ? 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/25'
                  : 'bg-cream/50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-100 dark:border-gray-800 hover:bg-amber-500/10 hover:text-amber-600'
              }`}
            >
              {sort === '-score' ? '🏆 Highest Score' : '🕒 Newest First'}
            </button>
          </div>
        </div>

        {/* ─── 3-Column SaaS Grid View ─── */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="p-4 bg-white dark:bg-[#162032] rounded-2xl h-96">
                <LoadingSkeleton />
              </div>
            ))}
          </div>
        ) : attempts.length > 0 ? (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {attempts.map((attempt, idx) => {
                const subjectName = attempt.exam?.subject || (attempt.exam?.category && typeof attempt.exam.category === 'object' ? attempt.exam.category.name : attempt.exam?.category) || 'General';
                const categoryBadge = getCategoryBadgeClass(subjectName);
                const scoreInfo = getScorePerformanceLabel(attempt.percentage || 0);

                return (
                  <motion.div
                    key={attempt._id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04, duration: 0.25 }}
                    whileHover={{ y: -4, transition: { duration: 0.18 } }}
                    className="bg-white dark:bg-[#162032] rounded-2xl p-6 border border-gray-100 dark:border-gray-800/80 shadow-sm hover:shadow-xl hover:border-primary/40 transition-all duration-300 flex flex-col h-full group relative overflow-hidden"
                  >
                    {/* ─── Top Badges Row ─── */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-extrabold tracking-wide border ${categoryBadge}`}>
                        {subjectName}
                      </span>

                      {attempt.passed ? (
                        <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                          <CheckCircle className="w-3.5 h-3.5" /> Passed
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20">
                          <XCircle className="w-3.5 h-3.5" /> Failed
                        </span>
                      )}
                    </div>

                    {/* ─── Full Exam Title (No Clipping) ─── */}
                    <div className="min-h-[56px] flex items-start mb-3">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight break-words whitespace-normal group-hover:text-primary transition-colors">
                        {attempt.exam?.title || 'Assessment Attempt'}
                      </h3>
                    </div>

                    {/* ─── Prominent Score Highlight ─── */}
                    <div className="mb-5 p-4 rounded-xl bg-slate-50 dark:bg-gray-900/60 border border-gray-100 dark:border-gray-800 flex items-center justify-between">
                      <div>
                        <div className={`text-4xl font-black tracking-tight ${scoreInfo.color}`}>
                          {attempt.percentage ? attempt.percentage.toFixed(0) : 0}%
                        </div>
                        <div className="text-xs font-bold text-gray-500 dark:text-gray-400 mt-0.5">
                          {scoreInfo.label}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-gray-400 font-medium block">Raw Score</span>
                        <span className="text-lg font-extrabold text-gray-900 dark:text-white">
                          {attempt.score} <span className="text-xs text-gray-400 font-normal">/ {attempt.totalMarks}</span>
                        </span>
                      </div>
                    </div>

                    {/* ─── Metadata Chips Row ─── */}
                    <div className="grid grid-cols-3 gap-2 mb-5">
                      <div className="bg-slate-100 dark:bg-slate-800/60 p-2.5 rounded-xl flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                        <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>{attempt.exam?.duration || 60} min</span>
                      </div>

                      <div className="bg-blue-500/10 p-2.5 rounded-xl flex items-center justify-center gap-1.5 text-xs font-semibold text-blue-700 dark:text-blue-300">
                        <HelpCircle className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        <span>{attempt.answers ? attempt.answers.length : (attempt.exam?.questionCount || 20)} Qs</span>
                      </div>

                      <div className="bg-amber-500/10 p-2.5 rounded-xl flex items-center justify-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400">
                        <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>{attempt.totalMarks || 100} Marks</span>
                      </div>
                    </div>

                    {/* ─── Submission Timestamp & Time Taken ─── */}
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-6 pt-3 border-t border-gray-100 dark:border-gray-800/80">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        <span>{formatDate(attempt.submittedAt)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        <span>{formatDuration(attempt.timeTaken)}</span>
                      </div>
                    </div>

                    {/* ─── Pinned Action Button ─── */}
                    <Link
                      to={`/student/results/${attempt._id}`}
                      className="btn bg-primary hover:bg-primary-dark text-white w-full py-3.5 rounded-xl font-bold transition-all shadow-md shadow-primary/20 gap-2 mt-auto group/btn"
                    >
                      View Result <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        ) : (
          /* ─── Empty State ─── */
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 bg-white dark:bg-[#162032] rounded-3xl border border-dashed border-gray-200 dark:border-gray-800 shadow-sm p-8"
          >
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <History className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Exam History Yet</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md mx-auto mb-6">
              Complete your first assessment to view your results, accuracy metrics, and score history.
            </p>
            <Link 
              to="/student/exams"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition shadow-lg shadow-primary/20"
            >
              Browse Available Exams
            </Link>
          </motion.div>
        )}

        {/* ─── Pagination ─── */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 pt-6">
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))} 
              disabled={page === 1}
              className="p-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
              Page {page} of {totalPages}
            </span>
            <button 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
              disabled={page === totalPages}
              className="p-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 transition"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default AttemptHistoryPage;
