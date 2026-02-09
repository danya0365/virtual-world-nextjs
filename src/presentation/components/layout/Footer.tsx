'use client';

import { siteConfig } from '@/src/config/site.config';
import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto">
      <div className="glass rounded-t-2xl mx-4 mb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-blue-500 
                              flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {siteConfig.logo.icon}
                </div>
                <span className="text-xl font-bold gradient-text">
                  {siteConfig.name}
                </span>
              </div>
              <p className="text-sm text-[hsl(var(--color-text-muted))] mb-4">
                {siteConfig.tagline}
              </p>
              
              {/* Social Links */}
              <div className="flex gap-3">
                {Object.entries(siteConfig.social).map(([name, url]) => (
                  <a
                    key={name}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg glass-subtle flex items-center justify-center
                             hover:bg-[hsl(var(--color-primary)/0.2)] transition-colors duration-200"
                    aria-label={name}
                  >
                    <span className="text-lg">
                      {name === 'discord' && '💬'}
                      {name === 'twitter' && '🐦'}
                      {name === 'facebook' && '📘'}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* Game Links */}
            <div>
              <h3 className="font-semibold text-[hsl(var(--color-text-primary))] mb-4">
                🎮 เกม
              </h3>
              <ul className="space-y-2">
                {siteConfig.footerLinks.game.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-[hsl(var(--color-text-muted))]
                               hover:text-[hsl(var(--color-primary))] transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h3 className="font-semibold text-[hsl(var(--color-text-primary))] mb-4">
                💬 ช่วยเหลือ
              </h3>
              <ul className="space-y-2">
                {siteConfig.footerLinks.support.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-[hsl(var(--color-text-muted))]
                               hover:text-[hsl(var(--color-primary))] transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h3 className="font-semibold text-[hsl(var(--color-text-primary))] mb-4">
                📋 ข้อมูลเพิ่มเติม
              </h3>
              <ul className="space-y-2">
                {siteConfig.footerLinks.legal.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-[hsl(var(--color-text-muted))]
                               hover:text-[hsl(var(--color-primary))] transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-8 pt-6 border-t border-[hsl(var(--color-primary)/0.2)]">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-sm text-[hsl(var(--color-text-muted))]">
                © {currentYear} {siteConfig.name}. All rights reserved.
              </p>
              <p className="text-sm text-[hsl(var(--color-text-muted))] flex items-center gap-1">
                Made with <span className="text-red-500 animate-pulse">❤️</span> in Thailand
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
