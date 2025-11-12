'use server';

import { Chat, Client } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export async function createChat(client?: Client): Promise<Chat> {
  const response = await fetch(`${API_URL}/chats`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ client }),
  });

  if (!response.ok) {
    throw new Error('Failed to create chat');
  }

  return response.json();
}

export async function getChat(id: string): Promise<Chat | null> {
  const response = await fetch(`${API_URL}/chats/${id}`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
}

export async function getAllChats(): Promise<Chat[]> {
  const response = await fetch(`${API_URL}/chats`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Failed to get chats');
  }

  return response.json();
}
