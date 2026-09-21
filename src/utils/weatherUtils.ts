import { SmartRecommendation, ProcessedWeatherData } from '../types';

export interface WeatherConditionInfo {
  description: string;
  iconName: string;
  theme: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'stormy' | 'foggy';
}

export function getWeatherConditionInfo(code: number, isDay: boolean = true): WeatherConditionInfo {
  switch (code) {
    case 0:
      return {
        description: 'Clear sky',
        iconName: isDay ? 'Sun' : 'Moon',
        theme: 'sunny',
      };
    case 1:
      return {
        description: 'Mainly clear',
        iconName: isDay ? 'SunMedium' : 'CloudMoon',
        theme: 'sunny',
      };
    case 2:
      return {
        description: 'Partly cloudy',
        iconName: isDay ? 'CloudSun' : 'CloudMoon',
        theme: 'cloudy',
      };
    case 3:
      return {
        description: 'Overcast',
        iconName: 'Cloud',
        theme: 'cloudy',
      };
    case 45:
      return {
        description: 'Fog',
        iconName: 'CloudFog',
        theme: 'foggy',
      };
    case 48:
      return {
        description: 'Depositing rime fog',
        iconName: 'CloudFog',
        theme: 'foggy',
      };
    case 51:
      return {
        description: 'Light drizzle',
        iconName: 'CloudDrizzle',
        theme: 'rainy',
      };
    case 53:
      return {
        description: 'Moderate drizzle',
        iconName: 'CloudDrizzle',
        theme: 'rainy',
      };
    case 55:
      return {
        description: 'Dense drizzle',
        iconName: 'CloudDrizzle',
        theme: 'rainy',
      };
    case 56:
    case 57:
      return {
        description: 'Freezing drizzle',
        iconName: 'CloudHail',
        theme: 'rainy',
      };
    case 61:
      return {
        description: 'Slight rain',
        iconName: 'CloudRain',
        theme: 'rainy',
      };
    case 63:
      return {
        description: 'Moderate rain',
        iconName: 'CloudRain',
        theme: 'rainy',
      };
    case 65:
      return {
        description: 'Heavy rain',
        iconName: 'CloudRain',
        theme: 'rainy',
      };
    case 66:
    case 67:
      return {
        description: 'Freezing rain',
        iconName: 'CloudHail',
        theme: 'rainy',
      };
    case 71:
      return {
        description: 'Slight snow fall',
        iconName: 'CloudSnow',
        theme: 'snowy',
      };
    case 73:
      return {
        description: 'Moderate snow fall',
        iconName: 'CloudSnow',
        theme: 'snowy',
      };
    case 75:
      return {
        description: 'Heavy snow fall',
        iconName: 'Snowflake',
        theme: 'snowy',
      };
    case 77:
      return {
        description: 'Snow grains',
        iconName: 'Snowflake',
        theme: 'snowy',
      };
    case 80:
      return {
        description: 'Slight rain showers',
        iconName: 'CloudRain',
        theme: 'rainy',
      };
    case 81:
      return {
        description: 'Moderate rain showers',
        iconName: 'CloudRain',
        theme: 'rainy',
      };
    case 82:
      return {
        description: 'Violent rain showers',
        iconName: 'CloudRain',
        theme: 'rainy',
      };
    case 85:
      return {
        description: 'Slight snow showers',
        iconName: 'CloudSnow',
        theme: 'snowy',
      };
    case 86:
      return {
        description: 'Heavy snow showers',
        iconName: 'Snowflake',
        theme: 'snowy',
      };
    case 95:
      return {
        description: 'Thunderstorm',
        iconName: 'CloudLightning',
        theme: 'stormy',
      };
    case 96:
    case 99:
      return {
        description: 'Thunderstorm with hail',
        iconName: 'CloudLightning',
        theme: 'stormy',
      };
    default:
      return {
        description: 'Variable weather',
        iconName: 'CloudSun',
        theme: 'cloudy',
      };
  }
}

export function cToF(c: number): number {
  return Math.round((c * 9) / 5 + 32);
}

export function formatTemp(celsius: number, unit: 'C' | 'F'): string {
  if (unit === 'F') {
    return `${cToF(celsius)}°F`;
  }
  return `${Math.round(celsius)}°C`;
}

export function getWindDirection(deg: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(deg / 22.5) % 16;
  return directions[index];
}

export function generateSmartRecommendations(weather: ProcessedWeatherData): SmartRecommendation[] {
  const recommendations: SmartRecommendation[] = [];
  const currentTemp = weather.current.temperature;
  const currentWind = weather.current.windspeed;
  const weatherCode = weather.current.weathercode;
  const todayPrecip = weather.today?.precipitationSum ?? 0;

  // 1. Precipitation & Rain Check
  const isRainyCode = [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99].includes(weatherCode);
  if (todayPrecip > 2 || isRainyCode) {
    if (todayPrecip > 10 || [65, 82, 95, 96, 99].includes(weatherCode)) {
      recommendations.push({
        id: 'precip-heavy',
        type: 'precipitation',
        title: 'Heavy Rain / Storm Alert',
        description: `Precipitation anticipated at ${todayPrecip.toFixed(1)} mm. Carry a sturdy umbrella and wear waterproof footwear.`,
        level: 'warning',
        icon: 'Umbrella',
      });
    } else {
      recommendations.push({
        id: 'precip-moderate',
        type: 'precipitation',
        title: 'Bring an Umbrella',
        description: `Showers or drizzle expected today (${todayPrecip.toFixed(1)} mm precipitation). Keep rain protection handy.`,
        level: 'advisory',
        icon: 'Umbrella',
      });
    }
  }

  // 2. Temperature Clothing Advice
  if (currentTemp < 0) {
    recommendations.push({
      id: 'temp-freezing',
      type: 'temperature',
      title: 'Freezing Conditions - Bundle Up',
      description: `Current temp is ${Math.round(currentTemp)}°C. Wear heavy winter thermal layers, gloves, and insulated outerwear.`,
      level: 'warning',
      icon: 'ThermometerSnowflake',
    });
  } else if (currentTemp < 15) {
    recommendations.push({
      id: 'temp-chilly',
      type: 'temperature',
      title: 'Wear Warm Clothing',
      description: `Brisk conditions at ${Math.round(currentTemp)}°C. A warm jacket, sweater, or fleece layer is recommended today.`,
      level: 'advisory',
      icon: 'Shirt',
    });
  } else if (currentTemp > 30) {
    recommendations.push({
      id: 'temp-hot',
      type: 'temperature',
      title: 'High Heat - Stay Hydrated',
      description: `Warm temperature at ${Math.round(currentTemp)}°C. Wear light, breathable fabrics and drink plenty of fluids throughout the day.`,
      level: 'advisory',
      icon: 'Sun',
    });
  } else {
    recommendations.push({
      id: 'temp-mild',
      type: 'temperature',
      title: 'Pleasant & Comfortable',
      description: `Mild and balanced temperature at ${Math.round(currentTemp)}°C. Standard comfortable casual wear is ideal.`,
      level: 'optimal',
      icon: 'Sparkles',
    });
  }

  // 3. Clear Sky / UV Exposure
  const isClearSky = [0, 1].includes(weatherCode) && weather.current.isDay;
  if (isClearSky) {
    recommendations.push({
      id: 'uv-sunscreen',
      type: 'uv',
      title: 'High UV / Clear Sky - Apply Sunscreen',
      description: 'Direct sun exposure with clear skies. Apply SPF 30+ sunscreen and wear sunglasses if spending time outdoors.',
      level: 'advisory',
      icon: 'SunDim',
    });
  }

  // 4. Wind Speed Advisory
  if (currentWind >= 35) {
    recommendations.push({
      id: 'wind-high',
      type: 'wind',
      title: 'High Wind Advisory',
      description: `Strong gusts reaching ${Math.round(currentWind)} km/h. Secure loose outdoor items and exercise caution while driving or cycling.`,
      level: 'warning',
      icon: 'Wind',
    });
  } else if (currentWind >= 20) {
    recommendations.push({
      id: 'wind-moderate',
      type: 'wind',
      title: 'Breezy Weather',
      description: `Moderate winds at ${Math.round(currentWind)} km/h. Good for ventilation, but light headwear might catch the breeze.`,
      level: 'info',
      icon: 'Wind',
    });
  }

  // 5. Visibility / Fog Check
  if ([45, 48].includes(weatherCode)) {
    recommendations.push({
      id: 'visibility-fog',
      type: 'visibility',
      title: 'Low Visibility - Drive with Caution',
      description: 'Dense fog present. Use low-beam fog lights and maintain safe traveling distance on roads.',
      level: 'warning',
      icon: 'EyeOff',
    });
  }

  // 6. Optimal Outdoor Window
  if (
    currentTemp >= 16 &&
    currentTemp <= 26 &&
    todayPrecip < 0.5 &&
    currentWind < 22 &&
    !isRainyCode &&
    ![45, 48].includes(weatherCode)
  ) {
    recommendations.push({
      id: 'outdoor-optimal',
      type: 'outdoor',
      title: 'Prime Outdoor Activity Window',
      description: 'Ideal atmospheric conditions for running, cycling, walks, or outdoor dining.',
      level: 'optimal',
      icon: 'Activity',
    });
  }

  return recommendations;
}
