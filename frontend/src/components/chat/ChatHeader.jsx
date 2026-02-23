import React, { useEffect, useState } from 'react';
import { LogOut, Wallet, User } from 'lucide-react';
import { supabase } from '../../supabaseClient';

const ChatHeader = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name, username')
          .eq('id', user.id);

        if (data && data.length > 0) {
          setProfile(data[0]);
        }
      }
    };
    fetchProfile();
  }, []);

  return (
    <header className="chat-header">
      <div className="logo">
        <div className="logo-icon">
          <Wallet size={20} />
        </div>
        <span>KharchaAI</span>
      </div>

      <div className="header-actions">
        {profile && (
          <div className="user-info">
            <span className="user-name">{profile.full_name || profile.username}</span>
            <span className="user-handle">@{profile.username}</span>
          </div>
        )}
        <button className="icon-btn logout-btn" onClick={() => supabase.auth.signOut()}>
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
};

export default ChatHeader;
