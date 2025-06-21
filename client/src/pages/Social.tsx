
import React from "react";
import { motion } from "framer-motion";
import { SocialHub } from "@/components/SocialHub";
import { AIInsights } from "@/components/AIInsights";

export default function Social() {
  const mockUserStats = {
    totalInjections: 24,
    totalBloodTests: 3,
    currentStreak: 18,
    level: 8
  };

  return (
    <div className="min-h-screen bg-deep-black text-white pb-24">
      <div className="h-1 bg-gradient-to-r from-medical-blue via-health-green to-energy-orange"></div>
      
      <div className="max-w-md mx-auto">
        <div className="h-8"></div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-6 py-4"
        >
          <h1 className="text-2xl font-google-sans font-bold mb-6">Сообщество</h1>
          
          {/* ИИ Инсайты */}
          <div className="mb-6">
            <AIInsights userStats={mockUserStats} />
          </div>
          
          {/* Социальный хаб */}
          <SocialHub />
        </motion.div>
      </div>
    </div>
  );
}
