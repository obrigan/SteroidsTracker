import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreateBloodTestModal } from "@/components/CreateBloodTestModal";
import { TestTube, ArrowLeft, BookOpen, Shield, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";

export default function AddFirstTest() {
  const [, setLocation] = useLocation();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const testTypes = [
    {
      name: "Базовая панель",
      description: "Основные показатели для начинающих",
      tests: ["Тестостерон общий", "Эстрадиол", "АЛТ", "АСТ", "Холестерин"],
      difficulty: "Начальный",
      color: "health-green",
      icon: <CheckCircle className="w-5 h-5" />
    },
    {
      name: "Гормональная панель", 
      description: "Полный анализ гормонального статуса",
      tests: ["Тестостерон общий", "Тестостерон свободный", "ЛГ", "ФСГ", "Эстрадиол"],
      difficulty: "Средний",
      color: "medical-blue",
      icon: <TrendingUp className="w-5 h-5" />
    },
    {
      name: "Расширенная панель",
      description: "Комплексное обследование здоровья",
      tests: ["Все гормоны", "Печеночные показатели", "Липидный профиль", "Почечные показатели"],
      difficulty: "Продвинутый", 
      color: "energy-orange",
      icon: <Shield className="w-5 h-5" />
    }
  ];

  const importantNotes = [
    {
      title: "Когда сдавать анализы",
      content: "Утром натощак (8-12 часов голодания), в состоянии покоя"
    },
    {
      title: "Частота мониторинга",
      content: "Каждые 6-8 недель во время курса, через 4 недели после PCT"
    },
    {
      title: "Критические показатели",
      content: "Печеночные ферменты (АЛТ, АСТ), липидный профиль, артериальное давление"
    }
  ];

  return (
    <>
      <div className="min-h-screen bg-deep-black text-white pb-24">
        {/* PWA Status Bar */}
        <div className="h-1 bg-gradient-to-r from-medical-blue via-health-green to-energy-orange"></div>
        
        <div className="max-w-md mx-auto">
          {/* Safe area */}
          <div className="h-8"></div>
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-6 py-4"
          >
            <div className="flex items-center mb-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation("/blood-tests")}
                className="mr-3 text-gray-400 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-google-sans font-bold">Добавить первый анализ</h1>
                <p className="text-gray-400 text-sm">Начните мониторинг здоровья</p>
              </div>
            </div>
            
            {/* Info Banner */}
            <Card className="bg-gradient-to-r from-medical-blue/10 to-health-green/10 border border-medical-blue/30 mb-6">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-medical-blue/20 rounded-full flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-medical-blue" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Важность анализов</h4>
                    <p className="text-sm text-gray-300">
                      Регулярный мониторинг показателей крови - основа безопасного использования препаратов
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Test Type Selection */}
          <div className="px-6">
            <h2 className="text-lg font-google-sans font-semibold mb-4">Выберите тип анализа</h2>
            <div className="space-y-3 mb-8">
              {testTypes.map((testType, index) => (
                <motion.div
                  key={testType.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card 
                    className="bg-card-surface border-gray-800 hover:border-medical-blue/50 transition-all cursor-pointer"
                    onClick={() => setIsCreateModalOpen(true)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 bg-${testType.color}/20 rounded-full flex items-center justify-center`}>
                            {testType.icon}
                          </div>
                          <div>
                            <CardTitle className="text-white font-google-sans text-base">
                              {testType.name}
                            </CardTitle>
                            <p className="text-gray-400 text-sm">{testType.description}</p>
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {testType.difficulty}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex flex-wrap gap-1">
                        {testType.tests.slice(0, 3).map((test) => (
                          <Badge key={test} variant="outline" className="text-xs">
                            {test}
                          </Badge>
                        ))}
                        {testType.tests.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{testType.tests.length - 3} еще
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Important Notes */}
            <h2 className="text-lg font-google-sans font-semibold mb-4">Важные заметки</h2>
            <div className="space-y-3 mb-8">
              {importantNotes.map((note, index) => (
                <motion.div
                  key={note.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <Card className="bg-card-surface border-gray-800">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-energy-orange rounded-full mt-2"></div>
                        <div>
                          <h4 className="font-semibold text-white text-sm mb-1">{note.title}</h4>
                          <p className="text-xs text-gray-400">{note.content}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="w-full bg-gradient-to-r from-energy-orange to-energy-orange/80 hover:from-energy-orange/90 hover:to-energy-orange/70 h-12"
              >
                <TestTube className="w-5 h-5 mr-2" />
                Добавить анализ крови
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Create Blood Test Modal */}
      <CreateBloodTestModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </>
  );
}