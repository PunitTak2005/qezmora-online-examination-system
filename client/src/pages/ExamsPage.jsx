import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { Search, Clock, FileText, Award, Filter, BookOpen, Calculator, FlaskConical, Languages, Lightbulb, Globe, Calendar, RefreshCcw, ChevronRight, ChevronLeft, Users, CheckCircle2 } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import Logo from '../components/common/Logo';
import ExamCard from '../components/ExamCard';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const AnimatedCounter = ({ target, suffix = '', duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const targetVal = Number(target) || 0;
    const step = Math.ceil(targetVal / (duration / 16)) || 1;
    const timer = setInterval(() => {
      start += step;
      if (start >= targetVal) {
        setCount(targetVal);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, target, duration]);

  return <span ref={ref}>{(count || 0).toLocaleString()}{suffix}</span>;
};

const ExamsPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [exams, setExams] = useState([]);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalQuestions: 0,
    successRate: 88
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [durationFilter, setDurationFilter] = useState('Any');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const examsPerPage = 6;

  useEffect(() => {
    const fetchExamsAndStats = async () => {
      try {
        setLoading(true);
        setError(null);

        // Primary endpoint `/exams` (or `/exams/all` fallback)
        let examRes;
        try {
          examRes = await api.get('/exams');
        } catch (e) {
          examRes = await api.get('/exams/all');
        }

        const examData = examRes.data?.data || examRes.data || [];
        if (Array.isArray(examData)) {
          setExams(examData);
        }

        // Fetch live system-wide telemetry stats
        try {
          const statsRes = await api.get('/users/dashboard-stats');
          const s = statsRes.data?.data || {};
          setStats({
            totalStudents: s.students || s.totalUsers || 0,
            totalQuestions: s.questions || 0,
            successRate: s.passRate ? Number(s.passRate) : 88
          });
        } catch (sErr) {
          console.warn('Dashboard stats fallback:', sErr);
        }
      } catch (err) {
        console.error('Error fetching exams from API:', err);
        setError('Failed to load exams from server.');
      } finally {
        setLoading(false);
      }
    };
    fetchExamsAndStats();
  }, []);

  const handleStartExam = (examId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate(`/student/exams/${examId}`);
  };

  const categories = ['All', 'Programming', 'Mathematics', 'Science', 'English', 'Aptitude', 'General Knowledge', 'Advanced'];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  // Flexible Filter matching logic
  const filteredExams = exams.filter(exam => {
    const title = exam.title || '';
    const subject = exam.subject || (exam.category && typeof exam.category === 'object' ? exam.category.name : exam.category) || '';
    
    // Search Term Match
    const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Category Filter Match (handles substring or exact category name)
    let matchesCat = categoryFilter === 'All';
    if (!matchesCat) {
      const catFilterLower = categoryFilter.toLowerCase();
      const subjectLower = subject.toLowerCase();
      matchesCat = subjectLower.includes(catFilterLower) || catFilterLower.includes(subjectLower);
    }
    
    // Difficulty Filter Match
    let matchesDiff = difficultyFilter === 'All';
    if (!matchesDiff && exam.difficulty) {
      const diff = exam.difficulty.toLowerCase();
      const filter = difficultyFilter.toLowerCase();
      if (filter === 'beginner' && (diff === 'beginner' || diff === 'easy')) matchesDiff = true;
      else if (filter === 'intermediate' && (diff === 'intermediate' || diff === 'medium')) matchesDiff = true;
      else if (filter === 'advanced' && (diff === 'advanced' || diff === 'hard')) matchesDiff = true;
      else if (diff === filter) matchesDiff = true;
    }

    // Duration Filter Match
    let matchesDur = true;
    if (durationFilter === '< 30 Mins') matchesDur = exam.duration < 30;
    else if (durationFilter === '30 - 60 Mins') matchesDur = exam.duration >= 30 && exam.duration <= 60;
    else if (durationFilter === '> 60 Mins') matchesDur = exam.duration > 60;

    return matchesSearch && matchesCat && matchesDiff && matchesDur;
  });

  // Dynamic Telemetry Calculations
  const totalAvailableExams = exams.length;
  const calculatedQuestions = exams.reduce((acc, curr) => acc + (curr.questionCount || curr.totalMarks || 0), 0);
  const displayTotalQuestions = stats.totalQuestions > 0 ? stats.totalQuestions : calculatedQuestions;

  // Pagination logic
  const totalPages = Math.ceil(filteredExams.length / examsPerPage);
  const currentExams = filteredExams.slice((currentPage - 1) * examsPerPage, currentPage * examsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  return (
    <PageTransition>
      <div className="bg-cream dark:bg-darkBg min-h-screen pb-24 font-sans text-gray-900 dark:text-gray-50">
        
        {/* Phase 3 - Hero Banner */}
        <section className="bg-gradient-primary pt-24 pb-16 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-20"></div>
          
          <div className="max-w-7xl mx-auto text-center relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center mb-6">
              <Logo variant="inverted" className="h-12" />
            </motion.div>
            
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-5xl font-black text-white mb-4">
              Smart Exams. Simplified.
            </motion.h1>
            
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-white/80 text-lg max-w-3xl mx-auto mb-10 leading-relaxed">
              Browse available assessments, practice quizzes, and certification exams designed for students, colleges, coaching institutes, and companies.
            </motion.p>
            
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search exams by title or subject..."
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  className="w-full pl-14 pr-6 py-4 rounded-xl text-lg shadow-xl focus:ring-4 focus:ring-gold/50 outline-none dark:bg-gray-900 border-none text-gray-900 dark:text-white"
                />
                <Search className="w-6 h-6 text-gray-400 absolute left-5 top-1/2 -translate-y-1/2" />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Phase 7 - Quick Statistics (Live Database Telemetry) */}
        <section className="max-w-7xl mx-auto px-4 -mt-8 relative z-20 mb-16">
          <div className="bg-white dark:bg-darkSurface rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 p-8 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-gray-100 dark:divide-gray-800">
            <div className="text-center px-4">
              <div className="w-12 h-12 mx-auto bg-gold/10 text-gold rounded-full flex items-center justify-center mb-4"><BookOpen className="w-6 h-6" /></div>
              <h4 className="text-3xl font-black text-primary dark:text-success mb-1">
                <AnimatedCounter target={totalAvailableExams} />
              </h4>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Available Exams</p>
            </div>
            <div className="text-center px-4">
              <div className="w-12 h-12 mx-auto bg-gold/10 text-gold rounded-full flex items-center justify-center mb-4"><FileText className="w-6 h-6" /></div>
              <h4 className="text-3xl font-black text-primary dark:text-success mb-1">
                <AnimatedCounter target={displayTotalQuestions} suffix="+" />
              </h4>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Questions</p>
            </div>
            <div className="text-center px-4">
              <div className="w-12 h-12 mx-auto bg-gold/10 text-gold rounded-full flex items-center justify-center mb-4"><Users className="w-6 h-6" /></div>
              <h4 className="text-3xl font-black text-primary dark:text-success mb-1">
                <AnimatedCounter target={stats.totalStudents || 12} suffix="+" />
              </h4>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Students Enrolled</p>
            </div>
            <div className="text-center px-4">
              <div className="w-12 h-12 mx-auto bg-gold/10 text-gold rounded-full flex items-center justify-center mb-4"><CheckCircle2 className="w-6 h-6" /></div>
              <h4 className="text-3xl font-black text-primary dark:text-success mb-1">
                <AnimatedCounter target={stats.successRate} suffix="%" />
              </h4>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Success Rate</p>
            </div>
          </div>
        </section>

        {/* Main Content Area */}
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-4 gap-8">
          
          {/* Phase 4 - Search and Filters */}
          <aside className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-darkSurface p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm sticky top-28">
              
              <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white flex items-center gap-2"><Filter className="w-5 h-5 text-primary" /> Categories</h3>
              <div className="flex flex-wrap gap-2 mb-8">
                {categories.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => { setCategoryFilter(cat); setCurrentPage(1); }}
                    className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${categoryFilter === cat ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-primary/10'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Difficulty</h3>
              <div className="space-y-3 mb-8">
                {difficulties.map(diff => (
                  <label key={diff} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="difficulty" 
                      checked={difficultyFilter === diff}
                      onChange={() => { setDifficultyFilter(diff); setCurrentPage(1); }}
                      className="w-4 h-4 text-primary focus:ring-primary dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                    />
                    <span className={`font-medium transition-colors ${difficultyFilter === diff ? 'text-primary dark:text-primary' : 'text-gray-600 dark:text-gray-400 group-hover:text-primary'}`}>{diff}</span>
                  </label>
                ))}
              </div>
              
              <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Duration</h3>
              <div className="space-y-3">
                {['Any', '< 30 Mins', '30 - 60 Mins', '> 60 Mins'].map(dur => (
                  <label key={dur} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="duration" 
                      checked={durationFilter === dur}
                      onChange={() => { setDurationFilter(dur); setCurrentPage(1); }}
                      className="w-4 h-4 text-primary focus:ring-primary dark:bg-gray-800 border-gray-300 dark:border-gray-700" 
                    />
                    <span className={`font-medium transition-colors ${durationFilter === dur ? 'text-primary dark:text-primary' : 'text-gray-600 dark:text-gray-400 group-hover:text-primary'}`}>{dur}</span>
                  </label>
                ))}
              </div>

            </div>
          </aside>

          {/* Phase 5 & 6 - Exam Cards */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">Available Assessments</h2>
              <span className="text-gray-500 font-bold">{filteredExams.length} results</span>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="bg-white dark:bg-darkSurface h-80 rounded-2xl animate-pulse"></div>
                ))}
              </div>
            ) : currentExams.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
                  {currentExams.map((exam, idx) => (
                    <ExamCard key={exam._id || idx} exam={exam} role="student" delay={idx * 0.04} />
                  ))}
                </div>

                {/* Phase 11 - Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2">
                    <button 
                      onClick={() => handlePageChange(currentPage - 1)} 
                      disabled={currentPage === 1}
                      className="p-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    
                    {[...Array(totalPages)].map((_, i) => (
                      <button 
                        key={i} 
                        onClick={() => handlePageChange(i + 1)}
                        className={`w-12 h-12 rounded-xl font-bold transition-colors ${currentPage === i + 1 ? 'bg-primary text-white shadow-md' : 'border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                      >
                        {i + 1}
                      </button>
                    ))}

                    <button 
                      onClick={() => handlePageChange(currentPage + 1)} 
                      disabled={currentPage === totalPages}
                      className="p-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              /* Empty State */
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24 bg-white dark:bg-darkSurface rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
                <div className="w-24 h-24 mx-auto bg-gray-100 dark:bg-gray-800 text-gray-400 rounded-full flex items-center justify-center mb-6">
                  <Search className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Exams Available</h3>
                <p className="text-gray-500 mb-8">Try adjusting your filters or search criteria.</p>
                <div className="flex justify-center gap-4">
                  <button onClick={() => { setSearchTerm(''); setCategoryFilter('All'); setDifficultyFilter('All'); setDurationFilter('Any'); }} className="btn btn-primary gap-2">
                    <RefreshCcw className="w-4 h-4" /> Reset Filters
                  </button>
                </div>
              </motion.div>
            )}
            
            {/* Phase 9 - Upcoming Exams */}
            <div className="mt-20">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6">Upcoming Live Exams</h2>
              <div className="bg-white dark:bg-darkSurface rounded-3xl border border-gray-100 dark:border-gray-800 p-6 md:p-8">
                <div className="space-y-6">
                  {[
                    { title: "National Scholarship Test 2024", date: "Oct 15, 2024", time: "10:00 AM EST" },
                    { title: "Advanced React Certification", date: "Oct 20, 2024", time: "02:00 PM EST" },
                    { title: "Full Stack Web Development Hackathon", date: "Nov 05, 2024", time: "09:00 AM EST" }
                  ].map((evt, idx) => (
                    <div key={idx} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl border border-gray-50 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 hover:border-primary/30 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white dark:bg-gray-900 rounded-xl flex items-center justify-center shadow-sm text-primary">
                          <Calendar className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 dark:text-white">{evt.title}</h4>
                          <p className="text-sm text-gray-500">{evt.date} • {evt.time}</p>
                        </div>
                      </div>
                      <button className="btn btn-outline text-sm py-2">Register Now</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default ExamsPage;
