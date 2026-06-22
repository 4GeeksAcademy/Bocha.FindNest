'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { type Listing, type SortOrder } from '@/types';
import { LISTINGS } from '@/data/listings';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { ListingCard } from '@/components/listing/ListingCard';
import { SortControl } from '@/components/catalog/SortControl';
import { MapPlaceholder } from '@/components/catalog/MapPlaceholder';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function CatalogPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    const t = setTimeout(() => { setListings(LISTINGS); setIsLoading(false); }, 800);
    return () => clearTimeout(t);
  }, []);

  function toggleFavorite(id: string) {
    setFavorites((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }

  const sorted = [...listings].sort((a, b) =>
    sortOrder === 'asc' ? a.pricePerNight - b.pricePerNight : b.pricePerNight - a.pricePerNight
  );

  return (
    <>
      <SiteHeader
        center={
          <p className="text-sm font-semibold text-gray-700 hidden md:block">
            Todos los alojamientos FindNest
          </p>
        }
        right={
          <Link
            href="/"
            className="text-sm font-semibold px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors whitespace-nowrap"
          >
            ← Inicio
          </Link>
        }
      />

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6 pb-24 md:pb-10">
        {isLoading ? (
          <LoadingSpinner label="Buscando los mejores alojamientos..." />
        ) : (
          <>
            <SortControl value={sortOrder} onChange={setSortOrder} resultCount={sorted.length} />
            <div className="md:grid md:grid-cols-[1fr_380px] md:gap-8 md:items-start">
              {/* Results grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-10">
                {sorted.map((listing) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    isFavorite={favorites.has(listing.id)}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>
              {/* Map area */}
              <div className="mt-10 md:mt-0 md:sticky md:top-24 md:h-[calc(100vh-6rem)]">
                <MapPlaceholder />
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
