'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, User, Bot } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: number;
  options?: string[];
}

interface ChatbotProps {
  apiEndpoint?: string;
  companyName?: string;
  primaryColor?: string;
  position?: 'bottom-right' | 'bottom-left';
}

const Chatbot: React.FC<ChatbotProps> = ({
  apiEndpoint,
  companyName = "Customer Support",
  primaryColor = "#4285f4",
  position = "bottom-right"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load conversation from localStorage on mount
  useEffect(() => {
    if (!isClient) return;
    
    try {
      const savedMessages = localStorage.getItem('chatbot-messages');
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      } else {
        showWelcomeMessage();
      }
    } catch (error) {
      console.error('Error loading saved messages:', error);
      showWelcomeMessage();
    }
  }, [isClient]);

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    if (!isClient || messages.length === 0) return;
    
    try {
      localStorage.setItem('chatbot-messages', JSON.stringify(messages));
    } catch (error) {
      console.error('Error saving messages:', error);
    }
  }, [messages, isClient]);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const generateId = () => `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const showWelcomeMessage = () => {
    const welcomeMessage: Message = {
      id: generateId(),
      type: 'bot',
      content: `Hi there! 👋 Welcome to ${companyName}. How can I help you today?`,
      timestamp: Date.now(),
      options: [
        'I have a question about pricing',
        'I need technical support', 
        'I want to know about your services',
        'Other inquiry'
      ]
    };
    setMessages([welcomeMessage]);
  };

  const addMessage = (message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: generateId(),
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const clearConversation = () => {
    setMessages([]);
    if (isClient) {
      localStorage.removeItem('chatbot-messages');
    }
    showWelcomeMessage();
  };

  const handleOptionClick = (option: string) => {
    addMessage({
      type: 'user',
      content: option
    });

    setTimeout(() => {
      generateBotResponse(option);
    }, 500);
  };

  const generateBotResponse = async (userMessage: string) => {
    setIsTyping(true);
    
    try {
      let botResponse = '';
      
      if (apiEndpoint) {
        setIsLoading(true);
        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: userMessage,
            history: messages.slice(-10) // Send last 10 messages for context
          })
        });
        
        if (response.ok) {
          const data = await response.json();
          botResponse = data.message || data.response || data.reply || 'Sorry, I didn\'t understand that.';
        } else {
          botResponse = 'Sorry, I\'m having trouble connecting. Please try again.';
        }
        setIsLoading(false);
      } else {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1500));
        botResponse = getSimulatedResponse(userMessage.toLowerCase());
      }

      setIsTyping(false);
      addMessage({
        type: 'bot',
        content: botResponse
      });
    } catch (error) {
      setIsTyping(false);
      setIsLoading(false);
      console.error('Error generating bot response:', error);
      addMessage({
        type: 'bot',
        content: 'Sorry, something went wrong. Please try again later.'
      });
    }
  };

  const getSimulatedResponse = (message: string): string => {
    const responses = {
      pricing: [
        'Our pricing starts at $19/month for the basic plan. We also offer custom enterprise solutions. Would you like me to send you detailed pricing information?',
        'We have flexible pricing options to suit different needs. Our plans range from $19/month to custom enterprise pricing. What specific features are you looking for?'
      ],
      technical: [
        'I\'d be happy to help with technical support! Could you please describe the specific issue you\'re experiencing? Our technical team is available 24/7.',
        'Our technical support team is here to help! Please provide details about the issue you\'re facing, and I\'ll connect you with the right specialist.'
      ],
      services: [
        'We provide comprehensive digital solutions including web development, mobile apps, cloud services, and AI integration. What specific service interests you most?',
        'Our services include custom software development, cloud solutions, mobile applications, and AI-powered tools. Which area would you like to learn more about?'
      ],
      greeting: [
        'Hello! Great to meet you. How can I assist you today?',
        'Hi there! I\'m here to help. What can I do for you?',
        'Hey! Welcome! How may I help you today?'
      ],
      thanks: [
        'You\'re very welcome! Is there anything else I can help you with today?',
        'My pleasure! Feel free to ask if you have any other questions.',
        'Happy to help! Let me know if there\'s anything else you need.'
      ]
    };

    if (message.includes('pricing') || message.includes('price') || message.includes('cost')) {
      return responses.pricing[Math.floor(Math.random() * responses.pricing.length)];
    }
    
    if (message.includes('technical') || message.includes('support') || message.includes('help') || message.includes('issue')) {
      return responses.technical[Math.floor(Math.random() * responses.technical.length)];
    }
    
    if (message.includes('services') || message.includes('what do you do') || message.includes('products')) {
      return responses.services[Math.floor(Math.random() * responses.services.length)];
    }
    
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return responses.greeting[Math.floor(Math.random() * responses.greeting.length)];
    }
    
    if (message.includes('thanks') || message.includes('thank you') || message.includes('thx')) {
      return responses.thanks[Math.floor(Math.random() * responses.thanks.length)];
    }
    
    return 'Thanks for your message! I\'m here to help with any questions about our services, pricing, or technical support. Could you provide a bit more detail about what you\'re looking for?';
  };

  const handleSendMessage = () => {
    if (inputValue.trim() === '' || isTyping || isLoading) return;
    
    addMessage({
      type: 'user',
      content: inputValue.trim()
    });
    
    const message = inputValue.trim();
    setInputValue('');
    
    setTimeout(() => {
      generateBotResponse(message);
    }, 300);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const TypingIndicator = () => (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
        <Bot className="w-4 h-4 text-white" />
      </div>
      <div className="bg-gray-100 rounded-2xl px-4 py-3">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );

  const MessageBubble: React.FC<{ message: Message }> = ({ message }) => (
    <div className={`flex items-start gap-3 mb-4 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
        message.type === 'user' 
          ? 'bg-green-500 text-white' 
          : 'bg-blue-500 text-white'
      }`}>
        {message.type === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>
      <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
        message.type === 'user'
          ? 'bg-blue-500 text-white'
          : 'bg-gray-100 text-gray-800'
      }`}>
        <p className="text-sm leading-relaxed">{message.content}</p>
        {message.options && (
          <div className="mt-3 space-y-2">
            {message.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionClick(option)}
                className="block w-full text-left px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-colors duration-200"
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const positionClasses = position === 'bottom-left' ? 'bottom-5 left-5' : 'bottom-5 right-5';
  const chatPosition = position === 'bottom-left' ? 'bottom-16 left-0' : 'bottom-16 right-0';

  if (!isClient) {
    return null; // Avoid hydration mismatch
  }

  return (
    <div className={`fixed ${positionClasses} z-50`}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-blue-500 hover:bg-blue-600 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-105"
        aria-label="Toggle chat"
      >
        {isOpen ? <X className="w-6 h-6 text-white" /> : <MessageCircle className="w-6 h-6 text-white" />}
      </button>

      {/* Chat Widget */}
      {isOpen && (
        <div className={`absolute ${chatPosition} w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col animate-in slide-in-from-bottom-5 duration-300 max-w-[calc(100vw-2rem)] sm:w-96`}>
          {/* Header */}
          <div className="bg-blue-500 text-white p-5 rounded-t-2xl flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-500 font-bold">
              AI
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-base">{companyName}</h3>
              <p className="text-blue-100 text-xs">Online • Typically replies in minutes</p>
            </div>
            <button
              onClick={clearConversation}
              className="p-1 hover:bg-blue-600 rounded transition-colors text-xs"
              title="Clear conversation"
            >
              Clear
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-blue-600 rounded transition-colors"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                disabled={isTyping || isLoading}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500 disabled:opacity-50 text-sm"
                maxLength={500}
              />
              <button
                onClick={handleSendMessage}
                disabled={isTyping || isLoading || !inputValue.trim()}
                className="w-10 h-10 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-full flex items-center justify-center transition-colors"
                aria-label="Send message"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;