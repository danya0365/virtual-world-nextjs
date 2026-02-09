'use client';

import { animated, config, useSpring } from '@react-spring/web';
import { Bell, Check, ChevronRight, Gift, MessageCircle, PartyPopper, Sparkles, Trophy, UserPlus, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Notification {
  id: string;
  type: 'achievement' | 'friend' | 'gift' | 'event' | 'message' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
  actionUrl?: string;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'achievement',
    title: '🏆 ความสำเร็จใหม่!',
    message: 'คุณได้รับป้าย "นักสำรวจ" แล้ว!',
    time: '2 นาทีก่อน',
    read: false,
    actionUrl: '/achievements',
  },
  {
    id: '2',
    type: 'friend',
    title: '👥 คำขอเป็นเพื่อน',
    message: 'Alice ขอเป็นเพื่อนกับคุณ',
    time: '5 นาทีก่อน',
    read: false,
    actionUrl: '/friends',
  },
  {
    id: '3',
    type: 'gift',
    title: '🎁 ของขวัญรายวัน!',
    message: 'อย่าลืมรับรางวัล Login Streak วันที่ 5!',
    time: '1 ชม. ก่อน',
    read: false,
    actionUrl: '/daily',
  },
  {
    id: '4',
    type: 'event',
    title: '🎉 อีเวนต์ใหม่!',
    message: 'Winter Wonderland Festival เริ่มแล้ว!',
    time: '2 ชม. ก่อน',
    read: true,
    actionUrl: '/events',
  },
  {
    id: '5',
    type: 'message',
    title: '💬 ข้อความใหม่',
    message: 'Bob ส่งข้อความถึงคุณ',
    time: '3 ชม. ก่อน',
    read: true,
    actionUrl: '/chat',
  },
  {
    id: '6',
    type: 'system',
    title: '⭐ อัพเดตระบบ',
    message: 'เพิ่มเกมมินิใหม่ 4 เกม!',
    time: '1 วันก่อน',
    read: true,
    actionUrl: '/games',
  },
];

const typeIcons = {
  achievement: <Trophy className="w-5 h-5 text-yellow-500" />,
  friend: <UserPlus className="w-5 h-5 text-blue-500" />,
  gift: <Gift className="w-5 h-5 text-pink-500" />,
  event: <PartyPopper className="w-5 h-5 text-purple-500" />,
  message: <MessageCircle className="w-5 h-5 text-green-500" />,
  system: <Sparkles className="w-5 h-5 text-cyan-500" />,
};

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const slideSpring = useSpring({
    transform: isOpen ? 'translateX(0%)' : 'translateX(100%)',
    opacity: isOpen ? 1 : 0,
    config: config.gentle,
  });

  const backdropSpring = useSpring({
    opacity: isOpen ? 1 : 0,
    config: config.gentle,
  });

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.read)
    : notifications;

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Close on escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <animated.div 
        style={backdropSpring}
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />

      {/* Panel */}
      <animated.div 
        style={slideSpring}
        className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-[hsl(var(--color-background))] z-50 shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[hsl(var(--color-primary)/0.1)]">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-purple-500" />
            <h2 className="text-lg font-bold">การแจ้งเตือน</h2>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-[hsl(var(--color-surface))] transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 p-4">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition
              ${filter === 'all' 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                : 'bg-[hsl(var(--color-surface))]'}`}
          >
            ทั้งหมด
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition
              ${filter === 'unread' 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                : 'bg-[hsl(var(--color-surface))]'}`}
          >
            ยังไม่อ่าน ({unreadCount})
          </button>
        </div>

        {/* Mark All as Read */}
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="w-full px-4 py-2 text-sm text-purple-500 hover:bg-purple-500/5 transition flex items-center justify-center gap-1"
          >
            <Check className="w-4 h-4" />
            อ่านทั้งหมด
          </button>
        )}

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ maxHeight: 'calc(100vh - 200px)' }}>
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12 text-[hsl(var(--color-text-muted))]">
              <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>ไม่มีการแจ้งเตือน</p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-2xl transition-all
                  ${notification.read 
                    ? 'bg-[hsl(var(--color-surface))]' 
                    : 'bg-purple-500/10 border border-purple-500/30'}`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-[hsl(var(--color-background))]">
                    {typeIcons[notification.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <h3 className="font-bold text-sm">{notification.title}</h3>
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="p-1 rounded hover:bg-[hsl(var(--color-surface))] transition"
                      >
                        <X className="w-4 h-4 text-[hsl(var(--color-text-muted))]" />
                      </button>
                    </div>
                    <p className="text-sm text-[hsl(var(--color-text-secondary))] mt-1">
                      {notification.message}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-[hsl(var(--color-text-muted))]">
                        {notification.time}
                      </span>
                      {notification.actionUrl && (
                        <Link
                          href={notification.actionUrl}
                          onClick={() => markAsRead(notification.id)}
                          className="text-xs text-purple-500 flex items-center gap-1 hover:underline"
                        >
                          ดูเพิ่มเติม <ChevronRight className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </animated.div>
    </>
  );
}

// Bell button component to trigger notification center
export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount] = useState(3);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-2 rounded-xl hover:bg-[hsl(var(--color-surface))] transition"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>
      <NotificationCenter isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
