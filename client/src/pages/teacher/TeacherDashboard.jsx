import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BookOpen, Users, Award, TrendingUp, Plus } from 'lucide-react';
import api from '../../api/axios';
import PageTransition from '../../components/PageTransition';
import StatCard from '../../components/StatCard';
import PerformanceTrendChart from '../../components/PerformanceTrendChart';

const ALL_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const TeacherDashboard = () => {
  const [stats, setStats] = useState({
    totalExams: 0,
    publishedExams: 0,
    totalStudents: 0,
    avgScore: 0,
    attemptsData: [],
    trendData: []
  });
  const [recentExams, setRecentExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [statRes, examRes] = await Promise.all([
          api.get('/users/teacher-stats'),
          api.get('/exams?limit=5')
        ]);
        setStats(statRes.data.data);
        setRecentExams(examRes.data.data);
      } catch (err) {
        // Mock data
        setStats({
          totalExams: 15, publishedExams: 12, totalStudents: 450, avgScore: 76,
          attemptsData: [{ name: 'Math 101', attempts: 120 }, { name: 'Physics Basic', attempts: 95 }, { name: 'CS Intro', attempts: 150 }],
          trendData: [{ name: 'Week 1', score: 72 }, { name: 'Week 2', score: 75 }, { name: 'Week 3', score: 78 }]
        });
        setRecentExams([
          { _id: '1', title: 'Midterm Mathematics', subject: 'Math', status: 'published', questionsCount: 30, attemptsCount: 120, createdAt: new Date().toISOString() }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <div className="animate-pulse h-full bg-gray-200 dark:bg-gray-800 rounded-xl"></div>;

  return (
    <PageTransition>
      <div className="space-y-6">
        <header className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Teacher Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400">Overview of your exams and student performance.</p>
          </div>
          <Link to="/teacher/exams/create" className="btn btn-primary gap-2 shadow-sm">
            <Plus className="w-4 h-4" aria-hidden="true" /> Create Exam
          </Link>
        </header>

        <section aria-label="Quick Statistics" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Exams" value={stats.totalExams} icon={BookOpen} colorClass="text-primary bg-primary/10" />
          <StatCard title="Published" value={stats.publishedExams} icon={Award} colorClass="text-success bg-success/10" delay={0.1} />
          <StatCard title="Students Reached" value={stats.totalStudents} icon={Users} colorClass="text-navy bg-navy/10" delay={0.2} />
          <StatCard title="Average Score" value={`${stats.avgScore}%`} icon={TrendingUp} colorClass="text-warning bg-warning/10" delay={0.3} />
        </section>

        <section aria-label="Performance Charts" className="grid md:grid-cols-2 gap-6">
          <article className="card card-p">
            <h2 className="text-lg font-bold mb-6">Exam Participation</h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.attemptsData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="name" stroke="#6B7280" fontSize={12} />
                  <YAxis stroke="#6B7280" />
                  <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} contentStyle={{ borderRadius: '8px' }} />
                  <Bar dataKey="attempts" fill="#2563EB" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </article>
          <article className="card card-p">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Average Score Trend (Jan – {ALL_MONTHS[new Date().getMonth()]})
              </h2>
              <span className="text-xs font-black text-primary bg-primary/10 px-3 py-1 rounded-full uppercase">
                Jan – {ALL_MONTHS[new Date().getMonth()]}
              </span>
            </div>
            <div className="h-72">
              <PerformanceTrendChart data={stats.trendData} dataKey="averageScore" />
            </div>
          </article>
        </section>

        <section aria-label="Recent Exams" className="card overflow-hidden">
          <header className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-lg font-bold">Recent Exams</h2>
            <Link to="/teacher/exams" className="text-sm text-primary hover:underline font-medium">View All</Link>
          </header>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <caption className="sr-only">Recent Exams List</caption>
              <thead className="bg-cream dark:bg-gray-900/50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Questions</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Attempts</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {recentExams.map(exam => (
                  <tr key={exam._id}>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">{exam.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{exam.subject}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`${exam.status === 'published' ? 'badge-success' : 'badge-primary'} capitalize`}>
                        {exam.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{exam.questionsCount || 0}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{exam.attemptsCount || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

export default TeacherDashboard;
