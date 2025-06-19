import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Calculator, 
  Award, 
  Play, 
  CheckCircle, 
  Lock,
  Syringe,
  TestTube,
  Heart,
  Brain,
  Dumbbell,
  Shield
} from "lucide-react";

interface LearningModule {
  id: string;
  title: string;
  description: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  isLocked: boolean;
  difficulty: "beginner" | "intermediate" | "advanced";
  icon: React.ReactNode;
  estimatedTime: string;
}

interface Calculator {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

export default function Learning() {
  const [activeTab, setActiveTab] = useState("courses");

  const learningModules: LearningModule[] = [
    {
      id: "basics",
      title: "Основы фармакологии стероидов",
      description: "Изучите базовые принципы работы анаболических стероидов",
      progress: 75,
      totalLessons: 8,
      completedLessons: 6,
      isLocked: false,
      difficulty: "beginner",
      icon: <Brain className="w-6 h-6" />,
      estimatedTime: "2 часа"
    },
    {
      id: "injections",
      title: "Техника безопасных инъекций",
      description: "Правильная техника введения препаратов и ротация мест",
      progress: 50,
      totalLessons: 6,
      completedLessons: 3,
      isLocked: false,
      difficulty: "beginner",
      icon: <Syringe className="w-6 h-6" />,
      estimatedTime: "1.5 часа"
    },
    {
      id: "bloodwork",
      title: "Интерпретация анализов крови",
      description: "Понимание ключевых показателей и их значений",
      progress: 25,
      totalLessons: 10,
      completedLessons: 2,
      isLocked: false,
      difficulty: "intermediate",
      icon: <TestTube className="w-6 h-6" />,
      estimatedTime: "3 часа"
    },
    {
      id: "planning",
      title: "Планирование курсов",
      description: "Создание эффективных и безопасных курсов",
      progress: 0,
      totalLessons: 12,
      completedLessons: 0,
      isLocked: true,
      difficulty: "advanced",
      icon: <Heart className="w-6 h-6" />,
      estimatedTime: "4 часа"
    },
    {
      id: "pct",
      title: "Послекурсовая терапия (PCT)",
      description: "Восстановление естественного гормонального фона",
      progress: 0,
      totalLessons: 8,
      completedLessons: 0,
      isLocked: true,
      difficulty: "advanced",
      icon: <Shield className="w-6 h-6" />,
      estimatedTime: "2.5 часа"
    },
    {
      id: "nutrition",
      title: "Питание и тренировки на курсе",
      description: "Оптимизация диеты и тренировочного процесса",
      progress: 0,
      totalLessons: 15,
      completedLessons: 0,
      isLocked: true,
      difficulty: "intermediate",
      icon: <Dumbbell className="w-6 h-6" />,
      estimatedTime: "5 часов"
    }
  ];

  const calculators: Calculator[] = [
    {
      id: "half-life",
      name: "Калькулятор периодов полувыведения",
      description: "Рассчитайте время выведения препаратов из организма",
      icon: <Calculator className="w-6 h-6" />
    },
    {
      id: "dosage",
      name: "Расчет оптимальных дозировок",
      description: "Определите подходящие дозировки на основе целей",
      icon: <TestTube className="w-6 h-6" />
    },
    {
      id: "injection-schedule",
      name: "Планировщик инъекций",
      description: "Создайте расписание инъекций для курса",
      icon: <Syringe className="w-6 h-6" />
    },
    {
      id: "pct-calculator",
      name: "Калькулятор PCT",
      description: "Рассчитайте протокол послекурсовой терапии",
      icon: <Shield className="w-6 h-6" />
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-green-500";
      case "intermediate": return "bg-yellow-500";
      case "advanced": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "Начальный";
      case "intermediate": return "Средний";
      case "advanced": return "Продвинутый";
      default: return "Неизвестно";
    }
  };

  return (
    <div className="min-h-screen bg-deep-black text-white pb-24">
      <div className="h-1 bg-gradient-to-r from-medical-blue via-health-green to-energy-orange"></div>
      
      <div className="max-w-md mx-auto">
        <div className="h-8"></div>
        
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-white mb-2">
            📚 Обучение
          </h1>
          <p className="text-gray-400 text-sm mb-6">
            Изучайте и совершенствуйте свои знания
          </p>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 bg-gray-800">
              <TabsTrigger value="courses">Курсы</TabsTrigger>
              <TabsTrigger value="calculators">Калькуляторы</TabsTrigger>
              <TabsTrigger value="certificates">Сертификаты</TabsTrigger>
            </TabsList>

            <TabsContent value="courses" className="mt-6">
              <div className="space-y-4">
                {learningModules.map((module) => (
                  <Card key={module.id} className="bg-card-surface border-gray-700 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${module.isLocked ? 'bg-gray-700' : 'bg-medical-blue/20'}`}>
                          {module.isLocked ? <Lock className="w-6 h-6 text-gray-400" /> : module.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{module.title}</h3>
                          <p className="text-sm text-gray-400 mt-1">{module.description}</p>
                        </div>
                      </div>
                      <Badge className={`${getDifficultyColor(module.difficulty)} text-white`}>
                        {getDifficultyText(module.difficulty)}
                      </Badge>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-400 mb-2">
                        <span>{module.completedLessons} из {module.totalLessons} уроков</span>
                        <span>{module.estimatedTime}</span>
                      </div>
                      <Progress value={module.progress} className="h-2" />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-sm text-gray-400">
                        {module.isLocked ? (
                          <span>🔒 Заблокировано</span>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>{module.progress}% завершено</span>
                          </>
                        )}
                      </div>
                      <Button 
                        variant={module.isLocked ? "secondary" : "default"}
                        size="sm"
                        disabled={module.isLocked}
                        className={module.isLocked ? "" : "bg-medical-blue hover:bg-medical-blue/90"}
                      >
                        {module.isLocked ? "Заблокировано" : module.progress === 0 ? "Начать" : "Продолжить"}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="calculators" className="mt-6">
              <div className="space-y-4">
                {calculators.map((calc) => (
                  <Card key={calc.id} className="bg-card-surface border-gray-700 p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-energy-orange/20 rounded-lg text-energy-orange">
                          {calc.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{calc.name}</h3>
                          <p className="text-sm text-gray-400 mt-1">{calc.description}</p>
                        </div>
                      </div>
                      <Button className="bg-energy-orange hover:bg-energy-orange/90" size="sm">
                        Открыть
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="certificates" className="mt-6">
              <div className="text-center py-12">
                <Award className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold text-white mb-2">Пока нет сертификатов</h3>
                <p className="text-gray-400 text-sm mb-6">
                  Завершите курсы обучения, чтобы получить сертификаты
                </p>
                <Button variant="outline" size="sm">
                  Начать обучение
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}