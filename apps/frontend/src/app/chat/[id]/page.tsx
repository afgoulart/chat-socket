'use client';

import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { useSocket } from '../../../hooks/useSocket';
import { ChatMessages } from '../../../components/ChatMessages';
import { ChatInput } from '../../../components/ChatInput';
import styles from './chatroom.module.css';

export default function ChatRoomPage() {
  const params = useParams();
  const chatId = params.id as string;
  const { connected, messages, sendMessage } = useSocket(chatId);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    const container = document.querySelector('.messages-container');
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (content: string) => {
    sendMessage(content, 'client');
  };

  return (
    <div className={styles.container}>
      <div className={styles.chatRoom}>
        <div className={styles.header}>
          <h1>Chat</h1>
          <div className={styles.status}>
            <span
              className={`${styles.statusDot} ${
                connected ? styles.connected : styles.disconnected
              }`}
            />
            {connected ? 'Conectado' : 'Desconectado'}
          </div>
        </div>

        <div className="messages-container">
          <ChatMessages messages={messages} />
        </div>

        <ChatInput onSendMessage={handleSendMessage} disabled={!connected} />
      </div>
    </div>
  );
}
