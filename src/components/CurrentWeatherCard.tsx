import React from 'react';
import {
  Wind,
  Droplets,
  Calendar,
  Compass,
  ArrowUp,
  ArrowDown,
  Clock,
  Sparkles,
  MapPin
} from 'lucide-react';
import { ProcessedWeatherData, TempUnit } from '../types';
import { WeatherIcon } from './WeatherIcon';
import { getWeatherConditionInfo, formatTemp, getWindDirection } from '../utils/weatherUtils';

interface CurrentWeatherCardProps {
  data: ProcessedWeatherData;
  unit: TempUnit;
}

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({ data, unit }) => {
  const { location, current, today } = data;
  const conditionInfo = getWeatherConditionInfo(current.weathercode, current.isDay);
  const windDir = getWindDirection(current.winddirection);

  // Format today's date
  const todayDateObj = new Date();
  const dateFormatted = todayDateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // Ambient themes based on condition
  const getThemeGradient = (theme: string, isDay: boolean) => {
    if (!isDay) {
      return 'from-slate-900 via-indigo-950 to-slate-900 text-white';
    }
    switch (theme) {
      case 'sunny':
        return 'from-amber-500 via-orange-500 to-sky-600 text-white';
      case 'rainy':
        return 'from-sky-700 via-blue-800 to-slate-800 text-white';
      case 'snowy':
        return 'from-sky-500 via-cyan-600 to-blue-700 text-white';
      case 'stormy':
        return 'from-indigo-900 via-purple-900 to-slate-900 text-white';
      case 'foggy':
        return 'from-slate-600 via-zinc-700 to-slate-800 text-white';
      default:
        return 'from-sky-600 via-blue-600 to-indigo-700 text-white';
    }
  };

  return (
    <div
      id="current-weather-card"
      className={`relative w-full rounded-3xl bg-gradient-to-br ${getThemeGradient(
        conditionInfo.theme,
        current.isDay
      )} p-6 sm:p-8 shadow-xl overflow-hidden`}
    >
      {/* Subtle ambient decorative circles */}
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-black/10 blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col justify-between gap-6">
        {/* Top bar: Location & Date */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold tracking-wide uppercase">
              <MapPin className="w-3.5 h-3.5" />
              {current.isDay ? 'Daytime' : 'Night'} Observation
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-2 flex items-baseline gap-2">
              <span>{location.name}</span>
              {location.country && (
                <span className="text-lg sm:text-2xl font-medium text-white/80">
                  {location.country}
                </span>
              )}
            </h2>
            {location.admin1 && (
              <p className="text-xs sm:text-sm text-white/80 font-medium">
                {location.admin1} • {location.latitude.toFixed(2)}°, {location.longitude.toFixed(2)}°
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 text-white/90 text-xs sm:text-sm font-medium bg-black/15 px-3.5 py-1.5 rounded-xl backdrop-blur-xs self-start">
            <Calendar className="w-4 h-4 text-white/80" />
            <span>{dateFormatted}</span>
          </div>
        </div>

        {/* Middle hero: Temperature & Condition Icon */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center pt-2 pb-2">
          {/* Main Temperature and Icon */}
          <div className="md:col-span-7 flex items-center gap-5 sm:gap-7">
            <div className="p-4 sm:p-5 rounded-2xl bg-white/15 backdrop-blur-md shadow-inner text-white flex items-center justify-center shrink-0">
              <WeatherIcon name={conditionInfo.iconName} className="w-14 h-14 sm:w-20 sm:h-20 stroke-[1.8]" />
            </div>

            <div>
              <div className="text-5xl sm:text-7xl font-extrabold tracking-tighter leading-none">
                {formatTemp(current.temperature, unit)}
              </div>
              <div className="text-lg sm:text-xl font-semibold text-white/95 mt-2 flex items-center gap-2">
                <span>{conditionInfo.description}</span>
              </div>
              {/* High / Low for Today */}
              <div className="flex items-center gap-3 mt-1.5 text-xs sm:text-sm font-medium text-white/85">
                <span className="flex items-center gap-0.5">
                  <ArrowUp className="w-3.5 h-3.5 text-amber-200" />
                  High: {formatTemp(today.tempMax, unit)}
                </span>
                <span>•</span>
                <span className="flex items-center gap-0.5">
                  <ArrowDown className="w-3.5 h-3.5 text-sky-200" />
                  Low: {formatTemp(today.tempMin, unit)}
                </span>
              </div>
            </div>
          </div>

          {/* Key Meteorological Metrics Grid */}
          <div className="md:col-span-5 grid grid-cols-2 gap-3">
            {/* Wind Speed */}
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
              <div className="flex items-center gap-2 text-white/75 text-xs font-semibold uppercase tracking-wider">
                <Wind className="w-4 h-4 text-white/90" />
                <span>Wind Speed</span>
              </div>
              <div className="mt-1 text-lg sm:text-xl font-bold">
                {current.windspeed} <span className="text-xs font-normal text-white/80">km/h</span>
              </div>
              <div className="text-xs text-white/70 flex items-center gap-1 mt-0.5">
                <Compass className="w-3 h-3" />
                <span>Direction: {windDir} ({current.winddirection}°)</span>
              </div>
            </div>

            {/* Precipitation Today */}
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
              <div className="flex items-center gap-2 text-white/75 text-xs font-semibold uppercase tracking-wider">
                <Droplets className="w-4 h-4 text-white/90" />
                <span>Precipitation</span>
              </div>
              <div className="mt-1 text-lg sm:text-xl font-bold">
                {today.precipitationSum} <span className="text-xs font-normal text-white/80">mm</span>
              </div>
              <div className="text-xs text-white/70 mt-0.5">
                {today.precipitationSum > 0 ? 'Accumulated today' : 'No rain recorded'}
              </div>
            </div>

            {/* Max Wind Gusts */}
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
              <div className="flex items-center gap-2 text-white/75 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-white/90" />
                <span>Peak Gusts</span>
              </div>
              <div className="mt-1 text-lg sm:text-xl font-bold">
                {today.windspeedMax} <span className="text-xs font-normal text-white/80">km/h</span>
              </div>
              <div className="text-xs text-white/70 mt-0.5">
                Daily peak velocity
              </div>
            </div>

            {/* Timestamp / Observation Mode */}
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
              <div className="flex items-center gap-2 text-white/75 text-xs font-semibold uppercase tracking-wider">
                <Clock className="w-4 h-4 text-white/90" />
                <span>Observed</span>
              </div>
              <div className="mt-1 text-lg sm:text-xl font-bold truncate">
                {current.time ? current.time.split('T')[1] || 'Real-time' : 'Real-time'}
              </div>
              <div className="text-xs text-white/70 mt-0.5">
                Local station data
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
