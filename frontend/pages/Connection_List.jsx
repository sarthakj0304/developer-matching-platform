import React, { useState, useEffect } from "react";
import { Developer, Connection, User } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle,
  Search,
  Users,
  Code,
  MapPin,
  Github,
  ExternalLink,
  Heart,
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function ConnectionsList() {
  const [connections, setConnections] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadConnections();
  }, []);

  const loadConnections = async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);

      const acceptedConnections = await Connection.filter({
        status: "accepted",
      });

      const userConnections = acceptedConnections.filter(
        (conn) => conn.requester_id === user.id || conn.receiver_id === user.id
      );

      const connectionUserIds = userConnections.map((conn) =>
        conn.requester_id === user.id ? conn.receiver_id : conn.requester_id
      );

      const allDevelopers = await Developer.list();
      const connectedDevelopers = allDevelopers.filter((dev) =>
        connectionUserIds.includes(dev.created_by)
      );

      const connectionsWithMetadata = connectedDevelopers.map((dev) => {
        const connection = userConnections.find(
          (conn) =>
            conn.requester_id === dev.created_by ||
            conn.receiver_id === dev.created_by
        );
        return {
          ...dev,
          connection_date: connection.matched_at,
          connection_id: connection.id,
        };
      });

      setConnections(connectionsWithMetadata);
    } catch (error) {
      console.error("Error loading connections:", error);
    }
    setIsLoading(false);
  };

  const filteredConnections = connections.filter((connection) =>
    connection.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="p-4 rounded-full bg-[var(--surface)]"
        >
          <Users className="w-8 h-8 text-[var(--primary)]" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl font-bold purple-text mb-2">
            My Connections
          </h1>
          <p className="text-[var(--text-muted)]">
            {connections.length} developer{connections.length !== 1 ? "s" : ""}{" "}
            connected
          </p>
        </motion.div>

        <div className="relative">
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="glass-morphism border-[var(--glass-border)] text-white placeholder-[var(--text-muted)] pl-10"
            placeholder="Search connections..."
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
        </div>

        {filteredConnections.length > 0 ? (
          <motion.div
            className="grid gap-6 md:grid-cols-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            {filteredConnections.map((connection, index) => (
              <motion.div
                key={connection.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="glass-morphism border-0 h-full">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-[var(--surface)] flex-shrink-0">
                      {connection.avatar_url ? (
                        <img
                          src={connection.avatar_url}
                          alt={connection.username}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Code className="w-full h-full text-[var(--primary)] p-2" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">
                        {connection.username}
                      </h3>
                      <p className="text-sm text-[var(--text-muted)] line-clamp-1">
                        {connection.bio}
                      </p>
                    </div>
                    <Link
                      to={createPageUrl(
                        `Conversation?user=${connection.created_by}`
                      )}
                    >
                      <Button
                        size="sm"
                        className="bg-[var(--primary)] hover:bg-[var(--primary-light)] text-black"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
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
              No Connections Yet
            </h2>
            <p className="text-[var(--text-muted)] mb-6">
              Start discovering developers to build your network.
            </p>
            <Link to={createPageUrl("Feed")}>
              <Button className="bg-[var(--primary)] hover:bg-[var(--primary-light)] text-black">
                <Heart className="w-4 h-4 mr-2" />
                Find Developers
              </Button>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
