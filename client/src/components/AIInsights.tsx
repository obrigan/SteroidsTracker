
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { 
  Brain, TrendingUp, AlertTriangle, CheckCircle, 
  Target, Lightbulb, Activity, Heart, Zap 
} from "lucide-react";

interface AIInsight {
  id: string;
  type: 'recommendation' | 'warning' | 'optimization' | 'achievement';
  title: string;
  description: string;
  confidence: number;
  priority: 'low' | 'medium' | 'high';
  actionable: boolean;
  relatedMetrics: string[];
}

interface AIInsightsProps {
  userStats: {
    totalInjections: number;
    totalBloodTests: number;
    currentStreak: number;
    level: number;
  };
}

export function AIInsights({ userStats }: AIInsightsProps) {
  const [insights, setInsights] = useState<AIInsight[]>([
    {
      id: '1',
      type: 'recommendation',
      title: 'Оптимизация времени инъекций',
      description: 'На основе ваших данных, рекомендуем делать инъекции в 8:00 утра для лучшего усвоения',
      confidence: 87,
      priority: 'medium',
      actionable: true,
      relatedMetrics: ['injection_timing', 'absorption_rate']
    },
    {
      id: '2',
      type: 'warning',
      title: 'Рекомендуется сдать анализы',
      description: 'Прошло 6 недель с последнего анализа крови. Время проверить уровень гормонов',
      confidence: 95,
      priority: 'high',
      actionable: true,
      relatedMetrics: ['blood_test_frequency', 'hormone_levels']
    },
    {
      id: '3',
      type: 'optimization',
      title: 'Ротация мест инъекций',
      description: 'ИИ заметил частое использование дельтовидных мышц. Рекомендуем больше использовать квадрицепсы',
      confidence: 78,
      priority: 'medium',
      actionable: true,
      relatedMetrics: ['injection_sites', 'tissue_health']
    },
    {
      id: '4',
      type: 'achievement',
      title: 'Отличная дисциплина!',
      description: 'Ваша консистентность в ведении журнала на 15% выше среднего пользователя',
      confidence: 92,
      priority: 'low',
      actionable: false,
      relatedMetrics: ['consistency', 'logging_frequency']
    }
  ]);

  const [selectedInsight, setSelectedInsight] = useState<AIInsight | null>(null);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'recommendation': return <Lightbulb className="w-5 h-5" />;
      case 'warning': return <AlertTriangle className="w-5 h-5" />;
      case 'optimization': return <TrendingUp className="w-5 h-5" />;
      case 'achievement': return <CheckCircle className="w-5 h-5" />;
      default: return <Brain className="w-5 h-5" />;
    }
  };

  const getInsightColor = (type: string, priority: string) => {
    if (type === 'warning') return 'border-medical-red bg-medical-red/10';
    if (type === 'achievement') return 'border-health-green bg-health-green/10';
    if (priority === 'high') return 'border-energy-orange bg-energy-orange/10';
    return 'border-medical-blue bg-medical-blue/10';
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      low: 'bg-gray-600 text-gray-200',
      medium: 'bg-energy-orange text-white',
      high: 'bg-medical-red text-white'
    };
    return colors[priority as keyof typeof colors];
  };

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Brain className="w-5 h-5 mr-2 text-purple-400" />
            ИИ Аналитика
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">97%</div>
              <div className="text-xs text-gray-400">Точность предсказаний</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-medical-blue">{insights.length}</div>
              <div className="text-xs text-gray-400">Новых инсайтов</div>
            </div>
          </div>
          
          <div className="space-y-3">
            {insights.map((insight, index) => (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`cursor-pointer transition-all hover:scale-[1.02] ${getInsightColor(insight.type, insight.priority)}`}
                      onClick={() => setSelectedInsight(insight)}>
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        {getInsightIcon(insight.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-white text-sm truncate">
                            {insight.title}
                          </h4>
                          <Badge className={`text-xs ${getPriorityBadge(insight.priority)}`}>
                            {insight.priority === 'high' ? 'Высокий' : 
                             insight.priority === 'medium' ? 'Средний' : 'Низкий'}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-300 mb-2 line-clamp-2">
                          {insight.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1">
                            <Activity className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-400">
                              Уверенность: {insight.confidence}%
                            </span>
                          </div>
                          {insight.actionable && (
                            <Button size="sm" variant="outline" className="h-6 text-xs">
                              Применить
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Детальная информация о выбранном инсайте */}
      {selectedInsight && (
        <Card className="bg-card-surface border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <span className="flex items-center">
                {getInsightIcon(selectedInsight.type)}
                <span className="ml-2">{selectedInsight.title}</span>
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedInsight(null)}
              >
                ✕
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-4">{selectedInsight.description}</p>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Уверенность ИИ</span>
                  <span className="text-white">{selectedInsight.confidence}%</span>
                </div>
                <Progress value={selectedInsight.confidence} className="h-2" />
              </div>
              
              <div>
                <h5 className="text-sm font-semibold text-white mb-2">Связанные метрики:</h5>
                <div className="flex flex-wrap gap-2">
                  {selectedInsight.relatedMetrics.map((metric) => (
                    <Badge key={metric} variant="outline" className="text-xs">
                      {metric.replace('_', ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {selectedInsight.actionable && (
                <div className="pt-2">
                  <Button className="w-full bg-medical-blue hover:bg-medical-blue/90">
                    Применить рекомендацию
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
