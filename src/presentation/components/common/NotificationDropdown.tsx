'use client';

import { GlassPanel } from '@/src/presentation/components/common/GlassPanel';
import { animated, config, useSpring } from '@react-spring/web';
import {
    Bell,
    Gift,
    MessageCircle,
    Star,
    Trophy,
    UserPlus,
    X
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export interface Notification {
  id: string;
  type: 'message' | 'friend' | 'achievement' | 'reward' | 'system';
  title: string;
  message: string;
  icon: React.ReactNode;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-001',
    type: 'message',
    title: 'ข้อความใหม่จาก Sakura',
    message: 'พร้อมแล้ว มาเลย!',
    icon: <MessageCircle className="w-4 h-4 text-blue-500" />,
    timestamp: '2024-01-21T10:32:00Z',
    isRead: false,
    actionUrl: '/chat',
  },
  {
    id: 'notif-002',
    type: 'friend',
    title: 'คำขอเป็นเพื่อนใหม่',
    message: 'NightWolf ต้องการเป็นเพื่อนกับคุณ',
    icon: <UserPlus className="w-4 h-4 text-green-500" />,
    timestamp: '2024-01-21T09:15:00Z',
    isRead: false,
    actionUrl: '/friends',
  },
  {
    id: 'notif-003',
    type: 'achievement',
    title: 'ปลดล็อคความสำเร็จ!',
    message: 'คุณได้รับ "นักเดินทาง"',
    icon: <Trophy className="w-4 h-4 text-yellow-500" />,
    timestamp: '2024-01-21T08:00:00Z',
    isRead: true,
    actionUrl: '/achievements',
  },
  {
    id: 'notif-004',
    type: 'reward',
    title: 'รางวัลเข้าสู่ระบบรายวัน',
    message: 'รับ 50 เหรียญและ 5 Gems!',
    icon: <Gift className="w-4 h-4 text-purple-500" />,
    timestamp: '2024-01-21T07:30:00Z',
    isRead: true,
  },
  {
    id: 'notif-005',
    type: 'system',
    title: 'อัพเดทใหม่!',
    message: 'มินิเกมใหม่พร้อมให้เล่นแล้ว',
    icon: <Star className="w-4 h-4 text-orange-500" />,
    timestamp: '2024-01-20T20:00:00Z',
    isRead: true,
    actionUrl: '/games',
  },
];

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationDropdown({ isOpen, onClose }: NotificationDropdownProps) {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Animation
  const spring = useSpring({
    opacity: isOpen ? 1 : 0,
    transform: isOpen ? 'translateY(0) scale(1)' : 'translateY(-10px) scale(0.95)',
    config: config.gentle,
  });

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'ตอนนี้';
    if (diffMins < 60) return `${diffMins} นาทีที่แล้ว`;
    if (diffHours < 24) return `${diffHours} ชม.ที่แล้ว`;
    return `${diffDays} วันที่แล้ว`;
  };

  if (!isOpen) return null;

  return (
    <animated.div
      ref={dropdownRef}
      style={spring}
      className="absolute top-full right-0 mt-2 w-80 sm:w-96 z-50"
    >
      <GlassPanel className="overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-[hsl(var(--color-primary)/0.1)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-[hsl(var(--color-primary))]" />
            <h3 className="font-bold text-[hsl(var(--color-text-primary))]">การแจ้งเตือน</h3>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 bg-[hsl(var(--color-primary))] text-white text-xs rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-[hsl(var(--color-primary))] hover:underline"
              >
                อ่านทั้งหมด
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-[hsl(var(--color-primary)/0.1)]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="w-12 h-12 mx-auto mb-2 text-[hsl(var(--color-text-muted))]" />
              <p className="text-[hsl(var(--color-text-muted))]">ไม่มีการแจ้งเตือน</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <button
                key={notif.id}
                onClick={() => markAsRead(notif.id)}
                className={`w-full p-4 flex items-start gap-3 text-left transition-colors
                  hover:bg-[hsl(var(--color-primary)/0.05)]
                  ${!notif.isRead ? 'bg-[hsl(var(--color-primary)/0.1)]' : ''}`}
              >
                {/* Icon */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center
                  ${!notif.isRead ? 'bg-[hsl(var(--color-primary)/0.2)]' : 'bg-[hsl(var(--color-primary)/0.1)]'}`}>
                  {notif.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`font-medium truncate ${!notif.isRead ? 'text-[hsl(var(--color-text-primary))]' : 'text-[hsl(var(--color-text-secondary))]'}`}>
                      {notif.title}
                    </p>
                    {!notif.isRead && (
                      <span className="w-2 h-2 bg-[hsl(var(--color-primary))] rounded-full shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-[hsl(var(--color-text-muted))] truncate">
                    {notif.message}
                  </p>
                  <p className="text-xs text-[hsl(var(--color-text-muted))] mt-1">
                    {formatTime(notif.timestamp)}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[hsl(var(--color-primary)/0.1)] text-center">
          <button className="text-sm text-[hsl(var(--color-primary))] hover:underline">
            ดูทั้งหมด
          </button>
        </div>
      </GlassPanel>
    </animated.div>
  );
}

// Toast notification component
interface ToastProps {
  notification: Notification;
  onClose: () => void;
}

export function Toast({ notification, onClose }: ToastProps) {
  const spring = useSpring({
    from: { opacity: 0, x: 100 },
    to: { opacity: 1, x: 0 },
    config: config.gentle,
  });

  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <animated.div style={spring} className="pointer-events-auto">
      <GlassPanel className="p-4 flex items-start gap-3 shadow-lg">
        <div className="w-10 h-10 rounded-full bg-[hsl(var(--color-primary)/0.2)] flex items-center justify-center">
          {notification.icon}
        </div>
        <div className="flex-1">
          <p className="font-medium text-[hsl(var(--color-text-primary))]">
            {notification.title}
          </p>
          <p className="text-sm text-[hsl(var(--color-text-muted))]">
            {notification.message}
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-[hsl(var(--color-primary)/0.1)]"
        >
          <X className="w-4 h-4" />
        </button>
      </GlassPanel>
    </animated.div>
  );
}

// Notification bell button
interface NotificationBellProps {
  onClick: () => void;
  unreadCount?: number;
}

export function NotificationBell({ onClick, unreadCount = 2 }: NotificationBellProps) {
  return (
    <button
      onClick={onClick}
      className="relative p-2 rounded-xl glass hover:bg-[hsl(var(--color-primary)/0.1)] transition-colors"
    >
      <Bell className="w-5 h-5" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs
                       rounded-full flex items-center justify-center font-bold animate-pulse">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </button>
  );
}
