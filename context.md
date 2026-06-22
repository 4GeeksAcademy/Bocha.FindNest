# Especificación de Componentes — Clon de Airbnb (Next.js)

Stack: **Next.js 16 (App Router) + TypeScript + Tailwind CSS**.
Este documento describe, vista por vista, los componentes React a implementar: su archivo sugerido, props (`interface` TS), región de layout dentro de la página y notas de comportamiento/estado. Se actualiza incrementalmente: cada vista se añade cuando se comparten sus capturas.

## Qué vamos a construir

Estamos construyendo el flujo de búsqueda y reserva de alojamientos de un clon de Airbnb, compuesto por tres páginas conectadas entre sí.

**Home.** Es la pantalla de inicio: muestra un buscador (destino, fechas, viajeros), accesos rápidos por categoría y carruseles de alojamientos recomendados organizados por destino, además de un aviso de próximo viaje cuando el usuario tiene una reserva cercana.

**Catálogo (resultados de búsqueda).** Es a donde se llega después de buscar. Muestra la lista de alojamientos que coinciden con la búsqueda junto a un mapa interactivo con el precio de cada uno, filtros rápidos (precio, tipo de alojamiento, servicios) y la posibilidad de alternar entre ver la lista o el mapa a pantalla completa.

**Detalle de habitación.** Es la ficha de un alojamiento puntual: fotos, descripción, servicios, ubicación aproximada en el mapa, calendario de disponibilidad, opiniones de otros huéspedes, datos del anfitrión y el panel para reservar con precio y fechas.

## Sobre el usuario

El usuario de esta plataforma es un viajero que busca alojamiento temporal para una estadía (vacaciones, viaje de trabajo, etc.). Llega con un destino y fechas en mente, compara opciones por precio, ubicación y valoraciones de otros huéspedes, y termina eligiendo un alojamiento puntual para reservarlo. Su objetivo es encontrar un lugar donde quedarse que se ajuste a su presupuesto y necesidades, y completar la reserva con la mayor confianza y el menor esfuerzo posible.

## Estado del documento

| Vista | Estado |
|---|---|
| Home | Especificada en este documento |
| Catálogo (resultados de búsqueda) | Especificada en este documento |
| Detalle de habitación | Especificada en este documento |

## Convenciones generales

- **Nomenclatura:** por dominio (`SearchBar`, `ListingCard`, `GuestPicker`...), PascalCase, un componente por archivo.
- **Sin librerías de UI preconstruidas (confirmado):** no se usa shadcn/ui, MUI, Ant Design, Chakra UI ni ninguna librería de componentes equivalente — tampoco primitivos "headless" por debajo (Radix UI, Headless UI). Todo se implementa con clases de utilidad de Tailwind y componentes propios del proyecto, incluidos los primitivos listados en `components/ui/` (`Stepper`, `Popover`, `Sheet`), que se construyen desde cero. Única excepción: `@react-google-maps/api` (ver "Integración de mapas" abajo), que no es una librería de componentes de UI sino el SDK necesario para el mapa real de Google Maps — no aporta botones, inputs, modales ni ningún elemento de interfaz.
- **Breakpoints (Tailwind):** diseño **mobile-first**, confirmado. Se diseña primero para viewport 375px y se adapta a desktop a partir de `md` (768px). Componentes mobile-only usan `md:hidden`; componentes desktop-only usan `hidden md:flex` (o equivalente). El corte unificado en todo el documento es `md`, no `lg`.
- **Estructura de carpetas sugerida:**
  ```
  components/
    layout/      SiteHeader, MobileTopBar, BottomTabBar, SiteFooter, PrimaryNavTabs, CategoryTabs, UtilityActions, LocaleCurrencyMenu
    search/      SearchBar, SearchSegment, SearchButton, DateRangePicker, GuestPicker, MobileSearchSheet, ...
    home/        UpcomingTripCard, ListingSection, SectionHeader
    listing/     ListingCard, ListingCarousel            (movidos: compartidos entre Home y Catálogo)
    catalog/     FilterBar, FiltersModal, PriceRangeFilter, PropertyTypeFilter, CatalogSplitLayout, ResultsMap, ...
    room/        ListingGallery, BookingWidget, AvailabilityCalendar, ...
    maps/        GoogleMapsProvider
    ui/          Stepper, Popover, Sheet (primitivos reutilizables)
  app/
    layout.tsx        shell global (SiteHeader/MobileTopBar + BottomTabBar + SiteFooter + <main>)
    page.tsx          Home
    buscar/page.tsx   Catálogo
    room/[id]/page.tsx  Detalle
  ```
- **Capturas de referencia usadas en esta sección:**

  | Archivo | Estado representado |
  |---|---|
  | `375px/home 375px.png` | Home mobile, estado inicial |
  | `fullsize/homefullsize.png` | Home desktop, SearchBar idle (sin foco) |
  | `fullsize/homedetalle buscador1full.png` | Home desktop, `DateRangePicker` abierto |
  | `fullsize/homedetalle buscador2 fullsize.png` | Home desktop, `GuestPicker` abierto |
  | `375px/busqueda 375px .png` | Home mobile, `MobileSearchSheet` abierto |
  | `375px/resultados busqueda 375px.png` | Catálogo mobile (vista lista) |
  | `fullsize/resultadobusqeudafullsize.png` | Catálogo desktop (lista + mapa) |
  | `375px/room 375px.png` | Detalle de habitación mobile |
  | `fullsize/room full size.png` | Detalle de habitación desktop |

### Integración de mapas (Google Maps)

Decisiones confirmadas para Catálogo y Detalle de habitación:

- **Librería:** [`@react-google-maps/api`](https://www.npmjs.com/package/@react-google-maps/api) (wrapper de componentes: `GoogleMap`, `OverlayView`, `Circle`).
- **Carga del script:** un único `GoogleMapsProvider` (ver componente más abajo) montado una sola vez, idealmente en un layout anidado que envuelva solo las rutas `app/buscar/` y `app/room/[id]/` (no en `app/layout.tsx` raíz, para no cargar el bundle de Maps en Home).
- **API key:** variable de entorno `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`.
- **Pines:** un marcador por alojamiento, **sin agrupación/clustering, confirmado para esta versión**, renderizado como "burbuja de precio" custom vía `OverlayView` (no marcador nativo de Maps, ya que `@react-google-maps/api` no soporta Advanced Markers con HTML/CSS tan bien como `@vis.gl/react-google-maps`). `@googlemaps/markerclusterer` queda fuera de alcance por ahora; se deja como posible mejora futura sin cambiar la API pública de `ResultsMap`.
- **Catálogo desktop:** lista y mapa sincronizados (hover/click en `ListingCard` resalta su pin y viceversa).
- **Catálogo mobile:** patrón de toggle "Lista/Mapa" a pantalla completa (botón flotante), no mapa inline pequeño.
- **Detalle de habitación:** mapa de privacidad — `Circle` translúcido sobre coordenadas aproximadas, sin marcador exacto, hasta que la reserva esté confirmada (la difuminación/redondeo de coordenadas es responsabilidad del backend, no del componente).

---

## Vista: Home

### Resumen

- Rutas: `app/page.tsx` (contenido) dentro del shell de `app/layout.tsx`.
- `SiteHeader`/`MobileTopBar` y `BottomTabBar` viven en el layout global porque previsiblemente persisten en Catálogo y Detalle (a confirmar cuando se especifiquen esas vistas).
- El resto de componentes (`UpcomingTripCard`, `ListingSection`, `CategoryTabs`) son específicos de `page.tsx` de Home.

### Árbol de componentes

```
app/layout.tsx
├─ SiteHeader                      (md+)
│  ├─ BrandLogo
│  ├─ PrimaryNavTabs
│  │  └─ NavTabItem ×4
│  ├─ SearchBar
│  │  ├─ SearchSegment ×3 (Destino, Fechas, Viajeros)
│  │  ├─ SearchButton
│  │  ├─ DateRangePicker (popover, anclado a segmento "Fechas")
│  │  │  ├─ DatePickerModeToggle
│  │  │  ├─ MonthCalendarGroup
│  │  │  │  └─ MonthCalendar ×2
│  │  │  └─ QuickRangeSelector
│  │  └─ GuestPicker (popover, anclado a segmento "Viajeros")
│  │     └─ GuestStepperRow ×4 (Adultos, Niños, Bebés, Mascotas)
│  │        └─ Stepper
│  └─ UtilityActions (LocaleSwitcherButton, UserMenuButton)
├─ MobileTopBar                    (<md)
│  └─ SearchTriggerMobile → abre MobileSearchSheet
├─ MobileSearchSheet (overlay, <md; flujo secuencial de 3 pasos)
│  ├─ SheetTabs (Alojamientos/Experiencias/Servicios) + CloseButton
│  ├─ StepSummaryRow ×(0-2)                  (pasos ya completados, apilados arriba)
│  ├─ paso 'destino' → DestinationSearchPanel
│  │     └─ DestinationSuggestionItem ×N
│  ├─ paso 'fechas'  → DatePickerModeToggle + MonthCalendar ×1 + QuickRangeSelector
│  ├─ paso 'viajeros'→ GuestStepperGroup ("¿Quién?")
│  │     └─ GuestStepperRow ×4 → Stepper
│  └─ SheetFooterActions (Restablecer, "Siguiente"/"Buscar" según el paso)
├─ <main>
│  └─ app/page.tsx (Home)
│     ├─ CategoryTabs                (<md; en md+ equivale a PrimaryNavTabs del header)
│     │  └─ CategoryTabItem ×N
│     ├─ UpcomingTripCard (<md; condicional, solo si hay viaje próximo; ausente en desktop)
│     └─ ListingSection ×N
│        ├─ SectionHeader (title, subtitle?, seeAllHref, CarouselNavButtons [md+])
│        └─ ListingCarousel
│           └─ ListingCard ×N
├─ BottomTabBar                     (<md)
│  └─ BottomTabItem ×5
└─ SiteFooter                       (confirmado: mismo componente en Home, Catálogo y Detalle)
```

---

### 1. Layout global y navegación

#### `SiteHeader`
- **Archivo:** `components/layout/SiteHeader.tsx`
- **Región de layout:** raíz de `app/layout.tsx`, franja superior de toda la app. `sticky top-0 z-40 w-full bg-white`, contiene en una fila: logo → nav → search bar → acciones. Visible solo en `md+` (`hidden md:flex`); en mobile lo sustituye `MobileTopBar`.
- **Props:**
  ```ts
  interface SiteHeaderProps {
    activeNavId: 'todo' | 'alojamientos' | 'experiencias' | 'servicios';
    user?: { avatarUrl?: string; isAuthenticated: boolean };
  }
  ```
- **Notas:** compone `BrandLogo`, `PrimaryNavTabs`, `SearchBar`, `UtilityActions`. No mantiene estado propio de búsqueda; ese estado vive en `SearchBar` o se eleva a un `SearchProvider` de contexto si Catálogo necesita leerlo.

#### `BrandLogo`
- **Archivo:** `components/layout/BrandLogo.tsx`
- **Región de layout:** extremo izquierdo de `SiteHeader`.
- **Props:** `interface BrandLogoProps { href?: string /* default '/' */; label?: string /* default 'FindNest' */ }`
- **Notas:** logo textual simple (sin ícono/isotipo), tipo "FindNest" o similar — texto con tipografía destacada (bold, tamaño mayor) renderizado directamente con clases de Tailwind, sin imagen ni SVG de marca.

#### `PrimaryNavTabs` / `NavTabItem`
- **Archivo:** `components/layout/PrimaryNavTabs.tsx`
- **Región de layout:** centro de `SiteHeader`, fila horizontal `flex gap-6`.
- **Props:**
  ```ts
  interface NavTabItem { id: string; label: string; icon: ReactNode; href: string }
  interface PrimaryNavTabsProps { items: NavTabItem[]; activeId: string }
  ```
- **Notas:** el item activo (`Todo`) muestra subrayado/borde inferior. Mismo dataset que `CategoryTabs` mobile, presentación distinta.

#### `UtilityActions`
- **Archivo:** `components/layout/UtilityActions.tsx`
- **Región de layout:** extremo derecho de `SiteHeader`.
- **Props:**
  ```ts
  interface UtilityActionsProps {
    locale: string;          // 'es' (default)
    currency: string;        // 'USD' (default)
    onLocaleClick: () => void;   // abre LocaleCurrencyMenu
    onMenuClick: () => void;     // abre menú hamburguesa (cuenta)
    avatarUrl?: string;
  }
  ```
- **Notas:** ícono de globo 🌐 (independiente del menú ☰ hamburguesa de cuenta) abre `LocaleCurrencyMenu` con la opción "Moneda / Idioma". Por el momento queda fijo en español + USD sin funcionalidad real (el click abre el menú pero no persiste cambios todavía).

#### `LocaleCurrencyMenu`
- **Archivo:** `components/layout/LocaleCurrencyMenu.tsx`
- **Región de layout:** popover anclado bajo el ícono 🌐 de `UtilityActions`, `absolute top-full right-0 mt-2 rounded-2xl shadow-lg`.
- **Props:** `interface LocaleCurrencyMenuProps { locale: string; currency: string; onClose: () => void }`
- **Notas:** placeholder de UI únicamente — sin lista de opciones funcional en esta primera implementación; deja la estructura lista para añadir selección real de idioma/moneda más adelante.

#### `MobileTopBar` / `SearchTriggerMobile`
- **Archivo:** `components/layout/MobileTopBar.tsx`, `components/search/SearchTriggerMobile.tsx`
- **Región de layout:** franja superior en mobile, `flex md:hidden`, contiene únicamente el trigger de búsqueda (pill completa, `Empieza a buscar` + ícono lupa centrado).
- **Props:** `interface SearchTriggerMobileProps { placeholder?: string /* 'Empieza a buscar' */; onClick: () => void }`
- **Notas:** al hacer click abre `MobileSearchSheet` con `activeTab: 'alojamientos'`.

#### `CategoryTabs` / `CategoryTabItem`
- **Archivo:** `components/home/CategoryTabs.tsx`
- **Región de layout:** primera sección bajo `MobileTopBar` dentro de `page.tsx`, fila con scroll horizontal (`flex gap-2 overflow-x-auto md:hidden`).
- **Props:**
  ```ts
  interface CategoryTabItem { id: string; label: string; icon: ReactNode; href: string }
  interface CategoryTabsProps { items: CategoryTabItem[]; activeId: string }
  ```
- **Notas:** ítem activo (`Todo`) con pill blanca + borde; resto en gris. Contenido recortado en la captura sugiere overflow horizontal con más ítems fuera de viewport (`Servicios`).

#### `BottomTabBar` / `BottomTabItem`
- **Archivo:** `components/layout/BottomTabBar.tsx`
- **Región de layout:** `fixed bottom-0 inset-x-0 z-40 flex justify-between bg-white border-t md:hidden`.
- **Props:**
  ```ts
  interface BottomTabItem { id: string; label: string; icon: ReactNode; href: string }
  interface BottomTabBarProps { items: BottomTabItem[]; activeId: string; avatarUrl?: string }
  ```
- **Notas:** 5 ítems fijos (Explorar, Favoritos, Viajes, Mensajes, Perfil); el último renderiza avatar circular en vez de ícono. Ítem activo en color de acento (rosa/rojo de marca).

---

### 2. Buscador desktop — `SearchBar`

#### `SearchBar`
- **Archivo:** `components/search/SearchBar.tsx`
- **Región de layout:** dentro de `SiteHeader`, fila central, `mx-auto` con ancho máximo. Tiene dos estados visuales: **idle** (una sola píldora dividida por separadores verticales) y **focused** (los 3 segmentos se separan en píldoras independientes con sombra, una de ellas resaltada). Solo `md+`.
- **Props:**
  ```ts
  type SearchSegmentId = 'destination' | 'dates' | 'guests';

  interface SearchBarProps {
    destination?: string;            // 'Madrid, Madrid'
    dateRange: { start: Date; end: Date } | null;
    guests: GuestCounts;
    activeSegment: SearchSegmentId | null;
    onSegmentClick: (segment: SearchSegmentId) => void;
    onSearch: () => void;
  }

  interface GuestCounts { adults: number; children: number; infants: number; pets: number }
  ```
- **Notas:** al haber un `activeSegment`, `SearchButton` pasa de icono-only a icono+texto "Buscar" (confirmado comparando estado idle vs. estados con popover abierto en las capturas).

#### `SearchSegment`
- **Archivo:** `components/search/SearchSegment.tsx`
- **Región de layout:** uno de los 3 hijos de `SearchBar` (`Destino` / `Fechas` / `Viajeros`); en `MobileSearchSheet` se reutiliza como fila vertical de ancho completo (`Destino`, `Fechas`).
- **Props:**
  ```ts
  interface SearchSegmentProps {
    label: string;          // 'Destino' | 'Fechas' | 'Viajeros'
    value?: string;         // valor formateado, p.ej. '21 ago. - 25 ago.'
    placeholder: string;    // 'Buscar destinos' | 'Introduce las fechas' | 'Añade viajeros'
    isActive?: boolean;
    variant?: 'inline' | 'stacked'; // inline = desktop bar, stacked = mobile sheet
    onClick: () => void;
  }
  ```

#### `SearchButton`
- **Archivo:** `components/search/SearchButton.tsx`
- **Región de layout:** extremo derecho de `SearchBar` (desktop) o pie de `MobileSearchSheet` (como `SheetFooterActions`, ver más abajo).
- **Props:** `interface SearchButtonProps { isExpanded?: boolean /* muestra label 'Buscar' */; onClick: () => void; disabled?: boolean }`

---

### 3. Selector de fechas — `DateRangePicker`

#### `DateRangePicker`
- **Archivo:** `components/search/DateRangePicker.tsx`
- **Región de layout:** popover anclado bajo el segmento "Fechas" de `SearchBar`, `absolute top-full mt-2`, overlay con `shadow-lg rounded-2xl`, ancho fijo que contiene los 2 calendarios lado a lado.
- **Props:**
  ```ts
  interface DateRangePickerProps {
    mode: 'exact' | 'flexible';
    range: { start: Date | null; end: Date | null };
    visibleMonths: [{ month: number; year: number }, { month: number; year: number }];
    quickRangeId: string;          // 'exact' | '1d' | '2d' | '3d' | '7d' | '14d'
    onModeChange: (mode: 'exact' | 'flexible') => void;
    onRangeChange: (range: { start: Date | null; end: Date | null }) => void;
    onMonthNavigate: (direction: 'prev' | 'next') => void;
    onQuickRangeChange: (id: string) => void;
    // contenido de la pestaña "Flexible" (ver DurationSelector / FlexibleMonthGrid)
    flexibleDurationId?: 'weekend' | 'week' | 'month';
    flexibleMonths?: { month: number; year: number; isSelected: boolean }[];
    onFlexibleDurationChange?: (id: 'weekend' | 'week' | 'month') => void;
    onFlexibleMonthSelect?: (month: number, year: number) => void;
    onFlexibleMonthScroll?: (direction: 'prev' | 'next') => void;
    onApply: () => void;
  }
  ```
- **Notas:** cuando `mode === 'exact'` se renderiza `MonthCalendarGroup` + `QuickRangeSelector` (como hoy); cuando `mode === 'flexible'` se renderiza `DurationSelector` + `FlexibleMonthGrid` (ver specs abajo), reemplazando por completo el contenido del cuerpo del popover — el alto del popover se ajusta al contenido de la pestaña activa.

#### `DatePickerModeToggle`
- **Archivo:** `components/search/DatePickerModeToggle.tsx`
- **Región de layout:** fila superior centrada dentro de `DateRangePicker`.
- **Props:** `interface DatePickerModeToggleProps { mode: 'exact' | 'flexible'; onChange: (mode: 'exact' | 'flexible') => void }`

#### `MonthCalendarGroup` / `MonthCalendar`
- **Archivo:** `components/search/MonthCalendar.tsx`
- **Región de layout:** cuerpo central de `DateRangePicker`, `grid grid-cols-2 gap-8`; un único par de flechas `‹ ›` en los bordes exteriores del grupo navega ambos meses a la vez.
- **Props:**
  ```ts
  interface MonthCalendarProps {
    month: number; // 0-11
    year: number;
    selectedRange: { start: Date | null; end: Date | null };
    minDate?: Date;          // hoy, días previos deshabilitados
    onSelectDate: (date: Date) => void;
  }
  interface MonthCalendarGroupProps {
    months: [MonthCalendarProps, MonthCalendarProps];
    onNavigate: (direction: 'prev' | 'next') => void;
  }
  ```
- **Notas:** cabecera de días en español abreviado (`L M X J V S D`, semana inicia lunes). Días pasados/anteriores a `minDate` en gris deshabilitado. Estilo de selección de rango confirmado: el primer y el último día del rango se marcan con un círculo negro sólido (texto blanco); los días intermedios llevan un fondo gris claro continuo (sin círculo) que conecta visualmente el inicio y el fin del rango.

#### `QuickRangeSelector`
- **Archivo:** `components/search/QuickRangeSelector.tsx`
- **Región de layout:** fila de píldoras debajo de `MonthCalendarGroup`, `flex gap-2 overflow-x-auto`.
- **Props:**
  ```ts
  interface QuickRangeOption { id: string; label: string } // 'Fechas exactas', '± 1 día', ...
  interface QuickRangeSelectorProps {
    options: QuickRangeOption[];
    selectedId: string;
    onChange: (id: string) => void;
  }
  ```

#### `DurationSelector`
- **Archivo:** `components/search/DurationSelector.tsx`
- **Región de layout:** cuerpo de la pestaña `Flexible` de `DateRangePicker`, fila de píldoras centrada debajo del encabezado "¿Cuánto tiempo te gustaría quedarte?", `flex gap-2 justify-center`.
- **Props:**
  ```ts
  interface DurationOption { id: 'weekend' | 'week' | 'month'; label: string } // 'Fin de semana' | 'Semana' | 'Mes'
  interface DurationSelectorProps {
    options: DurationOption[];
    selectedId: DurationOption['id'];
    onChange: (id: DurationOption['id']) => void;
  }
  ```
- **Notas:** 3 píldoras siempre visibles (sin scroll), estilo igual al de `QuickRangeSelector` (borde redondeado, fondo oscuro/texto blanco en la seleccionada).

#### `FlexibleMonthGrid`
- **Archivo:** `components/search/FlexibleMonthGrid.tsx`
- **Región de layout:** debajo de `DurationSelector`, bajo el encabezado "¿Cuándo quieres ir?"; grid horizontal de tarjetas de mes con overflow scroll (`flex gap-3 overflow-x-auto`), con un chevron `‹` y `›` a cada extremo para desplazar el grid de a una página.
- **Props:**
  ```ts
  interface FlexibleMonthOption {
    month: number;   // 0-11
    year: number;
    label: string;   // 'ago 2026'
    isSelected: boolean;
  }
  interface FlexibleMonthGridProps {
    months: FlexibleMonthOption[];
    onSelectMonth: (month: number, year: number) => void;
    onScroll: (direction: 'prev' | 'next') => void;
  }
  ```
- **Notas:** cada tarjeta (`FlexibleMonthCard`) es un botón con el nombre del mes/año; el mes seleccionado se marca con borde resaltado. Los chevrons son un atajo de navegación — en mobile el grid también admite swipe/drag nativo del `overflow-x-auto`.

---

### 4. Selector de viajeros — `GuestPicker`

#### `GuestPicker`
- **Archivo:** `components/search/GuestPicker.tsx`
- **Región de layout:** popover anclado bajo el segmento "Viajeros" de `SearchBar`, `absolute top-full right-0 mt-2 rounded-2xl shadow-lg`.
- **Props:**
  ```ts
  interface GuestPickerProps {
    guests: GuestCounts;
    onChange: (guests: GuestCounts) => void;
  }
  ```

#### `GuestStepperRow`
- **Archivo:** `components/search/GuestStepperRow.tsx`
- **Región de layout:** fila dentro de `GuestPicker` (desktop) o de `GuestStepperGroup` (mobile sheet), separadas por `divide-y`.
- **Props:**
  ```ts
  interface GuestStepperRowProps {
    label: string;            // 'Adultos' | 'Niños' | 'Bebés' | 'Mascotas'
    helperText: string;       // '13 años o más' | 'De 2 a 12 años' | 'Menos de 2'
    value: number;
    min?: number;
    max?: number;
    onChange: (value: number) => void;
    extraLink?: { label: string; href: string }; // fila 'Mascotas': '¿Viajas con un animal de asistencia?'
  }
  ```

#### `Stepper`
- **Archivo:** `components/ui/Stepper.tsx`
- **Región de layout:** extremo derecho de cada `GuestStepperRow`.
- **Props:** `interface StepperProps { value: number; min?: number; max?: number; onChange: (value: number) => void; disabled?: boolean }`
- **Notas:** botones circulares `−` / `+`; deshabilitado visualmente (gris) cuando `value === min`.

---

### 5. Buscador mobile — `MobileSearchSheet`

#### `MobileSearchSheet`
- **Archivo:** `components/search/MobileSearchSheet.tsx`
- **Región de layout:** overlay de pantalla completa (`fixed inset-0 z-50 bg-white flex flex-col md:hidden`), reemplaza el contenido de la página mientras está abierto. **Confirmado: es un flujo secuencial de 3 pasos** (no los 3 campos a la vez) — `destino` → `fechas` → `viajeros`. Estructura interna: header de pestañas → `StepSummaryRow` por cada paso ya completado → contenido del paso activo (`flex-1 overflow-y-auto`) → footer fijo de acciones.
- **Props:**
  ```ts
  type SearchStep = 'destino' | 'fechas' | 'viajeros';

  interface MobileSearchSheetProps {
    isOpen: boolean;
    activeTab: 'alojamientos' | 'experiencias' | 'servicios';
    onTabChange: (tab: 'alojamientos' | 'experiencias' | 'servicios') => void;
    currentStep: SearchStep;
    onStepBack: (step: SearchStep) => void;   // tocar un StepSummaryRow ya completado para volver a editarlo
    destination?: string;
    dateRangeLabel?: string;       // '22 jun. - 27 jun.' (resumen una vez elegido)
    guests: GuestCounts;
    onGuestsChange: (guests: GuestCounts) => void;
    onAdvanceStep: () => void;     // 'destino' → 'fechas' → 'viajeros'
    onClose: () => void;
    onReset: () => void;
    onSearch: () => void;          // solo se ejecuta en el paso final 'viajeros'
  }
  ```
- **Notas:** corrige la asunción previa de que Destino/Fechas se muestran siempre como filas visibles simultáneas — confirmado que es estrictamente secuencial: al abrir, el paso activo es `destino` (`DestinationSearchPanel`); al elegir un destino avanza automáticamente a `fechas` (reutiliza `DatePickerModeToggle` + un único `MonthCalendar` + `QuickRangeSelector`, en vez del `MonthCalendarGroup` de 2 meses usado en desktop); al confirmar fechas avanza a `viajeros` (`GuestStepperGroup`). Cada paso completado se colapsa en un `StepSummaryRow` apilado encima del paso activo.

#### `SheetTabs`
- **Archivo:** `components/search/SheetTabs.tsx`
- **Región de layout:** fila superior de `MobileSearchSheet`, con `CloseButton` (✕) alineado a la derecha.
- **Props:**
  ```ts
  interface SheetTabsProps {
    tabs: { id: string; label: string; icon: ReactNode }[];
    activeId: string;
    onChange: (id: string) => void;
    onClose: () => void;
  }
  ```

#### `StepSummaryRow`
- **Archivo:** `components/search/StepSummaryRow.tsx`
- **Región de layout:** se apila encima del paso activo dentro de `MobileSearchSheet`, una fila por cada paso ya completado (p. ej. "Destino → Buenos Aires, Argentina", luego "Fechas → 22 jun. - 27 jun.").
- **Props:** `interface StepSummaryRowProps { label: string; value: string; onClick: () => void }`
- **Notas:** de solo lectura más botón implícito (toda la fila es clickeable); tocarla vuelve al paso correspondiente vía `onStepBack`.

#### `DestinationSearchPanel`
- **Archivo:** `components/search/DestinationSearchPanel.tsx`
- **Región de layout:** contenido del paso `destino` de `MobileSearchSheet`: encabezado "¿Dónde?" + input de búsqueda + lista de sugerencias (`flex-1 overflow-y-auto`).
- **Props:**
  ```ts
  interface DestinationSuggestion {
    id: string;
    icon: ReactNode;   // ícono por categoría: 'cerca de ti', ciudad, playa, montaña...
    title: string;      // 'Montevideo, Uruguay'
    subtitle: string;   // 'Por lugares de interés como este: Teatro Solís'
  }
  interface DestinationSearchPanelProps {
    query: string;
    suggestions: DestinationSuggestion[];
    onQueryChange: (query: string) => void;
    onSelectSuggestion: (id: string) => void;
  }
  ```
- **Notas:** al enfocar el input, la lista de sugerencias se expande a pantalla completa con flecha "←" para volver — es el mismo panel/estado, no un componente distinto.

#### `DestinationSuggestionItem`
- **Archivo:** `components/search/DestinationSuggestionItem.tsx`
- **Región de layout:** ítem repetido de la lista en `DestinationSearchPanel`.
- **Props:** `interface DestinationSuggestionItemProps { icon: ReactNode; title: string; subtitle: string; onClick: () => void }`

#### `GuestStepperGroup`
- **Archivo:** `components/search/GuestStepperGroup.tsx`
- **Región de layout:** contenido del paso `viajeros` (último paso) de `MobileSearchSheet`, encabezado "¿Quién?" + lista de `GuestStepperRow`.
- **Props:** `interface GuestStepperGroupProps { title?: string /* '¿Quién?' */; guests: GuestCounts; onChange: (g: GuestCounts) => void }`

#### `SheetFooterActions`
- **Archivo:** `components/search/SheetFooterActions.tsx`
- **Región de layout:** pie fijo de `MobileSearchSheet`, `sticky bottom-0 flex justify-between items-center border-t bg-white px-4 py-3`.
- **Props:** `interface SheetFooterActionsProps { primaryActionLabel: 'Siguiente' | 'Buscar'; onReset: () => void; onPrimaryAction: () => void; resetDisabled?: boolean }`
- **Notas:** `primaryActionLabel`/`onPrimaryAction` valen "Siguiente" → `onAdvanceStep` en los pasos `destino` y `fechas`, y "Buscar" → `onSearch` únicamente en el paso final `viajeros`.

---

### 6. Contenido de Home

#### `UpcomingTripCard`
- **Archivo:** `components/home/UpcomingTripCard.tsx`
- **Región de layout:** primer bloque de `page.tsx` tras `CategoryTabs` (renderizado condicional). `flex items-center justify-between rounded-2xl border p-4`.
- **Props:**
  ```ts
  interface UpcomingTripCardProps {
    destinationCode: string;     // 'BBY'
    dateRangeLabel: string;      // '21–25 ago'
    travelerCountLabel: string;  // '4 viajeros'
    daysUntilTrip: number;       // 61
    href: string;
  }
  ```
- **Notas:** confirmado ausente en desktop — solo se renderiza en mobile (`md:hidden`). No tiene equivalente en las capturas fullsize.

#### `ListingSection`
- **Archivo:** `components/home/ListingSection.tsx`
- **Región de layout:** se repite N veces en `page.tsx` (una por colección: "Descubre Bariloche...", "Alojamientos populares en Buenos Aires", "Hoteles destacados en Roma"). `flex flex-col gap-3 py-6`.
- **Props:**
  ```ts
  interface ListingSectionProps {
    title: string;
    subtitle?: string;     // 'Una colección de hoteles independientes cuidadosamente seleccionados'
    seeAllHref?: string;
    listings: ListingCardProps[];
  }
  ```

#### `SectionHeader`
- **Archivo:** `components/home/SectionHeader.tsx`
- **Región de layout:** fila superior de `ListingSection`, `flex items-center justify-between`.
- **Props:**
  ```ts
  interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    seeAllHref?: string;          // ícono flecha → 'Descubre Bariloche después de tu viaje →'
    showCarouselControls?: boolean; // true en md+
    onScrollPrev?: () => void;
    onScrollNext?: () => void;
  }
  ```

#### `ListingCarousel`
- **Archivo:** `components/listing/ListingCarousel.tsx` (movido de `components/home/`: pasa a ser compartido entre Home y Catálogo).
- **Región de layout:** cuerpo de `ListingSection`, `flex gap-4 overflow-x-auto snap-x md:overflow-x-hidden` (en `md+` el desplazamiento se controla con los botones de `SectionHeader` en vez de scroll táctil).
- **Props:** `interface ListingCarouselProps { items: ListingCardProps[] }`

#### `ListingCard`
- **Archivo:** `components/listing/ListingCard.tsx` (movido de `components/home/`: pasa a ser compartido entre Home y Catálogo).
- **Región de layout:** ítem de `ListingCarousel`, ancho fijo (`min-w-[260px]` aprox.), `snap-start`.
- **Props:**
  ```ts
  interface ListingCardProps {
    id: string;
    href: string;
    imageUrl?: string;
    imageStatus: 'loading' | 'loaded' | 'error'; // capturas muestran placeholders grises mientras carga
    badgeLabel?: string;       // 'Recomendación del viajero'
    isFavorite: boolean;
    onToggleFavorite: (id: string) => void;
    title: string;
    dateRangeLabel?: string;   // '3-5 jul' (opcional, no aparece en todas las tarjetas)
    priceLabel: string;        // '393 $ USD por 4 noches' (formateado con la moneda activa del usuario)
    rating?: number;           // 4.92
  }
  ```
- **Notas:** confirmado — la moneda es elegida por el usuario (ver `UtilityActions` → `LocaleCurrencyMenu`, ícono 🌐), no depende del listing/región. `priceLabel` ya viene formateado en la moneda activa; por defecto la app usa idioma español + moneda USD (sin funcionalidad de cambio real implementada todavía). Las capturas muestran `€` en algunas tarjetas solo a modo ilustrativo de datos de ejemplo, no de lógica de presentación.

---

## Vista: Catálogo (resultados de búsqueda)

### Resumen

- Ruta: `app/buscar/page.tsx`.
- Reutiliza `SiteHeader`/`MobileTopBar` del layout global en una variante `"results"` (ver más abajo) y añade `FilterBar` justo debajo.
- Reutiliza `ListingCard` (`components/listing/ListingCard.tsx`, compartido con Home; se documenta como extensión de su interfaz, mismo componente, no una copia).
- Layout de 2 columnas en `md+` (lista + mapa); en `<md` es una sola columna con toggle de pantalla completa hacia el mapa.

### Árbol de componentes

```
app/layout.tsx
├─ SiteHeader (variant="results")              (md+)
│  ├─ BrandLogo
│  ├─ SearchBar (siempre "focused", sin estado idle de píldora única)
│  ├─ BecomeHostLink
│  └─ UtilityActions
├─ MobileTopBar (variant="results")             (<md)
│  └─ SearchTriggerMobile
├─ <main>
│  └─ app/buscar/page.tsx
│     ├─ FilterBar
│     │  └─ FilterPill ×N
│     ├─ CatalogSplitLayout                     (md+: 2 columnas · <md: 1 columna)
│     │  ├─ ResultsColumn
│     │  │  ├─ ResultsSummary
│     │  │  └─ ListingResultsGrid
│     │  │     ├─ ListingCard ×N                (extiende el de Home, ver abajo)
│     │  │     ├─ ResultsSectionDivider          ("Disponibles en fechas similares")
│     │  │     └─ HostPromoCard
│     │  └─ ResultsMap (aside sticky, md+)
│     │     └─ MapPriceMarker ×N
│     ├─ MapToggleButton                         (<md, fixed)
│     └─ ResultsMapOverlay (pantalla completa)   (<md, condicional)
│        ├─ ResultsMap
│        │  └─ MapPriceMarker ×N
│        └─ MapToggleButton (modo "Lista")
└─ SiteFooter
```

### 1. Header y filtros

#### `SiteHeader` (variant="results") — actualización
- **Archivo:** `components/layout/SiteHeader.tsx` (mismo componente de Home, con prop nueva).
- **Región de layout:** igual que en Home, pero en esta variante `PrimaryNavTabs` se oculta para dar todo el ancho central a `SearchBar` (que aquí siempre se muestra "focused": destino, fechas y viajeros como 3 píldoras separadas, nunca colapsadas en una sola). A la derecha se agrega `BecomeHostLink` antes de `UtilityActions`.
- **Props (actualizadas):**
  ```ts
  interface SiteHeaderProps {
    variant?: 'home' | 'results';     // 'results' oculta PrimaryNavTabs y agrega BecomeHostLink
    activeNavId?: 'todo' | 'alojamientos' | 'experiencias' | 'servicios'; // solo aplica en variant='home'
    user?: { avatarUrl?: string; isAuthenticated: boolean };
    search: SearchBarProps;
  }
  ```
- **Notas:** en la captura, el segmento "Destino" muestra el texto `Alojamientos en esta zona del mapa` — confirmado: por ahora se trata como un `value` de texto fijo normal en `SearchSegment` (sin modo `contextual` dedicado ni lógica ligada a los límites del mapa). Queda como posible mejora futura si se necesita texto dinámico real.

#### `BecomeHostLink`
- **Archivo:** `components/layout/BecomeHostLink.tsx`
- **Región de layout:** entre `SearchBar` y `UtilityActions` dentro de `SiteHeader`.
- **Props:** `interface BecomeHostLinkProps { label: string /* 'Hazte anfitrión' */; href: string }`

#### `FilterBar`
- **Archivo:** `components/catalog/FilterBar.tsx`
- **Región de layout:** franja `sticky` debajo del header, `flex items-center gap-2 overflow-x-auto px-6 py-3 border-b`, ancho completo (no respeta el split de columnas de más abajo). Mismo patrón de chips con scroll horizontal en mobile y desktop.
- **Props:**
  ```ts
  type PropertyType = 'CASA' | 'APARTAMENTO' | 'HABITACION' | 'ESTUDIO' | 'HOTEL';

  interface FilterPillOption {
    id: string;
    label: string;          // 'Precio', 'Tipo de alojamiento', 'Wifi'...
    hasDropdown?: boolean;  // true → 'Precio ▾', 'Tipo de alojamiento ▾' (abren popover individual)
    isActive?: boolean;
  }
  interface FilterBarProps {
    pills: FilterPillOption[];
    activeIds: string[];
    onTogglePill: (id: string) => void;
    onOpenDropdown?: (id: string) => void;  // abre PriceRangeFilter o PropertyTypeFilter como popover individual
    onOpenFiltersModal: () => void;          // botón 'Filtros' con ícono, abre FiltersModal completo
  }
  ```
- **Notas:** la pill "Precio" abre `PriceRangeFilter` (rango desde/hasta por noche) y la pill "Tipo de alojamiento" abre `PropertyTypeFilter` (CASA / APARTAMENTO / HABITACION / ESTUDIO / HOTEL), cada una en su propio popover individual desde la pill, o agrupadas junto con el resto de filtros (booleanos) dentro de `FiltersModal` al tocar el botón "Filtros" (ver specs abajo). En mobile, el punto de entrada para editar Destino/Fechas/Viajeros no es esta barra sino el resumen de búsqueda en `MobileTopBar` (variant="results"), que reutiliza el flujo de `MobileSearchSheet` (ver sección 5 de Home) — esta `FilterBar` de Precio/Tipo/amenities se mantiene como fila independiente debajo de ese resumen.

#### `FiltersModal`
- **Archivo:** `components/catalog/FiltersModal.tsx`
- **Región de layout:** modal centrado en `md+`, drawer de pantalla completa en `<md`; se abre desde el botón "Filtros" de `FilterBar`.
- **Props:**
  ```ts
  interface FiltersModalProps {
    isOpen: boolean;
    priceRange: { min: number; max: number; currentMin: number; currentMax: number };
    propertyType: PropertyType | null;
    amenities: { id: string; label: string; isChecked: boolean }[];
    onPriceRangeChange: (range: { min: number; max: number }) => void;
    onPropertyTypeChange: (id: PropertyType | null) => void;
    onAmenityToggle: (id: string, checked: boolean) => void;
    onClose: () => void;
    onClearAll: () => void;
    onApply: () => void;
  }
  ```
- **Notas:** agrupa en secciones verticales `PriceRangeFilter`, `PropertyTypeFilter` y la lista de `AmenityToggleFilter` (uno por característica booleana). Pie fijo con "Limpiar todo" / "Mostrar N alojamientos".

#### `PriceRangeFilter`
- **Archivo:** `components/catalog/PriceRangeFilter.tsx`
- **Región de layout:** primera sección de `FiltersModal`; también disponible como popover individual desde la pill "Precio ▾" de `FilterBar`.
- **Props:**
  ```ts
  interface PriceRangeFilterProps {
    label?: string;   // 'Precio por noche'
    min: number;       // límite inferior absoluto del dataset
    max: number;       // límite superior absoluto del dataset
    currentMin: number;
    currentMax: number;
    onChange: (range: { min: number; max: number }) => void;
  }
  ```
- **Notas:** filtra por precio por noche (no precio total de la estadía), con dos campos "Desde" / "Hasta" en la moneda activa del usuario.

#### `PropertyTypeFilter`
- **Archivo:** `components/catalog/PropertyTypeFilter.tsx`
- **Región de layout:** segunda sección de `FiltersModal`; también disponible como popover individual desde la pill "Tipo de alojamiento ▾" de `FilterBar`.
- **Props:**
  ```ts
  interface PropertyTypeOption { id: PropertyType; label: string }
  interface PropertyTypeFilterProps {
    options: PropertyTypeOption[];   // CASA, APARTAMENTO, HABITACION, ESTUDIO, HOTEL
    selectedId: PropertyType | null; // null = sin filtrar (cualquier tipo)
    onChange: (id: PropertyType | null) => void;
  }
  ```
- **Notas:** selección única entre las 5 categorías.

#### `AmenityToggleFilter`
- **Archivo:** `components/catalog/AmenityToggleFilter.tsx`
- **Región de layout:** ítem repetido en la lista de filtros booleanos dentro de `FiltersModal`.
- **Props:** `interface AmenityToggleFilterProps { id: string; label: string /* 'Wifi', 'Piscina', 'Cocina', 'Estacionamiento'... */; isChecked: boolean; onChange: (id: string, checked: boolean) => void }`
- **Notas:** checkbox simple — el alojamiento tiene o no tiene esa característica, sin grados intermedios.

#### `ResultsSummary`
- **Archivo:** `components/catalog/ResultsSummary.tsx`
- **Región de layout:** encabezado de `ResultsColumn`, encima del grid de resultados.
- **Props:** `interface ResultsSummaryProps { resultCountLabel: string /* 'Más de 1.000 alojamientos dentro de la zona del mapa' */; onSortInfoClick: () => void }`

### 2. Resultados (lista)

#### `CatalogSplitLayout`
- **Archivo:** `components/catalog/CatalogSplitLayout.tsx`
- **Región de layout:** contenedor principal de `page.tsx`. `md+`: `grid grid-cols-[1fr_45%]`; `<md`: `flex flex-col` (una sola columna, el mapa no se renderiza inline sino vía `ResultsMapOverlay`).
- **Props:** `interface CatalogSplitLayoutProps { resultsSlot: ReactNode; mapSlot: ReactNode }`

#### `ListingResultsGrid`
- **Archivo:** `components/catalog/ListingResultsGrid.tsx`
- **Región de layout:** dentro de `ResultsColumn`. `grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-8` (en la captura desktop se ve un grid de 2 columnas dentro de la columna de resultados, no de toda la página).
- **Props:**
  ```ts
  interface ListingResultsGridProps {
    primaryListings: ListingCardProps[];
    similarDatesListings?: ListingCardProps[]; // sección 'Disponibles en fechas similares'
    activeListingId: string | null;
    onListingHover: (id: string | null) => void;
    promo?: { title: string; ctaLabel: string; onClick: () => void }; // 'Hazte anfitrión en Madrid'
  }
  ```

#### `ListingCard` — extensión sobre la versión de Home
- **Archivo:** `components/listing/ListingCard.tsx` — **confirmado movido** de `components/home/`, ya que pasa a ser compartido entre Home y Catálogo (no es exclusivo de Home).
- **Props (interfaz extendida; los campos nuevos son opcionales y no rompen el uso en Home):**
  ```ts
  interface ListingCardProps {
    id: string;
    href: string;
    position?: { lat: number; lng: number }; // necesario para sincronizar con ResultsMap
    imageUrl?: string;
    imageStatus: 'loading' | 'loaded' | 'error';
    badgeLabel?: string;        // 'Recomendación del viajero'
    badgeIcon?: ReactNode;      // ícono trofeo en 'Recomendación del viajero' destacada
    isFavorite: boolean;
    onToggleFavorite: (id: string) => void;
    title: string;
    subtitle?: string;          // 'Lost Studio en la latina con vistas'
    roomInfoLabel?: string;     // '1 cama · 1 baño'
    hostTypeLabel?: string;     // 'Anfitrión profesional'
    dateRangeLabel?: string;    // '3-5 jul'
    priceLabel: string;         // '410 € en total'
    originalPriceLabel?: string; // '517 €' (se muestra tachado antes de priceLabel)
    cancellationLabel?: string; // 'Cancelación gratuita'
    rating?: number;
    reviewCount?: number;
    isActive?: boolean;         // resaltado cuando su pin está activo en el mapa (Catálogo)
    onHoverChange?: (isHovering: boolean) => void;
  }
  ```

#### `ResultsSectionDivider`
- **Archivo:** `components/catalog/ResultsSectionDivider.tsx`
- **Región de layout:** separador de ancho completo dentro de `ListingResultsGrid`, entre los resultados principales y los de fechas similares.
- **Props:** `interface ResultsSectionDividerProps { label: string /* 'Disponibles en fechas similares' */ }`

#### `HostPromoCard`
- **Archivo:** `components/catalog/HostPromoCard.tsx`
- **Región de layout:** última celda del grid de resultados (mobile, al final del scroll).
- **Props:** `interface HostPromoCardProps { title: string /* 'Hazte anfitrión en Madrid' */; ctaLabel: string; onClick: () => void }`

### 3. Mapa de resultados

#### `GoogleMapsProvider`
- **Archivo:** `components/maps/GoogleMapsProvider.tsx`
- **Región de layout:** envuelve cualquier subárbol que use mapas (no es visual). Se monta en un layout anidado de `app/buscar/` y `app/room/[id]/`.
- **Props:** `interface GoogleMapsProviderProps { apiKey: string; children: ReactNode }`
- **Notas:** expone vía contexto `{ isLoaded: boolean; loadError?: Error }` usando `useJsApiLoader` de `@react-google-maps/api`.

#### `ResultsMap`
- **Archivo:** `components/catalog/ResultsMap.tsx`
- **Región de layout:** columna derecha de `CatalogSplitLayout` en `md+` (`sticky top-[headerHeight] h-[calc(100vh-headerHeight)]`), o pantalla completa dentro de `ResultsMapOverlay` en `<md`.
- **Props:**
  ```ts
  interface MapListing {
    id: string;
    position: { lat: number; lng: number };
    priceLabel: string; // '420 €'
  }
  interface ResultsMapProps {
    listings: MapListing[];
    activeListingId: string | null;
    onMarkerHover: (id: string | null) => void;
    onMarkerClick: (id: string) => void;   // hace scroll a la card correspondiente
    center: { lat: number; lng: number };
    zoom: number;
    onBoundsChanged?: (bounds: { ne: {lat:number;lng:number}; sw: {lat:number;lng:number} }) => void; // para 'buscar al mover el mapa'
  }
  ```
- **Notas:** controles nativos de Google Maps habilitados vía `options` del `GoogleMap`: `zoomControl: true`, `fullscreenControl: true`, estilo simplificado (`styles` custom para ocultar POIs irrelevantes, opcional).

#### `MapPriceMarker`
- **Archivo:** `components/catalog/MapPriceMarker.tsx`
- **Región de layout:** hijo de `ResultsMap`, posicionado vía `OverlayView` de `@react-google-maps/api` (necesario para renderizar HTML/CSS custom — la burbuja redondeada con el precio — en vez de un ícono nativo de Maps).
- **Props:** `interface MapPriceMarkerProps { position: { lat: number; lng: number }; priceLabel: string; isActive: boolean; onHover: (hovering: boolean) => void; onClick: () => void }`
- **Notas:** estado `isActive` invierte colores (fondo oscuro/texto blanco) cuando el mouse está sobre la `ListingCard` correspondiente o el pin fue clickeado.

#### `MapToggleButton`
- **Archivo:** `components/catalog/MapToggleButton.tsx`
- **Región de layout:** `fixed bottom-6 inset-x-0 mx-auto w-fit z-30 md:hidden`.
- **Props:** `interface MapToggleButtonProps { mode: 'list' | 'map'; onToggle: () => void }`

#### `ResultsMapOverlay`
- **Archivo:** `components/catalog/ResultsMapOverlay.tsx`
- **Región de layout:** `fixed inset-0 z-50 bg-white md:hidden`, reemplaza la vista de lista mientras `mode === 'map'`.
- **Props:**
  ```ts
  interface ResultsMapOverlayProps {
    isOpen: boolean;
    listings: MapListing[];
    activeListingId: string | null;
    onMarkerClick: (id: string) => void;
    onClose: () => void; // vuelve a modo 'list'
  }
  ```

---

## Vista: Detalle de habitación

### Resumen

- Ruta: `app/room/[id]/page.tsx`.
- Reutiliza `SiteHeader`/`MobileTopBar` en variante `"results"` (placeholders vacíos: "Cualquier lugar", "Cualquier fecha", "Añade viajeros").
- Layout de 2 columnas en `md+` (contenido + `BookingWidget` sticky); en `<md` una sola columna con `MobileBookingBar` fija al fondo.
- Reutiliza `MonthCalendar`/`MonthCalendarGroup` (Home) en variante inline para el calendario de disponibilidad, y `GoogleMapsProvider`/patrones de mapa de Catálogo (pero con `Circle` en vez de marcador exacto).

### Árbol de componentes

```
app/layout.tsx
├─ SiteHeader (variant="results", placeholders vacíos)   (md+)
├─ MobileTopBar (variant="results")                       (<md)
├─ <main>
│  └─ app/room/[id]/page.tsx
│     ├─ ListingTitleBar
│     ├─ ListingGallery
│     ├─ RoomDetailLayout                                 (md+: grid 2 columnas · <md: 1 columna)
│     │  ├─ ContentColumn
│     │  │  ├─ ListingOverviewSection
│     │  │  ├─ HighlightsList
│     │  │  ├─ ListingDescription
│     │  │  ├─ SleepingArrangements
│     │  │  ├─ AmenitiesGrid
│     │  │  ├─ AvailabilityCalendar
│     │  │  │  └─ MonthCalendarGroup (variante inline, de Home)
│     │  │  ├─ RatingBreakdown
│     │  │  ├─ ReviewsGrid
│     │  │  │  └─ ReviewCard ×N
│     │  │  ├─ LocationSection
│     │  │  │  └─ ApproximateLocationMap
│     │  │  ├─ HostProfileCard
│     │  │  └─ PoliciesAccordion
│     │  └─ BookingWidget (aside sticky)                  (md+)
│     └─ MobileBookingBar (fixed bottom)                  (<md)
└─ SiteFooter
```

### 1. Encabezado y galería

#### `ListingTitleBar`
- **Archivo:** `components/room/ListingTitleBar.tsx`
- **Región de layout:** primer bloque de `page.tsx`, encima de la galería. `flex items-center justify-between`.
- **Props:** `interface ListingTitleBarProps { title: string; onShare: () => void; isSaved: boolean; onToggleSave: () => void }`

#### `ListingGallery`
- **Archivo:** `components/room/ListingGallery.tsx`
- **Región de layout:** bloque hero debajo de `ListingTitleBar`. `md+`: grid (1 foto grande + 4 miniaturas) con botón "Mostrar todas las fotos" superpuesto esquina inferior derecha. `<md`: carrusel de una imagen con indicador de posición.
- **Props:**
  ```ts
  interface GalleryImage { id: string; url: string; alt: string }
  interface ListingGalleryProps {
    images: GalleryImage[];
    layout: 'grid' | 'carousel'; // 'grid' en md+, 'carousel' en <md
    onShowAll: () => void;
  }
  ```
- **Notas:** confirmado el patrón en mobile: carrusel de una imagen a ancho completo (`layout: 'carousel'`), con indicador de posición (contador "x/N") justo bajo `ListingTitleBar`.

### 2. Contenido principal

#### `ListingOverviewSection`
- **Archivo:** `components/room/ListingOverviewSection.tsx`
- **Región de layout:** primer bloque de `ContentColumn`.
- **Props:**
  ```ts
  interface ListingOverviewSectionProps {
    subtitle: string;       // 'Alojamiento entero: apartamento en Madrid, España'
    statsLabel: string;     // '2 viajeros · 1 dormitorio · 1 cama · 1 baño'
    rating?: number;
    reviewCount?: number;
    badgeLabel?: string;    // 'Recomendación del viajero' / 'Uno de los Airbnb favoritos...'
    host: { name: string; avatarUrl: string; isSuperhost: boolean; yearsHosting?: number; href: string };
  }
  ```

#### `HighlightsList`
- **Archivo:** `components/room/HighlightsList.tsx`
- **Región de layout:** bloque debajo de `ListingOverviewSection`, lista vertical `flex flex-col gap-4`.
- **Props:**
  ```ts
  interface HighlightItem { icon: ReactNode; title: string; description?: string; href?: string }
  interface HighlightsListProps { items: HighlightItem[] }
  ```

#### `ListingDescription`
- **Archivo:** `components/room/ListingDescription.tsx`
- **Props:** `interface ListingDescriptionProps { text: string; isMachineTranslated?: boolean; onShowOriginal?: () => void; isExpanded: boolean; onToggleExpand: () => void }`

#### `SleepingArrangements`
- **Archivo:** `components/room/SleepingArrangements.tsx`
- **Región de layout:** sección "¿Dónde dormirás?", carrusel horizontal de tarjetas.
- **Props:**
  ```ts
  interface SleepingArea { id: string; imageUrl: string; label: string; bedInfo: string }
  interface SleepingArrangementsProps { areas: SleepingArea[] }
  ```

#### `AmenitiesGrid`
- **Archivo:** `components/room/AmenitiesGrid.tsx`
- **Región de layout:** sección "¿Qué hay en este alojamiento?", `grid grid-cols-1 sm:grid-cols-2 gap-y-3`.
- **Props:**
  ```ts
  interface AmenityItem { icon: ReactNode; label: string; isUnavailable?: boolean }
  interface AmenitiesGridProps { items: AmenityItem[]; totalCount: number; onShowAll: () => void }
  ```

#### `AvailabilityCalendar`
- **Archivo:** `components/room/AvailabilityCalendar.tsx`
- **Región de layout:** sección "N noches en Madrid", reutiliza `MonthCalendarGroup`/`MonthCalendar` de Home en variante `inline` (siempre visible, sin popover/trigger).
- **Props:**
  ```ts
  interface AvailabilityCalendarProps {
    nightsLabel: string;        // '4 noches en Madrid'
    dateRangeLabel: string;     // '21/8/2026 - 25/8/2026'
    months: [{ month: number; year: number }, { month: number; year: number }];
    selectedRange: { start: Date; end: Date };
    unavailableDates?: Date[];
    newListingNoticeLabel?: string; // 'Nuevo · Sin evaluaciones (por ahora)' (visto en mobile)
    onClearDates: () => void;
    onMonthNavigate: (direction: 'prev' | 'next') => void;
  }
  ```

#### `RatingBreakdown`
- **Archivo:** `components/room/RatingBreakdown.tsx`
- **Props:**
  ```ts
  interface RatingCategory { label: string; value: number } // 0-5, p.ej. Limpieza, Veracidad, Llegada, Comunicación, Ubicación, Calidad
  interface ReviewThemeChip { label: string }
  interface RatingBreakdownProps {
    overallRating: number;
    badgeLabel?: string;
    categories: RatingCategory[];
    themeChips?: ReviewThemeChip[];
  }
  ```

#### `ReviewsGrid` / `ReviewCard`
- **Archivo:** `components/room/ReviewsGrid.tsx`, `components/room/ReviewCard.tsx`
- **Región de layout:** `grid grid-cols-1 sm:grid-cols-2 gap-8` debajo de `RatingBreakdown`.
- **Props:**
  ```ts
  interface ReviewCardProps {
    authorName: string;
    authorAvatarUrl: string;
    memberSinceLabel: string; // 'Lleva 10 años en Airbnb'
    date: string;
    text: string;
    isExpandable?: boolean;
  }
  interface ReviewsGridProps { reviews: ReviewCardProps[]; totalCount: number; onShowAll: () => void }
  ```

#### `LocationSection` / `ApproximateLocationMap`
- **Archivo:** `components/room/LocationSection.tsx`, `components/room/ApproximateLocationMap.tsx`
- **Región de layout:** sección "¿Dónde me voy a quedar?"; el mapa ocupa ancho completo de la columna de contenido, alto fijo (`h-[400px]` aprox.).
- **Props:**
  ```ts
  interface LocationSectionProps {
    areaLabel: string;         // 'Madrid, Comunidad de Madrid, España'
    description?: string;
    approximateCenter: { lat: number; lng: number };
  }
  interface ApproximateLocationMapProps {
    center: { lat: number; lng: number }; // coordenadas ya difuminadas/redondeadas por el backend
    radiusMeters?: number;                // p.ej. 300
    zoom?: number;
  }
  ```
- **Notas:** a diferencia de `ResultsMap`, **no** se renderiza ningún marcador; solo un `Circle` translúcido centrado en `center`. Las coordenadas exactas del alojamiento no deben llegar al cliente antes de la reserva confirmada (regla de negocio/backend, no solo de UI).

#### `HostProfileCard`
- **Archivo:** `components/room/HostProfileCard.tsx`
- **Región de layout:** sección "Conoce a tu anfitrión".
- **Props:**
  ```ts
  interface CoHost { name: string; avatarUrl: string }
  interface HostProfileCardProps {
    name: string;
    avatarUrl: string;
    isSuperhost: boolean;
    followerCount?: number;
    rating?: number;
    reviewCount?: number;
    yearsHosting: number;
    coHosts?: CoHost[];
    responseRateLabel?: string;
    responseTimeLabel?: string;
    bornInLabel?: string;
    onMessageHost: () => void;
  }
  ```

#### `PoliciesAccordion`
- **Archivo:** `components/room/PoliciesAccordion.tsx`
- **Región de layout:** sección "Qué debes saber", `grid grid-cols-1 md:grid-cols-3 gap-6`.
- **Props:**
  ```ts
  interface PolicyItem { id: string; title: string; icon: ReactNode; summaryLines: string[]; href: string }
  interface PoliciesAccordionProps { items: PolicyItem[] }
  ```

### 3. Reserva

#### `BookingWidget`
- **Archivo:** `components/room/BookingWidget.tsx`
- **Región de layout:** `aside` de `RoomDetailLayout`, `sticky top-24 hidden md:block`.
- **Props:**
  ```ts
  interface BookingWidgetProps {
    priceLabel: string;          // '429 $ USD'
    originalPriceLabel?: string; // '593 $ USD' (tachado)
    nightsLabel: string;         // 'por 4 noches'
    dateRange: { start: Date; end: Date };
    guests: GuestCounts;
    onDateRangeClick: () => void; // reutiliza DateRangePicker en variante embebida
    onGuestsClick: () => void;    // reutiliza GuestPicker
    onReserve: () => void;
    cancellationNote?: string;    // 'Cancelación gratuita antes del...'
  }
  ```

#### `MobileBookingBar`
- **Archivo:** `components/room/MobileBookingBar.tsx`
- **Región de layout:** `fixed bottom-0 inset-x-0 z-40 flex items-center justify-between border-t bg-white px-4 py-3 md:hidden`.
- **Props:** `interface MobileBookingBarProps { priceLabel: string; detailLabel: string /* 'Por 3 noches · 25-28 jun' */; onReserve: () => void }`

### 4. Layout global (confirmado)

#### `SiteFooter`
- **Archivo:** `components/layout/SiteFooter.tsx`
- **Región de layout:** pie de `app/layout.tsx`, fuera de `<main>`, ancho completo. **Confirmado: es el mismo componente, con el mismo contenido, en las 3 vistas** (Home, Catálogo y Detalle) — componente de layout global, igual al que se ve en las capturas de Detalle.
- **Props:**
  ```ts
  interface FooterLinkGroup { title: string; links: { label: string; href: string }[] }
  interface SiteFooterProps {
    groups: FooterLinkGroup[];   // 'Asistencia', 'Hosting', 'Airbnb', ...
    localeLabel: string;
    currencyLabel: string;
    onLocaleClick: () => void;
    copyrightLabel: string;
  }
  ```

---

## Preguntas abiertas / asunciones a confirmar

1. ~~**Breakpoint de corte**~~ — confirmado: diseño mobile-first, se diseña primero para 375px y se adapta a desktop a partir de `md` (768px). Todas las referencias del documento usan `md` como corte mobile↔desktop.
2. ~~**`UpcomingTripCard`**~~ — confirmado: ausente en desktop, solo se renderiza en mobile (`md:hidden`).
3. ~~**Pestaña "Flexible" del `DateRangePicker`**~~ — especificada: `DurationSelector` (píldoras Fin de semana/Semana/Mes) + `FlexibleMonthGrid` (tarjetas de mes con scroll horizontal y chevrons, "¿Cuándo quieres ir?").
4. ~~**Formato de precio/moneda en `ListingCard`**~~ — confirmado: la moneda es elegida por el usuario desde el ícono 🌐 (`LocaleCurrencyMenu` en `UtilityActions`), no por región/listing. Por defecto: idioma español + moneda USD, sin funcionalidad de cambio real implementada todavía.
5. ~~**Persistencia de `SiteHeader`/`SearchBar`/`BottomTabBar`**~~ — confirmado con Catálogo/Detalle: viven en `app/layout.tsx`, con `SiteHeader` en variante `"results"` (sin `PrimaryNavTabs`, `SearchBar` siempre expandido, agrega `BecomeHostLink`).
6. ~~**Estilo exacto de selección de rango en `MonthCalendar`**~~ — confirmado: primer y último día del rango con círculo negro sólido (texto blanco); días intermedios con fondo gris claro continuo (sin círculo).
7. ~~**Modal de "Filtros" y dropdowns de `FilterBar`**~~ — especificado: "Precio" es un rango por noche desde/hasta (`PriceRangeFilter`); "Tipo de alojamiento" es selección única entre CASA/APARTAMENTO/HABITACION/ESTUDIO/HOTEL (`PropertyTypeFilter`); el resto de filtros son booleanos tiene/no-tiene (`AmenityToggleFilter`), todos agrupados en `FiltersModal`.
8. ~~**`FilterBar` en mobile**~~ — especificado: el punto de entrada para editar la búsqueda en mobile reutiliza `MobileSearchSheet` con el mismo flujo secuencial de 3 pasos que en Home (tocar abre el paso `destino`, al elegir lugar avanza a `fechas`, y luego a `viajeros`). La `FilterBar` de Precio/Tipo de alojamiento/amenities se mantiene como fila de chips independiente con el mismo patrón de scroll horizontal en mobile y desktop.
9. ~~**Segmento "Destino" contextual en Catálogo**~~ — confirmado: por ahora se usa solo un `value` de texto fijo en `SearchSegment`, sin modo `contextual` dedicado.
10. ~~**`ListingGallery` en mobile (Detalle)**~~ — confirmado: patrón carrusel a ancho completo (`layout: 'carousel'`), con contador "x/N" de posición.
11. ~~**`SiteFooter`**~~ — confirmado: es el mismo componente, con el mismo contenido, en Home, Catálogo y Detalle.
12. ~~**Clustering de pines en `ResultsMap`**~~ — confirmado: se mantiene un pin por alojamiento sin agrupación para esta versión. `@googlemaps/markerclusterer` queda fuera de alcance, solo como posible mejora futura.
13. ~~**Reubicación de `ListingCard`/`ListingCarousel`**~~ — confirmado y aplicado en este documento: ambos viven en `components/listing/` (compartidos entre Home y Catálogo), ya no en `components/home/`.
