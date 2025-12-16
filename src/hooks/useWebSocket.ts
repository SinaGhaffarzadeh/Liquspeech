import { useEffect, useRef, useState, useCallback } from 'react';

interface Message {
  type: 'delta' | 'done' | 'estimate' | 'error' | 'ack';
  text?: string;
  lang?: string;
  message?: string;
  model?: string;
  input_tokens?: number;
  estimated_cost_usd?: number;
}

interface UseWebSocketReturn {
  sendMessage: (text: string, lang?: string) => void;
  messages: Message[];
  isConnected: boolean;
  currentText: string;
  error: string | null;
}

export function useWebSocket(): UseWebSocketReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [currentText, setCurrentText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const reconnectAttempts = useRef(0);
  const maxReconnect = 6;

  const connect = useCallback(() => {
    // در development از localhost:8000 استفاده می‌کنیم
    // در production از همان host استفاده می‌کنیم
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const isDev = window.location.hostname === 'localhost';
    const host = isDev ? 'localhost:8000' : window.location.host;
    const url = `${protocol}//${host}/ws`;

    try {
      const ws = new WebSocket(url);
      
      ws.onopen = () => {
        setIsConnected(true);
        setError(null);
        reconnectAttempts.current = 0;
        console.log('WebSocket connected');
      };

      ws.onmessage = (event) => {
        try {
          const data: Message = JSON.parse(event.data);
          
          if (data.type === 'delta') {
            setCurrentText(prev => prev + (data.text || ''));
          } else if (data.type === 'done') {
            setCurrentText('');
            setMessages(prev => [...prev, data]);
          } else if (data.type === 'estimate') {
            console.log('Estimate:', data);
          } else if (data.type === 'error') {
            setError(data.message || 'Unknown error');
          }
        } catch (e) {
          console.error('Error parsing WebSocket message:', e);
        }
      };

      ws.onerror = (err) => {
        console.error('WebSocket error:', err);
        setError('Connection error');
      };

      ws.onclose = () => {
        setIsConnected(false);
        console.log('WebSocket closed');
        
        // Reconnect logic
        if (reconnectAttempts.current < maxReconnect) {
          const delay = Math.pow(2, reconnectAttempts.current) * 500;
          reconnectAttempts.current += 1;
          reconnectTimeoutRef.current = setTimeout(connect, delay);
        }
      };

      wsRef.current = ws;
    } catch (e) {
      console.error('Failed to create WebSocket:', e);
      setError('Failed to connect');
    }
  }, []);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);

  const sendMessage = useCallback((text: string, lang?: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'message',
        text,
        lang: lang || null
      }));
    } else {
      setError('Not connected to server');
    }
  }, []);

  return {
    sendMessage,
    messages,
    isConnected,
    currentText,
    error
  };
}



