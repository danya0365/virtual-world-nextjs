'use client';

import { animated, useSpring } from '@react-spring/web';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../providers/ThemeProvider';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  
  const iconSpring = useSpring({
    transform: theme === 'dark' ? 'rotate(180deg)' : 'rotate(0deg)',
    config: { tension: 200, friction: 20 },
  });

  const bgSpring = useSpring({
    background: theme === 'dark' 
      ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' 
      : 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    config: { tension: 200, friction: 20 },
  });

  return (
    <animated.button
      onClick={toggleTheme}
      style={bgSpring}
      className="relative w-12 h-12 rounded-full flex items-center justify-center
                 shadow-lg hover:shadow-xl transition-shadow duration-300
                 border border-white/20 cursor-pointer"
      aria-label={`เปลี่ยนเป็นโหมด ${theme === 'dark' ? 'สว่าง' : 'มืด'}`}
    >
      <animated.div style={iconSpring}>
        {theme === 'dark' ? (
          <Moon className="w-5 h-5 text-yellow-300" />
        ) : (
          <Sun className="w-5 h-5 text-orange-500" />
        )}
      </animated.div>
      
      {/* Glow effect */}
      <div 
        className={`absolute inset-0 rounded-full blur-md opacity-50 -z-10
          ${theme === 'dark' ? 'bg-blue-500' : 'bg-orange-400'}`}
      />
    </animated.button>
  );
}
