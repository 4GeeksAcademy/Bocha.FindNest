'use client';
import { useState } from 'react';

interface ListingGalleryProps {
  images: string[];
  title: string;
}

export function ListingGallery({ images, title }: ListingGalleryProps) {
  const [current, setCurrent] = useState(0);
  const total = images.length;

  const prev = () => setCurrent((c) => (c - 1 + total) % total);
  const next = () => setCurrent((c) => (c + 1) % total);

  return (
    <div className="relative rounded-2xl overflow-hidden aspect-[16/9] md:aspect-[21/9] bg-gray-100 mb-6">
      <img
        src={images[current]}
        alt={`${title} — foto ${current + 1}`}
        className="w-full h-full object-cover transition-opacity duration-500"
        loading="lazy"
      />

      {/* Navigation buttons */}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center text-gray-800 hover:bg-white transition-colors text-lg"
        aria-label="Foto anterior"
      >
        ‹
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center text-gray-800 hover:bg-white transition-colors text-lg"
        aria-label="Foto siguiente"
      >
        ›
      </button>

      {/* Counter */}
      <div className="absolute bottom-3 right-3 bg-white/90 text-gray-800 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
        {current + 1} / {total}
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-1.5 h-1.5 rounded-full transition-all ${
              i === current ? 'bg-white w-3' : 'bg-white/50'
            }`}
            aria-label={`Ir a foto ${i + 1}`}
          />
        ))}
      </div>

      {/* Title overlay */}
      <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/30 to-transparent">
        <p className="text-white text-sm font-medium drop-shadow">{title}</p>
      </div>
    </div>
  );
}
