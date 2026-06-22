'use client';
import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { type Room, type SearchFilters, type SortOrder } from '@/types';
import { ROOMS } from '@/data/listings';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { ListingCard } from '@/components/listing/ListingCard';
import { SortControl } from '@/components/catalog/SortControl';
import { MapPlaceholder } from '@/components/catalog/MapPlaceholder';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { SearchFiltersBar } from '@/components/search/SearchFiltersBar';
import { buildSearchHref, matchesDestination, matchesGuests, parseSearchFilters } from '@/lib/search';

export default function CatalogPage() {
  return (
    <Suspense fallback={<LoadingSpinner label="Preparando catálogo..." />}>
      <CatalogPageContent />
    </Suspense>
  );
}

function CatalogPageContent() {
  const searchParams = useSearchParams();
  const [searchFilters, setSearchFilters] = useState<SearchFilters>(() => parseSearchFilters(searchParams));
  const [listings, setListings] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    setSearchFilters(parseSearchFilters(searchParams));
  }, [searchParams]);

  useEffect(() => {
    const t = setTimeout(() => { setListings(ROOMS); setIsLoading(false); }, 800);
    return () => clearTimeout(t);
  }, []);

  function toggleFavorite(id: string) {
    setFavorites((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }

  const visibleListings = listings.filter((listing) =>
    matchesDestination(listing, searchFilters.destination) && matchesGuests(listing, searchFilters.guests)
  );

  const sorted = [...visibleListings].sort((a, b) =>
    sortOrder === 'asc' ? a.pricePerNight - b.pricePerNight : b.pricePerNight - a.pricePerNight
  );

  return (
    <>
      <SiteHeader
        right={
          <Link
            href={buildSearchHref('/', searchFilters)}
            className="text-sm font-semibold px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors whitespace-nowrap"
          >
            ← Inicio
          </Link>
        }
      />

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6 pb-24 md:pb-10">
        <div className="mb-6">
          <SearchFiltersBar filters={searchFilters} onChange={setSearchFilters} submitPath="/catalog" />
        </div>
        {isLoading ? (
          <LoadingSpinner label="Buscando los mejores alojamientos..." />
        ) : (
          <>
            <SortControl value={sortOrder} onChange={setSortOrder} resultCount={sorted.length} />
            <div className="md:grid md:grid-cols-[1fr_380px] md:gap-8 md:items-start">
              {/* Results grid */}
              {sorted.length === 0 ? (
                <div className="flex min-h-[280px] flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-gray-300 px-6 text-center">
                  <span className="text-5xl">🧭</span>
                  <p className="text-lg font-semibold text-gray-900">No encontramos alojamientos para esa búsqueda</p>
                  <p className="text-sm text-gray-500">Ajusta el destino o la cantidad de viajeros para ver más opciones.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-10">
                  {sorted.map((listing) => (
                    <ListingCard
                      key={listing.id}
                      listing={listing}
                      href={buildSearchHref(`/rooms/${listing.id}`, searchFilters)}
                      isFavorite={favorites.has(listing.id)}
                      onToggleFavorite={toggleFavorite}
                    />
                  ))}
                </div>
              )}
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
