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
    // Primary Tabs (shown in bottom bar - first 4 items)
    { name: 'หน้าแรก', href: '/', icon: 'Home' },
    { name: 'เกม', href: '/games', icon: 'Gamepad2' },
    { name: 'กาชา', href: '/gacha', icon: 'Sparkles' },
    { name: 'ร้านค้า', href: '/shop', icon: 'ShoppingBag' },
    
    // Secondary Navigation (in More menu) - Explore & Social
    { name: 'สำรวจโลก', href: '/explore', icon: 'Globe' },
    { name: 'แผนที่โลก', href: '/map', icon: 'Map' },
    { name: 'เพื่อน', href: '/friends', icon: 'Users' },
    { name: 'แชท', href: '/chat', icon: 'MessageCircle' },
    { name: 'ปาร์ตี้', href: '/party', icon: 'Users' },
    { name: 'กิลด์', href: '/guilds', icon: 'Shield' },
    
    // Character & Inventory
    { name: 'ตัวละคร', href: '/character', icon: 'User' },
    { name: 'กระเป๋า', href: '/inventory', icon: 'Backpack' },
    { name: 'บ้านของฉัน', href: '/house', icon: 'Home' },
    
    // Shop System
    { name: 'ร้านค้า Premium', href: '/shop/premium', icon: 'Crown' },
    { name: 'ซื้อเพชร', href: '/shop/currency', icon: 'Gem' },
    { name: 'ตลาดซื้อขาย', href: '/trading', icon: 'Store' },
    
    // Activities & Rewards
    { name: 'รางวัลรายวัน', href: '/daily', icon: 'Gift' },
    { name: 'อีเวนต์', href: '/events', icon: 'PartyPopper' },
    { name: 'ภารกิจ', href: '/quests', icon: 'ScrollText' },
    { name: 'ความสำเร็จ', href: '/achievements', icon: 'Trophy' },
    { name: 'อันดับ', href: '/leaderboard', icon: 'Medal' },
    
    // Premium Features
    { name: 'VIP', href: '/vip', icon: 'Crown' },
    
    // Profile
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
