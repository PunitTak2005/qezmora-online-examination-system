import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Plus, ArrowLeft, Trash2, Edit } from 'lucide-react';
import api from '../../api/axios';
import PageTransition from '../../components/PageTransition';
import LoadingSkeleton from '../../components/LoadingSkeleton';

const QuestionBankPage = () => {
  const { id } = useParams();
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({
    defaultValues: { type: 'mcq', marks: 1, difficulty: 'medium' }
  });
  
  const questionType = watch('type');

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [examRes, qRes] = await Promise.all([
        api.get(`/exams/${id}`),
        api.get(`/questions/exam/${id}`)
      ]);
      setExam(examRes.data.data);
      setQuestions(qRes.data.data || []);
    } catch (err) {
      toast.error('Failed to load questions');
      setExam({ title: 'Loading...', totalMarks: 0 });
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      const payload = { ...data, exam: id };
      if (data.type === 'mcq') {
        payload.options = [data.optionA, data.optionB, data.optionC, data.optionD].filter(Boolean);
        delete payload.optionA; delete payload.optionB;
        delete payload.optionC; delete payload.optionD;
      }
      const res = await api.post('/questions', payload);
      setQuestions(prev => [...prev, res.data.data]);
      toast.success('Question added successfully');
      reset({ type: 'mcq', marks: 1, difficulty: 'medium' });
      setShowAdd(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add question');
    }
  };

  const handleDelete = async (qId) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;
    try {
      await api.delete(`/questions/${qId}`);
      setQuestions(questions.filter(q => q._id !== qId));
      toast.success('Question deleted');
    } catch (err) {
      toast.error('Failed to delete question');
    }
  };

  const currentMarks = questions.reduce((sum, q) => sum + (q.marks || 1), 0);

  if (loading) return <div className="p-8"><LoadingSkeleton /></div>;

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <Link to="/teacher/exams" className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-cream dark:hover:bg-gray-800 transition">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Question Bank</h1>
              <p className="text-gray-500 dark:text-gray-400">{exam?.title}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-500">Total Marks</p>
              <p className={`font-bold ${currentMarks > (exam?.totalMarks || 100) ? 'text-danger' : 'text-success'}`}>
                {currentMarks} / {exam?.totalMarks || 100}
              </p>
            </div>
            <button
              onClick={() => setShowAdd(!showAdd)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 font-medium transition"
            >
              {showAdd ? 'Cancel' : <><Plus className="w-4 h-4"/> Add Question</>}
            </button>
          </div>
        </div>

        {showAdd && (
          <form onSubmit={handleSubmit(onSubmit)} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
            <h3 className="text-lg font-bold mb-4">Add New Question</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select {...register('type')} className="w-full p-2.5 border rounded-lg dark:bg-gray-900 dark:border-gray-700 focus:ring-primary focus:border-primary">
                  <option value="mcq">Multiple Choice</option>
                  <option value="true-false">True / False</option>
                  <option value="fill-blank">Fill in the Blank</option>
                  <option value="short-answer">Short Answer</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Marks</label>
                <input type="number" {...register('marks', { valueAsNumber: true, required: true })} className="w-full p-2.5 border rounded-lg dark:bg-gray-900 dark:border-gray-700 focus:ring-primary focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Difficulty</label>
                <select {...register('difficulty')} className="w-full p-2.5 border rounded-lg dark:bg-gray-900 dark:border-gray-700 focus:ring-primary focus:border-primary">
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Question Text *</label>
              <textarea {...register('question', { required: true })} rows="3" className="w-full p-2.5 border rounded-lg dark:bg-gray-900 dark:border-gray-700 focus:ring-primary focus:border-primary resize-none"></textarea>
            </div>

            {questionType === 'mcq' && (
              <div className="grid md:grid-cols-2 gap-4 bg-cream dark:bg-gray-900/50 p-4 rounded-xl">
                <div>
                  <label className="block text-sm font-medium mb-1">Option A</label>
                  <input type="text" {...register('optionA', { required: true })} className="w-full p-2.5 border rounded-lg dark:bg-gray-800 dark:border-gray-600 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Option B</label>
                  <input type="text" {...register('optionB', { required: true })} className="w-full p-2.5 border rounded-lg dark:bg-gray-800 dark:border-gray-600 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Option C</label>
                  <input type="text" {...register('optionC', { required: true })} className="w-full p-2.5 border rounded-lg dark:bg-gray-800 dark:border-gray-600 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Option D</label>
                  <input type="text" {...register('optionD', { required: true })} className="w-full p-2.5 border rounded-lg dark:bg-gray-800 dark:border-gray-600 focus:ring-primary" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Correct Option *</label>
                  <select {...register('correctAnswer', { required: true })} className="w-full p-2.5 border rounded-lg dark:bg-gray-800 dark:border-gray-600 focus:ring-primary">
                    <option value="">Select Correct Option...</option>
                    <option value={watch('optionA')}>Option A</option>
                    <option value={watch('optionB')}>Option B</option>
                    <option value={watch('optionC')}>Option C</option>
                    <option value={watch('optionD')}>Option D</option>
                  </select>
                </div>
              </div>
            )}

            {questionType === 'true-false' && (
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" value="True" {...register('correctAnswer', { required: true })} className="text-primary focus:ring-primary" /> True
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" value="False" {...register('correctAnswer', { required: true })} className="text-primary focus:ring-primary" /> False
                </label>
              </div>
            )}

            {(questionType === 'fill-blank' || questionType === 'short-answer') && (
              <div>
                <label className="block text-sm font-medium mb-1">Correct Answer *</label>
                <input type="text" {...register('correctAnswer', { required: true })} className="w-full p-2.5 border rounded-lg dark:bg-gray-900 dark:border-gray-700 focus:ring-primary focus:border-primary" />
              </div>
            )}

            <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-700">
              <button type="submit" className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 font-medium">Save Question</button>
            </div>
          </form>
        )}

        <div className="space-y-4">
          {questions.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 text-gray-500">
              No questions added yet. Click "Add Question" to start building your exam.
            </div>
          ) : (
            questions.map((q, idx) => (
              <div key={q._id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex gap-4 group">
                <div className="font-bold text-gray-400 w-8 shrink-0">Q{idx+1}</div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white whitespace-pre-wrap">{q.text}</h4>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded font-medium">{q.type}</span>
                      <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded font-medium">{q.marks} Marks</span>
                    </div>
                  </div>
                  
                  {q.type === 'MCQ' && (
                    <div className="grid grid-cols-2 gap-2 mt-4 text-sm text-gray-600 dark:text-gray-300">
                      {q.options?.map((opt, i) => (
                        <div key={i} className={`p-2 rounded border ${q.correctAnswer === opt ? 'border-success bg-success/5 text-success font-medium' : 'border-gray-100 dark:border-gray-700'}`}>
                          {String.fromCharCode(65+i)}. {opt}
                        </div>
                      ))}
                    </div>
                  )}

                  {q.type !== 'MCQ' && (
                    <div className="mt-2 text-sm">
                      <span className="text-gray-500">Answer: </span>
                      <span className="font-medium text-success">{q.correctAnswer}</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button onClick={() => handleDelete(q._id)} className="p-2 text-danger hover:bg-danger/10 rounded">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default QuestionBankPage;
