/**
 * Site Configuration
 * Central configuration for branding, site info, and default settings
 */

export const siteConfig = {
  // Site Info
  name: 'Virtual World',
  shortName: 'VW',
  description: 'เกม Virtual World สนุกสนานกับโลกเสมือนจริง',
  tagline: 'สำรวจโลกใหม่ พบเพื่อนใหม่ สร้างตัวละครในฝัน',
  
  // Branding
  logo: {
    text: 'VW',
    icon: '🌍',
  },
  
  // Theme
  defaultTheme: 'light' as const,
  
  // Navigation
  navigation: [
    { name: 'หน้าแรก', href: '/', icon: 'Home' },
    { name: 'สำรวจโลก', href: '/explore', icon: 'Globe' },
    { name: 'ตัวละคร', href: '/character', icon: 'User' },
    { name: 'ร้านค้า', href: '/shop', icon: 'ShoppingBag' },
    { name: 'เพื่อน', href: '/friends', icon: 'Users' },
  ],
  
  // Footer Links
  footerLinks: {
    game: [
      { name: 'เริ่มเล่น', href: '/play' },
      { name: 'สร้างตัวละคร', href: '/character/create' },
      { name: 'กิจกรรม', href: '/events' },
    ],
    support: [
      { name: 'ช่วยเหลือ', href: '/help' },
      { name: 'ติดต่อเรา', href: '/contact' },
      { name: 'รายงานปัญหา', href: '/report' },
    ],
    legal: [
      { name: 'นโยบายความเป็นส่วนตัว', href: '/privacy' },
      { name: 'เงื่อนไขการใช้งาน', href: '/terms' },
    ],
  },
  
  // Social Media
  social: {
    discord: 'https://discord.gg/virtualworld',
    twitter: 'https://twitter.com/virtualworld',
    facebook: 'https://facebook.com/virtualworld',
  },
  
  // Contact
  contact: {
    email: 'support@virtualworld.game',
  },
  
  // Game Stats (for demo)
  defaultStats: {
    level: 7,
    maxLevel: 10,
    coins: 163,
    gems: 12,
    stars: 3,
    maxStars: 5,
  },
} as const;

export type SiteConfig = typeof siteConfig;
