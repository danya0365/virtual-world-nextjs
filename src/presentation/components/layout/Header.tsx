'use client';

import { siteConfig } from '@/src/config/site.config';
import {
    NotificationBell,
    NotificationDropdown,
} from '@/src/presentation/components/common/NotificationDropdown';
import { animated, useSpring } from '@react-spring/web';
import {
    Backpack,
    Gamepad2,
    Globe,
    Home,
    MessageCircle,
    ShoppingBag,
    Trophy,
    User,
    Users,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
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

            {/* Desktop Navigation - hidden on mobile (use BottomTabBar instead) */}
            <nav className="hidden md:flex items-center gap-1">
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
              {/* Progress Display - hidden on mobile */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 
                            rounded-full glass-subtle">
                <div className="w-20 h-2 rounded-full bg-[hsl(var(--color-surface))]">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-green-400 to-green-500"
                    style={{ width: `${(siteConfig.defaultStats.level / siteConfig.defaultStats.maxLevel) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-[hsl(var(--color-text-secondary))]">
                  {siteConfig.defaultStats.level}/{siteConfig.defaultStats.maxLevel}
                </span>
              </div>

              {/* Notifications */}
              <div className="relative">
                <NotificationBell onClick={() => setIsNotificationOpen(!isNotificationOpen)} />
                <NotificationDropdown
                  isOpen={isNotificationOpen}
                  onClose={() => setIsNotificationOpen(false)}
                />
              </div>

              {/* Theme Toggle - hidden on mobile for cleaner look */}
              <div className="hidden sm:block">
                <ThemeToggle />
              </div>

              {/* User Avatar */}
              <button className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 
                               border-[hsl(var(--color-primary))] shadow-lg
                               hover:scale-105 transition-transform duration-200
                               active:scale-95">
                <div className="w-full h-full bg-gradient-to-br from-pink-400 to-purple-500 
                              flex items-center justify-center text-white font-bold text-sm sm:text-base">
                  M
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
