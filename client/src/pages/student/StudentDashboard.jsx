import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/StatCard';
import PageTransition from '../../components/PageTransition';
import PerformanceTrendChart from '../../components/PerformanceTrendChart';
import { BookOpen, Target, Award, CheckCircle, Clock, ArrowRight, Activity, Calendar } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { LightPieTooltip } from '../../components/common/LightChartTooltip';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

const ALL_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const FULL_MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const currentMonthIndex = new Date().getMonth();
const activeMonthsShort = ALL_MONTHS.slice(0, currentMonthIndex + 1);
const lastMonthShort = activeMonthsShort[activeMonthsShort.length - 1];
const lastMonthFull = FULL_MONTH_NAMES[currentMonthIndex];

const StudentDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalAttempts: 0,
    averageScore: 0,
    bestScore: 0,
    passedExams: 0,
    failedExams: 0,
    passCount: 0,
    failCount: 0,
    passRate: 0,
    recentAttempts: [],
    monthlyData: activeMonthsShort.map(m => ({ month: m, score: 0 })),
    passFailData: [
      { name: 'Pass', value: 0 },
      { name: 'Fail', value: 0 }
    ]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [statsRes, attemptsRes] = await Promise.all([
          api.get('/users/student-stats'),
          api.get('/attempts/my-attempts')
        ]);
        const s = statsRes.data?.data || {};
        const attempts = attemptsRes.data?.data || [];

        const passCount = s.passCount !== undefined ? s.passCount : attempts.filter(a => a.passed).length;
        const failCount = s.failCount !== undefined ? s.failCount : attempts.filter(a => !a.passed).length;
        const totalAttempts = s.totalAttempts || attempts.length;
        const passRate = s.passRate !== undefined ? s.passRate : (totalAttempts > 0 ? Math.round((passCount / totalAttempts) * 100) : 0);

        let monthlyData = activeMonthsShort.map(m => ({ month: m, score: 0 }));
        if (s.monthlyTrend && Array.isArray(s.monthlyTrend)) {
          monthlyData = s.monthlyTrend.map(item => ({
            month: item.month,
            score: item.averageScore || 0
          }));
        }

        setStats({
          totalAttempts,
          averageScore: s.avgScore || 0,
          bestScore: s.bestScore || (attempts.length ? Math.max(...attempts.map(a => a.percentage || 0)) : 0),
          passedExams: passCount,
          failedExams: failCount,
          passCount,
          failCount,
          passRate,
          recentAttempts: attempts.slice(0, 4),
          monthlyData,
          passFailData: [
            { name: 'Pass', value: passCount },
            { name: 'Fail', value: failCount }
          ]
        });
      } catch (error) {
        console.error('Failed to fetch actual student stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const COLORS = ['#16A34A', '#DC2626'];

  if (loading) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-gray-200 dark:bg-[#162032] rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="space-y-8 max-w-7xl mx-auto font-sans pb-16">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between md:items-end gap-4 bg-white dark:bg-[#162032] p-8 rounded-3xl border border-gray-100 dark:border-[#2A3441] shadow-xl relative overflow-hidden">
          <div className="space-y-1 z-10">
            <h1 className="text-3xl font-black text-gray-900 dark:text-[#F8FAFC] tracking-tight">
              Welcome back, {user?.name || 'Student'}! 👋
            </h1>
            <p className="text-gray-500 dark:text-[#CBD5E1] text-base">
              Track your real-time assessment performance and test history.
            </p>
          </div>
          
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 rounded-full font-extrabold text-sm z-10 w-fit border border-emerald-500/20">
            <Activity className="w-4 h-4" /> Live MongoDB Telemetry Active
          </div>
        </header>

        {/* Premium Stat Cards Grid */}
        <section aria-label="Quick Statistics" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Attempts" value={stats.totalAttempts} icon={BookOpen} colorClass="text-primary bg-primary/10" />
          <StatCard title="Average Score" value={`${stats.averageScore}%`} icon={Target} colorClass="text-amber-600 bg-amber-500/10" delay={0.1} />
          <StatCard title="Best Score" value={`${stats.bestScore}%`} icon={Award} colorClass="text-emerald-600 bg-emerald-500/10" delay={0.2} />
          <StatCard title="Passed Exams" value={stats.passedExams} icon={CheckCircle} colorClass="text-blue-600 bg-blue-500/10" delay={0.3} />
        </section>

        {/* Charts & Analytics Grid */}
        <section aria-label="Performance Analytics" className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Dynamic Performance Trend (Line Chart) */}
          <article className="col-span-1 lg:col-span-2 bg-white dark:bg-[#162032] p-6 md:p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-[#2A3441] flex flex-col justify-between">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-black text-gray-900 dark:text-[#F8FAFC]">
                  Performance Trend (Jan – {lastMonthShort})
                </h2>
                <p className="text-xs text-gray-500 dark:text-[#94A3B8] mt-1">
                  Average score trajectory across January – {lastMonthFull}
                </p>
              </div>
              <span className="text-xs font-extrabold text-emerald-700 bg-emerald-500/10 dark:text-emerald-400 dark:bg-emerald-500/20 px-3 py-1.5 rounded-full uppercase tracking-wider border border-emerald-500/20">
                Jan – {lastMonthShort}
              </span>
            </div>
            
            <div className="h-72">
              <PerformanceTrendChart data={stats.monthlyData} dataKey="score" />
            </div>
          </article>

          {/* Synchronized Pass vs Fail Donut Chart */}
          <article className="bg-white dark:bg-[#162032] p-6 md:p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-[#2A3441] flex flex-col">
            <div className="mb-4">
              <h2 className="text-xl font-black text-gray-900 dark:text-[#F8FAFC]">Pass vs Fail</h2>
              <p className="text-xs text-gray-500 dark:text-[#94A3B8] mt-1">
                Calculated dynamically from MongoDB attempt history
              </p>
            </div>

            <div className="h-56 relative flex items-center justify-center my-auto">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.passFailData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {stats.passFailData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<LightPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              
              {/* Center Donut Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-black text-gray-900 dark:text-[#F8FAFC]">
                  {stats.passRate}%
                </span>
                <span className="text-xs font-bold text-gray-400 dark:text-[#94A3B8] uppercase tracking-wider">
                  Pass Rate
                </span>
              </div>
            </div>

            {/* Counts Legend Row */}
            <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-[#2A3441]">
              <div className="bg-emerald-500/10 dark:bg-emerald-500/20 p-3 rounded-xl border border-emerald-500/20 flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" /> Passed
                </span>
                <span className="text-lg font-black text-emerald-700 dark:text-emerald-400">{stats.passCount}</span>
              </div>

              <div className="bg-rose-500/10 dark:bg-rose-500/20 p-3 rounded-xl border border-rose-500/20 flex items-center justify-between">
                <span className="text-xs font-bold text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600" /> Failed
                </span>
                <span className="text-lg font-black text-rose-700 dark:text-rose-400">{stats.failCount}</span>
              </div>
            </div>
          </article>
        </section>

        {/* Recent Attempts Feed */}
        {stats.recentAttempts && stats.recentAttempts.length > 0 && (
          <section className="bg-white dark:bg-[#162032] p-6 md:p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-[#2A3441]">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-black text-gray-900 dark:text-[#F8FAFC]">Recent Attempts</h2>
                <p className="text-xs text-gray-500 dark:text-[#94A3B8] mt-1">Your latest exam submissions</p>
              </div>
              <Link to="/student/history" className="text-xs font-extrabold text-primary dark:text-[#D4A017] hover:underline flex items-center gap-1">
                View All History <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.recentAttempts.map((att) => (
                <Link
                  key={att._id}
                  to={`/student/results/${att._id}`}
                  className="p-4 rounded-2xl bg-cream/50 dark:bg-[#1C2A3D] border border-gray-100 dark:border-[#2A3441] hover:border-primary/40 hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-xs font-bold text-gray-500 dark:text-[#CBD5E1] truncate max-w-[120px]">
                      {att.exam?.subject || 'General'}
                    </span>
                    <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full border ${
                      att.passed ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-rose-500/10 text-rose-600 border-rose-500/20'
                    }`}>
                      {att.passed ? 'Passed' : 'Failed'}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-gray-900 dark:text-[#F8FAFC] group-hover:text-primary transition-colors line-clamp-1 mb-3">
                    {att.exam?.title || 'Exam Assessment'}
                  </h4>

                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-[#94A3B8] pt-2 border-t border-gray-200/50 dark:border-[#2A3441]">
                    <span className="font-bold text-gray-900 dark:text-[#F8FAFC]">{att.percentage ? att.percentage.toFixed(0) : 0}%</span>
                    <span>{new Date(att.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </PageTransition>
  );
};

export default StudentDashboard;
