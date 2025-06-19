import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Syringe, Pill, Camera, StickyNote, X } from "lucide-react";

interface QuickActionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const quickActions = [
  {
    id: "injection",
    icon: Syringe,
    label: "Add Injection",
    description: "Quick logging",
    color: "health-green",
    bgColor: "bg-health-green/20 border-health-green/30 hover:bg-health-green/30"
  },
  {
    id: "pill", 
    icon: Pill,
    label: "Add Pill",
    description: "Oral compounds",
    color: "energy-orange",
    bgColor: "bg-energy-orange/20 border-energy-orange/30 hover:bg-energy-orange/30"
  },
  {
    id: "photo",
    icon: Camera,
    label: "Progress Photo",
    description: "Document changes",
    color: "medical-blue",
    bgColor: "bg-medical-blue/20 border-medical-blue/30 hover:bg-medical-blue/30"
  },
  {
    id: "note",
    icon: StickyNote,
    label: "Quick Note",
    description: "Side effects, mood",
    color: "purple-400",
    bgColor: "bg-purple-500/20 border-purple-500/30 hover:bg-purple-500/30"
  }
];

export function QuickActionModal({ isOpen, onClose }: QuickActionModalProps) {
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleBackdropClick}
          />
          
          {/* Modal */}
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-md"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
          >
            <Card className="bg-card-surface border-gray-800 rounded-t-3xl rounded-b-none">
              <CardHeader className="text-center pb-4">
                {/* Handle bar */}
                <div className="w-12 h-1.5 bg-gray-600 rounded-full mx-auto mb-4"></div>
                
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-google-sans font-bold text-white">
                    Quick Actions
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="pb-8">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {quickActions.map((action, index) => {
                    const Icon = action.icon;
                    
                    return (
                      <motion.div
                        key={action.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ 
                          duration: 0.3, 
                          delay: index * 0.1 
                        }}
                      >
                        <Button
                          variant="outline"
                          className={`${action.bgColor} h-auto p-4 text-center touch-target transition-smooth flex flex-col items-center justify-center space-y-2 w-full`}
                          onClick={() => {
                            // Handle action click
                            console.log(`${action.id} clicked`);
                            onClose();
                          }}
                        >
                          <Icon className={`text-${action.color} w-6 h-6`} />
                          <div>
                            <p className="text-white font-medium text-sm">
                              {action.label}
                            </p>
                            <p className="text-gray-400 text-xs">
                              {action.description}
                            </p>
                          </div>
                        </Button>
                      </motion.div>
                    );
                  })}
                </div>
                
                <Button
                  variant="secondary"
                  onClick={onClose}
                  className="w-full py-3 rounded-xl font-medium transition-smooth bg-gray-700 hover:bg-gray-600 text-white"
                >
                  Cancel
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
