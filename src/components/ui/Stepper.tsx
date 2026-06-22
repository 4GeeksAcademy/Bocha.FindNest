'use client';

interface StepperProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (v: number) => void;
}

export function Stepper({ value, min = 0, max = 99, onChange }: StepperProps) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-gray-700 text-lg hover:border-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Disminuir"
      >
        −
      </button>
      <span className="w-5 text-center font-medium text-sm tabular-nums">{value}</span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-gray-700 text-lg hover:border-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Aumentar"
      >
        +
      </button>
    </div>
  );
}
