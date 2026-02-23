import React, { useState } from 'react';
import SignInForm from './auth/SignInForm';
import SignUpForm from './auth/SignUpForm';

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>KharchaAI</h2>
        <p style={{ textAlign: 'center', color: '#94a3b8', marginBottom: '30px' }}>
          {isSignUp ? 'Create your account' : 'Sign in to your account'}
        </p>

        {isSignUp ? (
          <SignUpForm onToggle={() => setIsSignUp(false)} />
        ) : (
          <SignInForm onToggle={() => setIsSignUp(true)} />
        )}
      </div>
    </div>
  );
};

export default AuthPage;
