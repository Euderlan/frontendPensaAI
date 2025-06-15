import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// Componente Header do Chat
const ChatHeader = () => {
  return (
    <div className="chat-header">
      <div>
        <div className="chat-title">🤖 Pensa.AI</div>
        <div className="online-status">
          <div className="status-dot"></div>
          <span>Assistente Educacional Online</span>
        </div>
      </div>
    </div>
  );
};

// Componente de Mensagem Individual
const Message = ({ message }) => {
  return (
    <div className={`message ${message.sender}`}>
      <div 
        className="message-content"
        dangerouslySetInnerHTML={{
          __html: message.text.replace(/\n/g, '<br>')
        }}
      />
    </div>
  );
};

// Componente Indicador de Digitação
const TypingIndicator = () => {
  return (
    <div className="message ai">
      <div className="typing-indicator">
        Pensando...
        <div className="typing-dots">
          <div className="typing-dot"></div>
          <div className="typing-dot"></div>
          <div className="typing-dot"></div>
        </div>
      </div>
    </div>
  );
};

// Componente Área de Mensagens
const MessagesArea = ({ messages, isTyping, messagesAreaRef }) => {
  return (
    <div className="messages-area" ref={messagesAreaRef}>
      {messages.map((message, index) => (
        <Message key={index} message={message} />
      ))}
      {isTyping && <TypingIndicator />}
    </div>
  );
};

// Componente Input de Mensagem
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

// Componente Item do Histórico
const HistoryItem = ({ chat, isActive, onClick }) => {
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div
      className={`history-item ${isActive ? 'active' : ''}`}
      onClick={onClick}
    >
      <div>{chat.title}</div>
      <div className="history-meta">{formatDate(chat.timestamp)}</div>
    </div>
  );
};

// Componente Sidebar do Histórico
const Sidebar = ({ chatHistory, currentChatId, onLoadChat, onClearHistory }) => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <span>💬</span>
        <span className="sidebar-title">Histórico</span>
      </div>
      
      <div className="history-list">
        {chatHistory.length === 0 ? (
          <div className="no-history">
            Nenhuma conversa ainda
          </div>
        ) : (
          chatHistory.map(chat => (
            <HistoryItem
              key={chat.id}
              chat={chat}
              isActive={chat.id === currentChatId}
              onClick={() => onLoadChat(chat)}
            />
          ))
        )}
      </div>
      
      <button className="clear-history" onClick={onClearHistory}>
        🗑️ Limpar Histórico
      </button>
    </div>
  );
};

// Hook customizado para lógica do chat
const useChat = () => {
  const [messages, setMessages] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);

  // Carrega mensagem inicial
  const loadInitialMessage = () => {
    const initialMessage = {
      text: `🤖 Olá! Sou o Pensa.AI, seu assistente educacional.

💡 **Minha missão:** Te ajudar a aprender através do pensamento crítico, sem dar respostas prontas.

🎯 Digite sua dúvida ou tema de estudo para começarmos!`,
      sender: 'ai',
      timestamp: Date.now()
    };
    setMessages([initialMessage]);
  };

  // Detecta matéria baseada na mensagem
  const detectSubject = (message) => {
    const subjects = {
      'matemática': ['função', 'equação', 'derivada', 'integral', 'álgebra', 'geometria', 'trigonometria', 'cálculo'],
      'física': ['força', 'energia', 'movimento', 'velocidade', 'aceleração', 'gravidade', 'onda', 'luz'],
      'química': ['átomo', 'molécula', 'reação', 'ligação', 'elemento', 'tabela periódica', 'ph', 'ácido'],
      'biologia': ['célula', 'dna', 'evolução', 'fotossíntese', 'respiração', 'reprodução', 'genética'],
      'história': ['guerra', 'revolução', 'império', 'século', 'civilização', 'cultura', 'brasil'],
      'geografia': ['clima', 'relevo', 'população', 'país', 'continente', 'oceano', 'cidade'],
      'português': ['verbo', 'substantivo', 'sintaxe', 'literatura', 'texto', 'gramática', 'redação'],
      'inglês': ['verb', 'noun', 'grammar', 'vocabulary', 'pronunciation', 'english']
    };

    const messageLower = message.toLowerCase();
    for (const [subject, keywords] of Object.entries(subjects)) {
      if (keywords.some(keyword => messageLower.includes(keyword))) {
        return subject;
      }
    }
    return 'geral';
  };

  // Emoji para cada matéria
  const getSubjectEmoji = (subject) => {
    const emojis = {
      'matemática': '📊',
      'física': '⚡',
      'química': '🧪',
      'biologia': '🌱',
      'história': '📚',
      'geografia': '🌍',
      'português': '📝',
      'inglês': '🇺🇸',
      'geral': '🤖'
    };
    return emojis[subject] || '🤖';
  };

  // Gera resposta da IA
  const getAIResponse = async (message) => {
    const subject = detectSubject(message);
    const emoji = getSubjectEmoji(subject);

    const responses = [
      `${emoji} Interessante! Me conte: o que você já sabe sobre esse assunto?`,
      `${emoji} Ótima pergunta! Qual seria o primeiro passo para resolver isso?`,
      `${emoji} Vamos pensar juntos. Como você aplicaria isso na prática?`,
      `${emoji} Você está no caminho certo! Que tal conectar com algo que já conhece?`,
      `${emoji} Excelente! Qual seria o próximo passo lógico aqui?`,
      `${emoji} Muito bem! Vamos usar perguntas para te guiar. Que informações você tem?`,
      `${emoji} Ótima escolha de tema! Que tal começarmos pelos conceitos básicos?`
    ];

    // Simula delay da API
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

    let response = responses[Math.floor(Math.random() * responses.length)];

    // Adiciona dicas específicas ocasionalmente
    if (Math.random() < 0.4) {
      const tips = {
        'matemática': '\n\n💡 **Dica**: Tente visualizar o problema. Desenhos ajudam muito!',
        'física': '\n\n💡 **Dica**: Identifique as grandezas e suas unidades primeiro.',
        'química': '\n\n💡 **Dica**: Lembre-se da tabela periódica e das propriedades dos elementos.',
        'biologia': '\n\n💡 **Dica**: Estrutura e função sempre estão relacionadas.',
        'história': '\n\n💡 **Dica**: Contextualize no tempo e espaço da época.',
        'geografia': '\n\n💡 **Dica**: Pense nas relações entre espaço, sociedade e natureza.',
        'português': '\n\n💡 **Dica**: Analise o contexto e a estrutura do texto.',
        'inglês': '\n\n💡 **Dica**: Context is key! Think about when and how it\'s used.'
      };
      response += tips[subject] || '';
    }

    // Adiciona encorajamento ocasionalmente
    if (Math.random() < 0.3) {
      const encouragements = [
        '\n\n🌟 Você está no caminho certo! Continue explorando.',
        '\n\n💪 Ótima pergunta! Isso mostra pensamento crítico.',
        '\n\n🎯 Excelente! Vamos aprofundar esse raciocínio.',
        '\n\n🚀 Muito bem! Seu progresso é notável.',
        '\n\n🔥 Continue assim! A curiosidade é o combustível do aprendizado.'
      ];
      response += encouragements[Math.floor(Math.random() * encouragements.length)];
    }

    return response;
  };

  // Envia mensagem
  const sendMessage = async (message) => {
    if (!message.trim() || isTyping) return;

    // Adiciona mensagem do usuário
    const userMessage = {
      text: message,
      sender: 'user',
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      // Obter resposta da IA
      const response = await getAIResponse(message);
      
      const aiMessage = {
        text: response,
        sender: 'ai',
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // Salva no histórico
      const newMessages = [...messages, userMessage, aiMessage];
      saveCurrentChat(newMessages);
    } catch (error) {
      const errorMessage = {
        text: '😅 Ops! Algo deu errado. Tente novamente.',
        sender: 'ai',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMessage]);
      console.error('Erro ao obter resposta:', error);
    } finally {
      setIsTyping(false);
    }
  };

  // Salva chat atual
  const saveCurrentChat = (messagesToSave = messages) => {
    if (messagesToSave.length < 2) return;

    const chatData = {
      id: currentChatId || Date.now(),
      title: generateChatTitle(messagesToSave),
      messages: messagesToSave,
      timestamp: Date.now()
    };

    let history = JSON.parse(localStorage.getItem('chatHistory') || '[]');

    if (currentChatId) {
      history = history.filter(chat => chat.id !== currentChatId);
    }

    history.unshift(chatData);
    history = history.slice(0, 50);

    localStorage.setItem('chatHistory', JSON.stringify(history));
    setCurrentChatId(chatData.id);
    loadHistory();
  };

  // Gera título do chat
  const generateChatTitle = (messagesToUse = messages) => {
    const firstMessage = messagesToUse.find(m => m.sender === 'user');
    if (!firstMessage) return 'Nova Conversa';

    let title = firstMessage.text.substring(0, 40);
    if (firstMessage.text.length > 40) title += '...';
    return title;
  };

  // Carrega histórico
  const loadHistory = () => {
    const history = JSON.parse(localStorage.getItem('chatHistory') || '[]');
    setChatHistory(history);
  };

  // Carrega chat específico
  const loadChat = (chatData) => {
    setMessages([...chatData.messages]);
    setCurrentChatId(chatData.id);
    loadHistory();
  };

  // Novo chat
  const newChat = () => {
    setMessages([]);
    setCurrentChatId(null);
    loadInitialMessage();
    loadHistory();
  };

  // Limpa histórico
  const clearAllHistory = () => {
    if (window.confirm('Tem certeza que deseja limpar todo o histórico?')) {
      localStorage.removeItem('chatHistory');
      loadHistory();
      newChat();
    }
  };

  return {
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
  };
};

// Componente Principal
const App = () => {
  const [inputValue, setInputValue] = useState('');
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
    
    // Focus no input após carregar
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 500);
  }, []);

  // Auto-scroll quando novas mensagens chegam
  useEffect(() => {
    if (messagesAreaRef.current) {
      messagesAreaRef.current.scrollTop = messagesAreaRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

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

  return (
    <div className="app-container">
      <Sidebar
        chatHistory={chatHistory}
        currentChatId={currentChatId}
        onLoadChat={loadChat}
        onClearHistory={clearAllHistory}
      />
      
      <div className="chat-container">
        <ChatHeader />
        
        <MessagesArea
          messages={messages}
          isTyping={isTyping}
          messagesAreaRef={messagesAreaRef}
        />
        
        <MessageInput
          inputValue={inputValue}
          setInputValue={setInputValue}
          onSendMessage={handleSendMessage}
          isTyping={isTyping}
          inputRef={inputRef}
        />
      </div>
    </div>
  );
};

export default App;