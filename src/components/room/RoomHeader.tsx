import { StarRating } from '@/components/listing/StarRating';

interface RoomHeaderProps {
  title: string;
  location: string;
  rating: number;
  reviewCount: number;
  maxGuests: number;
  bedrooms: number;
  beds: number;
  baths: number;
  isSuperhost: boolean;
}

export function RoomHeader({
  title,
  location,
  rating,
  reviewCount,
  maxGuests,
  bedrooms,
  beds,
  baths,
  isSuperhost,
}: RoomHeaderProps) {
  return (
    <div className="mb-6 pb-6 border-b border-gray-200">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">{title}</h1>
      <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mb-3">
        <StarRating rating={rating} reviewCount={reviewCount} />
        <span>·</span>
        <span className="text-gray-700">{location}</span>
        {isSuperhost && (
          <>
            <span>·</span>
            <span className="flex items-center gap-1 text-rose-500 font-medium">
              🏆 Superanfitrión
            </span>
          </>
        )}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
        <span>👥 {maxGuests} viajeros</span>
        <span>🛏 {bedrooms} {bedrooms === 1 ? 'dormitorio' : 'dormitorios'}</span>
        <span>🛏 {beds} {beds === 1 ? 'cama' : 'camas'}</span>
        <span>🚿 {baths} {baths === 1 ? 'baño' : 'baños'}</span>
      </div>
    </div>
  );
}
