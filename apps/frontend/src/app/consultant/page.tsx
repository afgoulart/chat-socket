'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { useConsultant } from '../../hooks/useConsultant';
import { ChatMessages } from '../../components/ChatMessages';
import { ChatInput } from '../../components/ChatInput';
import { Client } from '../../lib/types';
import styles from './consultant.module.css';

export default function ConsultantPage() {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();

  // All hooks must be called before any conditional returns
  const {
    connected,
    chats,
    selectedChat,
    messages,
    closingWarning,
    selectChat,
    sendMessage,
    updateClient,
    refreshChats,
    closeChat,
    dismissWarning,
  } = useConsultant();

  const [clientForm, setClientForm] = useState<Client>({
    name: '',
    birthDate: '',
    location: '',
  });

  const handleSelectChat = (chatId: string) => {
    selectChat(chatId);
    const chat = chats.find((c) => c.id === chatId);
    if (chat) {
      setClientForm(chat.client || {});
    }
  };

  const handleUpdateClient = (e: React.FormEvent) => {
    e.preventDefault();
    updateClient(clientForm);
  };

  const handleSendMessage = (content: string) => {
    sendMessage(content);
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [authLoading, user, router]);

  // Show loading state
  if (authLoading || !user) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Carregando...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <div className={styles.userInfo}>
          <div>
            <p className={styles.userName}>{user.name}</p>
            <p className={styles.userRole}>
              {user.role === 'admin' ? 'Administrador' : 'Consultor'}
            </p>
          </div>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Sair
          </button>
        </div>

        <div className={styles.sidebarHeader}>
          <h2>Chats Ativos</h2>
          <button onClick={refreshChats} className={styles.refreshButton}>
            ↻
          </button>
        </div>

        <div className={styles.chatList}>
          {chats &&
            chats
              .filter((chat) => chat.status === 'active')
              .map((chat) => (
                <div
                  key={chat.id}
                  className={`${styles.chatItem} ${
                    selectedChat?.id === chat.id ? styles.selected : ''
                  }`}
                  onClick={() => handleSelectChat(chat.id)}
                >
                  <div className={styles.chatInfo}>
                    <strong>{chat.client?.name || 'Cliente Anônimo'}</strong>
                    <span className={styles.chatId}>
                      #{chat.id.slice(0, 8)}
                    </span>
                  </div>
                  <div className={styles.messageCount}>
                    {chat.messages?.length || 0} msgs
                  </div>
                </div>
              ))}

          {(!chats ||
            chats.filter((chat) => chat.status === 'active').length === 0) && (
            <div className={styles.emptyList}>
              <p>Nenhum chat ativo</p>
            </div>
          )}
        </div>
      </div>

      <div className={styles.mainContent}>
        {selectedChat ? (
          <>
            <div className={styles.header}>
              <div>
                <h1>{selectedChat.client.name || 'Cliente Anônimo'}</h1>
                <p>Chat ID: {selectedChat.id}</p>
              </div>
              <div className={styles.status}>
                <span
                  className={`${styles.statusDot} ${
                    connected ? styles.connected : styles.disconnected
                  }`}
                />
                {connected ? 'Conectado' : 'Desconectado'}
              </div>
            </div>

            {/* Warning Banner */}
            {closingWarning && closingWarning.chatId === selectedChat.id && (
              <div className={styles.warningBanner}>
                <div className={styles.warningContent}>
                  <span className={styles.warningIcon}>⚠️</span>
                  <div className={styles.warningText}>
                    <strong>Aviso de Inatividade</strong>
                    <p>{closingWarning.message}</p>
                  </div>
                </div>
                <div className={styles.warningActions}>
                  <button
                    onClick={() => closeChat(selectedChat.id)}
                    className={styles.closeNowButton}
                  >
                    Finalizar Agora
                  </button>
                  <button
                    onClick={dismissWarning}
                    className={styles.dismissButton}
                  >
                    Dispensar
                  </button>
                </div>
              </div>
            )}

            <div className={styles.contentArea}>
              <div className={styles.chatArea}>
                <ChatMessages messages={messages} />
                <ChatInput
                  onSendMessage={handleSendMessage}
                  disabled={!connected}
                />
              </div>

              <div className={styles.clientInfo}>
                <h3>Informações do Cliente</h3>
                <form onSubmit={handleUpdateClient} className={styles.form}>
                  <div className={styles.formGroup}>
                    <label>Nome</label>
                    <input
                      type="text"
                      value={clientForm.name || ''}
                      onChange={(e) =>
                        setClientForm({ ...clientForm, name: e.target.value })
                      }
                      placeholder="Nome do cliente"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Data de Nascimento</label>
                    <input
                      type="date"
                      value={clientForm.birthDate || ''}
                      onChange={(e) =>
                        setClientForm({
                          ...clientForm,
                          birthDate: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Localidade</label>
                    <input
                      type="text"
                      value={clientForm.location || ''}
                      onChange={(e) =>
                        setClientForm({
                          ...clientForm,
                          location: e.target.value,
                        })
                      }
                      placeholder="Cidade, Estado"
                    />
                  </div>

                  <button type="submit" className={styles.saveButton}>
                    Salvar Informações
                  </button>
                </form>
              </div>
            </div>
          </>
        ) : (
          <div className={styles.emptyState}>
            <p>Selecione um chat para começar</p>
          </div>
        )}
      </div>
    </div>
  );
}
