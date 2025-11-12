'use client';

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Chat, Message, Client } from '../lib/types';
import { addUniqueMessage, setUniqueMessages } from '../lib/messageUtils';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

export function useConsultant() {
  const [connected, setConnected] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [closingWarning, setClosingWarning] = useState<{ chatId: string; minutesRemaining: number; message: string } | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const selectedChatRef = useRef<Chat | null>(null);

  // Keep selectedChatRef in sync with selectedChat
  useEffect(() => {
    selectedChatRef.current = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    // Initialize socket connection only once
    socketRef.current = io(SOCKET_URL);

    socketRef.current.on('connect', () => {
      setConnected(true);
      console.log('Consultant socket connected');

      // Join consultants room
      socketRef.current?.emit('joinConsultants');
    });

    socketRef.current.on('disconnect', () => {
      setConnected(false);
      console.log('Consultant socket disconnected');
    });

    socketRef.current.on('allChats', (data: { event: string; data: Chat[] }) => {
      setChats(data.data);
    });

    socketRef.current.on('chatUpdate', (data: { chatId: string; message: Message }) => {
      // Update chats list when new message arrives
      socketRef.current?.emit('getAllChats');
    });

    socketRef.current.on('clientUpdated', (updatedChat: Chat) => {
      setChats((prev) =>
        prev.map((chat) => (chat.id === updatedChat.id ? updatedChat : chat))
      );

      if (selectedChatRef.current && selectedChatRef.current.id === updatedChat.id) {
        setSelectedChat(updatedChat);
      }
    });

    socketRef.current.on('newMessage', (message: Message) => {
      console.log('[useConsultant] Recebeu newMessage:', message.id);
      // Only add message if it's for the selected chat
      if (selectedChatRef.current && selectedChatRef.current.id === message.chatId) {
        setMessages((prev) => addUniqueMessage(prev, message));
      }
    });

    socketRef.current.on('chatHistory', (messages: Message[]) => {
      console.log('[useConsultant] Recebeu chatHistory via evento:', messages.length);
      if (selectedChatRef.current) {
        setMessages(setUniqueMessages(messages));
      }
    });

    socketRef.current.on('chatClosingWarning', (warning: { chatId: string; minutesRemaining: number; message: string }) => {
      console.log('[useConsultant] Aviso de fechamento recebido:', warning);
      setClosingWarning(warning);
    });

    socketRef.current.on('chatClosed', (chat: Chat) => {
      console.log('[useConsultant] Chat fechado:', chat.id);
      // Clear warning if exists
      setClosingWarning(null);
      // Refresh chats list
      socketRef.current?.emit('getAllChats');
      // Clear selected chat if it was closed
      if (selectedChatRef.current?.id === chat.id) {
        setSelectedChat(null);
        setMessages([]);
      }
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []); // Empty dependency array - only run once

  const selectChat = async (chatId: string) => {
    console.log('[useConsultant] Selecionando chat:', chatId);
    
    // Get full chat details first
    socketRef.current?.emit('getChat', chatId, (chat: Chat) => {
      console.log('[useConsultant] Recebeu chat completo:', chat);
      setSelectedChat(chat);
      
      // Set messages from the chat object
      if (chat?.messages) {
        console.log('[useConsultant] Definindo mensagens do chat:', chat.messages.length);
        setMessages(setUniqueMessages(chat.messages));
      }
    });

    // Join the chat room for real-time updates
    socketRef.current?.emit('joinChat', chatId, (response: any) => {
      console.log('[useConsultant] Resposta do joinChat:', response);
      
      // Handle both formats: direct array or { event, data } object
      if (Array.isArray(response)) {
        console.log('[useConsultant] Histórico como array:', response.length);
        setMessages(setUniqueMessages(response));
      } else if (response?.data) {
        console.log('[useConsultant] Histórico em response.data:', response.data.length);
        setMessages(setUniqueMessages(response.data));
      }
    });
  };

  const sendMessage = (content: string) => {
    if (!selectedChat) return;

    socketRef.current?.emit('sendMessage', {
      chatId: selectedChat.id,
      content,
      sender: 'consultant',
    });
  };

  const updateClient = (client: Client) => {
    if (!selectedChat) return;

    socketRef.current?.emit('updateClient', {
      chatId: selectedChat.id,
      client,
    });
  };

  const refreshChats = () => {
    socketRef.current?.emit('getAllChats', (chats: Chat[]) => {
      setChats(chats);
    });
  };

  const closeChat = (chatId: string) => {
    console.log('[useConsultant] Fechando chat manualmente:', chatId);
    socketRef.current?.emit('closeChat', chatId);
    setClosingWarning(null);
  };

  const dismissWarning = () => {
    setClosingWarning(null);
  };

  return {
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
  };
}
