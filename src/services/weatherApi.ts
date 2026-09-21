import { GeoLocation, OpenMeteoForecastResponse, ProcessedWeatherData, DailyForecastItem } from '../types';
import { getWeatherConditionInfo } from '../utils/weatherUtils';

const GEOCODING_BASE_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_BASE_URL = 'https://api.open-meteo.com/v1/forecast';

export class WeatherApiError extends Error {
  constructor(message: string, public readonly code?: string) {
    super(message);
    this.name = 'WeatherApiError';
  }
}

/**
 * Searches cities using Open-Meteo Geocoding API
 */
export async function searchCities(query: string, signal?: AbortSignal): Promise<GeoLocation[]> {
  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 2) {
    return [];
  }

  const url = `${GEOCODING_BASE_URL}?name=${encodeURIComponent(trimmed)}&count=6&language=en&format=json`;

  try {
    const res = await fetch(url, { signal });
    if (!res.ok) {
      throw new WeatherApiError(`Geocoding request failed with status ${res.status}`);
    }

    const data = await res.json();
    if (!data.results || !Array.isArray(data.results) || data.results.length === 0) {
      return [];
    }

    return data.results.map((item: any) => ({
      id: item.id,
      name: item.name,
      latitude: item.latitude,
      longitude: item.longitude,
      elevation: item.elevation,
      country_code: item.country_code,
      country: item.country,
      admin1: item.admin1,
      timezone: item.timezone,
    }));
  } catch (err: any) {
    if (err.name === 'AbortError') {
      throw err;
    }
    throw new WeatherApiError(err.message || 'Failed to search cities');
  }
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * Fetches forecast data from Open-Meteo
 */
export async function fetchWeatherForecast(
  location: GeoLocation,
  signal?: AbortSignal
): Promise<ProcessedWeatherData> {
  const url = `${FORECAST_BASE_URL}?latitude=${location.latitude}&longitude=${location.longitude}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max&timezone=auto`;

  try {
    const res = await fetch(url, { signal });
    if (!res.ok) {
      throw new WeatherApiError(
        `Forecast service responded with status: ${res.status}. Please try again later.`
      );
    }

    const data: OpenMeteoForecastResponse = await res.json();

    if (!data.current_weather || !data.daily || !data.daily.time) {
      throw new WeatherApiError('Incomplete weather information received from service.');
    }

    const dailyItems: DailyForecastItem[] = data.daily.time.map((dateStr, index) => {
      // Parse YYYY-MM-DD
      const [year, month, day] = dateStr.split('-').map(Number);
      const dateObj = new Date(year, month - 1, day);
      const isToday = index === 0;

      const dayName = isToday ? 'Today' : DAY_NAMES[dateObj.getDay()];
      const formattedDate = `${MONTH_NAMES[month - 1]} ${day}`;
      const code = data.daily.weathercode[index] ?? 0;
      const cond = getWeatherConditionInfo(code, true);

      return {
        date: dateStr,
        dayName,
        formattedDate,
        weatherCode: code,
        weatherDescription: cond.description,
        tempMax: Math.round(data.daily.temperature_2m_max[index] ?? 0),
        tempMin: Math.round(data.daily.temperature_2m_min[index] ?? 0),
        precipitationSum: Number((data.daily.precipitation_sum[index] ?? 0).toFixed(1)),
        windspeedMax: Math.round(data.daily.windspeed_10m_max[index] ?? 0),
      };
    });

    const currentCondition = getWeatherConditionInfo(
      data.current_weather.weathercode,
      data.current_weather.is_day === 1
    );

    return {
      location,
      current: {
        temperature: Math.round(data.current_weather.temperature),
        windspeed: Math.round(data.current_weather.windspeed),
        winddirection: Math.round(data.current_weather.winddirection),
        weathercode: data.current_weather.weathercode,
        weatherDescription: currentCondition.description,
        isDay: data.current_weather.is_day === 1,
        time: data.current_weather.time,
      },
      daily: dailyItems,
      today: dailyItems[0] || {
        date: new Date().toISOString().split('T')[0],
        dayName: 'Today',
        formattedDate: 'Today',
        weatherCode: data.current_weather.weathercode,
        weatherDescription: currentCondition.description,
        tempMax: Math.round(data.current_weather.temperature),
        tempMin: Math.round(data.current_weather.temperature),
        precipitationSum: 0,
        windspeedMax: Math.round(data.current_weather.windspeed),
      },
      fetchedAt: new Date(),
    };
  } catch (err: any) {
    if (err.name === 'AbortError') {
      throw err;
    }
    throw new WeatherApiError(err.message || 'Unable to retrieve meteorological forecast data.');
  }
}
