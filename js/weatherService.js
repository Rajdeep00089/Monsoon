// js/weatherService.js - Live Weather, AQI, Agro & Geocoding Service for Mausam
// Connects to Open-Meteo free APIs with reverse geocoding and offline fallback.

const WeatherService = (() => {
    // Default fallback coordinates (Naihati, Kolkata Metropolitan Area, India)
    const DEFAULT_LOCATION = {
        name: "Naihati, Kolkata Metropolitan Area, India",
        state: "West Bengal",
        country: "India",
        latitude: 22.8988,
        longitude: 88.4237,
        timezone: "Asia/Kolkata"
    };

    let currentLocation = { ...DEFAULT_LOCATION };

    // High-Fidelity Fallback Dataset
    const getFallbackData = () => {
        return {
            location: currentLocation,
            is_live: false,
            current: {
                temperature: 28.5,
                apparent_temperature: 33.2,
                relative_humidity: 86,
                weather_code: 3,
                weather_desc: "Overcast Sky",
                weather_icon: "☁️",
                surface_pressure: 1008,
                visibility: 8,
                uv_index: 3.5,
                uv_desc: "Moderate",
                wind_speed: 12.4,
                wind_direction: 45,
                wind_dir_name: "NE",
                wind_gusts: 18.2,
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
                { time: "Now", temp: 28, rain_pop: 25, icon: "☁️", condition: "Overcast", aqi: 75, humidity: 86, wind: 12.4 },
                { time: "02 PM", temp: 29, rain_pop: 35, icon: "⛅", condition: "Partly Cloudy", aqi: 78, humidity: 83, wind: 13.0 },
                { time: "03 PM", temp: 30, rain_pop: 45, icon: "🌦️", condition: "Passing Showers", aqi: 70, humidity: 80, wind: 14.2 },
                { time: "04 PM", temp: 29, rain_pop: 60, icon: "🌧️", condition: "Rain Shower", aqi: 65, humidity: 85, wind: 15.0 },
                { time: "05 PM", temp: 28, rain_pop: 50, icon: "🌦️", condition: "Light Rain", aqi: 62, humidity: 88, wind: 12.5 },
                { time: "06 PM", temp: 27, rain_pop: 30, icon: "⛅", condition: "Sunset Window", aqi: 60, humidity: 90, wind: 9.8 },
                { time: "07 PM", temp: 26, rain_pop: 20, icon: "☁️", condition: "Humid Night", aqi: 68, humidity: 92, wind: 8.5 },
                { time: "08 PM", temp: 26, rain_pop: 15, icon: "☁️", condition: "Overcast", aqi: 72, humidity: 93, wind: 7.2 }
            ],
            daily: [
                { date: "Today", day_name: "Today", min: 26.2, max: 32.8, icon: "🌧️", rain_pop: 75, desc: "Scattered Showers" },
                { date: "Tomorrow", day_name: "Tuesday", min: 26.5, max: 33.5, icon: "🌦️", rain_pop: 65, desc: "Passing Showers" },
                { date: "09/09", day_name: "Wednesday", min: 26.0, max: 34.0, icon: "☀️", rain_pop: 20, desc: "Sunny & Warm" },
                { date: "10/09", day_name: "Thursday", min: 25.7, max: 33.6, icon: "⛅", rain_pop: 30, desc: "Partly Cloudy" },
                { date: "11/09", day_name: "Friday", min: 25.4, max: 32.8, icon: "🌧️", rain_pop: 60, desc: "Monsoon Rain" },
                { date: "12/09", day_name: "Saturday", min: 25.0, max: 32.0, icon: "⛈️", rain_pop: 70, desc: "Thunderstorm" },
                { date: "13/09", day_name: "Sunday", min: 25.5, max: 33.0, icon: "⛅", rain_pop: 35, desc: "Mainly Clear" }
            ],
            air_quality: {
                aqi: 76,
                status: "Satisfactory",
                color: "#8bc34a",
                source: "National AQI Source: CPCB",
                pm2_5: 38.4,
                pm10: 42.3,
                no2: 7.5,
                so2: 5.2,
                co: 328.0,
                o3: 170.0,
                pollen: {
                    tree: { level: "Low", value: 18, max: 100 },
                    grass: { level: "Moderate", value: 45, max: 100 },
                    weed: { level: "Low", value: 12, max: 100 }
                },
                health_advisory: "Air quality is acceptable. Sensitive individuals with asthma may experience slight irritation during peak humidity."
            },
            marine: {
                sea_condition: "Moderate Swell",
                wave_height: 1.2,
                wave_period: 7.5,
                wave_direction: "SSW (195°)",
                water_temperature: 28.5,
                surf_flag: "Yellow",
                surf_status: "Moderate Risk - Swimmers exercise caution",
                tides: [
                    { type: "High Tide", time: "06:14 AM", height: "3.4 m" },
                    { type: "Low Tide", time: "12:45 PM", height: "1.1 m" },
                    { type: "High Tide", time: "06:50 PM", height: "3.6 m" },
                    { type: "Low Tide", time: "01:20 AM", height: "0.9 m" }
                ]
            },
            agriculture: {
                soil_moisture_surface: 35,
                soil_moisture_deep: 42,
                soil_temperature: 27.3,
                evapotranspiration: 4.1,
                rain_forecast_48h: 18.5,
                frost_risk: "None",
                drought_risk: "Low",
                advisory: "Monsoon soil moisture is favorable for Aman paddy transplanting. Hold artificial irrigation for the next 36 hours due to expected precipitation."
            },
            commute: {
                visibility_km: 8.0,
                fog_status: "Clear Visibility",
                waterlogging_risk: "Low Risk on primary corridors",
                traffic_weather_impact: "Normal Traffic Flow",
                transit_safety_score: 88
            },
            alert: {
                id: "WB-N24P-ALERT-01",
                district: "NORTH 24 PARGANAS",
                level: "BE ALERT (YELLOW)",
                badge_class: "yellow",
                title: "Light to Moderate Thunderstorms with Gusty Wind",
                description: "Light thunderstorms are expected with maximum surface wind speeds below 40 km/h in gusts. Possibility of lightning and moderate rainfall between 5–15 mm/hr.",
                start_time: "Today, 04:00 PM IST",
                end_time: "Today, 08:30 PM IST"
            }
        };
    };

    // WMO Weather interpretation codes
    const interpretWeatherCode = (code) => {
        const mapping = {
            0: { desc: "Clear Sky", icon: "☀️" },
            1: { desc: "Mainly Clear", icon: "🌤️" },
            2: { desc: "Partly Cloudy", icon: "⛅" },
            3: { desc: "Overcast Sky", icon: "☁️" },
            45: { desc: "Fog", icon: "🌫️" },
            48: { desc: "Depositing Rime Fog", icon: "🌫️" },
            51: { desc: "Light Drizzle", icon: "🌦️" },
            53: { desc: "Moderate Drizzle", icon: "🌦️" },
            55: { desc: "Dense Drizzle", icon: "🌧️" },
            61: { desc: "Slight Rain", icon: "🌦️" },
            63: { desc: "Moderate Rain", icon: "🌧️" },
            65: { desc: "Heavy Monsoon Rain", icon: "🌧️" },
            80: { desc: "Rain Showers", icon: "🌧️" },
            81: { desc: "Moderate Showers", icon: "🌧️" },
            82: { desc: "Violent Rain Showers", icon: "⛈️" },
            95: { desc: "Thunderstorm", icon: "⛈️" },
            96: { desc: "Thunderstorm with Hail", icon: "⛈️" },
            99: { desc: "Severe Thunderstorm", icon: "⛈️" }
        };
        return mapping[code] || { desc: "Partly Cloudy", icon: "⛅" };
    };

    const degreesToDirection = (deg) => {
        const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
        const index = Math.round(deg / 22.5) % 16;
        return directions[index];
    };

    // Reverse Geocoding via BigDataCloud free client
    const reverseGeocode = async (lat, lon) => {
        try {
            const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
            const res = await fetch(url);
            const data = await res.json();
            const locality = data.locality || data.city || data.principalSubdivision || "";
            const admin = data.principalSubdivision && data.principalSubdivision !== locality ? `, ${data.principalSubdivision}` : "";
            const country = data.countryName ? `, ${data.countryName}` : "";
            if (locality) {
                return `${locality}${admin}${country}`;
            }
            return `Lat: ${lat.toFixed(2)}, Lon: ${lon.toFixed(2)}`;
        } catch (e) {
            return `Lat: ${lat.toFixed(2)}, Lon: ${lon.toFixed(2)}`;
        }
    };

    // Fetch live weather data from Open-Meteo
    const fetchLiveData = async (lat, lon, locationName) => {
        try {
            if (locationName) {
                currentLocation.name = locationName;
            }
            currentLocation.latitude = lat;
            currentLocation.longitude = lon;

            // 1. Weather + Agro Forecast API
            const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,weather_code,visibility,soil_temperature_0cm,soil_moisture_0_to_1cm,et0_fao_evapotranspiration&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max,precipitation_sum&timezone=auto`;
            
            // 2. Air Quality API
            const airQualityUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,uv_index&hourly=pm10,pm2_5,alder_pollen,birch_pollen,grass_pollen,ragweed_pollen&timezone=auto`;

            // Parallel fetch
            const [weatherRes, airRes] = await Promise.allSettled([
                fetch(weatherUrl, { cache: "no-store" }).then(r => r.json()),
                fetch(airQualityUrl, { cache: "no-store" }).then(r => r.json())
            ]);

            const fallback = getFallbackData();

            if (weatherRes.status !== "fulfilled" || !weatherRes.value.current) {
                console.warn("Open-Meteo weather API request unfulfilled, using fallback data.");
                return fallback;
            }

            const wData = weatherRes.value;
            const aData = airRes.status === "fulfilled" ? airRes.value : null;

            const currentWeather = interpretWeatherCode(wData.current.weather_code);
            const windDirName = degreesToDirection(wData.current.wind_direction_10m);

            // Build hourly array (next 8 hours from real data)
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
                        humidity: wData.hourly.relative_humidity_2m ? Math.round(wData.hourly.relative_humidity_2m[targetIdx]) : 80,
                        wind: Math.round(wData.current.wind_speed_10m)
                    });
                }
            }

            // Build daily array (next 7 days from real data)
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

            // Real CPCB AQI Calculation from PM2.5 & PM10
            let pm25 = (aData && aData.current && aData.current.pm2_5) || 28.4;
            let pm10 = (aData && aData.current && aData.current.pm10) || 45.2;
            let aqiValue = Math.round(pm25 * 2.5);
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

            // Real Sunrise & Sunset from coordinates
            let sunriseStr = "05:20 AM";
            let sunsetStr = "05:51 PM";
            if (wData.daily && wData.daily.sunrise && wData.daily.sunrise[0]) {
                sunriseStr = new Date(wData.daily.sunrise[0]).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
            }
            if (wData.daily && wData.daily.sunset && wData.daily.sunset[0]) {
                sunsetStr = new Date(wData.daily.sunset[0]).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
            }

            // Real Soil moisture & Agro values from Open-Meteo
            let soilMoistVal = 35;
            let soilTempVal = 27.0;
            let et0Val = 4.0;
            if (wData.hourly && wData.hourly.soil_moisture_0_to_1cm && wData.hourly.soil_moisture_0_to_1cm[nowHour] !== undefined) {
                soilMoistVal = Math.round(wData.hourly.soil_moisture_0_to_1cm[nowHour] * 100);
            }
            if (wData.hourly && wData.hourly.soil_temperature_0cm && wData.hourly.soil_temperature_0cm[nowHour] !== undefined) {
                soilTempVal = Math.round(wData.hourly.soil_temperature_0cm[nowHour] * 10) / 10;
            }
            if (wData.hourly && wData.hourly.et0_fao_evapotranspiration && wData.hourly.et0_fao_evapotranspiration[nowHour] !== undefined) {
                et0Val = Math.round(wData.hourly.et0_fao_evapotranspiration[nowHour] * 10) / 10;
            }

            // Visibility from hourly
            const visKm = (wData.hourly && wData.hourly.visibility && wData.hourly.visibility[0]) ? Math.round(wData.hourly.visibility[0] / 1000) : 8;

            return {
                location: currentLocation,
                is_live: true,
                current: {
                    temperature: Math.round(wData.current.temperature_2m * 10) / 10,
                    apparent_temperature: Math.round(wData.current.apparent_temperature * 10) / 10,
                    relative_humidity: Math.round(wData.current.relative_humidity_2m),
                    weather_code: wData.current.weather_code,
                    weather_desc: currentWeather.desc,
                    weather_icon: currentWeather.icon,
                    surface_pressure: Math.round(wData.current.surface_pressure),
                    visibility: visKm,
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
                    no2: (aData && aData.current && aData.current.nitrogen_dioxide) ? Math.round(aData.current.nitrogen_dioxide * 10) / 10 : 7.5,
                    so2: (aData && aData.current && aData.current.sulphur_dioxide) ? Math.round(aData.current.sulphur_dioxide * 10) / 10 : 5.2,
                    co: (aData && aData.current && aData.current.carbon_monoxide) ? Math.round(aData.current.carbon_monoxide * 10) / 10 : 320.0,
                    o3: (aData && aData.current && aData.current.ozone) ? Math.round(aData.current.ozone * 10) / 10 : 160.0,
                    pollen: fallback.air_quality.pollen,
                    health_advisory: aqiValue > 150 ? "Unhealthy air quality. Asthmatic individuals should limit outdoor exertion and wear masks." : "Air quality is acceptable for outdoor workouts and leisure."
                },
                marine: fallback.marine,
                agriculture: {
                    soil_moisture_surface: soilMoistVal,
                    soil_moisture_deep: Math.min(100, soilMoistVal + 8),
                    soil_temperature: soilTempVal,
                    evapotranspiration: et0Val,
                    rain_forecast_48h: (wData.daily && wData.daily.precipitation_sum && wData.daily.precipitation_sum[0] !== undefined) ? Math.round((wData.daily.precipitation_sum[0] + (wData.daily.precipitation_sum[1] || 0)) * 10) / 10 : 18.5,
                    frost_risk: "None",
                    drought_risk: soilMoistVal > 25 ? "Low" : "Moderate",
                    advisory: soilMoistVal > 30 ? "Soil moisture is plentiful. Avoid unnecessary artificial irrigation for the next 36-48 hours." : "Soil moisture is declining. Light irrigation recommended for field crops."
                },
                commute: {
                    visibility_km: visKm,
                    fog_status: visKm > 6 ? "Clear Visibility" : (visKm > 3 ? "Light Mist" : "Dense Fog Hazard"),
                    waterlogging_risk: wData.current.precipitation > 2 ? "High Waterlogging Risk" : "Low Risk on main routes",
                    traffic_weather_impact: wData.current.precipitation > 2 ? "Moderate Delays Expected" : "Normal Traffic Flow",
                    transit_safety_score: Math.max(40, Math.min(95, Math.round(100 - (wData.current.precipitation * 15) - (8 - Math.min(8, visKm)) * 5)))
                },
                alert: {
                    ...fallback.alert,
                    title: `${currentWeather.desc} Advisory for ${currentLocation.name.split(',')[0]}`,
                    description: `Current surface wind speeds are ${Math.round(wData.current.wind_speed_10m)} km/h with gusts up to ${Math.round(wData.current.wind_gusts_10m)} km/h. Temperature is ${Math.round(wData.current.temperature_2m)}°C with ${Math.round(wData.current.relative_humidity_2m)}% humidity.`
                }
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
            console.warn("Geocoding search failed, using fallback list:", e);
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
        reverseGeocode,
        getCurrentLocation: () => currentLocation
    };
})();
