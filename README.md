# 🎮 xbox-app-sgdb

**Make your Xbox App look awesome!**

This tool automatically updates game covers for third-party games in your Xbox App using high-quality images from SteamGridDB.

| Before | After |
|--------|-------|
| ![Before](https://github.com/user-attachments/assets/ecf72819-7ed4-498d-beca-8636b8383e17) | ![After](https://github.com/user-attachments/assets/0c0e5f97-da3c-410a-a29e-3adbfe8981ee) |

---

## 🧠 What Is This?

Modern game launchers like [Playnite](https://playnite.link/), [GOG GALAXY 2.0](https://www.gog.com/galaxy), and the new [Xbox App](https://www.xbox.com/apps/xbox-app-on-pc) aim to unify your game library. But third-party games often show up with missing or generic covers.

This app solves that by automatically patching beautiful, high-resolution covers for all your third-party games in the Xbox App — no manual selection needed.

Inspired by [Xbox-PC-Library-Art](https://github.com/tetraguy/Xbox-PC-Library-Art), but designed to be simpler and faster.

---

## ✅ Features

- Automatically fetches the best-rated cover art from [SteamGridDB](https://www.steamgriddb.com)
- Supports games from **Steam**, **Epic Games**, **GOG**, and **Uplay**
- No manual selection — just run and go!
- Resizes all covers to 200x200 (Xbox App default)
- Crops non-square images if needed
- Optional protection for GOG and Uplay covers
- Customizable config file

---

## 🛠 Requirements

- [SteamGridDB API Key](https://www.steamgriddb.com/profile)
- Xbox App installed on your PC

---

## 🚀 How to Use

> 💡 **Tip:** It's recommended to close the Xbox App before running this tool to avoid conflicts while patching covers.

### Option 1: Download Executable

1. Go to the [Releases](https://github.com/YOUR_USERNAME/xbox-app-sgdb/releases) page.
2. Download the latest `.exe` file.
3. Run the app and enter your SteamGridDB API key.
4. Done! Covers will be patched automatically.

### Option 2: Run from Source

```bash
git clone https://github.com/YOUR_USERNAME/xbox-app-sgdb.git
cd xbox-app-sgdb
npm install
npm start
```

Then enter your API key when prompted.

---

## ⚙️ Configuration

A config file named `xbox-sgdb.config.json` will be created automatically. You can customize it:

```json
{`
  "apiKey": "YOUR_API_KEY_HERE",
  "dimensions": [
    "512x512",
    "1024x1024"
  ],
  "concurrency": 5,
  "force": false,
  "logLevel": "info",
  "mapIds": {
    "1317860": "780310"
    }
  }
```

- `dimensions`: Only square images are supported.
- `concurrency`: Number of parallel requests (don’t set too high).
- `force`: Makes GOG and Uplay covers write-protected so Xbox App won’t overwrite them.
- `logLevel`: Logging verbosity (feature in development).
- `mapIds`: Manually correct mismatched game IDs.

---

## 🧩 Notes

- All images are resized to 200x200 pixels.
- If no square image is found, the app crops the top of the first available cover.
- GOG and Uplay covers may be overwritten by the Xbox App. Use `"force": true` to prevent this.
- It's best to close the Xbox App before running this tool.
- Supports games from Steam, Epic Games, GOG, and Uplay.

---

## 🙏 Credits

Thanks to these awesome projects and APIs:

- [SteamGridDB](https://www.steamgriddb.com)
- [egdata.app](https://egdata.app/)
- [GOG Database](https://www.gogdb.org)
- [UPLAY_GAME_ID](https://github.com/Haoose/UPLAY_GAME_ID)
- [Xbox-PC-Library-Art](https://github.com/tetraguy/Xbox-PC-Library-Art)
