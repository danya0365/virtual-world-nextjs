import { CharacterView } from '@/src/presentation/components/character/CharacterView';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ตัวละคร | Virtual World',
  description: 'ดูและปรับแต่งตัวละครของคุณใน Virtual World',
};

export default function CharacterPage() {
  return <CharacterView />;
}
