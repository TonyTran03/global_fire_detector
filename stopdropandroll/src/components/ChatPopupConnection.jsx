import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const ChatPopup = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
  
    const userMessage = { role: 'user', content: inputMessage };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
  
    try {
      const response = await fetch('http://127.0.0.1:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputMessage }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to get a response from the server.');
      }
  
      const data = await response.json(); 
  
      if (data.reply) { 
        const botMessage = { role: 'assistant', content: data.reply };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        const errorMessage = { role: 'assistant', content: 'Something went wrong. Please try again.' };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      const errorMessage = { role: 'assistant', content: 'Error communicating with the server.' };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 right-4 w-80 h-96 bg-white rounded-lg shadow-xl flex flex-col">
      {/* Header */}
      <div className="bg-blue-500 text-white p-4 rounded-t-lg flex justify-between items-center">
        <h3 className="font-medium">Fire Bot</h3>
        <button 
          onClick={onClose}
          className="text-white hover:text-gray-200 transition-colors duration-200"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 ${
              message.role === 'user' ? 'text-right' : 'text-left'
            }`}
          >
            <div
              className={`inline-block p-2 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatPopup; 