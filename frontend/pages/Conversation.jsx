import React, { useState, useEffect, useRef } from "react";
import { Message, Developer, User } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, ArrowLeft, MessageCircle, Code } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

export default function Conversation() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [otherUser, setOtherUser] = useState(null);
  const [otherUserProfile, setOtherUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const otherUserId = urlParams.get("user");

    if (otherUserId) {
      loadChatData(otherUserId);
    } else {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadChatData = async (otherUserId) => {
    try {
      const user = await User.me();
      setCurrentUser(user);
      setOtherUser(otherUserId);

      const developers = await Developer.filter({ created_by: otherUserId });
      if (developers.length > 0) {
        setOtherUserProfile(developers[0]);
      }

      const allMessages = await Message.list("-created_date", 100);
      const chatMessages = allMessages
        .filter(
          (msg) =>
            (msg.sender_id === user.id && msg.receiver_id === otherUserId) ||
            (msg.sender_id === otherUserId && msg.receiver_id === user.id)
        )
        .reverse();

      setMessages(chatMessages);
    } catch (error) {
      console.error("Error loading chat data:", error);
    }
    setIsLoading(false);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    try {
      const messageData = {
        sender_id: currentUser.id,
        receiver_id: otherUser,
        content: newMessage.trim(),
      };

      const createdMessage = await Message.create(messageData);
      setMessages((prev) => [...prev, createdMessage]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
    setIsSending(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="p-4 rounded-full bg-[var(--surface)]"
        >
          <MessageCircle className="w-8 h-8 text-[var(--primary)]" />
        </motion.div>
      </div>
    );
  }

  if (!otherUserProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold text-white">Select a conversation</h2>
        <p className="text-[var(--text-muted)]">
          Choose a friend from the list to start chatting.
        </p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[var(--background)]">
      {/* Chat Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-morphism border-b border-[var(--glass-border)] z-10"
      >
        <div className="flex items-center p-4">
          <Link to={createPageUrl("ChatList")}>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>

          <div className="flex items-center space-x-3 ml-2">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-[var(--surface)]">
              {otherUserProfile.avatar_url ? (
                <img
                  src={otherUserProfile.avatar_url}
                  alt={otherUserProfile.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Code className="w-6 h-6 text-[var(--primary)]" />
                </div>
              )}
            </div>

            <div>
              <h2 className="font-semibold text-white">
                {otherUserProfile.username}
              </h2>
              <p className="text-xs text-[var(--text-muted)]">Online</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => {
            const isOwnMessage = message.sender_id === currentUser.id;
            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-end gap-2 ${
                  isOwnMessage ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-4 py-2 rounded-2xl max-w-sm ${
                    isOwnMessage
                      ? "bg-[var(--primary)] text-black rounded-br-none"
                      : "bg-[var(--surface)] text-white rounded-bl-none"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-morphism border-t border-[var(--glass-border)] p-4"
      >
        <div className="flex items-center gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
            className="bg-[var(--surface)] border-none text-white placeholder-[var(--text-muted)]"
            disabled={isSending}
          />
          <Button
            onClick={sendMessage}
            disabled={!newMessage.trim() || isSending}
            className="bg-[var(--primary)] hover:bg-[var(--primary-light)] text-black rounded-full w-10 h-10 p-0"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
