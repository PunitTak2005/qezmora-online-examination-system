import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Plus, Edit, Trash2, LayoutList, BarChart2, MoreVertical } from 'lucide-react';
import api from '../../api/axios';
import PageTransition from '../../components/PageTransition';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import Modal from '../../components/Modal';

const ExamManagementPage = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null });
  const navigate = useNavigate();

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const res = await api.get('/exams/my-exams'); // assuming this endpoint gets teacher's exams
      setExams(res.data);
    } catch (err) {
      setExams([{ _id: '1', title: 'Midterm Math', subject: 'Math', status: 'draft', questionsCount: 10, attemptsCount: 0, createdAt: new Date().toISOString() }]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/exams/${deleteModal.id}`);
      setExams(exams.filter(e => e._id !== deleteModal.id));
      toast.success('Exam deleted');
    } catch (err) {
      toast.error('Failed to delete exam');
    } finally {
      setDeleteModal({ show: false, id: null });
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    try {
      await api.put(`/exams/${id}`, { status: newStatus });
      setExams(exams.map(e => e._id === id ? { ...e, status: newStatus } : e));
      toast.success(`Exam marked as ${newStatus}`);
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const filteredExams = exams.filter(e => filter === 'all' ? true : e.status === filter);

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Exam Management</h1>
            <p className="text-gray-500 dark:text-gray-400">Create and manage your exams.</p>
          </div>
          <Link to="/teacher/exams/create" className="btn btn-primary gap-2">
            <Plus className="w-4 h-4" /> Create New Exam
          </Link>
        </div>

        <div className="card">
          <div className="border-b border-gray-100 dark:border-gray-700 p-2 flex gap-2">
            {['all', 'draft', 'published', 'closed'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition ${filter === f ? 'bg-primary/10 text-primary' : 'text-gray-500 hover:bg-cream dark:hover:bg-gray-700'}`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-cream dark:bg-gray-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Questions</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Attempts</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {loading ? (
                  <tr><td colSpan="6" className="p-6"><LoadingSkeleton /></td></tr>
                ) : filteredExams.length === 0 ? (
                  <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-500">No exams found.</td></tr>
                ) : (
                  filteredExams.map(exam => (
                    <tr key={exam._id} className="hover:bg-cream dark:hover:bg-gray-700/50 transition">
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-white">{exam.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{exam.subject}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button 
                          onClick={() => toggleStatus(exam._id, exam.status)}
                          className={`hover:opacity-80 transition ${exam.status === 'published' ? 'badge-success' : 'badge-primary'}`}
                        >
                          {exam.status}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{exam.questionsCount || 0}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{exam.attemptsCount || 0}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-3">
                          <button onClick={() => navigate(`/teacher/exams/${exam._id}/questions`)} className="text-navy hover:text-navy/80" title="Manage Questions">
                            <LayoutList className="w-4 h-4" />
                          </button>
                          <button onClick={() => navigate(`/teacher/exams/${exam._id}/results`)} className="text-success hover:text-success/80" title="View Results">
                            <BarChart2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => navigate(`/teacher/exams/${exam._id}/edit`)} className="text-primary hover:text-primary/80" title="Edit Exam Settings">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => setDeleteModal({ show: true, id: exam._id })} className="text-danger hover:text-danger/80" title="Delete Exam">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal isOpen={deleteModal.show} onClose={() => setDeleteModal({ show: false, id: null })} title="Confirm Delete">
        <div className="p-4 text-center">
          <Trash2 className="w-12 h-12 text-danger mx-auto mb-4" />
          <h3 className="text-lg font-bold mb-2">Delete this exam?</h3>
          <p className="text-gray-500 mb-6">This action cannot be undone. All related questions and attempts will also be permanently deleted.</p>
          <div className="flex gap-4 justify-center">
            <button onClick={() => setDeleteModal({ show: false, id: null })} className="btn btn-outline">Cancel</button>
            <button onClick={handleDelete} className="btn bg-danger hover:bg-danger/90 text-white border-transparent">Yes, Delete</button>
          </div>
        </div>
      </Modal>
    </PageTransition>
  );
};

export default ExamManagementPage;
