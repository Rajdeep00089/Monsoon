# 🌦️ Mausam (मौसम) — Personalized Weather Experience
> **Smart India Hackathon (SIH 2026) | Problem Statement ID: 26076**  
> **Idea Title:** *Development of personalized homepage for 'Mausam' mobile application.*  
> **Tech Stack:** Pure Semantic HTML5, CSS3 (Glassmorphic Design System), Vanilla JavaScript (ES6+) — Zero External Dependencies.

---

## 🌟 Executive Overview
**Mausam (मौसम)** transforms traditional weather forecasting from raw data charts into a **hyper-personalized, citizen-centric intelligence hub**. Built strictly for **PSID 26076**, it dynamically tailors meteorological data to eight distinct Indian lifestyle and occupational segments.

Whether you are a farmer in rural Bengal timing your paddy transplanting, an asthmatic managing dangerous PM2.5 spikes, a parent tracking school bus drop-off windows, or a tourist planning a trip to Mumbai, Mausam reorganizes its interface to present the insights that matter most to you.

---

## 🎯 The 8 Targeted Personas (PSID 26076 Compliant)

```
+-------------------------------------------------------------------------------+
|                             MAUSAM HOMEPAGE                                  |
|   [ All-in-One ] [ 🩺 Health ] [ 🏃 Fitness ] [ 🏖️ Beach ] [ ✈️ Travel ]      |
|   [ 🎒 Parents ] [ 🌾 Kisan ]  [ 🚗 Commute ] [ 🎪 Event ]                   |
+-------------------------------------------------------------------------------+
```

| Persona | Key Features & Algorithms | SIH 2026 Impact |
| :--- | :--- | :--- |
| **1. 🩺 Health-Conscious** | • CPCB National AQI Meter<br>• $PM_{2.5}$, $PM_{10}$, $NO_2$, $O_3$ breakdowns<br>• Pollen counts (Tree, Grass, Weed)<br>• Dynamic Asthma & Allergy Advisory | Helps sensitive individuals prevent respiratory attacks and plan safe outdoor hours. |
| **2. 🏃 Outdoor Fitness** | • **"Best Running Hours" Algorithm (0–100 score)**<br>• Heat Exhaustion / WBGT Index<br>• Solar Golden Hour countdown<br>• Hydration & wind resistance advisory | Optimizes athletes' workout windows avoiding mid-day heatwaves and pollution peaks. |
| **3. 🏖️ Beachgoers & Surfers** | • Coastal Tide Cycle (High / Low Tides with heights)<br>• Wave Swell Height (m) & Period (s)<br>• Water Temperature & Surf Direction<br>• **Beach Safety Flag Rating** (🟢 Safe / 🟡 Caution / 🔴 Danger) | Saves lives along coastal recreation belts like Puri, Goa, and Marina Beach. |
| **4. ✈️ Travelers** | • Multi-city Saved Destinations (Live comparisons)<br>• Flight Weather Delay Risk index<br>• **AI-Driven Smart Packing Assistant** (auto-detects rain, cold, UV) | Eliminates packing guesswork and alerts passengers of weather-induced transit delays. |
| **5. 🎒 Parents & Families** | • **Dedicated School Commute Windows** (Morning 7–8:30 AM & Afternoon 1:30–3:30 PM)<br>• Kids Outdoor Playground Safety Score (1–10)<br>• Rain Arrival Lead-Time countdown | Protects schoolchildren from sudden cloudbursts and extreme afternoon heat. |
| **6. 🌾 Agriculture / Kisan** | • Topsoil Moisture ($0–10\text{ cm}$) & Subsoil status<br>• Evapotranspiration Rate ($\text{ET}_0$ in mm/day)<br>• 48-Hour Precipitation Volume<br>• **IMD Agromet Advisory** (Irrigation hold/release recommendations) | Prevents wasted irrigation and crop spoilage for Indian farmers. |
| **7. 🚗 Daily Commuters** | • Fog Severity & Visibility Distance (km)<br>• Road Waterlogging & Flooding Risk<br>• Weather-Induced Traffic Congestion Score | Helps metro commuters choose optimal routes before getting stuck in rain snarls. |
| **8. 🎪 Event Planners** | • **Outdoor Comfort Index (0–100 dial)**<br>• Precipitation Probability Timeline (PoP)<br>• Best Gathering & Wedding Ceremony Slot Finder | Guides event organizers on tenting requirements and optimal ceremony hours. |

---

## 🚀 Key Innovations & Differentiators

1. **🌐 Bilingual Support (English & हिंदी)**:  
   One-click instant language switcher dynamically updates all weather descriptions, advisories, and persona names to support nationwide accessibility.
2. **🔊 Voice Weather Bulletin (Web Speech API)**:  
   Audio readout designed for farmers and visually impaired users. Reads out temperature, air quality, best running windows, and severe alerts in English or Hindi.
3. **📱 Mobile App View Simulator**:  
   Built-in simulator toggle to preview how Mausam functions as an Android / iOS mobile application.
4. **⚡ Live Open-Meteo Integration + High-Fidelity Fallback**:  
   Pulls live meteorological, air quality, marine, and soil data without requiring any API keys or paid tiers. Includes full fallback data so presentations never break even offline.
5. **🔍 Interactive Search & GPS**:  
   Live geocoding search for Indian cities and districts, paired with one-click GPS coordinate detection.

---

## 📂 Project Structure
```
Mausam/
├── index.html              # Main application entry point (GitHub Pages ready)
├── css/
│   └── style.css           # Glassmorphism UI, persona card components & animations
├── js/
│   ├── app.js / script.js  # Main application coordinator & UI DOM binder
│   ├── weatherService.js   # Open-Meteo API layer (Weather, AQI, Marine, Soil, Geocoding)
│   └── personaData.js      # Persona intelligence algorithms & bilingual dictionary
├── docs/
│   └── ProjectContext.md   # SIH 2026 Problem Statement specifications (PSID 26076)
├── .gitignore              # Clean ignore rules
└── README.md               # Complete Hackathon documentation
```

---

## 💻 How to Run Locally

Since Mausam is built using pure HTML5, CSS3, and JavaScript, no build tools (`npm`, `webpack`) or backend servers are required:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Rajdeep00089/Monsoon.git
   cd Monsoon
   ```
2. **Open in any browser:**
   - Double-click `index.html` or open it with VS Code Live Server.

---

## 👥 Contributors
- **Rajdeep** ([@Rajdeep00089](https://github.com/Rajdeep00089))
