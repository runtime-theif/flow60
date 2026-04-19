# Flow60 — 60 Day Physical Transformation

![Flow60 License](https://img.shields.io/badge/License-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-16+-black.svg)
![Status](https://img.shields.io/badge/Status-Active-success.svg)

**Flow60** is a completely open-source, beautifully designed 60-day behavioral reinforcement system. It is built specifically for beginners who want to build functional strength, sculpt an aesthetic physique, and improve their posture—all **without ever stepping foot into a gym or buying expensive equipment.**

This app strips away the complexity of modern fitness platforms. There are no bloated metrics, no confusing paywalls—just raw, calculated progressive bodyweight resistance, dynamic scheduling logic, and stunning reactive environments to keep you fully locked into your goals.

## 🧠 The Science Behind the Movements

You do not need heavy iron plates to trigger muscle hypertrophy. The only language your muscles actually understand is **Mechanical Tension** and **Metabolic Stress**. 

Flow60 uses purely bodyweight and common household items (like a heavy backpack) to apply scientifically backed stress to your musculature to force adaptation.

### Target Areas & Mechanics:
* **The "V-Taper" & Posture:** The fastest way to look physically impressive is through structural realignment. Modern living causes "Desk Hunch", tightly rolling your shoulders inward. Flow60 incorporates specialized **Backpack Rows**, **Bird Dogs**, and **Wall Posture Holds** to rapidly strengthen the posterior chain (rhomboids, traps, spinal erectors). This forcibly pulls your shoulders back, widening your physical frame and immediately lifting your chest.
* **Shoulder & Chest Development:** Using standard, incline, and heavily leveraged **Pike Push-Ups**, we target the deltoids and pectoralis effectively. Pike push-ups simulate the exact mechanical load of overhead barbell presses.
* **Lower Body Power Engine:** Your legs hold the largest muscle groups. Firing them triggers systemic metabolic responses (natural testosterone and GH surges). **Bulgarian Split Squats**, **Glute Bridges**, and **Deep Squats** isolate your quads and posterior chain simultaneously, building serious power and definition.
* **Core Anti-Extension:** Planks, Side Planks, and Dead Bugs don't just build the "6-pack"—they teach your abdominal wall to resist spinal extension, bulletproofing your lower back and making every other lift mechanically stronger.

---

## ✨ Core Features

* **Dynamic Biological Theming:** The app continuously shifts its UI colors depending on the biological clock in your current timezone. Crisp whites and neon blues for morning activation, warm crimsons and oranges for dusk, and sleek dark cyber-aesthetics at night.
* **Motivational Audio Scheduler:** Define a daily target time. When this target hits, the PWA utilizes browser-level Native Notifications and Speech Synthesis to literally talk to you, breaking you out of sluggish behavior routines.
* **Local Data Sovereignty:** Everything is saved internally within `flow60-local-db.json`. There’s no complex cloud account needed, no data harvesting—your mood, streak, and performance data belong strictly to your local server.
* **Automated SVG Data Charting:** A gorgeous, lightweight, dependency-free inline SVG graphing system automatically calculates your Mood and Energy scores to plot your trajectory over the 60 days.

---

## 🛠️ Setup & Installation

Flow60 is designed to spin up locally in seconds using Next.js. You can run it directly on bare metal or execute it safely behind a Docker container.

### Method 1: Local NodeJS Setup
**Prerequisites:** Node.js v18+ 

1. **Clone the repository:**
   ```bash
   git clone https://github.com/runtime-theif/flow60.git
   cd flow60
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Start the development server:**
   ```bash
   npm run dev
   ```
4. **Access the application:**
   Navigate to `http://localhost:3000` in your web browser.

### Method 2: Docker Setup
**Prerequisites:** Docker & Docker Compose

1. **Clone the repository:**
   ```bash
   git clone https://github.com/runtime-theif/flow60.git
   cd flow60
   ```
2. **Launch the stack:**
   ```bash
   docker-compose up -d --build
   ```
   *Note: This setup automatically utilizes volume-binding to safely persist your `flow60-local-db.json` so you do not lose your daily run streaks when you shut down the container!*

---

## 📝 Open Source License (MIT)
This project is deeply dedicated to developers who are too heavily glued to their integrated development environments and forgot about their physical environments. 

It is officially licensed under the **MIT License**. Fork it, modify it, redistribute it, and most importantly... start moving. 

*(See the `LICENSE` file for full documentation details).*
