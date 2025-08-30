# 📱 rn-boilerplate-starter  

[![React Native](https://img.shields.io/badge/React%20Native-0.81-blue?logo=react)](https://reactnative.dev/)  
[![React](https://img.shields.io/badge/React-19-61dafb?logo=react)](https://react.dev/)  
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript)](https://www.typescriptlang.org/)  
[![Node](https://img.shields.io/badge/Node.js-%3E=18-green?logo=node.js)](https://nodejs.org/)  
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)  

A **Modern React Native boilerplate** designed to help you kickstart projects with production-ready features, clean architecture, and built-in utilities.  

---

## ✨ Features Out of the Box  

- ⚡️ **React Native 0.81 + React 19**  
- 🎨 **Custom branding scripts** (app icon & splash generator)  
- 🗂 **Organized project structure**  
- 📦 **MobX + Persist store** for state management  
- 🌍 **i18n with react-i18next**  
- 📡 **Tanstack Query (React Query)** for data fetching & caching  
- ✅ **React Hook Form + Yup/Zod** validation  
- 🖼 **SVG + Vector icons support**  
- 📸 **Vision Camera + Image Picker + Compressor**  
- ⌨️ **Keyboard controller** for smooth input handling  
- 🔔 **Toast notifications**  
- 🛡 **Error boundaries & safe fallbacks**  
- 🔑 **Permissions handling (react-native-permissions)**  
- 🧭 **React Navigation (stack + tabs ready)**  
- 🚀 **Scripts for app branding**  
- 🔧 **Pre-configured ESLint + Prettier + TypeScript**  

---



## 🛠 Installation  

```sh
# Use the template
npx @react-native-community/cli@latest init AwesomeProject --template rn-boilerplate-starter

# Install dependencies
yarn install

# iOS setup
yarn pod-install
```

---

## ▶️ Running the App  

```sh
# Start Metro
yarn start

# Run on Android
yarn android

# Run on iOS
yarn ios
```

---

## 🎨 Branding (App Icons & Splash)  

Easily add your **custom app icon** and **splash screen**:  

1. Place your images in:  

```
src/assets/branding/logo.png
src/assets/branding/splash.png
```

2. Run the branding scripts:  

```sh
# Generate app icons
yarn appicon

# Generate splash screen
yarn splash
```

3. Rebuild your app:  

```sh
yarn android
# or
yarn ios
```

---

## 📂 Project Structure  

```
AwesomeProject/
 ├── android/                # Native Android project
 ├── ios/                    # Native iOS project
 ├── src/
 │   ├── assets/             # Images, fonts, branding
 │   ├── components/         # Reusable UI components
 │   ├── hooks/              # Custom React hooks
 │   ├── navigation/         # Navigation setup
 │   ├── screens/            # App screens
 │   ├── store/              # MobX stores
 │   ├── utils/              # Helpers & utilities
 │   └── ...
 ├── scripts/                # Branding & other custom scripts
 ├── package.json
 └── README.md
```

---

## 📜 Useful Scripts  

| Command              | Description                                      |
|----------------------|--------------------------------------------------|
| `yarn start`         | Start Metro bundler                              |
| `yarn android`       | Run app on Android                               |
| `yarn ios`           | Run app on iOS                                   |
| `yarn lint`          | Run ESLint                                       |
| `yarn format`        | Format code with Prettier                        |
| `yarn clean`         | Clean Android build cache                        |
| `yarn release`       | Create Android APK                               |
| `yarn release:bundle`| Create Android App Bundle (AAB)                  |
| `yarn pod-install`   | Install iOS pods                                 |
| `yarn appicon`       | Generate app icons from `src/assets/branding/logo.png` |
| `yarn splash`        | Generate splash screen from `src/assets/branding/splash.png` |

---

## ✅ Requirements  

- Node.js `>=18`  
- Yarn  
- Xcode (for iOS builds)  
- Android Studio (for Android builds)  

---

## 📝 License  

MIT © [Areez Mahmood]  
