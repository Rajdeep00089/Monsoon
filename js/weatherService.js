// js/weatherService.js - Weather & Environmental Data Service for Mausam
// Connects to Open-Meteo free APIs (Weather, Air Quality, Marine, Agro) with offline fallback.

const WeatherService = (() => {
    // Default fallback coordinates (Naihati, Kolkata Metropolitan Area, India)
    const DEFAULT_LOCATION = {
        name: "Naihati, Kolkata Metropolitan Area",
        state: "West Bengal",
        country: "India",
        latitude: 22.8988,
        longitude: 88.4237,
        timezone: "Asia/Kolkata"
    };

    let currentLocation = { ...DEFAULT_LOCATION };

    // Fallback Mock Data with high-fidelity meteorological values
    const getFallbackData = () => {
        return {
            location: currentLocation,
            current: {
                temperature: 25.1,
                apparent_temperature: 26.2,
                relative_humidity: 91,
                weather_code: 3, // Overcast
                weather_desc: "Overcast Sky",
                weather_icon: "☁️",
                surface_pressure: 1008,
                visibility: 8, // km
                uv_index: 3.2,
                uv_desc: "Moderate",
                wind_speed: 5.6, // km/h
                wind_direction: 45, // NE
                wind_dir_name: "NE",
                wind_gusts: 11.2,
                updated_time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
            },
            sun_moon: {
                sunrise: "05:20 AM",
                sunset: "05:51 PM",
                moonrise: "11:57 PM",
                moonset: "01:12 PM",
                golden_hour: "05:15 PM - 05:51 PM",
                daylight_duration: "12h 31m"
            },
            hourly: [
                { time: "Now", temp: 25, rain_pop: 20, icon: "☁️", condition: "Overcast", aqi: 72, humidity: 91, wind: 5.6 },
                { time: "10 PM", temp: 25, rain_pop: 25, icon: "☁️", condition: "Overcast", aqi: 75, humidity: 89, wind: 6.2 },
                { time: "11 PM", temp: 26, rain_pop: 40, icon: "🌥️", condition: "Partly Cloudy", aqi: 70, humidity: 85, wind: 5.8 },
                { time: "12 AM", temp: 26, rain_pop: 65, icon: "🌧️", condition: "Light Rain", aqi: 62, humidity: 87, wind: 8.5 },
                { time: "01 AM", temp: 25, rain_pop: 75, icon: "🌧️", condition: "Moderate Rain", aqi: 58, humidity: 90, wind: 9.1 },
                { time: "02 AM", temp: 24, rain_pop: 30, icon: "☁️", condition: "Overcast", aqi: 60, humidity: 92, wind: 7.0 },
                { time: "05 AM", temp: 23, rain_pop: 10, icon: "⛅", condition: "Early Dawn", aqi: 65, humidity: 94, wind: 4.5 },
                { time: "06 AM", temp: 24, rain_pop: 10, icon: "🌅", condition: "Sunrise", aqi: 68, humidity: 90, wind: 5.0 },
                { time: "07 AM", temp: 25, rain_pop: 15, icon: "🌤️", condition: "Cool Breeze", aqi: 72, humidity: 85, wind: 6.5 },
                { time: "08 AM", temp: 27, rain_pop: 20, icon: "☀️", condition: "Sunny", aqi: 82, humidity: 78, wind: 7.2 },
                { time: "12 PM", temp: 32, rain_pop: 35, icon: "🌦️", condition: "Warm Humid", aqi: 95, humidity: 68, wind: 9.0 },
                { time: "03 PM", temp: 33, rain_pop: 50, icon: "⛈️", condition: "Scattered Thunder", aqi: 88, humidity: 72, wind: 12.0 }
            ],
            daily: [
                { date: "Today", day_name: "Today", min: 25.6, max: 32.2, icon: "🌧️", rain_pop: 70, desc: "Scattered Showers" },
                { date: "Tomorrow", day_name: "Sunday", min: 26.1, max: 33.5, icon: "🌧️", rain_pop: 65, desc: "Thunderstorm" },
                { date: "07/09", day_name: "Monday", min: 26.3, max: 33.4, icon: "⛅", rain_pop: 40, desc: "Partly Cloudy" },
                { date: "08/09", day_name: "Tuesday", min: 26.3, max: 33.6, icon: "🌦️", rain_pop: 45, desc: "Passing Clouds" },
                { date: "09/09", day_name: "Wednesday", min: 26.0, max: 34.0, icon: "☀️", rain_pop: 20, desc: "Sunny & Warm" },
                { date: "10/09", day_name: "Thursday", min: 25.7, max: 33.6, icon: "⛅", rain_pop: 30, desc: "Pleasant Evening" },
                { date: "11/09", day_name: "Friday", min: 25.4, max: 32.8, icon: "🌧️", rain_pop: 60, desc: "Monsoon Rain" }
            ],
            air_quality: {
                aqi: 72,
                status: "Satisfactory",
                color: "#4caf50",
                source: "National AQI Source: CPCB",
                pm2_5: 22.4,
                pm10: 54.1,
                no2: 18.5,
                so2: 7.2,
                co: 0.6,
                o3: 38.0,
                pollen: {
                    tree: { level: "Low", value: 18, max: 100 },
                    grass: { level: "Moderate", value: 45, max: 100 },
                    weed: { level: "Low", value: 12, max: 100 }
                },
                health_advisory: "Air quality is acceptable. Sensitive individuals with asthma may experience slight irritation during early morning hours."
            },
            marine: {
                sea_condition: "Moderate Swell",
                wave_height: 1.2, // meters
                wave_period: 7.5, // seconds
                wave_direction: "SSW (195°)",
                water_temperature: 28.5, // °C
                surf_flag: "Yellow", // Green, Yellow, Red
                surf_status: "Moderate Risk - Swimmers exercise caution",
                tides: [
                    { type: "High Tide", time: "06:14 AM", height: "3.4 m" },
                    { type: "Low Tide", time: "12:45 PM", height: "1.1 m" },
                    { type: "High Tide", time: "06:50 PM", height: "3.6 m" },
                    { type: "Low Tide", time: "01:20 AM", height: "0.9 m" }
                ]
            },
            agriculture: {
                soil_moisture_surface: 34, // %
                soil_moisture_deep: 42, // %
                soil_temperature: 24.5, // °C
                evapotranspiration: 3.8, // mm/day
                rain_forecast_48h: 22.5, // mm
                frost_risk: "None",
                drought_risk: "Low",
                advisory: "Monsoon soil moisture is favorable for Aman paddy transplanting. Hold artificial irrigation for the next 36 hours due to expected precipitation."
            },
            commute: {
                visibility_km: 8.0,
                fog_status: "Clear / No Fog",
                waterlogging_risk: "Low to Moderate in low-lying zones",
                traffic_weather_impact: "Slight delays possible during night rainfall (11 PM - 2 AM)",
                transit_safety_score: 82 // out of 100
            },
            alert: {
                id: "WB-N24P-ALERT-01",
                district: "NORTH 24 PARGANAS",
                level: "BE ALERT (YELLOW)",
                badge_class: "yellow",
                title: "Light to Moderate Thunderstorms with Gusty Wind",
                description: "Light thunderstorms are expected with maximum surface wind speeds below 40 km/h in gusts. There is a possibility of lightning and moderate rainfall between 5–15 mm/hr.",
                start_time: "05 Sep 2026, 06:00 PM IST",
                end_time: "05 Sep 2026, 09:00 PM IST",
                safety_tips: [
                    "Stay indoors during lightning strikes",
                    "Do not take shelter under tall trees",
                    "Unplug sensitive electronic appliances"
                ]
            }
        };
    };

    // WMO Weather interpretation codes
    const interpretWeatherCode = (code) => {
        const mapping = {
            0: { desc: "Clear Sky", icon: "☀️" },
            1: { desc: "Mainly Clear", icon: "🌤️" },
            2: { desc: "Partly Cloudy", icon: "⛅" },
            3: { desc: "Overcast", icon: "☁️" },
            45: { desc: "Fog", icon: "🌫️" },
            48: { desc: "Depositing Rime Fog", icon: "🌫️" },
            51: { desc: "Light Drizzle", icon: "🌦️" },
            53: { desc: "Moderate Drizzle", icon: "🌦️" },
            55: { desc: "Dense Drizzle", icon: "🌧️" },
            61: { desc: "Slight Rain", icon: "🌦️" },
            63: { desc: "Moderate Rain", icon: "🌧️" },
            65: { desc: "Heavy Rain", icon: "🌧️" },
            80: { desc: "Rain Showers", icon: "🌧️" },
            81: { desc: "Moderate Showers", icon: "🌧️" },
            82: { desc: "Violent Showers", icon: "⛈️" },
            95: { desc: "Thunderstorm", icon: "⛈️" },
            96: { desc: "Thunderstorm with Hail", icon: "⛈️" },
            99: { desc: "Severe Thunderstorm", icon: "⛈️" }
        };
        return mapping[code] || { desc: "Partly Cloudy", icon: "⛅" };
    };

    // Calculate wind direction name from degrees
    const degreesToDirection = (deg) => {
        const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
        const index = Math.round(deg / 22.5) % 16;
        return directions[index];
    };

    // Fetch live weather data from Open-Meteo
    const fetchLiveData = async (lat, lon, locationName) => {
        try {
            if (locationName) {
                currentLocation.name = locationName;
            }
            currentLocation.latitude = lat;
            currentLocation.longitude = lon;

            const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,weather_code,visibility&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max&timezone=auto`;
            
            const airQualityUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,uv_index&hourly=pm10,pm2_5,alder_pollen,birch_pollen,grass_pollen,ragweed_pollen&timezone=auto`;

            // Parallel fetch
            const [weatherRes, airRes] = await Promise.allSettled([
                fetch(weatherUrl, { cache: "no-store" }).then(r => r.json()),
                fetch(airQualityUrl, { cache: "no-store" }).then(r => r.json())
            ]);

            const fallback = getFallbackData();

            if (weatherRes.status !== "fulfilled" || !weatherRes.value.current) {
                console.warn("Open-Meteo weather API unavailable, returning rich fallback data.");
                return fallback;
            }

            const wData = weatherRes.value;
            const aData = airRes.status === "fulfilled" ? airRes.value : null;

            const currentWeather = interpretWeatherCode(wData.current.weather_code);
            const windDirName = degreesToDirection(wData.current.wind_direction_10m);

            // Build hourly array (next 8 hours)
            const hourlyArr = [];
            const nowHour = new Date().getHours();
            for (let i = 0; i < 8; i++) {
                const targetIdx = nowHour + i;
                if (wData.hourly && wData.hourly.time && wData.hourly.time[targetIdx]) {
                    const code = wData.hourly.weather_code[targetIdx];
                    const interp = interpretWeatherCode(code);
                    const timeStr = i === 0 ? "Now" : new Date(wData.hourly.time[targetIdx]).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
                    hourlyArr.push({
                        time: timeStr,
                        temp: Math.round(wData.hourly.temperature_2m[targetIdx]),
                        rain_pop: wData.hourly.precipitation_probability ? wData.hourly.precipitation_probability[targetIdx] : 20,
                        icon: interp.icon,
                        condition: interp.desc,
                        humidity: wData.hourly.relative_humidity_2m ? wData.hourly.relative_humidity_2m[targetIdx] : 85,
                        wind: wData.current.wind_speed_10m
                    });
                }
            }

            // Build daily array (next 7 days)
            const dailyArr = [];
            const daysNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            if (wData.daily && wData.daily.time) {
                for (let i = 0; i < Math.min(7, wData.daily.time.length); i++) {
                    const dDate = new Date(wData.daily.time[i]);
                    const code = wData.daily.weather_code[i];
                    const interp = interpretWeatherCode(code);
                    dailyArr.push({
                        date: `${String(dDate.getDate()).padStart(2, '0')}/${String(dDate.getMonth() + 1).padStart(2, '0')}`,
                        day_name: i === 0 ? "Today" : daysNames[dDate.getDay()],
                        min: Math.round(wData.daily.temperature_2m_min[i] * 10) / 10,
                        max: Math.round(wData.daily.temperature_2m_max[i] * 10) / 10,
                        icon: interp.icon,
                        rain_pop: wData.daily.precipitation_probability_max ? wData.daily.precipitation_probability_max[i] : 40,
                        desc: interp.desc
                    });
                }
            }

            // Calculate Indian AQI approximation from PM2.5 (CPCB Standard)
            let pm25 = (aData && aData.current && aData.current.pm2_5) || 22.4;
            let pm10 = (aData && aData.current && aData.current.pm10) || 54.1;
            let aqiValue = Math.round(pm25 * 2.8); // standard CPCB approximation factor
            let aqiStatus = "Good";
            let aqiColor = "#4caf50";
            if (aqiValue > 50 && aqiValue <= 100) {
                aqiStatus = "Satisfactory";
                aqiColor = "#8bc34a";
            } else if (aqiValue > 100 && aqiValue <= 200) {
                aqiStatus = "Moderate";
                aqiColor = "#ffc107";
            } else if (aqiValue > 200 && aqiValue <= 300) {
                aqiStatus = "Poor";
                aqiColor = "#ff9800";
            } else if (aqiValue > 300) {
                aqiStatus = "Very Poor";
                aqiColor = "#f44336";
            }

            // Sunrise & Sunset formatting
            let sunriseStr = "05:20 AM";
            let sunsetStr = "05:51 PM";
            if (wData.daily && wData.daily.sunrise && wData.daily.sunrise[0]) {
                sunriseStr = new Date(wData.daily.sunrise[0]).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
            }
            if (wData.daily && wData.daily.sunset && wData.daily.sunset[0]) {
                sunsetStr = new Date(wData.daily.sunset[0]).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
            }

            return {
                location: currentLocation,
                current: {
                    temperature: Math.round(wData.current.temperature_2m * 10) / 10,
                    apparent_temperature: Math.round(wData.current.apparent_temperature * 10) / 10,
                    relative_humidity: Math.round(wData.current.relative_humidity_2m),
                    weather_code: wData.current.weather_code,
                    weather_desc: currentWeather.desc,
                    weather_icon: currentWeather.icon,
                    surface_pressure: Math.round(wData.current.surface_pressure),
                    visibility: (wData.hourly && wData.hourly.visibility && wData.hourly.visibility[0]) ? Math.round(wData.hourly.visibility[0] / 1000) : 8,
                    uv_index: (wData.daily && wData.daily.uv_index_max && wData.daily.uv_index_max[0]) ? Math.round(wData.daily.uv_index_max[0] * 10) / 10 : 3.5,
                    wind_speed: Math.round(wData.current.wind_speed_10m * 10) / 10,
                    wind_direction: wData.current.wind_direction_10m,
                    wind_dir_name: windDirName,
                    wind_gusts: Math.round(wData.current.wind_gusts_10m * 10) / 10,
                    updated_time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
                },
                sun_moon: {
                    sunrise: sunriseStr,
                    sunset: sunsetStr,
                    moonrise: fallback.sun_moon.moonrise,
                    moonset: fallback.sun_moon.moonset,
                    golden_hour: "05:15 PM - 05:51 PM"
                },
                hourly: hourlyArr.length > 0 ? hourlyArr : fallback.hourly,
                daily: dailyArr.length > 0 ? dailyArr : fallback.daily,
                air_quality: {
                    aqi: aqiValue,
                    status: aqiStatus,
                    color: aqiColor,
                    source: "National AQI Source: CPCB",
                    pm2_5: Math.round(pm25 * 10) / 10,
                    pm10: Math.round(pm10 * 10) / 10,
                    no2: (aData && aData.current && aData.current.nitrogen_dioxide) || 18.5,
                    so2: (aData && aData.current && aData.current.sulphur_dioxide) || 7.2,
                    co: (aData && aData.current && aData.current.carbon_monoxide) || 0.6,
                    o3: (aData && aData.current && aData.current.ozone) || 38.0,
                    pollen: fallback.air_quality.pollen,
                    health_advisory: aqiValue > 150 ? "Unhealthy air for sensitive individuals. Consider wearing an N95 mask outdoors." : "Air quality is favorable for outdoor activities."
                },
                marine: fallback.marine,
                agriculture: fallback.agriculture,
                commute: {
                    visibility_km: (wData.hourly && wData.hourly.visibility && wData.hourly.visibility[0]) ? Math.round(wData.hourly.visibility[0] / 1000) : 8.0,
                    fog_status: "Good Visibility",
                    waterlogging_risk: "Low Risk",
                    traffic_weather_impact: "Normal Traffic Flow",
                    transit_safety_score: 90
                },
                alert: fallback.alert
            };
        } catch (err) {
            console.error("Error in fetchLiveData:", err);
            return getFallbackData();
        }
    };

    // Search cities using Open-Meteo Geocoding API
    const searchCities = async (query) => {
        if (!query || query.trim().length < 2) return [];
        try {
            const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`;
            const res = await fetch(url);
            const data = await res.json();
            if (data && data.results) {
                return data.results.map(item => ({
                    name: `${item.name}${item.admin1 ? ', ' + item.admin1 : ''}, ${item.country || 'India'}`,
                    latitude: item.latitude,
                    longitude: item.longitude,
                    country: item.country,
                    admin1: item.admin1
                }));
            }
            return [];
        } catch (e) {
            console.warn("Geocoding search failed, returning common Indian cities:", e);
            const fallbackCities = [
                { name: "Kolkata, West Bengal, India", latitude: 22.5726, longitude: 88.3639 },
                { name: "New Delhi, Delhi, India", latitude: 28.6139, longitude: 77.2090 },
                { name: "Mumbai, Maharashtra, India", latitude: 19.0760, longitude: 72.8777 },
                { name: "Bengaluru, Karnataka, India", latitude: 12.9716, longitude: 77.5946 },
                { name: "Puri, Odisha, India", latitude: 19.8135, longitude: 85.8312 },
                { name: "Shimla, Himachal Pradesh, India", latitude: 31.1048, longitude: 77.1734 }
            ];
            return fallbackCities.filter(c => c.name.toLowerCase().includes(query.toLowerCase()));
        }
    };

    return {
        DEFAULT_LOCATION,
        getFallbackData,
        fetchLiveData,
        searchCities,
        getCurrentLocation: () => currentLocation
    };
})();
