
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";
import { 
  Bell, Clock, TestTube, Syringe, Calendar, 
  Brain, Smartphone, Watch, AlertTriangle, CheckCircle
} from "lucide-react";
import { NotificationService } from "@/lib/notifications";

interface SmartReminder {
  id: string;
  type: 'injection' | 'blood_test' | 'health_check' | 'educational';
  title: string;
  description: string;
  scheduledTime: string;
  enabled: boolean;
  priority: 'high' | 'medium' | 'low';
  aiGenerated: boolean;
  recommendations: string[];
}

interface SmartRemindersProps {
  userId: string;
  userPreferences: any;
}

export function SmartReminders({ userId, userPreferences }: SmartRemindersProps) {
  const [reminders, setReminders] = useState<SmartReminder[]>([]);
  const [notificationPermission, setNotificationPermission] = useState<string>('default');

  useEffect(() => {
    // Проверяем разрешения на уведомления
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }

    // Генерируем умные напоминания на основе данных пользователя
    generateSmartReminders();
  }, [userId]);

  const generateSmartReminders = () => {
    // Здесь будет AI-логика для генерации персональных напоминаний
    const intelligentReminders: SmartReminder[] = [
      {
        id: 'next_injection',
        type: 'injection',
        title: 'Следующая инъекция',
        description: 'Тестостерон энантат 250мг - правая дельта',
        scheduledTime: 'Завтра в 19:00',
        enabled: true,
        priority: 'high',
        aiGenerated: true,
        recommendations: [
          'Подготовьте инсулиновый шприц',
          'Протрите место инъекции спиртом',
          'Смените место укола для предотвращения фиброза'
        ]
      },
      {
        id: 'blood_test_reminder',
        type: 'blood_test',
        title: 'Контрольные анализы',
        description: 'Пора проверить печеночные показатели',
        scheduledTime: 'Через 3 дня',
        enabled: true,
        priority: 'high',
        aiGenerated: true,
        recommendations: [
          'Сдавайте натощак (12 часов голодания)',
          'Избегайте алкоголя за 48 часов',
          'Принесите результаты предыдущих анализов'
        ]
      },
      {
        id: 'health_monitoring',
        type: 'health_check',
        title: 'Проверка самочувствия',
        description: 'Ежедневная оценка побочных эффектов',
        scheduledTime: 'Каждый день в 21:00',
        enabled: true,
        priority: 'medium',
        aiGenerated: false,
        recommendations: [
          'Оцените уровень энергии (1-10)',
          'Отметьте изменения настроения',
          'Проверьте наличие акне или отеков'
        ]
      },
      {
        id: 'educational_content',
        type: 'educational',
        title: 'Еженедельное обучение',
        description: 'Новые исследования о ПКТ',
        scheduledTime: 'Каждое воскресенье в 10:00',
        enabled: false,
        priority: 'low',
        aiGenerated: true,
        recommendations: [
          'Изучите новые протоколы восстановления',
          'Узнайте о современных препаратах ПКТ'
        ]
      }
    ];

    setReminders(intelligentReminders);
  };

  const handleNotificationPermission = async () => {
    const notificationService = NotificationService.getInstance();
    const granted = await notificationService.requestPermission();
    setNotificationPermission(granted ? 'granted' : 'denied');
  };

  const toggleReminder = (id: string) => {
    setReminders(prev => prev.map(reminder => 
      reminder.id === id 
        ? { ...reminder, enabled: !reminder.enabled }
        : reminder
    ));
  };

  const getReminderIcon = (type: string) => {
    switch (type) {
      case 'injection': return Syringe;
      case 'blood_test': return TestTube;
      case 'health_check': return Calendar;
      case 'educational': return Brain;
      default: return Bell;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-medical-red border-medical-red/30 bg-medical-red/10';
      case 'medium': return 'text-energy-orange border-energy-orange/30 bg-energy-orange/10';
      case 'low': return 'text-health-green border-health-green/30 bg-health-green/10';
      default: return 'text-gray-400 border-gray-600/30 bg-gray-600/10';
    }
  };

  return (
    <div className="space-y-4">
      <Card className="bg-card-surface border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Bell className="w-5 h-5 mr-2" />
            Умные напоминания
          </CardTitle>
          {notificationPermission !== 'granted' && (
            <div className="flex items-center justify-between p-3 bg-medical-blue/10 rounded-lg border border-medical-blue/30">
              <div className="flex items-center space-x-2">
                <Smartphone className="w-4 h-4 text-medical-blue" />
                <span className="text-sm text-gray-300">
                  Разрешите уведомления для лучшего опыта
                </span>
              </div>
              <Button 
                size="sm" 
                onClick={handleNotificationPermission}
                className="bg-medical-blue hover:bg-medical-blue/80"
              >
                Разрешить
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {reminders.map((reminder, index) => {
            const IconComponent = getReminderIcon(reminder.type);
            return (
              <motion.div
                key={reminder.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border ${
                  reminder.enabled ? 'border-gray-700' : 'border-gray-800 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      reminder.enabled ? 'bg-medical-blue/20' : 'bg-gray-700/50'
                    }`}>
                      <IconComponent className={`w-5 h-5 ${
                        reminder.enabled ? 'text-medical-blue' : 'text-gray-500'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className={`font-semibold ${
                          reminder.enabled ? 'text-white' : 'text-gray-400'
                        }`}>
                          {reminder.title}
                        </h4>
                        {reminder.aiGenerated && (
                          <Badge className="text-xs bg-medical-blue/20 text-medical-blue border-medical-blue/30">
                            AI
                          </Badge>
                        )}
                        <Badge className={`text-xs border ${getPriorityColor(reminder.priority)}`}>
                          {reminder.priority === 'high' ? 'Высокий' :
                           reminder.priority === 'medium' ? 'Средний' : 'Низкий'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-400 mb-2">{reminder.description}</p>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{reminder.scheduledTime}</span>
                      </div>
                    </div>
                  </div>
                  <Switch
                    checked={reminder.enabled}
                    onCheckedChange={() => toggleReminder(reminder.id)}
                  />
                </div>

                {reminder.enabled && reminder.recommendations.length > 0 && (
                  <div className="mt-3 p-3 bg-gray-800/50 rounded-lg">
                    <h5 className="text-xs font-semibold text-gray-300 mb-2 flex items-center">
                      <Brain className="w-3 h-3 mr-1" />
                      AI рекомендации:
                    </h5>
                    <ul className="space-y-1">
                      {reminder.recommendations.map((rec, i) => (
                        <li key={i} className="text-xs text-gray-400 flex items-start">
                          <div className="w-1 h-1 bg-energy-orange rounded-full mt-2 mr-2 flex-shrink-0"></div>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            );
          })}

          <div className="mt-6 p-4 bg-gradient-to-r from-medical-blue/10 to-energy-orange/10 rounded-lg border border-medical-blue/30">
            <div className="flex items-center space-x-3">
              <Watch className="w-6 h-6 text-medical-blue" />
              <div>
                <h4 className="font-semibold text-white mb-1">Интеграция с носимыми</h4>
                <p className="text-sm text-gray-300">
                  Подключите Apple Watch или Garmin для автоматических напоминаний
                </p>
                <Button size="sm" variant="outline" className="mt-2 text-xs">
                  Настроить
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
