import { type RoomAmenity } from '@/types';

interface AmenitiesGridProps {
  amenities: RoomAmenity[];
}

export function AmenitiesGrid({ amenities }: AmenitiesGridProps) {
  return (
    <div className="py-6 border-b border-gray-200">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">¿Qué hay en este alojamiento?</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {amenities.map((amenity) => (
          <div key={amenity.label} className="flex items-center gap-3">
            <span className="text-xl w-8 text-center">{amenity.icon}</span>
            <span className="text-sm text-gray-700">{amenity.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
