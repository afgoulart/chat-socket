'use client';

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Message } from '../lib/types';
import { addUniqueMessage, setUniqueMessages } from '../lib/messageUtils';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

export function useSocket(chatId?: string) {
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io(SOCKET_URL);

    socketRef.current.on('connect', () => {
      setConnected(true);
      console.log('Socket connected');

      // Join chat room if chatId provided
      if (chatId) {
        socketRef.current?.emit('joinChat', chatId);
      }
    });

    socketRef.current.on('disconnect', () => {
      setConnected(false);
      console.log('Socket disconnected');
    });

    socketRef.current.on('chatHistory', (history: Message[]) => {
      console.log('[useSocket] Recebeu histórico:', history.length);
      setMessages(setUniqueMessages(history));
    });

    socketRef.current.on('newMessage', (message: Message) => {
      console.log('[useSocket] Recebeu newMessage:', message.id);
      setMessages((prev) => addUniqueMessage(prev, message));
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [chatId]);

  const sendMessage = (content: string, sender: 'client' | 'consultant') => {
    if (!chatId) return;

    socketRef.current?.emit('sendMessage', {
      chatId,
      content,
      sender,
    });
  };

  const updateClient = (client: any) => {
    if (!chatId) return;

    socketRef.current?.emit('updateClient', {
      chatId,
      client,
    });
  };

  return {
    socket: socketRef.current,
    connected,
    messages,
    sendMessage,
    updateClient,
  };
}
