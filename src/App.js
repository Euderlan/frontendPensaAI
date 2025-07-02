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
      } else {
        setSidebarVisible(true);
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

  // Manipula seleção de arquivo
  const handleFileSelect = (file) => {
    console.log('Arquivo selecionado:', file);
    // Aqui você pode implementar a lógica para processar o arquivo
    // Por exemplo, fazer upload para um servidor ou processar localmente
    
    // Adiciona uma mensagem indicando que um arquivo foi anexado
    const fileMessage = `📎 Arquivo anexado: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
    sendMessage(fileMessage);
  };

  // Nova conversa
  const handleNewChat = () => {
    newChat();
    // Em mobile, fecha o sidebar após criar nova conversa
    if (window.innerWidth <= 768) {
      setSidebarVisible(false);
    }
    // Focus no input após nova conversa
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  // Carrega chat e fecha sidebar em mobile
  const handleLoadChat = (chatData) => {
    loadChat(chatData);
    // Em mobile, fecha o sidebar após carregar chat
    if (window.innerWidth <= 768) {
      setSidebarVisible(false);
    }
  };

  return (
    <div className="app-container">
      <Sidebar
        chatHistory={chatHistory}
        currentChatId={currentChatId}
        onLoadChat={handleLoadChat}
        onClearHistory={clearAllHistory}
        onNewChat={handleNewChat}
        onToggleSidebar={toggleSidebar} // Nova prop para fechar sidebar
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
            onFileSelect={handleFileSelect}
            isTyping={isTyping}
            inputRef={inputRef}
          />
        </div>
      </div>
    </div>
  );
};

export default App;