import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { BiometricAuthComponent } from "@/components/BiometricAuth";
import { BiometricAuth } from "@/lib/biometricAuth";

export default function Landing() {
  const [showBiometric, setShowBiometric] = useState(false);
  const [biometricSupported, setBiometricSupported] = useState(false);

  useEffect(() => {
    checkBiometricSupport();
  }, []);

  const checkBiometricSupport = async () => {
    const supported = await BiometricAuth.isAvailable();
    setBiometricSupported(supported);
    
    // Показываем биометрию если она поддерживается и уже настроена
    const hasCredential = localStorage.getItem('biometric_credential_id');
    if (supported && hasCredential) {
      setShowBiometric(true);
    }
  };

  const handleBiometricSuccess = () => {
    // Перенаправляем на главную страницу после успешной биометрической аутентификации
    window.location.href = '/';
  };

  const handleBiometricRegister = () => {
    setShowBiometric(true);
  };

  return (
    <div className="min-h-screen bg-deep-black text-white flex flex-col">
      {/* PWA Status Bar */}
      <div className="h-1 bg-gradient-to-r from-medical-blue via-health-green to-energy-orange"></div>
      
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          {/* App Logo */}
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-medical-blue to-health-green rounded-3xl flex items-center justify-center">
            <span className="text-4xl">💉</span>
          </div>
          
          <h1 className="text-4xl font-google-sans font-bold mb-4 bg-gradient-to-r from-medical-blue to-health-green bg-clip-text text-transparent">
            SteroidTracker
          </h1>
          <p className="text-xl text-gray-400 mb-2">
            Professional Cycle Tracking
          </p>
          <p className="text-sm text-gray-500">
            Safe, secure, and scientifically designed
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-full max-w-sm space-y-6"
        >
          {/* Features */}
          <div className="grid grid-cols-1 gap-4">
            <Card className="bg-card-surface border-gray-800">
              <CardContent className="p-4 text-center">
                <div className="text-2xl mb-2">🎯</div>
                <h3 className="font-semibold text-white mb-1">Smart Tracking</h3>
                <p className="text-sm text-gray-400">AI-powered cycle management</p>
              </CardContent>
            </Card>
            
            <Card className="bg-card-surface border-gray-800">
              <CardContent className="p-4 text-center">
                <div className="text-2xl mb-2">🏆</div>
                <h3 className="font-semibold text-white mb-1">Gamification</h3>
                <p className="text-sm text-gray-400">Achievements & XP system</p>
              </CardContent>
            </Card>
            
            <Card className="bg-card-surface border-gray-800">
              <CardContent className="p-4 text-center">
                <div className="text-2xl mb-2">🔒</div>
                <h3 className="font-semibold text-white mb-1">100% Private</h3>
                <p className="text-sm text-gray-400">Your data stays secure</p>
              </CardContent>
            </Card>
          </div>

          {/* Biometric Authentication */}
          {showBiometric ? (
            <BiometricAuthComponent 
              onSuccess={handleBiometricSuccess}
              onRegister={handleBiometricRegister}
            />
          ) : (
            <div className="space-y-4">
              {/* Login Button */}
              <Button
                onClick={() => window.location.href = '/api/login'}
                className="w-full h-14 bg-gradient-to-r from-medical-blue to-health-green hover:from-medical-blue/90 hover:to-health-green/90 text-white font-semibold text-lg rounded-2xl transition-all duration-300 transform hover:scale-105"
              >
                Get Started
              </Button>
              
              {/* Biometric Setup Option */}
              {biometricSupported && (
                <Button
                  onClick={() => setShowBiometric(true)}
                  variant="outline"
                  className="w-full h-12 border-medical-blue text-medical-blue hover:bg-medical-blue hover:text-white transition-all duration-300"
                >
                  Настроить биометрический вход
                </Button>
              )}
            </div>
          )}
          
          <p className="text-xs text-center text-gray-500">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="p-6 text-center">
        <p className="text-xs text-gray-600">
          © 2025 SteroidTracker. For educational purposes only.
        </p>
      </div>
    </div>
  );
}
