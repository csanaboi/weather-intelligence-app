import React from 'react';
import { Droplets, Wind, ArrowUp, ArrowDown } from 'lucide-react';
import { DailyForecastItem, TempUnit } from '../types';
import { WeatherIcon } from './WeatherIcon';
import { getWeatherConditionInfo, formatTemp } from '../utils/weatherUtils';

interface ForecastGridProps {
  daily: DailyForecastItem[];
  unit: TempUnit;
}

export const ForecastGrid: React.FC<ForecastGridProps> = ({ daily, unit }) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
            7-Day Meteorological Forecast
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            Daily temperature swings, weather conditions, and expected precipitation
          </p>
        </div>
      </div>

      {/* Responsive Horizontal Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-3.5">
        {daily.map((item, index) => {
          const condition = getWeatherConditionInfo(item.weatherCode, true);
          const isToday = index === 0;

          return (
            <div
              key={item.date}
              id={`forecast-card-${index}`}
              className={`flex flex-col justify-between p-4 rounded-2xl border transition-all duration-200 hover:shadow-md ${
                isToday
                  ? 'bg-sky-50/60 border-sky-300 ring-1 ring-sky-200 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Day & Date Header */}
              <div className="text-center pb-2 border-b border-slate-100">
                <div className="flex items-center justify-center gap-1.5">
                  <span className={`text-sm font-bold ${isToday ? 'text-sky-700' : 'text-slate-800'}`}>
                    {item.dayName}
                  </span>
                  {isToday && (
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
                  )}
                </div>
                <div className="text-[11px] font-medium text-slate-400 mt-0.5">
                  {item.formattedDate}
                </div>
              </div>

              {/* Weather Icon & Condition */}
              <div className="my-3 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-sky-600 mb-1.5 group-hover:scale-105 transition-transform">
                  <WeatherIcon name={condition.iconName} className="w-6 h-6 stroke-[2]" />
                </div>
                <span className="text-xs font-semibold text-slate-700 line-clamp-1" title={item.weatherDescription}>
                  {item.weatherDescription}
                </span>
              </div>

              {/* High / Low Temperature Badges */}
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs font-bold mb-2">
                  <span className="flex items-center text-amber-700">
                    <ArrowUp className="w-3 h-3 text-amber-500 mr-0.5" />
                    {formatTemp(item.tempMax, unit)}
                  </span>
                  <span className="flex items-center text-slate-500 font-medium">
                    <ArrowDown className="w-3 h-3 text-sky-500 mr-0.5" />
                    {formatTemp(item.tempMin, unit)}
                  </span>
                </div>

                {/* Additional metrics: Precipitation & Wind */}
                <div className="space-y-1 text-[11px]">
                  <div
                    className={`flex items-center justify-between px-2 py-0.5 rounded-md ${
                      item.precipitationSum > 0
                        ? 'bg-sky-100/70 text-sky-800 font-semibold'
                        : 'bg-slate-100/60 text-slate-500'
                    }`}
                  >
                    <span className="flex items-center gap-1">
                      <Droplets className="w-3 h-3 text-sky-500" />
                      Precip
                    </span>
                    <span>{item.precipitationSum} mm</span>
                  </div>

                  <div className="flex items-center justify-between px-2 py-0.5 rounded-md bg-slate-100/60 text-slate-600">
                    <span className="flex items-center gap-1">
                      <Wind className="w-3 h-3 text-slate-400" />
                      Wind
                    </span>
                    <span>{item.windspeedMax} km/h</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
