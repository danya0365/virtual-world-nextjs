/**
 * MockChatRepository
 * Mock implementation for Chat/Messaging
 * Following Clean Architecture - Infrastructure layer
 */

import {
    Conversation,
    IChatRepository,
    Message,
    Participant,
} from '@/src/application/repositories/IChatRepository';

// Mock participants (friends)
const MOCK_PARTICIPANTS: Record<string, Participant> = {
  'user-001': { id: 'user-001', name: 'Mike', avatar: '👤', status: 'online' },
  'user-002': { id: 'user-002', name: 'Sakura', avatar: '🌸', status: 'online' },
  'user-003': { id: 'user-003', name: 'Dragon', avatar: '🐉', status: 'playing' },
  'user-004': { id: 'user-004', name: 'Moon', avatar: '🐰', status: 'online' },
  'user-005': { id: 'user-005', name: 'Star', avatar: '⭐', status: 'playing' },
  'user-006': { id: 'user-006', name: 'Ninja', avatar: '🥷', status: 'offline' },
  'user-007': { id: 'user-007', name: 'Phoenix', avatar: '🔥', status: 'online' },
};

// Mock messages
const MOCK_MESSAGES: Record<string, Message[]> = {
  'conv-001': [
    { id: 'msg-001', conversationId: 'conv-001', senderId: 'user-002', senderName: 'Sakura', senderAvatar: '🌸', content: 'สวัสดี! วันนี้เล่นกันมั้ย?', timestamp: '2024-01-21T10:30:00Z', isRead: true, type: 'text' },
    { id: 'msg-002', conversationId: 'conv-001', senderId: 'user-001', senderName: 'Mike', senderAvatar: '👤', content: 'ได้เลย! ไปถ้ำคริสตัลกัน', timestamp: '2024-01-21T10:31:00Z', isRead: true, type: 'text' },
    { id: 'msg-003', conversationId: 'conv-001', senderId: 'user-002', senderName: 'Sakura', senderAvatar: '🌸', content: '🎉', timestamp: '2024-01-21T10:31:30Z', isRead: true, type: 'emoji' },
    { id: 'msg-004', conversationId: 'conv-001', senderId: 'user-002', senderName: 'Sakura', senderAvatar: '🌸', content: 'พร้อมแล้ว มาเลย!', timestamp: '2024-01-21T10:32:00Z', isRead: false, type: 'text' },
  ],
  'conv-002': [
    { id: 'msg-005', conversationId: 'conv-002', senderId: 'user-003', senderName: 'Dragon', senderAvatar: '🐉', content: 'เจอไอเท็มหายากมากเลย!', timestamp: '2024-01-21T09:00:00Z', isRead: true, type: 'text' },
    { id: 'msg-006', conversationId: 'conv-002', senderId: 'user-001', senderName: 'Mike', senderAvatar: '👤', content: 'อะไรเหรอ?', timestamp: '2024-01-21T09:01:00Z', isRead: true, type: 'text' },
    { id: 'msg-007', conversationId: 'conv-002', senderId: 'user-003', senderName: 'Dragon', senderAvatar: '🐉', content: 'ดาบมังกร! โจมตี +50', timestamp: '2024-01-21T09:02:00Z', isRead: false, type: 'text' },
  ],
  'conv-003': [
    { id: 'msg-008', conversationId: 'conv-003', senderId: 'user-004', senderName: 'Moon', senderAvatar: '🐰', content: 'ใครอยากสร้างกิลด์บ้าง?', timestamp: '2024-01-20T20:00:00Z', isRead: true, type: 'text' },
    { id: 'msg-009', conversationId: 'conv-003', senderId: 'user-005', senderName: 'Star', senderAvatar: '⭐', content: 'ฉันสนใจ!', timestamp: '2024-01-20T20:05:00Z', isRead: true, type: 'text' },
    { id: 'msg-010', conversationId: 'conv-003', senderId: 'user-007', senderName: 'Phoenix', senderAvatar: '🔥', content: 'มาเลย!', timestamp: '2024-01-20T20:10:00Z', isRead: true, type: 'text' },
  ],
};

// Mock conversations
const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-001',
    type: 'direct',
    name: 'Sakura',
    avatar: '🌸',
    participants: [MOCK_PARTICIPANTS['user-001'], MOCK_PARTICIPANTS['user-002']],
    lastMessage: MOCK_MESSAGES['conv-001'][3],
    unreadCount: 1,
    isPinned: true,
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-21T10:32:00Z',
  },
  {
    id: 'conv-002',
    type: 'direct',
    name: 'Dragon',
    avatar: '🐉',
    participants: [MOCK_PARTICIPANTS['user-001'], MOCK_PARTICIPANTS['user-003']],
    lastMessage: MOCK_MESSAGES['conv-002'][2],
    unreadCount: 1,
    createdAt: '2024-01-10T12:00:00Z',
    updatedAt: '2024-01-21T09:02:00Z',
  },
  {
    id: 'conv-003',
    type: 'group',
    name: 'Guild Hunters',
    avatar: '⚔️',
    participants: [
      MOCK_PARTICIPANTS['user-001'],
      MOCK_PARTICIPANTS['user-004'],
      MOCK_PARTICIPANTS['user-005'],
      MOCK_PARTICIPANTS['user-007'],
    ],
    lastMessage: MOCK_MESSAGES['conv-003'][2],
    unreadCount: 0,
    createdAt: '2024-01-20T19:00:00Z',
    updatedAt: '2024-01-20T20:10:00Z',
  },
];

export class MockChatRepository implements IChatRepository {
  private conversations: Conversation[] = [...MOCK_CONVERSATIONS];
  private messages: Record<string, Message[]> = { ...MOCK_MESSAGES };

  async getConversations(): Promise<Conversation[]> {
    await this.delay(100);
    return [...this.conversations].sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  async getConversationById(id: string): Promise<Conversation | null> {
    await this.delay(50);
    return this.conversations.find(c => c.id === id) || null;
  }

  async createConversation(participantIds: string[]): Promise<Conversation> {
    await this.delay(200);
    
    const participants = participantIds.map(id => MOCK_PARTICIPANTS[id]).filter(Boolean);
    const newConv: Conversation = {
      id: `conv-${Date.now()}`,
      type: participants.length > 2 ? 'group' : 'direct',
      name: participants.length > 2 ? 'New Group' : participants[1]?.name || 'Chat',
      avatar: participants.length > 2 ? '👥' : participants[1]?.avatar || '👤',
      participants,
      unreadCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.conversations.unshift(newConv);
    this.messages[newConv.id] = [];
    return newConv;
  }

  async deleteConversation(id: string): Promise<void> {
    await this.delay(100);
    this.conversations = this.conversations.filter(c => c.id !== id);
    delete this.messages[id];
  }

  async getMessages(conversationId: string, limit = 50): Promise<Message[]> {
    await this.delay(100);
    const msgs = this.messages[conversationId] || [];
    return msgs.slice(-limit);
  }

  async sendMessage(conversationId: string, content: string, type: Message['type'] = 'text'): Promise<Message> {
    await this.delay(100);

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId: 'user-001', // Current user
      senderName: 'Mike',
      senderAvatar: '👤',
      content,
      timestamp: new Date().toISOString(),
      isRead: true,
      type,
    };

    if (!this.messages[conversationId]) {
      this.messages[conversationId] = [];
    }
    this.messages[conversationId].push(newMessage);

    // Update conversation
    const conv = this.conversations.find(c => c.id === conversationId);
    if (conv) {
      conv.lastMessage = newMessage;
      conv.updatedAt = newMessage.timestamp;
    }

    return newMessage;
  }

  async markAsRead(conversationId: string): Promise<void> {
    await this.delay(50);
    
    const conv = this.conversations.find(c => c.id === conversationId);
    if (conv) {
      conv.unreadCount = 0;
    }

    const msgs = this.messages[conversationId];
    if (msgs) {
      msgs.forEach(msg => { msg.isRead = true; });
    }
  }

  async getUnreadCount(): Promise<number> {
    await this.delay(50);
    return this.conversations.reduce((sum, c) => sum + c.unreadCount, 0);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const mockChatRepository = new MockChatRepository();
