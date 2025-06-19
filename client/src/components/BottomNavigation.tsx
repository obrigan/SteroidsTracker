import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Home, Pill, Syringe, TestTube, User } from "lucide-react";

const tabs = [
  { id: "home", path: "/", icon: Home, label: "Home", color: "medical-blue" },
  { id: "courses", path: "/courses", icon: Pill, label: "Courses", color: "medical-blue" },
  { id: "injections", path: "/injections", icon: Syringe, label: "Injections", color: "health-green" },
  { id: "tests", path: "/blood-tests", icon: TestTube, label: "Tests", color: "energy-orange" },
  { id: "profile", path: "/profile", icon: User, label: "Profile", color: "purple-400" },
];

export function BottomNavigation() {
  const [location, setLocation] = useLocation();

  const getActiveTab = () => {
    const currentTab = tabs.find(tab => tab.path === location);
    return currentTab?.id || "home";
  };

  const activeTab = getActiveTab();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-md">
      <div className="bottom-nav px-2 py-2 safe-bottom">
        <div className="flex justify-around items-center">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setLocation(tab.path)}
                className={`flex flex-col items-center py-2 px-3 touch-target transition-smooth relative ${
                  isActive ? 'text-' + tab.color : 'text-gray-400 hover:text-' + tab.color
                }`}
              >
                <div className="relative">
                  <Icon className={`w-6 h-6 mb-1 ${isActive ? 'text-' + tab.color : ''}`} />
                  {isActive && (
                    <motion.div
                      className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-${tab.color} rounded-full`}
                      layoutId="activeIndicator"
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30
                      }}
                    />
                  )}
                </div>
                <span className={`text-xs font-medium ${isActive ? 'text-' + tab.color : ''}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
