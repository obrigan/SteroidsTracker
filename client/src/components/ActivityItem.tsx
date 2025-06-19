import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Syringe, TestTube, Camera } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Activity {
  id: string;
  type: string;
  title: string;
  description: string;
  date: string;
  xp: number;
  icon: string;
  color: string;
}

interface ActivityItemProps {
  activity: Activity;
  index?: number;
}

const iconMap = {
  syringe: Syringe,
  vial: TestTube,
  camera: Camera,
};

const colorMap = {
  "health-green": "text-health-green bg-health-green/20",
  "energy-orange": "text-energy-orange bg-energy-orange/20",
  "medical-blue": "text-medical-blue bg-medical-blue/20",
};

export function ActivityItem({ activity, index = 0 }: ActivityItemProps) {
  const IconComponent = iconMap[activity.icon as keyof typeof iconMap] || Syringe;
  const colorClass = colorMap[activity.color as keyof typeof colorMap] || colorMap["health-green"];
  
  const timeAgo = formatDistanceToNow(new Date(activity.date), { addSuffix: true });

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.1,
        type: "spring",
        stiffness: 100
      }}
    >
      <Card className="bg-card-surface border-gray-800 hover:border-gray-700 transition-colors">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colorClass}`}>
              <IconComponent className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-white truncate">
                {activity.title}
              </h3>
              <p className="text-sm text-gray-400 truncate">
                {activity.description}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {timeAgo}
              </p>
            </div>
            {activity.xp > 0 && (
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">
                +{activity.xp} XP
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
