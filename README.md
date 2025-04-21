# 🔧 CRF Annex – Advanced Barista Tools

This is the companion project to the [Coffee Recipe Finder](https://github.com/DariaRodovnichenko/coffee-recipe-finder), built for coffee professionals who want to push the boundaries of brewing. It features **specialty tools** like grind setting converters, TDS scanning with OCR, and brewing visualizations.

> Designed for championship-level precision ☕🌌

---

## 🛠 Features

- 🔄 **Grind Size Converter**  
  Convert grind settings across popular grinders (e.g. Fellow Opus, Niche Zero, Lagom Mini) using real-world brew range anchors (not just micron estimates).

- 📈 **Brew Visualizer**  
  Input brew parameters and generate extraction curves (TDS, pressure, flow rate over time).

- 📸 **TDS Scanner with OCR**  
  Use your camera to scan refractometer screens, extract the TDS value, and plot results in real time.

- 💰 **Expense Tracker**  
  Track your spending on beans, equipment, and coffee-related accessories.

- ⏳ **Brewing Timer Tool**  
  Custom timers for pour-over, espresso, or any custom brew method.

---

## 🔍 Use Cases

- Compete or train like a world-class barista
- Log and analyze your brews with precision
- Convert grinder settings accurately between devices
- Save TDS readings and compare across brews
- Track your gear and bean expenses with filters & currency conversion

---

## 📱 Tech Stack

- **Framework**: Angular + Ionic
- **Backend**: Firebase (Auth, Realtime DB, Firestore)
- **Extras**:
  - Capacitor Camera API
  - OCR engine for TDS scanning
  - Chart.js / ngx-charts for visual graphs

---

## 🚀 Live Demo

[👉 View the app here](https://dariarodovnichenko.github.io/crf-annex/)

---

## 🧪 How to Run Locally

```bash
# Clone the project
git clone https://github.com/DariaRodovnichenko/crf-annex.git
cd crf-annex

# Install dependencies
npm install

# Run the app (with Vite or Angular CLI depending on setup)
npm run dev
# or
ng serve
