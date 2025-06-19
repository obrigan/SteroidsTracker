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
        className="w-14 h-14 bg-gradient-to-br from-medical-blue to-medical-blue/80 hover:from-medical-blue hover:to-medical-blue/90 rounded-full shadow-2xl fab-shadow transition-smooth touch-target"
      >
        {icon}
      </Button>
    </motion.div>
  );
}
