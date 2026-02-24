import React, { useEffect, useRef } from 'react';
import ExpenseTable from './ExpenseTable';

const getCategoryIcon = (category) => {
  const cat = category?.toLowerCase() || '';
  if (cat.includes('food') || cat.includes('eat') || cat.includes('chai')) return '🍔';
  if (cat.includes('travel') || cat.includes('taxi') || cat.includes('auto')) return '🚕';
  if (cat.includes('bill') || cat.includes('recharge') || cat.includes('light')) return '💡';
  if (cat.includes('shop') || cat.includes('clothes')) return '🛍';
  if (cat.includes('home') || cat.includes('rent')) return '🏠';
  return '💰';
};

const MessageList = ({ messages, isLoading }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  return (
    <div className="messages">
      {messages.map((m, i) => (
        <div key={i} className={`message-wrapper ${m.sender === 'user' ? 'user' : 'bot'}`}>
          <div className={`message ${m.sender === 'user' ? 'user-message' : 'bot-message'}`}>
            <div className="message-text">
              {m.intent === 'ADD' && m.data && (
                <span className="category-emoji">{getCategoryIcon(m.data.category)} </span>
              )}
              {m.text}
            </div>
            {m.intent === 'LIST_RECENT' && m.data && (
              <div className="message-content-extra">
                <ExpenseTable data={m.data} />
              </div>
            )}
          </div>
        </div>
      ))}
      {isLoading && (
        <div className="message-wrapper bot">
          <div className="message bot-message">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
