import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';

const SignInForm = ({ onToggle }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Fetch email from profiles table using username
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('email') // We'll add this field during signup
        .eq('username', username)
        .single();

      if (profileError || !profile) {
        throw new Error('Username not found');
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: profile.email,
        password: password,
      });

      if (signInError) throw signInError;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignIn} className="auth-form">
      <div className="form-group">
        <label>Username</label>
        <input
          type="text"
          placeholder="your_username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {error && <div className="error-message">{error}</div>}

      <button type="submit" className="auth-btn" disabled={loading}>
        {loading ? 'Signing in...' : 'Sign In'}
      </button>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button type="button" className="link-btn" onClick={onToggle}>
          Don't have an account? Sign Up
        </button>
      </div>
    </form>
  );
};

export default SignInForm;
