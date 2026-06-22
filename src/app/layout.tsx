import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { BottomTabBar } from '@/components/layout/BottomTabBar';

const geist = Geist({ variable: '--font-geist', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FindNest — Encuentra tu alojamiento perfecto',
  description: 'Descubre casas, apartamentos y alojamientos únicos para tu próximo viaje.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${geist.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-white text-gray-900">
        {children}
        <SiteFooter />
        <BottomTabBar />
      </body>
    </html>
  );
}
