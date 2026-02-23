import React, { useState, useEffect } from 'react';
import './App.css';
import { supabase } from './supabaseClient';
import AuthPage from './components/Auth';
import Chat from './components/Chat';

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="App">
      {!session ? <AuthPage /> : <Chat />}
    </div>
  );
}

export default App;
