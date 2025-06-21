import React from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FloatingActionButtonProps {
  onClick?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export function FloatingActionButton({ 
  onClick, 
  icon = <Plus className="w-6 h-6" />,
  className = ""
}: FloatingActionButtonProps) {
  return (
    <motion.div
      className={`fixed bottom-24 right-6 z-40 ${className}`}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 0.5
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button
        onClick={onClick}
        variant="default"
        size="fab"
        className="bg-gradient-to-br from-medical-blue to-health-green hover:from-medical-blue/90 hover:to-health-green/90 shadow-2xl fab-shadow"
      >
        {icon}
      </Button>
    </motion.div>
  );
}
