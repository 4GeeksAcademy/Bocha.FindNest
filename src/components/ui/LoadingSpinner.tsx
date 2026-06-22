export function LoadingSpinner({ label = 'Cargando alojamientos...' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="w-10 h-10 rounded-full border-4 border-gray-200 border-t-rose-500 animate-spin" />
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}
