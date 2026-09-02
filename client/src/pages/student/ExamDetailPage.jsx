import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../api/axios';
import PageTransition from '../../components/PageTransition';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import Modal from '../../components/Modal';
import { Clock, Book, AlertTriangle, CheckCircle, FileText, ArrowLeft } from 'lucide-react';

const ExamDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchExamDetails = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/exams/${id}`);
        const examData = res.data.data || res.data;

        // Also fetch actual questions count if questions API exists
        let actualQuestionCount = examData.questionCount || examData.questionsCount || 0;
        try {
          const qRes = await api.get(`/questions/${id}`);
          const questions = qRes.data.data || qRes.data;
          if (Array.isArray(questions) && questions.length > 0) {
            actualQuestionCount = questions.length;
          }
        } catch (qErr) {
          // Fallback to exam object question count
        }

        setExam({
          ...examData,
          questionsCount: actualQuestionCount || examData.totalMarks || 10
        });
      } catch (err) {
        console.error('Failed to load exam details:', err);
        toast.error('Failed to load exam details');
        navigate('/student/exams');
      } finally {
        setLoading(false);
      }
    };
    fetchExamDetails();
  }, [id, navigate]);

  const handleStartExam = () => {
    navigate(`/student/exam/${id}/take`);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-2xl mt-6 space-y-4">
        <LoadingSkeleton height="150px" />
        <LoadingSkeleton height="300px" />
      </div>
    );
  }

  if (!exam) return null;

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto space-y-6 font-sans">
        
        {/* Navigation back button */}
        <button 
          onClick={() => navigate('/student/exams')}
          className="flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Exams
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          
          {/* Hero Header */}
          <div className="p-8 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-br from-primary/10 via-transparent to-transparent">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <span className="px-3.5 py-1 bg-primary/10 text-primary text-xs font-extrabold rounded-full uppercase tracking-wider">
                  {exam.subject || 'General'}
                </span>
                <h1 className="text-3xl font-black text-gray-900 dark:text-white mt-3 mb-2 tracking-tight">
                  {exam.title}
                </h1>
                <p className="text-gray-600 dark:text-gray-300 max-w-2xl text-sm leading-relaxed">
                  {exam.description || 'No description available for this assessment.'}
                </p>
              </div>
              <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shrink-0 border ${
                exam.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300' : 
                exam.difficulty === 'Hard' ? 'bg-red-100 text-red-800 border-red-300 dark:bg-red-950/60 dark:text-red-300' : 
                'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300'
              }`}>
                {exam.difficulty || 'Medium'}
              </span>
            </div>
          </div>

          <div className="p-8 space-y-8">
            
            {/* Exam Summary Cards */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Exam Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                
                <div className="p-5 bg-cream/60 dark:bg-gray-900/60 rounded-2xl border border-gray-100 dark:border-gray-700/60">
                  <Clock className="w-6 h-6 text-primary mb-2" />
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Duration</p>
                  <p className="text-xl font-black text-gray-900 dark:text-white mt-1">
                    {exam.duration || 30} Mins
                  </p>
                </div>

                <div className="p-5 bg-cream/60 dark:bg-gray-900/60 rounded-2xl border border-gray-100 dark:border-gray-700/60">
                  <FileText className="w-6 h-6 text-primary mb-2" />
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Questions</p>
                  <p className="text-xl font-black text-gray-900 dark:text-white mt-1">
                    {exam.questionsCount || exam.questionCount || 0}
                  </p>
                </div>

                <div className="p-5 bg-cream/60 dark:bg-gray-900/60 rounded-2xl border border-gray-100 dark:border-gray-700/60">
                  <Book className="w-6 h-6 text-primary mb-2" />
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Marks</p>
                  <p className="text-xl font-black text-gray-900 dark:text-white mt-1">
                    {exam.totalMarks || 100}
                  </p>
                </div>

                <div className="p-5 bg-cream/60 dark:bg-gray-900/60 rounded-2xl border border-gray-100 dark:border-gray-700/60">
                  <CheckCircle className="w-6 h-6 text-emerald-600 mb-2" />
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Passing Marks</p>
                  <p className="text-xl font-black text-gray-900 dark:text-white mt-1">
                    {exam.passingMarks || 40}
                  </p>
                </div>

              </div>
            </div>

            {/* Instructions */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Instructions</h3>
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 text-gray-800 dark:text-gray-200 text-sm leading-relaxed">
                {exam.instructions ? (
                  <p className="whitespace-pre-line font-medium">{exam.instructions}</p>
                ) : (
                  <ul className="list-disc list-inside space-y-2 font-medium">
                    <li>Ensure you have a stable internet connection before starting.</li>
                    <li>The exam will automatically submit when the timer ends.</li>
                    <li>Do not refresh or leave the page, or your attempt will be forfeited.</li>
                    <li>You can navigate between questions and flag them for review.</li>
                  </ul>
                )}
              </div>
            </div>

            {/* Action CTA */}
            <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-700">
              {(() => {
                const isResume = typeof window !== 'undefined' && Object.keys(localStorage).some(k => k.startsWith('exam_progress_') && k.endsWith(`_${id}`));
                return (
                  <button
                    onClick={() => setShowModal(true)}
                    className={`px-8 py-3.5 text-white rounded-xl font-extrabold shadow-lg transition-all hover:scale-[1.02] ${isResume ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/25' : 'bg-primary hover:bg-primary-dark shadow-primary/25'}`}
                  >
                    {isResume ? 'Resume Exam Now' : 'Start Exam Now'}
                  </button>
                );
              })()}
            </div>

          </div>
        </div>

        {/* Confirmation Modal */}
        <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Confirm Exam Start">
          <div className="text-center py-4 space-y-4">
            <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
            <h4 className="text-lg font-bold text-gray-900 dark:text-white">Are you ready to begin?</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 max-w-sm mx-auto">
              Once started, the timer cannot be paused. Do not refresh the page during the exam.
            </p>
            <div className="flex gap-3 justify-center pt-2">
              <button
                onClick={() => setShowModal(false)}
                className="btn btn-outline px-5 py-2.5 rounded-xl font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleStartExam}
                className="btn bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-xl font-bold shadow-md"
              >
                Yes, Start Exam
              </button>
            </div>
          </div>
        </Modal>

      </div>
    </PageTransition>
  );
};

export default ExamDetailPage;
