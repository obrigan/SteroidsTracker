import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { 
  Share2, Users, Trophy, Camera, 
  Heart, MessageCircle, Copy, ExternalLink
} from "lucide-react";
import { telegramWebApp } from "@/lib/telegramWebApp";
import { useToast } from "@/hooks/use-toast";

interface ShareableContent {
  type: 'achievement' | 'progress' | 'milestone' | 'course_completion';
  title: string;
  description: string;
  stats: Record<string, number>;
  imageUrl?: string;
}

interface TelegramShareCardProps {
  content: ShareableContent;
  userStats: {
    level: number;
    totalInjections: number;
    currentStreak: number;
  };
}

export function TelegramShareCard({ content, userStats }: TelegramShareCardProps) {
  const { toast } = useToast();
  const [isSharing, setIsSharing] = useState(false);

  const generateShareText = () => {
    const emojis = {
      achievement: '🏆',
      progress: '💪',
      milestone: '🎯',
      course_completion: '✅'
    };

    const emoji = emojis[content.type];
    
    let shareText = `${emoji} ${content.title}\n\n`;
    shareText += `${content.description}\n\n`;
    
    // Добавляем статистику
    if (content.stats) {
      Object.entries(content.stats).forEach(([key, value]) => {
        const statEmoji = getStatEmoji(key);
        shareText += `${statEmoji} ${formatStatName(key)}: ${value}\n`;
      });
    }
    
    shareText += `\n🌟 Общий прогресс:\n`;
    shareText += `• Уровень: ${userStats.level}\n`;
    shareText += `• Стрик: ${userStats.currentStreak} дней\n`;
    shareText += `• Инъекций: ${userStats.totalInjections}\n\n`;
    shareText += `Присоединяйся к безопасному трекингу! @SteroidTrackerBot`;

    return shareText;
  };

  const getStatEmoji = (statKey: string): string => {
    const emojiMap: Record<string, string> = {
      weight_gained: '⚖️',
      strength_increase: '💪',
      body_fat_lost: '🔥',
      weeks_completed: '📅',
      blood_tests_done: '🩸',
      side_effects: '⚠️',
      adherence_rate: '✅'
    };
    return emojiMap[statKey] || '📊';
  };

  const formatStatName = (statKey: string): string => {
    const nameMap: Record<string, string> = {
      weight_gained: 'Набрано веса',
      strength_increase: 'Рост силы',
      body_fat_lost: 'Потеряно жира',
      weeks_completed: 'Недель завершено',
      blood_tests_done: 'Анализов сдано',
      side_effects: 'Побочные эффекты',
      adherence_rate: 'Соблюдение плана'
    };
    return nameMap[statKey] || statKey;
  };

  const shareToTelegram = async () => {
    setIsSharing(true);
    telegramWebApp.hapticImpact('medium');

    try {
      const shareText = generateShareText();
      
      // Отправляем данные боту для создания красивой карточки
      telegramWebApp.sendDataToBot({
        action: 'create_share_card',
        content: {
          ...content,
          shareText,
          userStats
        }
      });

      telegramWebApp.hapticNotification('success');
      toast({
        title: "Готово к публикации",
        description: "Выберите где поделиться достижением"
      });
    } catch (error) {
      telegramWebApp.hapticNotification('error');
      toast({
        title: "Ошибка",
        description: "Не удалось подготовить к публикации",
        variant: "destructive"
      });
    } finally {
      setIsSharing(false);
    }
  };

  const copyToClipboard = async () => {
    telegramWebApp.hapticImpact('light');
    
    try {
      const shareText = generateShareText();
      await navigator.clipboard.writeText(shareText);
      
      telegramWebApp.hapticNotification('success');
      toast({
        title: "Скопировано",
        description: "Текст скопирован в буфер обмена"
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось скопировать текст",
        variant: "destructive"
      });
    }
  };

  const shareToStory = () => {
    telegramWebApp.hapticImpact('medium');
    
    telegramWebApp.sendDataToBot({
      action: 'create_story',
      content: {
        ...content,
        userStats,
        template: 'achievement_story'
      }
    });

    toast({
      title: "История создана",
      description: "Опубликуйте в своей истории Telegram"
    });
  };

  return (
    <Card className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border-purple-500/30">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center">
            <Share2 className="w-5 h-5 mr-2 text-purple-400" />
            Поделиться достижением
          </div>
          <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
            {content.type}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Preview Card */}
        <div className="bg-card-surface border border-gray-700 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white mb-1">{content.title}</h3>
              <p className="text-sm text-gray-300 mb-2">{content.description}</p>
              
              {/* Stats preview */}
              <div className="flex flex-wrap gap-2">
                {Object.entries(content.stats).slice(0, 3).map(([key, value]) => (
                  <Badge key={key} variant="outline" className="text-xs">
                    {getStatEmoji(key)} {value}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={shareToTelegram}
            disabled={isSharing}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Users className="w-4 h-4 mr-2" />
            {isSharing ? 'Подготовка...' : 'В чат/группу'}
          </Button>
          
          <Button
            onClick={shareToStory}
            variant="outline"
            className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10"
          >
            <Camera className="w-4 h-4 mr-2" />
            В историю
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={copyToClipboard}
            variant="ghost"
            size="sm"
            className="text-gray-300 hover:text-white"
          >
            <Copy className="w-4 h-4 mr-2" />
            Копировать
          </Button>
          
          <Button
            onClick={() => {
              telegramWebApp.hapticImpact('light');
              telegramWebApp.sendDataToBot({
                action: 'share_external',
                content: generateShareText()
              });
            }}
            variant="ghost"
            size="sm"
            className="text-gray-300 hover:text-white"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Другие соцсети
          </Button>
        </div>

        {/* Engagement Stats */}
        <div className="flex items-center justify-between text-sm text-gray-400 pt-2 border-t border-gray-700">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <Heart className="w-4 h-4 mr-1" />
              {Math.floor(Math.random() * 50) + 10}
            </span>
            <span className="flex items-center">
              <MessageCircle className="w-4 h-4 mr-1" />
              {Math.floor(Math.random() * 20) + 3}
            </span>
          </div>
          <span>Ожидаемые реакции</span>
        </div>
      </CardContent>
    </Card>
  );
}