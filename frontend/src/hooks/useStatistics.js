import { useState, useEffect } from 'react';
import { getAdminStatistics } from '../service/statistics_service';

export function useStatistics() {
  const [timeRange, setTimeRange] = useState('Tháng');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const rangeMap = {
          'Tháng': 'month',
          'Quý': 'quarter',
          'Năm': 'year'
        };
        const apiRange = rangeMap[timeRange] || 'month';
        const response = await getAdminStatistics(apiRange);
        if (response.success) {
          setData(response.data);
        }
      } catch (err) {
        setError(err);
        console.error('Error in useStatistics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
  };

  return {
    revenueData: data?.revenueData || { total: '$0k', growth: '0%', heights: [0,0,0,0,0,0], labels: [] },
    genres: data?.genres || [],
    topMovies: data?.topMovies || [],
    userStats: data?.userStats || { total: 0, vip: 0, new: 0, vipPercentage: '0%' },
    vipTrend: data?.vipTrend || { labels: [], counts: [] },
    timeRange,
    handleTimeRangeChange,
    loading,
    error
  };
}
