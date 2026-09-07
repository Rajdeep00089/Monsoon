// js/script.js - Main Application Controller for Mausam (SIH 2026)

document.addEventListener("DOMContentLoaded", () => {
    let weatherData = WeatherService.getFallbackData();
    let currentPersona = "all";
    let isSpeaking = false;
    let isMobileSimulator = false;

    // DOM Elements
    const personaListEl = document.getElementById("personaList");
    const personaContentEl = document.getElementById("personaContent");
    const searchInput = document.getElementById("searchInput");
    const searchResults = document.getElementById("searchResults");
    const gpsBtn = document.getElementById("gpsBtn");
    const langToggleBtn = document.getElementById("langToggleBtn");
    const audioBtn = document.getElementById("audioBtn");
    const viewToggleBtn = document.getElementById("viewToggleBtn");
    const dashboardContainer = document.querySelector(".dashboard");

    // Initialize Application
    const init = async () => {
        renderPersonaTabs();
        await loadWeather(weatherData.location.latitude, weatherData.location.longitude, weatherData.location.name);
        setupEventListeners();
        animateEntrance();
    };

    // Load Weather Data
    const loadWeather = async (lat, lon, name) => {
        try {
            weatherData = await WeatherService.fetchLiveData(lat, lon, name);
            updateCoreWeatherUI();
            renderPersonaContent();
            updateWindNeedle();
        } catch (e) {
            console.error("Error loading weather:", e);
        }
    };

    // Render Persona Navigation Tabs
    const renderPersonaTabs = () => {
        if (!personaListEl) return;
        const lang = PersonaEngine.getLang();
        personaListEl.innerHTML = PersonaEngine.PERSONAS.map(p => `
            <button class="persona-tab ${p.id === currentPersona ? 'active' : ''}" data-id="${p.id}" title="${p.desc}">
                <span class="persona-icon">${p.icon}</span>
                <span class="persona-label">${lang === 'hi' ? p.name_hi : p.name}</span>
            </button>
        `).join("");

        // Tab click events
        document.querySelectorAll(".persona-tab").forEach(tab => {
            tab.addEventListener("click", () => {
                document.querySelectorAll(".persona-tab").forEach(t => t.classList.remove("active"));
                tab.classList.add("active");
                currentPersona = tab.getAttribute("data-id");
                renderPersonaContent();
            });
        });
    };

    // Update Core Weather Header & Cards
    const updateCoreWeatherUI = () => {
        const lang = PersonaEngine.getLang();
        const t = PersonaEngine.TRANSLATIONS[lang];
        const cur = weatherData.current;

        // Header location & date
        const locationTitle = document.getElementById("locationTitle");
        const locationDate = document.getElementById("locationDate");
        if (locationTitle) locationTitle.innerText = `📍 ${weatherData.location.name}`;
        if (locationDate) {
            const today = new Date();
            const dateStr = today.toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
            });
            locationDate.innerText = dateStr;
        }

        // Current weather elements
        const tempEl = document.getElementById("currentTemp");
        const condEl = document.getElementById("currentCondition");
        const feelsEl = document.getElementById("currentFeels");
        const updatedEl = document.getElementById("updatedTime");

        if (tempEl) tempEl.innerText = `${cur.temperature}°C`;
        if (condEl) condEl.innerText = `${cur.weather_icon} ${cur.weather_desc}`;
        if (feelsEl) feelsEl.innerText = `${t.feels_like} ${cur.apparent_temperature}°C`;
        if (updatedEl) updatedEl.innerText = `⟳ ${t.updated} ${cur.updated_time}`;

        // Weather Details
        const humVal = document.getElementById("valHumidity");
        const visVal = document.getElementById("valVisibility");
        const presVal = document.getElementById("valPressure");
        const uvVal = document.getElementById("valUv");

        if (humVal) humVal.innerText = `${cur.relative_humidity}%`;
        if (visVal) visVal.innerText = `${cur.visibility} km`;
        if (presVal) presVal.innerText = `${cur.surface_pressure} hPa`;
        if (uvVal) uvVal.innerText = `${cur.uv_index}`;

        // Wind Card
        const windSpeedEl = document.getElementById("windSpeed");
        const windDirEl = document.getElementById("windDir");
        const windGustEl = document.getElementById("windGust");
        if (windSpeedEl) windSpeedEl.innerText = `${cur.wind_speed}`;
        if (windDirEl) windDirEl.innerText = `${cur.wind_dir_name} (${cur.wind_direction}°)`;
        if (windGustEl) windGustEl.innerText = `${cur.wind_gusts} km/h`;

        // AQI Card
        const aqiNum = document.getElementById("aqiNumber");
        const aqiStatus = document.getElementById("aqiStatus");
        if (aqiNum) aqiNum.innerText = `${weatherData.air_quality.aqi}`;
        if (aqiStatus) {
            aqiStatus.innerText = `● ${weatherData.air_quality.status}`;
            aqiStatus.style.color = weatherData.air_quality.color;
        }

        // Sun & Moon
        const sunriseEl = document.getElementById("valSunrise");
        const sunsetEl = document.getElementById("valSunset");
        const moonriseEl = document.getElementById("valMoonrise");
        const moonsetEl = document.getElementById("valMoonset");
        if (sunriseEl) sunriseEl.innerText = weatherData.sun_moon.sunrise;
        if (sunsetEl) sunsetEl.innerText = weatherData.sun_moon.sunset;
        if (moonriseEl) moonriseEl.innerText = weatherData.sun_moon.moonrise;
        if (moonsetEl) moonsetEl.innerText = weatherData.sun_moon.moonset;

        // Render Hourly
        renderHourly();
        // Render 7-Day Forecast
        renderDaily();
    };

    // Render Hourly Forecast
    const renderHourly = () => {
        const hoursContainer = document.getElementById("hoursContainer");
        if (!hoursContainer) return;
        hoursContainer.innerHTML = weatherData.hourly.map((h, i) => `
            <div class="hour ${i === 0 ? 'active' : ''}">
                <div class="hour-time">${h.time}</div>
                <div class="hour-icon">${h.icon}</div>
                <div class="hour-temp">${h.temp}°</div>
                <small>${h.rain_pop}% 💧</small>
            </div>
        `).join("");

        // Click handler for hourly
        document.querySelectorAll(".hour").forEach(h => {
            h.addEventListener("click", () => {
                document.querySelectorAll(".hour").forEach(item => item.classList.remove("active"));
                h.classList.add("active");
            });
        });
    };

    // Render 7-Day Forecast
    const renderDaily = () => {
        const dailyContainer = document.getElementById("dailyContainer");
        if (!dailyContainer) return;
        dailyContainer.innerHTML = weatherData.daily.map(d => `
            <div class="forecast-row">
                <div class="day">
                    <span class="date">${d.date}</span>
                    <span class="day-name">${d.day_name}</span>
                </div>
                <span class="forecast-icon">${d.icon}</span>
                <span class="min">${d.min}°</span>
                <div class="bar"></div>
                <span class="max">${d.max}°</span>
                <span class="arrow">›</span>
            </div>
        `).join("");
    };

    // Render Dynamic Persona Content Modules
    const renderPersonaContent = () => {
        if (!personaContentEl) return;
        const lang = PersonaEngine.getLang();
        const t = PersonaEngine.TRANSLATIONS[lang];

        let html = "";

        // 1. Health & Allergy Card
        if (currentPersona === "all" || currentPersona === "health") {
            const aq = weatherData.air_quality;
            html += `
                <article class="card persona-card animate-card">
                    <div class="section-title">
                        <div>
                            <h2>🩺 ${lang === 'hi' ? 'स्वास्थ्य एवं एलर्जी डैशबोर्ड' : 'Health & Allergy Shield'}</h2>
                            <p>${lang === 'hi' ? 'वायु गुणवत्ता, परागकण एवं श्वसन परामर्श' : 'Air Quality, Pollen Count & Asthma Advisory'}</p>
                        </div>
                        <span class="badge ${aq.aqi <= 100 ? 'badge-green' : 'badge-orange'}">CPCB AQI: ${aq.aqi}</span>
                    </div>

                    <div class="health-grid">
                        <div class="health-pollutants">
                            <div class="pollutant-pill"><span>PM2.5</span> <strong>${aq.pm2_5} µg/m³</strong></div>
                            <div class="pollutant-pill"><span>PM10</span> <strong>${aq.pm10} µg/m³</strong></div>
                            <div class="pollutant-pill"><span>NO₂</span> <strong>${aq.no2} ppb</strong></div>
                            <div class="pollutant-pill"><span>Ozone (O₃)</span> <strong>${aq.o3} µg/m³</strong></div>
                        </div>

                        <div class="pollen-section">
                            <h4>🌿 ${lang === 'hi' ? 'परागकण स्तर (Pollen Count)' : 'Pollen Allergy Risk'}</h4>
                            <div class="pollen-bar-row">
                                <span>${lang === 'hi' ? 'पेड़ पराग (Tree)' : 'Tree Pollen'}</span>
                                <div class="meter-bar"><div class="fill green" style="width: ${aq.pollen.tree.value}%"></div></div>
                                <strong>${aq.pollen.tree.level}</strong>
                            </div>
                            <div class="pollen-bar-row">
                                <span>${lang === 'hi' ? 'घास पराग (Grass)' : 'Grass Pollen'}</span>
                                <div class="meter-bar"><div class="fill orange" style="width: ${aq.pollen.grass.value}%"></div></div>
                                <strong>${aq.pollen.grass.level}</strong>
                            </div>
                            <div class="pollen-bar-row">
                                <span>${lang === 'hi' ? 'खरपतवार (Weed)' : 'Weed Pollen'}</span>
                                <div class="meter-bar"><div class="fill green" style="width: ${aq.pollen.weed.value}%"></div></div>
                                <strong>${aq.pollen.weed.level}</strong>
                            </div>
                        </div>
                    </div>

                    <div class="health-advisory-box">
                        <span class="advisory-icon">🛡️</span>
                        <div>
                            <strong>${lang === 'hi' ? 'स्वास्थ्य परामर्श:' : 'Health Advisory:'}</strong>
                            <p>${aq.health_advisory}</p>
                        </div>
                    </div>
                </article>
            `;
        }

        // 2. Outdoor Fitness Card
        if (currentPersona === "all" || currentPersona === "fitness") {
            const runningHours = PersonaEngine.calculateBestRunningHours(weatherData.hourly);
            html += `
                <article class="card persona-card animate-card">
                    <div class="section-title">
                        <div>
                            <h2>🏃 ${lang === 'hi' ? 'आउटडोर फिटनेस एवं दौड़ने का समय' : 'Outdoor Fitness & Best Running Hours'}</h2>
                            <p>${lang === 'hi' ? 'तापमान, आर्द्रता एवं वायु गुणवत्ता के आधार पर अनुकूल समय' : 'Calculated based on Heat Index, AQI & Wind speed'}</p>
                        </div>
                        <span class="badge badge-green">Top Window: 5:00 AM - 7:00 AM</span>
                    </div>

                    <div class="running-hours-strip">
                        ${runningHours.slice(0, 7).map(rh => `
                            <div class="running-hour-pill ${rh.category.toLowerCase()}">
                                <span class="time">${rh.time}</span>
                                <span class="score-num" style="color: ${rh.color}">${rh.score}</span>
                                <small>${rh.category}</small>
                                <span class="temp">${rh.temp}°C</span>
                            </div>
                        `).join("")}
                    </div>

                    <div class="fitness-tips-grid">
                        <div class="fitness-tip">
                            <span>🌅 ${lang === 'hi' ? 'स्वर्ण काल (Golden Hour)' : 'Golden Hour'}</span>
                            <strong>${weatherData.sun_moon.golden_hour}</strong>
                        </div>
                        <div class="fitness-tip">
                            <span>💧 ${lang === 'hi' ? 'हाइड्रेशन परामर्श' : 'Hydration Index'}</span>
                            <strong>Drink 350ml every 20 min</strong>
                        </div>
                        <div class="fitness-tip">
                            <span>💨 ${lang === 'hi' ? 'पवन प्रतिरोध' : 'Wind Resistance'}</span>
                            <strong>${weatherData.current.wind_speed} km/h (${weatherData.current.wind_dir_name})</strong>
                        </div>
                    </div>
                </article>
            `;
        }

        // 3. Beachgoers & Surfers Card
        if (currentPersona === "all" || currentPersona === "beach") {
            const mar = weatherData.marine;
            html += `
                <article class="card persona-card animate-card">
                    <div class="section-title">
                        <div>
                            <h2>🏖️ ${lang === 'hi' ? 'समुद्री स्थिति एवं सर्फिंग' : 'Beach, Tides & Coastal Conditions'}</h2>
                            <p>${lang === 'hi' ? 'ज्वार-भाटा समय, लहरों की ऊंचाई एवं जल तापमान' : 'Tide Timings, Swell Heights & Safe Swimming Flags'}</p>
                        </div>
                        <span class="badge badge-${mar.surf_flag.toLowerCase()}">Flag: ${mar.surf_flag}</span>
                    </div>

                    <div class="marine-metrics-grid">
                        <div class="marine-box">
                            <span class="icon">🌊</span>
                            <small>${lang === 'hi' ? 'लहरों की ऊंचाई' : 'Wave Swell'}</small>
                            <strong>${mar.wave_height} m</strong>
                            <p>${mar.wave_period}s period | ${mar.wave_direction}</p>
                        </div>
                        <div class="marine-box">
                            <span class="icon">🌡️</span>
                            <small>${lang === 'hi' ? 'जल का तापमान' : 'Water Temp'}</small>
                            <strong>${mar.water_temperature}°C</strong>
                            <p>Pleasant for coastal swimming</p>
                        </div>
                        <div class="marine-box">
                            <span class="icon">🚩</span>
                            <small>${lang === 'hi' ? 'समुद्र तट सुरक्षा ध्वज' : 'Beach Safety Flag'}</small>
                            <strong style="color: #ff9800">${mar.surf_flag}</strong>
                            <p>${mar.surf_status}</p>
                        </div>
                    </div>

                    <div class="tides-timeline">
                        <h4>🕒 ${lang === 'hi' ? 'आज का ज्वार-भाटा चक्र' : "Today's Tide Cycle"}</h4>
                        <div class="tides-row">
                            ${mar.tides.map(t => `
                                <div class="tide-item ${t.type.includes('High') ? 'high' : 'low'}">
                                    <span class="tide-type">${t.type}</span>
                                    <strong class="tide-time">${t.time}</strong>
                                    <span class="tide-height">${t.height}</span>
                                </div>
                            `).join("")}
                        </div>
                    </div>
                </article>
            `;
        }

        // 4. Travelers Card
        if (currentPersona === "all" || currentPersona === "traveler") {
            const packItems = PersonaEngine.generatePackingSuggestions(weatherData.daily, weatherData.current);
            html += `
                <article class="card persona-card animate-card">
                    <div class="section-title">
                        <div>
                            <h2>✈️ ${lang === 'hi' ? 'यात्री एवं पर्यटन साथी' : 'Traveler & Smart Packing Assistant'}</h2>
                            <p>${lang === 'hi' ? 'गंतव्य मौसम, उड़ान चेतावनी एवं स्वचालित पैकिंग सूची' : 'Saved Destinations, Flight Weather Risks & Automated Packing'}</p>
                        </div>
                        <span class="badge badge-blue">Flight Delay Risk: Low</span>
                    </div>

                    <div class="saved-destinations-strip">
                        <div class="dest-card active">
                            <span>📍 Current</span>
                            <strong>${weatherData.location.name.split(',')[0]}</strong>
                            <small>${weatherData.current.temperature}°C | ${weatherData.current.weather_desc}</small>
                        </div>
                        <div class="dest-card" onclick="alert('Switching to Mumbai weather...')">
                            <span>Mumbai</span>
                            <strong>29.4°C</strong>
                            <small>🌧️ Heavy Showers</small>
                        </div>
                        <div class="dest-card" onclick="alert('Switching to Delhi weather...')">
                            <span>New Delhi</span>
                            <strong>33.1°C</strong>
                            <small>☀️ Sunny & Hazy</small>
                        </div>
                        <div class="dest-card" onclick="alert('Switching to London weather...')">
                            <span>London</span>
                            <strong>17.5°C</strong>
                            <small>🌦️ Light Rain (Carry Coat)</small>
                        </div>
                    </div>

                    <div class="packing-checklist">
                        <h4>🧳 ${lang === 'hi' ? 'गंतव्य हेतु स्वचालित पैकिंग सुझाव' : 'AI-Driven Packing Suggestions for Upcoming Weather'}</h4>
                        <div class="packing-items-grid">
                            ${packItems.map(item => `
                                <label class="packing-item">
                                    <input type="checkbox" checked>
                                    <span class="check-custom"></span>
                                    <span class="pack-icon">${item.icon}</span>
                                    <div>
                                        <strong>${item.title}</strong>
                                        <p>${item.reason}</p>
                                    </div>
                                </label>
                            `).join("")}
                        </div>
                    </div>
                </article>
            `;
        }

        // 5. Parents & Family Card
        if (currentPersona === "all" || currentPersona === "family") {
            html += `
                <article class="card persona-card animate-card">
                    <div class="section-title">
                        <div>
                            <h2>🎒 ${lang === 'hi' ? 'माता-पिता एवं स्कूल आवागमन' : 'Parents & School Commute Sentinel'}</h2>
                            <p>${lang === 'hi' ? 'स्कूल जाने और लौटने के समय मौसम पूर्वानुमान एवं बाल सुरक्षा' : 'Dedicated School Commute Windows & Outdoor Play Score'}</p>
                        </div>
                        <span class="badge badge-green">Kids Play Score: 8.5/10</span>
                    </div>

                    <div class="commute-windows-grid">
                        <div class="commute-box">
                            <div class="commute-header">
                                <span>🚌 Morning Drop-Off</span>
                                <strong>07:00 AM – 08:30 AM</strong>
                            </div>
                            <div class="commute-body">
                                <span class="temp">25°C ⛅</span>
                                <p><strong>Dry & Pleasant.</strong> Safe for school bus & bicycle commutes. No raincoat needed for morning departure.</p>
                            </div>
                        </div>

                        <div class="commute-box">
                            <div class="commute-header">
                                <span>🎒 Afternoon Pickup</span>
                                <strong>01:30 PM – 03:30 PM</strong>
                            </div>
                            <div class="commute-body">
                                <span class="temp">31°C 🌦️</span>
                                <p><strong>35% Rain Probability.</strong> Warm and humid. Keep a foldable umbrella in your child’s school bag.</p>
                            </div>
                        </div>
                    </div>

                    <div class="rain-alert-counter">
                        <span>🌧️ ${lang === 'hi' ? 'बारिश का अलर्ट:' : 'Rain Alert:'}</span>
                        <p>${lang === 'hi' ? 'शाम 6:00 बजे के बाद हल्की गरज-चमक के साथ बारिश का अनुमान। शाम 5 बजे से पहले पार्क में खेलने का उपयुक्त समय।' : 'Light rain expected post 06:00 PM. Best outdoor playground time is between 04:00 PM and 05:30 PM.'}</p>
                    </div>
                </article>
            `;
        }

        // 6. Agriculture & Gardeners Card
        if (currentPersona === "all" || currentPersona === "agriculture") {
            const ag = weatherData.agriculture;
            const agroAdv = PersonaEngine.calculateAgroAdvisory(ag.soil_moisture_surface, ag.rain_forecast_48h);
            html += `
                <article class="card persona-card animate-card">
                    <div class="section-title">
                        <div>
                            <h2>🌾 ${lang === 'hi' ? 'किसान एवं कृषि मौसम (Kisan Mausam)' : 'Agriculture, Soil & Kisan Agro-Advisory'}</h2>
                            <p>${lang === 'hi' ? 'मिट्टी की नमी, 14-दिवसीय वर्षा पूर्वानुमान एवं आईएमडी परामर्श' : 'Soil Moisture (0-10cm), Evapotranspiration & IMD Agromet Guidelines'}</p>
                        </div>
                        <span class="badge badge-green">Irrigation: ${agroAdv.irrigation_advice}</span>
                    </div>

                    <div class="agro-metrics-grid">
                        <div class="agro-card">
                            <span class="icon">🌱</span>
                            <small>${lang === 'hi' ? 'सतही मिट्टी की नमी' : 'Topsoil Moisture (0-10cm)'}</small>
                            <strong>${ag.soil_moisture_surface}%</strong>
                            <div class="meter-bar"><div class="fill green" style="width: ${ag.soil_moisture_surface}%"></div></div>
                            <p>${agroAdv.soil_status}</p>
                        </div>

                        <div class="agro-card">
                            <span class="icon">🌧️</span>
                            <small>${lang === 'hi' ? '48 घंटे में अनुमानित वर्षा' : '48-Hour Expected Rain'}</small>
                            <strong>${ag.rain_forecast_48h} mm</strong>
                            <p>Monsoon moisture replenishment</p>
                        </div>

                        <div class="agro-card">
                            <span class="icon">💨</span>
                            <small>${lang === 'hi' ? 'वाष्पोत्सर्जन दर' : 'Evapotranspiration (ET₀)'}</small>
                            <strong>${ag.evapotranspiration} mm/day</strong>
                            <p>Moderate crop water loss</p>
                        </div>

                        <div class="agro-card">
                            <span class="icon">❄️</span>
                            <small>${lang === 'hi' ? 'पाला / शीत जोखिम' : 'Frost / Heat Risk'}</small>
                            <strong style="color: #4caf50">${ag.frost_risk}</strong>
                            <p>Ideal vegetative conditions</p>
                        </div>
                    </div>

                    <div class="kisan-advisory-box">
                        <span class="kisan-icon">🚜</span>
                        <div>
                            <strong>${lang === 'hi' ? 'आईएमडी कृषि मौसम सलाह:' : 'IMD Agromet Advisory:'}</strong>
                            <p>${ag.advisory}</p>
                            <small>⚡ ${agroAdv.pest_warning}</small>
                        </div>
                    </div>
                </article>
            `;
        }

        // 7. Commuters Card
        if (currentPersona === "all" || currentPersona === "commuter") {
            const com = PersonaEngine.calculateCommuteImpact(weatherData.current.visibility, weatherData.hourly[3].rain_pop);
            html += `
                <article class="card persona-card animate-card">
                    <div class="section-title">
                        <div>
                            <h2>🚗 ${lang === 'hi' ? 'दैनिक यात्री एवं सड़क यातायात' : 'Commuter & Traffic Weather Impact'}</h2>
                            <p>${lang === 'hi' ? 'कोहरा, दृश्यता, जलभराव जोखिम एवं यात्रा में देरी की संभावना' : 'Road Visibility, Fog Risk, Waterlogging Potential & Transit Alerts'}</p>
                        </div>
                        <span class="badge badge-green">Transit Score: 88/100</span>
                    </div>

                    <div class="commute-metrics-grid">
                        <div class="commute-status-box">
                            <span class="icon">👁️</span>
                            <small>${lang === 'hi' ? 'सड़क दृश्यता' : 'Road Visibility'}</small>
                            <strong>${com.visibility}</strong>
                            <p>${com.fog_label}</p>
                        </div>

                        <div class="commute-status-box">
                            <span class="icon">🌊</span>
                            <small>${lang === 'hi' ? 'जलभराव जोखिम' : 'Waterlogging Probability'}</small>
                            <strong style="color: #4caf50">${com.waterlogging_risk}</strong>
                            <p>Key arterial flyovers clear</p>
                        </div>

                        <div class="commute-status-box">
                            <span class="icon">🚦</span>
                            <small>${lang === 'hi' ? 'यातायात प्रभाव' : 'Traffic Weather Impact'}</small>
                            <strong>${com.traffic_impact}</strong>
                            <p>Expect normal metro & road speed</p>
                        </div>
                    </div>
                </article>
            `;
        }

        // 8. Event Planners Card
        if (currentPersona === "all" || currentPersona === "event") {
            const comf = PersonaEngine.calculateComfortIndex(weatherData.current.temperature, weatherData.current.relative_humidity, weatherData.current.wind_speed);
            html += `
                <article class="card persona-card animate-card">
                    <div class="section-title">
                        <div>
                            <h2>🎪 ${lang === 'hi' ? 'कार्यक्रम एवं विवाह योजनाकार' : 'Event Planner & Outdoor Comfort Index'}</h2>
                            <p>${lang === 'hi' ? 'आउटडोर समारोह, शाम के रिसेप्शन एवं मौसम अनुकूलता' : 'Discomfort Index, Precipitation Probability & Best Event Slots'}</p>
                        </div>
                        <span class="badge" style="background: ${comf.color}; color: #fff;">Comfort Score: ${comf.score}/100</span>
                    </div>

                    <div class="event-planner-grid">
                        <div class="comfort-gauge-card">
                            <div class="gauge-dial">
                                <span class="gauge-val" style="color: ${comf.color}">${comf.score}</span>
                                <small>Comfort Index</small>
                            </div>
                            <strong>${comf.label}</strong>
                            <p>${comf.wedding_recommendation}</p>
                        </div>

                        <div class="event-slots-card">
                            <h4>💍 ${lang === 'hi' ? 'आज के श्रेष्ठ समारोह समय' : 'Best Outdoor Gathering Slots'}</h4>
                            <div class="slot-item recommended">
                                <span>⭐ 04:30 PM – 07:00 PM</span>
                                <strong>Sunset Golden Hour Ceremony</strong>
                                <small>Temp: 27°C | Low UV | Breeze: 6 km/h</small>
                            </div>
                            <div class="slot-item caution">
                                <span>⚠️ 08:30 PM – 11:30 PM</span>
                                <strong>Late Banquet & Dinner</strong>
                                <small>Light rain chance (45%) — recommend canopy cover</small>
                            </div>
                        </div>
                    </div>
                </article>
            `;
        }

        personaContentEl.innerHTML = html;
        animateEntrance();
    };

    // Needle Rotation
    const updateWindNeedle = () => {
        const needle = document.getElementById("needle");
        if (needle && weatherData.current) {
            needle.style.transform = `rotate(${weatherData.current.wind_direction}deg)`;
        }
    };

    // Staggered Card Animation
    const animateEntrance = () => {
        const cards = document.querySelectorAll(".animate-card");
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("show");
                }
            });
        });
        cards.forEach((card, index) => {
            card.style.transitionDelay = `${(index % 6) * 0.07}s`;
            observer.observe(card);
        });
    };

    // Voice Weather Bulletin using Web Speech API
    const toggleSpeechBulletin = () => {
        if (!('speechSynthesis' in window)) {
            alert("Speech synthesis is not supported on this browser.");
            return;
        }

        if (isSpeaking) {
            window.speechSynthesis.cancel();
            isSpeaking = false;
            if (audioBtn) audioBtn.innerHTML = `🔊 ${PersonaEngine.TRANSLATIONS[PersonaEngine.getLang()].listen_bulletin}`;
            return;
        }

        const lang = PersonaEngine.getLang();
        const cur = weatherData.current;
        let text = "";

        if (lang === "hi") {
            text = `${weatherData.location.name} में वर्तमान मौसम। तापमान ${cur.temperature} डिग्री सेल्सियस है, ${cur.weather_desc}। आर्द्रता ${cur.relative_humidity} प्रतिशत है। वायु गुणवत्ता सूचकांक ${weatherData.air_quality.aqi} के साथ ${weatherData.air_quality.status} है। आज दौड़ने और व्यायाम के लिए सबसे अच्छा समय सुबह 5 से 7 बजे का है। शाम को हल्की गरज-चमक की चेतावनी है, कृपया सुरक्षित रहें।`;
        } else {
            text = `Mausam Weather Bulletin for ${weatherData.location.name}. Current temperature is ${cur.temperature} degrees Celsius with ${cur.weather_desc}. Humidity is ${cur.relative_humidity} percent, and wind speed is ${cur.wind_speed} kilometers per hour. Air Quality is ${weatherData.air_quality.status} with an AQI of ${weatherData.air_quality.aqi}. Optimal workout hours are between 5 and 7 AM. Stay safe and be alert for evening light thunderstorms.`;
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-US';
        utterance.rate = 0.95;

        utterance.onstart = () => {
            isSpeaking = true;
            if (audioBtn) audioBtn.innerHTML = `⏹️ ${PersonaEngine.TRANSLATIONS[lang].speaking}`;
        };
        utterance.onend = utterance.onerror = () => {
            isSpeaking = false;
            if (audioBtn) audioBtn.innerHTML = `🔊 ${PersonaEngine.TRANSLATIONS[lang].listen_bulletin}`;
        };

        window.speechSynthesis.speak(utterance);
    };

    // Setup All Event Listeners
    const setupEventListeners = () => {
        // Language Toggle (EN / HI)
        if (langToggleBtn) {
            langToggleBtn.addEventListener("click", () => {
                const newLang = PersonaEngine.getLang() === "en" ? "hi" : "en";
                PersonaEngine.setLang(newLang);
                langToggleBtn.innerText = newLang === "en" ? "🇮🇳 हिंदी" : "🌐 English";
                renderPersonaTabs();
                updateCoreWeatherUI();
                renderPersonaContent();
                if (audioBtn) audioBtn.innerHTML = `🔊 ${PersonaEngine.TRANSLATIONS[newLang].listen_bulletin}`;
            });
        }

        // Audio Bulletin Button
        if (audioBtn) {
            audioBtn.addEventListener("click", toggleSpeechBulletin);
        }

        // Mobile View Simulator Toggle
        if (viewToggleBtn) {
            viewToggleBtn.addEventListener("click", () => {
                isMobileSimulator = !isMobileSimulator;
                if (isMobileSimulator) {
                    dashboardContainer.classList.add("mobile-simulator-frame");
                    viewToggleBtn.innerHTML = "🖥️ Dashboard View";
                } else {
                    dashboardContainer.classList.remove("mobile-simulator-frame");
                    viewToggleBtn.innerHTML = "📱 Mobile App View";
                }
            });
        }

        // GPS Geolocation Button
        if (gpsBtn) {
            gpsBtn.addEventListener("click", () => {
                if (navigator.geolocation) {
                    gpsBtn.innerText = "⏳";
                    navigator.geolocation.getCurrentPosition(
                        async (pos) => {
                            gpsBtn.innerText = "📍";
                            await loadWeather(pos.coords.latitude, pos.coords.longitude, "My Current Location");
                        },
                        (err) => {
                            gpsBtn.innerText = "📍";
                            alert("Unable to retrieve location. Please check browser permissions or search manually.");
                        }
                    );
                } else {
                    alert("Geolocation is not supported by your browser.");
                }
            });
        }

        // Search Input & Suggestions
        if (searchInput && searchResults) {
            let debounceTimer;
            searchInput.addEventListener("input", (e) => {
                clearTimeout(debounceTimer);
                const query = e.target.value.trim();
                if (query.length < 2) {
                    searchResults.style.display = "none";
                    return;
                }
                debounceTimer = setTimeout(async () => {
                    const cities = await WeatherService.searchCities(query);
                    if (cities.length > 0) {
                        searchResults.innerHTML = cities.map(c => `
                            <div class="search-result-item" data-lat="${c.latitude}" data-lon="${c.longitude}" data-name="${c.name}">
                                📍 ${c.name}
                            </div>
                        `).join("");
                        searchResults.style.display = "block";

                        document.querySelectorAll(".search-result-item").forEach(item => {
                            item.addEventListener("click", async () => {
                                const lat = parseFloat(item.getAttribute("data-lat"));
                                const lon = parseFloat(item.getAttribute("data-lon"));
                                const name = item.getAttribute("data-name");
                                searchInput.value = "";
                                searchResults.style.display = "none";
                                await loadWeather(lat, lon, name);
                            });
                        });
                    } else {
                        searchResults.style.display = "none";
                    }
                }, 300);
            });

            // Close search results when clicking outside
            document.addEventListener("click", (e) => {
                if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
                    searchResults.style.display = "none";
                }
            });
        }

        // Alert Acknowledge Button
        const alertBtn = document.getElementById("alertBtn");
        const notification = document.getElementById("notification");
        if (alertBtn && notification) {
            alertBtn.addEventListener("click", () => {
                notification.classList.add("show");
                setTimeout(() => {
                    notification.classList.remove("show");
                }, 3000);
            });
        }
    };

    init();
});