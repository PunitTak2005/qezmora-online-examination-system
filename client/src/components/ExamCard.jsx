import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { slideUpVariants } from '../animations/variants';
import { Clock, Award, HelpCircle, ArrowRight } from 'lucide-react';

const difficultyConfig = {
  easy:   { bg: 'bg-emerald-500/10', text: 'text-emerald-700 dark:text-emerald-400', border: 'border-emerald-500/20', label: 'Easy' },
  medium: { bg: 'bg-amber-500/10',   text: 'text-amber-700 dark:text-amber-400',   border: 'border-amber-500/20',   label: 'Medium' },
  hard:   { bg: 'bg-rose-500/10',    text: 'text-rose-700 dark:text-rose-400',    border: 'border-rose-500/20',    label: 'Hard' },
};

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

const ExamCard = ({ exam, showActions = false, onEdit, onDelete, onPublish, delay = 0 }) => {
  const diffKey = (exam.difficulty || 'medium').toLowerCase();
  const diff = difficultyConfig[diffKey] || difficultyConfig.medium;
  const categoryBadge = getCategoryBadgeClass(exam.subject || (exam.category && typeof exam.category === 'object' ? exam.category.name : exam.category));

  const isResume = typeof window !== 'undefined' && Object.keys(localStorage).some(k => k.startsWith('exam_progress_') && k.endsWith(`_${exam._id}`));

  return (
    <motion.div
      variants={slideUpVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay, duration: 0.3, ease: 'easeOut' }}
      whileHover={{ y: -4, transition: { duration: 0.18 } }}
      className="bg-white dark:bg-[#162032] rounded-2xl p-6 border border-gray-100 dark:border-gray-800/80 shadow-sm hover:shadow-xl hover:border-primary/40 transition-all duration-300 flex flex-col h-full group relative overflow-hidden"
    >
      {/* ─── Category & Difficulty Badges Row ─── */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <span className={`px-3 py-1 rounded-full text-xs font-extrabold tracking-wide border ${categoryBadge}`}>
          {exam.subject || (exam.category && typeof exam.category === 'object' ? exam.category.name : exam.category) || 'General'}
        </span>
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${diff.bg} ${diff.text} ${diff.border}`}>
          {diff.label}
        </span>
      </div>

      {/* ─── Full Exam Title (No Truncation) ─── */}
      <div className="min-h-[56px] flex items-start mb-2">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight break-words whitespace-normal group-hover:text-primary transition-colors">
          {exam.title}
        </h3>
      </div>
      
      {/* ─── Description ─── */}
      {exam.description ? (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5 line-clamp-2 leading-relaxed">
          {exam.description}
        </p>
      ) : (
        <p className="text-sm text-gray-400 dark:text-gray-500 mb-5 italic">
          Standard 60-minute evaluation testing fundamental principles.
        </p>
      )}

      {/* ─── Compact Stat Chips (Metadata) ─── */}
      <div className="grid grid-cols-3 gap-2 mb-6 mt-auto">
        <div className="bg-slate-100 dark:bg-slate-800/60 p-2.5 rounded-xl flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span>{exam.duration} min</span>
        </div>

        <div className="bg-blue-500/10 p-2.5 rounded-xl flex items-center justify-center gap-1.5 text-xs font-semibold text-blue-700 dark:text-blue-300">
          <HelpCircle className="w-3.5 h-3.5 text-blue-500 shrink-0" />
          <span>{exam.questionCount || exam.totalMarks || 20} Qs</span>
        </div>

        <div className="bg-amber-500/10 p-2.5 rounded-xl flex items-center justify-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400">
          <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span>{exam.totalMarks || 100} Marks</span>
        </div>
      </div>

      {/* ─── Action Button Pinned to Bottom ─── */}
      <div className="pt-2">
        {showActions ? (
          <div className="flex items-center justify-between gap-2">
            <div className="flex gap-2">
              {onEdit && <button onClick={onEdit} className="btn btn-outline py-2 px-3 text-xs font-bold">Edit</button>}
              {onPublish && (
                <button onClick={onPublish} className={`btn py-2 px-3 text-xs font-bold ${
                  exam.status === 'published' ? 'bg-amber-500/10 text-amber-600 hover:bg-amber-500/20' : 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20'
                }`}>
                  {exam.status === 'published' ? 'Unpublish' : 'Publish'}
                </button>
              )}
            </div>
            {onDelete && <button onClick={onDelete} className="btn py-2 px-3 text-xs font-bold text-rose-600 bg-rose-500/10 hover:bg-rose-500/20 ml-auto">Delete</button>}
          </div>
        ) : (
          <Link
            to={`/student/exams/${exam._id}`}
            className={`btn w-full gap-2 py-3.5 rounded-xl font-bold transition-all shadow-md group/btn ${
              isResume 
                ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/20' 
                : 'bg-primary hover:bg-primary-dark text-white shadow-primary/20'
            }`}
          >
            {isResume ? 'Resume Exam' : 'Start Exam'} <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        )}
      </div>
    </motion.div>
  );
};

export default ExamCard;
