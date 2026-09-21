import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { TrendingUp, Thermometer } from 'lucide-react';
import { DailyForecastItem, TempUnit } from '../types';
import { cToF } from '../utils/weatherUtils';

interface TemperatureChartProps {
  daily: DailyForecastItem[];
  unit: TempUnit;
}

export const TemperatureChart: React.FC<TemperatureChartProps> = ({ daily, unit }) => {
  const chartData = daily.map((item) => {
    const maxVal = unit === 'F' ? cToF(item.tempMax) : item.tempMax;
    const minVal = unit === 'F' ? cToF(item.tempMin) : item.tempMin;

    return {
      name: item.dayName,
      date: item.formattedDate,
      weather: item.weatherDescription,
      precipitation: item.precipitationSum,
      high: maxVal,
      low: minVal,
    };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/95 backdrop-blur-md text-white p-3.5 rounded-xl border border-slate-700 shadow-xl text-xs space-y-1.5 min-w-36">
          <div className="font-bold text-slate-100 border-b border-slate-800 pb-1 flex justify-between items-center">
            <span>{label}</span>
            <span className="text-slate-400 font-normal">{data.date}</span>
          </div>
          <div className="text-slate-300 font-medium">{data.weather}</div>
          <div className="flex items-center justify-between text-amber-300 pt-0.5">
            <span>High (Max):</span>
            <span className="font-bold">
              {data.high}°{unit}
            </span>
          </div>
          <div className="flex items-center justify-between text-sky-300">
            <span>Low (Min):</span>
            <span className="font-bold">
              {data.low}°{unit}
            </span>
          </div>
          {data.precipitation > 0 && (
            <div className="flex items-center justify-between text-cyan-200 border-t border-slate-800 pt-1">
              <span>Rain/Precip:</span>
              <span className="font-bold">{data.precipitation} mm</span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div id="temperature-trend-chart-card" className="w-full bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              7-Day Temperature Trend
            </h3>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
              <TrendingUp className="w-3.5 h-3.5" />
              High vs Low
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Visual comparative analysis of daytime highs and night lows (°{unit})
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 self-start sm:self-auto">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
            <span>Daily Max</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-sky-500 inline-block" />
            <span>Daily Min</span>
          </div>
        </div>
      </div>

      {/* Chart container */}
      <div className="w-full h-72 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 12, right: 16, left: -16, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="name"
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
              dy={6}
            />
            <YAxis
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}°`}
              domain={['auto', 'auto']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="high"
              name="Max Temp"
              stroke="#f97316"
              strokeWidth={3}
              dot={{ r: 4, fill: '#ea580c', strokeWidth: 2, stroke: '#ffffff' }}
              activeDot={{ r: 6, fill: '#ea580c', stroke: '#ffedd5', strokeWidth: 3 }}
            />
            <Line
              type="monotone"
              dataKey="low"
              name="Min Temp"
              stroke="#0284c7"
              strokeWidth={3}
              dot={{ r: 4, fill: '#0284c7', strokeWidth: 2, stroke: '#ffffff' }}
              activeDot={{ r: 6, fill: '#0284c7', stroke: '#e0f2fe', strokeWidth: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
