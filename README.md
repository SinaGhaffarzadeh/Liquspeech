# Avatar Agent Frontend (Vite + React)

React frontend برای Avatar Voice Agent با Spline integration.

## نصب و راه‌اندازی

```bash
# حذف فایل‌های قدیمی
rm -rf node_modules package-lock.json

# نصب dependencies
npm install

# اجرای development server
npm run dev
```

Frontend روی `http://localhost:3000` اجرا می‌شود.

## ساختار پروژه

```
frontend/
├── index.html           # Entry point
├── vite.config.ts       # Vite config
├── package.json         # Dependencies
├── src/
│   ├── main.tsx         # React entry
│   ├── App.tsx          # Main component
│   ├── index.css        # Global styles (Tailwind)
│   ├── components/
│   │   ├── SplineAvatar.tsx
│   │   ├── ChatInterface.tsx
│   │   ├── VoiceControls.tsx
│   │   └── MessageList.tsx
│   └── hooks/
│       └── useWebSocket.ts
└── ...
```

## Development

1. Backend را روی `http://localhost:8000` اجرا کنید
2. Frontend را با `npm run dev` اجرا کنید
3. به `http://localhost:3000` بروید

## Build برای Production

```bash
npm run build
npm run preview
```

## ویژگی‌ها

- ✅ Spline Integration با انیمیشن تعاملی
- ✅ WebSocket برای ارتباط real-time
- ✅ Speech Recognition با Web Speech API
- ✅ Text-to-Speech برای پاسخ‌های agent
- ✅ پشتیبانی از فارسی و انگلیسی
- ✅ UI مدرن با Tailwind CSS
