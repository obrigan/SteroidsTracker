
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trophy, Target, Calendar, Zap, Star, Crown, Medal, 
  Flame, Shield, Brain, Heart, TrendingUp, CheckCircle,
  Gift, Clock, Users, BookOpen, Award
} from "lucide-react";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: any;
  category: 'safety' | 'consistency' | 'progress' | 'knowledge' | 'community';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  xpReward: number;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  unlockedAt?: string;
}

interface DailyQuest {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  progress: number;
  maxProgress: number;
  icon: any;
  completed: boolean;
}

interface AdvancedAchievementsProps {
  userLevel: number;
  userXP: number;
  currentStreak: number;
}

export function AdvancedAchievements({ userLevel, userXP, currentStreak }: AdvancedAchievementsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const achievements: Achievement[] = [
    {
      id: 'first_injection',
      name: 'Первый шаг',
      description: 'Выполните первую инъекцию',
      icon: Trophy,
      category: 'progress',
      rarity: 'common',
      xpReward: 50,
      progress: 1,
      maxProgress: 1,
      unlocked: true,
      unlockedAt: '2024-01-15'
    },
    {
      id: 'safety_expert',
      name: 'Эксперт безопасности',
      description: 'Сдайте 10 анализов крови без отклонений',
      icon: Shield,
      category: 'safety',
      rarity: 'epic',
      xpReward: 200,
      progress: 7,
      maxProgress: 10,
      unlocked: false
    },
    {
      id: 'consistency_master',
      name: 'Мастер постоянства',
      description: 'Поддерживайте streak 30 дней',
      icon: Flame,
      category: 'consistency',
      rarity: 'rare',
      xpReward: 150,
      progress: currentStreak,
      maxProgress: 30,
      unlocked: currentStreak >= 30
    },
    {
      id: 'knowledge_seeker',
      name: 'Искатель знаний',
      description: 'Пройдите 5 обучающих модулей',
      icon: Brain,
      category: 'knowledge',
      rarity: 'rare',
      xpReward: 100,
      progress: 3,
      maxProgress: 5,
      unlocked: false
    },
    {
      id: 'community_helper',
      name: 'Помощник сообщества',
      description: 'Помогите 10 новичкам',
      icon: Heart,
      category: 'community',
      rarity: 'legendary',
      xpReward: 300,
      progress: 2,
      maxProgress: 10,
      unlocked: false
    }
  ];

  const dailyQuests: DailyQuest[] = [
    {
      id: 'daily_log',
      title: 'Ежедневный журнал',
      description: 'Запишите сегодняшнее самочувствие',
      xpReward: 25,
      progress: 0,
      maxProgress: 1,
      icon: Calendar,
      completed: false
    },
    {
      id: 'water_intake',
      title: 'Гидратация',
      description: 'Выпейте 2.5 литра воды',
      xpReward: 15,
      progress: 1.8,
      maxProgress: 2.5,
      icon: Heart,
      completed: false
    },
    {
      id: 'educational_content',
      title: 'Образование',
      description: 'Изучите новую статью',
      xpReward: 30,
      progress: 1,
      maxProgress: 1,
      icon: BookOpen,
      completed: true
    }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-400 border-gray-600';
      case 'rare': return 'text-medical-blue border-medical-blue';
      case 'epic': return 'text-energy-orange border-energy-orange';
      case 'legendary': return 'text-medical-red border-medical-red';
      default: return 'text-gray-400 border-gray-600';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'safety': return Shield;
      case 'consistency': return Target;
      case 'progress': return TrendingUp;
      case 'knowledge': return Brain;
      case 'community': return Users;
      default: return Trophy;
    }
  };

  const filteredAchievements = selectedCategory === 'all' 
    ? achievements 
    : achievements.filter(a => a.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* User Level and XP */}
      <Card className="bg-gradient-to-r from-medical-blue/10 to-energy-orange/10 border-medical-blue/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-energy-orange/20 rounded-full flex items-center justify-center">
                <Crown className="w-6 h-6 text-energy-orange" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Уровень {userLevel}</h3>
                <p className="text-gray-400">Эксперт безопасности</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-energy-orange">{userXP} XP</div>
              <p className="text-xs text-gray-400">до следующего уровня: 450 XP</p>
            </div>
          </div>
          <Progress value={(userXP % 1000) / 10} className="h-3" />
        </CardContent>
      </Card>

      <Tabs defaultValue="achievements" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-800">
          <TabsTrigger value="achievements">Достижения</TabsTrigger>
          <TabsTrigger value="daily">Ежедневно</TabsTrigger>
          <TabsTrigger value="seasonal">События</TabsTrigger>
        </TabsList>

        <TabsContent value="achievements" className="space-y-4">
          {/* Category Filter */}
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {['all', 'safety', 'consistency', 'progress', 'knowledge', 'community'].map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="whitespace-nowrap"
              >
                {category === 'all' ? 'Все' : 
                 category === 'safety' ? 'Безопасность' :
                 category === 'consistency' ? 'Постоянство' :
                 category === 'progress' ? 'Прогресс' :
                 category === 'knowledge' ? 'Знания' : 'Сообщество'}
              </Button>
            ))}
          </div>

          {/* Achievements Grid */}
          <div className="space-y-3">
            <AnimatePresence>
              {filteredAchievements.map((achievement, index) => {
                const IconComponent = achievement.icon;
                return (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className={`bg-card-surface border-gray-800 ${
                      achievement.unlocked ? 'ring-1 ring-energy-orange/30' : ''
                    }`}>
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-4">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            achievement.unlocked ? 'bg-energy-orange/20' : 'bg-gray-700/50'
                          }`}>
                            <IconComponent className={`w-6 h-6 ${
                              achievement.unlocked ? 'text-energy-orange' : 'text-gray-500'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className={`font-semibold ${
                                achievement.unlocked ? 'text-white' : 'text-gray-400'
                              }`}>
                                {achievement.name}
                              </h4>
                              <Badge className={`text-xs border ${getRarityColor(achievement.rarity)}`}>
                                {achievement.rarity === 'common' ? 'Обычное' :
                                 achievement.rarity === 'rare' ? 'Редкое' :
                                 achievement.rarity === 'epic' ? 'Эпическое' : 'Легендарное'}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-400 mb-3">{achievement.description}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <Progress 
                                  value={(achievement.progress / achievement.maxProgress) * 100} 
                                  className="w-20 h-2" 
                                />
                                <span className="text-xs text-gray-400">
                                  {achievement.progress}/{achievement.maxProgress}
                                </span>
                              </div>
                              <div className="flex items-center space-x-1 text-energy-orange">
                                <Star className="w-3 h-3" />
                                <span className="text-xs font-medium">{achievement.xpReward} XP</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </TabsContent>

        <TabsContent value="daily" className="space-y-4">
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold text-white mb-2">Ежедневные задания</h3>
            <p className="text-sm text-gray-400">Выполняйте задания каждый день для получения XP</p>
          </div>

          {dailyQuests.map((quest, index) => {
            const IconComponent = quest.icon;
            return (
              <motion.div
                key={quest.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`bg-card-surface border-gray-800 ${
                  quest.completed ? 'ring-1 ring-health-green/30' : ''
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        quest.completed ? 'bg-health-green/20' : 'bg-medical-blue/20'
                      }`}>
                        {quest.completed ? (
                          <CheckCircle className="w-5 h-5 text-health-green" />
                        ) : (
                          <IconComponent className="w-5 h-5 text-medical-blue" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-white">{quest.title}</h4>
                          <div className="flex items-center space-x-1 text-energy-orange">
                            <Star className="w-3 h-3" />
                            <span className="text-sm font-medium">{quest.xpReward} XP</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-400 mb-3">{quest.description}</p>
                        {!quest.completed && (
                          <div className="flex items-center space-x-2">
                            <Progress 
                              value={(quest.progress / quest.maxProgress) * 100} 
                              className="flex-1 h-2" 
                            />
                            <span className="text-xs text-gray-400">
                              {quest.progress.toFixed(1)}/{quest.maxProgress}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </TabsContent>

        <TabsContent value="seasonal" className="space-y-4">
          <Card className="bg-gradient-to-r from-energy-orange/10 to-medical-red/10 border-energy-orange/30">
            <CardContent className="p-6 text-center">
              <Gift className="w-12 h-12 text-energy-orange mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Зимний вызов 2024</h3>
              <p className="text-gray-400 mb-4">
                Поддерживайте строгий режим в течение зимних месяцев
              </p>
              <div className="flex items-center justify-center space-x-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-energy-orange">12</div>
                  <div className="text-xs text-gray-400">дней осталось</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-medical-blue">500</div>
                  <div className="text-xs text-gray-400">участников</div>
                </div>
              </div>
              <Button className="bg-energy-orange hover:bg-energy-orange/80">
                Участвовать
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
