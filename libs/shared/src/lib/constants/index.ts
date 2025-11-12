export const DEFAULT_CHAT_TTL = 30; // 30 minutos
export const CHAT_CLOSING_WARNING_TIME = 1; // Avisar 1 minuto antes de fechar

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    REGISTER: '/api/auth/register',
  },
  CHAT: {
    LIST: '/api/chat',
    CREATE: '/api/chat',
    GET: (id: string) => `/api/chat/${id}`,
    UPDATE: (id: string) => `/api/chat/${id}`,
    CLOSE: (id: string) => `/api/chat/${id}/close`,
  },
  MESSAGES: {
    SEND: '/api/chat/message',
  },
  CONFIG: {
    GET: '/api/config',
    UPDATE: '/api/config',
  },
  USERS: {
    LIST: '/api/users',
    CREATE: '/api/users',
    GET: (id: string) => `/api/users/${id}`,
    UPDATE: (id: string) => `/api/users/${id}`,
    DELETE: (id: string) => `/api/users/${id}`,
  },
};

export const SOCKET_EVENTS = {
  CONNECTION: 'connection',
  DISCONNECT: 'disconnect',
  JOIN_CHAT: 'joinChat',
  LEAVE_CHAT: 'leaveChat',
  SEND_MESSAGE: 'sendMessage',
  NEW_MESSAGE: 'newMessage',
  CHAT_UPDATED: 'chatUpdated',
  CHAT_CLOSED: 'chatClosed',
  CHAT_CLOSING_WARNING: 'chatClosingWarning',
  ERROR: 'error',
};
