/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { CurrentWeatherCard } from './components/CurrentWeatherCard';
import { ForecastGrid } from './components/ForecastGrid';
import { TemperatureChart } from './components/TemperatureChart';
import { SmartRecommendations } from './components/SmartRecommendations';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { ErrorMessage } from './components/ErrorMessage';
import { GeoLocation, ProcessedWeatherData, TempUnit } from './types';
import { fetchWeatherForecast, WeatherApiError } from './services/weatherApi';
import { generateSmartRecommendations } from './utils/weatherUtils';

// Default initial city pre-loaded on startup (London)
const DEFAULT_CITY: GeoLocation = {
  id: 2643743,
  name: 'London',
  country: 'United Kingdom',
  latitude: 51.5085,
  longitude: -0.1257,
  admin1: 'England',
  country_code: 'GB',
};

export default function App() {
  const [currentCity, setCurrentCity] = useState<GeoLocation>(DEFAULT_CITY);
  const [weatherData, setWeatherData] = useState<ProcessedWeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [unit, setUnit] = useState<TempUnit>('C');

  // Load weather for a given location
  const loadWeather = useCallback(async (location: GeoLocation, isBackgroundRefresh = false) => {
    if (isBackgroundRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setErrorMessage(null);

    try {
      const data = await fetchWeatherForecast(location);
      setWeatherData(data);
      setCurrentCity(location);
    } catch (err: any) {
      if (err instanceof WeatherApiError) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('City not found. Please check spelling or try another location.');
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Pre-load default city on initial load
  useEffect(() => {
    loadWeather(DEFAULT_CITY);
  }, [loadWeather]);

  const handleSelectCity = (city: GeoLocation) => {
    loadWeather(city);
  };

  const handleRefresh = () => {
    if (currentCity) {
      loadWeather(currentCity, true);
    }
  };

  const smartRecommendations = weatherData ? generateSmartRecommendations(weatherData) : [];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Navigation & App Bar */}
      <Header
        unit={unit}
        onToggleUnit={setUnit}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        lastUpdated={weatherData?.fetchedAt}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* Search Bar Section */}
        <section aria-label="Location search" className="w-full max-w-3xl mx-auto">
          <SearchBar
            onSelectCity={handleSelectCity}
            isLoading={isLoading}
            activeCityName={currentCity.name}
          />
        </section>

        {/* Loading State */}
        {isLoading && !weatherData && <LoadingSkeleton />}

        {/* Error State */}
        {errorMessage && (
          <ErrorMessage
            message={errorMessage}
            onRetry={() => loadWeather(currentCity)}
            onSelectFallbackCity={handleSelectCity}
          />
        )}

        {/* Weather Intelligence Dashboard */}
        {weatherData && (
          <div className={`space-y-8 transition-opacity duration-300 ${isLoading ? 'opacity-60 pointer-events-none' : 'opacity-100'}`}>
            {/* 1. Hero Current Weather Card */}
            <section aria-label="Current conditions">
              <CurrentWeatherCard data={weatherData} unit={unit} />
            </section>

            {/* 2. Smart Planning Recommendations */}
            <section aria-label="Smart planning advisories">
              <SmartRecommendations recommendations={smartRecommendations} />
            </section>

            {/* 3. 7-Day Forecast Grid */}
            <section aria-label="7-Day weather projection">
              <ForecastGrid daily={weatherData.daily} unit={unit} />
            </section>

            {/* 4. Temperature Trend Visual Chart */}
            <section aria-label="Temperature trend visual chart">
              <TemperatureChart daily={weatherData.daily} unit={unit} />
            </section>
          </div>
        )}
      </main>

      {/* Global Footer */}
      <footer className="w-full bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            Weather Intelligence &copy; {new Date().getFullYear()} — Powered by Open-Meteo Geocoding & High-Resolution Forecast APIs.
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>No API key required</span>
            <span>•</span>
            <span>Real-time WMO Interpretation</span>
            <span>•</span>
            <span>WGS84 Coordinates</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
