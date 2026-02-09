'use client';

import { AnimatedButton } from '@/src/presentation/components/common/AnimatedButton';
import { GlassPanel } from '@/src/presentation/components/common/GlassPanel';
import { animated, config, useSpring } from '@react-spring/web';
import {
    ArrowLeft,
    MessageCircle,
    MoreHorizontal,
    Phone,
    Pin,
    Search,
    Send,
    Smile,
    Users,
    Video,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface Participant {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'playing';
}

interface Message {
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

interface Conversation {
  id: string;
  type: 'direct' | 'group';
  name: string;
  avatar: string;
  participants: Participant[];
  lastMessage?: Message;
  unreadCount: number;
  isPinned?: boolean;
  createdAt: string;
  updatedAt: string;
}

// Mock data
const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-001',
    type: 'direct',
    name: 'Sakura',
    avatar: '🌸',
    participants: [
      { id: 'user-001', name: 'Mike', avatar: '👤', status: 'online' },
      { id: 'user-002', name: 'Sakura', avatar: '🌸', status: 'online' },
    ],
    lastMessage: {
      id: 'msg-004',
      conversationId: 'conv-001',
      senderId: 'user-002',
      senderName: 'Sakura',
      senderAvatar: '🌸',
      content: 'พร้อมแล้ว มาเลย!',
      timestamp: '2024-01-21T10:32:00Z',
      isRead: false,
      type: 'text',
    },
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
    participants: [
      { id: 'user-001', name: 'Mike', avatar: '👤', status: 'online' },
      { id: 'user-003', name: 'Dragon', avatar: '🐉', status: 'playing' },
    ],
    lastMessage: {
      id: 'msg-007',
      conversationId: 'conv-002',
      senderId: 'user-003',
      senderName: 'Dragon',
      senderAvatar: '🐉',
      content: 'ดาบมังกร! โจมตี +50',
      timestamp: '2024-01-21T09:02:00Z',
      isRead: false,
      type: 'text',
    },
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
      { id: 'user-001', name: 'Mike', avatar: '👤', status: 'online' },
      { id: 'user-004', name: 'Moon', avatar: '🐰', status: 'online' },
      { id: 'user-005', name: 'Star', avatar: '⭐', status: 'playing' },
      { id: 'user-007', name: 'Phoenix', avatar: '🔥', status: 'online' },
    ],
    lastMessage: {
      id: 'msg-010',
      conversationId: 'conv-003',
      senderId: 'user-007',
      senderName: 'Phoenix',
      senderAvatar: '🔥',
      content: 'มาเลย!',
      timestamp: '2024-01-20T20:10:00Z',
      isRead: true,
      type: 'text',
    },
    unreadCount: 0,
    createdAt: '2024-01-20T19:00:00Z',
    updatedAt: '2024-01-20T20:10:00Z',
  },
];

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

const statusColors = {
  online: 'bg-green-500',
  offline: 'bg-gray-400',
  playing: 'bg-blue-500',
};

export function ChatView() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Animation
  const titleSpring = useSpring({
    from: { opacity: 0, y: -20 },
    to: { opacity: 1, y: 0 },
    config: config.gentle,
  });

  const filteredConversations = MOCK_CONVERSATIONS.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalUnread = MOCK_CONVERSATIONS.reduce((sum, c) => sum + c.unreadCount, 0);

  // Load messages when conversation changes
  useEffect(() => {
    if (selectedConversation) {
      setMessages(MOCK_MESSAGES[selectedConversation.id] || []);
    }
  }, [selectedConversation]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedConversation) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      conversationId: selectedConversation.id,
      senderId: 'user-001',
      senderName: 'Mike',
      senderAvatar: '👤',
      content: messageInput,
      timestamp: new Date().toISOString(),
      isRead: true,
      type: 'text',
    };

    setMessages([...messages, newMessage]);
    setMessageInput('');
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'เมื่อวาน';
    } else {
      return date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' });
    }
  };

  return (
    <div className="min-h-[calc(100vh-12rem)] flex flex-col">
      {/* Header */}
      <animated.div style={titleSpring} className="mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2 flex items-center gap-3">
          <span className="text-[hsl(var(--color-text-primary))]">แชท</span>
          <MessageCircle className="w-8 h-8 text-[hsl(var(--color-primary))]" />
        </h1>
        <p className="text-[hsl(var(--color-text-secondary))]">
          {totalUnread > 0 ? `${totalUnread} ข้อความใหม่` : 'ไม่มีข้อความใหม่'}
        </p>
      </animated.div>

      {/* Main Chat Layout */}
      <div className="flex-1 flex gap-4 min-h-[500px]">
        {/* Conversation List */}
        <GlassPanel className={`w-full md:w-80 shrink-0 flex flex-col ${selectedConversation ? 'hidden md:flex' : 'flex'}`}>
          {/* Search */}
          <div className="p-4 border-b border-[hsl(var(--color-primary)/0.1)]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--color-text-muted))]" />
              <input
                type="text"
                placeholder="ค้นหาแชท..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl glass border-none outline-none text-sm
                         text-[hsl(var(--color-text-primary))] placeholder:text-[hsl(var(--color-text-muted))]
                         focus:ring-2 focus:ring-[hsl(var(--color-primary))]"
              />
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedConversation(conv)}
                className={`w-full p-4 flex items-center gap-3 transition-colors text-left
                  hover:bg-[hsl(var(--color-primary)/0.1)]
                  ${selectedConversation?.id === conv.id ? 'bg-[hsl(var(--color-primary)/0.15)]' : ''}`}
              >
                {/* Avatar */}
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-blue-500
                                flex items-center justify-center text-2xl">
                    {conv.avatar}
                  </div>
                  {conv.type === 'direct' && (
                    <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white
                                  ${statusColors[conv.participants[1]?.status || 'offline']}`} />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {conv.isPinned && <Pin className="w-3 h-3 text-[hsl(var(--color-primary))]" />}
                    <span className="font-semibold text-[hsl(var(--color-text-primary))] truncate">
                      {conv.name}
                    </span>
                    {conv.type === 'group' && (
                      <Users className="w-3 h-3 text-[hsl(var(--color-text-muted))]" />
                    )}
                  </div>
                  <p className="text-sm text-[hsl(var(--color-text-muted))] truncate">
                    {conv.lastMessage?.content}
                  </p>
                </div>

                {/* Time & Badge */}
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs text-[hsl(var(--color-text-muted))]">
                    {conv.lastMessage && formatTime(conv.lastMessage.timestamp)}
                  </span>
                  {conv.unreadCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-[hsl(var(--color-primary))] text-white
                                   text-xs flex items-center justify-center">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </GlassPanel>

        {/* Chat Area */}
        {selectedConversation ? (
          <GlassPanel className={`flex-1 flex flex-col ${selectedConversation ? 'flex' : 'hidden md:flex'}`}>
            {/* Chat Header */}
            <div className="p-4 border-b border-[hsl(var(--color-primary)/0.1)] flex items-center gap-3">
              <button
                onClick={() => setSelectedConversation(null)}
                className="md:hidden p-2 rounded-lg glass hover:bg-[hsl(var(--color-primary)/0.1)]"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-blue-500
                            flex items-center justify-center text-xl">
                {selectedConversation.avatar}
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-[hsl(var(--color-text-primary))]">
                  {selectedConversation.name}
                </h3>
                <p className="text-xs text-[hsl(var(--color-text-muted))]">
                  {selectedConversation.type === 'group'
                    ? `${selectedConversation.participants.length} สมาชิก`
                    : selectedConversation.participants[1]?.status === 'online'
                      ? 'ออนไลน์'
                      : selectedConversation.participants[1]?.status === 'playing'
                        ? 'กำลังเล่นเกม'
                        : 'ออฟไลน์'}
                </p>
              </div>

              <div className="flex gap-2">
                <button className="p-2 rounded-lg glass hover:bg-[hsl(var(--color-primary)/0.1)]">
                  <Phone className="w-5 h-5 text-[hsl(var(--color-text-secondary))]" />
                </button>
                <button className="p-2 rounded-lg glass hover:bg-[hsl(var(--color-primary)/0.1)]">
                  <Video className="w-5 h-5 text-[hsl(var(--color-text-secondary))]" />
                </button>
                <button className="p-2 rounded-lg glass hover:bg-[hsl(var(--color-primary)/0.1)]">
                  <MoreHorizontal className="w-5 h-5 text-[hsl(var(--color-text-secondary))]" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => {
                const isMe = msg.senderId === 'user-001';
                return (
                  <div
                    key={msg.id}
                    className={`flex items-end gap-2 ${isMe ? 'flex-row-reverse' : ''}`}
                  >
                    {!isMe && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-blue-500
                                    flex items-center justify-center text-sm shrink-0">
                        {msg.senderAvatar}
                      </div>
                    )}
                    <div
                      className={`max-w-[70%] px-4 py-2 rounded-2xl
                        ${isMe
                          ? 'bg-[hsl(var(--color-primary))] text-white rounded-br-sm'
                          : 'glass rounded-bl-sm'}`}
                    >
                      {!isMe && selectedConversation.type === 'group' && (
                        <p className="text-xs text-[hsl(var(--color-primary))] font-medium mb-1">
                          {msg.senderName}
                        </p>
                      )}
                      <p className={msg.type === 'emoji' ? 'text-3xl' : ''}>
                        {msg.content}
                      </p>
                      <p className={`text-xs mt-1 ${isMe ? 'text-white/70' : 'text-[hsl(var(--color-text-muted))]'}`}>
                        {formatTime(msg.timestamp)}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-[hsl(var(--color-primary)/0.1)]">
              <div className="flex gap-2">
                <button className="p-3 rounded-xl glass hover:bg-[hsl(var(--color-primary)/0.1)]">
                  <Smile className="w-5 h-5 text-[hsl(var(--color-text-secondary))]" />
                </button>
                <input
                  type="text"
                  placeholder="พิมพ์ข้อความ..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 px-4 py-3 rounded-xl glass border-none outline-none
                           text-[hsl(var(--color-text-primary))] placeholder:text-[hsl(var(--color-text-muted))]
                           focus:ring-2 focus:ring-[hsl(var(--color-primary))]"
                />
                <AnimatedButton
                  variant="primary"
                  size="md"
                  icon={<Send className="w-5 h-5" />}
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim()}
                >
                  ส่ง
                </AnimatedButton>
              </div>
            </div>
          </GlassPanel>
        ) : (
          <GlassPanel className="hidden md:flex flex-1 items-center justify-center">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 mx-auto mb-4 text-[hsl(var(--color-text-muted))]" />
              <h3 className="text-xl font-semibold text-[hsl(var(--color-text-primary))] mb-2">
                เลือกแชทเพื่อเริ่มต้น
              </h3>
              <p className="text-[hsl(var(--color-text-muted))]">
                เลือกเพื่อนหรือกลุ่มเพื่อเริ่มสนทนา
              </p>
            </div>
          </GlassPanel>
        )}
      </div>
    </div>
  );
}
