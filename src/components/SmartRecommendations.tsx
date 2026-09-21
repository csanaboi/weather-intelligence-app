import React from 'react';
import { Lightbulb, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';
import { SmartRecommendation } from '../types';
import { WeatherIcon } from './WeatherIcon';

interface SmartRecommendationsProps {
  recommendations: SmartRecommendation[];
}

export const SmartRecommendations: React.FC<SmartRecommendationsProps> = ({ recommendations }) => {
  const getLevelStyles = (level: SmartRecommendation['level']) => {
    switch (level) {
      case 'warning':
        return {
          card: 'bg-amber-50/70 border-amber-200 text-amber-950',
          badge: 'bg-amber-100 text-amber-800 border-amber-300',
          iconBg: 'bg-amber-100 text-amber-700',
          label: 'Caution / Advisory',
        };
      case 'advisory':
        return {
          card: 'bg-sky-50/70 border-sky-200 text-sky-950',
          badge: 'bg-sky-100 text-sky-800 border-sky-300',
          iconBg: 'bg-sky-100 text-sky-700',
          label: 'Recommended',
        };
      case 'optimal':
        return {
          card: 'bg-emerald-50/70 border-emerald-200 text-emerald-950',
          badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          iconBg: 'bg-emerald-100 text-emerald-700',
          label: 'Optimal Condition',
        };
      case 'info':
      default:
        return {
          card: 'bg-slate-50 border-slate-200 text-slate-900',
          badge: 'bg-slate-100 text-slate-700 border-slate-300',
          iconBg: 'bg-slate-100 text-slate-600',
          label: 'Insight',
        };
    }
  };

  return (
    <div id="smart-planning-recommendations" className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Smart Planning Recommendations
            </h3>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
              <Lightbulb className="w-3.5 h-3.5 text-indigo-500" />
              Dynamic Advice
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Tailored apparel, activity, and safety suggestions calculated from active conditions
          </p>
        </div>
      </div>

      {recommendations.length === 0 ? (
        <div className="p-6 bg-white border border-slate-200 rounded-2xl text-center text-slate-500 text-sm">
          No special weather advisories currently active for this location. Conditions are standard.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendations.map((rec) => {
            const styles = getLevelStyles(rec.level);
            return (
              <div
                key={rec.id}
                id={`recommendation-${rec.id}`}
                className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 hover:shadow-xs flex flex-col justify-between ${styles.card}`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${styles.iconBg}`}>
                      <WeatherIcon name={rec.icon} className="w-5 h-5 stroke-[2.2]" />
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider border ${styles.badge}`}>
                      {styles.label}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 mb-1">
                    {rec.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {rec.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center gap-1.5 text-xs font-medium text-slate-500">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Real-time meteorological logic</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
