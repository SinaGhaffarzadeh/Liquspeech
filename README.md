# 🎭 Avatar Agent Frontend

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

## 🛠️ Technologies Used

| Technology | Purpose |
|------------|---------|
| **React 18** | UI library for component-based architecture |
| **TypeScript** | Type-safe JavaScript development |
| **Vite** | Fast build tool and development server |
| **Tailwind CSS** | Utility-first CSS framework |
| **Spline** | 3D design and animation integration |
| **Web Speech API** | Browser-native speech recognition and synthesis |
| **WebSocket** | Real-time bidirectional communication |

## 📋 Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager
- A modern browser with WebSocket and Web Speech API support (Chrome/Edge recommended)
- **Backend server** running on `http://localhost:8000`

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

## 🧩 Key Components

### `SplineAvatar.tsx`
The main component that integrates:
- Spline 3D avatar visualization
- Message display overlay
- Voice recording interface
- Text input field
- Connection status indicators
- TTS audio playback with fallback to browser synthesis

### `ChatInterface.tsx`
Handles user interaction:
- Text input with keyboard support
- Speech recognition integration
- Message sending logic
- Language detection (Persian/English)
- Real-time status updates

### `VoiceControls.tsx`
Voice interaction controls:
- Microphone button with visual feedback
- Language selection (Auto, Persian, English)
- Recording state management

### `useWebSocket.ts`
Custom hook managing:
- WebSocket connection lifecycle
- Automatic reconnection with exponential backoff
- Message sending/receiving
- Connection state management
- Error handling

## ⚙️ Configuration

### Vite Configuration (`vite.config.ts`)

The Vite configuration includes proxy settings for WebSocket and TTS endpoints:

```typescript
{
  server: {
    port: 3000,
    proxy: {
      '/ws': {
        target: 'ws://localhost:8000',
        ws: true
      },
      '/tts': {
        target: 'http://localhost:8000',
        changeOrigin: true
      }
    }
  }
}
```

### WebSocket Connection

The application automatically connects to:
- **Development**: `ws://localhost:8000/ws`
- **Production**: Uses the same host as the frontend with appropriate protocol (ws:// or wss://)

## 🎬 Usage

### Basic Usage Flow

1. **Start the application** - The 3D avatar will load and display connection status in the top-left corner
2. **Type a message** - Use the text input field at the bottom of the screen
3. **Voice input** - Click the microphone button (🎤) to start voice recording
4. **Language selection** - Choose between Auto-detect, Persian (fa-IR), or English (en-US)
5. **View responses** - Agent responses appear in the message history on the right side of the screen
6. **Listen to responses** - Responses are automatically converted to speech and played back

### Interface Elements

- **Connection Status** (Top-left): Shows "Connected" (green) or "Disconnected" (red)
- **Recording Status** (Top-left): Displays when actively recording voice input
- **Speaking Status** (Top-left): Shows when the agent's response is being played via TTS
- **Message History** (Right side): Scrollable list of questions (yellow) and answers (white)
- **Input Area** (Bottom): Text input field with send button and microphone button

### Keyboard Shortcuts

- `Enter` - Send typed message
- `Shift + Enter` - New line in text input (multi-line support)

### Voice Commands

1. Click the microphone button to start recording
2. Speak your question or command
3. The system will automatically detect when you've finished speaking
4. Your speech will be transcribed and sent to the agent
5. The response will be displayed and spoken back to you

## 🏗️ Build for Production

```bash
# Build the project
npm run build

# Preview production build locally
npm run preview
```

Build output will be generated in the `dist/` directory, ready for deployment to any static hosting service.

### Production Deployment Notes

- Ensure WebSocket endpoint is configured for production environment
- Use WSS (WebSocket Secure) for HTTPS deployments
- Speech Recognition requires HTTPS in production (localhost is exempt)
- Configure CORS settings on backend to allow frontend domain

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on port 3000 with hot reload |
| `npm run build` | Build optimized production bundle with TypeScript compilation |
| `npm run preview` | Preview production build locally |

## 🌐 Browser Compatibility

| Feature | Chrome | Edge | Firefox | Safari |
|---------|--------|------|---------|--------|
| WebSocket | ✅ | ✅ | ✅ | ✅ |
| Speech Recognition | ✅ | ✅ | ❌ | ❌ |
| Speech Synthesis | ✅ | ✅ | ✅ | ✅ |
| Spline 3D | ✅ | ✅ | ✅ | ✅ |

**Recommended Browser**: Chrome or Edge for full feature support including speech recognition

**Note**: Firefox and Safari do not support the Web Speech Recognition API. Users on these browsers can still use text input and will receive audio responses.

## 🐛 Troubleshooting

### WebSocket Connection Failed

**Problem**: Unable to connect to backend server

**Solutions**:
- Ensure backend server is running on `http://localhost:8000`
- Check if the WebSocket endpoint `/ws` is accessible
- Verify no firewall is blocking the connection
- Check browser console for specific error messages
- Try restarting both frontend and backend servers

### Speech Recognition Not Working

**Problem**: Microphone button doesn't work or no transcription occurs

**Solutions**:
- Use Chrome or Edge browser (Firefox and Safari don't support Web Speech Recognition API)
- Grant microphone permissions when prompted by the browser
- Check browser console for error messages
- Verify microphone is working in system settings
- Try closing and reopening the browser
- Ensure you're not using browser in incognito/private mode (some browsers restrict microphone access)

### 3D Avatar Not Loading

**Problem**: Blank screen or Spline avatar not appearing

**Solutions**:
- Check internet connection (Spline assets are loaded from CDN)
- Verify the Spline scene URL is valid and accessible
- Check browser console for WebGL errors
- Try disabling browser extensions that might block content
- Clear browser cache and reload
- Ensure WebGL is supported and enabled in your browser

### Audio Playback Issues

**Problem**: No audio response from agent or distorted audio

**Solutions**:
- Check browser audio permissions
- Ensure backend TTS endpoint (`/tts`) is working correctly
- Verify audio is not muted in browser or system
- Check browser console for audio playback errors
- Try using a different browser
- If using backend TTS, verify gTTS or OpenAI TTS is configured properly

### Text Input Not Working

**Problem**: Cannot type or send messages

**Solutions**:
- Verify WebSocket connection is established (check status indicator)
- Check that input field is not disabled
- Look for JavaScript errors in browser console
- Try refreshing the page
- Clear browser cache

### Auto-Language Detection Issues

**Problem**: Wrong language detected or incorrect TTS pronunciation

**Solutions**:
- Manually select language instead of using "Auto" mode
- Ensure text contains clear language indicators
- For mixed language text, select the primary language
- Check that backend supports the selected language

## 🔒 Security Considerations

- **Microphone Access**: Requires explicit user permission; denied by default
- **HTTPS Required**: Speech recognition requires HTTPS in production environments
- **WebSocket Security**: Use WSS (WebSocket Secure) protocol in production
- **CORS Configuration**: Ensure backend CORS settings allow frontend domain
- **API Keys**: Keep backend API keys (OpenAI, etc.) secure and not exposed to frontend
- **Content Security Policy**: Consider implementing CSP headers for production

## 🤝 Integration with Backend

This frontend is designed to work with a backend server that provides:

### 1. WebSocket Endpoint

**URL**: `ws://localhost:8000/ws` (development) or `wss://your-domain.com/ws` (production)

**Expected Message Format (Client → Server)**:
```json
{
  "type": "message",
  "text": "User's question or command",
  "lang": "en-US" | "fa-IR" | null
}
```

**Expected Response Format (Server → Client)**:
```json
// Streaming response chunk
{
  "type": "delta",
  "text": "partial response text"
}

// Final complete response
{
  "type": "done",
  "text": "complete response text",
  "lang": "en-US" | "fa-IR"
}

// Error message
{
  "type": "error",
  "message": "Error description"
}

// Cost estimate
{
  "type": "estimate",
  "model": "gpt-4",
  "input_tokens": 100,
  "estimated_cost_usd": 0.002
}

// Acknowledgment
{
  "type": "ack",
  "message": "Message received"
}
```

### 2. TTS (Text-to-Speech) Endpoint

**URL**: `GET http://localhost:8000/tts?text={text}&lang={lang}`

**Parameters**:
- `text` (required): The text to convert to speech (URL encoded)
- `lang` (required): Language code (`en` for English, `fa` for Persian)

**Response**: Audio file (WAV, MP3, or other supported format)

**Example**:
```
GET http://localhost:8000/tts?text=Hello%20world&lang=en
```

### Backend Requirements

- WebSocket server supporting bidirectional communication
- TTS endpoint returning audio files
- Support for both English and Persian languages
- Optional: OpenAI integration for advanced AI responses
- Optional: gTTS (Google Text-to-Speech) or similar TTS library

## 📦 Dependencies

### Production Dependencies

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "@splinetool/react-spline": "^2.2.6",
  "@splinetool/runtime": "^1.9.0"
}
```

### Development Dependencies

```json
{
  "@types/react": "^18.2.0",
  "@types/react-dom": "^18.2.0",
  "@vitejs/plugin-react": "^3.1.0",
  "autoprefixer": "^10.4.14",
  "postcss": "^8.4.24",
  "tailwindcss": "^3.3.2",
  "typescript": "^5.0.0",
  "vite": "^4.4.0"
}
```

## 🎨 Customization

### Changing the 3D Avatar

Edit the Spline scene URL in `src/components/SplineAvatar.tsx`:

```typescript
<Spline
  scene="https://prod.spline.design/YOUR_SCENE_ID/scene.splinecode"
/>
```

### Modifying Styles

- Global styles: Edit `src/index.css`
- Tailwind configuration: Edit `tailwind.config.cjs`
- Component-specific styles: Inline styles or add CSS classes in component files

### Adjusting WebSocket Connection

Modify connection logic in `src/hooks/useWebSocket.ts`:
- Change reconnection attempts
- Adjust backoff delay
- Customize error handling

### Language Configuration

Update language options in `src/components/ChatInterface.tsx` or `SplineAvatar.tsx`:
- Add new languages
- Modify language detection logic
- Customize speech recognition settings

## 📝 License

This project is part of the Avatar Agent system.

## 🙏 Acknowledgments

- **Spline** for the 3D design platform
- **Web Speech API** for browser-native speech capabilities
- **React** and **Vite** communities for excellent tools and documentation

## 👥 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Maintain existing code style
- Add comments for complex logic
- Test in multiple browsers
- Update documentation for new features

## 📞 Support

If you encounter issues or have questions:

1. Check the Troubleshooting section above
2. Review browser console for error messages
3. Ensure backend is running and accessible
4. Verify all dependencies are installed correctly

## 🗺️ Roadmap

Potential future enhancements:

- [ ] Multi-user support
- [ ] Message persistence and history
- [ ] Additional language support
- [ ] Avatar customization options
- [ ] Mobile app version
- [ ] Offline mode support
- [ ] Voice activity detection
- [ ] Custom wake words

---

**Built with ❤️ using React, TypeScript, Vite, and Spline**
