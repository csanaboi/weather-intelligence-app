import React from 'react';
import {
  Sun,
  SunMedium,
  SunDim,
  Moon,
  Cloud,
  CloudSun,
  CloudMoon,
  CloudRain,
  CloudDrizzle,
  CloudHail,
  CloudSnow,
  Snowflake,
  CloudLightning,
  CloudFog,
  Wind,
  Umbrella,
  ThermometerSnowflake,
  Shirt,
  Activity,
  EyeOff,
  Sparkles,
  HelpCircle,
  LucideProps,
} from 'lucide-react';

interface WeatherIconProps extends LucideProps {
  name: string;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ name, ...props }) => {
  switch (name) {
    case 'Sun':
      return <Sun {...props} />;
    case 'SunMedium':
      return <SunMedium {...props} />;
    case 'SunDim':
      return <SunDim {...props} />;
    case 'Moon':
      return <Moon {...props} />;
    case 'Cloud':
      return <Cloud {...props} />;
    case 'CloudSun':
      return <CloudSun {...props} />;
    case 'CloudMoon':
      return <CloudMoon {...props} />;
    case 'CloudRain':
      return <CloudRain {...props} />;
    case 'CloudDrizzle':
      return <CloudDrizzle {...props} />;
    case 'CloudHail':
      return <CloudHail {...props} />;
    case 'CloudSnow':
      return <CloudSnow {...props} />;
    case 'Snowflake':
      return <Snowflake {...props} />;
    case 'CloudLightning':
      return <CloudLightning {...props} />;
    case 'CloudFog':
      return <CloudFog {...props} />;
    case 'Wind':
      return <Wind {...props} />;
    case 'Umbrella':
      return <Umbrella {...props} />;
    case 'ThermometerSnowflake':
      return <ThermometerSnowflake {...props} />;
    case 'Shirt':
      return <Shirt {...props} />;
    case 'Activity':
      return <Activity {...props} />;
    case 'EyeOff':
      return <EyeOff {...props} />;
    case 'Sparkles':
      return <Sparkles {...props} />;
    default:
      return <HelpCircle {...props} />;
  }
};
