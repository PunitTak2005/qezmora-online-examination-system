import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, Maximize2, ExternalLink, Search, RefreshCcw, 
  AlertOctagon, Filter, CheckCircle, Clock, Eye, EyeOff, Copy, AlertCircle 
} from 'lucide-react';
import api from '../../api/axios';
import PageTransition from '../../components/PageTransition';
import StatCard from '../../components/StatCard';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import Tooltip from '../../components/ui/Tooltip';

const ExamIntegrityPage = () => {
  const [violations, setViolations] = useState([]);
  const [stats, setStats] = useState({
    totalViolations: 0,
    fullscreenExits: 0,
    tabSwitches: 0,
    windowBlurs: 0,
    copyPasteAttempts: 0,
    autoSubmittedCount: 0
  });
  
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchIntegrityData = async () => {
    try {
      setLoading(true);
      const [violationsRes, statsRes] = await Promise.all([
        api.get(`/violations?page=${page}&limit=10&type=${selectedType}&search=${search}`),
        api.get('/violations/stats')
      ]);

      setViolations(violationsRes.data?.data || []);
      setTotalPages(violationsRes.data?.pages || 1);
      setStats(statsRes.data?.data || {});
    } catch (err) {
      console.error('Failed to load exam integrity data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntegrityData();
  }, [page, selectedType]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchIntegrityData();
  };

  const getViolationBadge = (typeStr) => {
    const type = (typeStr || '').toLowerCase().replace(/\s+/g, '_');
    
    if (type.includes('fullscreen') || type.includes('screen')) {
      return (
        <Tooltip title="Fullscreen Exit" content="Student exited Secure Exam Mode container." position="top">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 dark:bg-red-950/70 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900/60 text-xs font-extrabold rounded-full whitespace-nowrap shadow-xs">
            <Maximize2 className="w-3.5 h-3.5 shrink-0" />
            Fullscreen Exit
          </span>
        </Tooltip>
      );
    }
    
    if (type.includes('tab') || type.includes('switch')) {
      return (
        <Tooltip title="Tab Switch" content="Student navigated to another browser tab." position="top">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-100 dark:bg-orange-950/70 text-orange-800 dark:text-orange-300 border border-orange-200 dark:border-orange-900/60 text-xs font-extrabold rounded-full whitespace-nowrap shadow-xs">
            <ExternalLink className="w-3.5 h-3.5 shrink-0" />
            Tab Switch
          </span>
        </Tooltip>
      );
    }

    if (type.includes('blur')) {
      return (
        <Tooltip title="Window Blur" content="Student unfocused or minimized the exam window." position="top">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900/60 text-xs font-extrabold rounded-full whitespace-nowrap shadow-xs">
            <Eye className="w-3.5 h-3.5 shrink-0" />
            Window Blur
          </span>
        </Tooltip>
      );
    }

    if (type.includes('visibility')) {
      return (
        <Tooltip title="Visibility Change" content="Page visibility status was lost during the test." position="top">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-100 dark:bg-purple-950/70 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-900/60 text-xs font-extrabold rounded-full whitespace-nowrap shadow-xs">
            <EyeOff className="w-3.5 h-3.5 shrink-0" />
            Visibility Change
          </span>
        </Tooltip>
      );
    }

    if (type.includes('copy') || type.includes('paste')) {
      return (
        <Tooltip title="Copy Attempt" content="Student attempted copy or paste keystrokes." position="top">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-900/60 text-xs font-extrabold rounded-full whitespace-nowrap shadow-xs">
            <Copy className="w-3.5 h-3.5 shrink-0" />
            Copy Attempt
          </span>
        </Tooltip>
      );
    }

    return (
      <Tooltip title="Security Violation" content={`Logged violation type: ${typeStr}`} position="top">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 text-xs font-extrabold rounded-full whitespace-nowrap shadow-xs capitalize">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          {typeStr || 'Violation'}
        </span>
      </Tooltip>
    );
  };

  return (
    <PageTransition>
      <div className="space-y-8 max-w-7xl mx-auto font-sans">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
              <ShieldAlert className="w-8 h-8 text-primary" /> Exam Integrity & Security Log
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
              Real-time focus monitoring, tab switch detection, and security violation logs recorded during student assessments.
            </p>
          </div>
          <button 
            onClick={fetchIntegrityData}
            className="btn bg-white dark:bg-[#162032] border border-gray-200 dark:border-[#2A3441] text-gray-700 dark:text-gray-200 font-bold px-4 py-2.5 rounded-xl gap-2 shadow-sm hover:border-primary transition-colors"
          >
            <RefreshCcw className="w-4 h-4" /> Refresh Audit Logs
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Violations" value={stats.totalViolations || 0} icon={ShieldAlert} colorClass="text-red-600 bg-red-100 dark:bg-red-950/50" />
          <StatCard title="Tab Switches" value={stats.tabSwitches || 0} icon={ExternalLink} colorClass="text-amber-600 bg-amber-100 dark:bg-amber-950/50" delay={0.1} />
          <StatCard title="Fullscreen Exits" value={stats.fullscreenExits || 0} icon={Maximize2} colorClass="text-purple-600 bg-purple-100 dark:bg-purple-950/50" delay={0.2} />
          <StatCard title="Auto-Submitted Exams" value={stats.autoSubmittedCount || 0} icon={AlertOctagon} colorClass="text-emerald-600 bg-emerald-100 dark:bg-emerald-950/50" delay={0.3} />
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white dark:bg-[#162032] p-6 rounded-3xl border border-gray-200 dark:border-[#2A3441] shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            
            <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by student name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-cream/40 dark:bg-gray-800/80 text-sm font-medium focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
              />
            </form>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <Filter className="w-4 h-4 text-gray-400 hidden sm:block" />
              <select
                value={selectedType}
                onChange={(e) => { setSelectedType(e.target.value); setPage(1); }}
                className="w-full md:w-auto px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-cream/40 dark:bg-gray-800/80 text-sm font-bold text-gray-700 dark:text-gray-200 outline-none focus:border-primary"
              >
                <option value="All">All Violation Types</option>
                <option value="tab_switch">Tab Switch</option>
                <option value="fullscreen_exit">Fullscreen Exit</option>
                <option value="window_blur">Window Blur</option>
                <option value="copy_paste_attempt">Copy/Paste Attempt</option>
              </select>
            </div>

          </div>
        </div>

        {/* Violations Table */}
        <div className="bg-white dark:bg-[#162032] rounded-3xl border border-gray-200 dark:border-[#2A3441] shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 space-y-4">
              <LoadingSkeleton height="60px" />
              <LoadingSkeleton height="60px" />
              <LoadingSkeleton height="60px" />
            </div>
          ) : violations.length === 0 ? (
            <div className="text-center py-20 p-6">
              <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
              <h3 className="text-xl font-black text-gray-900 dark:text-white">No Security Violations Logged</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                All monitored exams are operating with clean focus telemetry records.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-[#2A3441] text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 bg-cream/50 dark:bg-gray-800/60 sticky top-0 z-10 backdrop-blur-md">
                    <th className="py-4 px-5 min-w-[200px] w-[220px]">Student</th>
                    <th className="py-4 px-5 min-w-[200px] w-[240px]">Exam Title</th>
                    <th className="py-4 px-5 min-w-[190px] w-[210px]">Violation Type</th>
                    <th className="py-4 px-5 text-center min-w-[100px] w-[120px]">Warning #</th>
                    <th className="py-4 px-5 min-w-[170px] w-[180px]">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-[#2A3441] text-sm font-medium text-gray-700 dark:text-gray-300">
                  {violations.map((v) => (
                    <tr key={v._id} className="hover:bg-cream/50 dark:hover:bg-gray-800/50 transition-colors duration-150">
                      <td className="py-4 px-5 min-w-[200px]">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary/10 text-primary dark:bg-amber-500/10 dark:text-amber-400 font-black flex items-center justify-center text-xs shrink-0">
                            {v.student?.name?.charAt(0) || 'U'}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-extrabold text-gray-900 dark:text-white truncate">{v.student?.name || 'Unknown Student'}</div>
                            <div className="text-xs text-gray-400 truncate">{v.student?.email || 'N/A'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-5 min-w-[200px] font-bold text-gray-900 dark:text-white leading-snug">
                        {v.exam?.title || 'General Examination'}
                      </td>
                      <td className="py-4 px-5 min-w-[190px] whitespace-normal break-words">
                        {getViolationBadge(v.type)}
                      </td>
                      <td className="py-4 px-5 text-center min-w-[100px]">
                        <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full font-black text-xs ${
                          v.warningNumber >= 3 ? 'bg-red-500 text-white shadow-xs' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                        }`}>
                          {v.warningNumber || 1}
                        </span>
                      </td>
                      <td className="py-4 px-5 min-w-[170px] text-xs font-semibold text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 shrink-0 text-gray-400" />
                          <span>{new Date(v.createdAt).toLocaleString()}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-gray-200 dark:border-[#2A3441] flex justify-between items-center text-sm font-bold text-gray-600 dark:text-gray-400">
              <span>Page {page} of {totalPages}</span>
              <div className="flex gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  className="btn border border-gray-200 dark:border-gray-700 py-2 px-4 rounded-xl disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Previous
                </button>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  className="btn border border-gray-200 dark:border-gray-700 py-2 px-4 rounded-xl disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </PageTransition>
  );
};

export default ExamIntegrityPage;
