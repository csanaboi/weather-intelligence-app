import React from 'react';
import { CloudSun, RotateCw, Sparkles } from 'lucide-react';
import { TempUnit } from '../types';

interface HeaderProps {
  unit: TempUnit;
  onToggleUnit: (unit: TempUnit) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  lastUpdated?: Date;
}

export const Header: React.FC<HeaderProps> = ({
  unit,
  onToggleUnit,
  onRefresh,
  isRefreshing,
  lastUpdated,
}) => {
  return (
    <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-sm">
            <CloudSun className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
                Weather Intelligence
              </h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-sky-50 text-sky-700 border border-sky-100">
                <Sparkles className="w-3 h-3 text-sky-500" />
                Live
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Open-Meteo Precision Forecasts & Planning Advisories
            </p>
          </div>
        </div>

        {/* Controls: Unit Toggle & Refresh */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Temperature Unit Switcher */}
          <div className="inline-flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button
              id="unit-celsius-btn"
              type="button"
              onClick={() => onToggleUnit('C')}
              className={`px-2.5 py-1 text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
                unit === 'C'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Display in Celsius"
            >
              °C
            </button>
            <button
              id="unit-fahrenheit-btn"
              type="button"
              onClick={() => onToggleUnit('F')}
              className={`px-2.5 py-1 text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
                unit === 'F'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Display in Fahrenheit"
            >
              °F
            </button>
          </div>

          {/* Refresh Button */}
          <button
            id="refresh-weather-btn"
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 active:bg-slate-100 transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
            title="Refresh current forecast"
          >
            <RotateCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-sky-600' : 'text-slate-500'}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>
    </header>
  );
};
