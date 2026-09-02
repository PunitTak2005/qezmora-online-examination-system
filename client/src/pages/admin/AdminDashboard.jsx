import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, GraduationCap, Briefcase, FileText, CheckCircle, BarChart2, Activity, Award, Mail, RefreshCcw, AlertTriangle } from 'lucide-react';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import api from '../../api/axios';
import PageTransition from '../../components/PageTransition';
import StatCard from '../../components/StatCard';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import PerformanceTrendChart from '../../components/PerformanceTrendChart';

const ALL_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const FULL_MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const AdminDashboard = () => {
  const currentMonthIdx = new Date().getMonth();
  const lastMonthShort = ALL_MONTHS[currentMonthIdx];
  const lastMonthFull = FULL_MONTH_NAMES[currentMonthIdx];
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/users/dashboard-stats');
      setStats(res.data.data);
    } catch (err) {
      console.error('Failed to fetch admin stats:', err);
      setError(err.response?.data?.message || 'Failed to load dashboard statistics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const COLORS = ['#10B981', '#EF4444', '#F59E0B', '#3B82F6'];

  if (loading) return (
    <div className="space-y-6 max-w-7xl mx-auto p-4">
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4"><LoadingSkeleton /><LoadingSkeleton /><LoadingSkeleton /><LoadingSkeleton /><LoadingSkeleton /><LoadingSkeleton /></div>
      <div className="grid lg:grid-cols-2 gap-6"><LoadingSkeleton height="300px" /><LoadingSkeleton height="300px" /></div>
    </div>
  );

  if (error || !stats) return (
    <div className="text-center py-20 px-4 max-w-md mx-auto">
      <div className="w-16 h-16 bg-danger/10 text-danger rounded-full flex items-center justify-center mx-auto mb-4">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Failed to Load Admin Stats</h3>
      <p className="text-gray-500 text-sm mb-6">{error || 'Could not connect to backend server.'}</p>
      <button onClick={fetchStats} className="btn bg-primary text-white font-bold px-6 py-2.5 rounded-xl gap-2 shadow-lg">
        <RefreshCcw className="w-4 h-4" /> Retry Connection
      </button>
    </div>
  );

  return (
    <PageTransition>
      <div className="space-y-6 max-w-7xl mx-auto font-sans">
        <header className="flex flex-col md:flex-row justify-between md:items-end gap-4 bg-gradient-to-r from-primary/10 to-transparent p-6 rounded-3xl border border-primary/10">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Admin Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1 font-medium">Live, data-driven system analytics powered by MongoDB.</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={fetchStats} className="btn bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 gap-2 text-xs py-2 px-3">
              <RefreshCcw className="w-3.5 h-3.5" /> Refresh
            </button>
            <div className="text-sm font-bold text-gray-500 bg-white dark:bg-gray-800 px-4 py-2 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
              {new Date().toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
            </div>
          </div>
        </header>

        {/* Premium Stat Cards */}
        <section aria-label="System Statistics" className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          <StatCard title="Total Students" value={stats.students || 0} icon={GraduationCap} colorClass="bg-primary/10 text-primary dark:bg-primary/20" />
          <StatCard title="Total Teachers" value={stats.teachers || 0} icon={Briefcase} colorClass="bg-gold/10 text-gold dark:bg-gold/20" delay={0.1} />
          <StatCard title="Total Exams" value={stats.exams || 0} icon={FileText} colorClass="bg-orange-50 text-orange-600 dark:bg-orange-900/20" delay={0.2} />
          <StatCard title="Total Questions" value={stats.questions || 0} icon={CheckCircle} colorClass="bg-cyan-50 text-cyan-600 dark:bg-cyan-900/20" delay={0.3} />
          <StatCard title="Total Attempts" value={stats.attempts || 0} icon={BarChart2} colorClass="bg-pink-50 text-pink-600 dark:bg-pink-900/20" delay={0.4} />
          <StatCard title="Contact Messages" value={stats.totalMessages || 0} icon={Mail} colorClass="bg-amber-50 text-amber-600 dark:bg-amber-900/20" delay={0.5} />
        </section>

        {/* Analytics Section */}
        <section aria-label="Live Analytics" className="grid lg:grid-cols-3 gap-6">
          
          {/* Performance Trend Line Chart (12 Months) */}
          <article className="card p-6 lg:col-span-2 shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Performance Trend (Jan – {lastMonthShort})
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  System-wide average exam scores across January – {lastMonthFull}
                </p>
              </div>
              <span className="text-xs font-black bg-primary/10 text-primary px-3 py-1 rounded-full uppercase">
                Jan – {lastMonthShort}
              </span>
            </div>
            <div className="h-72">
              <PerformanceTrendChart data={stats.monthlyTrend || []} dataKey="averageScore" />
            </div>
          </article>

          {/* Pass vs Fail Donut Chart */}
          <article className="card p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Pass vs Fail Ratio</h2>
            <p className="text-sm text-gray-500 mb-4">Overall success metric across all completed exams.</p>
            <div className="flex-1 min-h-[250px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={stats.passVsFail} 
                    innerRadius="65%" 
                    outerRadius="90%" 
                    paddingAngle={5} 
                    dataKey="value"
                    stroke="none"
                  >
                    {stats.passVsFail?.map((entry, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    itemStyle={{ fontWeight: 'bold', color: '#111827' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '14px', fontWeight: 'bold', color: '#4B5563' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-8">
                <div className="text-center">
                  <span className="block text-3xl font-black text-gray-900 dark:text-white">{stats.attempts || 0}</span>
                  <span className="text-xs text-gray-500 font-bold uppercase">Attempts</span>
                </div>
              </div>
            </div>
          </article>
        </section>

        {/* Bottom Grid: Quick Actions & Activity Feed */}
        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* Quick Actions Panel */}
          <section className="lg:col-span-1 space-y-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" /> Quick Actions
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <Link to="/admin/exams" className="flex flex-col items-center justify-center gap-3 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:border-primary/50 hover:shadow-md hover:-translate-y-1 transition-all group">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="font-bold text-sm text-gray-700 dark:text-gray-300">View Exams</span>
              </Link>
              <Link to="/admin/users" className="flex flex-col items-center justify-center gap-3 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:border-success/50 hover:shadow-md hover:-translate-y-1 transition-all group">
                <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center text-success group-hover:bg-success group-hover:text-white transition-colors">
                  <Users className="w-5 h-5" />
                </div>
                <span className="font-bold text-sm text-gray-700 dark:text-gray-300">Manage Users</span>
              </Link>
              <Link to="/admin/categories" className="flex flex-col items-center justify-center gap-3 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:border-warning/50 hover:shadow-md hover:-translate-y-1 transition-all group">
                <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center text-warning group-hover:bg-warning group-hover:text-white transition-colors">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <span className="font-bold text-sm text-gray-700 dark:text-gray-300">Categories</span>
              </Link>
              <Link to="/admin/contact-messages" className="flex flex-col items-center justify-center gap-3 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:border-gold/50 hover:shadow-md hover:-translate-y-1 transition-all group">
                <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-white transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <span className="font-bold text-sm text-gray-700 dark:text-gray-300">Contact Messages</span>
              </Link>
            </div>
          </section>

          {/* Activity Feed */}
          <section className="lg:col-span-2 card overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
            <header className="p-5 border-b border-gray-100 dark:border-gray-700 bg-cream/50 dark:bg-gray-800/50 flex justify-between items-center">
              <h2 className="font-bold text-gray-900 dark:text-white">Recent System Activity</h2>
              <span className="text-xs font-bold text-gray-500 bg-white dark:bg-gray-900 px-3 py-1 rounded-full border border-gray-200 dark:border-gray-700">Live Updates</span>
            </header>
            <div className="p-2">
              <ul className="divide-y divide-gray-50 dark:divide-gray-800">
                {stats.recentActivity && stats.recentActivity.map((activity) => (
                  <li key={activity.id} className="p-4 flex items-center gap-4 hover:bg-cream dark:hover:bg-gray-800/50 rounded-xl transition-colors">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Users className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 dark:text-white truncate">{activity.user}</p>
                      <p className="text-sm text-gray-500 truncate">{activity.action}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-medium text-gray-400">
                        {new Date(activity.time).toLocaleDateString()}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>

        </div>
      </div>
    </PageTransition>
  );
};

export default AdminDashboard;
