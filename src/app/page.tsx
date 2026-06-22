'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { type Listing } from '@/types';
import { LISTINGS, CATEGORIES } from '@/data/listings';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SearchBar } from '@/components/search/SearchBar';
import { CategoryTabs } from '@/components/home/CategoryTabs';
import { ListingCard } from '@/components/listing/ListingCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    const t = setTimeout(() => { setListings(LISTINGS); setIsLoading(false); }, 1000);
    return () => clearTimeout(t);
  }, []);

  const filtered = listings.filter((l) => {
    const q = searchQuery.toLowerCase();
    return (!q || l.title.toLowerCase().includes(q) || l.location.toLowerCase().includes(q))
      && (activeCategory === 'all' || l.category === activeCategory);
  });

  function toggleFavorite(id: string) {
    setFavorites((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }

  return (
    <>
      <SiteHeader
        center={
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onSearch={() => searchQuery.trim() && router.push('/catalog')}
          />
        }
        right={
          <div className="flex items-center gap-2">
            <Link href="/catalog" className="hidden md:block text-sm font-semibold px-4 py-2 rounded-full hover:bg-gray-100 transition-colors whitespace-nowrap">
              Ver catálogo
            </Link>
            <div className="flex items-center gap-1.5 border border-gray-300 rounded-full px-3 py-2 hover:shadow-md cursor-pointer transition-shadow text-base">
              <span>☰</span><span>👤</span>
            </div>
          </div>
        }
      />

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6 pb-24 md:pb-10">
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-gray-900">Explora alojamientos únicos</h2>
          <p className="text-gray-500 text-sm mt-1">
            {isLoading ? 'Cargando los mejores alojamientos para ti...' : `${filtered.length} alojamientos disponibles`}
          </p>
        </div>

        <CategoryTabs categories={CATEGORIES} activeId={activeCategory} onChange={setActiveCategory} />

        {isLoading ? (
          <LoadingSpinner />
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center py-20 gap-3 text-center">
            <span className="text-5xl">🔍</span>
            <p className="font-semibold text-gray-700">Sin resultados para esta búsqueda</p>
            <p className="text-sm text-gray-400">Probá con otro destino o categoría</p>
            <button
              onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
              className="mt-2 px-6 py-2 border border-gray-300 rounded-full text-sm hover:bg-gray-50 transition-colors"
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10 mt-6">
            {filtered.map((listing) => (
              <ListingCard key={listing.id} listing={listing} isFavorite={favorites.has(listing.id)} onToggleFavorite={toggleFavorite} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
