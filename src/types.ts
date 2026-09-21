export interface GeoLocation {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  country_code?: string;
  country?: string;
  admin1?: string;
  timezone?: string;
}

export interface CurrentWeatherRaw {
  temperature: number;
  windspeed: number;
  winddirection: number;
  weathercode: number;
  is_day: number;
  time: string;
}

export interface DailyForecastRaw {
  time: string[];
  weathercode: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_sum: number[];
  windspeed_10m_max: number[];
}

export interface OpenMeteoForecastResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_weather: CurrentWeatherRaw;
  daily: DailyForecastRaw;
  daily_units?: {
    time: string;
    weathercode: string;
    temperature_2m_max: string;
    temperature_2m_min: string;
    precipitation_sum: string;
    windspeed_10m_max: string;
  };
}

export interface DailyForecastItem {
  date: string;
  dayName: string;
  formattedDate: string;
  weatherCode: number;
  weatherDescription: string;
  tempMax: number;
  tempMin: number;
  precipitationSum: number;
  windspeedMax: number;
}

export interface ProcessedWeatherData {
  location: GeoLocation;
  current: {
    temperature: number;
    windspeed: number;
    winddirection: number;
    weathercode: number;
    weatherDescription: string;
    isDay: boolean;
    time: string;
  };
  daily: DailyForecastItem[];
  today: DailyForecastItem;
  fetchedAt: Date;
}

export type RecommendationType = 'precipitation' | 'temperature' | 'uv' | 'wind' | 'outdoor' | 'visibility';

export interface SmartRecommendation {
  id: string;
  type: RecommendationType;
  title: string;
  description: string;
  level: 'info' | 'advisory' | 'warning' | 'optimal';
  icon: string;
}

export type TempUnit = 'C' | 'F';
