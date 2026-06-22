'use client';

interface MobileBookingBarProps {
  pricePerNight: number;
  nights: number;
  onReserve: () => void;
}

export function MobileBookingBar({ pricePerNight, nights, onReserve }: MobileBookingBarProps) {
  const total = nights > 0 ? pricePerNight * nights : null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 bg-white border-t border-gray-200 px-4 py-3 flex items-center justify-between gap-4 md:hidden">
      <div>
        <p className="text-sm">
          <span className="font-bold text-base">${pricePerNight} USD</span>
          <span className="text-gray-500"> / noche</span>
        </p>
        {total !== null && (
          <p className="text-xs text-gray-500">
            Total: ${total} USD · {nights} {nights === 1 ? 'noche' : 'noches'}
          </p>
        )}
      </div>
      <button
        onClick={onReserve}
        className="bg-rose-500 hover:bg-rose-600 text-white font-semibold px-6 py-2.5 rounded-full text-sm transition-colors"
      >
        Reservar
      </button>
    </div>
  );
}
