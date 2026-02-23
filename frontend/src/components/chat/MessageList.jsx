import React, { useEffect, useRef } from 'react';
import ExpenseTable from './ExpenseTable';

const MessageList = ({ messages }) => {
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
            <div className="message-text">{m.text}</div>
            {m.intent === 'LIST_RECENT' && m.data && (
              <div className="message-content-extra">
                <ExpenseTable data={m.data} />
              </div>
            )}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
