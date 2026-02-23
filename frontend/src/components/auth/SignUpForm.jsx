import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';

const SignUpForm = ({ onToggle }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Sign up user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // 2. Create profile entry
        // We include email in the profile for easier lookup later (username-based login)
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            username: username,
            full_name: fullName,
            email: email, // Store email here for username lookup during login
          });

        if (profileError) throw profileError;

        alert('Verification link sent to your email!');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignUp} className="auth-form">
      <div className="form-group">
        <label>Full Name</label>
        <input
          type="text"
          placeholder="John Doe"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label>Username</label>
        <input
          type="text"
          placeholder="unique_username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label>Email Address</label>
        <input
          type="email"
          placeholder="name@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
        {loading ? 'Creating account...' : 'Create Account'}
      </button>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button type="button" className="link-btn" onClick={onToggle}>
          Already have an account? Sign In
        </button>
      </div>
    </form>
  );
};

export default SignUpForm;
