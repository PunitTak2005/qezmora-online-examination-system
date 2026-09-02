import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { History, Search, Filter, ChevronLeft, ChevronRight, CheckCircle, XCircle, Clock, Calendar } from 'lucide-react';
import api from '../../api/axios';
import PageTransition from '../../components/PageTransition';
import LoadingSkeleton from '../../components/LoadingSkeleton';

const AttemptHistoryPage = () => {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Filters
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [sort, setSort] = useState('-submittedAt');

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await api.get('/attempts/my-attempts', {
        params: { page, limit: 12, search, status, sort }
      });
      setAttempts(res.data.data);
      setTotalPages(res.data.pages || 1);
    } catch (err) {
      toast.error('Failed to load exam history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Debounce search
    const delayDebounceFn = setTimeout(() => {
      fetchHistory();
    }, 400);
    return () => clearTimeout(delayDebounceFn);
  }, [page, search, status, sort]);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3 text-gray-900 dark:text-white">
              <History className="w-8 h-8 text-primary" />
              Exam History
            </h1>
            <p className="text-gray-500 mt-1">Review your past performances and detailed results.</p>
          </div>
          <div className="flex items-center gap-3 bg-white dark:bg-gray-800 p-2 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
             <Search className="w-5 h-5 text-gray-400 ml-2" />
             <input 
               type="text" 
               placeholder="Search exams..." 
               value={search}
               onChange={(e) => { setSearch(e.target.value); setPage(1); }}
               className="bg-transparent border-none outline-none focus:ring-0 text-sm w-48 dark:text-white"
             />
          </div>
        </header>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <select 
            value={status} 
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="input-base w-40"
          >
            <option value="">All Statuses</option>
            <option value="passed">Passed</option>
            <option value="failed">Failed</option>
          </select>
          <select 
            value={sort} 
            onChange={(e) => { setSort(e.target.value); setPage(1); }}
            className="input-base w-48"
          >
            <option value="-submittedAt">Newest First</option>
            <option value="submittedAt">Oldest First</option>
            <option value="-score">Highest Score</option>
            <option value="score">Lowest Score</option>
          </select>
        </div>

        {/* History Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"><LoadingSkeleton /><LoadingSkeleton /><LoadingSkeleton /></div>
        ) : attempts.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No History Found</h3>
            <p className="text-gray-500 mb-6">You haven't completed any exams yet or no records match your search.</p>
            <Link to="/student/exams" className="btn btn-primary">Browse Available Exams</Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {attempts.map((attempt) => (
              <div key={attempt._id} className="card p-6 flex flex-col hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wider">
                    {attempt.exam?.subject || 'General'}
                  </span>
                  {attempt.passed ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-success bg-success/10 px-2 py-1 rounded-full"><CheckCircle className="w-3 h-3"/> Passed</span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-bold text-danger bg-danger/10 px-2 py-1 rounded-full"><XCircle className="w-3 h-3"/> Failed</span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2 mb-2 flex-1">
                  {attempt.exam?.title || 'Deleted Exam'}
                </h3>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    {formatDate(attempt.submittedAt)}
                  </div>
                  <div className="flex justify-between items-center bg-cream dark:bg-gray-800 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Score</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">{attempt.score} <span className="text-sm text-gray-500 font-normal">/ {attempt.totalMarks}</span></p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 font-medium">Accuracy</p>
                      <p className={`text-lg font-bold ${attempt.percentage >= 80 ? 'text-success' : attempt.percentage >= 50 ? 'text-warning' : 'text-danger'}`}>
                        {attempt.percentage.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>

                <Link to={`/student/results/${attempt._id}`} className="btn btn-outline w-full justify-center">
                  Review Attempt
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 pt-8">
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))} 
              disabled={page === 1}
              className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-50 hover:bg-cream dark:hover:bg-gray-800"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm font-medium">Page {page} of {totalPages}</span>
            <button 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
              disabled={page === totalPages}
              className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-50 hover:bg-cream dark:hover:bg-gray-800"
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
