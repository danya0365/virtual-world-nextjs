import '@/public/styles/index.css';
import { MainLayout } from '@/src/presentation/components/layout/MainLayout';
import type { Metadata } from "next";

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
    <html lang="th" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@100..900&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="antialiased">
        <MainLayout>
          {children}
        </MainLayout>
      </body>
    </html>
  );
}
