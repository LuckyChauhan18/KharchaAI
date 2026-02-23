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

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for initial design
  const pieData = {
    labels: ['Food', 'Travel', 'Bills', 'Shopping', 'Misc'],
    datasets: [{
      data: [3500, 2000, 5000, 1500, 450],
      backgroundColor: [
        '#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'
      ],
      borderWidth: 0,
    }]
  };

  const barData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Monthly Spending',
      data: [12000, 19000, 15000, 22000, 18000, 24000],
      backgroundColor: '#6366f1',
      borderRadius: 8,
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#94a3b8', font: { family: 'Inter' } }
      }
    }
  };

  const downloadCSV = () => {
    const headers = ['Date', 'Description', 'Category', 'Amount'];
    const rows = [
      ['2026-06-20', 'Pizza', 'Food', '500'],
      ['2026-06-21', 'Uber', 'Travel', '200'],
      ['2026-06-22', 'Electric Bill', 'Bills', '3000'],
    ]; // Placeholder for real data

    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'kharcha_report.csv');
    link.click();
  };

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
          <div className="stat-label">Total Spent (June)</div>
          <div className="stat-value">₹24,000</div>
          <div className="stat-change positive">+8% from last month</div>
        </div>
        <div className="glass-card stat-card highlight-card">
          <div className="stat-label">Monthly Budget</div>
          <div className="stat-value">₹30,000</div>
          <div className="budget-progress-container">
            <div className="budget-progress-bar" style={{ width: '80%' }}></div>
          </div>
          <div className="stat-change">₹6,000 left</div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-label">Top Category</div>
          <div className="stat-value">Bills</div>
          <div className="stat-change">42% of total</div>
        </div>
      </div>

      <div className="charts-container">
        <div className="glass-card chart-card">
          <h3>Category Breakdown</h3>
          <div className="pie-wrapper">
            <Pie data={pieData} options={chartOptions} />
          </div>
        </div>
        <div className="glass-card chart-card flex-2">
          <h3>Monthly Trend</h3>
          <div className="bar-wrapper">
            <Bar data={barData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
