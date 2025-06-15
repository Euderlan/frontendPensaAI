import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// Importações dos componentes
import ChatHeader from './components/ChatHeader';
import { MessagesArea } from './components/MessageComponents';
import MessageInput from './components/MessageInput';
import { Sidebar } from './components/SidebarComponents';

// Importações dos hooks
import { useChat } from './hooks/useChat';

// Componente Principal
const App = () => {
  const [inputValue, setInputValue] = useState('');
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const messagesAreaRef = useRef(null);
  const inputRef = useRef(null);

  const {
    messages,
    currentChatId,
    isTyping,
    chatHistory,
    sendMessage,
    loadHistory,
    loadChat,
    newChat,
    clearAllHistory,
    loadInitialMessage
  } = useChat();

  // Inicialização
  useEffect(() => {
    loadHistory();
    loadInitialMessage();
    
    // Verifica se deve mostrar sidebar em telas pequenas
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setSidebarVisible(false);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    // Focus no input após carregar
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 500);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-scroll quando novas mensagens chegam
  useEffect(() => {
    if (messagesAreaRef.current) {
      messagesAreaRef.current.scrollTop = messagesAreaRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Toggle do sidebar
  const toggleSidebar = () => {
    setSidebarVisible(prev => !prev);
  };

  // Manipula envio de mensagem
  const handleSendMessage = async () => {
    const message = inputValue.trim();
    if (!message) return;

    setInputValue('');
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }
    
    await sendMessage(message);
  };

  // Nova conversa
  const handleNewChat = () => {
    newChat();
    // Focus no input após nova conversa
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  return (
    <div className="app-container">
      <Sidebar
        chatHistory={chatHistory}
        currentChatId={currentChatId}
        onLoadChat={loadChat}
        onClearHistory={clearAllHistory}
        onNewChat={handleNewChat}
        isVisible={sidebarVisible}
      />
      
      <div className={`chat-container ${!sidebarVisible ? 'expanded' : ''}`}>
        <ChatHeader 
          onToggleSidebar={toggleSidebar}
          sidebarVisible={sidebarVisible}
          onNewChat={handleNewChat}
        />
        
        <MessagesArea
          messages={messages}
          isTyping={isTyping}
          messagesAreaRef={messagesAreaRef}
        />
        
        <div className="input-wrapper">
          <MessageInput
            inputValue={inputValue}
            setInputValue={setInputValue}
            onSendMessage={handleSendMessage}
            isTyping={isTyping}
            inputRef={inputRef}
          />
        </div>
      </div>
    </div>
  );
};

export default App;