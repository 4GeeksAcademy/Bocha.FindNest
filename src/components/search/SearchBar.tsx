'use client';

interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  onSearch?: () => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChange,
  onSearch,
  placeholder = 'Buscar destinos, ciudades...',
}: SearchBarProps) {
  return (
    <div className="flex items-center gap-2 border border-gray-300 rounded-full px-4 py-2.5 shadow-sm hover:shadow-md transition-shadow bg-white w-full">
      <span className="text-gray-400 text-sm shrink-0">🔍</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSearch?.()}
        placeholder={placeholder}
        className="flex-1 outline-none text-sm bg-transparent placeholder:text-gray-400 min-w-0"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="text-gray-400 hover:text-gray-600 text-xs shrink-0"
          aria-label="Limpiar búsqueda"
        >
          ✕
        </button>
      )}
    </div>
  );
}
