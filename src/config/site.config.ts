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
  
  // Navigation (Primary + Extended)
  navigation: [
    // Primary Tabs (shown in bottom bar)
    { name: 'หน้าแรก', href: '/', icon: 'Home' },
    { name: 'สำรวจโลก', href: '/explore', icon: 'Globe' },
    { name: 'เกม', href: '/games', icon: 'Gamepad2' },
    { name: 'เพื่อน', href: '/friends', icon: 'Users' },
    // Secondary Navigation (in More menu)
    { name: 'ตัวละคร', href: '/character', icon: 'User' },
    { name: 'กระเป๋า', href: '/inventory', icon: 'Backpack' },
    { name: 'ร้านค้า', href: '/shop', icon: 'ShoppingBag' },
    { name: 'แชท', href: '/chat', icon: 'MessageCircle' },
    { name: 'ความสำเร็จ', href: '/achievements', icon: 'Trophy' },
    // New World-Class Features
    { name: 'รางวัลรายวัน', href: '/daily', icon: 'Gift' },
    { name: 'อีเวนต์', href: '/events', icon: 'PartyPopper' },
    { name: 'ภารกิจ', href: '/quests', icon: 'ScrollText' },
    { name: 'บ้านของฉัน', href: '/house', icon: 'Home' },
    { name: 'ปาร์ตี้', href: '/party', icon: 'Users' },
    { name: 'อันดับ', href: '/leaderboard', icon: 'Trophy' },
    { name: 'ตลาดซื้อขาย', href: '/trading', icon: 'ShoppingBag' },
    { name: 'กิลด์', href: '/guilds', icon: 'Shield' },
    { name: 'แผนที่โลก', href: '/map', icon: 'Map' },
    { name: 'VIP', href: '/vip', icon: 'Crown' },
    // Additional Features
    { name: 'สถิติของฉัน', href: '/profile', icon: 'ChartBar' },
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
