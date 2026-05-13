"use client";

import React, { useState, useRef, useEffect } from "react";
import { X, Send } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { platform } from "os";
interface Message {
  id: string;
  type: "user" | "bot";
  text: string;
  timestamp: number;
}

interface UserData {
  id: string;
  name: string;
}

interface ChatBoxProps {
  buttonText?: string;
  backgroundColor?: string;
  textColor?: string;
  userId?: string;
  userName?: string;
  webhookUrl?: string;
  onSendMessage?: (message: string) => void;
}

const ChatBox: React.FC<ChatBoxProps> = ({ buttonText = "Chat", backgroundColor = "#000000", textColor = "#FFFFFF", userId = "123", userName = "Fatin", webhookUrl = "https://n8n.srv1195395.hstgr.cloud/webhook/webhook", onSendMessage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [userData, setUserData] = useState<UserData>({
    id: "123",
    name: "Fatin",
  });

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle sending message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim()) return;

    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      text: inputValue,
      timestamp: Math.floor(Date.now() / 1000),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Call webhook
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: {
            id: userData.id,
            name: userData.name,
            platform: "web",
          },
          message: {
            text: inputValue,
            time: Math.floor(Date.now() / 1000),
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Add bot response to chat
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        text: data.data?.message || "Sorry, I could not process your message.",
        timestamp: data.data?.timestamp || Math.floor(Date.now() / 1000),
      };

      setMessages((prev) => [...prev, botMessage]);

      // Call optional callback
      if (onSendMessage) {
        onSendMessage(inputValue);
      }
    } catch (error) {
      console.error("Error sending message:", error);

      // Add error message to chat
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        text: "Sorry, there was an error processing your message. Please try again.",
        timestamp: Math.floor(Date.now() / 1000),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        style={{
          backgroundColor,
          color: textColor,
        }}
        className="fixed bottom-4 right-4 px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-shadow duration-300 hover:opacity-90 z-40"
        aria-label="Open chat"
      >
        {buttonText}
      </button>

      {/* Chat Box Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-end p-4 z-50">
          {/* Chat Window */}
          <div
            className="w-full sm:w-96 h-96 sm:h-[500px] rounded-lg shadow-2xl flex flex-col overflow-hidden bg-white"
            style={{
              backgroundColor: "#ffffff",
            }}
          >
            {/* Header */}
            <div
              style={{
                backgroundColor,
                color: textColor,
              }}
              className="px-4 py-4 flex items-center justify-between"
            >
              <div>
                <h2 className="font-bold text-lg">Chat Support</h2>
                <p className="text-sm opacity-90">Always here to help</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-opacity-20 hover:bg-white rounded-md transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.length === 0 && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div
                      className="w-12 h-12 rounded-full mx-auto mb-3"
                      style={{
                        backgroundColor,
                        opacity: 0.2,
                      }}
                    />
                    <p
                      style={{
                        color: "#666",
                      }}
                      className="text-sm"
                    >
                      Start a conversation with our support team
                    </p>
                  </div>
                </div>
              )}

              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${message.type === "user" ? "text-white rounded-br-none" : "bg-gray-200 text-gray-900 rounded-bl-none"}`}
                    style={
                      message.type === "user"
                        ? {
                            backgroundColor,
                          }
                        : {}
                    }
                  >
                    <ReactMarkdown>{message.text}</ReactMarkdown>
                    <p className={`text-xs mt-1 ${message.type === "user" ? "opacity-70" : "text-gray-600"}`}>
                      {new Date(message.timestamp * 1000).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 text-gray-900 rounded-lg rounded-bl-none px-4 py-3">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                      <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="border-t bg-white p-4 flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isLoading}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                style={{
                  focusRingColor: backgroundColor,
                }}
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                style={{
                  backgroundColor: isLoading || !inputValue.trim() ? "#ccc" : backgroundColor,
                  color: textColor,
                }}
                className="px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBox;
