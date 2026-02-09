import { ExploreView } from '@/src/presentation/components/explore/ExploreView';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'สำรวจโลก | Virtual World',
  description: 'สำรวจโลกต่างๆ ใน Virtual World - เลือกโลกที่อยากไปผจญภัย',
};

export default function ExplorePage() {
  return <ExploreView />;
}
