import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { 
  FolderTree, Plus, Edit, Trash2, Search, RefreshCcw, 
  Code, Calculator, FlaskConical, BookA, Target, Globe, Award, 
  Monitor, Newspaper, BrainCircuit, Music, BookOpen, Cpu, Layers, Zap, Check
} from 'lucide-react';
import PageTransition from '../../components/PageTransition';
import Modal from '../../components/Modal';
import LoadingSkeleton from '../../components/LoadingSkeleton';

// Map icon names to Lucide Icon components
const ICON_MAP = {
  Code,
  Calculator,
  FlaskConical,
  BookA,
  Target,
  Globe,
  Award,
  Monitor,
  Newspaper,
  BrainCircuit,
  Music,
  BookOpen,
  Cpu,
  Layers,
  Zap
};

// Preset Official Category Colors with HEX and styling
const COLOR_PRESETS = [
  { id: 'indigo', name: 'Indigo', hex: '#4F46E5', bg: 'bg-indigo-50 dark:bg-indigo-950/40', text: 'text-indigo-600 dark:text-indigo-400', border: 'border-indigo-200 dark:border-indigo-800' },
  { id: 'blue', name: 'Blue', hex: '#2563EB', bg: 'bg-blue-50 dark:bg-blue-950/40', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800' },
  { id: 'green', name: 'Green', hex: '#16A34A', bg: 'bg-emerald-50 dark:bg-emerald-950/40', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800' },
  { id: 'red', name: 'Red', hex: '#DC2626', bg: 'bg-red-50 dark:bg-red-950/40', text: 'text-red-600 dark:text-red-400', border: 'border-red-200 dark:border-red-800' },
  { id: 'orange', name: 'Orange', hex: '#EA580C', bg: 'bg-orange-50 dark:bg-orange-950/40', text: 'text-orange-600 dark:text-orange-400', border: 'border-orange-200 dark:border-orange-800' },
  { id: 'amber', name: 'Amber', hex: '#D97706', bg: 'bg-amber-50 dark:bg-amber-950/40', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800' },
  { id: 'purple', name: 'Purple', hex: '#7C3AED', bg: 'bg-purple-50 dark:bg-purple-950/40', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-200 dark:border-purple-800' },
  { id: 'teal', name: 'Teal', hex: '#0D9488', bg: 'bg-teal-50 dark:bg-teal-950/40', text: 'text-teal-600 dark:text-teal-400', border: 'border-teal-200 dark:border-teal-800' },
  { id: 'cyan', name: 'Cyan', hex: '#0891B2', bg: 'bg-cyan-50 dark:bg-cyan-950/40', text: 'text-cyan-600 dark:text-cyan-400', border: 'border-cyan-200 dark:border-cyan-800' },
  { id: 'violet', name: 'Violet', hex: '#9333EA', bg: 'bg-violet-50 dark:bg-violet-950/40', text: 'text-violet-600 dark:text-violet-400', border: 'border-violet-200 dark:border-violet-800' },
  { id: 'pink', name: 'Pink', hex: '#EC4899', bg: 'bg-pink-50 dark:bg-pink-950/40', text: 'text-pink-600 dark:text-pink-400', border: 'border-pink-200 dark:border-pink-800' }
];

const CategoryManagementPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  
  // Search & Filter State
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  
  // Custom Icon & Color Selection in Modal
  const [selectedIcon, setSelectedIcon] = useState('Code');
  const [selectedColor, setSelectedColor] = useState('indigo');
  const [selectedStatus, setSelectedStatus] = useState('Active');
  
  // Delete Modal
  const [deleteModal, setDeleteModal] = useState({ show: false, category: null });

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get('/categories');
      setCategories(res.data.data || []);
    } catch (error) {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openModal = (category = null) => {
    setEditingCategory(category);
    if (category) {
      setValue('name', category.name);
      setValue('description', category.description);
      setSelectedIcon(category.icon || 'Code');
      setSelectedColor(category.color || 'indigo');
      setSelectedStatus(category.status || 'Active');
    } else {
      reset();
      setSelectedIcon('Code');
      setSelectedColor('indigo');
      setSelectedStatus('Active');
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    reset();
  };

  const onSubmit = async (formData) => {
    try {
      const payload = {
        ...formData,
        icon: selectedIcon,
        color: selectedColor,
        status: selectedStatus
      };

      if (editingCategory) {
        await api.put(`/categories/${editingCategory._id}`, payload);
        toast.success('Category updated successfully');
      } else {
        await api.post('/categories', payload);
        toast.success('Category created successfully');
      }
      fetchCategories();
      closeModal();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving category');
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.category) return;
    try {
      await api.delete(`/categories/${deleteModal.category._id}`);
      toast.success('Category deleted successfully');
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error deleting category');
    } finally {
      setDeleteModal({ show: false, category: null });
    }
  };

  const getColorConfig = (colorId) => {
    return COLOR_PRESETS.find(c => c.id === colorId) || COLOR_PRESETS[0];
  };

  const renderCategoryIcon = (iconName, colorId) => {
    const IconComponent = ICON_MAP[iconName] || BookOpen;
    const config = getColorConfig(colorId);
    return (
      <div 
        className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110" 
        style={{ backgroundColor: `${config.hex}15`, color: config.hex, border: `1px solid ${config.hex}30` }}
      >
        <IconComponent className="w-5 h-5" />
      </div>
    );
  };

  // Safe Filtering & Sorting
  const filteredCategories = (Array.isArray(categories) ? categories : [])
    .filter(cat => {
      const matchSearch = cat.name.toLowerCase().includes(search.toLowerCase()) || 
                          cat.description.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'All' || (cat.status || 'Active') === statusFilter;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'exams') return (b.examCount || 0) - (a.examCount || 0);
      if (sortBy === 'questions') return (b.questionCount || 0) - (a.questionCount || 0);
      return 0;
    });

  return (
    <PageTransition>
      <div className="space-y-6 max-w-7xl mx-auto font-sans">
        
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-primary/10 to-transparent p-6 rounded-3xl border border-primary/10">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
              <FolderTree className="h-8 w-8 text-primary" />
              Category Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1 font-medium">Manage subject domains, icons, colors, and live exam allocations.</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={fetchCategories} 
              className="btn bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 gap-2 text-xs py-2.5 px-4"
            >
              <RefreshCcw className="w-4 h-4" /> Refresh
            </button>
            <button 
              onClick={() => openModal()} 
              className="btn bg-primary hover:bg-primary-dark text-white font-bold py-2.5 px-5 rounded-xl shadow-lg shadow-primary/20 gap-2 text-sm flex items-center"
            >
              <Plus className="w-5 h-5" /> Add Category
            </button>
          </div>
        </header>

        {/* Search & Filter Bar */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Search category name or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-950 dark:text-white text-sm font-medium"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Status Filter */}
            <div className="flex gap-1.5 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
              {['All', 'Active', 'Draft', 'Archived'].map(st => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    statusFilter === st 
                      ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm' 
                      : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Sort Selector */}
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs font-bold text-gray-700 dark:text-gray-300"
            >
              <option value="name">Sort by Name</option>
              <option value="exams">Sort by Exam Count</option>
              <option value="questions">Sort by Question Count</option>
            </select>
          </div>
        </div>

        {/* Category Table */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8"><LoadingSkeleton /></div>
          ) : filteredCategories.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-bold">
                    <th className="p-5">Category</th>
                    <th className="p-5">Description</th>
                    <th className="p-5">Icon & Color Badge</th>
                    <th className="p-5 text-center">Exams</th>
                    <th className="p-5 text-center">Questions</th>
                    <th className="p-5">Status</th>
                    <th className="p-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                  {filteredCategories.map((category) => {
                    const colorConfig = getColorConfig(category.color);
                    return (
                      <tr key={category._id} className="hover:bg-cream/40 dark:hover:bg-gray-800/30 transition-colors group">
                        <td className="p-5">
                          <div className="flex items-center gap-3">
                            {renderCategoryIcon(category.icon, category.color)}
                            <span className="font-bold text-gray-900 dark:text-white text-base">{category.name}</span>
                          </div>
                        </td>
                        <td className="p-5 max-w-xs">
                          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">{category.description}</p>
                        </td>
                        <td className="p-5">
                          <div className="flex items-center gap-2">
                            <span 
                              className="px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 border shadow-2xl"
                              style={{ 
                                backgroundColor: `${colorConfig.hex}15`, 
                                color: colorConfig.hex,
                                borderColor: `${colorConfig.hex}40`
                              }}
                            >
                              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colorConfig.hex }}></span>
                              {colorConfig.name}
                            </span>
                          </div>
                        </td>
                        <td className="p-5 text-center font-black text-gray-900 dark:text-white">
                          <span className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-lg text-xs">
                            {category.examCount || 0}
                          </span>
                        </td>
                        <td className="p-5 text-center font-black text-gray-900 dark:text-white">
                          <span className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-lg text-xs">
                            {category.questionCount || 0}
                          </span>
                        </td>
                        <td className="p-5">
                          <span className={`px-3 py-1 text-xs font-bold rounded-full border ${
                            category.status === 'Draft' ? 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800' :
                            category.status === 'Archived' ? 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700' :
                            'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800'
                          }`}>
                            {category.status || 'Active'}
                          </span>
                        </td>
                        <td className="p-5 text-right space-x-2">
                          <button 
                            onClick={() => openModal(category)} 
                            className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-primary hover:text-white transition-colors"
                            title="Edit Category"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => setDeleteModal({ show: true, category })} 
                            className="p-2 rounded-xl bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 hover:bg-red-600 hover:text-white transition-colors"
                            title="Delete Category"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-16 text-center text-gray-500">
              <FolderTree className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">No categories found</h3>
              <p className="text-sm text-gray-500 mb-6">Create a new category to organize exams across Qezmora.</p>
              <button onClick={() => openModal()} className="btn bg-primary text-white font-bold px-6 py-2.5 rounded-xl gap-2 text-sm inline-flex items-center">
                <Plus className="w-4 h-4" /> Add Category
              </button>
            </div>
          )}
        </div>

        {/* Add / Edit Category Modal */}
        {isModalOpen && (
          <Modal isOpen={isModalOpen} onClose={closeModal} title={editingCategory ? 'Edit Category' : 'Create Category'}>
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
              
              <div>
                <label className="font-bold text-sm text-gray-700 dark:text-gray-300 block mb-2">Category Name *</label>
                <input 
                  {...register('name', { required: 'Category name is required' })} 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 dark:bg-gray-950 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none" 
                  placeholder="e.g. Programming, Mathematics" 
                />
                {errors.name && <p className="text-xs text-danger font-bold mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="font-bold text-sm text-gray-700 dark:text-gray-300 block mb-2">Description *</label>
                <textarea 
                  {...register('description', { required: 'Description is required' })} 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 dark:bg-gray-950 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none resize-none" 
                  rows="3" 
                  placeholder="Brief description of the domain..." 
                />
                {errors.description && <p className="text-xs text-danger font-bold mt-1">{errors.description.message}</p>}
              </div>

              {/* Status Picker */}
              <div>
                <label className="font-bold text-sm text-gray-700 dark:text-gray-300 block mb-2">Status</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Active', 'Draft', 'Archived'].map(st => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setSelectedStatus(st)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors ${
                        selectedStatus === st
                          ? 'bg-primary text-white border-primary shadow-sm'
                          : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Searchable Icon Picker */}
              <div>
                <label className="font-bold text-sm text-gray-700 dark:text-gray-300 block mb-2">Select Icon</label>
                <div className="grid grid-cols-5 gap-2.5 p-3 bg-gray-50 dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-800 max-h-36 overflow-y-auto">
                  {Object.keys(ICON_MAP).map(iconKey => {
                    const IconComp = ICON_MAP[iconKey];
                    return (
                      <button
                        key={iconKey}
                        type="button"
                        onClick={() => setSelectedIcon(iconKey)}
                        className={`p-3 rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${
                          selectedIcon === iconKey
                            ? 'bg-primary text-white shadow-md scale-105'
                            : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                      >
                        <IconComp className="w-5 h-5" />
                        <span className="text-[10px] font-bold truncate max-w-full">{iconKey}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Preset Visual Color Picker */}
              <div>
                <label className="font-bold text-sm text-gray-700 dark:text-gray-300 block mb-2">Select Color Theme</label>
                <div className="grid grid-cols-4 gap-2">
                  {COLOR_PRESETS.map(c => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelectedColor(c.id)}
                      className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-all text-xs font-bold ${
                        selectedColor === c.id 
                          ? 'border-gray-900 dark:border-white shadow-md scale-105' 
                          : 'border-gray-200 dark:border-gray-800 hover:border-gray-400'
                      }`}
                      style={{ backgroundColor: `${c.hex}15`, color: c.hex }}
                    >
                      <span className="w-3.5 h-3.5 rounded-full shrink-0" style={{ backgroundColor: c.hex }}></span>
                      <span className="truncate">{c.name}</span>
                      {selectedColor === c.id && <Check className="w-3.5 h-3.5 ml-auto" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Preview Card */}
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800">
                <span className="text-[10px] font-bold uppercase text-gray-400 block mb-2">Live Badge Preview</span>
                <div className="flex items-center gap-3">
                  {renderCategoryIcon(selectedIcon, selectedColor)}
                  <div>
                    <span className="font-bold text-sm text-gray-900 dark:text-white block">
                      {editingCategory?.name || 'Category Name'}
                    </span>
                    <span 
                      className="px-2.5 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1.5 border mt-1"
                      style={{ 
                        backgroundColor: `${getColorConfig(selectedColor).hex}15`, 
                        color: getColorConfig(selectedColor).hex,
                        borderColor: `${getColorConfig(selectedColor).hex}40`
                      }}
                    >
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: getColorConfig(selectedColor).hex }}></span>
                      {getColorConfig(selectedColor).name} Theme
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <button type="button" onClick={closeModal} className="btn btn-outline">Cancel</button>
                <button type="submit" className="btn bg-primary hover:bg-primary-dark text-white font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-primary/20">
                  {editingCategory ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </Modal>
        )}

        {/* Delete Modal */}
        {deleteModal.show && (
          <Modal isOpen={deleteModal.show} onClose={() => setDeleteModal({ show: false, category: null })} title="Delete Category">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-danger/10 text-danger rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Delete {deleteModal.category?.name}?</h3>
              <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
                Are you sure you want to delete this category? If exams or questions are associated with it, deletion will be blocked safely.
              </p>
              <div className="flex gap-4 justify-center">
                <button onClick={() => setDeleteModal({ show: false, category: null })} className="btn btn-outline">
                  Cancel
                </button>
                <button onClick={handleDelete} className="btn bg-danger hover:bg-danger/90 text-white font-bold px-6">
                  Delete Category
                </button>
              </div>
            </div>
          </Modal>
        )}

      </div>
    </PageTransition>
  );
};

export default CategoryManagementPage;
