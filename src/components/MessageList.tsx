import { useRef, useEffect } from 'react';

interface Message {
  type: 'delta' | 'done' | 'estimate' | 'error' | 'ack';
  text?: string;
  lang?: string;
}

interface MessageListProps {
  messages: Message[];
  currentText: string;
  userMessages?: string[];
}

export default function MessageList({ messages, currentText, userMessages = [] }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, currentText, userMessages]);

  // Combine and interleave messages
  const allMessages: { type: 'user' | 'agent'; text: string }[] = [];
  const agentMessages = messages.filter(m => m.type === 'done' && m.text);
  
  const maxLen = Math.max(userMessages.length, agentMessages.length);
  for (let i = 0; i < maxLen; i++) {
    if (i < userMessages.length) {
      allMessages.push({ type: 'user', text: userMessages[i] });
    }
    if (i < agentMessages.length && agentMessages[i].text) {
      allMessages.push({ type: 'agent', text: agentMessages[i].text! });
    }
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      {allMessages.length === 0 && !currentText && (
        <div className="text-center text-gray-500 mt-8">
          <p>👋 سلام! چطور می‌تونم کمکتون کنم؟</p>
          <p className="text-sm mt-2">پیام خود را تایپ کنید یا از میکروفون استفاده کنید</p>
        </div>
      )}
      
      {allMessages.map((msg, idx) => (
        <div 
          key={idx} 
          className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div 
            className={`rounded-2xl px-4 py-2 max-w-[80%] ${
              msg.type === 'user' 
                ? 'bg-blue-600 text-white rounded-br-sm' 
                : 'bg-gray-700 text-gray-100 rounded-bl-sm'
            }`}
          >
            <p className="text-sm leading-relaxed">{msg.text}</p>
          </div>
        </div>
      ))}
      
      {/* Streaming Text */}
      {currentText && (
        <div className="flex justify-start">
          <div className="bg-gray-700 text-gray-100 rounded-2xl rounded-bl-sm px-4 py-2 max-w-[80%]">
            <p className="text-sm leading-relaxed">{currentText}</p>
            <span className="inline-block w-2 h-4 bg-blue-500 animate-pulse ml-1"></span>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
}



