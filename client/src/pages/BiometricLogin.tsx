
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Fingerprint, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

// Простая реализация биометрической аутентификации
class BiometricAuth {
  static async isAvailable(): Promise<boolean> {
    return 'credentials' in navigator && 'create' in navigator.credentials;
  }

  static async authenticate(): Promise<any> {
    if (!await this.isAvailable()) {
      throw new Error('WebAuthn not supported');
    }

    const credentialId = localStorage.getItem('biometric_credential_id');
    if (!credentialId) {
      throw new Error('No biometric credential found');
    }

    const credential = await navigator.credentials.get({
      publicKey: {
        challenge: new Uint8Array(32),
        allowCredentials: [{
          id: new TextEncoder().encode(credentialId),
          type: 'public-key'
        }],
        timeout: 60000,
      }
    });

    return credential;
  }
}

export default function BiometricLogin() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const { toast } = useToast();

  const handleBiometricLogin = async () => {
    setIsAuthenticating(true);
    try {
      const credential = await BiometricAuth.authenticate();
      
      if (credential) {
        // В реальном приложении здесь был бы запрос к серверу для проверки credential
        toast({
          title: "Успешный вход",
          description: "Добро пожаловать обратно!",
        });
        
        // Перенаправление на главную страницу
        window.location.href = "/dashboard";
      }
    } catch (error) {
      toast({
        title: "Ошибка аутентификации",
        description: "Не удалось войти с помощью биометрии",
        variant: "destructive",
      });
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleBackToLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-deep-black text-white flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-3xl font-google-sans font-bold mb-2">
            Биометрический вход
          </h1>
          <p className="text-gray-400">
            Используйте отпечаток пальца для входа в приложение
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-card-surface border-gray-800">
            <CardHeader>
              <CardTitle className="text-white text-center flex items-center justify-center">
                <Fingerprint className="w-6 h-6 mr-2 text-medical-blue" />
                Аутентификация
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="flex justify-center">
                <motion.div
                  animate={{ 
                    scale: isAuthenticating ? [1, 1.1, 1] : 1,
                    opacity: isAuthenticating ? [1, 0.7, 1] : 1 
                  }}
                  transition={{ 
                    repeat: isAuthenticating ? Infinity : 0,
                    duration: 1.5 
                  }}
                  className="w-24 h-24 bg-gradient-to-br from-medical-blue to-health-green rounded-full flex items-center justify-center"
                >
                  <Fingerprint className="w-12 h-12 text-white" />
                </motion.div>
              </div>

              <div>
                <p className="text-gray-300 mb-4">
                  {isAuthenticating 
                    ? "Проверка отпечатка пальца..." 
                    : "Нажмите кнопку ниже и приложите палец к сканеру"
                  }
                </p>
                
                <Button
                  onClick={handleBiometricLogin}
                  disabled={isAuthenticating}
                  className="w-full bg-medical-blue hover:bg-medical-blue/90 mb-4"
                >
                  {isAuthenticating ? "Аутентификация..." : "Войти по отпечатку"}
                </Button>

                <Button
                  variant="ghost"
                  onClick={handleBackToLogin}
                  className="w-full text-gray-400 hover:text-white"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Вернуться к обычному входу
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-center"
        >
          <p className="text-xs text-gray-500">
            Биометрическая аутентификация использует ваш отпечаток пальца
            для безопасного входа в приложение
          </p>
        </motion.div>
      </div>
    </div>
  );
}
