export function MapPlaceholder() {
  return (
    <div className="relative w-full h-full min-h-[300px] md:min-h-0 rounded-2xl overflow-hidden bg-gray-100 flex flex-col items-center justify-center gap-3 border border-gray-200">
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-blue-50 to-teal-50" />
      <div className="relative z-10 flex flex-col items-center gap-2 text-center px-4">
        <span className="text-5xl">🗺️</span>
        <p className="font-semibold text-gray-700">Mapa de resultados</p>
        <p className="text-xs text-gray-400 max-w-[180px]">
          Integración con Google Maps disponible próximamente
        </p>
      </div>
      {/* Decorative dots simulating map pins */}
      {[
        { top: '20%', left: '30%' },
        { top: '45%', left: '55%' },
        { top: '60%', left: '25%' },
        { top: '30%', left: '70%' },
        { top: '70%', left: '65%' },
      ].map((pos, i) => (
        <div
          key={i}
          className="absolute z-10 bg-white border-2 border-gray-800 rounded-full px-2 py-0.5 text-xs font-semibold shadow-md"
          style={{ top: pos.top, left: pos.left }}
        >
          ${[320, 145, 490, 260, 195][i]}
        </div>
      ))}
    </div>
  );
}
