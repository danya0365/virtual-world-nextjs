import { HomeView } from '@/src/presentation/components/home/HomeView';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'หน้าแรก | Virtual World',
  description: 'ยินดีต้อนรับสู่ Virtual World - เกมโลกเสมือนจริงสุดมหัศจรรย์',
};

export default function HomePage() {
  return <HomeView />;
}
