interface HostProfileCardProps {
  hostName: string;
  hostYears: number;
  isSuperhost: boolean;
  description: string;
}

const AVATAR_GRADIENTS = [
  'from-rose-400 to-pink-600',
  'from-blue-400 to-indigo-600',
  'from-green-400 to-emerald-600',
  'from-amber-400 to-orange-500',
  'from-violet-400 to-purple-600',
];

function getAvatarGradient(name: string) {
  return AVATAR_GRADIENTS[name.charCodeAt(0) % AVATAR_GRADIENTS.length];
}

export function HostProfileCard({ hostName, hostYears, isSuperhost, description }: HostProfileCardProps) {
  const gradient = getAvatarGradient(hostName);
  return (
    <div className="py-6 border-b border-gray-200">
      <div className="flex items-start gap-4 mb-4">
        <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-xl font-bold shrink-0`}>
          {hostName[0]}
        </div>
        <div>
          <p className="font-semibold text-gray-900">Anfitrión: {hostName}</p>
          <p className="text-sm text-gray-500">
            {hostYears} {hostYears === 1 ? 'año' : 'años'} siendo anfitrión
          </p>
          {isSuperhost && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-500 mt-1">
              🏆 Superanfitrión
            </span>
          )}
        </div>
      </div>
      <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
      <button className="mt-4 px-5 py-2 border border-gray-800 rounded-full text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors">
        Contactar al anfitrión
      </button>
    </div>
  );
}
