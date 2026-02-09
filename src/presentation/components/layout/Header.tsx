'use client';

import { siteConfig } from '@/src/config/site.config';
import { animated, useSpring } from '@react-spring/web';
import { Globe, Home, Menu, ShoppingBag, User, Users, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { ThemeToggle } from './ThemeToggle';

const iconMap: Record<string, React.ElementType> = {
  Home,
  Globe,
  User,
  ShoppingBag,
  Users,
};

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // Logo animation
  const logoSpring = useSpring({
    from: { scale: 0.8, opacity: 0 },
    to: { scale: 1, opacity: 1 },
    config: { tension: 200, friction: 20 },
  });

  // Mobile menu animation
  const menuSpring = useSpring({
    height: isMenuOpen ? 'auto' : 0,
    opacity: isMenuOpen ? 1 : 0,
    config: { tension: 300, friction: 30 },
  });

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="glass rounded-b-2xl mx-4 mt-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <animated.div style={logoSpring}>
              <Link 
                href="/" 
                className="flex items-center gap-3 group"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-blue-500 
                              flex items-center justify-center text-white font-bold text-lg
                              shadow-lg group-hover:shadow-xl transition-shadow
                              group-hover:scale-105 transition-transform duration-200">
                  {siteConfig.logo.icon}
                </div>
                <span className="text-xl font-bold gradient-text hidden sm:block">
                  {siteConfig.name}
                </span>
              </Link>
            </animated.div>

            {/* Desktop Navigation */}
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
            <div className="flex items-center gap-3">
              {/* Progress Display */}
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

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* User Avatar */}
              <button className="w-10 h-10 rounded-full overflow-hidden border-2 
                               border-[hsl(var(--color-primary))] shadow-lg
                               hover:scale-105 transition-transform duration-200">
                <div className="w-full h-full bg-gradient-to-br from-pink-400 to-purple-500 
                              flex items-center justify-center text-white font-bold">
                  M
                </div>
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-xl glass-subtle"
                aria-label="เมนู"
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <animated.div
          style={menuSpring}
          className="md:hidden overflow-hidden"
        >
          <nav className="px-4 pb-4 space-y-1">
            {siteConfig.navigation.map((item) => {
              const Icon = iconMap[item.icon] || Home;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl
                           text-[hsl(var(--color-text-secondary))]
                           hover:text-[hsl(var(--color-text-primary))]
                           hover:bg-[hsl(var(--color-primary)/0.1)]
                           transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </animated.div>
      </div>
    </header>
  );
}
