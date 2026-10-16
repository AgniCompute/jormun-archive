# ARCHIVE 04 // JÖRMUN — Deep-Sea 2.5D Leviathan Experience

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Performance: 160+ FPS](https://img.shields.io/badge/Performance-160%2B%20FPS-2EE6CA.svg)](#performance--optimization)
[![Style: Studio VØR / PSF Inspired](https://img.shields.io/badge/Aesthetic-Editorial%20Dark%20Mode-04080F.svg)](#aesthetic--art-direction)

An interactive, high-performance web experience featuring **JÖRMUN**—an 84-meter abyssal dragon sea serpent navigating sunken megalithic ruins. Inspired by high-end editorial dark-mode aesthetics (Studio VØR, Pizza Samurai Frogs), this project showcases custom 2.5D spline conveyor kinematics, biological roar synchronization, interactive hadal telemetry, and Web Audio synthesizers rendered at 160+ FPS without WebGL bloat.

---

## ⚡ Live Highlights

- **2.5D Spline Conveyor Engine:** Seamless shingled scale locomotion gliding through 3D cubic Bezier curves in dual foreground and background arches.
- **Harmonic Biological Roar State Machine:** Periodic or click-triggered roar cycle (anticipation inhale, fanged abyss discharge, cyan photophore flare, authoritative jaw snap).
- **100% Canvas GPU Optimization:** Pre-baked 2.5D specular beveling and hardware-accelerated composition yielding **160+ FPS lock** at minimal memory overhead.
- **The Trench Floor Dossier (-9,820M):** Cinematic camera dive transition to an editorial hadal archive featuring:
  - Live animated Benthic Pulse Oscilloscope (SVG EKG with REST/SURGE modes).
  - Interactive Anatomical Specimen Inspection Lightbox (Plates 01–03).
  - 360° Acoustic Sonar Visualizer with contact tracking, frequency sweeps, and click ripples.
  - Expedition Hydrophone Recordings with procedural Web Audio synthesis.
- **Dedicated Acoustic Gating:** Soft, deep 220Hz hydrophone acoustics with dedicated on/off mute toggles.

---

## 🛠️ Tech Stack & Architecture

- **Vanilla JavaScript (ES6+):** Pure custom physics, Bezier parameterization, and Web Audio API synthesizers.
- **HTML5 Canvas 2D:** Optimized hardware-composited canvas pipeline.
- **Tailwind CSS:** Precision layout, typography, and responsive containers.
- **GSAP 3:** Cinematic camera timelines, depth descent tweening, and easing.
- **Cinzel & JetBrains Mono:** Editorial luxury serif paired with technical HUD monospace typography.

---

## 🚀 Quick Start / Local Hosting

This project is a static web application requiring no build step or node package installations.

### 1. Clone the repository
```bash
git clone https://github.com/your-username/jormun-archive.git
cd jormun-archive
```

### 2. Run a local HTTP server
Any local HTTP server will work:

```bash
# Python 3
python -m http.server 8080

# Or Node.js npx
npx serve -l 8080
```

Open `http://localhost:8080/` in your browser.

---

## 🌐 Deploying to GitHub Pages

1. Push this repository to GitHub.
2. Navigate to **Settings** > **Pages**.
3. Under **Build and deployment** > **Branch**, select `main` and root `/`.
4. Click **Save**. Your site will be live across the world in seconds!

---

## 📖 Motion Engineering & Creator Guide

Want to learn how the 2.5D spline conveyor, continuous zero-pop loop, and biological head coupling were engineered?
Check out the complete breakdown in [**MOTION_ENGINEERING.md**](MOTION_ENGINEERING.md).

---

## 📄 License

MIT License. Created for cinematic interactive web experiences and generative motion exploration.

