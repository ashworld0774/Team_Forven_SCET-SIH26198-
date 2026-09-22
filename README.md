# AAKRITI - Healthcare & Disease Visualization Platform (SIH 2026)

Welcome to the **AAKRITI** project repository developed for Smart India Hackathon (SIH26198).

## 📁 Repository Directory Structure

```
├── APP SOURCE CODE/       # React Native / Expo Mobile Application (User & Patient Interface)
├── ADMIN SOURCE CODE/     # React + Vite Web Portal (Admin Dashboard & Doctor Verification)
├── BACKEND SOURCE CODE/   # Node.js + Express + MongoDB REST API Server
├── Architectures/         # System & Solution Architecture Diagrams
├── Documentation/         # Project Documentation, APIs, and Schemas
├── Research/              # Research Papers, Clinical Data & References
├── App Demo/              # Video Demos, Screenshots, and Walkthrough Assets
├── env.example            # Environment variables configuration template
└── README.md              # Project Overview
```

---

## 🛠️ Quick Start Guide

### 1. Backend REST API
```bash
cd "BACKEND SOURCE CODE"
npm install
# Create a .env file based on env.example
npm run dev
```

### 2. Mobile Application
```bash
cd "APP SOURCE CODE"
npm install
npx expo start
```

### 3. Admin Web Panel
```bash
cd "ADMIN SOURCE CODE"
npm install
npm run dev
```

---

## 🔑 Key Features
- **Interactive 3D Visualizations:** 3D disease models rendered via Three.js.
- **Multilingual Support:** Localization (English, Hindi, Marathi) using `i18next`.
- **Doctor Verification Workflow:** Document upload via Cloudinary, admin approval/rejection dashboard.
- **AI Health Assistant / Chatbot:** Conversational health query support.
