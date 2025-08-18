import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Heart,
  User,
  MessageCircle,
  Users,
  Mail,
  Settings,
  Code,
  Sparkles,
} from "lucide-react";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  const navigationItems = [
    { name: "Feed", path: createPageUrl("Feed"), icon: Sparkles },
    { name: "Profile", path: createPageUrl("Profile"), icon: User },
    {
      name: "Connections",
      path: createPageUrl("ConnectionsList"),
      icon: Users,
    },
    { name: "Requests", path: createPageUrl("RequestsReceived"), icon: Mail },
    { name: "Chats", path: createPageUrl("ChatList"), icon: MessageCircle },
  ];

  return (
    <>
      <style>{`
        :root {
          --background: #0d0c1d;
          --surface: #17162b;
          --primary: #a37fff;
          --primary-light: #c8b6ff;
          --text-main: #e0dff0;
          --text-muted: #8d8c9b;
          --glass-bg: rgba(23, 22, 43, 0.6);
          --glass-border: rgba(163, 127, 255, 0.2);
          --glass-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
        }

        body {
          background-color: var(--background);
          color: var(--text-main);
          min-height: 100vh;
          overflow-x: hidden;
        }

        .glass-morphism {
          background: var(--glass-bg);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid var(--glass-border);
          box-shadow: var(--glass-shadow);
        }
        
        .purple-text {
            color: var(--primary);
        }
      `}</style>

      <div className="min-h-screen bg-[var(--background)]">
        {/* Main Content */}
        <div className="pb-24 pt-20 relative z-10">{children}</div>

        {/* Top Header */}
        <header className="fixed top-0 left-0 right-0 z-20 glass-morphism">
          <div className="flex items-center justify-between p-4 max-w-7xl mx-auto">
            <Link
              to={createPageUrl("Feed")}
              className="flex items-center space-x-2"
            >
              <div className="p-2 rounded-lg bg-gradient-to-r from-[var(--primary)] to-[#c8b6ff]">
                <Code className="w-6 h-6 text-black" />
              </div>
              <span className="text-white font-bold text-xl hidden sm:block">
                DevConnect
              </span>
            </Link>
            <Link
              to={createPageUrl("EditProfile")}
              className="glass-morphism rounded-full p-3 text-white hover:bg-[var(--primary)]/30 transition-all duration-300 shadow-lg"
            >
              <Settings className="w-6 h-6" />
            </Link>
          </div>
        </header>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--surface)] border-t border-[var(--glass-border)]">
          <div className="flex justify-around items-center py-3 px-4 max-w-md mx-auto">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex flex-col items-center space-y-1 p-2 rounded-xl transition-all duration-300 ${
                    isActive
                      ? "text-[var(--primary)]"
                      : "text-[var(--text-muted)] hover:text-white"
                  }`}
                >
                  <Icon className="w-6 h-6" />
                  <span
                    className={`text-xs font-medium transition-all ${
                      isActive ? "text-[var(--primary-light)]" : ""
                    }`}
                  >
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </>
  );
}
