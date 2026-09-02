import React, { useState, useEffect } from 'react';
import { Search, Trash2, Eye, RefreshCcw, AlertTriangle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../api/axios';
import PageTransition from '../../components/PageTransition';
import LoadingSkeleton from '../../components/LoadingSkeleton';

const ExamManagementAdminPage = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchExams = async () => {
    try {
      setLoading(true);
      setError(null);
      let res;
      try {
        res = await api.get('/exams/all');
      } catch (e) {
        res = await api.get('/exams');
      }

      // Normalize API envelope response shape (res.data.data or res.data.exams or res.data)
      const rawData = res.data?.data || res.data?.exams || res.data;
      const examList = Array.isArray(rawData) ? rawData : [];
      setExams(examList);
    } catch (err) {
      console.error('Error fetching admin exams:', err);
      setError('Unable to load platform examinations.');
      setExams([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this exam system-wide?')) return;
    try {
      await api.delete(`/exams/${id}`);
      setExams(prev => (Array.isArray(prev) ? prev.filter(e => e._id !== id) : []));
      toast.success('Exam deleted');
    } catch (err) {
      toast.error('Failed to delete exam');
    }
  };

  const safeExams = Array.isArray(exams) ? exams : [];
  const filteredExams = safeExams.filter(e => {
    const title = e.title || '';
    const teacherName = e.teacherName || (e.teacher && typeof e.teacher === 'object' ? e.teacher.name : e.teacher) || '';
    const matchSearch = title.toLowerCase().includes(search.toLowerCase()) || 
                        teacherName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || e.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <PageTransition>
      <div className="space-y-6">
        <header>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Platform Exams</h1>
          <p className="text-gray-500">Monitor and manage all examinations across the system.</p>
        </header>

        <section aria-label="Filters and Search" className="card card-p flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative max-w-sm flex-1">
            <label htmlFor="search-exams" className="sr-only">Search title or teacher</label>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden="true" />
            <input
              id="search-exams"
              type="text"
              placeholder="Search title or teacher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-base pl-10"
            />
          </div>
          <div>
            <label htmlFor="status-filter" className="sr-only">Filter by Status</label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-base"
            >
              <option value="all">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </section>

        {error && (
          <div className="bg-danger/10 border border-danger/20 text-danger p-4 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-medium">{error}</span>
            </div>
            <button onClick={fetchExams} className="btn bg-danger text-white px-4 py-1.5 text-xs rounded-lg flex items-center gap-1">
              <RefreshCcw className="w-3.5 h-3.5" /> Retry
            </button>
          </div>
        )}

        <section aria-label="Exams Directory" className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <caption className="sr-only">Platform exams overview</caption>
              <thead className="bg-cream dark:bg-gray-900/50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title & Subject</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Teacher</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stats</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {loading ? (
                  <tr><td colSpan="5" className="p-6"><LoadingSkeleton /></td></tr>
                ) : filteredExams.length === 0 ? (
                  <tr><td colSpan="5" className="p-8 text-center text-gray-500">No exams found matching filters.</td></tr>
                ) : (
                  filteredExams.map(exam => {
                    const teacher = exam.teacherName || (exam.teacher && typeof exam.teacher === 'object' ? exam.teacher.name : exam.teacher) || 'Platform Admin';
                    const qCount = exam.questionCount || exam.questionsCount || (exam.questions ? exam.questions.length : 0);
                    
                    return (
                      <tr key={exam._id} className="hover:bg-cream dark:hover:bg-gray-700/50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900 dark:text-white">{exam.title}</div>
                          <div className="text-sm text-gray-500">{exam.subject || 'General'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{teacher}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                            exam.status === 'published' ? 'badge-success' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                          }`}>{exam.status}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {qCount} Qs | {exam.attemptsCount || 0} Attempts
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button type="button" onClick={() => handleDelete(exam._id)} className="p-2 text-danger hover:bg-danger/10 rounded transition focus:outline-none focus:ring-2 focus:ring-danger" aria-label={`Delete exam ${exam.title}`} title="Delete Exam">
                            <Trash2 className="w-4 h-4" aria-hidden="true" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

export default ExamManagementAdminPage;
