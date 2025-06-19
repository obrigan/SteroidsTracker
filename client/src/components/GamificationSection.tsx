import { Award, Star, Trophy, Zap } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { ProgressRing } from "./ProgressRing";

interface GamificationSectionProps {
  userLevel: number;
  currentXP: number;
  xpToNextLevel: number;
  recentAchievements: Array<{
    id: number;
    achievementName: string;
    iconUrl: string;
    xpReward: number;
    unlockedAt: string;
  }>;
}

export function GamificationSection({ 
  userLevel, 
  currentXP, 
  xpToNextLevel, 
  recentAchievements 
}: GamificationSectionProps) {
  const progressToNext = (currentXP / xpToNextLevel) * 100;

  return (
    <Card className="p-6 mb-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
          <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
          Прогресс и достижения
        </h3>
        <Badge variant="secondary" className="bg-purple-100 text-purple-700">
          Уровень {userLevel}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* XP Progress */}
        <div className="flex items-center space-x-4">
          <ProgressRing
            value={progressToNext}
            size={80}
            strokeWidth={6}
            color="hsl(280, 100%, 70%)"
            backgroundColor="hsl(280, 100%, 70%, 0.1)"
            animate={true}
          >
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">
                {Math.round(progressToNext)}%
              </div>
            </div>
          </ProgressRing>
          
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              До следующего уровня
            </p>
            <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {currentXP} / {xpToNextLevel} XP
            </p>
            <p className="text-sm text-purple-600">
              Осталось: {xpToNextLevel - currentXP} XP
            </p>
          </div>
        </div>

        {/* Recent Achievements */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center">
            <Star className="w-4 h-4 mr-1 text-yellow-500" />
            Последние достижения
          </h4>
          
          {recentAchievements.length > 0 ? (
            <div className="space-y-2">
              {recentAchievements.slice(0, 3).map((achievement) => (
                <div
                  key={achievement.id}
                  className="flex items-center space-x-3 p-2 bg-white/50 dark:bg-gray-800/50 rounded-lg"
                >
                  <Award className="w-5 h-5 text-yellow-500" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {achievement.achievementName}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      +{achievement.xpReward} XP
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <Zap className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Начните отслеживать активность для получения достижений
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}