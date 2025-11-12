'use client';

import { Message } from '../lib/types';
import styles from './ChatMessages.module.css';

interface ChatMessagesProps {
  messages: Message[];
}

export function ChatMessages({ messages }: ChatMessagesProps) {
  // Log para debug
  console.log('[ChatMessages] Renderizando', messages.length, 'mensagens');

  return (
    <div className={styles.messagesContainer}>
      {messages.length === 0 ? (
        <div className={styles.emptyState}>
          <p>Nenhuma mensagem ainda. Comece a conversa!</p>
        </div>
      ) : (
        messages.map((msg, index) => (
          <div
            key={msg.id}
            className={`${styles.message} ${
              msg.sender === 'client'
                ? styles.clientMessage
                : styles.consultantMessage
            }`}
          >
            <div className={styles.messageContent}>
              <p>{msg.content}</p>
              <span className={styles.timestamp}>
                {new Date(msg.timestamp).toLocaleTimeString('pt-BR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
