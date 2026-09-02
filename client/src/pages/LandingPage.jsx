import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  Clock, Shield, BookOpen, BarChart2, Award,
  Users, FileText, TrendingUp, Star, ChevronRight, GraduationCap,
  Globe, Calendar, CheckSquare, Settings
} from 'lucide-react';
import PageTransition from '../components/PageTransition';
import BrowseCategories from '../components/BrowseCategories';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import useStats from '../hooks/useStats';

// ─── Animated Counter ─────────────────────────────────────────────────────────
const AnimatedCounter = ({ target, suffix = '', duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, target, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

// ─── Exam Card (Phase 8) ──────────────────────────────────────────────────

const PublicExamCard = ({ exam, delay }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleStart = () => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      navigate(`/student/exams/${exam._id}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -8, boxShadow: '0 25px 50px -12px rgba(15, 81, 50, 0.15)' }}
      className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden group flex flex-col border border-gray-100 dark:border-gray-700 shadow-lg relative"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-[100px] -z-10 group-hover:bg-primary/10 transition-colors" />
      <div className="p-8 flex-1 flex flex-col z-10">
        <div className="flex justify-between items-start mb-6">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
            <BookOpen className="w-6 h-6" />
          </div>
          <span className="px-3 py-1 bg-gold/20 text-gold-light dark:text-gold text-xs font-bold rounded-full uppercase tracking-wider border border-gold/30">
            Featured
          </span>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
          {exam.title}
        </h3>
        <p className="text-gray-500 text-sm mb-6 uppercase tracking-wider font-bold">{exam.subject}</p>
        
        <div className="space-y-3 mt-auto pt-6 border-t border-gray-100 dark:border-gray-700/50">
          <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
            <Clock className="w-5 h-5 text-gray-400" /> <span className="font-medium">{exam.duration} Minutes</span>
          </div>
          <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
            <FileText className="w-5 h-5 text-gray-400" /> <span className="font-medium">{exam.totalMarks || 'Dynamic'} Questions</span>
          </div>
          <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
            <Award className="w-5 h-5 text-gray-400" /> <span className="font-medium capitalize">{exam.difficulty} Difficulty</span>
          </div>
        </div>
      </div>
      <div className="p-6 bg-cream dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700">
        <button 
          onClick={handleStart}
          className="btn bg-gray-900 hover:bg-primary text-white w-full py-3.5 rounded-xl text-lg font-bold transition-colors group-hover:shadow-lg group-hover:shadow-primary/30"
        >
          Start Exam
        </button>
      </div>
    </motion.div>
  );
};
const LandingPage = () => {
  const [publicExams, setPublicExams] = useState([]);
  const [loadingExams, setLoadingExams] = useState(true);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { stats } = useStats();

  const handleStartExam = (examId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (examId) {
      navigate(`/student/exams/${examId}`);
    } else {
      navigate('/student/dashboard');
    }
  };

  useEffect(() => {
    const fetchPublicExams = async () => {
      try {
        const response = await api.get('/exams/public');
        setPublicExams(response.data.data);
      } catch (error) {
        console.error('Error fetching exams', error);
      } finally {
        setLoadingExams(false);
      }
    };
    fetchPublicExams();
  }, []);

  return (
    <PageTransition>
      <main className="flex flex-col bg-white dark:bg-gray-950">

        {/* ─── Hero Section (Phase 7) ────────────────────────────────────────── */}
        <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-28 px-4">
          <div className="absolute inset-0 bg-cream dark:bg-gray-900 -z-10" />
          <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 rounded-l-full blur-3xl opacity-50 -z-10" />
          
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-8 items-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left flex flex-col items-center lg:items-start"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/20 text-gold-light dark:text-gold text-sm font-bold uppercase tracking-widest mb-8 border border-gold/30">
                <Star className="w-4 h-4 fill-current" /> Introducing Qezmora
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6 leading-[1.1]">
                Smart Exams.<br />
                <span className="text-primary">Simplified.</span>
              </h1>
              
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-lg leading-relaxed">
                Conduct secure online examinations with intelligent analytics, real-time results, and seamless digital assessments.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Link
                  to="/exams"
                  className="btn px-8 py-4 rounded-xl text-lg font-bold shadow-xl shadow-primary/20 w-full sm:w-auto text-white transition-colors duration-300 bg-[#0F5132] hover:bg-[#D4A017] inline-flex items-center justify-center gap-2"
                >
                  View Exams
                </Link>
                <button
                  onClick={() => handleStartExam()}
                  className="btn px-8 py-4 rounded-xl text-lg font-bold border-2 border-[#0F5132] dark:border-white text-[#0F5132] dark:text-white hover:bg-[#0F5132] hover:text-white transition-colors duration-300 w-full sm:w-auto inline-flex items-center justify-center gap-2"
                >
                  Start Exam
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative hidden md:block"
            >
              {/* Premium Hero Illustration Mockup */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                <div className="h-12 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center px-4 gap-2">
                  <div className="w-3 h-3 rounded-full bg-danger" />
                  <div className="w-3 h-3 rounded-full bg-warning" />
                  <div className="w-3 h-3 rounded-full bg-success" />
                </div>
                <div className="p-8">
                  <div className="flex justify-between items-center mb-8">
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white">Technical Assessment</h4>
                    <span className="px-4 py-2 bg-primary/10 text-primary font-bold rounded-full">45:00</span>
                  </div>
                  <div className="w-3/4 h-4 bg-gray-200 dark:bg-gray-700 rounded-full mb-4" />
                  <div className="w-full h-4 bg-gray-100 dark:bg-gray-800 rounded-full mb-8" />
                  <div className="space-y-4">
                    <div className="p-4 border-2 border-primary bg-primary/5 rounded-xl flex items-center gap-4">
                      <div className="w-5 h-5 rounded-full border-4 border-primary" />
                      <div className="w-1/2 h-3 bg-primary/40 rounded-full" />
                    </div>
                    <div className="p-4 border-2 border-gray-100 dark:border-gray-700 rounded-xl flex items-center gap-4">
                      <div className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600" />
                      <div className="w-2/3 h-3 bg-gray-200 dark:bg-gray-700 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center text-success">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-500">Average Score</p>
                    <p className="text-2xl font-black text-gray-900 dark:text-white">85.4%</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ─── Statistics (Phase 9) ────────────────────────────────────────── */}
        <section className="py-20 bg-primary text-white px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-50"></div>
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10 text-center">
            {[
              { label: 'Active Students', value: stats.activeStudents || 12, suffix: '+' },
              { label: 'Exams Conducted', value: stats.examsConducted || 8, suffix: '+' },
              { label: 'Question Bank', value: stats.questionBank || 530, suffix: '+' },
              { label: 'Success Rate', value: stats.successRate || 88, suffix: '%' }
            ].map((stat, i) => (
              <div key={i} className="p-4">
                <h4 className="text-4xl md:text-5xl font-black text-gold mb-2 drop-shadow-md">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </h4>
                <p className="text-white/80 font-medium uppercase tracking-wider text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Browse Categories */}
        <section className="bg-cream dark:bg-gray-900 px-4 pt-20 pb-10">
          <div className="max-w-7xl mx-auto">
            <BrowseCategories exams={publicExams} />
          </div>
        </section>

        {/* ─── Featured Exams (Phase 8) ────────────────────────────────────── */}
        <section className="py-24 bg-white dark:bg-gray-950 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">Featured Assessments</h2>
              <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                Discover top-rated exams and start testing your skills instantly on our secure platform.
              </p>
            </div>

            {loadingExams ? (
              <div className="flex justify-center py-12">
                <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {publicExams.slice(0, 3).map((exam, idx) => (
                  <PublicExamCard key={exam._id} exam={exam} delay={idx * 0.1} />
                ))}
              </div>
            )}
            
            <div className="mt-16 text-center">
              <Link to="/exams" className="btn btn-outline border-gray-300 dark:border-gray-700 px-8 py-4 rounded-xl font-bold text-lg inline-flex items-center gap-2">
                View All Exams <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* ─── How It Works (Phase 10) ─────────────────────────────────────── */}
        <section className="py-24 bg-cream dark:bg-gray-900 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">How Qezmora Works</h2>
              <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                A streamlined process designed for efficiency and ease of use.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8 relative">
              <div className="hidden md:block absolute top-12 left-24 right-24 h-1 bg-gray-200 dark:bg-gray-800 -z-10" />
              
              {[
                { icon: Users, title: 'Register', desc: 'Create a free account to access the dashboard.' },
                { icon: BookOpen, title: 'Choose Exam', desc: 'Select from a wide variety of subjects.' },
                { icon: Settings, title: 'Take Test', desc: 'Experience a secure, distraction-free UI.' },
                { icon: BarChart2, title: 'Get Results', desc: 'Receive instant grading and analytics.' }
              ].map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative text-center"
                >
                  <div className="w-24 h-24 mx-auto bg-white dark:bg-gray-800 rounded-full border-4 border-cream dark:border-gray-900 shadow-xl flex items-center justify-center mb-6 relative z-10">
                    <step.icon className="w-10 h-10 text-primary" />
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gold text-white font-bold rounded-full flex items-center justify-center border-4 border-white dark:border-gray-900">
                      {idx + 1}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{step.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Testimonials (Phase 11) ─────────────────────────────────────── */}
        <section className="py-24 bg-white dark:bg-gray-950 px-4 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">Trusted by Professionals</h2>
            </div>
            <div className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory custom-scrollbar">
              {[
                { name: 'Sarah Jenkins', role: 'University Professor', text: 'Qezmora has completely transformed how I conduct midterms. The anti-cheat features give me absolute peace of mind.' },
                { name: 'David Chen', role: 'Software Engineer', text: 'The interface is incredibly clean. Taking technical assessments on this platform feels just like HackerRank or LeetCode.' },
                { name: 'Emily Carter', role: 'Corporate Trainer', text: 'The auto-grading and analytics dashboard saves my team hundreds of hours every quarter. Highly recommended.' }
              ].map((testimonial, idx) => (
                <div key={idx} className="snap-center shrink-0 w-80 md:w-96 bg-cream dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800">
                  <div className="flex gap-1 text-gold mb-6">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-8 italic">"{testimonial.text}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-lg">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
    </PageTransition>
  );
};

export default LandingPage;



