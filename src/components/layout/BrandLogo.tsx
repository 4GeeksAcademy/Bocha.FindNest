import Link from 'next/link';

interface BrandLogoProps {
  href?: string;
}

export function BrandLogo({ href = '/' }: BrandLogoProps) {
  return (
    <Link
      href={href}
      className="flex items-center gap-1.5 text-rose-500 font-bold text-xl shrink-0 hover:opacity-80 transition-opacity"
    >
      <span>🏠</span>
      <span className="hidden sm:inline">FindNest</span>
    </Link>
  );
}
