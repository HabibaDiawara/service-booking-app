<p align="center">
  <img src="https://img.shields.io/badge/React_Native-0.81-61DAFB?logo=react&logoColor=black" alt="React Native" />
  <img src="https://img.shields.io/badge/Expo-SDK_54-000020?logo=expo&logoColor=white" alt="Expo" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/React_Navigation-7.x-6b52ae" alt="React Navigation" />
</p>

# 📱 My Service App

A cross-platform (iOS & Android) mobile application built with **React Native + Expo** that connects customers with home service providers — browse services, view details, book appointments, and manage bookings, all from one app.

> Built end-to-end as a personal full-stack project (React Native frontend + REST API backend) to practice production-grade mobile architecture, type-safe navigation, and clean separation of concerns.

---

## ✨ Features

- 🔐 **Authentication** — secure login with token-based auth
- 🧰 **Service Catalog** — browse available home services with details
- 📅 **Bookings Management** — view upcoming bookings, cancel with confirmation, pull-to-refresh
- 👤 **User Profile** — manage account information
- 🔒 **Secure Token Storage** — auth tokens stored via `expo-secure-store` (Keychain/Keystore), never in plain storage
- 🧭 **Type-Safe Nested Navigation** — Bottom Tabs + Stack navigators with fully typed route params
- ⚡ **Robust Error & Loading States** — every screen handles loading, empty, and error states explicitly

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native (Expo SDK 54) |
| Language | TypeScript |
| Navigation | React Navigation (Bottom Tabs + Stack, fully typed) |
| HTTP Client | Axios |
| Secure Storage | expo-secure-store |
| Date Handling | @react-native-community/datetimepicker |

---

## 🧱 Architecture

The project follows a **layered, feature-oriented structure** that separates UI, navigation, and business logic:

```
src/
├── components/       # Reusable UI building blocks (BookingCard, FormInput, PrimaryButton...)
├── navigation/       # Navigators + centralized, typed route definitions
├── screens/          # Screen-level components (composition only, no direct API calls)
└── services/         # API layer — one file per domain (auth, bookings, services, user)
    ├── apiErrors.ts      # Centralized error message extraction
    ├── authContext.tsx   # Auth state provider
    ├── authService.ts
    ├── bookingService.ts
    ├── serviceService.ts
    ├── tokenStorage.ts   # Secure token persistence
    └── userService.ts
```

**Design principles applied:**
- **Single Responsibility** — screens only compose UI and handle local state; all data access lives in `services/`
- **Type-safe navigation** — every screen's props are derived from a single source of truth (`navigation/types.ts`) using `CompositeScreenProps`, so navigating with wrong params fails at compile time, not runtime
- **Centralized error handling** — `apiErrors.ts` normalizes API error messages so every screen displays consistent, user-friendly errors

---

## 📸 Screenshots

<!-- Add screenshots here, e.g.: -->
<!-- <p align="center">
  <img src="./screenshots/services.png" width="200" />
  <img src="./screenshots/booking-detail.png" width="200" />
  <img src="./screenshots/bookings.png" width="200" />
</p> -->

---

## 🚀 Getting Started

### Prerequisites
- Node.js (LTS)
- Expo Go app (for testing on a physical device) or an iOS/Android simulator

### Installation

```bash
git clone https://github.com/HabibaDiawara/service-booking-app.git
cd my-service-app
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```
EXPO_PUBLIC_API_URL=https://your-api-url.com
```

### Run the app

```bash
npx expo start
```

Scan the QR code with the **Expo Go** app on your device, or press `a` / `i` to launch an Android/iOS simulator.

---

## 🗺️ Roadmap

- [ ] Dark mode support
- [ ] Push notifications for booking reminders
- [ ] Multi-language support (Arabic/English + RTL)
- [ ] Unit & integration tests

---

## 📄 License

This project is open-sourced for portfolio and educational purposes.
