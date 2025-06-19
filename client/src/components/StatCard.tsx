import { ProgressRing } from "./ProgressRing";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Activity, Syringe, TestTube, Camera, TrendingUp } from "lucide-react";

interface StatCardProps {
  value: number;
  label: string;
  color: "medical-blue" | "health-green" | "energy-orange" | "purple-400";
  progress: number;
  animate?: boolean;
  className?: string;
  icon?: "courses" | "injections" | "tests" | "photos" | "streak";
}

const colorMap = {
  "medical-blue": "#1976D2",
  "health-green": "#4CAF50",
  "energy-orange": "#FF9800",
  "purple-400": "#AB47BC"
};

export function StatCard({ 
  value, 
  label, 
  color, 
  progress, 
  animate = true,
  className = "",
  icon
}: StatCardProps) {
  const getIcon = () => {
    const iconClass = `w-6 h-6 text-${color}`;
    switch (icon) {
      case "courses": return <Activity className={iconClass} />;
      case "injections": return <Syringe className={iconClass} />;
      case "tests": return <TestTube className={iconClass} />;
      case "photos": return <Camera className={iconClass} />;
      case "streak": return <TrendingUp className={iconClass} />;
      default: return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      <Card className="bg-card-surface border-gray-800 p-6 hover:shadow-lg transition-all duration-200">
        <CardContent className="p-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              {getIcon()}
              <p className="text-sm text-gray-400 font-medium">
                {label}
              </p>
            </div>
            <ProgressRing
              value={progress}
              max={100}
              size={40}
              strokeWidth={3}
              color={colorMap[color]}
              animate={animate}
            />
          </div>
          
          <div className="mb-3">
            <motion.span
              className={`text-4xl font-bold text-${color}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                duration: 0.5, 
                delay: 0.8,
                type: "spring",
                stiffness: 200
              }}
            >
              {value}
            </motion.span>
          </div>
          
          <div className="w-full bg-gray-700 rounded-full h-2">
            <motion.div 
              className={`h-2 rounded-full bg-${color}`}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
