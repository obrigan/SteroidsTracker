import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AdvancedAchievements } from "@/components/AdvancedAchievements";
import { motion } from "framer-motion";
import { User, Settings, LogOut, Award, TrendingUp, Calendar, Shield } from "lucide-react";

export default function Profile() {
  const { user } = useAuth();

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const achievements = [
    { name: "First Course", description: "Started your first steroid course", earned: true },
    { name: "Safety First", description: "Completed 10 safe injections", earned: true },
    { name: "Health Monitor", description: "Tracked 5 blood tests", earned: false },
    { name: "Knowledge Seeker", description: "Completed 3 learning modules", earned: false },
  ];

  return (
    <div className="min-h-screen bg-deep-black text-white pb-24">
      <div className="h-1 bg-gradient-to-r from-medical-blue via-health-green to-energy-orange"></div>
      
      <div className="max-w-md mx-auto">
        <div className="h-8"></div>
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-6 py-4"
        >
          <h1 className="text-2xl font-google-sans font-bold mb-6">Profile</h1>

          {/* Profile Card */}
          <Card className="bg-card-surface border-gray-800 mb-6">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={user?.profileImageUrl} />
                  <AvatarFallback className="bg-medical-blue/20 text-medical-blue">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    {user?.firstName} {user?.lastName}
                  </h2>
                  <p className="text-gray-400">{user?.email}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge className="bg-health-green/20 text-health-green">
                      Level {user?.level || 1}
                    </Badge>
                    <span className="text-sm text-gray-400">
                      {user?.xp || 0} XP
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Card className="bg-card-surface border-gray-800">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-medical-blue">
                  0
                </div>
                <div className="text-sm text-gray-400">Courses</div>
              </CardContent>
            </Card>
            <Card className="bg-card-surface border-gray-800">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-energy-orange">
                  0
                </div>
                <div className="text-sm text-gray-400">Injections</div>
              </CardContent>
            </Card>
          </div>

          {/* Advanced Achievements */}
          <AdvancedAchievements 
            userLevel={user?.level || 1}
            userXP={user?.xp || 0}
            currentStreak={0}
          />

          {/* Actions */}
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => alert("Settings coming soon")}
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start text-red-400 hover:text-red-300"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}