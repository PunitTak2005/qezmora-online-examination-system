import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/StatCard';
import PageTransition from '../../components/PageTransition';
import PerformanceTrendChart from '../../components/PerformanceTrendChart';
import { BookOpen, Target, Award, CheckCircle } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { LightPieTooltip } from '../../components/common/LightChartTooltip';
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
    recentAttempts: [],
    monthlyData: activeMonthsShort.map(m => ({ month: m, score: 0 })),
    passFailData: []
  });
  const [loading, setLoading] = useState(true);

  // Dynamic baseline dataset ending at current month
  const mockScores = [65, 70, 85, 82, 90, 84, 79, 88, 92, 86, 91, 89];
  const mockMonthlyData = activeMonthsShort.map((m, idx) => ({
    month: m,
    score: mockScores[idx % mockScores.length]
  }));

  const mockData = {
    totalAttempts: 12,
    averageScore: 78,
    bestScore: 95,
    passedExams: 10,
    monthlyData: mockMonthlyData,
    passFailData: [
      { name: 'Pass', value: 10 },
      { name: 'Fail', value: 2 }
    ]
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [statsRes, attemptsRes] = await Promise.all([
          api.get('/users/student-stats'),
          api.get('/attempts/my-attempts')
        ]);
        const s = statsRes.data.data;
        const attempts = attemptsRes.data.data || [];

        // Build pass/fail data
        const passCount = attempts.filter(a => a.passed).length;
        const failCount = attempts.filter(a => !a.passed).length;

        // Map backend trend dataset up to current month
        let monthlyData = activeMonthsShort.map(m => ({ month: m, score: 0 }));
        if (s.monthlyTrend && Array.isArray(s.monthlyTrend)) {
          monthlyData = s.monthlyTrend.map(item => ({
            month: item.month,
            score: item.averageScore || 0
          }));
        }

        setStats({
          totalAttempts: s.examsTaken || 0,
          averageScore: s.avgScore || 0,
          bestScore: attempts.length ? Math.max(...attempts.map(a => a.percentage)) : 0,
          passedExams: s.passedExams || 0,
          recentAttempts: attempts.slice(0, 3),
          monthlyData: monthlyData,
          passFailData: [
            { name: 'Pass', value: passCount || 0 },
            { name: 'Fail', value: failCount || 0 }
          ]
        });
      } catch (error) {
        console.log('Using mock data, failed to fetch actual stats');
        setStats(mockData);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const COLORS = ['#0F5132', '#DC2626'];

  if (loading) {
    return <div className="animate-pulse h-full bg-gray-200 dark:bg-gray-800 rounded-xl"></div>;
  }

  return (
    <PageTransition>
      <div className="space-y-6 font-sans">
        <header>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back, {user?.name}!</h1>
          <p className="text-gray-500 dark:text-gray-400">Here's your learning progress overview.</p>
        </header>

        {/* Stats Grid */}
        <section aria-label="Quick Statistics" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Attempts" value={stats.totalAttempts} icon={BookOpen} colorClass="text-primary bg-primary/10" />
          <StatCard title="Average Score" value={`${stats.averageScore}%`} icon={Target} colorClass="text-amber-600 bg-amber-500/10" delay={0.1} />
          <StatCard title="Best Score" value={`${stats.bestScore}%`} icon={Award} colorClass="text-emerald-600 bg-emerald-500/10" delay={0.2} />
          <StatCard title="Passed Exams" value={stats.passedExams} icon={CheckCircle} colorClass="text-navy bg-navy/10" delay={0.3} />
        </section>

        {/* Charts Grid */}
        <section aria-label="Performance Charts" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Dynamic Performance Trend */}
          <article className="col-span-1 lg:col-span-2 card p-6 shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Performance Trend (Jan – {lastMonthShort})
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Average score trajectory across January – {lastMonthFull}
                </p>
              </div>
              <span className="text-xs font-black text-[#0F5132] bg-[#0F5132]/10 dark:text-[#D4A017] dark:bg-[#D4A017]/10 px-3 py-1 rounded-full uppercase">
                Jan – {lastMonthShort}
              </span>
            </div>
            <div className="h-72">
              <PerformanceTrendChart data={stats.monthlyData} dataKey="score" />
            </div>
          </article>

          {/* Pass/Fail Ratio */}
          <article className="card p-6 shadow-sm border border-gray-100 dark:border-gray-800">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Pass vs Fail</h2>
            <div className="h-72 flex justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.passFailData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {stats.passFailData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<LightPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </article>
        </section>
      </div>
    </PageTransition>
  );
};

export default StudentDashboard;
