'use client';
import { useState, useEffect } from 'react';
import io, { Socket } from 'socket.io-client';
import axios from 'axios'; // Import axios

// Define types for the message and user
interface Message {
  _id: string;
  sender: string;
  receiver: string;
  message: string;
  timestamp: Date;
  status: 'Delivered' | 'Seen';
}

const socket: Socket = io('http://localhost:8080'); // Connect to your server

export default function ChatApp() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>('');
  const [sender] = useState<string>('Obi-Wan Kenobi');
  const [receiver] = useState<string>('Anakin');

  // Fetch chat messages on component mount using Axios
  useEffect(() => {
    axios
      .get('http://localhost:8080/messages') // Use Axios to fetch messages from your server
      .then((response) => {
        setMessages(response.data); // Set fetched messages
      })
      .catch((err) => console.error('Failed to fetch messages:', err));
  }, []);

  useEffect(() => {
    // Listen for new messages from the server
    socket.on('newMessage', (newMessage: Message) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    // Listen for "seen" updates
    socket.on('messageSeen', (updatedMessage: Message) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg._id === updatedMessage._id ? updatedMessage : msg
        )
      );
    });

    // Cleanup socket listeners on unmount
    return () => {
      socket.off('newMessage');
      socket.off('messageSeen');
    };
  }, []);

  // Send message function using Socket.io
  const handleSendMessage = () => {
    const newMessage: Message = {
      _id: new Date().toISOString(), // Generating unique ID (you could use MongoDB ObjectId in real app)
      sender,
      receiver,
      message,
      timestamp: new Date(),
      status: 'Delivered',
    };

    socket.emit('sendMessage', newMessage); // Emit the message to the backend 
    setMessage(''); // Reset message input field
  };

  // Mark message as "seen"
  const handleMarkAsSeen = (messageId: string) => {
    socket.emit('markAsSeen', messageId); // Notify server to mark the message as seen
  };

  return (
    <div className="flex flex-col max-h-screen overflow-hidden p-4 bg-gray-50">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`flex ${msg.sender === sender ? 'justify-start' : 'justify-end'} space-x-2`}
          >
            {/* Avatar */}
            <div className="flex-shrink-0">
              <img
                src={`https://img.daisyui.com/images/profile/demo/${
                  msg.sender === 'Obi-Wan Kenobi' ? 'kenobee' : 'anakeen'
                }@192.webp`}
                alt={msg.sender}
                className="w-10 h-10 rounded-full"
              />
            </div>

            {/* Message Bubble */}
            <div className="flex flex-col max-w-xs sm:max-w-md">
              <div className="text-xs text-gray-500">
                <span>{msg.sender}</span>
                <span className="ml-1">{new Date(msg.timestamp).toLocaleTimeString()}</span>
              </div>
              <div
                className={`p-3 rounded-lg text-white ${
                  msg.sender === sender
                    ? 'bg-blue-500'
                    : 'bg-green-500'
                }`}
              >
                {msg.message}
              </div>
              <div className="text-xs text-gray-400 mt-1">{msg.status}</div>

              {/* Mark as Seen Button */}
              {msg.status === 'Delivered' && (
                <button
                  onClick={() => handleMarkAsSeen(msg._id)}
                  className="mt-1 bg-green-500 text-white px-3 py-1 rounded-md text-sm"
                >
                  Mark as Seen
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="flex items-center mt-4 space-x-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Send
        </button>
      </div>
    </div>
  );
}
