import React, { useState, useEffect } from 'react';
import { Search, Trash2, Edit, AlertCircle, RefreshCcw } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../api/axios';
import PageTransition from '../../components/PageTransition';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import Modal from '../../components/Modal';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/users');
      // Backend returns { success: true, count: X, data: [...] }
      const userList = res.data?.data || res.data?.users || (Array.isArray(res.data) ? res.data : []);
      if (Array.isArray(userList)) {
        setUsers(userList);
      } else {
        setUsers([]);
      }
    } catch (err) {
      console.error('Failed to fetch users from server:', err);
      setError(err.response?.data?.message || 'Failed to load users from backend.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async () => {
    try {
      await api.delete(`/users/${deleteModal.id}`);
      setUsers(prev => prev.filter(u => u._id !== deleteModal.id));
      toast.success('User deleted successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user');
    } finally {
      setDeleteModal({ show: false, id: null });
    }
  };

  // Safe array filtering
  const safeUsers = Array.isArray(users) ? users : [];
  const filteredUsers = safeUsers.filter(u => {
    const nameStr = u.name || '';
    const emailStr = u.email || '';
    const matchSearch = nameStr.toLowerCase().includes(search.toLowerCase()) || 
                        emailStr.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <PageTransition>
      <div className="space-y-6 max-w-7xl mx-auto font-sans">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">User Management</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">View, search, and manage registered students, teachers, and admins.</p>
          </div>
          <button 
            onClick={fetchUsers} 
            className="btn bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 gap-2 text-sm"
          >
            <RefreshCcw className="w-4 h-4" /> Refresh
          </button>
        </header>

        {/* Search & Role Filters */}
        <section aria-label="Filters and Search" className="card card-p flex flex-col md:flex-row gap-4 justify-between items-center shadow-sm">
          <div className="relative flex-1 max-w-md w-full">
            <label htmlFor="search-users" className="sr-only">Search by name or email</label>
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden="true" />
            <input
              id="search-users"
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-base pl-11"
            />
          </div>
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {['all', 'student', 'teacher', 'admin'].map(r => (
              <button
                key={r}
                type="button"
                onClick={() => setRoleFilter(r)}
                aria-pressed={roleFilter === r}
                className={`px-4 py-2.5 rounded-xl text-sm font-bold capitalize transition-colors ${
                  roleFilter === r 
                    ? 'bg-primary text-white shadow-md' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </section>

        {/* Error Banner */}
        {error && (
          <div className="bg-danger/10 border border-danger/20 text-danger p-4 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span className="text-sm font-medium">{error}</span>
            </div>
            <button onClick={fetchUsers} className="btn text-xs bg-danger text-white px-3 py-1.5 rounded-lg">
              Retry
            </button>
          </div>
        )}

        {/* User Directory Table */}
        <section aria-label="User Directory" className="card overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <caption className="sr-only">List of system users</caption>
              <thead className="bg-cream dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                <tr>
                  <th scope="col" className="p-4 text-xs font-bold text-gray-500 uppercase">Name & Email</th>
                  <th scope="col" className="p-4 text-xs font-bold text-gray-500 uppercase">Role</th>
                  <th scope="col" className="p-4 text-xs font-bold text-gray-500 uppercase">College/Inst.</th>
                  <th scope="col" className="p-4 text-xs font-bold text-gray-500 uppercase">Joined Date</th>
                  <th scope="col" className="p-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="p-8">
                      <LoadingSkeleton />
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-12 text-center text-gray-500">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map(u => (
                    <tr key={u._id} className="hover:bg-cream dark:hover:bg-gray-800/40 transition-colors">
                      <td className="p-4 whitespace-nowrap">
                        <div className="font-bold text-gray-900 dark:text-white">{u.name}</div>
                        <div className="text-xs text-gray-500">{u.email}</div>
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <span className={`px-3 py-1 text-xs font-bold rounded-full capitalize border ${
                          u.role === 'admin' 
                            ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800' :
                          u.role === 'teacher' 
                            ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800' :
                              'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4 whitespace-nowrap text-sm text-gray-500">{u.college || '-'}</td>
                      <td className="p-4 whitespace-nowrap text-sm text-gray-500">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '-'}
                      </td>
                      <td className="p-4 whitespace-nowrap text-right">
                        <button 
                          type="button" 
                          onClick={() => setDeleteModal({ show: true, id: u._id })} 
                          className="p-2 text-danger hover:bg-danger/10 rounded-xl transition-colors focus:outline-none" 
                          aria-label={`Delete user ${u.name}`} 
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" aria-hidden="true" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Delete User Modal */}
      <Modal isOpen={deleteModal.show} onClose={() => setDeleteModal({ show: false, id: null })} title="Delete User Account">
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-danger/10 text-danger rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Delete this user account?</h3>
          <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
            This will permanently remove the user and all associated data from MongoDB. This action cannot be undone.
          </p>
          <div className="flex gap-4 justify-center">
            <button onClick={() => setDeleteModal({ show: false, id: null })} className="btn btn-outline">
              Cancel
            </button>
            <button onClick={handleDelete} className="btn bg-danger hover:bg-danger/90 text-white font-bold px-6">
              Yes, Delete User
            </button>
          </div>
        </div>
      </Modal>
    </PageTransition>
  );
};

export default UserManagementPage;
