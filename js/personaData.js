// js/personaData.js - Persona Algorithms, Intelligence Engine & Bilingual Dictionary for SIH 2026

const PersonaEngine = (() => {
    // 8 Persona Definitions strictly based on PSID: 26076
    const PERSONAS = [
        { id: "all", name: "All-in-One", name_hi: "समग्र दृश्य", icon: "🌟", desc: "Comprehensive weather summary for everyday citizens" },
        { id: "health", name: "Health & Allergy", name_hi: "स्वास्थ्य एवं एलर्जी", icon: "🩺", desc: "AQI, pollen, UV index, asthma warnings & pollutant metrics" },
        { id: "fitness", name: "Outdoor Fitness", name_hi: "आउटडोर फिटनेस", icon: "🏃", desc: "Best running hours, heat exhaustion alerts & workout conditions" },
        { id: "beach", name: "Beach & Surfing", name_hi: "समुद्र तट और सर्फिंग", icon: "🏖️", desc: "Tide timings, wave heights, water temp & surf safety flags" },
        { id: "traveler", name: "Traveler & Trips", name_hi: "यात्री और पर्यटन", icon: "✈️", desc: "Saved destinations, flight alerts & automated smart packing" },
        { id: "family", name: "Parents & Family", name_hi: "माता-पिता और परिवार", icon: "🎒", desc: "School commute forecast, rain alerts & playground safety" },
        { id: "agriculture", name: "Kisan / Agriculture", name_hi: "किसान / कृषि मौसम", icon: "🌾", desc: "Soil moisture, 14-day rainfall outlook & IMD Agromet advisory" },
        { id: "commuter", name: "Daily Commuter", name_hi: "दैनिक यात्री", icon: "🚗", desc: "Fog visibility, road waterlogging risk & traffic weather impact" },
        { id: "event", name: "Event Planner", name_hi: "कार्यक्रम योजनाकार", icon: "🎪", desc: "Outdoor comfort index, rain probability & wedding time finder" }
    ];

    // Bilingual Dictionary (English & Hindi)
    const TRANSLATIONS = {
        en: {
            app_title: "Mausam",
            app_tagline: "Your daily weather companion",
            current_weather: "CURRENT WEATHER",
            feels_like: "Feels like",
            updated: "Updated",
            humidity: "Humidity",
            visibility: "Visibility",
            pressure: "Pressure",
            uv_index: "UV Index",
            wind: "Wind",
            air_quality: "Air Quality",
            hourly_forecast: "Hourly Forecast",
            weekly_forecast: "7-Day Forecast",
            sun: "Sun",
            moon: "Moon",
            listen_bulletin: "Listen Bulletin",
            speaking: "Speaking...",
            mobile_view: "Mobile App View",
            desktop_view: "Dashboard View",
            search_placeholder: "Search city or district...",
            best_running_hours: "Best Running & Workout Hours",
            running_score: "Running Score",
            optimal: "Optimal",
            moderate: "Moderate",
            avoid: "Avoid",
            tides_and_waves: "Sea Conditions & Tide Timings",
            high_tide: "High Tide",
            low_tide: "Low Tide",
            wave_swell: "Wave Swell",
            water_temp: "Water Temp",
            smart_packing: "Smart Packing Suggestions",
            school_commute: "School Commute Outlook",
            morning_commute: "Morning Drop-off (7:00 - 8:30 AM)",
            afternoon_commute: "Afternoon Pickup (1:30 - 3:30 PM)",
            kisan_advisory: "Kisan Soil & Agromet Advisory",
            soil_moisture: "Soil Moisture",
            commute_impact: "Commuter & Traffic Impact",
            comfort_index: "Outdoor Comfort Index",
            rain_probability: "Rain Probability",
            alert_title: "WEATHER ALERT",
            stay_safe: "Stay Safe — Be Alert"
        },
        hi: {
            app_title: "मौसम",
            app_tagline: "आपका दैनिक मौसम साथी",
            current_weather: "वर्तमान मौसम",
            feels_like: "महसूस होता है",
            updated: "अद्यतन",
            humidity: "आर्द्रता",
            visibility: "दृश्यता",
            pressure: "वायुदाब",
            uv_index: "यूवी सूचकांक",
            wind: "हवा की गति",
            air_quality: "वायु गुणवत्ता (AQI)",
            hourly_forecast: "प्रति घंटा पूर्वानुमान",
            weekly_forecast: "7-दिवसीय पूर्वानुमान",
            sun: "सूर्य चक्र",
            moon: "चंद्र चक्र",
            listen_bulletin: "मौसम बुलेटिन सुनें",
            speaking: "बोल रहा है...",
            mobile_view: "मोबाइल व्यू",
            desktop_view: "डैशबोर्ड व्यू",
            search_placeholder: "शहर या ज़िला खोजें...",
            best_running_hours: "दौड़ने और व्यायाम के सर्वोत्तम घंटे",
            running_score: "फिटनेस स्कोर",
            optimal: "उत्कृष्ट",
            moderate: "सामान्य",
            avoid: "परहेज करें",
            tides_and_waves: "समुद्री स्थिति और ज्वार का समय",
            high_tide: "ज्वार (High Tide)",
            low_tide: "भाटा (Low Tide)",
            wave_swell: "लहरों की ऊंचाई",
            water_temp: "पानी का तापमान",
            smart_packing: "यात्रा पैकिंग सुझाव",
            school_commute: "स्कूल आवागमन स्थिति",
            morning_commute: "सुबह स्कूल समय (7:00 - 8:30 AM)",
            afternoon_commute: "दोपहर वापसी समय (1:30 - 3:30 PM)",
            kisan_advisory: "किसान मिट्टी एवं कृषि परामर्श",
            soil_moisture: "मिट्टी में नमी",
            commute_impact: "यातायात एवं सड़क स्थिति",
            comfort_index: "आउटडोर अनुकूलता सूचकांक",
            rain_probability: "बारिश की संभावना",
            alert_title: "मौसम चेतावनी",
            stay_safe: "सुरक्षित रहें — सतर्क रहें"
        }
    };

    let currentLang = "en";

    // Algorithm 1: Calculate Best Running & Workout Hours
    const calculateBestRunningHours = (hourly) => {
        return hourly.map(item => {
            let score = 100;
            // Temperature penalty (Ideal 18-24°C)
            if (item.temp < 15) score -= (15 - item.temp) * 3;
            else if (item.temp > 24) score -= (item.temp - 24) * 4.5;

            // Humidity penalty (Ideal < 65%)
            if (item.humidity > 65) score -= (item.humidity - 65) * 0.5;

            // Rain probability penalty
            if (item.rain_pop > 30) score -= (item.rain_pop - 30) * 0.7;

            // AQI penalty (Ideal < 80)
            if (item.aqi > 80) score -= (item.aqi - 80) * 0.4;

            score = Math.max(10, Math.min(98, Math.round(score)));

            let category = "Optimal";
            let color = "#4caf50";
            if (score < 50) {
                category = "Avoid";
                color = "#f44336";
            } else if (score < 75) {
                category = "Moderate";
                color = "#ff9800";
            }

            return {
                time: item.time,
                temp: item.temp,
                rain_pop: item.rain_pop,
                humidity: item.humidity,
                score: score,
                category: category,
                color: color,
                icon: item.icon
            };
        });
    };

    // Algorithm 2: Calculate Outdoor Comfort Index (0 - 100) for Event Planners
    const calculateComfortIndex = (temp, humidity, wind) => {
        // Discomfort formula inspired by Thom's discomfort index
        const di = temp - (0.55 - 0.0055 * humidity) * (temp - 14.5);
        let comfortScore = 100 - Math.abs(di - 21) * 7.5;
        comfortScore = Math.max(15, Math.min(96, Math.round(comfortScore)));

        let label = "Pleasant & Comfortable";
        let color = "#4caf50";
        if (comfortScore < 45) {
            label = "Sweltering / High Humidity Discomfort";
            color = "#f44336";
        } else if (comfortScore < 70) {
            label = "Moderately Warm / Fair for Outdoor Gatherings";
            color = "#ff9800";
        }

        return {
            score: comfortScore,
            label: label,
            color: color,
            wedding_recommendation: comfortScore >= 70 ? "Excellent window for outdoor wedding ceremonies & banquets." : "Consider air-cooled tents or shaded arrangements for guests."
        };
    };

    // Algorithm 3: Smart Packing Suggestions for Travelers
    const generatePackingSuggestions = (daily, current) => {
        const items = [];
        let hasRain = daily.some(d => d.rain_pop >= 50);
        let maxTemp = Math.max(...daily.map(d => d.max));
        let minTemp = Math.min(...daily.map(d => d.min));

        if (hasRain || current.relative_humidity > 80) {
            items.push({ icon: "☂️", title: "Compact Umbrella & Waterproof Jacket", reason: "Rain probability exceeds 60% over the next 48h" });
            items.push({ icon: "👟", title: "Water-resistant Footwear", reason: "Prevent damp feet during wet street commutes" });
        }
        if (maxTemp > 30) {
            items.push({ icon: "👕", title: "Breathable Cotton Attire", reason: `Highs reaching ${maxTemp}°C with elevated humidity` });
            items.push({ icon: "🧴", title: "SPF 50+ Sunscreen & Sunglasses", reason: "High UV radiation during mid-day hours" });
        }
        if (minTemp < 18) {
            items.push({ icon: "🧥", title: "Light Fleece or Shawl", reason: `Evenings cool down to ${minTemp}°C` });
        }
        items.push({ icon: "💧", title: "Reusable Water Bottle", reason: "Stay hydrated in humid monsoon conditions" });
        items.push({ icon: "🔋", title: "Power Bank & Sealed Gadget Pouch", reason: "Safeguard electronics from sudden downpours" });

        return items;
    };

    // Algorithm 4: Commute Impact & Road Waterlogging Score
    const calculateCommuteImpact = (visibilityKm, rainPop) => {
        let impactScore = "Normal";
        let waterloggingRisk = "Low";
        let color = "#4caf50";

        if (rainPop >= 60 || visibilityKm < 3) {
            impactScore = "Moderate Traffic Delays";
            waterloggingRisk = "Moderate Risk in underpasses & low-lying roads";
            color = "#ff9800";
        }
        if (rainPop >= 80 && visibilityKm < 2) {
            impactScore = "Heavy Disruption Risk";
            waterloggingRisk = "High Risk of localized flooding & traffic snarls";
            color = "#f44336";
        }

        return {
            visibility: `${visibilityKm} km`,
            fog_label: visibilityKm > 6 ? "Clear Visibility" : (visibilityKm > 3 ? "Light Mist / Haze" : "Dense Fog Warning"),
            waterlogging_risk: waterloggingRisk,
            traffic_impact: impactScore,
            status_color: color
        };
    };

    // Algorithm 5: Agromet & Kisan Advice
    const calculateAgroAdvisory = (soilMoisture, rain48h) => {
        let irrigation = "Postpone Irrigation";
        let reason = "Sufficient soil moisture & rain anticipated";
        let statusColor = "#4caf50";

        if (soilMoisture < 25 && rain48h < 5) {
            irrigation = "Apply Light Irrigation";
            reason = "Topsoil drying out; critical for nursery crops";
            statusColor = "#ff9800";
        }

        return {
            soil_moisture: `${soilMoisture}%`,
            soil_status: soilMoisture > 30 ? "Well Hydrated (Monsoon Phase)" : "Moderately Moist",
            irrigation_advice: irrigation,
            reason: reason,
            pest_warning: "High humidity may trigger fungal blast in rice. Inspect field bunds.",
            color: statusColor
        };
    };

    return {
        PERSONAS,
        TRANSLATIONS,
        getLang: () => currentLang,
        setLang: (lang) => { currentLang = lang; },
        calculateBestRunningHours,
        calculateComfortIndex,
        generatePackingSuggestions,
        calculateCommuteImpact,
        calculateAgroAdvisory
    };
})();
