// ==========================================
// src/components/MessageInput.js
// ==========================================
import React from 'react';
import '../styles/MessageInput.css';

const MessageInput = ({ 
  inputValue, 
  setInputValue, 
  onSendMessage, 
  isTyping, 
  inputRef 
}) => {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
  };

  return (
    <div className="input-area">
      <div className="input-container">
        <textarea
          ref={inputRef}
          className="message-input"
          placeholder="Digite sua mensagem aqui... 💭"
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          rows="1"
          disabled={isTyping}
        />
        <button
          className="send-button"
          onClick={onSendMessage}
          disabled={isTyping || !inputValue.trim()}
        >
          ➤
        </button>
      </div>
    </div>
  );
};

export default MessageInput;