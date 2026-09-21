import React from 'react';
import { AlertCircle, RotateCcw, MapPin, Search } from 'lucide-react';
import { GeoLocation } from '../types';

interface ErrorMessageProps {
  message?: string;
  onRetry?: () => void;
  onSelectFallbackCity?: (city: GeoLocation) => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message = 'City not found. Please check spelling or try another location.',
  onRetry,
  onSelectFallbackCity,
}) => {
  const fallbackCities: GeoLocation[] = [
    { id: 1, name: 'London', country: 'United Kingdom', latitude: 51.5074, longitude: -0.1278, admin1: 'England' },
    { id: 2, name: 'Chennai', country: 'India', latitude: 13.0827, longitude: 80.2707, admin1: 'Tamil Nadu' },
    { id: 3, name: 'Tokyo', country: 'Japan', latitude: 35.6895, longitude: 139.6917, admin1: 'Tokyo' },
  ];

  return (
    <div
      id="weather-error-banner"
      className="w-full bg-white border border-rose-200 rounded-3xl p-6 sm:p-8 shadow-xs text-center max-w-2xl mx-auto my-6 animate-in fade-in duration-200"
    >
      <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4 border border-rose-100">
        <AlertCircle className="w-7 h-7 stroke-[2]" />
      </div>

      <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
        Location Lookup Unsuccessful
      </h3>

      <p className="mt-2 text-sm sm:text-base text-rose-700 font-medium">
        {message}
      </p>

      <p className="mt-1 text-xs text-slate-500">
        Ensure proper spelling, enter a major city name, or select one of our verified locations below.
      </p>

      {/* Action buttons */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold transition-colors cursor-pointer shadow-xs"
          >
            <RotateCcw className="w-4 h-4" />
            Try Again
          </button>
        )}

        {onSelectFallbackCity && (
          <div className="flex flex-wrap items-center gap-2">
            {fallbackCities.map((city) => (
              <button
                key={city.name}
                type="button"
                onClick={() => onSelectFallbackCity(city)}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs sm:text-sm font-medium transition-colors cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                {city.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
