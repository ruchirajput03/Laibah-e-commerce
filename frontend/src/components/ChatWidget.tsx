'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! 👋 Welcome to Laibah! I'm here to help you find the perfect shoes. How can I assist you today?",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input.trim(),
      isBot: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      const response = await fetch('/api/gemini-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input.trim(),
          history: messages.slice(-5), // Send last 5 messages for context
        }),
      });

      const data = await response.json();

      // Simulate typing delay for better UX
      setTimeout(() => {
        setIsTyping(false);
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.message || data.error || 'Sorry, something went wrong.',
          isBot: true,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, botMessage]);
        setIsLoading(false);
      }, 1200);
    } catch (error) {
      setTimeout(() => {
        setIsTyping(false);
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: 'Sorry, I\'m having trouble connecting. Please try again!',
          isBot: true,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, errorMessage]);
        setIsLoading(false);
      }, 800);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 z-50 ${
          isOpen ? 'scale-0' : 'scale-100'
        }`}
        aria-label="Open chat"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chat Widget */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[380px] h-[500px] bg-white shadow-2xl rounded-2xl flex flex-col border border-gray-200 z-50 animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-full">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold">Laibah Support</h3>
                <p className="text-blue-100 text-xs">Online now</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 p-1 rounded-full transition-colors"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-2 ${
                  message.isBot ? 'justify-start' : 'justify-end'
                } animate-in slide-in-from-bottom-2 duration-200`}
              >
                {message.isBot && (
                  <div className="bg-blue-100 p-1.5 rounded-full flex-shrink-0">
                    <Bot className="w-3 h-3 text-blue-600" />
                  </div>
                )}
                
                <div
                  className={`max-w-[280px] px-3 py-2 rounded-2xl ${
                    message.isBot
                      ? 'bg-white text-gray-800 shadow-sm'
                      : 'bg-blue-600 text-white'
                  } ${
                    message.isBot ? 'rounded-bl-sm' : 'rounded-br-sm'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.text}
                  </p>
                  <p
                    className={`text-xs mt-1 ${
                      message.isBot ? 'text-gray-500' : 'text-blue-100'
                    }`}
                  >
                    {formatTime(message.timestamp)}
                  </p>
                </div>

                {!message.isBot && (
                  <div className="bg-blue-600 p-1.5 rounded-full flex-shrink-0">
                    <User className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-start space-x-2 animate-in slide-in-from-bottom-2 duration-200">
                <div className="bg-blue-100 p-1.5 rounded-full flex-shrink-0">
                  <Bot className="w-3 h-3 text-blue-600" />
                </div>
                <div className="bg-white px-3 py-2 rounded-2xl rounded-bl-sm shadow-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t bg-white p-3 rounded-b-2xl">
            <div className="flex space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about shoes, sizes, returns..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white p-2 rounded-full transition-colors flex-shrink-0"
                aria-label="Send message"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Powered by AI • Press Enter to send
            </p>
          </div>
        </div>
      )}
    </>
  );
}