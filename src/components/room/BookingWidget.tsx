'use client';
import { Stepper } from '@/components/ui/Stepper';

interface BookingWidgetProps {
  pricePerNight: number;
  guestCount: number;
  maxGuests: number;
  checkIn: string;
  checkOut: string;
  nights: number;
  onGuestChange: (v: number) => void;
  onCheckInChange: (v: string) => void;
  onCheckOutChange: (v: string) => void;
  onReserve: () => void;
}

export function BookingWidget({
  pricePerNight, guestCount, maxGuests, checkIn, checkOut,
  nights, onGuestChange, onCheckInChange, onCheckOutChange, onReserve,
}: BookingWidgetProps) {
  const total = nights > 0 ? pricePerNight * nights : null;
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="md:sticky md:top-20 border border-gray-200 rounded-2xl p-6 shadow-xl bg-white mt-8 md:mt-0">
      <div className="flex items-baseline gap-2 mb-5">
        <span className="text-2xl font-bold">${pricePerNight} USD</span>
        <span className="text-gray-500 text-sm">/ noche</span>
      </div>

      {/* Date inputs */}
      <div className="grid grid-cols-2 gap-2 mb-3 border border-gray-300 rounded-xl overflow-hidden">
        <div className="p-3 border-r border-gray-300">
          <p className="text-xs font-semibold text-gray-700 mb-1">ENTRADA</p>
          <input type="date" min={today} value={checkIn} onChange={(e) => onCheckInChange(e.target.value)}
            className="w-full text-sm outline-none bg-transparent" />
        </div>
        <div className="p-3">
          <p className="text-xs font-semibold text-gray-700 mb-1">SALIDA</p>
          <input type="date" min={checkIn || today} value={checkOut} onChange={(e) => onCheckOutChange(e.target.value)}
            className="w-full text-sm outline-none bg-transparent" />
        </div>
      </div>

      {/* Guest count */}
      <div className="flex items-center justify-between border border-gray-300 rounded-xl p-3 mb-4">
        <div>
          <p className="text-xs font-semibold text-gray-700">VIAJEROS</p>
          <p className="text-sm text-gray-500">{guestCount} {guestCount === 1 ? 'viajero' : 'viajeros'}</p>
        </div>
        <Stepper value={guestCount} min={1} max={maxGuests} onChange={onGuestChange} />
      </div>

      <button onClick={onReserve}
        className="w-full bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold py-3 rounded-xl hover:from-rose-600 hover:to-pink-700 transition-all text-sm">
        Reservar
      </button>

      {total !== null && (
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>${pricePerNight} × {nights} {nights === 1 ? 'noche' : 'noches'}</span>
            <span>${pricePerNight * nights}</span>
          </div>
          <div className="flex justify-between font-semibold border-t border-gray-200 pt-2">
            <span>Total (USD)</span>
            <span>${total}</span>
          </div>
        </div>
      )}
    </div>
  );
}
