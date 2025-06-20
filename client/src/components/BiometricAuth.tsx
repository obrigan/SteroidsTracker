
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Fingerprint, Shield, AlertCircle } from "lucide-react";
import { BiometricAuth } from "@/lib/biometricAuth";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface BiometricAuthProps {
  onSuccess: () => void;
  onRegister?: () => void;
}

export function BiometricAuthComponent({ onSuccess, onRegister }: BiometricAuthProps) {
  const [isSupported, setIsSupported] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasCredential, setHasCredential] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkBiometricSupport();
    checkExistingCredentials();
  }, []);

  const checkBiometricSupport = async () => {
    const supported = await BiometricAuth.isAvailable();
    setIsSupported(supported);
  };

  const checkExistingCredentials = () => {
    const credentialId = localStorage.getItem('biometric_credential_id');
    setHasCredential(!!credentialId);
  };

  const handleBiometricRegister = async () => {
    setIsLoading(true);
    try {
      const userId = "dev-user-123"; // В реальном приложении получать из контекста
      const username = "Dev User";
      
      const credential = await BiometricAuth.register(userId, username);
      
      if (credential) {
        // Сохраняем ID учетных данных локально
        localStorage.setItem('biometric_credential_id', credential.id);
        setHasCredential(true);
        
        toast({
          title: "Биометрия настроена",
          description: "Теперь вы можете входить с помощью отпечатка пальца",
        });
        
        onRegister?.();
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Не удалось настроить биометрию",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBiometricAuth = async () => {
    setIsLoading(true);
    try {
      const credentialId = localStorage.getItem('biometric_credential_id');
      
      if (!credentialId) {
        throw new Error('Биометрия не настроена');
      }
      
      const credential = await BiometricAuth.authenticate(credentialId);
      
      if (credential) {
        toast({
          title: "Вход выполнен",
          description: "Биометрическая аутентификация прошла успешно",
        });
        onSuccess();
      }
    } catch (error) {
      toast({
        title: "Ошибка входа",
        description: error instanceof Error ? error.message : "Биометрическая аутентификация не удалась",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isSupported) {
    return (
      <Card className="bg-card-surface border-gray-700">
        <CardContent className="p-6 text-center">
          <AlertCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400">
            Биометрическая аутентификация не поддерживается на этом устройстве
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-card-surface border-gray-700">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-medical-blue to-health-green rounded-full flex items-center justify-center">
            <Fingerprint className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-white">
            {hasCredential ? "Биометрический вход" : "Настройка биометрии"}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {hasCredential ? (
            <>
              <p className="text-gray-300 text-center mb-6">
                Используйте отпечаток пальца или Face ID для быстрого входа
              </p>
              <Button
                onClick={handleBiometricAuth}
                disabled={isLoading}
                className="w-full h-14 bg-gradient-to-r from-medical-blue to-health-green hover:from-medical-blue/90 hover:to-health-green/90 text-white font-semibold text-lg rounded-2xl transition-all duration-300"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Вход...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Войти с биометрией
                  </div>
                )}
              </Button>
            </>
          ) : (
            <>
              <p className="text-gray-300 text-center mb-6">
                Настройте биометрическую аутентификацию для быстрого и безопасного входа
              </p>
              <div className="space-y-3 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-health-green" />
                  <span>Безопасное хранение данных</span>
                </div>
                <div className="flex items-center gap-2">
                  <Fingerprint className="w-4 h-4 text-medical-blue" />
                  <span>Быстрый доступ к приложению</span>
                </div>
              </div>
              <Button
                onClick={handleBiometricRegister}
                disabled={isLoading}
                className="w-full h-14 bg-gradient-to-r from-medical-blue to-health-green hover:from-medical-blue/90 hover:to-health-green/90 text-white font-semibold text-lg rounded-2xl transition-all duration-300"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Настройка...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Fingerprint className="w-5 h-5" />
                    Настроить биометрию
                  </div>
                )}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
