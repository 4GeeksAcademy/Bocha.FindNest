'use client';
import { Suspense, use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { type Room, type SearchFilters } from '@/types';
import { getRoomById } from '@/data/listings';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { ListingGallery } from '@/components/room/ListingGallery';
import { RoomHeader } from '@/components/room/RoomHeader';
import { HostProfileCard } from '@/components/room/HostProfileCard';
import { AmenitiesGrid } from '@/components/room/AmenitiesGrid';
import { BookingWidget } from '@/components/room/BookingWidget';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { SearchFiltersBar } from '@/components/search/SearchFiltersBar';
import { buildSearchHref, parseSearchFilters } from '@/lib/search';

const BackLink = ({ href }: { href: string }) => (
  <Link href={href} className="text-sm font-semibold px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors whitespace-nowrap">
    ← Catálogo
  </Link>
);

export default function RoomPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<><SiteHeader right={<BackLink href="/catalog" />} /><LoadingSpinner label="Preparando detalle..." /></>}>
      <RoomPageContent params={params} />
    </Suspense>
  );
}

function RoomPageContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const [searchFilters, setSearchFilters] = useState<SearchFilters>(() => parseSearchFilters(searchParams));
  const [room, setRoom] = useState<Room | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setSearchFilters(parseSearchFilters(searchParams));
  }, [searchParams]);

  useEffect(() => {
    setIsLoading(true);
    const t = setTimeout(() => { setRoom(getRoomById(id) ?? null); setIsLoading(false); }, 800);
    return () => clearTimeout(t);
  }, [id]);

  useEffect(() => {
    if (!room) {
      return;
    }

    if (searchFilters.guests > room.maxGuests) {
      setSearchFilters((prev) => ({ ...prev, guests: room.maxGuests }));
    }
  }, [room, searchFilters.guests]);

  const nights = searchFilters.checkIn && searchFilters.checkOut
    ? Math.max(0, Math.round((new Date(searchFilters.checkOut).getTime() - new Date(searchFilters.checkIn).getTime()) / 86400000))
    : 0;

  const handleReserve = () => {
    const msg = nights > 0
      ? `¡Reserva enviada!\n${room?.title}\n${searchFilters.guests} viajero(s) · ${nights} noche(s)\nTotal: $${nights * (room?.pricePerNight ?? 0)} USD`
      : '¡Reserva enviada! Contactá al anfitrión para confirmar fechas.';
    alert(msg);
  };

  if (isLoading) return (
    <><SiteHeader right={<BackLink href={buildSearchHref('/catalog', searchFilters)} />} /><LoadingSpinner label="Cargando alojamiento..." /></>
  );

  if (!room) return (
    <>
      <SiteHeader right={<BackLink href={buildSearchHref('/catalog', searchFilters)} />} />
      <div className="flex flex-col items-center py-24 gap-3 text-center">
        <span className="text-6xl">🏚️</span>
        <p className="text-xl font-semibold text-gray-800">Alojamiento no encontrado</p>
        <Link href={buildSearchHref('/', searchFilters)} className="mt-3 px-6 py-2.5 bg-rose-500 text-white rounded-full text-sm font-semibold hover:bg-rose-600 transition-colors">
          Volver al inicio
        </Link>
      </div>
    </>
  );

  return (
    <>
      <SiteHeader
        right={
          <div className="flex items-center gap-2">
            <button onClick={() => setIsSaved((v) => !v)} className="text-2xl hover:scale-110 transition-transform" aria-label="Guardar">
              {isSaved ? '❤️' : '🤍'}
            </button>
            <BackLink href={buildSearchHref('/catalog', searchFilters)} />
          </div>
        }
      />

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6 pb-24 md:pb-10">
        <div className="mb-6">
          <SearchFiltersBar filters={searchFilters} onChange={setSearchFilters} submitPath={`/rooms/${id}`} submitLabel="Actualizar" />
        </div>
        <ListingGallery images={room.galleryImages} title={room.title} />

        <div className="md:grid md:grid-cols-[1fr_360px] md:gap-12 md:items-start">
          {/* Content column */}
          <div>
            <RoomHeader
              title={room.title} location={room.location} rating={room.rating}
              reviewCount={room.reviewCount} maxGuests={room.maxGuests}
              bedrooms={room.bedrooms} beds={room.beds} baths={room.baths}
              isSuperhost={room.isSuperhost}
            />
            <div className="py-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold mb-3">Sobre este alojamiento</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{room.description}</p>
            </div>
            <AmenitiesGrid amenities={room.amenities} />
            <HostProfileCard
              hostName={room.hostName} hostYears={room.hostYears}
              isSuperhost={room.isSuperhost} description={room.description}
            />
          </div>

          {/* Booking widget (desktop) */}
          <BookingWidget
            pricePerNight={room.pricePerNight} guestCount={searchFilters.guests}
            maxGuests={room.maxGuests} checkIn={searchFilters.checkIn} checkOut={searchFilters.checkOut}
            nights={nights} onGuestChange={(value) => setSearchFilters((prev) => ({ ...prev, guests: value }))}
            onCheckInChange={(value) => setSearchFilters((prev) => ({ ...prev, checkIn: value }))}
            onCheckOutChange={(value) => setSearchFilters((prev) => ({ ...prev, checkOut: value }))}
            onReserve={handleReserve}
          />
        </div>
      </div>

    </>
  );
}
