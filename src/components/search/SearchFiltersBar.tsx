'use client';

import { useRouter } from 'next/navigation';
import { Stepper } from '@/components/ui/Stepper';
import { buildSearchHref } from '@/lib/search';
import { type SearchFilters } from '@/types';

interface SearchFiltersBarProps {
  filters: SearchFilters;
  onChange: (filters: SearchFilters) => void;
  submitPath: string;
  submitLabel?: string;
}

export function SearchFiltersBar({
  filters,
  onChange,
  submitPath,
  submitLabel = 'Buscar',
}: SearchFiltersBarProps) {
  const router = useRouter();
  const today = new Date().toISOString().split('T')[0];

  const setField = <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="w-full rounded-3xl border border-gray-200 bg-white p-3 shadow-sm">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)_auto_auto] md:items-center">
        <label className="flex items-center gap-3 rounded-2xl border border-gray-200 px-4 py-3">
          <span className="text-gray-400 text-sm shrink-0">🔍</span>
          <span className="min-w-0 flex-1">
            <span className="block text-[11px] font-semibold uppercase tracking-wide text-gray-500">Destino</span>
            <input
              type="text"
              value={filters.destination}
              onChange={(e) => setField('destination', e.target.value)}
              placeholder="Ciudad, país, barrio..."
              className="mt-1 w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
            />
          </span>
        </label>

        <label className="rounded-2xl border border-gray-200 px-4 py-3">
          <span className="block text-[11px] font-semibold uppercase tracking-wide text-gray-500">Entrada</span>
          <input
            type="date"
            min={today}
            value={filters.checkIn}
            onChange={(e) => setField('checkIn', e.target.value)}
            className="mt-1 w-full bg-transparent text-sm text-gray-900 outline-none"
          />
        </label>

        <label className="rounded-2xl border border-gray-200 px-4 py-3">
          <span className="block text-[11px] font-semibold uppercase tracking-wide text-gray-500">Salida</span>
          <input
            type="date"
            min={filters.checkIn || today}
            value={filters.checkOut}
            onChange={(e) => setField('checkOut', e.target.value)}
            className="mt-1 w-full bg-transparent text-sm text-gray-900 outline-none"
          />
        </label>

        <div className="rounded-2xl border border-gray-200 px-4 py-3">
          <span className="block text-[11px] font-semibold uppercase tracking-wide text-gray-500">Viajeros</span>
          <div className="mt-2 flex items-center justify-between gap-4">
            <span className="text-sm text-gray-700">
              {filters.guests} {filters.guests === 1 ? 'viajero' : 'viajeros'}
            </span>
            <Stepper value={filters.guests} min={1} max={16} onChange={(value) => setField('guests', value)} />
          </div>
        </div>

        <button
          onClick={() => router.push(buildSearchHref(submitPath, filters))}
          className="rounded-2xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
        >
          {submitLabel}
        </button>
      </div>
    </div>
  );
}