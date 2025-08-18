import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Code, UserPlus } from "lucide-react";

export default function DeveloperCard({ developer, onConnect }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="h-full"
    >
      <Card className="glass-morphism rounded-2xl overflow-hidden h-full flex flex-col border-[var(--glass-border)]">
        <div className="relative h-48 bg-gradient-to-br from-[#17162b] to-[#0d0c1d]">
          {developer.avatar_url ? (
            <img
              src={developer.avatar_url}
              alt={developer.username}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Code className="w-16 h-16 text-[var(--primary)]" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-xl font-bold text-white">
              {developer.username}
            </h3>
            {developer.location && (
              <div className="flex items-center text-white/80 text-sm">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{developer.location}</span>
              </div>
            )}
          </div>
        </div>

        <CardContent className="p-4 flex-grow">
          <p className="text-[var(--text-muted)] text-sm mb-4 line-clamp-3">
            {developer.bio}
          </p>
          {developer.tech_stack?.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-[var(--primary-light)] mb-2">
                Top Skills
              </h4>
              <div className="flex flex-wrap gap-2">
                {developer.tech_stack.slice(0, 4).map((tech) => (
                  <Badge
                    key={tech}
                    variant="secondary"
                    className="bg-[var(--surface)] text-[var(--text-muted)] border-none"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="p-4 border-t border-[var(--glass-border)]">
          <Button
            onClick={() => onConnect(developer)}
            className="w-full bg-[var(--primary)] hover:bg-[var(--primary-light)] text-black"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Connect
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
