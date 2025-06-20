
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Lightbulb } from "lucide-react";
import { motion } from "framer-motion";

interface AIInsight {
  type: 'warning' | 'improvement' | 'good' | 'recommendation';
  title: string;
  description: string;
  action?: string;
  priority: 'high' | 'medium' | 'low';
}

interface AIAnalysisCardProps {
  bloodTestResults: Record<string, any>;
  courseData?: any;
}

export function AIAnalysisCard({ bloodTestResults, courseData }: AIAnalysisCardProps) {
  // AI-анализ результатов (имитация ML-модели)
  const generateInsights = (): AIInsight[] => {
    const insights: AIInsight[] = [];
    
    // Анализ тестостерона
    if (bloodTestResults['Тестостерон общий']) {
      const testLevel = parseFloat(bloodTestResults['Тестостерон общий']);
      if (testLevel > 35) {
        insights.push({
          type: 'warning',
          title: 'Повышенный тестостерон',
          description: 'Уровень тестостерона выше нормы. Рассмотрите снижение дозировки.',
          action: 'Консультация с врачом',
          priority: 'high'
        });
      } else if (testLevel < 12) {
        insights.push({
          type: 'warning',
          title: 'Низкий тестостерон',
          description: 'Уровень тестостерона ниже нормы. Возможно, требуется корректировка курса.',
          priority: 'medium'
        });
      } else {
        insights.push({
          type: 'good',
          title: 'Оптимальный уровень тестостерона',
          description: 'Показатели в пределах нормы. Продолжайте текущий протокол.',
          priority: 'low'
        });
      }
    }

    // Анализ печеночных показателей
    if (bloodTestResults['АЛТ'] || bloodTestResults['АСТ']) {
      const alt = parseFloat(bloodTestResults['АЛТ']) || 0;
      const ast = parseFloat(bloodTestResults['АСТ']) || 0;
      
      if (alt > 45 || ast > 35) {
        insights.push({
          type: 'warning',
          title: 'Повышенные печеночные ферменты',
          description: 'Обнаружены признаки нагрузки на печень. Рекомендуется гепатопротекция.',
          action: 'Добавить гепатопротекторы',
          priority: 'high'
        });
      }
    }

    // Рекомендации по оптимизации
    insights.push({
      type: 'recommendation',
      title: 'Персональная рекомендация',
      description: 'На основе ваших данных рекомендуется увеличить частоту кардио тренировок.',
      action: 'Добавить 20 мин кардио 3x в неделю',
      priority: 'medium'
    });

    return insights;
  };

  const insights = generateInsights();

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="w-5 h-5 text-medical-red" />;
      case 'good': return <CheckCircle className="w-5 h-5 text-health-green" />;
      case 'improvement': return <TrendingUp className="w-5 h-5 text-medical-blue" />;
      case 'recommendation': return <Lightbulb className="w-5 h-5 text-energy-orange" />;
      default: return <Brain className="w-5 h-5 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-medical-red/20 text-medical-red border-medical-red/30';
      case 'medium': return 'bg-energy-orange/20 text-energy-orange border-energy-orange/30';
      case 'low': return 'bg-health-green/20 text-health-green border-health-green/30';
      default: return 'bg-gray-600/20 text-gray-400 border-gray-600/30';
    }
  };

  return (
    <Card className="bg-card-surface border-gray-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Brain className="w-6 h-6 mr-3 text-medical-blue" />
          AI Анализ результатов
        </CardTitle>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="bg-medical-blue/20 text-medical-blue">
            Персонализированный
          </Badge>
          <Badge variant="secondary" className="bg-energy-orange/20 text-energy-orange">
            {insights.length} рекомендаций
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((insight, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-lg border ${
              insight.type === 'warning' ? 'bg-medical-red/5 border-medical-red/20' :
              insight.type === 'good' ? 'bg-health-green/5 border-health-green/20' :
              'bg-medical-blue/5 border-medical-blue/20'
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className="mt-1">{getInsightIcon(insight.type)}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-white text-sm">{insight.title}</h4>
                  <Badge className={`text-xs ${getPriorityColor(insight.priority)}`}>
                    {insight.priority === 'high' ? 'Высокий' : 
                     insight.priority === 'medium' ? 'Средний' : 'Низкий'}
                  </Badge>
                </div>
                <p className="text-gray-300 text-sm mb-3">{insight.description}</p>
                {insight.action && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-xs border-medical-blue/30 text-medical-blue hover:bg-medical-blue/10"
                  >
                    {insight.action}
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
        
        <div className="mt-6 p-4 bg-gradient-to-r from-medical-blue/10 to-energy-orange/10 rounded-lg border border-medical-blue/30">
          <div className="flex items-center space-x-3">
            <Brain className="w-6 h-6 text-medical-blue" />
            <div>
              <h4 className="font-semibold text-white mb-1">Следующий анализ</h4>
              <p className="text-sm text-gray-300">
                Рекомендуется через 6 недель. AI-модель предсказывает улучшение показателей на 15%.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
