import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import ExamCard from '../../components/ExamCard';
import PageTransition from '../../components/PageTransition';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import { Search, SlidersHorizontal, CalendarX, Sparkles, Filter, RefreshCcw } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = ['All', 'Programming', 'Mathematics', 'Science', 'Aptitude', 'English', 'Advanced'];

const ExamListPage = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [durationFilter, setDurationFilter] = useState('All');

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
    const title = exam.title || '';
    const subject = exam.subject || (exam.category && typeof exam.category === 'object' ? exam.category.name : exam.category) || '';

    const matchSearch = title.toLowerCase().includes(search.toLowerCase()) || subject.toLowerCase().includes(search.toLowerCase());
    
    let matchCategory = categoryFilter === 'All';
    if (!matchCategory) {
      const catLower = categoryFilter.toLowerCase();
      const subjectLower = subject.toLowerCase();
      matchCategory = subjectLower.includes(catLower) || catLower.includes(subjectLower);
    }

    const matchDifficulty = difficultyFilter === 'All' ? true : exam.difficulty?.toLowerCase() === difficultyFilter.toLowerCase();
    
    let matchDuration = true;
    if (durationFilter === '<30') matchDuration = exam.duration < 30;
    else if (durationFilter === '30-60') matchDuration = exam.duration >= 30 && exam.duration <= 60;
    else if (durationFilter === '>60') matchDuration = exam.duration > 60;

    return matchSearch && matchCategory && matchDifficulty && matchDuration;
  });

  const resetFilters = () => {
    setSearch('');
    setCategoryFilter('All');
    setDifficultyFilter('All');
    setDurationFilter('All');
  };

  return (
    <PageTransition>
      <div className="space-y-8 max-w-7xl mx-auto pb-16">
        
        {/* ─── Header Section ─── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#162032] p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl relative overflow-hidden">
          <div className="space-y-1 z-10">
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Available Assessments</h1>
            <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">
              Browse exams by category, difficulty, or duration.
            </p>
          </div>
          
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full font-extrabold text-sm z-10 w-fit">
            <Sparkles className="w-4 h-4" /> {filteredExams.length} Assessments Live
          </div>
        </div>

        {/* ─── Category Pills Filter Bar ─── */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 mr-2 flex items-center gap-1.5 shrink-0">
            <Filter className="w-3.5 h-3.5 text-primary" /> Category:
          </span>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all duration-200 shrink-0 ${
                categoryFilter === cat
                  ? 'bg-primary text-white shadow-md shadow-primary/25 scale-105'
                  : 'bg-white dark:bg-[#162032] text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-gray-800 hover:bg-primary/10 hover:text-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ─── Search & Secondary Dropdown Filters ─── */}
        <div className="bg-white dark:bg-[#162032] p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 w-full relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
              <Search className="h-5 w-5" />
            </div>
            <input
              type="text"
              placeholder="Search exams by title or topic..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-11 pr-4 py-3 border border-gray-200 dark:border-gray-700/80 rounded-xl bg-cream/50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm font-medium focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
          
          <div className="flex w-full md:w-auto gap-3 items-center">
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="w-full md:w-auto px-4 py-3 text-xs font-bold border border-gray-200 dark:border-gray-700/80 rounded-xl bg-cream/50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-primary transition-colors"
            >
              <option value="All">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>

            <select
              value={durationFilter}
              onChange={(e) => setDurationFilter(e.target.value)}
              className="w-full md:w-auto px-4 py-3 text-xs font-bold border border-gray-200 dark:border-gray-700/80 rounded-xl bg-cream/50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-primary transition-colors"
            >
              <option value="All">Any Duration</option>
              <option value="<30">Under 30 mins</option>
              <option value="30-60">30 - 60 mins</option>
              <option value=">60">Over 60 mins</option>
            </select>
          </div>
        </div>

        {/* ─── 3-Column SaaS Grid View ─── */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="p-4 bg-white dark:bg-[#162032] rounded-2xl h-80">
                <LoadingSkeleton />
              </div>
            ))}
          </div>
        ) : filteredExams.length > 0 ? (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {filteredExams.map((exam, idx) => (
                <ExamCard key={exam._id} exam={exam} role="student" delay={idx * 0.04} />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          /* Empty State */
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 bg-white dark:bg-[#162032] rounded-3xl border border-dashed border-gray-200 dark:border-gray-800 shadow-sm p-8"
          >
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <CalendarX className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Exams Found</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md mx-auto mb-6">
              Try changing your search terms or filter selections to view available assessments.
            </p>
            <button 
              onClick={resetFilters}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition shadow-lg shadow-primary/20"
            >
              <RefreshCcw className="w-4 h-4" /> Reset Filters
            </button>
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
};

export default ExamListPage;
