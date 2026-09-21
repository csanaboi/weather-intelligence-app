import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X, Loader2, Compass } from 'lucide-react';
import { GeoLocation } from '../types';
import { searchCities } from '../services/weatherApi';

interface SearchBarProps {
  onSelectCity: (city: GeoLocation) => void;
  isLoading: boolean;
  activeCityName?: string;
}

const POPULAR_LOCATIONS: { name: string; country: string; lat: number; lon: number; admin1?: string }[] = [
  { name: 'London', country: 'United Kingdom', lat: 51.5074, lon: -0.1278, admin1: 'England' },
  { name: 'Chennai', country: 'India', lat: 13.0827, lon: 80.2707, admin1: 'Tamil Nadu' },
  { name: 'Tokyo', country: 'Japan', lat: 35.6895, lon: 139.6917, admin1: 'Tokyo' },
  { name: 'New York', country: 'United States', lat: 40.7128, lon: -74.006, admin1: 'New York' },
  { name: 'Paris', country: 'France', lat: 48.8566, lon: 2.3522, admin1: 'Île-de-France' },
  { name: 'Sydney', country: 'Australia', lat: -33.8688, lon: 151.2093, admin1: 'New South Wales' },
];

export const SearchBar: React.FC<SearchBarProps> = ({
  onSelectCity,
  isLoading,
  activeCityName,
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<GeoLocation[]>([]);
  const [isSearchingSuggestions, setIsSearchingSuggestions] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Debounced auto-suggestions
  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      setIsSearchingSuggestions(false);
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const timer = setTimeout(async () => {
      setIsSearchingSuggestions(true);
      setSearchError(null);
      try {
        const results = await searchCities(query, controller.signal);
        setSuggestions(results);
        setIsOpen(true);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          setSuggestions([]);
          setSearchError('Search failed. Please try again.');
        }
      } finally {
        setIsSearchingSuggestions(false);
      }
    }, 280);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  // Handle outside click to close suggestions
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (item: GeoLocation) => {
    setQuery(`${item.name}${item.country ? `, ${item.country}` : ''}`);
    setIsOpen(false);
    onSelectCity(item);
  };

  const handleSelectPopular = (loc: typeof POPULAR_LOCATIONS[0]) => {
    setQuery(`${loc.name}, ${loc.country}`);
    setIsOpen(false);
    onSelectCity({
      id: Math.round(loc.lat * 1000 + loc.lon),
      name: loc.name,
      country: loc.country,
      latitude: loc.lat,
      longitude: loc.lon,
      admin1: loc.admin1,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    // If suggestions are currently visible and have results, select the first
    if (suggestions.length > 0) {
      handleSelect(suggestions[0]);
      return;
    }

    // Direct search submission
    setIsSearchingSuggestions(true);
    setSearchError(null);
    try {
      const results = await searchCities(query);
      if (results.length > 0) {
        handleSelect(results[0]);
      } else {
        setIsOpen(true);
        setSuggestions([]);
        setSearchError('No matching cities found.');
      }
    } catch (err) {
      setSearchError('City lookup failed. Please check connection.');
    } finally {
      setIsSearchingSuggestions(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
    setSearchError(null);
  };

  return (
    <div className="w-full" ref={containerRef}>
      {/* Search Input Container */}
      <form onSubmit={handleSubmit} className="relative w-full">
        <div className="relative flex items-center">
          <div className="absolute left-3.5 sm:left-4.5 pointer-events-none text-slate-400">
            {isSearchingSuggestions || isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-sky-600" />
            ) : (
              <Search className="w-5 h-5 text-slate-400" />
            )}
          </div>

          <input
            id="city-search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (suggestions.length > 0) setIsOpen(true);
            }}
            placeholder="Search city or location (e.g., London, Chennai, Tokyo)..."
            className="w-full pl-11 sm:pl-12 pr-28 sm:pr-32 py-3.5 sm:py-4 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 text-sm sm:text-base font-normal shadow-xs focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
            autoComplete="off"
          />

          <div className="absolute right-2 flex items-center gap-1.5">
            {query && (
              <button
                id="clear-search-btn"
                type="button"
                onClick={handleClear}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                title="Clear input"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <button
              id="submit-search-btn"
              type="submit"
              disabled={isLoading || !query.trim()}
              className="px-3.5 sm:px-4 py-2 bg-sky-600 hover:bg-sky-700 active:bg-sky-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-xs sm:text-sm rounded-xl transition-colors cursor-pointer shadow-xs"
            >
              Search
            </button>
          </div>
        </div>

        {/* Suggestions Dropdown */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-40 animate-in fade-in duration-150">
            {suggestions.length > 0 ? (
              <div className="py-2 divide-y divide-slate-100 max-h-72 overflow-y-auto">
                <div className="px-4 py-1.5 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Matching Locations
                </div>
                {suggestions.map((item) => (
                  <button
                    key={`${item.id}-${item.latitude}-${item.longitude}`}
                    type="button"
                    onClick={() => handleSelect(item)}
                    className="w-full text-left px-4 py-2.5 flex items-center gap-3 hover:bg-sky-50 transition-colors cursor-pointer group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-sky-100 flex items-center justify-center text-slate-500 group-hover:text-sky-600 transition-colors shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-slate-900 group-hover:text-sky-950 truncate">
                        {item.name}
                      </div>
                      <div className="text-xs text-slate-500 truncate">
                        {[item.admin1, item.country].filter(Boolean).join(', ')}
                        {item.elevation !== undefined && ` • ${item.elevation}m`}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : searchError ? (
              <div className="px-4 py-4 text-center text-sm text-amber-700 bg-amber-50">
                {searchError}
              </div>
            ) : query.trim().length >= 2 && !isSearchingSuggestions ? (
              <div className="px-4 py-4 text-center text-sm text-slate-500">
                No matching cities found. Check spelling or try a broader query.
              </div>
            ) : null}
          </div>
        )}
      </form>

      {/* Quick Location Chips */}
      <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
        <span className="text-slate-400 font-medium flex items-center gap-1 shrink-0">
          <Compass className="w-3.5 h-3.5" />
          Quick picks:
        </span>
        <div className="flex items-center gap-1.5 shrink-0">
          {POPULAR_LOCATIONS.map((loc) => {
            const isActive = activeCityName?.toLowerCase() === loc.name.toLowerCase();
            return (
              <button
                key={loc.name}
                id={`quick-pick-${loc.name.toLowerCase()}`}
                type="button"
                onClick={() => handleSelectPopular(loc)}
                className={`px-3 py-1 rounded-full font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {loc.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
