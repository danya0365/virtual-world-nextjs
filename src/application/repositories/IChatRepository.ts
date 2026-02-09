/**
 * IChatRepository
 * Chat/Messaging system interface
 * Following Clean Architecture - Application layer
 */

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  type: 'text' | 'emoji' | 'sticker' | 'system';
}

export interface Conversation {
  id: string;
  type: 'direct' | 'group';
  name: string;
  avatar: string;
  participants: Participant[];
  lastMessage?: Message;
  unreadCount: number;
  isPinned?: boolean;
  isMuted?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Participant {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'playing';
  role?: 'admin' | 'member';
}

export interface IChatRepository {
  // Conversations
  getConversations(): Promise<Conversation[]>;
  getConversationById(id: string): Promise<Conversation | null>;
  createConversation(participants: string[]): Promise<Conversation>;
  deleteConversation(id: string): Promise<void>;
  
  // Messages
  getMessages(conversationId: string, limit?: number): Promise<Message[]>;
  sendMessage(conversationId: string, content: string, type?: Message['type']): Promise<Message>;
  markAsRead(conversationId: string): Promise<void>;
  
  // Status
  getUnreadCount(): Promise<number>;
}
