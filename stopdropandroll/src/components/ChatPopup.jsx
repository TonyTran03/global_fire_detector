  "use client"; // Required for React components in the app directory

  import { useState } from "react";

  export default function ChatPopup() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
      if (!input.trim()) return;

      const userMessage = { role: "user", content: input };
      setMessages([...messages, userMessage]);
      setInput("");
      setLoading(true);

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: [...messages, userMessage] }),
        });

        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }

        const data = await response.json();
        setMessages([...messages, userMessage, data.completion]);
      } catch (error) {
        console.error("Error:", error.message);
        alert("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    return (
  <div className="flex flex-col h-screen max-h-[-90] p-2">
    {/* Chat Messages */}
    <div className="flex-1 overflow-y-auto border border-gray-300 p-2 rounded-lg mb-2 max-h-48">
      {messages.length === 0 && (
        <p className="text-sm text-gray-500">Trucky can make mistakes. Check important info.</p>
      )}
      {messages.map((msg, index) => (
        <div key={index} className="mb-1">
          <strong
            className={msg.role === "user" ? "text-blue-600" : "text-green-600"}
          >
            {msg.role === "user" ? "You: " : "Bot: "}
          </strong>
          <span>{msg.content}</span>
        </div>
      ))}
    </div>

    {/* Input Box */}
    <div className="flex items-center">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
        className="flex-1 px-4 py-1 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
      />
      <button
        onClick={sendMessage}
        disabled={loading}
        className={`px-4 py-1 bg-blue-600 text-white rounded-r-lg text-sm ${
          loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
        }`}
      >
        {loading ? "Sending..." : "Send"}
      </button>
    </div>
  </div>

    );
  }
