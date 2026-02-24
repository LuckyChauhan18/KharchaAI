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
    count: 0,
    expenses: []
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
        '#6366f1', '#a855f7', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#f43f5e', '#06b6d4'
      ],
      hoverOffset: 12,
      borderWidth: 0,
    }]
  };

  const barData = {
    labels: Object.keys(data.monthlyTrend).length > 0 ? Object.keys(data.monthlyTrend) : ['No Data'],
    datasets: [{
      label: 'Monthly Spending (₹)',
      data: Object.values(data.monthlyTrend).length > 0 ? Object.values(data.monthlyTrend) : [0],
      backgroundColor: 'rgba(99, 102, 241, 0.8)',
      borderColor: '#6366f1',
      borderWidth: 2,
      borderRadius: 12,
      hoverBackgroundColor: '#6366f1',
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#94a3b8',
          padding: 20,
          font: { family: 'Inter', size: 11, weight: '500' }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 },
        padding: 12,
        cornerRadius: 8,
        displayColors: true
      }
    },
    scales: {
      y: {
        grid: { color: 'rgba(148, 163, 184, 0.1)', drawBorder: false },
        ticks: { color: '#94a3b8', font: { size: 10 } }
      },
      x: {
        grid: { display: false },
        ticks: { color: '#94a3b8', font: { size: 10 } }
      }
    }
  };

  const downloadCSV = () => {
    if (!data.expenses || data.expenses.length === 0) return alert("No data to export");

    // CSV Headers
    const headers = ["Date", "Description", "Category", "Amount"];

    // Format rows
    const rows = data.expenses.map(exp => [
      new Date(exp.created_at).toLocaleDateString(),
      `"${exp.description || ''}"`, // Wrap in quotes to handle commas
      exp.category || 'misc',
      exp.amount
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    // Create Blob and Download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `kharcha_ai_expenses_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    console.log("Dashboard: CSV Exported successfully");
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
