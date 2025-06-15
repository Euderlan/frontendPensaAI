import React from 'react';

const ChatHeader = ({ onToggleSidebar, sidebarVisible, onNewChat }) => {
  return (
    <div className="chat-header">
      <div className="chat-header-left">
        <button 
          className="sidebar-toggle-btn" 
          onClick={onToggleSidebar}
          title={sidebarVisible ? 'Esconder histórico' : 'Mostrar histórico'}
        >
          {sidebarVisible ? '◀' : '▶'}
        </button>
        <div className="chat-info">
          <div className="chat-title">🤖 Pensa.AI</div>
          <div className="online-status">
            <div className="status-dot"></div>
            <span>Assistente Educacional Online</span>
          </div>
        </div>
      </div>
      
      <button className="new-chat-header-btn" onClick={onNewChat} title="Nova conversa">
        ✨ Nova Conversa
      </button>
    </div>
  );
};

export default ChatHeader;