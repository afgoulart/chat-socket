'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createChat } from '../../lib/actions';
import styles from './chat.module.css';

export default function ChatPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCreateChat = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const chat = await createChat();
      router.push(`/chat/${chat.id}`);
    } catch (error) {
      console.error('Failed to create chat:', error);
      alert('Erro ao criar chat. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1>Iniciar Novo Chat</h1>
        <p>Clique no botão abaixo para iniciar uma nova conversa.</p>

        <form onSubmit={handleCreateChat} className={styles.form}>
          <button
            type="submit"
            disabled={loading}
            className={styles.button}
          >
            {loading ? 'Criando...' : 'Iniciar Chat'}
          </button>
        </form>
      </div>
    </div>
  );
}
