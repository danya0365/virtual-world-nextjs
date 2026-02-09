import '@/public/styles/index.css';
import { MainLayout } from '@/src/presentation/components/layout/MainLayout';
import type { Metadata } from "next";
import { Noto_Sans_Thai } from 'next/font/google';

// ✅ Next.js best practice: ใช้ next/font/google สำหรับ font optimization
const notoSansThai = Noto_Sans_Thai({
  subsets: ['thai', 'latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-noto-sans-thai',
  preload: true,
});

export const metadata: Metadata = {
  title: "Virtual World | โลกเสมือนจริงสุดมหัศจรรย์",
  description: "เกม Virtual World สนุกสนานกับโลกเสมือนจริง - สำรวจโลกใหม่ พบเพื่อนใหม่ สร้างตัวละครในฝัน",
  keywords: ["virtual world", "เกม", "โลกเสมือน", "3D", "react three fiber"],
  authors: [{ name: "Virtual World Team" }],
  openGraph: {
    title: "Virtual World | โลกเสมือนจริงสุดมหัศจรรย์",
    description: "เกม Virtual World สนุกสนานกับโลกเสมือนจริง",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={notoSansThai.variable} suppressHydrationWarning>
      <body className={`${notoSansThai.className} antialiased`}>
        <MainLayout>
          {children}
        </MainLayout>
      </body>
    </html>
  );
}
