'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TABS = [
  { id: '/',        label: 'Explorar',   icon: '🔍' },
  { id: '/catalog', label: 'Buscar',     icon: '🏠' },
  { id: '/saved',   label: 'Guardados',  icon: '❤️' },
  { id: '/trips',   label: 'Viajes',     icon: '✈️' },
  { id: '/profile', label: 'Perfil',     icon: '👤' },
];

export function BottomTabBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-white border-t border-gray-200 flex md:hidden">
      {TABS.map((tab) => {
        const isActive = tab.id === '/'
          ? pathname === '/'
          : pathname.startsWith(tab.id);
        return (
          <Link
            key={tab.id}
            href={tab.id}
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2 text-xs transition-colors ${
              isActive ? 'text-rose-500' : 'text-gray-400 hover:text-gray-700'
            }`}
          >
            <span className="text-xl leading-none">{tab.icon}</span>
            <span className="text-[10px]">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
