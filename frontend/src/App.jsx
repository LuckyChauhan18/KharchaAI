import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { supabase } from './supabaseClient';
import AuthPage from './components/Auth';
import Chat from './components/Chat';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <div className="loading-screen">Loading KharchaAI...</div>;

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={session ? <Navigate to="/chat" /> : <LandingPage />} />
          <Route path="/auth" element={session ? <Navigate to="/chat" /> : <AuthPage />} />
          <Route path="/chat" element={session ? <Chat /> : <Navigate to="/auth" />} />
          <Route path="/dashboard" element={session ? <Dashboard /> : <Navigate to="/auth" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
