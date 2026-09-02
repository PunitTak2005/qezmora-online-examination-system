import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Code, Calculator, FlaskConical, BookOpen, Brain, Globe, CheckCircle2, Award } from 'lucide-react';

const CATEGORIES = [
  { name: 'Programming', icon: Code, desc: 'Build coding skills through practical assessments.' },
  { name: 'Mathematics', icon: Calculator, desc: 'Test your quantitative and problem-solving skills.' },
  { name: 'Science', icon: FlaskConical, desc: 'Explore physics, chemistry, and biology.' },
  { name: 'English', icon: BookOpen, desc: 'Improve grammar, vocabulary, and comprehension.' },
  { name: 'Aptitude', icon: Brain, desc: 'Sharpen your logical reasoning and analytics.' },
  { name: 'General Knowledge', icon: Globe, desc: 'Stay updated with global facts and trivia.' },
  { name: 'Advanced', icon: Award, desc: 'High-level technical assessments and specialization exams.' }
];

const BrowseCategories = ({ exams = [], currentCategory = 'All', onCategorySelect }) => {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryName) => {
    if (onCategorySelect) {
      // Filter without reloading
      onCategorySelect(categoryName === currentCategory ? 'All' : categoryName);
    } else {
      // Navigate to ExamsPage with query
      navigate(`/exams?category=${encodeURIComponent(categoryName)}`);
    }
  };

  const getExamCount = (categoryName) => {
    if (!exams || exams.length === 0) return 0;
    return exams.filter(e => e.subject?.toLowerCase() === categoryName.toLowerCase()).length;
  };

  return (
    <section className="py-8">
      <div className="flex justify-between items-end mb-8 px-4 lg:px-0">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Browse Categories</h2>
          <p className="text-gray-500 dark:text-gray-400">Find the perfect assessment for your learning path</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 px-4 lg:px-0">
        {CATEGORIES.map((cat, idx) => {
          const count = getExamCount(cat.name);
          const isActive = currentCategory === cat.name;

          return (
            <motion.button
              key={cat.name}
              onClick={() => handleCategoryClick(cat.name)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ 
                y: isActive ? 0 : -8, 
                boxShadow: isActive ? 'none' : '0 25px 50px -12px rgba(15, 81, 50, 0.15)',
                borderColor: isActive ? 'transparent' : '#D4A017'
              }}
              aria-label={`Browse ${cat.name} Exams`}
              className={`group text-left relative flex flex-col p-6 rounded-3xl border-2 transition-all duration-300 ${
                isActive 
                  ? 'bg-primary border-primary text-white shadow-lg' 
                  : 'bg-white dark:bg-[#162032] border-transparent shadow-sm hover:border-gold'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-transform duration-300 ${
                  isActive 
                    ? 'bg-white/20 text-white' 
                    : 'bg-primary/10 text-primary group-hover:scale-110'
                }`}>
                  <cat.icon className="w-6 h-6" />
                </div>
                {isActive && (
                  <CheckCircle2 className="w-6 h-6 text-gold" />
                )}
              </div>
              
              <h3 className={`font-bold text-lg mb-2 ${isActive ? 'text-white' : 'text-gray-900 dark:text-[#F8FAFC]'}`}>
                {cat.name}
              </h3>
              
              <p className={`text-xs mb-4 line-clamp-2 ${isActive ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
                {cat.desc}
              </p>
              
              <div className="mt-auto">
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                  isActive 
                    ? 'bg-white/20 text-white' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                }`}>
                  {count} {count === 1 ? 'Exam' : 'Exams'}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
};

export default BrowseCategories;

