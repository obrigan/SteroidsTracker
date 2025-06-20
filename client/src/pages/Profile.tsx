The code is updated to include biometric authentication functionality with UI elements and state management.
```

```replit_final_file
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  Settings, 
  Trophy, 
  TrendingUp, 
  Download,
  Shield,
  Bell,
  Moon,
  LogOut,
  Star,
  Award,
  Target,
  Calendar,
  Camera,
  Fingerprint
} from "lucide-react";
import { BiometricAuth } from "@/lib/biometricAuth";

interface Achievement {
  id: number;
  achievementType: string;
  achievementName: string;
  description: string;
  iconUrl: string;
  xpReward: number;
  unlockedAt: string;
}

interface DashboardStats {
  activeCourses: number;
  totalInjections: number;
  totalBloodTests: number;
  totalPhotos: number;
  currentStreak: number;
  level: number;
  xp: number;
}

export default function Profile() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { toast } = useToast();
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [biometricSupported, setBiometricSupported] = useState(false);

  useEffect(() => {
    checkBiometricStatus();
  }, []);

  const checkBiometricStatus = async () => {
    const supported = await BiometricAuth.isAvailable();
    setBiometricSupported(supported);

    const hasCredential = localStorage.getItem('biometric_credential_id');
    setBiometricEnabled(!!hasCredential);
  };

  const handleBiometricToggle = async (enabled: boolean) => {
    if (enabled) {
      try {
        const credential = await BiometricAuth.register(
          user?.id || "dev-user-123",
          `${user?.firstName} ${user?.lastName}` || "Dev User"
        );

        if (credential) {
          localStorage.setItem('biometric_credential_id', credential.id);
          setBiometricEnabled(true);
          toast({
            title: "Биометрия включена",
            description: "Теперь вы можете входить с помощью отпечатка пальца",
          });
        }
      } catch (error) {
        toast({
          title: "Ошибка",
          description: "Не удалось настроить биометрию",
          variant: "destructive",
        });
      }
    } else {
      localStorage.removeItem('biometric_credential_id');
      setBiometricEnabled(false);
      toast({
        title: "Биометрия отключена",
        description: "Биометрический вход больше не доступен",
      });
    }
  };

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

  const { data: stats } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
    enabled: !!user,
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
      }
    },
  });

  const { data: achievements } = useQuery<Achievement[]>({
    queryKey: ["/api/achievements"],
    enabled: !!user,
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
      }
    },
  });

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

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const xpForNextLevel = ((stats?.level || 1) * 300);
  const xpProgress = ((stats?.xp || 0) / xpForNextLevel) * 100;

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-deep-black p-6 pb-24">
        <div className="max-w-md mx-auto">
          <Skeleton className="h-32 w-full mb-6 bg-card-surface" />
          <Skeleton className="h-48 w-full mb-4 bg-card-surface" />
          <Skeleton className="h-32 w-full bg-card-surface" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-deep-black text-white pb-24">
      {/* PWA Status Bar */}
      <div className="h-1 bg-gradient-to-r from-medical-blue via-health-green to-energy-orange"></div>

      <div className="max-w-md mx-auto">
        {/* Safe area */}
        <div className="h-8"></div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-6 py-4"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-google-sans font-bold">Profile</h1>
              <p className="text-gray-400 text-sm">Manage your account & progress</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </motion.div>

        {/* User Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="px-6 mb-6"
        >
          <Card className="bg-gradient-to-br from-medical-blue/20 to-purple-900/20 border border-medical-blue/30">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-medical-blue to-health-green flex items-center justify-center">
                    {user?.profileImageUrl ? (
                      <img
                        src={user.profileImageUrl}
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-8 h-8 text-white" />
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                    <Star className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-google-sans font-bold text-white">
                    {getUserDisplayName()}
                  </h2>
                  <p className="text-gray-400 text-sm">{user?.email}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                      Level {stats?.level || 1}
                    </Badge>
                    <Badge variant="outline" className="text-gray-400 border-gray-600">
                      {stats?.xp || 0} XP
                    </Badge>
                  </div>
                </div>
              </div>

              {/* XP Progress */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>Progress to next level</span>
                  <span>{Math.round(xpProgress)}%</span>
                </div>
                <div className="bg-card-surface rounded-full h-2">
                  <motion.div
                    className="bg-gradient-to-r from-medical-blue to-health-green h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${xpProgress}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="px-6 mb-6"
        >
          <Card className="bg-card-surface border-gray-800">
            <CardHeader>
              <CardTitle className="text-white font-google-sans flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-health-green" />
                Your Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-medical-blue mb-1">
                    {stats?.activeCourses || 0}
                  </div>
                  <p className="text-xs text-gray-400">Active Courses</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-health-green mb-1">
                    {stats?.totalInjections || 0}
                  </div>
                  <p className="text-xs text-gray-400">Total Injections</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-energy-orange mb-1">
                    {stats?.totalBloodTests || 0}
                  </div>
                  <p className="text-xs text-gray-400">Blood Tests</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400 mb-1">
                    {stats?.currentStreak || 0}
                  </div>
                  <p className="text-xs text-gray-400">Day Streak</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="px-6 mb-6"
        >
          <Card className="bg-card-surface border-gray-800">
            <CardHeader>
              <CardTitle className="text-white font-google-sans flex items-center">
                <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
                Recent Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              {achievements && achievements.length > 0 ? (
                <div className="space-y-3">
                  {achievements.slice(0, 3).map((achievement) => (
                    <div key={achievement.id} className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
                        <span className="text-lg">{achievement.iconUrl}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white text-sm">
                          {achievement.achievementName}
                        </h4>
                        <p className="text-xs text-gray-400">
                          {achievement.description}
                        </p>
                      </div>
                      {achievement.xpReward > 0 && (
                        <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">
                          +{achievement.xpReward} XP
                        </Badge>
                      )}
                    </div>
                  ))}
                  <Button
                    variant="ghost"
                    className="w-full text-medical-blue hover:text-medical-blue/90 hover:bg-medical-blue/10"
                  >
                    View All Achievements
                  </Button>
                </div>
              ) : (
                <div className="text-center py-4">
                  <Award className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">No achievements yet</p>
                  <p className="text-xs text-gray-500">Keep logging to unlock rewards!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Settings & Actions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="px-6 mb-8"
        >
          <Card className="bg-card-surface border-gray-800">
            <CardHeader>
              <CardTitle className="text-white font-google-sans">Settings & Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-energy-orange" />
                  <span>Push-уведомления</span>
                </div>
                <Button variant="ghost" size="sm" className="text-gray-400">
                  Настроить
                </Button>
              </div>

              <Separator className="bg-gray-700" />

              {/* Biometric Settings */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Fingerprint className="w-5 h-5 text-medical-blue" />
                  <div>
                    <span>Биометрический вход</span>
                    {!biometricSupported && (
                      <p className="text-xs text-gray-500">Не поддерживается на этом устройстве</p>
                    )}
                  </div>
                </div>
                {biometricSupported && (
                  <Switch
                    checked={biometricEnabled}
                    onCheckedChange={handleBiometricToggle}
                  />
                )}
              </div>
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800"
              >
                <Shield className="w-4 h-4 mr-3" />
                Privacy & Security
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800"
              >
                <Download className="w-4 h-4 mr-3" />
                Export Data
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800"
              >
                <Moon className="w-4 h-4 mr-3" />
                Appearance
              </Button>
              <div className="pt-2 border-t border-gray-700">
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="w-full justify-start text-medical-red hover:text-medical-red/90 hover:bg-medical-red/10"
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
```The code is updated to include biometric authentication functionality with UI elements and state management.
```