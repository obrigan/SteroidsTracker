import { Plus, Syringe, TestTube, Camera, Zap } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface QuickActionsProps {
  onAddInjection: () => void;
  onAddBloodTest: () => void;
  onAddPhoto: () => void;
}

export function QuickActions({ onAddInjection, onAddBloodTest, onAddPhoto }: QuickActionsProps) {
  return (
    <Card className="p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
        <Zap className="w-5 h-5 mr-2 text-energy-orange" />
        Быстрые действия
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button
          onClick={onAddInjection}
          className="h-16 bg-medical-blue hover:bg-medical-blue/90 text-white flex items-center justify-center space-x-3"
          size="lg"
        >
          <Syringe className="w-6 h-6" />
          <span className="font-medium">Добавить укол</span>
        </Button>
        
        <Button
          onClick={onAddBloodTest}
          className="h-16 bg-health-green hover:bg-health-green/90 text-white flex items-center justify-center space-x-3"
          size="lg"
        >
          <TestTube className="w-6 h-6" />
          <span className="font-medium">Новый анализ</span>
        </Button>
        
        <Button
          onClick={onAddPhoto}
          className="h-16 bg-energy-orange hover:bg-energy-orange/90 text-white flex items-center justify-center space-x-3"
          size="lg"
        >
          <Camera className="w-6 h-6" />
          <span className="font-medium">Фото прогресса</span>
        </Button>
      </div>
    </Card>
  );
}