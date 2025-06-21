import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { 
  MessageCircle, Bell, Share2, Calendar, 
  Target, Zap, Bot, Settings, Users, 
  Clock, TrendingUp
} from "lucide-react";
import { telegramWebApp } from "@/lib/telegramWebApp";
import { useToast } from "@/hooks/use-toast";

interface BotAction {
  id: string;
  title: string;
  description: string;
  icon: any;
  action: () => void;
  enabled: boolean;
  premium?: boolean;
}

interface TelegramBotActionsProps {
  userStats: {
    totalInjections: number;
    currentStreak: number;
    level: number;
  };
}

export function TelegramBotActions({ userStats }: TelegramBotActionsProps) {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(telegramWebApp.isTelegramWebApp());

  const botActions: BotAction[] = [
    {
      id: 'daily_reminder',
      title: 'Ежедневные напоминания',
      description: 'Бот будет напоминать о инъекциях и анализах',
      icon: Bell,
      enabled: true,
      action: () => setupDailyReminders()
    },
    {
      id: 'quick_log',
      title: 'Быстрая запись',
      description: 'Логирование инъекций через чат с ботом',
      icon: MessageCircle,
      enabled: true,
      action: () => enableQuickLogging()
    },
    {
      id: 'progress_reports',
      title: 'Отчеты прогресса',
      description: 'Еженедельные отчеты о вашем прогрессе',
      icon: TrendingUp,
      enabled: true,
      action: () => setupProgressReports()
    },
    {
      id: 'group_challenges',
      title: 'Групповые челленджи',
      description: 'Участие в челленджах сообщества',
      icon: Users,
      enabled: false,
      premium: true,
      action: () => joinGroupChallenges()
    },
    {
      id: 'ai_coach',
      title: 'ИИ Тренер',
      description: 'Персональные рекомендации от ИИ',
      icon: Bot,
      enabled: false,
      premium: true,
      action: () => enableAICoach()
    },
    {
      id: 'share_achievements',
      title: 'Поделиться достижениями',
      description: 'Делитесь прогрессом с друзьями',
      icon: Share2,
      enabled: true,
      action: () => shareAchievements()
    }
  ];

  const setupDailyReminders = async () => {
    if (!isConnected) {
      toast({
        title: "Требуется Telegram",
        description: "Откройте приложение через Telegram бота",
        variant: "destructive"
      });
      return;
    }

    telegramWebApp.hapticImpact('light');
    
    const confirmed = await telegramWebApp.showConfirm(
      "Настроить ежедневные напоминания? Бот будет присылать уведомления о предстоящих инъекциях и анализах."
    );

    if (confirmed) {
      // Сохраняем настройки в облачном хранилище Telegram
      await telegramWebApp.saveToCloud('daily_reminders', 'enabled');
      
      // Отправляем данные боту для настройки напоминаний
      telegramWebApp.sendDataToBot({
        action: 'setup_reminders',
        userStats,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      });

      telegramWebApp.hapticNotification('success');
      toast({
        title: "Напоминания настроены",
        description: "Бот будет присылать уведомления каждый день"
      });
    }
  };

  const enableQuickLogging = async () => {
    if (!isConnected) return;

    telegramWebApp.hapticImpact('medium');
    
    await telegramWebApp.showAlert(
      "Теперь вы можете логировать инъекции прямо в чате с ботом! Просто напишите:\n\n" +
      "💉 Тест 250мг дельта\n" +
      "🩸 Сдал анализы\n" +
      "📸 Фото прогресса"
    );

    // Сохраняем настройку
    await telegramWebApp.saveToCloud('quick_logging', 'enabled');
    
    telegramWebApp.sendDataToBot({
      action: 'enable_quick_logging',
      userId: telegramWebApp.getTelegramUser()?.id
    });
  };

  const setupProgressReports = async () => {
    if (!isConnected) return;

    telegramWebApp.hapticImpact('light');
    
    const confirmed = await telegramWebApp.showConfirm(
      "Получать еженедельные отчеты о прогрессе? Бот будет анализировать ваши данные и присылать детальную статистику."
    );

    if (confirmed) {
      await telegramWebApp.saveToCloud('progress_reports', 'enabled');
      
      telegramWebApp.sendDataToBot({
        action: 'setup_progress_reports',
        frequency: 'weekly',
        userStats
      });

      telegramWebApp.hapticNotification('success');
      toast({
        title: "Отчеты настроены",
        description: "Еженедельные отчеты будут приходить по воскресеньям"
      });
    }
  };

  const joinGroupChallenges = () => {
    telegramWebApp.hapticImpact('heavy');
    toast({
      title: "Premium функция",
      description: "Групповые челленджи доступны в Premium версии",
      variant: "destructive"
    });
  };

  const enableAICoach = () => {
    telegramWebApp.hapticImpact('heavy');
    toast({
      title: "Premium функция", 
      description: "ИИ тренер доступен в Premium версии",
      variant: "destructive"
    });
  };

  const shareAchievements = async () => {
    if (!isConnected) return;

    telegramWebApp.hapticImpact('medium');
    
    const shareData = {
      action: 'share_achievement',
      achievement: {
        level: userStats.level,
        streak: userStats.currentStreak,
        injections: userStats.totalInjections
      }
    };

    // Создаем красивое сообщение для поделиться
    const message = `💪 Мой прогресс в SteroidTracker:\n\n` +
      `🏆 Уровень: ${userStats.level}\n` +
      `🔥 Стрик: ${userStats.currentStreak} дней\n` +
      `💉 Инъекций: ${userStats.totalInjections}\n\n` +
      `Присоединяйся к безопасному трекингу! @SteroidTrackerBot`;

    telegramWebApp.sendDataToBot(shareData);
    
    toast({
      title: "Достижение готово к публикации",
      description: "Выберите, где поделиться прогрессом"
    });
  };

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Bot className="w-5 h-5 mr-2 text-blue-400" />
            Telegram Bot Функции
            {isConnected && (
              <Badge className="ml-2 bg-green-500/20 text-green-400 border-green-500/30">
                Подключен
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!isConnected && (
            <div className="mb-4 p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
              <p className="text-sm text-orange-300">
                Для использования всех функций откройте приложение через @SteroidTrackerBot
              </p>
            </div>
          )}
          
          <div className="grid grid-cols-1 gap-3">
            {botActions.map((action, index) => (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`cursor-pointer transition-all hover:scale-[1.02] ${
                  action.enabled 
                    ? 'bg-card-surface border-gray-700 hover:border-blue-500/50' 
                    : 'bg-gray-800/50 border-gray-700/50'
                }`}
                onClick={() => action.enabled && action.action()}>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        action.enabled 
                          ? 'bg-blue-500/20 text-blue-400' 
                          : 'bg-gray-700/50 text-gray-500'
                      }`}>
                        <action.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className={`font-semibold ${
                            action.enabled ? 'text-white' : 'text-gray-400'
                          }`}>
                            {action.title}
                          </h4>
                          {action.premium && (
                            <Badge className="text-xs bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                              Premium
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-400 mt-1">
                          {action.description}
                        </p>
                      </div>
                      {action.enabled && (
                        <div className="text-blue-400">
                          <Zap className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {isConnected && (
            <div className="mt-6 p-4 bg-gradient-to-r from-green-900/20 to-blue-900/20 rounded-lg border border-green-500/30">
              <div className="flex items-center space-x-3">
                <Settings className="w-5 h-5 text-green-400" />
                <div>
                  <h4 className="font-semibold text-white">Синхронизация активна</h4>
                  <p className="text-sm text-gray-300">
                    Данные автоматически синхронизируются с Telegram Cloud Storage
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}