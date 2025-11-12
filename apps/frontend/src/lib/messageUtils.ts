import { Message } from './types';

/**
 * Adiciona uma mensagem ao array apenas se ela não existir
 * Remove duplicatas baseado no ID da mensagem
 */
export function addUniqueMessage(messages: Message[], newMessage: Message): Message[] {
  // Verifica se a mensagem já existe
  const exists = messages.some(m => m.id === newMessage.id);
  
  if (exists) {
    console.log(`[MessageUtils] Mensagem duplicada ignorada: ${newMessage.id}`);
    return messages;
  }
  
  console.log(`[MessageUtils] Nova mensagem adicionada: ${newMessage.id}`);
  return [...messages, newMessage];
}

/**
 * Remove mensagens duplicadas de um array
 */
export function deduplicateMessages(messages: Message[]): Message[] {
  const seen = new Set<string>();
  return messages.filter(msg => {
    if (seen.has(msg.id)) {
      console.log(`[MessageUtils] Duplicata removida: ${msg.id}`);
      return false;
    }
    seen.add(msg.id);
    return true;
  });
}

/**
 * Define um array de mensagens, removendo duplicatas
 */
export function setUniqueMessages(messages: Message[]): Message[] {
  return deduplicateMessages(messages);
}
