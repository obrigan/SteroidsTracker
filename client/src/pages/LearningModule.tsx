import { useState } from "react";
import { useLocation, useRoute } from "wouter";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Play, CheckCircle, Lock, Clock, BookOpen, Award } from "lucide-react";

interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  locked: boolean;
  type: "video" | "text" | "quiz";
}

export default function LearningModule() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/learning/module/:moduleId");
  const moduleId = params?.moduleId || "basics";
  
  const moduleData = {
    basics: {
      title: "Основы фармакологии стероидов",
      description: "Изучите базовые принципы работы анаболических стероидов",
      progress: 75,
      totalLessons: 8,
      completedLessons: 6,
      estimatedTime: "2 часа",
      difficulty: "Начальный",
      lessons: [
        { id: "1", title: "Что такое анаболические стероиды", duration: "15 мин", completed: true, locked: false, type: "video" as const },
        { id: "2", title: "История развития стероидов", duration: "12 мин", completed: true, locked: false, type: "text" as const },
        { id: "3", title: "Механизм действия", duration: "18 мин", completed: true, locked: false, type: "video" as const },
        { id: "4", title: "Классификация препаратов", duration: "20 мин", completed: true, locked: false, type: "text" as const },
        { id: "5", title: "Андрогенный и анаболический индекс", duration: "16 мин", completed: true, locked: false, type: "video" as const },
        { id: "6", title: "Побочные эффекты", duration: "22 мин", completed: true, locked: false, type: "text" as const },
        { id: "7", title: "Тест: Основы фармакологии", duration: "10 мин", completed: false, locked: false, type: "quiz" as const },
        { id: "8", title: "Практические рекомендации", duration: "25 мин", completed: false, locked: true, type: "video" as const },
      ]
    },
    injections: {
      title: "Техника безопасных инъекций",
      description: "Правильная техника введения препаратов и ротация мест",
      progress: 50,
      totalLessons: 6,
      completedLessons: 3,
      estimatedTime: "1.5 часа",
      difficulty: "Начальный",
      lessons: [
        { id: "1", title: "Подготовка к инъекции", duration: "12 мин", completed: true, locked: false, type: "video" as const },
        { id: "2", title: "Выбор места инъекции", duration: "15 мин", completed: true, locked: false, type: "text" as const },
        { id: "3", title: "Техника введения", duration: "18 мин", completed: true, locked: false, type: "video" as const },
        { id: "4", title: "Ротация мест инъекций", duration: "14 мин", completed: false, locked: false, type: "text" as const },
        { id: "5", title: "Обработка и стерилизация", duration: "16 мин", completed: false, locked: false, type: "video" as const },
        { id: "6", title: "Тест: Техника инъекций", duration: "8 мин", completed: false, locked: true, type: "quiz" as const },
      ]
    }
  };

  const module = moduleData[moduleId as keyof typeof moduleData] || moduleData.basics;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video": return <Play className="w-4 h-4" />;
      case "quiz": return <Award className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "video": return "bg-medical-blue/20 text-medical-blue";
      case "quiz": return "bg-energy-orange/20 text-energy-orange";
      default: return "bg-health-green/20 text-health-green";
    }
  };

  return (
    <div className="min-h-screen bg-deep-black text-white pb-24">
      <div className="h-1 bg-gradient-to-r from-medical-blue via-health-green to-energy-orange"></div>
      
      <div className="max-w-md mx-auto">
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
              onClick={() => setLocation("/learning")}
              className="mr-3 text-gray-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-google-sans font-bold">{module.title}</h1>
              <p className="text-gray-400 text-sm">{module.description}</p>
            </div>
          </div>

          {/* Progress Card */}
          <Card className="bg-gradient-to-r from-medical-blue/10 to-health-green/10 border border-medical-blue/30 mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-2xl font-bold text-white">{module.progress}%</div>
                  <div className="text-sm text-gray-400">Завершено</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-health-green">{module.completedLessons}/{module.totalLessons}</div>
                  <div className="text-sm text-gray-400">уроков</div>
                </div>
              </div>
              <Progress value={module.progress} className="h-2" />
              <div className="flex items-center justify-between mt-3 text-sm text-gray-400">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {module.estimatedTime}
                </div>
                <Badge variant="secondary" className="text-xs">
                  {module.difficulty}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Lessons List */}
        <div className="px-6">
          <h2 className="text-lg font-google-sans font-semibold mb-4">Уроки</h2>
          <div className="space-y-3">
            {module.lessons.map((lesson, index) => (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className={`bg-card-surface border-gray-800 transition-all ${
                    lesson.locked 
                      ? 'opacity-60 cursor-not-allowed' 
                      : 'hover:border-medical-blue/50 cursor-pointer'
                  }`}
                  onClick={() => !lesson.locked && alert(`Урок "${lesson.title}" будет доступен в полной версии`)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      {/* Status Icon */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        lesson.completed 
                          ? 'bg-health-green/20 text-health-green' 
                          : lesson.locked
                          ? 'bg-gray-700 text-gray-400'
                          : 'bg-medical-blue/20 text-medical-blue'
                      }`}>
                        {lesson.completed ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : lesson.locked ? (
                          <Lock className="w-4 h-4" />
                        ) : (
                          getTypeIcon(lesson.type)
                        )}
                      </div>

                      {/* Lesson Info */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className={`font-semibold ${lesson.locked ? 'text-gray-400' : 'text-white'}`}>
                            {lesson.title}
                          </h3>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getTypeColor(lesson.type)}`}
                          >
                            {lesson.type === 'video' ? 'Видео' : lesson.type === 'quiz' ? 'Тест' : 'Текст'}
                          </Badge>
                        </div>
                        <div className="flex items-center text-sm text-gray-400 mt-1">
                          <Clock className="w-3 h-3 mr-1" />
                          {lesson.duration}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Continue Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8"
          >
            <Button
              className="w-full bg-gradient-to-r from-medical-blue to-medical-blue/80 hover:from-medical-blue/90 hover:to-medical-blue/70 h-12"
              onClick={() => {
                const nextLesson = module.lessons.find(l => !l.completed && !l.locked);
                if (nextLesson) {
                  alert(`Начинаем урок: "${nextLesson.title}"`);
                } else {
                  alert("Все доступные уроки завершены!");
                }
              }}
            >
              <Play className="w-5 h-5 mr-2" />
              {module.lessons.find(l => !l.completed && !l.locked) ? 'Продолжить обучение' : 'Завершить модуль'}
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}