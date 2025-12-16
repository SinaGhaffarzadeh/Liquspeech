# Liquid Speech to Speech

A modern, interactive voice-enabled chat interface with a 3D animated avatar built using React, TypeScript, Vite, and Spline. This frontend provides real-time communication with an AI agent backend through WebSocket connections, featuring speech recognition and text-to-speech capabilities.

## ✨ Features

- 🎨 **3D Interactive Avatar** - Spline-powered 3D avatar with smooth animations
- 🔊 **Voice Input** - Speech recognition support (Web Speech API) for hands-free interaction
- 🔉 **Voice Output** - Text-to-speech synthesis for agent responses
- 🌐 **Bilingual Support** - Full support for Persian and English languages
- ⚡ **Real-time Communication** - WebSocket-based bidirectional communication with backend
- 🎯 **Modern UI/UX** - Clean, responsive interface built with Tailwind CSS
- 🔄 **Auto-reconnect** - Automatic WebSocket reconnection with exponential backoff
- 💬 **Message History** - Scrollable conversation history with visual indicators
- 🎙️ **Recording Status** - Visual feedback for recording, speaking, and connection states


## 🚀 Installation & Setup

### 1. Clone the repository (if not already done)

```bash
cd frontend
```

### 2. Install dependencies

```bash
# Clean install (recommended)
rm -rf node_modules package-lock.json
npm install

# Or using yarn
yarn install
```

### 3. Start the development server

```bash
npm run dev

# Or using yarn
yarn dev
```

The application will be available at `http://localhost:3000`

### 4. Ensure backend is running

Make sure your backend server is running on `http://localhost:8000` with WebSocket endpoint at `ws://localhost:8000/ws`

## 📁 Project Structure

```
frontend/
├── index.html                 # HTML entry point
├── package.json              # Project dependencies and scripts
├── vite.config.ts           # Vite configuration
├── tailwind.config.cjs      # Tailwind CSS configuration
├── postcss.config.cjs       # PostCSS configuration
├── tsconfig.json            # TypeScript configuration
├── start_frontend.bat       # Windows batch script to start frontend
│
└── src/
    ├── main.tsx             # React entry point
    ├── App.tsx              # Main application component
    ├── index.css            # Global styles (Tailwind imports)
    │
    ├── components/          # React components
    │   ├── SplineAvatar.tsx      # 3D avatar component with chat interface
    │   ├── ChatInterface.tsx     # Chat input and message handling
    │   ├── VoiceControls.tsx     # Voice input controls and language selection
    │   └── MessageList.tsx       # Message display component
    │
    └── hooks/               # Custom React hooks
        └── useWebSocket.ts       # WebSocket connection management
```


- [ ] Voice activity detection
- [ ] Custom wake words

---

**Built with ❤️ using React, TypeScript, Vite, and Spline**
