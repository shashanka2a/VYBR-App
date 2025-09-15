import { useState } from "react";
import { Home, MessageSquare, Users, Calendar, User } from "lucide-react";
import { HomeTab } from "./components/HomeTab";
import { ChatbotTab } from "./components/ChatbotTab";
import { RoomiesTab } from "./components/RoomiesTab";
import { ProfileTab } from "./components/ProfileTab";
import { Button } from "./components/ui/button";

const tabs = [
  { id: "home", label: "Home", icon: Home, component: HomeTab },
  { id: "chat", label: "My Vibe AI", icon: MessageSquare, component: ChatbotTab },
  { id: "roomies", label: "Roomies", icon: Users, component: RoomiesTab },
  { id: "profile", label: "Profile", icon: User, component: ProfileTab },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("home");

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || HomeTab;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-sm sm:max-w-md mx-auto relative">
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <ActiveComponent />
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm sm:max-w-md bg-white border-t border-gray-200 px-2 py-2 z-50">
        <div className="flex justify-around items-center">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <Button
                key={tab.id}
                variant="ghost"
                onClick={() => setActiveTab(tab.id)}
                className={`flex-col space-y-1 h-16 px-1 min-w-0 flex-1 ${
                  isActive 
                    ? "text-indigo-600 bg-indigo-50" 
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-indigo-600" : ""}`} />
                <span className={`text-xs ${isActive ? "font-medium" : ""} truncate max-w-full`}>
                  {tab.id === "chat" ? "AI" : tab.label}
                </span>
                {isActive && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
                )}
              </Button>
            );
          })}
        </div>
      </div>

      {/* PWA Status Bar Spacer */}
      <div className="h-safe-area-inset-bottom"></div>
    </div>
  );
}