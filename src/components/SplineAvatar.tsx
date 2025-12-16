import Spline from '@splinetool/react-spline';
import { useState, useEffect, useRef } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';

interface Message {
  id: number;
  text: string;
  timestamp: number;
  type: 'question' | 'answer';
}

export default function SplineAvatar() {
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const recognitionRef = useRef<any>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  
  // استفاده از WebSocket برای ارتباط با بک‌اند
  const { sendMessage, messages: wsMessages, isConnected, currentText } = useWebSocket();

  // تابع برای اضافه کردن پیام جدید
  const addMessage = (messageText: string, messageType: 'question' | 'answer') => {
    const newMessage: Message = {
      id: Date.now(),
      text: messageText,
      timestamp: Date.now(),
      type: messageType
    };
    setMessages(prev => [...prev, newMessage]);
  };

  // اضافه کردن پیام‌های دریافتی از WebSocket
  useEffect(() => {
    if (wsMessages.length > 0) {
      const lastMessage = wsMessages[wsMessages.length - 1];
      if (lastMessage.type === 'done' && lastMessage.text) {
        addMessage(lastMessage.text, 'answer');
        // TTS برای پاسخ
        speakText(lastMessage.text, lastMessage.lang || 'fa-IR');
      }
    }
  }, [wsMessages]);

  // اسکرول خودکار به بالا وقتی پیام جدید اضافه می‌شود
  useEffect(() => {
    const container = document.querySelector('.messages-container');
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  // راه‌اندازی Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || 
                             (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'fa-IR'; // زبان فارسی
      recognition.interimResults = true;
      recognition.continuous = false;

      recognition.onresult = (event: any) => {
        let final = '';
        for (let i = 0; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          }
        }
        if (final) {
          addMessage(final, 'question');
          sendMessage(final, 'fa-IR');
        }
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, [sendMessage]);

  // تابع TTS با استفاده از endpoint بک‌اند
  const speakText = async (text: string, lang: string) => {
    // توقف هر صدای قبلی
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }

    setIsSpeaking(true);
    
    try {
      // ابتدا سعی می‌کنیم از endpoint بک‌اند استفاده کنیم
      const shortLang = lang.split('-')[0]; // 'fa-IR' -> 'fa'
      const response = await fetch(`http://localhost:8000/tts?text=${encodeURIComponent(text)}&lang=${shortLang}`);
      
      if (response.ok) {
        const audioBlob = await response.blob();
        
        // بررسی اینکه آیا بلاب خالی نیست
        if (audioBlob.size === 0) {
          throw new Error('Empty audio blob received');
        }
        
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        currentAudioRef.current = audio;
        
        audio.onended = () => {
          URL.revokeObjectURL(audioUrl);
          setIsSpeaking(false);
          currentAudioRef.current = null;
          console.log('Audio playback ended');
        };
        
        audio.onerror = (e) => {
          console.error('Audio playback error:', e);
          URL.revokeObjectURL(audioUrl);
          setIsSpeaking(false);
          currentAudioRef.current = null;
          // Fallback به speechSynthesis مرورگر
          fallbackToWebSpeech(text, lang);
        };
        
        await audio.play();
        console.log('✅ Playing audio from backend TTS (gTTS/OpenAI)');
      } else {
        throw new Error(`Backend TTS failed with status: ${response.status}`);
      }
    } catch (error) {
      console.error('❌ TTS error:', error);
      // Fallback به speechSynthesis مرورگر
      fallbackToWebSpeech(text, lang);
    }
  };

  // Fallback به Web Speech API
  const fallbackToWebSpeech = (text: string, lang: string) => {
    if ('speechSynthesis' in window) {
      // توقف هر صدای در حال پخش
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      // بارگذاری لیست صداها
      let voices = speechSynthesis.getVoices();
      if (voices.length === 0) {
        // اگر صداها بارگذاری نشده‌اند، منتظر می‌مانیم
        speechSynthesis.onvoiceschanged = () => {
          voices = speechSynthesis.getVoices();
          setVoiceAndSpeak(utterance, voices, lang);
        };
      } else {
        setVoiceAndSpeak(utterance, voices, lang);
      }
      
      utterance.onstart = () => {
        console.log('🔊 Web Speech synthesis started');
        setIsSpeaking(true);
      };
      
      utterance.onend = () => {
        console.log('Web Speech synthesis ended');
        setIsSpeaking(false);
      };
      
      utterance.onerror = (e) => {
        console.error('Web Speech synthesis error:', e);
        setIsSpeaking(false);
      };
      
      if (voices.length > 0) {
        setVoiceAndSpeak(utterance, voices, lang);
      } else {
        speechSynthesis.speak(utterance);
      }
      
      console.log('🔄 Using Web Speech API fallback');
    } else {
      console.error('❌ No TTS available');
      setIsSpeaking(false);
    }
  };

  const setVoiceAndSpeak = (utterance: SpeechSynthesisUtterance, voices: SpeechSynthesisVoice[], lang: string) => {
    // لیست صداهای موجود را چاپ کنیم
    console.log('Available voices:', voices.map(v => `${v.name} (${v.lang})`).join(', '));
    
    // انتخاب صدای فارسی یا عربی
    let selectedVoice = voices.find(voice => voice.lang.startsWith('fa'));
    if (!selectedVoice) {
      selectedVoice = voices.find(voice => voice.lang.startsWith('ar'));
    }
    if (!selectedVoice) {
      // اگر صدای فارسی/عربی نبود، از صدای پیش‌فرض استفاده می‌کنیم
      selectedVoice = voices[0];
    }
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
      console.log(`Selected voice: ${selectedVoice.name} (${selectedVoice.lang})`);
    }
    
    speechSynthesis.speak(utterance);
  };

  const handleMicClick = () => {
    if (!recognitionRef.current) {
      alert('گوگل کروم یا مرورگرهایی که از تشخیص گفتار پشتیبانی می‌کنند را استفاده کنید');
      return;
    }

    if (!isRecording) {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (e) {
        console.error('Error starting recognition:', e);
      }
    } else {
      try {
        recognitionRef.current.stop();
        setIsRecording(false);
      } catch (e) {
        console.error('Error stopping recognition:', e);
      }
    }
  };

  // ارسال پیام تایپ شده
  const handleSendText = () => {
    if (!text.trim()) return;
    addMessage(text, 'question');
    sendMessage(text, 'fa-IR');
    setText('');
  };

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 0 0 8px rgba(59, 130, 246, 0);
          }
        }

        @keyframes recordingPulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
          }
          50% {
            box-shadow: 0 0 0 12px rgba(239, 68, 68, 0);
          }
        }

        .messages-container {
          position: fixed;
          bottom: 180px;
          top: 150px;
          right: 50px;
          max-width: 400px;
          z-index: 999;
          pointer-events: auto;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          padding-left: 10px;
          
          /* مخفی کردن اسکرول‌بار */
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE and Edge */
        }

        .messages-container::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera */
        }

        .message-item {
          font-size: 14px;
          font-family: system-ui, -apple-system, sans-serif;
          direction: rtl;
          text-align: right;
          line-height: 1.6;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          margin-bottom: 12px;
          white-space: pre-wrap;
          word-break: break-word;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          animation: fadeIn 0.5s ease-out;
        }

        .message-question {
          color: #ffd700;
          opacity: 0.9;
        }

        .message-answer {
          color: #ffffff;
        }

        .mic-button {
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 26px;
          border-radius: 50%;
          transition: all 0.3s ease;
          position: relative;
        }

        .mic-button:not(.recording) {
          color: #3b82f6;
          animation: pulse 2s infinite;
          background: rgba(59, 130, 246, 0.1);
        }

        .mic-button:not(.recording):hover {
          transform: scale(1.15);
          background: rgba(59, 130, 246, 0.2);
        }

        .mic-button.recording {
          color: #ef4444;
          background: rgba(239, 68, 68, 0.2);
          animation: recordingPulse 1.5s infinite;
          box-shadow: 0 0 20px rgba(239, 68, 68, 0.5);
          border: 2px solid #ef4444;
        }
      `}</style>

      <main>
        <Spline
          scene="https://prod.spline.design/QHA0AJfpbBJtYDx1/scene.splinecode"
          style={{ 
            transform: 'translate(-60px, -100px)',
          }}
        />
      </main>

      {/* نمایش پیام‌های مکالمه در سمت راست */}
      <div className="messages-container">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message-item ${message.type === 'question' ? 'message-question' : 'message-answer'}`}
          >
            {message.text}
          </div>
        ))}
      </div>
      
      {/* نمایش وضعیت اتصال */}
      <div style={{
        position: 'fixed',
        top: '20px',
        left: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        zIndex: 1000,
      }}>
        {/* وضعیت اتصال */}
        <div style={{
          padding: '8px 16px',
          borderRadius: '20px',
          backgroundColor: isConnected ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
          border: `1px solid ${isConnected ? '#22c55e' : '#ef4444'}`,
          color: isConnected ? '#22c55e' : '#ef4444',
          fontSize: '14px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: isConnected ? '#22c55e' : '#ef4444',
            animation: isConnected ? 'pulse 2s infinite' : 'none'
          }}></span>
          {isConnected ? 'متصل' : 'قطع شده'}
        </div>

        {/* وضعیت پخش صدا */}
        {isSpeaking && (
          <div style={{
            padding: '8px 16px',
            borderRadius: '20px',
            backgroundColor: 'rgba(147, 51, 234, 0.2)',
            border: '1px solid #9333ea',
            color: '#9333ea',
            fontSize: '14px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            animation: 'fadeIn 0.3s ease-in'
          }}>
            <span style={{
              fontSize: '16px',
              animation: 'pulse 1s infinite'
            }}>🔊</span>
            در حال پخش صدا...
          </div>
        )}

        {/* وضعیت ضبط */}
        {isRecording && (
          <div style={{
            padding: '8px 16px',
            borderRadius: '20px',
            backgroundColor: 'rgba(239, 68, 68, 0.2)',
            border: '1px solid #ef4444',
            color: '#ef4444',
            fontSize: '14px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            animation: 'fadeIn 0.3s ease-in'
          }}>
            <span style={{
              fontSize: '16px',
              animation: 'recordingPulse 1s infinite'
            }}>🎤</span>
            در حال ضبط...
          </div>
        )}
      </div>

      <div style={{
        position: 'fixed',
        bottom: '100px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        width: '70%',
        maxWidth: '700px',
        backgroundColor: '#1a1a1a',
        borderRadius: '50px',
        padding: '0px 20px',
        gap: '15px',
        zIndex: 1000,
        border: '1px solid #2a2a2a',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
      }}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendText();
            }
          }}
          placeholder="توضیحات خود را اینجا بنویسید یا از میکروفون استفاده کنید..."
          disabled={!isConnected}
          style={{
            flex: 1,
            border: 'none',
            backgroundColor: 'transparent',
            outline: 'none',
            fontSize: '16px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            resize: 'none',
            color: '#ffffff',
            minHeight: '1px',
            maxHeight: '100px',
            overflow: 'auto',
            direction: 'rtl',
            textAlign: 'right',
            padding: '7px 0'
          }}
          onInput={(e) => {
            e.currentTarget.style.height = 'auto';
            e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px';
          }}
        />
        
        <button
          onClick={handleSendText}
          disabled={!isConnected || !text.trim()}
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            cursor: isConnected && text.trim() ? 'pointer' : 'not-allowed',
            opacity: isConnected && text.trim() ? 1 : 0.5,
            transition: 'all 0.3s ease',
            fontSize: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="ارسال پیام"
        >
          📤
        </button>
        
        <button
          onClick={handleMicClick}
          disabled={!isConnected}
          className={`mic-button ${isRecording ? 'recording' : ''}`}
          title={isRecording ? 'توقف ضبط' : 'شروع ضبط صدا'}
          style={{
            opacity: isConnected ? 1 : 0.5,
            cursor: isConnected ? 'pointer' : 'not-allowed'
          }}
        >
          🎤
        </button>
      </div>
    </>
  );
}
