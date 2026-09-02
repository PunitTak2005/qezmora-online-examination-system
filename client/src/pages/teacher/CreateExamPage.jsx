import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Save, Plus, Trash2, Shuffle } from 'lucide-react';
import api from '../../api/axios';
import PageTransition from '../../components/PageTransition';

const CreateExamPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm({
    defaultValues: {
      selectionMode: 'manual',
      shuffleQuestions: false,
      shuffleOptions: false,
      distributionRules: []
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "distributionRules"
  });

  const selectionMode = useWatch({ control, name: 'selectionMode' });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        setCategories(res.data.data);
      } catch (err) {
        console.error('Failed to load categories');
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (isEdit) {
      const fetchExam = async () => {
        try {
          const res = await api.get(`/exams/${id}`);
          // format dates for input type="datetime-local" if present
          const data = res.data;
          if (data.startDate) data.startDate = new Date(data.startDate).toISOString().slice(0, 16);
          if (data.endDate) data.endDate = new Date(data.endDate).toISOString().slice(0, 16);
          reset(data);
        } catch (err) {
          toast.error('Failed to load exam data');
          navigate('/teacher/exams');
        } finally {
          setFetching(false);
        }
      };
      fetchExam();
    }
  }, [id, isEdit, reset, navigate]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (isEdit) {
        await api.put(`/exams/${id}`, data);
        toast.success('Exam updated successfully');
      } else {
        await api.post('/exams', data);
        toast.success('Exam created successfully');
      }
      navigate('/teacher/exams');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save exam');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="p-8">Loading exam details...</div>;

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="flex items-center gap-4">
          <Link to="/teacher/exams" aria-label="Back to Exams" className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-cream dark:hover:bg-gray-800 transition">
            <ArrowLeft className="w-5 h-5" aria-hidden="true" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{isEdit ? 'Edit Exam' : 'Create New Exam'}</h1>
            <p className="text-gray-500">Fill in the details to set up the examination.</p>
          </div>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="card card-p space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="title" className="label-base">Exam Title *</label>
              <input id="title" type="text" {...register('title', { required: 'Title is required' })} className="input-base" placeholder="e.g. Midterm Mathematics" />
              {errors.title && <p className="text-xs text-danger mt-1">{errors.title.message}</p>}
            </div>

            <div>
              <label htmlFor="subject" className="label-base">Subject *</label>
              <input id="subject" type="text" {...register('subject', { required: 'Subject is required' })} className="input-base" />
              {errors.subject && <p className="text-xs text-danger mt-1">{errors.subject.message}</p>}
            </div>

            <div>
              <label htmlFor="category" className="label-base">Category</label>
              <select id="category" {...register('category', { required: 'Category is required' })} className="input-base">
                <option value="">Select Category...</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
              {errors.category && <p className="text-xs text-danger mt-1">{errors.category.message}</p>}
            </div>

            <div className="md:col-span-2">
              <label htmlFor="description" className="label-base">Description</label>
              <textarea id="description" {...register('description')} rows="3" className="input-base resize-none"></textarea>
            </div>

            <div>
              <label htmlFor="duration" className="label-base">Duration (Minutes) *</label>
              <input id="duration" type="number" {...register('duration', { required: 'Required', min: 1 })} className="input-base" />
            </div>

            <div>
              <label htmlFor="difficulty" className="label-base">Difficulty</label>
              <select id="difficulty" {...register('difficulty')} className="input-base">
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div>
              <label htmlFor="totalMarks" className="label-base">Total Marks *</label>
              <input id="totalMarks" type="number" {...register('totalMarks', { required: 'Required' })} className="input-base" />
            </div>

            <div>
              <label htmlFor="passingMarks" className="label-base">Passing Marks *</label>
              <input id="passingMarks" type="number" {...register('passingMarks', { required: 'Required' })} className="input-base" />
            </div>

            <div>
              <label htmlFor="startDate" className="label-base">Start Date & Time (Optional)</label>
              <input id="startDate" type="datetime-local" {...register('startDate')} className="input-base" />
            </div>

            <div>
              <label htmlFor="endDate" className="label-base">End Date & Time (Optional)</label>
              <input id="endDate" type="datetime-local" {...register('endDate')} className="input-base" />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="instructions" className="label-base">Instructions for Students</label>
              <textarea id="instructions" {...register('instructions')} rows="4" className="input-base resize-none" placeholder="1. Do not refresh..."></textarea>
            </div>

            <fieldset className="md:col-span-2 mt-4 pt-6 border-t border-gray-100 dark:border-gray-800">
              <legend className="text-lg font-bold text-gray-900 dark:text-white mb-4">Question Selection Mode</legend>
              <div className="grid md:grid-cols-2 gap-4">
                <label className={`border rounded-xl p-4 cursor-pointer transition-all ${selectionMode === 'manual' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'}`}>
                  <div className="flex items-center gap-3">
                    <input type="radio" value="manual" {...register('selectionMode')} className="text-primary w-5 h-5" />
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">Manual Selection</p>
                      <p className="text-xs text-gray-500">Manually pick questions from the question bank after creating the exam.</p>
                    </div>
                  </div>
                </label>
                <label className={`border rounded-xl p-4 cursor-pointer transition-all ${selectionMode === 'random' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'}`}>
                  <div className="flex items-center gap-3">
                    <input type="radio" value="random" {...register('selectionMode')} className="text-primary w-5 h-5" />
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">Random Generation</p>
                      <p className="text-xs text-gray-500">Automatically generate a unique paper for each student using rules.</p>
                    </div>
                  </div>
                </label>
              </div>
            </fieldset>

            {selectionMode === 'random' && (
              <div className="md:col-span-2 space-y-6 bg-cream dark:bg-gray-900/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2 mb-2">
                  <Shuffle className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Randomization Settings</h3>
                </div>
                
                <div className="flex flex-wrap gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" {...register('shuffleQuestions')} className="rounded text-primary w-5 h-5" />
                    <span className="text-sm font-medium">Shuffle Question Order</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" {...register('shuffleOptions')} className="rounded text-primary w-5 h-5" />
                    <span className="text-sm font-medium">Shuffle Answer Options (MCQ)</span>
                  </label>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-bold text-gray-900 dark:text-white">Distribution Rules</h4>
                    <button type="button" onClick={() => append({ category: '', difficulty: 'easy', count: 1 })} className="btn btn-secondary text-xs py-1.5 px-3">
                      <Plus className="w-4 h-4 mr-1" /> Add Rule
                    </button>
                  </div>
                  
                  {fields.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">No rules added. Click "Add Rule" to configure category distributions.</p>
                  ) : (
                    <div className="space-y-3">
                      {fields.map((item, index) => (
                        <div key={item.id} className="flex flex-wrap md:flex-nowrap gap-3 items-end bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
                          <div className="flex-1">
                            <label className="text-xs font-semibold text-gray-500 mb-1 block">Category</label>
                            <select {...register(`distributionRules.${index}.category`, { required: true })} className="input-base text-sm py-2">
                              <option value="">Select...</option>
                              {categories.map((cat) => (
                                <option key={cat._id} value={cat._id}>{cat.name}</option>
                              ))}
                            </select>
                          </div>
                          <div className="w-full md:w-32">
                            <label className="text-xs font-semibold text-gray-500 mb-1 block">Difficulty</label>
                            <select {...register(`distributionRules.${index}.difficulty`, { required: true })} className="input-base text-sm py-2">
                              <option value="easy">Easy</option>
                              <option value="medium">Medium</option>
                              <option value="hard">Hard</option>
                            </select>
                          </div>
                          <div className="w-full md:w-24">
                            <label className="text-xs font-semibold text-gray-500 mb-1 block">Count</label>
                            <input type="number" {...register(`distributionRules.${index}.count`, { required: true, min: 1 })} className="input-base text-sm py-2" />
                          </div>
                          <button type="button" onClick={() => remove(index)} className="p-2.5 text-danger hover:bg-danger/10 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            <fieldset className="md:col-span-2 mt-4 pt-6 border-t border-gray-100 dark:border-gray-800">
              <legend className="label-base">Publish Status</legend>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" value="draft" {...register('status')} defaultChecked className="text-primary focus:ring-primary w-4 h-4" />
                  <span>Save as Draft</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" value="published" {...register('status')} className="text-primary focus:ring-primary w-4 h-4" />
                  <span>Publish Immediately</span>
                </label>
              </div>
            </fieldset>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-gray-100 dark:border-gray-700">
            <Link to="/teacher/exams" className="btn btn-outline border border-gray-200 dark:border-gray-700">Cancel</Link>
            <button type="submit" disabled={loading} className="btn btn-primary gap-2">
              <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Save Exam'}
            </button>
          </div>
        </form>
      </div>
    </PageTransition>
  );
};

export default CreateExamPage;
