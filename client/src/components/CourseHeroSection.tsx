
import { Calendar, Clock, Target } from "lucide-react";
import { ProgressRing } from "./ProgressRing";
import { Card } from "./ui/card";

interface CourseHeroSectionProps {
  activeCourse?: {
    name: string;
    currentWeek: number;
    totalWeeks: number;
    nextInjectionDays: number;
    phase: "active" | "pct" | "break";
  };
}

export function CourseHeroSection({ activeCourse }: CourseHeroSectionProps) {
  if (!activeCourse) {
    return (
      <Card className="p-6 mb-6 bg-gradient-to-r from-medical-blue/10 to-health-green/10 border-medical-blue/20">
        <div className="text-center">
          <Target className="w-12 h-12 mx-auto mb-4 text-medical-blue" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Начните свой первый курс
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Создайте курс для отслеживания прогресса
          </p>
        </div>
      </Card>
    );
  }

  const progressPercentage = (activeCourse.currentWeek / activeCourse.totalWeeks) * 100;
  
  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case "active": return "text-health-green";
      case "pct": return "text-energy-orange";
      case "break": return "text-gray-500";
      default: return "text-health-green";
    }
  };

  const getPhaseText = (phase: string) => {
    switch (phase) {
      case "active": return "Активная фаза";
      case "pct": return "ПКТ";
      case "break": return "Перерыв";
      default: return "Активная фаза";
    }
  };

  return (
    <Card className="p-6 mb-6 bg-gradient-to-r from-medical-blue/10 to-health-green/10 border-medical-blue/20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">
            {activeCourse.name}
          </h2>
          <span className={`text-sm font-medium ${getPhaseColor(activeCourse.phase)}`}>
            {getPhaseText(activeCourse.phase)}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center justify-center mb-4">
            <ProgressRing
              value={progressPercentage}
              size={120}
              strokeWidth={8}
              color="hsl(142, 76%, 36%)"
              backgroundColor="hsl(142, 76%, 36%, 0.1)"
              animate={true}
              className="drop-shadow-lg"
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {Math.round(progressPercentage)}%
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  завершено
                </div>
              </div>
            </ProgressRing>
          </div>
          
          <div className="text-center mb-4">
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Неделя {activeCourse.currentWeek} из {activeCourse.totalWeeks}
            </p>
          </div>
        </div>

        <div className="flex-1 space-y-4">
          <div className="flex items-center space-x-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
            <Clock className="w-5 h-5 text-medical-blue" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Следующая инъекция
              </p>
              <p className="text-lg font-bold text-medical-blue">
                через {activeCourse.nextInjectionDays} {activeCourse.nextInjectionDays === 1 ? 'день' : 'дня'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
            <Calendar className="w-5 h-5 text-health-green" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Осталось недель
              </p>
              <p className="text-lg font-bold text-health-green">
                {activeCourse.totalWeeks - activeCourse.currentWeek}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}