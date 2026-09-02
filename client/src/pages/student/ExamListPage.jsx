import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import ExamCard from '../../components/ExamCard';
import PageTransition from '../../components/PageTransition';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import { Search, SlidersHorizontal, CalendarX, Sparkles } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const ExamListPage = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ subject: 'All', difficulty: 'All', duration: 'All' });

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await api.get('/exams?status=published');
        setExams(res.data.data || []);
      } catch (err) {
        toast.error('Failed to load exams');
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, []);

  const filteredExams = exams.filter(exam => {
    const matchSearch = exam.title.toLowerCase().includes(search.toLowerCase()) || exam.subject.toLowerCase().includes(search.toLowerCase());
    const matchSubject = filters.subject === 'All' ? true : exam.subject === filters.subject;
    const matchDifficulty = filters.difficulty === 'All' ? true : exam.difficulty.toLowerCase() === filters.difficulty.toLowerCase();
    
    let matchDuration = true;
    if (filters.duration === '<30') matchDuration = exam.duration < 30;
    else if (filters.duration === '30-60') matchDuration = exam.duration >= 30 && exam.duration <= 60;
    else if (filters.duration === '>60') matchDuration = exam.duration > 60;

    return matchSearch && matchSubject && matchDifficulty && matchDuration;
  });

  const uniqueSubjects = ['All', ...new Set(exams.map(e => e.subject))];

  return (
    <PageTransition>
      <div className="space-y-8 max-w-[1400px] mx-auto pb-12">
        {/* ─── Header Section ─── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Available Examinations</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">Browse, filter, and take your scheduled assessments.</p>
          </div>
          {/* Subtle decoration */}
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full font-bold text-sm">
            <Sparkles className="w-4 h-4" /> {filteredExams.length} Available
          </div>
        </div>

        {/* ─── Modern Filter & Search Bar ─── */}
        <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col xl:flex-row gap-5">
          <div className="flex-1 relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
              <Search className="h-5 w-5" />
            </div>
            <input
              type="text"
              placeholder="Search exams by title or subject..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-11 pr-4 py-3.5 border-2 border-gray-100 dark:border-gray-800 rounded-xl bg-cream dark:bg-gray-950 text-gray-900 dark:text-white font-medium focus:ring-0 focus:border-primary transition-colors"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex items-center gap-2 text-gray-500 font-medium pl-2 hidden sm:flex">
              <SlidersHorizontal className="w-5 h-5" /> Filters:
            </div>
            
            <select
              value={filters.subject}
              onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
              className="w-full sm:w-auto px-4 py-3.5 font-medium border-2 border-gray-100 dark:border-gray-800 rounded-xl bg-cream dark:bg-gray-950 text-gray-900 dark:text-white focus:ring-0 focus:border-primary transition-colors"
            >
              {uniqueSubjects.map(sub => <option key={sub} value={sub}>{sub === 'All' ? 'All Subjects' : sub}</option>)}
            </select>

            <select
              value={filters.difficulty}
              onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
              className="w-full sm:w-auto px-4 py-3.5 font-medium border-2 border-gray-100 dark:border-gray-800 rounded-xl bg-cream dark:bg-gray-950 text-gray-900 dark:text-white focus:ring-0 focus:border-primary transition-colors"
            >
              <option value="All">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>

            <select
              value={filters.duration}
              onChange={(e) => setFilters({ ...filters, duration: e.target.value })}
              className="w-full sm:w-auto px-4 py-3.5 font-medium border-2 border-gray-100 dark:border-gray-800 rounded-xl bg-cream dark:bg-gray-950 text-gray-900 dark:text-white focus:ring-0 focus:border-primary transition-colors"
            >
              <option value="All">Any Duration</option>
              <option value="<30">Under 30 mins</option>
              <option value="30-60">30 - 60 mins</option>
              <option value=">60">Over 60 mins</option>
            </select>
          </div>
        </div>

        {/* ─── Grid View ─── */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="p-4 bg-white dark:bg-gray-900 rounded-2xl h-80">
                <LoadingSkeleton />
              </div>
            ))}
          </div>
        ) : filteredExams.length > 0 ? (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence>
              {filteredExams.map((exam, idx) => (
                <ExamCard key={exam._id} exam={exam} role="student" delay={idx * 0.05} />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm"
          >
            <div className="w-20 h-20 bg-cream dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <CalendarX className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Exams Found</h3>
            <p className="text-gray-500 text-lg max-w-md mx-auto">
              We couldn't find any exams matching your current filters. Try adjusting your search criteria or check back later.
            </p>
            <button 
              onClick={() => { setSearch(''); setFilters({ subject: 'All', difficulty: 'All', duration: 'All' }); }}
              className="mt-8 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl hover:opacity-90 transition"
            >
              Clear All Filters
            </button>
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
};

export default ExamListPage;
