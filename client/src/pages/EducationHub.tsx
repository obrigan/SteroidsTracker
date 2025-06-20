
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { 
  BookOpen, Play, CheckCircle, Lock, Star, Clock, 
  Award, Brain, Shield, TrendingUp, Users, FileText,
  Video, Headphones, Download, ExternalLink
} from "lucide-react";

interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  progress: number;
  unlocked: boolean;
  xpReward: number;
  modules: number;
  category: 'safety' | 'compounds' | 'nutrition' | 'training';
}

interface Article {
  id: string;
  title: string;
  excerpt: string;
  readTime: string;
  category: string;
  isNew: boolean;
  isPremium: boolean;
}

interface Research {
  id: string;
  title: string;
  journal: string;
  year: number;
  summary: string;
  relevanceScore: number;
}

export default function EducationHub() {
  const [selectedTab, setSelectedTab] = useState('courses');

  const courses: Course[] = [
    {
      id: 'safety_basics',
      title: 'Основы безопасности',
      description: 'Изучите фундаментальные принципы безопасного использования ААС',
      duration: '2 часа',
      difficulty: 'beginner',
      progress: 100,
      unlocked: true,
      xpReward: 200,
      modules: 8,
      category: 'safety'
    },
    {
      id: 'compounds_guide',
      title: 'Полный гайд по препаратам',
      description: 'Детальное изучение различных анаболических стероидов',
      duration: '4 часа',
      difficulty: 'intermediate',
      progress: 65,
      unlocked: true,
      xpReward: 400,
      modules: 12,
      category: 'compounds'
    },
    {
      id: 'advanced_protocols',
      title: 'Продвинутые протоколы',
      description: 'Сложные схемы для опытных пользователей',
      duration: '3 часа',
      difficulty: 'advanced',
      progress: 0,
      unlocked: false,
      xpReward: 600,
      modules: 10,
      category: 'compounds'
    }
  ];

  const articles: Article[] = [
    {
      id: 'new_research_2024',
      title: 'Новые исследования влияния тестостерона на сердечно-сосудистую систему',
      excerpt: 'Последние данные о кардиопротективных эффектах физиологических доз тестостерона...',
      readTime: '8 мин',
      category: 'Исследования',
      isNew: true,
      isPremium: false
    },
    {
      id: 'pct_guide_2024',
      title: 'Современные подходы к послекурсовой терапии',
      excerpt: 'Обновленные протоколы ПКТ с использованием новых препаратов и методик...',
      readTime: '12 мин',
      category: 'ПКТ',
      isNew: false,
      isPremium: true
    }
  ];

  const research: Research[] = [
    {
      id: 'cardio_study_2024',
      title: 'Cardiovascular effects of anabolic-androgenic steroids',
      journal: 'Journal of Clinical Endocrinology',
      year: 2024,
      summary: 'Исследование показало, что физиологические дозы тестостерона могут иметь кардиопротективный эффект при правильном мониторинге.',
      relevanceScore: 95
    },
    {
      id: 'liver_health_2023',
      title: 'Hepatotoxicity of oral anabolic steroids',
      journal: 'Hepatology Research',
      year: 2023,
      summary: 'Анализ гепатотоксичности различных оральных ААС и методов защиты печени.',
      relevanceScore: 88
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-health-green/20 text-health-green border-health-green/30';
      case 'intermediate': return 'bg-energy-orange/20 text-energy-orange border-energy-orange/30';
      case 'advanced': return 'bg-medical-red/20 text-medical-red border-medical-red/30';
      default: return 'bg-gray-600/20 text-gray-400 border-gray-600/30';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'safety': return Shield;
      case 'compounds': return Brain;
      case 'nutrition': return TrendingUp;
      case 'training': return Users;
      default: return BookOpen;
    }
  };

  return (
    <div className="min-h-screen bg-deep-black text-white pb-24">
      <div className="h-1 bg-gradient-to-r from-medical-blue via-health-green to-energy-orange"></div>
      
      <div className="max-w-md mx-auto">
        <div className="h-8"></div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-6 py-4"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-google-sans font-bold">Образование</h1>
              <p className="text-gray-400 text-sm">Знания - основа безопасности</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-medical-blue to-energy-orange rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
          </div>

          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-800">
              <TabsTrigger value="courses">Курсы</TabsTrigger>
              <TabsTrigger value="articles">Статьи</TabsTrigger>
              <TabsTrigger value="research">Исследования</TabsTrigger>
            </TabsList>

            <TabsContent value="courses" className="space-y-4">
              {courses.map((course, index) => {
                const IconComponent = getCategoryIcon(course.category);
                return (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className={`bg-card-surface border-gray-800 ${
                      !course.unlocked ? 'opacity-60' : ''
                    }`}>
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            course.unlocked ? 'bg-medical-blue/20' : 'bg-gray-700/50'
                          }`}>
                            {course.unlocked ? (
                              <IconComponent className="w-6 h-6 text-medical-blue" />
                            ) : (
                              <Lock className="w-6 h-6 text-gray-500" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h3 className="font-semibold text-white mb-1">{course.title}</h3>
                                <p className="text-sm text-gray-400 mb-3">{course.description}</p>
                              </div>
                              {course.unlocked && course.progress === 100 && (
                                <CheckCircle className="w-5 h-5 text-health-green flex-shrink-0" />
                              )}
                            </div>
                            
                            <div className="flex items-center space-x-3 mb-4 text-xs text-gray-400">
                              <div className="flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>{course.duration}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <FileText className="w-3 h-3" />
                                <span>{course.modules} модулей</span>
                              </div>
                              <Badge className={`text-xs border ${getDifficultyColor(course.difficulty)}`}>
                                {course.difficulty === 'beginner' ? 'Новичок' :
                                 course.difficulty === 'intermediate' ? 'Средний' : 'Продвинутый'}
                              </Badge>
                            </div>

                            {course.unlocked && (
                              <div className="mb-4">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-xs text-gray-400">Прогресс</span>
                                  <span className="text-xs text-gray-400">{course.progress}%</span>
                                </div>
                                <Progress value={course.progress} className="h-2" />
                              </div>
                            )}

                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-1 text-energy-orange">
                                <Star className="w-3 h-3" />
                                <span className="text-sm font-medium">{course.xpReward} XP</span>
                              </div>
                              <Button 
                                size="sm" 
                                disabled={!course.unlocked}
                                className={course.unlocked ? 
                                  "bg-medical-blue hover:bg-medical-blue/80" : 
                                  "bg-gray-600 text-gray-400"
                                }
                              >
                                {course.progress === 0 ? 'Начать' : 
                                 course.progress === 100 ? 'Пересмотреть' : 'Продолжить'}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </TabsContent>

            <TabsContent value="articles" className="space-y-4">
              {articles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-card-surface border-gray-800 hover:border-medical-blue/50 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-white">{article.title}</h3>
                            {article.isNew && (
                              <Badge className="text-xs bg-energy-orange/20 text-energy-orange">
                                Новое
                              </Badge>
                            )}
                            {article.isPremium && (
                              <Badge className="text-xs bg-medical-red/20 text-medical-red">
                                Premium
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-400 mb-3">{article.excerpt}</p>
                          <div className="flex items-center space-x-3 text-xs text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{article.readTime}</span>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {article.category}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Button size="sm" className="bg-medical-blue hover:bg-medical-blue/80">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Читать
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </TabsContent>

            <TabsContent value="research" className="space-y-4">
              {research.map((study, index) => (
                <motion.div
                  key={study.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-card-surface border-gray-800">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-white mb-2">{study.title}</h3>
                          <div className="flex items-center space-x-3 text-xs text-gray-400 mb-3">
                            <span>{study.journal}</span>
                            <span>•</span>
                            <span>{study.year}</span>
                            <div className="flex items-center space-x-1 text-energy-orange">
                              <TrendingUp className="w-3 h-3" />
                              <span>{study.relevanceScore}% релевантность</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-300">{study.summary}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline">
                          <Download className="w-3 h-3 mr-1" />
                          Скачать
                        </Button>
                        <Button size="sm" className="bg-medical-blue hover:bg-medical-blue/80">
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Читать
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
