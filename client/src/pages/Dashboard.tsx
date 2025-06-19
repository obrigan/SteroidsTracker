import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ProgressRing } from "@/components/ProgressRing";
import { StatCard } from "@/components/StatCard";
import { ActivityItem } from "@/components/ActivityItem";
import { QuickActionModal } from "@/components/QuickActionModal";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import { CourseHeroSection } from "@/components/CourseHeroSection";
import { QuickActions } from "@/components/QuickActions";
import { GamificationSection } from "@/components/GamificationSection";
import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useToast } from "@/hooks/use-toast";

interface DashboardStats {
  activeCourses: number;
  totalInjections: number;
  totalBloodTests: number;
  totalPhotos: number;
  currentStreak: number;
  level: number;
  xp: number;
}

interface Activity {
  id: string;
  type: string;
  title: string;
  description: string;
  date: string;
  xp: number;
  icon: string;
  color: string;
}

export default function Dashboard() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { toast } = useToast();
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);

  useEffect(() => {
    if (!isAuthLoading && !user) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [user, isAuthLoading, toast]);

  const { data: stats, isLoading: isStatsLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
    enabled: !!user,
  });

  const { data: activities, isLoading: isActivitiesLoading } = useQuery<Activity[]>({
    queryKey: ["/api/dashboard/activity"],
    enabled: !!user,
  });

  if (isAuthLoading || isStatsLoading) {
    return (
      <div className="min-h-screen bg-deep-black p-6">
        <div className="max-w-md mx-auto">
          <Skeleton className="h-32 w-full mb-6 bg-card-surface" />
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 bg-card-surface" />
            ))}
          </div>
          <Skeleton className="h-48 w-full bg-card-surface" />
        </div>
      </div>
    );
  }

  const getUserDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    } else if (user?.firstName) {
      return user.firstName;
    } else if (user?.email) {
      return user.email.split('@')[0];
    }
    return "User";
  };

  const xpForNextLevel = ((stats?.level || 1) * 300);
  const xpProgress = ((stats?.xp || 0) / xpForNextLevel) * 100;

  return (
    <>
      <div className="min-h-screen bg-deep-black text-white pb-24">
        {/* PWA Status Bar */}
        <div className="h-1 bg-gradient-to-r from-medical-blue via-health-green to-energy-orange"></div>
        
        <div className="max-w-md mx-auto">
          {/* Safe area for status bar */}
          <div className="h-8"></div>
          
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="px-6 py-4"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-google-sans font-bold text-white">
                  <span className="animate-pulse">👋</span> Hi, {getUserDisplayName()}!
                </h1>
                <p className="text-gray-400 text-sm mt-1">
                  Today is a great day for progress
                </p>
              </div>
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-medical-blue to-health-green flex items-center justify-center">
                  {user?.profileImageUrl ? (
                    <img
                      src={user.profileImageUrl}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-white text-xl">👤</span>
                  )}
                </div>
                {(stats?.level || 0) > 1 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-energy-orange rounded-full flex items-center justify-center animate-pulse">
                    <span className="text-xs font-bold text-white">{stats?.level}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Course Hero Section */}
            <CourseHeroSection 
              activeCourse={stats?.activeCourses ? {
                name: "Тестостерон Энантат 500мг",
                currentWeek: 6,
                totalWeeks: 12,
                nextInjectionDays: 2,
                phase: "active"
              } : undefined}
            />

            {/* Gamification Section */}
            <GamificationSection
              userLevel={stats?.level || 1}
              currentXP={stats?.xp || 0}
              xpToNextLevel={xpForNextLevel}
              recentAchievements={[]}
            />

            {/* Quick Actions Section */}
            <QuickActions
              onAddInjection={() => setIsQuickActionOpen(true)}
              onAddBloodTest={() => setIsQuickActionOpen(true)}
              onAddPhoto={() => setIsQuickActionOpen(true)}
            />
          </motion.div>
          
          {/* Stats Ring Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="px-6 mb-8"
          >
            <h2 className="text-lg font-google-sans font-semibold mb-4">Statistics</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <StatCard
                value={stats?.activeCourses || 0}
                label="Активные курсы"
                color="medical-blue"
                progress={Math.min((stats?.activeCourses || 0) * 50, 100)}
                icon="courses"
              />
              <StatCard
                value={stats?.totalInjections || 0}
                label="Всего инъекций"
                color="health-green"
                progress={Math.min((stats?.totalInjections || 0) * 2, 100)}
                icon="injections"
              />
              <StatCard
                value={stats?.totalBloodTests || 0}
                label="Анализы крови"
                color="energy-orange"
                progress={Math.min((stats?.totalBloodTests || 0) * 20, 100)}
                icon="tests"
              />
              <StatCard
                value={stats?.currentStreak || 0}
                label="Текущий стрик"
                color="purple-400"
                progress={Math.min((stats?.currentStreak || 0) * 10, 100)}
                icon="streak"
              />
            </div>
          </motion.div>
          
          {/* Recent Activity Section */}
          {activities && activities.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="px-6 mb-8"
            >
              <h2 className="text-lg font-google-sans font-semibold mb-4">Недавняя активность</h2>
              <div className="space-y-3">
                {activities.slice(0, 3).map((activity: any, index: number) => (
                  <ActivityItem key={activity.id} activity={activity} index={index} />
                ))}
              </div>
            </motion.div>
          )}
          
          {/* Gamification Section */}
          {stats && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="px-6 mb-8"
            >
              <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 border border-purple-500/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-google-sans font-semibold">🏆 Achievements</h2>
                    <div className="flex items-center space-x-1">
                      <span className="text-2xl">⭐</span>
                      <span className="text-xl font-bold text-yellow-400">Level {stats.level}</span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-400 mb-2">
                      <span>{stats.xp} XP</span>
                      <span>{xpForNextLevel} XP</span>
                    </div>
                    <div className="bg-card-surface rounded-full h-3">
                      <motion.div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${xpProgress}%` }}
                        transition={{ duration: 1, delay: 0.8 }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <div className="flex-1 bg-card-surface rounded-xl p-3 text-center">
                      <div className="text-2xl mb-1">🎯</div>
                      <p className="text-xs text-gray-400">
                        Streak: {stats.currentStreak} days
                      </p>
                    </div>
                    <div className="flex-1 bg-card-surface rounded-xl p-3 text-center">
                      <div className="text-2xl mb-1">🔬</div>
                      <p className="text-xs text-gray-400">Regular Tests</p>
                    </div>
                    <div className="flex-1 bg-card-surface rounded-xl p-3 text-center">
                      <div className="text-2xl mb-1">📸</div>
                      <p className="text-xs text-gray-400">
                        {stats.totalPhotos} Photos
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
          
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="px-6 mb-8"
          >
            <h2 className="text-lg font-google-sans font-semibold mb-4">Recent Activity</h2>
            
            <div className="space-y-3">
              {isActivitiesLoading ? (
                [1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 bg-card-surface" />
                ))
              ) : activities && activities.length > 0 ? (
                activities.slice(0, 5).map((activity) => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))
              ) : (
                <Card className="bg-card-surface border-gray-800">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-2">🚀</div>
                    <h3 className="font-semibold text-white mb-2">Start Your Journey</h3>
                    <p className="text-sm text-gray-400 mb-4">
                      Log your first injection or blood test to begin tracking
                    </p>
                    <Button
                      onClick={() => setIsQuickActionOpen(true)}
                      className="bg-medical-blue hover:bg-medical-blue/90"
                    >
                      Get Started
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating Action Button */}
      <FloatingActionButton onClick={() => setIsQuickActionOpen(true)} />

      {/* Quick Action Modal */}
      <QuickActionModal
        isOpen={isQuickActionOpen}
        onClose={() => setIsQuickActionOpen(false)}
      />
    </>
  );
}
