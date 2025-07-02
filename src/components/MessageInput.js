// ==========================================
// src/components/MessageInput.js
// ==========================================
import React, { useState, useRef } from 'react';
import '../styles/MessageInput.css';

const MessageInput = ({ 
  inputValue, 
  setInputValue, 
  onSendMessage, 
  isTyping, 
  inputRef,
  onFileSelect // Nova prop para lidar com arquivos
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

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

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Limita o tamanho do arquivo (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Arquivo muito grande. Máximo 5MB.');
        return;
      }

      // Tipos de arquivo permitidos
      const allowedTypes = [
        'image/jpeg', 'image/png', 'image/gif', 'image/webp',
        'text/plain', 'application/pdf',
        'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];

      if (!allowedTypes.includes(file.type)) {
        alert('Tipo de arquivo não suportado. Use imagens, PDF, DOC ou TXT.');
        return;
      }

      setSelectedFile(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSend = () => {
    if (selectedFile) {
      // Chama a função callback para lidar com o arquivo no componente pai
      if (onFileSelect) {
        onFileSelect(selectedFile);
      }
      removeFile();
    }
    onSendMessage();
  };

  return (
    <div className="input-area">
      <div className="input-container">
        {/* Indicador de arquivo selecionado */}
        {selectedFile && (
          <div className="file-indicator">
            📎 {selectedFile.name.length > 20 
              ? selectedFile.name.substring(0, 20) + '...' 
              : selectedFile.name}
            <button 
              className="remove-file" 
              onClick={removeFile}
              title="Remover arquivo"
            >
              ×
            </button>
          </div>
        )}

        {/* Botão de adicionar arquivo */}
        <button
          className="add-file-button"
          onClick={handleFileSelect}
          disabled={isTyping}
          title="Adicionar arquivo"
        >
          +
        </button>

        {/* Input de arquivo oculto */}
        <input
          ref={fileInputRef}
          type="file"
          className="file-input"
          onChange={handleFileChange}
          accept="image/*,.pdf,.doc,.docx,.txt"
        />

        {/* Input de texto */}
        <textarea
          ref={inputRef}
          className="message-input"
          placeholder="Pergunte alguma coisa"
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          rows="1"
          disabled={isTyping}
        />

        {/* Botão de enviar */}
        <button
          className="send-button"
          onClick={handleSend}
          disabled={isTyping || (!inputValue.trim() && !selectedFile)}
          title="Enviar mensagem"
        >
          ➤
        </button>
      </div>
    </div>
  );
};

export default MessageInput;