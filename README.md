# Mandarin Flash Cards

A React Native flashcard app for studying the top 100 most common Mandarin characters. Includes pronunciation playback, speech recognition practice, and progress tracking.

## Requirements

- **Node.js** 18+
- **npm** 9+
- **Expo CLI** — installed automatically via `npx`
- **Android Studio** (for Android builds) — includes the Android SDK and build tools
- **Java JDK 17** — bundled with Android Studio, or install separately
- An **Android device** with USB debugging enabled, or an Android emulator

> iOS builds require a Mac with Xcode installed. This project has only been tested on Android.

## Setup

```bash
npm install
```

## Running on a device

This app uses native modules (`expo-speech-recognition`, `react-native-safe-area-context`) that require a native build — it cannot run in the standard Expo Go app.

### First-time build

Connect your Android device via USB, then:

1. Enable **Developer Options** on your phone (tap Build Number 7 times in Settings → About Phone)
2. Enable **USB Debugging** in Developer Options
3. When prompted on your phone, tap **Allow USB debugging**
4. Set USB mode to **File Transfer (MTP)** in the USB notification

Verify your device is detected:

```bash
npx adb devices
```

You should see your device listed as `device` (not `unauthorized`). Then build and install:

```bash
npx expo run:android
```

The first build takes a few minutes. Subsequent runs are faster.

### After the first build

Once the app is installed, you can push JS-only changes with a simple reload — no rebuild needed. Only rebuild when native dependencies change (i.e. after `npx expo install <package>`).

## Features

- **Flashcards** — flip to reveal pinyin, tone, and meaning for the top 100 characters
- **Pronunciation playback** — tap 🔊 to hear the character spoken in Mandarin
- **Speech practice** — tap 🎤 on the back of a card to practice pronunciation; the app listens and shows what it heard along with a pinyin breakdown
- **Progress tracking** — cards are marked as Known or Still Learning; progress is saved locally
- **Card list** — browse all 100 characters with correct/total review counts, sortable by frequency, most correct, least correct, or not yet reviewed
- **Stats screen** — overview of known vs. learning cards

## Project structure

```
src/
  data/characters.js        — Top 100 characters with pinyin, tone, meaning
  hooks/useProgress.js      — Progress state and AsyncStorage persistence
  hooks/useSpeechRecognition.js — Speech recognition hook (expo-speech-recognition)
  screens/FlashCardScreen.js — Main study screen
  screens/CardListScreen.js  — Browse all cards with progress
  screens/StatsScreen.js     — Progress overview
```
