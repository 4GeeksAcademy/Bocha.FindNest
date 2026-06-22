import { type ReactNode } from 'react';
import { BrandLogo } from './BrandLogo';

interface SiteHeaderProps {
  center?: ReactNode;
  right?: ReactNode;
}

export function SiteHeader({ center, right }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center h-16 gap-4">
        <BrandLogo />
        {center && (
          <div className="flex-1 max-w-sm md:max-w-lg mx-auto">{center}</div>
        )}
        {right && (
          <div className="ml-auto flex items-center gap-2 shrink-0">{right}</div>
        )}
      </div>
    </header>
  );
}
