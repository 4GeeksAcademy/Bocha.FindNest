'use client';
import Link from 'next/link';
import { type Listing } from '@/types';
import { StarRating } from './StarRating';
import { FavoriteButton } from './FavoriteButton';

interface ListingCardProps {
  listing: Listing;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  href?: string;
}

export function ListingCard({ listing, isFavorite, onToggleFavorite, href }: ListingCardProps) {
  const { id, title, location, pricePerNight, rating, reviewCount, imageUrl, badgeLabel } = listing;

  return (
    <Link href={href ?? `/rooms/${id}`} className="group block">
      <div className="relative rounded-2xl overflow-hidden aspect-square mb-3">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {badgeLabel && (
          <span className="absolute top-3 left-3 bg-white text-gray-800 text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
            🏆 {badgeLabel}
          </span>
        )}
        <FavoriteButton isFavorite={isFavorite} onToggle={() => onToggleFavorite(id)} />
      </div>
      <div className="flex justify-between items-start gap-2">
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-sm text-gray-900 truncate">{title}</p>
          <p className="text-gray-500 text-xs truncate">{location}</p>
          <p className="text-sm mt-1">
            <span className="font-semibold">${pricePerNight} USD</span>
            <span className="text-gray-400 text-xs"> / noche</span>
          </p>
        </div>
        <div className="shrink-0 pt-0.5">
          <StarRating rating={rating} reviewCount={reviewCount} />
        </div>
      </div>
    </Link>
  );
}
