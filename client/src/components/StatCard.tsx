import { ProgressRing } from "./ProgressRing";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  value: number;
  label: string;
  color: "medical-blue" | "health-green" | "energy-orange" | "purple-400";
  progress: number;
  animate?: boolean;
  className?: string;
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
  className = ""
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      <Card className="bg-card-surface border-gray-800 p-4 text-center">
        <CardContent className="p-0">
          <div className="flex flex-col items-center">
            <ProgressRing
              value={progress}
              max={100}
              size={64}
              strokeWidth={6}
              color={colorMap[color]}
              animate={animate}
              className="mb-3"
            >
              <motion.span
                className={`text-2xl font-bold text-${color}`}
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
            </ProgressRing>
            <p className="text-xs text-gray-400 leading-tight">
              {label}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
