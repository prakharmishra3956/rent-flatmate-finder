"use client";

import React, { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { getChatHistory } from "../../services/chatService";
import { getCurrentUser } from "../../services/authService";
import { Send, Loader2, User, X } from "lucide-react";

interface Message {
  _id?: string;
  sender: string;
  recipient: string;
  content: string;
  createdAt: string;
}

interface ChatWindowProps {
  listingId: string;
  tenantId: string;
  recipientId: string;
  recipientName: string;
  onClose?: () => void;
}

export default function ChatWindow({
  listingId,
  tenantId,
  recipientId,
  recipientName,
  onClose,
}: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);

    // 1. Fetch message history
    const loadHistory = async () => {
      try {
        const history = await getChatHistory(listingId, tenantId);
        setMessages(history);
      } catch (err) {
        console.error("Failed to load chat history", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadHistory();

    // 2. Setup Socket Connection
    const getSocketUrl = () => {
      if (process.env.NEXT_PUBLIC_SOCKET_URL) {
        return process.env.NEXT_PUBLIC_SOCKET_URL;
      }
      if (typeof window !== "undefined") {
        return `http://${window.location.hostname}:5000`;
      }
      return "http://localhost:5000";
    };
    const socketUrl = getSocketUrl();
    const socket = io(socketUrl);
    socketRef.current = socket;

    socket.emit("join_room", { listingId, tenantId });

    socket.on("receive_message", (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, [listingId, tenantId]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !currentUser || !socketRef.current) return;

    const messageData = {
      senderId: currentUser.id,
      recipientId,
      listingId,
      tenantId,
      content: inputText.trim(),
    };

    // Emit send_message to server (it will save and broadcast back)
    socketRef.current.emit("send_message", messageData);
    setInputText("");
  };

  return (
    <div className="flex flex-col h-[500px] w-full md:w-[400px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl overflow-hidden">
      {/* Chat Header */}
      <div className="h-14 bg-indigo-600 text-white px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
            <User className="h-4.5 w-4.5 text-white" />
          </div>
          <div>
            <h4 className="text-sm font-semibold truncate max-w-[200px]">{recipientName}</h4>
            <p className="text-[10px] text-white/80">Active Chat</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg transition-all">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Messages Box */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-zinc-50 dark:bg-zinc-950">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
          </div>
        ) : messages.length > 0 ? (
          messages.map((msg, index) => {
            const isMe = msg.sender === currentUser?.id;
            return (
              <div
                key={index}
                className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                    isMe
                      ? "bg-indigo-600 text-white rounded-br-none"
                      : "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 border border-zinc-150 dark:border-zinc-800 rounded-bl-none"
                  }`}
                >
                  <p className="break-words">{msg.content}</p>
                </div>
                <span className="text-[9px] text-zinc-400 mt-1 px-1">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col h-full items-center justify-center text-center p-6">
            <User className="h-8 w-8 text-zinc-300 dark:text-zinc-700 mb-2" />
            <p className="text-xs font-semibold text-zinc-650 dark:text-zinc-450">No messages yet</p>
            <p className="text-[10px] text-zinc-400 mt-0.5">Send a message to start conversing!</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSendMessage} className="p-3 border-t border-zinc-150 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="h-10 w-10 bg-indigo-600 hover:bg-indigo-700 disabled:bg-zinc-100 disabled:text-zinc-400 dark:disabled:bg-zinc-850 dark:disabled:text-zinc-700 text-white flex items-center justify-center rounded-xl transition-all cursor-pointer"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
