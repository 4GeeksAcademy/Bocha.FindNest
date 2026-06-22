import { type Category, type Listing, type Room } from '@/types';

export const CATEGORIES: Category[] = [
  { id: 'all',       label: 'Todo',       icon: '🌍' },
  { id: 'Playas',    label: 'Playas',     icon: '🏖️' },
  { id: 'Mansiones', label: 'Mansiones',  icon: '🏰' },
  { id: 'Tendencias',label: 'Tendencias', icon: '🔥' },
  { id: 'Montañas',  label: 'Montañas',   icon: '⛰️' },
  { id: 'Cabañas',   label: 'Cabañas',    icon: '🏡' },
  { id: 'Ciudades',  label: 'Ciudades',   icon: '🌆' },
  { id: 'Piscinas',  label: 'Piscinas',   icon: '🏊' },
  { id: 'Campings',  label: 'Campings',   icon: '⛺' },
];

// Helper: constructs an Unsplash image URL
const u = (id: string, w = 800, h = 600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

// Gallery image sets by category (5 images each)
const GALLERY_SETS: Record<string, string[]> = {
  Playas: [
    u('1499793983690-e29da59ef1c2'),
    u('1507525428034-b723cf961d3e'),
    u('1505691723518-36a5ac3be353'),
    u('1586023492125-27b2c045efd7'),
    u('1571003123894-1f0594d2b5d9'),
  ],
  Mansiones: [
    u('1564013799919-ab600027ffc6'),
    u('1512917774080-9991f1c4c750'),
    u('1551361415-69c87624334f'),
    u('1571003123894-1f0594d2b5d9'),
    u('1493809842364-78817add7ffb'),
  ],
  Ciudades: [
    u('1522708323590-d24dbb6b0267'),
    u('1502672260266-1c1ef2d93688'),
    u('1586023492125-27b2c045efd7'),
    u('1493809842364-78817add7ffb'),
    u('1545324418-cc1a3fa10c00'),
  ],
  Cabañas: [
    u('1449158743715-0a90ebb6d2d8'),
    u('1470770903676-69b98201ea1c'),
    u('1542718610-a1a40635e9be'),
    u('1586023492125-27b2c045efd7'),
    u('1506905925346-21bda4d32df4'),
  ],
  Tendencias: [
    u('1502672260266-1c1ef2d93688'),
    u('1545324418-cc1a3fa10c00'),
    u('1551361415-69c87624334f'),
    u('1493809842364-78817add7ffb'),
    u('1507525428034-b723cf961d3e'),
  ],
  Montañas: [
    u('1518509562904-e7ef99cdcc86'),
    u('1506905925346-21bda4d32df4'),
    u('1483728642387-6c3bdd6c93e5'),
    u('1470770903676-69b98201ea1c'),
    u('1586023492125-27b2c045efd7'),
  ],
  Piscinas: [
    u('1571003123894-1f0594d2b5d9'),
    u('1578774296842-c45e472b3028'),
    u('1502672260266-1c1ef2d93688'),
    u('1551361415-69c87624334f'),
    u('1507525428034-b723cf961d3e'),
  ],
  Campings: [
    u('1533632359083-0185df1be85d'),
    u('1504280390367-361c6d9f38f4'),
    u('1483728642387-6c3bdd6c93e5'),
    u('1506905925346-21bda4d32df4'),
    u('1470770903676-69b98201ea1c'),
  ],
};

export const LISTINGS: Listing[] = [
  { id: '1',  title: 'Villa frente al mar',              location: 'Punta del Este, Uruguay',       category: 'Playas',     pricePerNight: 320, rating: 4.92, reviewCount: 148, imageUrl: u('1499793983690-e29da59ef1c2'), badgeLabel: 'Recomendación del viajero' },
  { id: '2',  title: 'Mansión con piscina privada',      location: 'Bariloche, Argentina',          category: 'Mansiones',  pricePerNight: 580, rating: 4.88, reviewCount: 92,  imageUrl: u('1564013799919-ab600027ffc6'), badgeLabel: 'Recomendación del viajero' },
  { id: '3',  title: 'Loft moderno en Palermo',          location: 'Buenos Aires, Argentina',       category: 'Ciudades',   pricePerNight: 145, rating: 4.75, reviewCount: 204, imageUrl: u('1522708323590-d24dbb6b0267') },
  { id: '4',  title: 'Cabaña en el bosque nativo',       location: 'Villa La Angostura, Argentina', category: 'Cabañas',    pricePerNight: 210, rating: 4.95, reviewCount: 67,  imageUrl: u('1449158743715-0a90ebb6d2d8'), badgeLabel: 'Recomendación del viajero' },
  { id: '5',  title: 'Apartamento con vista al mar',     location: 'Montevideo, Uruguay',           category: 'Tendencias', pricePerNight: 175, rating: 4.80, reviewCount: 311, imageUrl: u('1502672260266-1c1ef2d93688') },
  { id: '6',  title: 'Casa de playa exclusiva',          location: 'José Ignacio, Uruguay',         category: 'Playas',     pricePerNight: 490, rating: 4.97, reviewCount: 43,  imageUrl: u('1505691723518-36a5ac3be353'), badgeLabel: 'Recomendación del viajero' },
  { id: '7',  title: 'Chalet con vista a los Andes',     location: 'Mendoza, Argentina',            category: 'Montañas',   pricePerNight: 260, rating: 4.85, reviewCount: 128, imageUrl: u('1518509562904-e7ef99cdcc86') },
  { id: '8',  title: 'Studio con piscina infinity',      location: 'Cartagena, Colombia',           category: 'Piscinas',   pricePerNight: 195, rating: 4.79, reviewCount: 189, imageUrl: u('1571003123894-1f0594d2b5d9') },
  { id: '9',  title: 'Villa panorámica del Atlántico',   location: 'Punta del Este, Uruguay',       category: 'Tendencias', pricePerNight: 420, rating: 4.91, reviewCount: 76,  imageUrl: u('1512917774080-9991f1c4c750') },
  { id: '10', title: 'Glamping en la Patagonia',         location: 'El Calafate, Argentina',        category: 'Campings',   pricePerNight: 180, rating: 4.86, reviewCount: 55,  imageUrl: u('1533632359083-0185df1be85d') },
  { id: '11', title: 'Penthouse en el microcentro',      location: 'Buenos Aires, Argentina',       category: 'Ciudades',   pricePerNight: 335, rating: 4.70, reviewCount: 267, imageUrl: u('1545324418-cc1a3fa10c00') },
  { id: '12', title: 'Estancia colonial en las sierras', location: 'Córdoba, Argentina',            category: 'Mansiones',  pricePerNight: 440, rating: 4.93, reviewCount: 89,  imageUrl: u('1583608205776-bfd35f0d9f83'), badgeLabel: 'Recomendación del viajero' },
];

const AMENITIES_BY_CATEGORY: Record<string, { icon: string; label: string }[]> = {
  Playas:    [{ icon: '🌊', label: 'Acceso privado a la playa' }, { icon: '🏊', label: 'Piscina exterior' }, { icon: '📶', label: 'WiFi alta velocidad' }, { icon: '🍳', label: 'Cocina equipada' }, { icon: '🅿️', label: 'Estacionamiento' }, { icon: '❄️', label: 'Aire acondicionado' }, { icon: '📺', label: 'Smart TV' }, { icon: '🧺', label: 'Lavadora' }],
  Mansiones: [{ icon: '🏊', label: 'Piscina privada' }, { icon: '🍾', label: 'Bar exterior' }, { icon: '📶', label: 'WiFi alta velocidad' }, { icon: '🍳', label: 'Cocina gourmet' }, { icon: '🅿️', label: 'Garaje cerrado' }, { icon: '❄️', label: 'Clima centralizado' }, { icon: '📺', label: 'Home cinema' }, { icon: '🏋️', label: 'Gimnasio privado' }],
  Ciudades:  [{ icon: '📶', label: 'WiFi alta velocidad' }, { icon: '🍳', label: 'Cocina equipada' }, { icon: '❄️', label: 'Aire acondicionado' }, { icon: '📺', label: 'Smart TV' }, { icon: '🛗', label: 'Ascensor' }, { icon: '🏙️', label: 'Vistas a la ciudad' }, { icon: '🧺', label: 'Lavadora' }, { icon: '☕', label: 'Cafetera premium' }],
  Cabañas:   [{ icon: '🔥', label: 'Chimenea a leña' }, { icon: '🛁', label: 'Bañera de inmersión' }, { icon: '📶', label: 'WiFi' }, { icon: '🍳', label: 'Cocina de campo' }, { icon: '🅿️', label: 'Estacionamiento' }, { icon: '🌲', label: 'Deck en el bosque' }, { icon: '🪵', label: 'Sauna' }, { icon: '📺', label: 'TV' }],
  Tendencias:[{ icon: '📶', label: 'WiFi ultra rápido' }, { icon: '🏊', label: 'Rooftop pool' }, { icon: '🍳', label: 'Cocina equipada' }, { icon: '❄️', label: 'Aire acondicionado' }, { icon: '📺', label: 'Smart TV 75"' }, { icon: '🅿️', label: 'Valet parking' }, { icon: '🛁', label: 'Bañera de hidromasaje' }, { icon: '🍾', label: 'Mini-bar' }],
  Montañas:  [{ icon: '⛷️', label: 'Ski-in/Ski-out' }, { icon: '🔥', label: 'Chimenea' }, { icon: '📶', label: 'WiFi' }, { icon: '🍳', label: 'Cocina equipada' }, { icon: '🅿️', label: 'Cochera' }, { icon: '🌄', label: 'Vistas a la montaña' }, { icon: '🛁', label: 'Jacuzzi exterior' }, { icon: '🎿', label: 'Depósito de esquíes' }],
  Piscinas:  [{ icon: '🏊', label: 'Piscina infinity' }, { icon: '☀️', label: 'Solarium' }, { icon: '📶', label: 'WiFi' }, { icon: '🍹', label: 'Pool bar' }, { icon: '🍳', label: 'Cocina equipada' }, { icon: '❄️', label: 'Aire acondicionado' }, { icon: '📺', label: 'Smart TV' }, { icon: '🚿', label: 'Ducha exterior' }],
  Campings:  [{ icon: '⛺', label: 'Tienda equipada' }, { icon: '🔥', label: 'Fogón' }, { icon: '🌌', label: 'Cielo oscuro' }, { icon: '🚿', label: 'Duchas calientes' }, { icon: '🧊', label: 'Heladera' }, { icon: '🥾', label: 'Guía de senderismo' }, { icon: '🌿', label: 'Zona de picnic' }, { icon: '📶', label: 'WiFi en el salón' }],
};

const DESCRIPTIONS: Record<string, string> = {
  '1':  'Disfruta de esta impresionante villa directamente sobre el mar en Punta del Este. Con acceso privado a la playa, terrazas abiertas y vistas al Atlántico desde cada habitación.',
  '2':  'Mansión de lujo rodeada de montañas en el corazón de la Patagonia andina. Piscina climatizada, jardines privados y arquitectura de diseño que se integra con el paisaje.',
  '3':  'Loft de diseño en el barrio más cool de Buenos Aires. A pasos de los mejores restaurantes, bares y galerías de arte de Palermo Hollywood. Decoración única y completamente equipado.',
  '4':  'Cabaña íntima en el corazón del bosque nativo patagónico. Despertate con el sonido de los pájaros y la brisa del lago. Ideal para desconectarse y reconectarse con la naturaleza.',
  '5':  'Moderno apartamento con balcón y vistas al Río de la Plata desde el piso 14. Ubicación privilegiada en Pocitos, a metros de la rambla, cafeterías y comercios de primera línea.',
  '6':  'Casa exclusiva a metros del famoso faro de José Ignacio. Arquitectura contemporánea, materiales naturales y una privacidad absoluta en uno de los destinos más buscados del Uruguay.',
  '7':  'Chalet de montaña con vistas panorámicas a la cordillera de los Andes. Ideal para amantes del ski en invierno y el trekking en verano, con jacuzzi exterior para noches estrelladas.',
  '8':  'Studio boutique en el corazón histórico de Cartagena con acceso exclusivo a la piscina infinity en la terraza. Las mejores vistas de la Ciudad Amurallada y el Mar Caribe.',
  '9':  'Villa con 180° de vistas al Atlántico desde la mítica Punta del Este. Amplia terraza para disfrutar los atardeceres, piscina climatizada y diseño de interiores de autor.',
  '10': 'Experiencia glamping de lujo en la Patagonia argentina. Durmiendo bajo un cielo estrellado sin igual, a pasos del Glaciar Perito Moreno, con todos los servicios incluidos.',
  '11': 'Penthouse de última generación con terraza privada y vistas a la skyline porteña. En pleno centro de Buenos Aires, a pasos del Obelisco, el Teatro Colón y Puerto Madero.',
  '12': 'Estancia colonial restaurada del siglo XIX en las sierras de Córdoba. Caminatas, caballos, pileta y la mejor gastronomía regional en un entorno histórico de absoluta belleza.',
};

const HOST_NAMES = ['Valentina', 'Santiago', 'Lucía', 'Mateo', 'Camila', 'Agustín', 'Sofía', 'Nicolás', 'Florencia', 'Sebastián', 'Antonella', 'Rodrigo'];

export const ROOMS: Room[] = LISTINGS.map((listing, i) => ({
  ...listing,
  description: DESCRIPTIONS[listing.id] ?? '',
  hostName: HOST_NAMES[i],
  hostYears: [6, 4, 8, 3, 5, 7, 2, 9, 4, 6, 5, 11][i],
  isSuperhost: [true, true, false, true, false, true, true, false, true, false, false, true][i],
  maxGuests: [8, 12, 2, 4, 3, 10, 6, 2, 8, 2, 4, 14][i],
  bedrooms: [4, 6, 1, 2, 1, 5, 3, 1, 4, 1, 2, 7][i],
  beds: [5, 7, 1, 3, 1, 6, 4, 1, 5, 2, 2, 8][i],
  baths: [3, 5, 1, 2, 1, 4, 2, 1, 3, 1, 2, 5][i],
  amenities: AMENITIES_BY_CATEGORY[listing.category] ?? AMENITIES_BY_CATEGORY['Ciudades'],
  galleryImages: GALLERY_SETS[listing.category] ?? GALLERY_SETS['Ciudades'],
}));

export function getRoomById(id: string): Room | undefined {
  return ROOMS.find((r) => r.id === id);
}
