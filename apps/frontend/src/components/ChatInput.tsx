'use client';

import { useState } from 'react';
import styles from './ChatInput.module.css';

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSendMessage, disabled }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.inputContainer}>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Digite sua mensagem..."
        disabled={disabled}
        className={styles.input}
      />
      <button
        type="submit"
        disabled={disabled || !message.trim()}
        className={styles.sendButton}
      >
        Enviar
      </button>
    </form>
  );
}
