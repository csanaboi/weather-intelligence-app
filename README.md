# Weather Intelligence App

A responsive, single-page Weather Intelligence Dashboard built with React, Vite, Tailwind CSS, and Lucide React icons. Generated using Google AI Studio App Build and deployed to Cloudflare Pages.

## 🌟 Key Features
- **City Search & Geocoding:** Connects to Open-Meteo Geocoding API (`/v1/search`) to search global cities and resolve coordinates.
- **Current Weather Analytics:** Displays real-time temperature, wind speed, weather conditions, and date/time.
- **7-Day Weather Forecast:** Renders daily max/min temperatures, precipitation totals, and condition icons.
- **Interactive Visual Charts:** Displays temperature trend charts built with Recharts.
- **Smart Planning Recommendations:** Provides automated advisory rules (clothing, umbrella, sunscreen) based on dynamic weather criteria.
- **Error Handling:** Gracefully handles invalid city searches ("City not found...") and API network errors.

## 🚀 Deployment Pipeline

### 1. Generation in Google AI Studio
- Application scaffold and UI components generated in Google AI Studio App Build mode.
- Integrated Open-Meteo REST API endpoints without requiring private keys or GCP billing.

### 2. Direct GitHub Integration
- Code pushed directly from Google AI Studio into the GitHub repository (`weather-intelligence-app`).
- Maintained clean source tree containing React components, Vite configuration, and `package.json`.

### 3. Cloudflare Pages Deployment
- Connected repository to Cloudflare Pages via GitHub integration.
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Build Output Directory:** `dist`

## 🛠️ Local Development Setup

To run this project locally:

```bash
# Clone the repository
git clone [https://github.com/YOUR_USERNAME/weather-intelligence-app.git](https://github.com/YOUR_USERNAME/weather-intelligence-app.git)

# Navigate into project folder
cd weather-intelligence-app

# Install dependencies
npm install

# Start development server
npm run dev
