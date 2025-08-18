import React, { useState, useEffect } from "react";
import { Developer, Connection, User } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, Mail, Code, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function RequestsReceived() {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingRequest, setProcessingRequest] = useState(null);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const user = await User.me();

      const pendingRequests = await Connection.filter({
        receiver_id: user.id,
        status: "pending",
      });

      const requesterIds = pendingRequests.map((req) => req.requester_id);
      if (requesterIds.length === 0) {
        setIsLoading(false);
        return;
      }

      const allDevelopers = await Developer.list();

      const requestsWithProfiles = pendingRequests
        .map((request) => {
          const developer = allDevelopers.find(
            (dev) => dev.created_by === request.requester_id
          );
          return { ...request, developer };
        })
        .filter((req) => req.developer);

      setRequests(requestsWithProfiles);
    } catch (error) {
      console.error("Error loading requests:", error);
    }
    setIsLoading(false);
  };

  const handleRequest = async (requestId, action) => {
    setProcessingRequest(requestId);
    try {
      const newStatus = action === "accept" ? "accepted" : "declined";
      const updateData = { status: newStatus };
      if (action === "accept") {
        updateData.matched_at = new Date().toISOString();
      }
      await Connection.update(requestId, updateData);
      setRequests((prev) => prev.filter((req) => req.id !== requestId));
    } catch (error) {
      console.error(`Error ${action}ing request:`, error);
    }
    setProcessingRequest(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="p-4 rounded-full bg-[var(--surface)]"
        >
          <Mail className="w-8 h-8 text-[var(--primary)]" />
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
            Connection Requests
          </h1>
          <p className="text-[var(--text-muted)]">
            {requests.length} pending request{requests.length !== 1 ? "s" : ""}
          </p>
        </motion.div>

        {requests.length > 0 ? (
          <div className="space-y-4">
            <AnimatePresence>
              {requests.map((request) => (
                <motion.div
                  key={request.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100, transition: { duration: 0.3 } }}
                >
                  <Card className="glass-morphism border-0">
                    <CardContent className="p-4 flex flex-col sm:flex-row items-center gap-4">
                      <div className="w-20 h-20 rounded-full overflow-hidden bg-[var(--surface)] flex-shrink-0">
                        {request.developer.avatar_url ? (
                          <img
                            src={request.developer.avatar_url}
                            alt={request.developer.username}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Code className="w-full h-full text-[var(--primary)] p-4" />
                        )}
                      </div>
                      <div className="flex-1 text-center sm:text-left">
                        <h3 className="font-semibold text-white">
                          {request.developer.username}
                        </h3>
                        <p className="text-sm text-[var(--text-muted)] line-clamp-2">
                          {request.developer.bio}
                        </p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <Button
                          onClick={() => handleRequest(request.id, "accept")}
                          disabled={!!processingRequest}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleRequest(request.id, "decline")}
                          disabled={!!processingRequest}
                          size="sm"
                          variant="destructive"
                          className="bg-red-600 hover:bg-red-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-morphism rounded-3xl p-12 text-center mt-16"
          >
            <Mail className="w-16 h-16 mx-auto mb-6 text-[var(--primary)]" />
            <h2 className="text-2xl font-bold text-white mb-4">
              No New Requests
            </h2>
            <p className="text-[var(--text-muted)] mb-6">
              You're all caught up! New requests will appear here.
            </p>
            <Link to={createPageUrl("Feed")}>
              <Button className="bg-[var(--primary)] hover:bg-[var(--primary-light)] text-black">
                <Heart className="w-4 h-4 mr-2" />
                Discover Developers
              </Button>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
