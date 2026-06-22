import { type Listing, type Room, type SearchFilters } from '@/types';

interface SearchParamsReader {
  get(key: string): string | null;
}

type SearchParamsLike = {
  get?: SearchParamsReader['get'];
  [key: string]: string | string[] | undefined | ((key: string) => string | null) | undefined;
};

type SearchFiltersSource = SearchParamsReader | SearchParamsLike | undefined;

function isRecordSearchParams(source: SearchFiltersSource): source is SearchParamsLike {
  return !!source && !('entries' in source) && !('forEach' in source);
}

export const DEFAULT_SEARCH_FILTERS: SearchFilters = {
  destination: '',
  checkIn: '',
  checkOut: '',
  guests: 1,
};

function readParam(source: SearchFiltersSource, key: string): string {
  if (!source) {
    return '';
  }

  if (typeof source.get === 'function') {
    return source.get(key) ?? '';
  }

  if (!isRecordSearchParams(source)) {
    return '';
  }

  const value = source[key];

  if (Array.isArray(value)) {
    return value[0] ?? '';
  }

  return typeof value === 'string' ? value : '';
}

export function parseSearchFilters(source?: SearchFiltersSource): SearchFilters {
  const guestsParam = Number.parseInt(readParam(source, 'guests'), 10);

  return {
    destination: readParam(source, 'destination'),
    checkIn: readParam(source, 'checkIn'),
    checkOut: readParam(source, 'checkOut'),
    guests: Number.isFinite(guestsParam) && guestsParam > 0 ? guestsParam : 1,
  };
}

export function buildSearchHref(pathname: string, filters: SearchFilters): string {
  const params = new URLSearchParams();
  const destination = filters.destination.trim();

  if (destination) {
    params.set('destination', destination);
  }

  if (filters.checkIn) {
    params.set('checkIn', filters.checkIn);
  }

  if (filters.checkOut) {
    params.set('checkOut', filters.checkOut);
  }

  if (filters.guests > 1) {
    params.set('guests', String(filters.guests));
  }

  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}

export function matchesDestination(listing: Listing, destination: string): boolean {
  const query = destination.trim().toLowerCase();

  if (!query) {
    return true;
  }

  return listing.title.toLowerCase().includes(query) || listing.location.toLowerCase().includes(query);
}

export function matchesGuests(room: Room, guests: number): boolean {
  return room.maxGuests >= guests;
}