import { useState, useEffect } from 'react';
import api from '../api/axios';

let cachedStats = null;
let lastFetchTime = 0;
const CACHE_TTL = 30000; // 30 seconds in-memory cache

export const useStats = () => {
  const [stats, setStats] = useState(cachedStats || {
    activeStudents: 0,
    examsConducted: 0,
    questionBank: 0,
    successRate: 0,
    availableExams: 0,
    totalCategories: 0,
    teachers: 0,
    totalAttempts: 0
  });
  const [loading, setLoading] = useState(!cachedStats);
  const [error, setError] = useState(null);

  const fetchStats = async (force = false) => {
    const now = Date.now();
    if (!force && cachedStats && (now - lastFetchTime < CACHE_TTL)) {
      setStats(cachedStats);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/stats/overview');
      const data = res.data?.data || res.data || {};
      cachedStats = data;
      lastFetchTime = Date.now();
      setStats(data);
    } catch (err) {
      console.error('Error fetching global platform stats:', err);
      setError('Unable to load platform statistics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, loading, error, refetch: () => fetchStats(true) };
};

export default useStats;
