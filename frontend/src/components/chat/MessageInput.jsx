import React from 'react';
import { Send, Mic } from 'lucide-react';

const MessageInput = ({ input, setInput, onSend, isListening, onVoiceStart }) => {
  return (
    <div className="input-wrapper">
      <div className="input-area">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add expense (e.g. 50 rs for tea)"
          onKeyPress={(e) => e.key === 'Enter' && onSend()}
        />
        <div className="input-actions">
          <button
            className={`icon-btn mic-btn ${isListening ? 'mic-active' : ''}`}
            onClick={onVoiceStart}
            title="Voice Input"
          >
            <Mic size={20} />
          </button>
          <button
            className="send-btn"
            onClick={() => onSend()}
            disabled={!input.trim()}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageInput;
