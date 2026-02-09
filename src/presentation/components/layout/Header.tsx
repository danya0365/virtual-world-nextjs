'use client';

import { siteConfig } from '@/src/config/site.config';
import {
    NotificationBell,
    NotificationDropdown,
} from '@/src/presentation/components/common/NotificationDropdown';
import { animated, useSpring } from '@react-spring/web';
import {
    Backpack,
    BarChart2,
    Gamepad2,
    Globe,
    Home,
    LogOut,
    MessageCircle,
    Settings,
    ShoppingBag,
    Trophy,
    User,
    Users,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { CurrencyBar } from '../currency/CurrencyBar';
import { SoundToggle } from '../sound/SoundToggle';
import { ThemeToggle } from './ThemeToggle';

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
};


export function Header() {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Logo animation
  const logoSpring = useSpring({
    from: { scale: 0.8, opacity: 0 },
    to: { scale: 1, opacity: 1 },
    config: { tension: 200, friction: 20 },
  });

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="glass rounded-b-2xl mx-2 sm:mx-4 mt-0">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo */}
            <animated.div style={logoSpring}>
              <Link 
                href="/" 
                className="flex items-center gap-2 sm:gap-3 group"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-purple-400 to-blue-500 
                              flex items-center justify-center text-white font-bold text-base sm:text-lg
                              shadow-lg group-hover:shadow-xl transition-shadow
                              group-hover:scale-105 transition-transform duration-200">
                  {siteConfig.logo.icon}
                </div>
                <span className="text-lg sm:text-xl font-bold gradient-text hidden sm:block">
                  {siteConfig.name}
                </span>
              </Link>
            </animated.div>

            {/* Desktop Navigation - hidden (now using BottomTabBar on all screens) */}
            <nav className="hidden items-center gap-1">
              {siteConfig.navigation.map((item) => {
                const Icon = iconMap[item.icon] || Home;
                const isHovered = hoveredItem === item.name;
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="relative px-4 py-2 rounded-xl text-sm font-medium
                             transition-colors duration-200
                             text-[hsl(var(--color-text-secondary))]
                             hover:text-[hsl(var(--color-text-primary))]"
                    onMouseEnter={() => setHoveredItem(item.name)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <span className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      {item.name}
                    </span>
                    
                    {/* Hover background */}
                    <animated.div
                      className="absolute inset-0 rounded-xl -z-10"
                      style={{
                        background: isHovered 
                          ? 'hsl(var(--color-primary) / 0.1)' 
                          : 'transparent',
                        transition: 'background 0.2s ease',
                      }}
                    />
                  </Link>
                );
              })}
            </nav>

            {/* Right Section */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Currency Display - hidden on mobile */}
              <div className="hidden sm:block">
                <CurrencyBar currencies={['gems', 'coins']} />
              </div>

              {/* Notifications */}
              <div className="relative">
                <NotificationBell onClick={() => setIsNotificationOpen(!isNotificationOpen)} />
                <NotificationDropdown
                  isOpen={isNotificationOpen}
                  onClose={() => setIsNotificationOpen(false)}
                />
              </div>

              {/* Sound Toggle */}
              <SoundToggle />

              {/* Theme Toggle - hidden on mobile for cleaner look */}
              <div className="hidden sm:block">
                <ThemeToggle />
              </div>

              {/* User Avatar with Menu */}
              <div className="relative" ref={userMenuRef}>
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 
                                border-[hsl(var(--color-primary))] shadow-lg
                                hover:scale-105 transition-transform duration-200
                                active:scale-95">
                  <div className="w-full h-full bg-gradient-to-br from-pink-400 to-purple-500 
                                flex items-center justify-center text-white font-bold text-sm sm:text-base">
                    M
                  </div>
                </button>

                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 glass rounded-2xl shadow-xl overflow-hidden z-50">
                    {/* User Info */}
                    <div className="p-4 border-b border-white/10">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-bold">
                          M
                        </div>
                        <div>
                          <p className="font-bold">Maros</p>
                          <p className="text-xs text-[hsl(var(--color-text-muted))]">Level 25 • VIP</p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="p-2">
                      <Link
                        href="/profile"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[hsl(var(--color-surface))] transition"
                      >
                        <BarChart2 className="w-5 h-5 text-purple-500" />
                        <span>สถิติของฉัน</span>
                      </Link>
                      <Link
                        href="/character"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[hsl(var(--color-surface))] transition"
                      >
                        <User className="w-5 h-5 text-blue-500" />
                        <span>ตัวละครของฉัน</span>
                      </Link>
                      <Link
                        href="/inventory"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[hsl(var(--color-surface))] transition"
                      >
                        <Backpack className="w-5 h-5 text-orange-500" />
                        <span>กระเป๋า</span>
                      </Link>
                      <button
                        onClick={() => setIsUserMenuOpen(false)}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[hsl(var(--color-surface))] transition"
                      >
                        <Settings className="w-5 h-5 text-gray-500" />
                        <span>ตั้งค่า</span>
                      </button>
                    </div>

                    {/* Logout */}
                    <div className="p-2 border-t border-white/10">
                      <button
                        onClick={() => setIsUserMenuOpen(false)}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition"
                      >
                        <LogOut className="w-5 h-5" />
                        <span>ออกจากระบบ</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
