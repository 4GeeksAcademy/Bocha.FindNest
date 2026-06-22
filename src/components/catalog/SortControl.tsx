'use client';
import { type SortOrder } from '@/types';

interface SortControlProps {
  value: SortOrder;
  onChange: (v: SortOrder) => void;
  resultCount: number;
}

export function SortControl({ value, onChange, resultCount }: SortControlProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
      <p className="text-sm text-gray-500">
        <span className="font-semibold text-gray-900">{resultCount}</span>{' '}
        alojamientos encontrados
      </p>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 shrink-0">Ordenar por precio:</span>
        <div className="flex rounded-full border border-gray-200 overflow-hidden text-sm">
          <button
            onClick={() => onChange('asc')}
            className={`px-4 py-1.5 transition-colors ${
              value === 'asc'
                ? 'bg-gray-900 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            ↑ Menor
          </button>
          <button
            onClick={() => onChange('desc')}
            className={`px-4 py-1.5 transition-colors border-l border-gray-200 ${
              value === 'desc'
                ? 'bg-gray-900 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            ↓ Mayor
          </button>
        </div>
      </div>
    </div>
  );
}
