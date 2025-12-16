import { useState, useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';
import VoiceControls from './VoiceControls';

interface ChatInterfaceProps {
  onSpeakingChange?: (isSpeaking: boolean) => void;
  onListeningChange?: (isListening: boolean) => void;
}

// متدهایی که از بیرون قابل دسترسی هستند
export interface ChatInterfaceRef {
  startListening: () => void;
  stopListening: () => void;
}

const ChatInterface = forwardRef<ChatInterfaceRef, ChatInterfaceProps>(({
  onSpeakingChange,
  onListeningChange,
}, ref) => {
  const { sendMessage, messages, isConnected } = useWebSocket();
  const [inputText, setInputText] = useState('');
  const [selectedLang, setSelectedLang] = useState<'auto' | 'fa-IR' | 'en-US'>('auto');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Speech Recognition
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    onListeningChange?.(isListening);
  }, [isListening, onListeningChange]);

  useEffect(() => {
    onSpeakingChange?.(isSpeaking);
  }, [isSpeaking, onSpeakingChange]);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || 
                             (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
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
          const lang = selectedLang === 'auto' 
            ? (containsPersian(final) ? 'fa-IR' : 'en-US')
            : selectedLang;
          sendMessage(final, lang);
          setInputText('');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [selectedLang, sendMessage]);

  const containsPersian = (text: string): boolean => {
    return /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(text);
  };

  const handleSend = () => {
    if (!inputText.trim()) return;
    
    const lang = selectedLang === 'auto'
      ? (containsPersian(inputText) ? 'fa-IR' : 'en-US')
      : selectedLang;
    
    sendMessage(inputText, lang);
    setInputText('');
  };

  // شروع ضبط صدا
  const startListening = () => {
    if (!recognitionRef.current) {
      console.warn('Speech recognition not supported');
      return;
    }
    if (!isListening) {
      recognitionRef.current.lang = selectedLang === 'auto' ? 'fa-IR' : selectedLang;
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.error('Error starting recognition:', e);
      }
    }
  };

  // توقف ضبط صدا
  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
        setIsListening(false);
      } catch (e) {
        console.error('Error stopping recognition:', e);
      }
    }
  };

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    startListening,
    stopListening,
  }));

  const handleMicClick = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser');
      return;
    }
    
    if (!isListening) {
      startListening();
    } else {
      stopListening();
    }
  };

  // TTS برای پاسخ agent
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.type === 'done' && lastMessage.text) {
        setIsSpeaking(true);
        speakText(lastMessage.text, lastMessage.lang || 'en-US');
      }
    }
  }, [messages]);

  const speakText = (text: string, lang: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="p-4 bg-gray-900">
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={!isConnected}
        />
        <button
          onClick={handleSend}
          disabled={!isConnected || !inputText.trim()}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          Send
        </button>
      </div>
      
      <VoiceControls
        onMicClick={handleMicClick}
        isListening={isListening}
        selectedLang={selectedLang}
        onLangChange={setSelectedLang}
      />
    </div>
  );
});

ChatInterface.displayName = 'ChatInterface';

export default ChatInterface;

