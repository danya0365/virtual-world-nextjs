'use client';

import { type ReactNode } from 'react';
import { ThemeProvider } from '../providers/ThemeProvider';
import { BottomTabBar } from './BottomTabBar';
import { Header } from './Header';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <ThemeProvider defaultTheme="light">
      <div className="min-h-screen flex flex-col relative overflow-hidden">
        {/* Background Decorations */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          {/* Large gradient orbs */}
          <div 
            className="absolute -top-40 -right-40 w-96 h-96 
                      bg-gradient-to-br from-purple-400/30 to-pink-400/20 
                      rounded-full blur-3xl animate-float"
          />
          <div 
            className="absolute top-1/2 -left-40 w-80 h-80 
                      bg-gradient-to-br from-blue-400/20 to-cyan-400/20 
                      rounded-full blur-3xl animate-float"
            style={{ animationDelay: '-1.5s' }}
          />
          <div 
            className="absolute -bottom-20 right-1/4 w-72 h-72 
                      bg-gradient-to-br from-pink-400/20 to-orange-400/10 
                      rounded-full blur-3xl animate-float"
            style={{ animationDelay: '-3s' }}
          />
          
          {/* Subtle pattern overlay */}
          <div 
            className="absolute inset-0 opacity-30 dark:opacity-10"
            style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, hsl(var(--color-primary) / 0.05) 0%, transparent 50%),
                               radial-gradient(circle at 75% 75%, hsl(var(--color-secondary) / 0.05) 0%, transparent 50%)`,
            }}
          />
        </div>

        {/* Header */}
        <Header />

        {/* Main Content - with bottom padding for tabbar */}
        <main className="flex-1 w-full pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            {children}
          </div>
        </main>

        {/* Footer - hidden (replaced by tabbar) */}
        {/* <Footer /> */}

        {/* Bottom Tab Bar - shown on all screens */}
        <BottomTabBar />
      </div>
    </ThemeProvider>
  );
}
