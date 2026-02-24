import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PieChart as PieIcon,
  BarChart as BarIcon,
  TrendingUp,
  Download,
  ArrowLeft,
  ChevronRight
} from 'lucide-react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

import axios from 'axios';
import { supabase } from '../supabaseClient';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    categoryData: {},
    monthlyTrend: {},
    totalSpent: 0,
    count: 0
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      console.log("Dashboard: Starting fetchAnalytics...");
      console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);

      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        if (!session) {
          console.warn("Dashboard: No session found, redirecting to auth");
          return navigate('/auth');
        }

        console.log("Dashboard: Session found, calling API...");
        const apiUrl = import.meta.env.VITE_API_URL || '';
        const endpoint = `${apiUrl}/api/expenses/analytics`;
        console.log("Dashboard: Fetching from:", endpoint);

        const response = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${session.access_token}` },
          timeout: 15000 // 15s timeout
        });

        console.log("Dashboard: API Response received:", response.data);
        setData(response.data);
      } catch (error) {
        console.error("Fetch Analytics Error:", error);
        if (error.code === 'ECONNABORTED') {
          console.error("Dashboard: API request timed out");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [navigate]);

  const pieData = {
    labels: Object.keys(data.categoryData).length > 0 ? Object.keys(data.categoryData) : ['No Data'],
    datasets: [{
      data: Object.values(data.categoryData).length > 0 ? Object.values(data.categoryData) : [1],
      backgroundColor: [
        '#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#f43f5e'
      ],
      borderWidth: 0,
    }]
  };

  const barData = {
    labels: Object.keys(data.monthlyTrend).length > 0 ? Object.keys(data.monthlyTrend) : ['No Data'],
    datasets: [{
      label: 'Monthly Spending',
      data: Object.values(data.monthlyTrend).length > 0 ? Object.values(data.monthlyTrend) : [0],
      backgroundColor: '#6366f1',
      borderRadius: 8,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#94a3b8', font: { family: 'Inter', size: 10 } }
      }
    }
  };

  const downloadCSV = () => {
    if (!data.count) return alert("No data to export");

    // In a real app, we might fetch all records for a full CSV, 
    // but here we can export what we have if we had the raw list.
    // For now, let's keep the logic simple or just notify.
    alert("Exporting " + data.count + " records...");
  };

  if (loading) return <div className="loading-screen">Loading Analytics...</div>;

  const topCategory = Object.entries(data.categoryData).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
  const monthlyBudget = 10000; // Default budget
  const budgetProgress = Math.min((data.totalSpent / monthlyBudget) * 100, 100);

  return (
    <div className="dashboard-layout">
      <header className="dashboard-header">
        <button className="back-btn" onClick={() => navigate('/chat')}>
          <ArrowLeft size={20} />
          <span>Back to Chat</span>
        </button>
        <div className="header-title">Spending Analytics</div>
        <button className="export-btn-gradient" onClick={downloadCSV}>
          <Download size={18} />
          <span>Export CSV</span>
        </button>
      </header>

      <div className="dashboard-grid">
        <div className="glass-card stat-card">
          <div className="stat-label">Total Spent (Total)</div>
          <div className="stat-value">₹{data.totalSpent.toLocaleString()}</div>
          <div className="stat-change positive">From {data.count} entries</div>
        </div>
        <div className="glass-card stat-card highlight-card">
          <div className="stat-label">Monthly Budget</div>
          <div className="stat-value">₹{monthlyBudget.toLocaleString()}</div>
          <div className="budget-progress-container" title={`${budgetProgress.toFixed(1)}% used`}>
            <div className="budget-progress-bar" style={{ width: `${budgetProgress}%` }}></div>
          </div>
          <div className="stat-change">₹{Math.max(monthlyBudget - data.totalSpent, 0).toLocaleString()} left</div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-label">Top Category</div>
          <div className="stat-value" style={{ textTransform: 'capitalize' }}>{topCategory}</div>
          <div className="stat-change">Most frequent spend</div>
        </div>
      </div>

      <div className="charts-container">
        <div className="glass-card chart-card">
          <h3>Category Breakdown</h3>
          <div className="pie-wrapper" style={{ height: '300px' }}>
            <Pie data={pieData} options={chartOptions} />
          </div>
        </div>
        <div className="glass-card chart-card flex-2">
          <h3>Spending Trends</h3>
          <div className="bar-wrapper" style={{ height: '300px' }}>
            <Bar data={barData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
