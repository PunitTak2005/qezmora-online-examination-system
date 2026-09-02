import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { Clock, HelpCircle, Award, ChevronLeft, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';

const CategoryDetailPage = () => {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategoryDetails = async () => {
      try {
        const response = await api.get(`/categories/slug/${slug}`);
        setCategory(response.data.data.category);
        setExams(response.data.data.exams);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load category details');
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryDetails();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-64px)]">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)]">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Category Not Found</h2>
        <p className="text-gray-500 mb-6">{error}</p>
        <Link to="/" className="btn btn-primary">Go Back Home</Link>
      </div>
    );
  }

  return (
    <PageTransition>
      {/* Banner */}
      <div className={`bg-${category.color}-50 dark:bg-${category.color}-900/10 border-b border-${category.color}-100 dark:border-${category.color}-900/50 pt-16 pb-12 px-4`}>
        <div className="max-w-7xl mx-auto">
          <Link to="/" className={`inline-flex items-center gap-1 text-${category.color}-600 dark:text-${category.color}-400 hover:underline mb-6 text-sm font-medium`}>
            <ChevronLeft className="w-4 h-4" /> Back to Home
          </Link>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
              {category.name}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
              {category.description}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            Available Exams
            <span className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm py-1 px-3 rounded-full">
              {exams.length}
            </span>
          </h2>
        </div>

        {exams.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {exams.map((exam, idx) => (
              <motion.div
                key={exam._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="card overflow-hidden group flex flex-col hover:-translate-y-1"
              >
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wider">
                      {exam.subject}
                    </span>
                    <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${
                      exam.difficulty === 'easy' ? 'bg-success/10 text-success' : 
                      exam.difficulty === 'medium' ? 'bg-warning/10 text-warning' : 'bg-danger/10 text-danger'
                    }`}>
                      {exam.difficulty}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                    {exam.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">
                    {exam.description}
                  </p>
                  
                  <div className="space-y-2 mt-auto pt-4 border-t border-gray-50 dark:border-gray-700/50">
                    <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                      <Clock className="w-4 h-4" /> {exam.duration} mins
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                      <HelpCircle className="w-4 h-4" /> {exam.totalMarks} Marks
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-cream dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700">
                  <Link 
                    to="/login"
                    className="btn btn-outline w-full"
                  >
                    Start Exam
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-cream dark:bg-gray-800/30 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Exams Yet</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              There are currently no active exams published in the {category.name} category. Check back soon!
            </p>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default CategoryDetailPage;
