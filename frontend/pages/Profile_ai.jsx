import React, { useState, useEffect } from "react";
import { Developer, User, Connection } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MapPin,
  Github,
  Linkedin,
  ExternalLink,
  Code,
  Users,
  Heart,
  MessageCircle,
  Edit,
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ connections: 0, requests: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);

      const developers = await Developer.filter({
        created_by: currentUser.email,
      });
      if (developers.length > 0) {
        setProfile(developers[0]);
      }

      // Load stats
      const connections = await Connection.filter({
        $or: [
          { requester_id: currentUser.id, status: "accepted" },
          { receiver_id: currentUser.id, status: "accepted" },
        ],
      });

      const requests = await Connection.filter({
        receiver_id: currentUser.id,
        status: "pending",
      });

      setStats({
        connections: connections.length,
        requests: requests.length,
      });
    } catch (error) {
      console.error("Error loading profile:", error);
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="glass-morphism rounded-full p-4"
        >
          <Code className="w-8 h-8 text-white" />
        </motion.div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card rounded-3xl p-8 text-center max-w-md mx-auto"
        >
          <div className="w-20 h-20 mx-auto mb-6 glass-morphism rounded-full flex items-center justify-center">
            <Code className="w-10 h-10 text-purple-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Create Your Profile
          </h2>
          <p className="text-white/80 mb-6">
            Set up your developer profile to start connecting with other
            developers!
          </p>
          <Link to={createPageUrl("EditProfile")}>
            <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700">
              <Edit className="w-4 h-4 mr-2" />
              Create Profile
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 pt-20">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-3xl p-8"
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden glass-morphism">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-400 to-pink-500">
                    <Code className="w-16 h-16 text-white" />
                  </div>
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 glass-morphism rounded-full p-2">
                <div className="w-4 h-4 bg-green-400 rounded-full"></div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-white mb-2">
                {profile.username}
              </h1>
              {profile.location && (
                <div className="flex items-center justify-center md:justify-start mb-4">
                  <MapPin className="w-4 h-4 text-white/60 mr-1" />
                  <span className="text-white/80">{profile.location}</span>
                </div>
              )}
              <p className="text-white/90 mb-6">{profile.bio}</p>

              {/* Stats */}
              <div className="flex justify-center md:justify-start gap-6 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {stats.connections}
                  </div>
                  <div className="text-xs text-white/60">Connections</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {stats.requests}
                  </div>
                  <div className="text-xs text-white/60">Requests</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {profile.projects?.length || 0}
                  </div>
                  <div className="text-xs text-white/60">Projects</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <Link to={createPageUrl("EditProfile")}>
                  <Button className="glass-morphism border-white/20 hover:bg-white/20">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </Link>
                <Link to={createPageUrl("Connections")}>
                  <Button className="glass-morphism border-white/20 hover:bg-white/20">
                    <Users className="w-4 h-4 mr-2" />
                    View Connections
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Content Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Tabs defaultValue="about" className="space-y-6">
            <div className="glass-card rounded-2xl p-2">
              <TabsList className="grid w-full grid-cols-3 bg-transparent">
                <TabsTrigger
                  value="about"
                  className="data-[state=active]:glass-morphism data-[state=active]:text-white text-white/70"
                >
                  About
                </TabsTrigger>
                <TabsTrigger
                  value="projects"
                  className="data-[state=active]:glass-morphism data-[state=active]:text-white text-white/70"
                >
                  Projects
                </TabsTrigger>
                <TabsTrigger
                  value="links"
                  className="data-[state=active]:glass-morphism data-[state=active]:text-white text-white/70"
                >
                  Links
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="about" className="space-y-6">
              {/* Tech Stack */}
              {profile.tech_stack && profile.tech_stack.length > 0 && (
                <Card className="glass-card border-0">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-white mb-4">
                      Tech Stack
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {profile.tech_stack.map((tech, index) => (
                        <Badge
                          key={index}
                          className="glass-morphism text-white border-white/20 px-4 py-2 text-sm"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="projects" className="space-y-4">
              {profile.projects && profile.projects.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {profile.projects.map((project, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="glass-card border-0 hover:scale-105 transition-transform duration-200">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="text-lg font-semibold text-white">
                              {project.name}
                            </h4>
                            {project.url && (
                              <a
                                href={project.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-white/60 hover:text-white transition-colors"
                              >
                                <ExternalLink className="w-5 h-5" />
                              </a>
                            )}
                          </div>
                          <p className="text-white/80 text-sm mb-4">
                            {project.description}
                          </p>
                          {project.image_url && (
                            <div className="rounded-xl overflow-hidden glass-morphism">
                              <img
                                src={project.image_url}
                                alt={project.name}
                                className="w-full h-32 object-cover"
                              />
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <Card className="glass-card border-0">
                  <CardContent className="p-8 text-center">
                    <Code className="w-12 h-12 text-white/40 mx-auto mb-4" />
                    <p className="text-white/60">No projects added yet</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="links" className="space-y-4">
              <Card className="glass-card border-0">
                <CardContent className="p-6 space-y-4">
                  {profile.github_url && (
                    <a
                      href={profile.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-4 glass-morphism rounded-xl hover:bg-white/10 transition-all duration-200"
                    >
                      <Github className="w-6 h-6 text-white mr-4" />
                      <div>
                        <div className="text-white font-medium">GitHub</div>
                        <div className="text-white/60 text-sm">
                          View my repositories
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-white/60 ml-auto" />
                    </a>
                  )}

                  {profile.linkedin_url && (
                    <a
                      href={profile.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-4 glass-morphism rounded-xl hover:bg-white/10 transition-all duration-200"
                    >
                      <Linkedin className="w-6 h-6 text-white mr-4" />
                      <div>
                        <div className="text-white font-medium">LinkedIn</div>
                        <div className="text-white/60 text-sm">
                          Professional profile
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-white/60 ml-auto" />
                    </a>
                  )}

                  {!profile.github_url && !profile.linkedin_url && (
                    <div className="text-center py-8">
                      <ExternalLink className="w-12 h-12 text-white/40 mx-auto mb-4" />
                      <p className="text-white/60">No social links added yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
