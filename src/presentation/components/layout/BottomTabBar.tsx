'use client';

import { siteConfig } from '@/src/config/site.config';
import { animated, config, useSpring } from '@react-spring/web';
import {
  Backpack,
  BarChart2,
  Crown,
  Gamepad2,
  Gem,
  Gift,
  Globe,
  Home,
  Map,
  Medal,
  MessageCircle,
  MoreHorizontal,
  PartyPopper,
  ScrollText,
  Shield,
  ShoppingBag,
  Sparkles,
  Store,
  Trophy,
  User,
  Users,
  X
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

// Icon mapping
const iconMap: Record<string, React.ElementType> = {
  Home,
  Globe,
  User,
  ShoppingBag,
  Users,
  MessageCircle,
  Backpack,
  Trophy,
  Gamepad2,
  Gift,
  PartyPopper,
  ScrollText,
  Map,
  Shield,
  Crown,
  Sparkles,
  Gem,
  Store,
  Medal,
  ChartBar: BarChart2,
};

// Primary tabs shown in bottom bar (4 items + More)
const PRIMARY_TAB_HREFS = ['/', '/games', '/gacha', '/shop'];

export function BottomTabBar() {
  const pathname = usePathname();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  // Filter navigation into primary tabs and more items
  const primaryTabs = siteConfig.navigation.filter(item => 
    PRIMARY_TAB_HREFS.includes(item.href)
  );
  
  const moreItems = siteConfig.navigation.filter(item => 
    !PRIMARY_TAB_HREFS.includes(item.href)
  );

  // Check if current page is in more menu
  const isMoreActive = moreItems.some(item => pathname === item.href);

  return (
    <>
      {/* Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 safe-area-bottom">
        <div className="glass border-t border-[hsl(var(--color-primary)/0.1)] px-2">
          <div className="flex items-center justify-around h-16">
            {/* Primary Tabs */}
            {primaryTabs.map((item) => {
              const Icon = iconMap[item.icon] || Home;
              const isActive = pathname === item.href;
              
              return (
                <TabButton
                  key={item.href}
                  href={item.href}
                  icon={<Icon className="w-6 h-6" />}
                  label={item.name}
                  isActive={isActive}
                />
              );
            })}

            {/* More Button */}
            <button
              onClick={() => setIsMoreOpen(true)}
              className={`flex flex-col items-center justify-center gap-1 py-2 px-3 min-w-[60px] min-h-[48px]
                         rounded-xl transition-all duration-200 active:scale-95
                         ${isMoreActive 
                           ? 'text-[hsl(var(--color-primary))]' 
                           : 'text-[hsl(var(--color-text-muted))]'
                         }`}
            >
              <MoreHorizontal className="w-6 h-6" />
              <span className="text-[10px] font-medium">เพิ่มเติม</span>
            </button>
          </div>
        </div>
      </nav>

      {/* More Menu Overlay */}
      <MoreMenu 
        isOpen={isMoreOpen} 
        onClose={() => setIsMoreOpen(false)}
        items={moreItems}
        pathname={pathname}
      />
    </>
  );
}

// Tab Button Component
interface TabButtonProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

function TabButton({ href, icon, label, isActive }: TabButtonProps) {
  const spring = useSpring({
    scale: isActive ? 1.05 : 1,
    y: isActive ? -2 : 0,
    config: config.wobbly,
  });

  return (
    <Link href={href} className="block">
      <animated.div
        style={spring}
        className={`flex flex-col items-center justify-center gap-1 py-2 px-3 min-w-[60px] min-h-[48px]
                   rounded-xl transition-all duration-200 active:scale-95
                   ${isActive 
                     ? 'text-[hsl(var(--color-primary))] bg-[hsl(var(--color-primary)/0.1)]' 
                     : 'text-[hsl(var(--color-text-muted))]'
                   }`}
      >
        {icon}
        <span className="text-[10px] font-medium">{label}</span>
        
        {/* Active indicator dot */}
        {isActive && (
          <div className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-[hsl(var(--color-primary))]" />
        )}
      </animated.div>
    </Link>
  );
}

// More Menu Component with Grouped Layout
interface MoreMenuProps {
  isOpen: boolean;
  onClose: () => void;
  items: typeof siteConfig.navigation;
  pathname: string;
}

// Menu Group Definitions
const MENU_GROUPS = [
  {
    id: 'explore',
    title: '🌍 สำรวจ & สังคม',
    color: 'from-blue-500 to-cyan-500',
    paths: ['/explore', '/map', '/friends', '/chat', '/party', '/guilds'],
  },
  {
    id: 'character',
    title: '👤 ตัวละคร & ของสะสม',
    color: 'from-purple-500 to-pink-500',
    paths: ['/character', '/inventory', '/house'],
  },
  {
    id: 'shop',
    title: '🛒 ร้านค้า',
    color: 'from-yellow-500 to-orange-500',
    paths: ['/shop/premium', '/shop/currency', '/trading'],
  },
  {
    id: 'activities',
    title: '🎁 กิจกรรม & รางวัล',
    color: 'from-green-500 to-emerald-500',
    paths: ['/daily', '/events', '/quests', '/achievements', '/leaderboard'],
  },
  {
    id: 'premium',
    title: '💎 พรีเมียม',
    color: 'from-amber-500 to-yellow-400',
    paths: ['/vip'],
  },
  {
    id: 'profile',
    title: '📊 โปรไฟล์',
    color: 'from-gray-500 to-slate-500',
    paths: ['/profile'],
  },
];

function MoreMenu({ isOpen, onClose, items, pathname }: MoreMenuProps) {
  const overlaySpring = useSpring({
    opacity: isOpen ? 1 : 0,
    config: config.gentle,
  });

  const menuSpring = useSpring({
    transform: isOpen ? 'translateY(0%)' : 'translateY(100%)',
    config: config.gentle,
  });

  if (!isOpen) return null;

  // Group items by category
  const groupedItems = MENU_GROUPS.map(group => ({
    ...group,
    items: items.filter(item => group.paths.includes(item.href)),
  })).filter(group => group.items.length > 0);

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <animated.div
        style={overlaySpring}
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Menu Panel */}
      <animated.div
        style={menuSpring}
        className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-3xl overflow-hidden max-h-[85vh] flex flex-col shadow-2xl"
      >
        {/* Handle Bar */}
        <div className="flex justify-center py-3 flex-shrink-0">
          <div className="w-12 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 pb-4 flex-shrink-0 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <span className="text-2xl">✨</span>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              เมนูทั้งหมด
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400
                     hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-900/30 dark:hover:text-red-400 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Menu Content */}
        <div className="overflow-y-auto flex-1 px-4 py-4 space-y-6">
          {groupedItems.map((group) => (
            <div key={group.id} className="space-y-3">
              {/* Group Header */}
              <div className="flex items-center gap-3 px-2">
                <div className={`w-1 h-6 rounded-full bg-gradient-to-b ${group.color}`} />
                <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                  {group.title}
                </h3>
              </div>

              {/* Group Items Grid */}
              <div className="grid grid-cols-3 gap-3">
                {group.items.map((item) => {
                  const Icon = iconMap[item.icon] || Home;
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={`relative flex flex-col items-center justify-center gap-2 p-4 min-h-[88px]
                                 rounded-2xl transition-all duration-200 active:scale-95 overflow-hidden
                                 ${isActive 
                                   ? 'text-white shadow-lg' 
                                   : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                 }`}
                    >
                      {/* Active background gradient */}
                      {isActive && (
                        <div className={`absolute inset-0 bg-gradient-to-br ${group.color}`} />
                      )}
                      
                      {/* Content */}
                      <div className="relative z-10 flex flex-col items-center gap-2">
                        <Icon className="w-7 h-7" />
                        <span className="text-xs font-semibold text-center leading-tight">
                          {item.name}
                        </span>
                      </div>

                      {/* Active indicator */}
                      {isActive && (
                        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-white animate-pulse" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Quick Access Footer */}
          <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-center text-gray-400 dark:text-gray-500 mb-3">ทางลัด</p>
            <div className="flex items-center justify-center gap-4">
              <Link
                href="/gacha"
                onClick={onClose}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-bold shadow-lg shadow-purple-500/30 hover:shadow-xl hover:scale-105 transition-all"
              >
                <Sparkles className="w-5 h-5" />
                กาชา
              </Link>
              <Link
                href="/daily"
                onClick={onClose}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-bold shadow-lg shadow-orange-500/30 hover:shadow-xl hover:scale-105 transition-all"
              >
                <Gift className="w-5 h-5" />
                รับรางวัล
              </Link>
            </div>
          </div>
        </div>

        {/* Safe area padding */}
        <div className="h-6 flex-shrink-0 bg-white dark:bg-gray-900" />
      </animated.div>
    </div>
  );
}

