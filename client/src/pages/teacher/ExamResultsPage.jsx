import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Search, ArrowLeft, Download } from 'lucide-react';
import api from '../../api/axios';
import PageTransition from '../../components/PageTransition';
import LoadingSkeleton from '../../components/LoadingSkeleton';

const ExamResultsPage = () => {
  const { id } = useParams();
  const [results, setResults] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resData, statData] = await Promise.all([
          api.get(`/attempts/exam/${id}`),
          api.get(`/exams/${id}/stats`)
        ]);
        setResults(resData.data);
        setStats(statData.data);
      } catch (err) {
        // mock data
        setResults([
          { _id: '1', studentName: 'John Doe', studentEmail: 'john@test.com', score: 85, percentage: 85, timeTaken: 1800, isPassed: true, date: new Date().toISOString() },
          { _id: '2', studentName: 'Jane Smith', studentEmail: 'jane@test.com', score: 40, percentage: 40, timeTaken: 2000, isPassed: false, date: new Date().toISOString() }
        ]);
        setStats({ totalAttempts: 2, avgScore: 62.5, passRate: 50, avgTime: '31m' });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const filteredResults = results.filter(r => 
    r.studentName.toLowerCase().includes(search.toLowerCase()) || 
    r.studentEmail.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="p-8"><LoadingSkeleton /></div>;

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/teacher/exams" className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-cream dark:hover:bg-gray-800 transition">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Exam Results</h1>
              <p className="text-gray-500">Student performance details.</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-cream dark:hover:bg-gray-800 transition font-medium text-sm">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>

        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
              <p className="text-sm text-gray-500">Total Attempts</p>
              <p className="text-2xl font-bold">{stats.totalAttempts}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
              <p className="text-sm text-gray-500">Average Score</p>
              <p className="text-2xl font-bold">{stats.avgScore}%</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
              <p className="text-sm text-gray-500">Pass Rate</p>
              <p className="text-2xl font-bold">{stats.passRate}%</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
              <p className="text-sm text-gray-500">Average Time</p>
              <p className="text-2xl font-bold">{stats.avgTime}</p>
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700">
            <div className="relative max-w-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search students..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-cream dark:bg-gray-900 text-sm focus:ring-primary focus:border-primary"
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-cream dark:bg-gray-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time Taken</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredResults.length === 0 ? (
                  <tr><td colSpan="5" className="p-8 text-center text-gray-500">No records found.</td></tr>
                ) : (
                  filteredResults.map(r => (
                    <tr key={r._id} className="hover:bg-cream dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900 dark:text-white">{r.studentName}</div>
                        <div className="text-sm text-gray-500">{r.studentEmail}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium">{r.score} <span className="text-gray-500 font-normal">({r.percentage}%)</span></td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{Math.floor(r.timeTaken/60)}m {r.timeTaken%60}s</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${r.isPassed ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>{r.isPassed ? 'Pass' : 'Fail'}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(r.date).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default ExamResultsPage;
