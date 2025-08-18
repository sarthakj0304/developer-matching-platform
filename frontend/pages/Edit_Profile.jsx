import React, { useState, useEffect } from "react";
import { Developer, User } from "@/entities/all";
import { UploadFile } from "@/integrations/Core";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  X,
  Plus,
  Save,
  ArrowLeft,
  Camera,
  Github,
  Linkedin,
  Code,
  MapPin,
  User as UserIcon,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function EditProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    bio: "",
    location: "",
    avatar_url: "",
    tech_stack: [],
    projects: [],
    github_url: "",
    linkedin_url: "",
  });
  const [newTech, setNewTech] = useState("");
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    url: "",
    image_url: "",
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [dragActive, setDragActive] = useState(false);

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
        const profile = developers[0];
        setFormData({
          username: profile.username || "",
          bio: profile.bio || "",
          location: profile.location || "",
          avatar_url: profile.avatar_url || "",
          tech_stack: profile.tech_stack || [],
          projects: profile.projects || [],
          github_url: profile.github_url || "",
          linkedin_url: profile.linkedin_url || "",
        });
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (file, field) => {
    setIsUploading(true);
    try {
      const { file_url } = await UploadFile({ file });
      handleInputChange(field, file_url);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
    setIsUploading(false);
  };

  const handleDrop = (e, field) => {
    e.preventDefault();
    setDragActive(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0], field);
    }
  };

  const addTech = () => {
    if (newTech.trim() && !formData.tech_stack.includes(newTech.trim())) {
      setFormData((prev) => ({
        ...prev,
        tech_stack: [...prev.tech_stack, newTech.trim()],
      }));
      setNewTech("");
    }
  };

  const removeTech = (tech) => {
    setFormData((prev) => ({
      ...prev,
      tech_stack: prev.tech_stack.filter((t) => t !== tech),
    }));
  };

  const addProject = () => {
    if (newProject.name.trim()) {
      setFormData((prev) => ({
        ...prev,
        projects: [...prev.projects, { ...newProject }],
      }));
      setNewProject({ name: "", description: "", url: "", image_url: "" });
      setShowProjectForm(false);
    }
  };

  const removeProject = (index) => {
    setFormData((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    if (!formData.username.trim() || !formData.bio.trim()) {
      alert("Username and bio are required!");
      return;
    }

    setIsSaving(true);
    try {
      const developers = await Developer.filter({ created_by: user.email });

      if (developers.length > 0) {
        await Developer.update(developers[0].id, formData);
      } else {
        await Developer.create(formData);
      }

      navigate(createPageUrl("Profile"));
    } catch (error) {
      console.error("Error saving profile:", error);
    }
    setIsSaving(false);
  };

  return (
    <div className="min-h-screen p-4 pt-20">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center space-x-4">
            <Link to={createPageUrl("Profile")}>
              <Button
                variant="ghost"
                size="icon"
                className="glass-morphism text-white"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-white">Edit Profile</h1>
          </div>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
          >
            {isSaving ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Save className="w-4 h-4 mr-2" />
              </motion.div>
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Profile
          </Button>
        </motion.div>

        {/* Avatar Upload */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass-card border-0">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Camera className="w-5 h-5 mr-2" />
                Profile Picture
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-32 h-32 rounded-full overflow-hidden glass-morphism">
                  {formData.avatar_url ? (
                    <img
                      src={formData.avatar_url}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-400 to-pink-500">
                      <UserIcon className="w-16 h-16 text-white" />
                    </div>
                  )}
                </div>

                <div
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ${
                    dragActive
                      ? "border-purple-400 bg-purple-400/10"
                      : "border-white/30 hover:border-white/50"
                  }`}
                  onDrop={(e) => handleDrop(e, "avatar_url")}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragActive(true);
                  }}
                  onDragLeave={() => setDragActive(false)}
                  onClick={() =>
                    document.getElementById("avatar-upload").click()
                  }
                >
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      e.target.files[0] &&
                      handleFileUpload(e.target.files[0], "avatar_url")
                    }
                    className="hidden"
                  />
                  <Upload className="w-8 h-8 text-white/60 mx-auto mb-2" />
                  <p className="text-white/80 text-sm">
                    Drop your photo here or click to browse
                  </p>
                  {isUploading && (
                    <p className="text-purple-400 text-xs mt-2">Uploading...</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Basic Info */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass-card border-0">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Code className="w-5 h-5 mr-2" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="username" className="text-white">
                  Username *
                </Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) =>
                    handleInputChange("username", e.target.value)
                  }
                  className="glass-morphism border-white/20 text-white placeholder-white/50"
                  placeholder="Your username"
                />
              </div>

              <div>
                <Label htmlFor="bio" className="text-white">
                  Bio *
                </Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  className="glass-morphism border-white/20 text-white placeholder-white/50 h-24"
                  placeholder="Tell other developers about yourself..."
                />
              </div>

              <div>
                <Label
                  htmlFor="location"
                  className="text-white flex items-center"
                >
                  <MapPin className="w-4 h-4 mr-1" />
                  Location
                </Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  className="glass-morphism border-white/20 text-white placeholder-white/50"
                  placeholder="City, Country"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tech Stack */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass-card border-0">
            <CardHeader>
              <CardTitle className="text-white">Tech Stack</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newTech}
                  onChange={(e) => setNewTech(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addTech()}
                  className="glass-morphism border-white/20 text-white placeholder-white/50"
                  placeholder="Add a technology"
                />
                <Button
                  onClick={addTech}
                  className="glass-morphism border-white/20 hover:bg-white/20"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                <AnimatePresence>
                  {formData.tech_stack.map((tech, index) => (
                    <motion.div
                      key={tech}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Badge className="glass-morphism text-white border-white/20 pr-1">
                        {tech}
                        <button
                          onClick={() => removeTech(tech)}
                          className="ml-2 hover:bg-red-500/20 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Projects */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="glass-card border-0">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Projects</CardTitle>
                <Button
                  onClick={() => setShowProjectForm(!showProjectForm)}
                  className="glass-morphism border-white/20 hover:bg-white/20"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Project
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <AnimatePresence>
                {showProjectForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="glass-morphism rounded-xl p-4 space-y-3"
                  >
                    <Input
                      value={newProject.name}
                      onChange={(e) =>
                        setNewProject((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className="glass-morphism border-white/20 text-white placeholder-white/50"
                      placeholder="Project name"
                    />
                    <Textarea
                      value={newProject.description}
                      onChange={(e) =>
                        setNewProject((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      className="glass-morphism border-white/20 text-white placeholder-white/50 h-20"
                      placeholder="Project description"
                    />
                    <Input
                      value={newProject.url}
                      onChange={(e) =>
                        setNewProject((prev) => ({
                          ...prev,
                          url: e.target.value,
                        }))
                      }
                      className="glass-morphism border-white/20 text-white placeholder-white/50"
                      placeholder="Project URL (optional)"
                    />

                    <div className="flex gap-2">
                      <Button
                        onClick={addProject}
                        className="bg-green-500 hover:bg-green-600"
                      >
                        Add Project
                      </Button>
                      <Button
                        onClick={() => setShowProjectForm(false)}
                        variant="outline"
                        className="glass-morphism border-white/20 hover:bg-white/20"
                      >
                        Cancel
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-3">
                <AnimatePresence>
                  {formData.projects.map((project, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.1 }}
                      className="glass-morphism rounded-xl p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-white font-medium">
                            {project.name}
                          </h4>
                          <p className="text-white/70 text-sm mt-1">
                            {project.description}
                          </p>
                          {project.url && (
                            <a
                              href={project.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-purple-400 text-sm hover:underline"
                            >
                              View Project
                            </a>
                          )}
                        </div>
                        <button
                          onClick={() => removeProject(index)}
                          className="text-red-400 hover:text-red-300 p-1 rounded-full hover:bg-red-500/20"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="glass-card border-0">
            <CardHeader>
              <CardTitle className="text-white">Social Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label
                  htmlFor="github"
                  className="text-white flex items-center"
                >
                  <Github className="w-4 h-4 mr-1" />
                  GitHub
                </Label>
                <Input
                  id="github"
                  value={formData.github_url}
                  onChange={(e) =>
                    handleInputChange("github_url", e.target.value)
                  }
                  className="glass-morphism border-white/20 text-white placeholder-white/50"
                  placeholder="https://github.com/username"
                />
              </div>

              <div>
                <Label
                  htmlFor="linkedin"
                  className="text-white flex items-center"
                >
                  <Linkedin className="w-4 h-4 mr-1" />
                  LinkedIn
                </Label>
                <Input
                  id="linkedin"
                  value={formData.linkedin_url}
                  onChange={(e) =>
                    handleInputChange("linkedin_url", e.target.value)
                  }
                  className="glass-morphism border-white/20 text-white placeholder-white/50"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
