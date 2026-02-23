import React, { useState } from 'react';
import axios from 'axios';
import { supabase } from '../supabaseClient';
import ChatHeader from './chat/ChatHeader';
import MessageList from './chat/MessageList';
import MessageInput from './chat/MessageInput';

const Chat = () => {
  const [messages, setMessages] = useState([
    { text: "Namaste! Main aapka expense assistant hoon. Aaj kitna kharch kiya?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);

  const handleSend = async (text) => {
    const query = text || input;
    if (!query.trim()) return;

    setMessages(prev => [...prev, { text: query, sender: 'user' }]);
    setInput('');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/chat`,
        { message: query },
        { headers: { Authorization: `Bearer ${session.access_token}` } }
      );

      setMessages(prev => [...prev, {
        text: response.data.reply,
        sender: 'bot',
        data: response.data.data,
        intent: response.data.intent
      }]);
    } catch (error) {
      console.error("Chat Post Error:", error.response?.data || error.message);
      const errMsg = error.response?.data?.error || "Sorry, kuch error aa gaya database connect karne me.";
      setMessages(prev => [...prev, { text: errMsg, sender: 'bot' }]);
    }
  };

  const startVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.continuous = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      handleSend(transcript);
    };

    recognition.start();
  };

  return (
    <div className="chat-layout">
      <div className="chat-container">
        <ChatHeader />
        <MessageList messages={messages} />
        <MessageInput
          input={input}
          setInput={setInput}
          onSend={handleSend}
          isListening={isListening}
          onVoiceStart={startVoiceInput}
        />
      </div>
    </div>
  );
};

export default Chat;
