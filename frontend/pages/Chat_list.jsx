import React, { useState, useEffect } from "react";
import { Developer, Connection, User, Message } from "@/entities/all";
import { Card } from "@/components/ui/card";
import { MessageCircle, Users, Code } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";

export default function ChatList() {
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    setIsLoading(true);
    try {
      const user = await User.me();

      const acceptedConnections = await Connection.filter({
        status: "accepted",
        $or: [{ requester_id: user.id }, { receiver_id: user.id }],
      });

      if (acceptedConnections.length === 0) {
        setIsLoading(false);
        return;
      }

      const connectionUserIds = acceptedConnections.map((conn) =>
        conn.requester_id === user.id ? conn.receiver_id : conn.requester_id
      );

      const allDevelopers = await Developer.list();
      const allMessages = await Message.list("-created_date");

      const convos = connectionUserIds
        .map((userId) => {
          const developer = allDevelopers.find(
            (dev) => dev.created_by === userId
          );
          const lastMessage = allMessages.find(
            (msg) =>
              (msg.sender_id === userId && msg.receiver_id === user.id) ||
              (msg.sender_id === user.id && msg.receiver_id === userId)
          );
          return { developer, lastMessage };
        })
        .filter((c) => c.developer); // Ensure developer profile exists

      setConversations(
        convos.sort(
          (a, b) =>
            new Date(b.lastMessage?.created_date || 0) -
            new Date(a.lastMessage?.created_date || 0)
        )
      );
    } catch (error) {
      console.error("Error loading conversations:", error);
    }
    setIsLoading(false);
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

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold purple-text mb-2">Chats</h1>
          <p className="text-[var(--text-muted)]">Your recent conversations.</p>
        </motion.div>

        {conversations.length > 0 ? (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            {conversations.map(({ developer, lastMessage }) => (
              <motion.div
                key={developer.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ backgroundColor: "rgba(163, 127, 255, 0.1)" }}
                className="rounded-xl transition-colors"
              >
                <Link
                  to={createPageUrl(
                    `Conversation?user=${developer.created_by}`
                  )}
                >
                  <div className="flex items-center p-4 glass-morphism rounded-xl">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-full overflow-hidden bg-[var(--surface)]">
                        {developer.avatar_url ? (
                          <img
                            src={developer.avatar_url}
                            alt={developer.username}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Code className="w-8 h-8 text-[var(--primary)]" />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex-1 ml-4">
                      <h3 className="font-semibold text-white">
                        {developer.username}
                      </h3>
                      <p className="text-sm text-[var(--text-muted)] truncate">
                        {lastMessage ? lastMessage.content : "No messages yet"}
                      </p>
                    </div>
                    {lastMessage && (
                      <div className="text-xs text-[var(--text-muted)]">
                        {formatDistanceToNow(
                          new Date(lastMessage.created_date),
                          { addSuffix: true }
                        )}
                      </div>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-morphism rounded-3xl p-12 text-center mt-16"
          >
            <Users className="w-16 h-16 mx-auto mb-6 text-[var(--primary)]" />
            <h2 className="text-2xl font-bold text-white mb-4">
              No friends to chat with
            </h2>
            <p className="text-[var(--text-muted)]">
              Connect with other developers to start a conversation.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
