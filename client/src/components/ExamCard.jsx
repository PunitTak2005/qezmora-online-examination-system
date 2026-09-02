import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { slideUpVariants } from '../animations/variants';
import { Clock, Award, Users, ChevronRight, ListTodo, GraduationCap, ArrowRight } from 'lucide-react';

const difficultyConfig = {
  easy:   { bg: 'bg-success/10', text: 'text-success', border: 'border-success/20', label: 'Easy' },
  medium: { bg: 'bg-warning/10', text: 'text-warning', border: 'border-warning/20', label: 'Medium' },
  hard:   { bg: 'bg-danger/10',  text: 'text-danger',  border: 'border-danger/20',  label: 'Hard' },
};

const statusConfig = {
  published: { cls: 'bg-success/10 text-success border border-success/20', label: 'Live' },
  draft:     { cls: 'bg-gray-100 text-gray-600 border border-gray-200 dark:bg-gray-800 dark:text-gray-400', label: 'Draft' },
  closed:    { cls: 'bg-danger/10 text-danger border border-danger/20', label: 'Closed' },
};

// Generates a consistent color badge based on the subject string
const getSubjectColor = (subject) => {
  const colors = [
    'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/50',
    'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800/50',
    'bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800/50',
    'bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-900/30 dark:text-pink-400 dark:border-pink-800/50',
    'bg-teal-100 text-teal-700 border-teal-200 dark:bg-teal-900/30 dark:text-teal-400 dark:border-teal-800/50',
    'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/50',
    'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800/50'
  ];
  let hash = 0;
  for (let i = 0; i < subject.length; i++) {
    hash = subject.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const ExamCard = ({ exam, showActions = false, onEdit, onDelete, onPublish, delay = 0 }) => {
  const diff = difficultyConfig[exam.difficulty] || difficultyConfig.medium;
  const status = statusConfig[exam.status] || statusConfig.draft;
  const subjectBadge = getSubjectColor(exam.subject || 'General');

  return (
    <motion.div
      variants={slideUpVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay, duration: 0.3, ease: 'easeOut' }}
      whileHover={{ y: -4, scale: 1.01, transition: { duration: 0.2 } }}
      className="card flex flex-col h-full overflow-hidden group hover:shadow-xl transition-shadow"
    >
      {/* ─── Top Banner/Accent ─── */}
      <div className={`h-1.5 w-full ${diff.bg}`} />

      <div className="p-6 flex flex-col flex-1 relative">
        
        {/* Floating Background Icon */}
        <GraduationCap className="absolute -right-6 -top-6 w-32 h-32 text-gray-50 dark:text-gray-800/50 rotate-12 pointer-events-none transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6" />

        {/* ─── Badges Row ─── */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4 relative z-10">
          <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${subjectBadge}`}>
            {exam.subject}
          </span>
          <div className="flex gap-2">
            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${diff.bg} ${diff.text} ${diff.border}`}>
              {diff.label}
            </span>
            {showActions && (
              <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${status.cls}`}>
                {status.label}
              </span>
            )}
          </div>
        </div>

        {/* ─── Exam Title ─── */}
        <div className="min-h-[56px] md:min-h-[64px] flex items-start mb-2 relative z-10">
          <h3 className="text-lg md:text-xl font-extrabold text-gray-900 dark:text-white leading-tight break-words whitespace-normal group-hover:text-primary transition-colors">
            {exam.title}
          </h3>
        </div>
        
        {exam.description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 line-clamp-2 leading-relaxed relative z-10">
            {exam.description}
          </p>
        )}

        {/* ─── Key Metrics Grid ─── */}
        <div className="grid grid-cols-2 gap-y-4 gap-x-2 mt-auto mb-6 bg-cream dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700/50 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Duration</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">{exam.duration} Min</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-navy/10 flex items-center justify-center shrink-0">
              <ListTodo className="w-4 h-4 text-navy" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Questions</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">{exam.questionCount || 0} Qs</span>
            </div>
          </div>
        </div>

        {/* ─── Actions / CTA ─── */}
        <div className="relative z-10 border-t border-gray-100 dark:border-gray-800 pt-5">
          {showActions ? (
            <div className="flex items-center justify-between gap-2">
              <div className="flex gap-2">
                {onEdit && <button onClick={onEdit} className="btn btn-outline py-1.5 px-3 text-sm">Edit</button>}
                {onPublish && (
                  <button onClick={onPublish} className={`btn py-1.5 px-3 text-sm ${
                    exam.status === 'published' ? 'bg-warning/10 text-warning hover:bg-warning/20 border-transparent' : 'bg-success/10 text-success hover:bg-success/20 border-transparent'
                  }`}>
                    {exam.status === 'published' ? 'Unpublish' : 'Publish'}
                  </button>
                )}
              </div>
              {onDelete && <button onClick={onDelete} className="btn py-1.5 px-3 text-sm text-danger bg-danger/10 hover:bg-danger/20 border-transparent ml-auto">Delete</button>}
            </div>
          ) : (() => {
            const isResume = typeof window !== 'undefined' && Object.keys(localStorage).some(k => k.startsWith('exam_progress_') && k.endsWith(`_${exam._id}`));
            return (
              <Link
                to={`/student/exams/${exam._id}`}
                className={`btn w-full gap-2 py-3.5 group/btn ${isResume ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-600/20' : 'btn-primary'}`}
              >
                {isResume ? 'Resume Exam' : 'Start Exam'} <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            );
          })()}
        </div>
      </div>
    </motion.div>
  );
};

export default ExamCard;
