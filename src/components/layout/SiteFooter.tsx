const FOOTER_LINKS = [
  {
    title: 'Asistencia',
    links: ['Centro de ayuda', 'Opciones de cancelación', 'Informe preocupación de seguridad'],
  },
  {
    title: 'Hosting',
    links: ['Hazte anfitrión', 'Hosting responsable', 'Recursos para anfitriones'],
  },
  {
    title: 'FindNest',
    links: ['Sala de prensa', 'Nuevas funciones', 'Términos y condiciones', 'Privacidad'],
  },
];

export function SiteFooter() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
          {FOOTER_LINKS.map((group) => (
            <div key={group.title}>
              <h3 className="font-semibold text-sm text-gray-900 mb-3">{group.title}</h3>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link}>
                    <span className="text-sm text-gray-500 hover:text-gray-700 cursor-pointer transition-colors">
                      {link}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-200 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-gray-400">
          <span>© 2026 FindNest, Inc. · Privacidad · Términos · Mapa del sitio</span>
          <span className="flex items-center gap-2">
            <span>🌍 Español (ES)</span>
            <span>·</span>
            <span>$ USD</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
