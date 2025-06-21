import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { 
  QrCode, Scan, Plus, Camera, 
  FileText, Syringe, TestTube, Clock
} from "lucide-react";
import { telegramWebApp } from "@/lib/telegramWebApp";
import { useToast } from "@/hooks/use-toast";

interface QRDataType {
  type: 'injection' | 'blood_test' | 'compound_info' | 'course_plan';
  data: any;
  source: string;
  timestamp: string;
}

interface TelegramQRScannerProps {
  onDataScanned: (data: QRDataType) => void;
}

export function TelegramQRScanner({ onDataScanned }: TelegramQRScannerProps) {
  const { toast } = useToast();
  const [isScanning, setIsScanning] = useState(false);
  const [recentScans, setRecentScans] = useState<QRDataType[]>([]);

  const scanQRCode = async () => {
    if (!telegramWebApp.isTelegramWebApp()) {
      toast({
        title: "Функция недоступна",
        description: "QR-сканер работает только в Telegram Mini App",
        variant: "destructive"
      });
      return;
    }

    setIsScanning(true);
    telegramWebApp.hapticImpact('medium');

    try {
      const scannedText = await telegramWebApp.showQRScanner();
      
      if (scannedText) {
        const parsedData = parseQRData(scannedText);
        
        if (parsedData) {
          telegramWebApp.hapticNotification('success');
          setRecentScans(prev => [parsedData, ...prev.slice(0, 4)]);
          onDataScanned(parsedData);
          
          toast({
            title: "QR-код отсканирован",
            description: `Найдены данные: ${getDataTypeLabel(parsedData.type)}`
          });
        } else {
          telegramWebApp.hapticNotification('error');
          toast({
            title: "Неподдерживаемый QR-код",
            description: "Код не содержит данных для трекера",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      telegramWebApp.hapticNotification('error');
      toast({
        title: "Ошибка сканирования",
        description: "Не удалось отсканировать QR-код",
        variant: "destructive"
      });
    } finally {
      setIsScanning(false);
    }
  };

  const parseQRData = (qrText: string): QRDataType | null => {
    try {
      // Пытаемся парсить как JSON
      const jsonData = JSON.parse(qrText);
      if (jsonData.steroidTracker || jsonData.type) {
        return {
          type: jsonData.type,
          data: jsonData.data || jsonData,
          source: jsonData.source || 'qr_scan',
          timestamp: new Date().toISOString()
        };
      }
    } catch {
      // Не JSON, пытаемся парсить как URL или специальный формат
    }

    // Парсинг URL с параметрами
    if (qrText.startsWith('https://steroidtracker.app/import/')) {
      const url = new URL(qrText);
      const type = url.searchParams.get('type') as QRDataType['type'];
      const data = Object.fromEntries(url.searchParams.entries());
      
      if (type) {
        return {
          type,
          data,
          source: 'url_import',
          timestamp: new Date().toISOString()
        };
      }
    }

    // Парсинг текстового формата
    if (qrText.includes('INJECTION:') || qrText.includes('INJ:')) {
      return parseInjectionQR(qrText);
    }
    
    if (qrText.includes('BLOODTEST:') || qrText.includes('LAB:')) {
      return parseBloodTestQR(qrText);
    }

    return null;
  };

  const parseInjectionQR = (text: string): QRDataType => {
    // Формат: INJ:compound=Test E;dose=250;unit=mg;site=delt;date=2024-01-15
    const data: any = {};
    const parts = text.split(';');
    
    parts.forEach(part => {
      const [key, value] = part.split('=');
      if (key && value) {
        data[key.replace('INJ:', '').replace('INJECTION:', '')] = value;
      }
    });

    return {
      type: 'injection',
      data: {
        compoundName: data.compound || data.drug,
        dosageAmount: parseFloat(data.dose || data.dosage) || 0,
        dosageUnit: data.unit || 'mg',
        injectionSite: data.site || data.location,
        injectionDate: data.date ? new Date(data.date) : new Date(),
        notes: data.notes || ''
      },
      source: 'qr_text_format',
      timestamp: new Date().toISOString()
    };
  };

  const parseBloodTestQR = (text: string): QRDataType => {
    // Формат: LAB:type=hormone;test=testosterone;value=25.5;unit=nmol/L;date=2024-01-15
    const data: any = {};
    const results: any = {};
    const parts = text.split(';');
    
    parts.forEach(part => {
      const [key, value] = part.split('=');
      if (key && value) {
        const cleanKey = key.replace('LAB:', '').replace('BLOODTEST:', '');
        if (cleanKey === 'test' && parts.find(p => p.includes('value='))) {
          // Это результат теста
          const testValue = parts.find(p => p.includes('value='))?.split('=')[1];
          const testUnit = parts.find(p => p.includes('unit='))?.split('=')[1];
          results[value] = `${testValue} ${testUnit || ''}`.trim();
        } else {
          data[cleanKey] = value;
        }
      }
    });

    return {
      type: 'blood_test',
      data: {
        testType: data.type || 'Гормональная панель',
        testDate: data.date ? new Date(data.date) : new Date(),
        results: Object.keys(results).length > 0 ? results : {},
        doctorNotes: data.notes || '',
        alertFlags: []
      },
      source: 'qr_text_format',
      timestamp: new Date().toISOString()
    };
  };

  const getDataTypeLabel = (type: string): string => {
    const labels = {
      injection: 'Инъекция',
      blood_test: 'Анализ крови',
      compound_info: 'Информация о препарате',
      course_plan: 'План курса'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getDataTypeIcon = (type: string) => {
    const icons = {
      injection: Syringe,
      blood_test: TestTube,
      compound_info: FileText,
      course_plan: Plus
    };
    return icons[type as keyof typeof icons] || FileText;
  };

  const generateSampleQR = () => {
    telegramWebApp.hapticImpact('light');
    
    const sampleData = {
      steroidTracker: true,
      type: 'injection',
      data: {
        compoundName: 'Testosterone Enanthate',
        dosageAmount: 250,
        dosageUnit: 'mg',
        injectionSite: 'deltoid',
        date: new Date().toISOString().split('T')[0]
      },
      source: 'sample_generation'
    };

    telegramWebApp.sendDataToBot({
      action: 'generate_qr',
      data: sampleData,
      format: 'image'
    });

    toast({
      title: "QR-код сгенерирован",
      description: "Образец QR-кода отправлен в чат"
    });
  };

  return (
    <Card className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border-indigo-500/30">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center">
            <QrCode className="w-5 h-5 mr-2 text-indigo-400" />
            QR Сканер
          </div>
          {telegramWebApp.isTelegramWebApp() && (
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              Доступен
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Scanner Button */}
        <Button
          onClick={scanQRCode}
          disabled={isScanning || !telegramWebApp.isTelegramWebApp()}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-16"
        >
          <div className="flex flex-col items-center">
            {isScanning ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Scan className="w-6 h-6 mb-1" />
                </motion.div>
                <span className="text-sm">Сканирование...</span>
              </>
            ) : (
              <>
                <Camera className="w-6 h-6 mb-1" />
                <span className="text-sm">Сканировать QR-код</span>
              </>
            )}
          </div>
        </Button>

        {/* Recent Scans */}
        {recentScans.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-300">Недавние сканы</h4>
            {recentScans.map((scan, index) => {
              const Icon = getDataTypeIcon(scan.type);
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-3 p-3 bg-card-surface rounded-lg border border-gray-700"
                >
                  <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                    <Icon className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-white">
                        {getDataTypeLabel(scan.type)}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {scan.source}
                      </Badge>
                    </div>
                    <div className="flex items-center text-xs text-gray-400">
                      <Clock className="w-3 h-3 mr-1" />
                      {new Date(scan.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Info Section */}
        <div className="bg-card-surface border border-gray-700 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-white mb-2">Поддерживаемые форматы</h4>
          <div className="space-y-2 text-xs text-gray-300">
            <div className="flex items-center space-x-2">
              <Syringe className="w-3 h-3 text-green-400" />
              <span>QR-коды инъекций от медицинских приложений</span>
            </div>
            <div className="flex items-center space-x-2">
              <TestTube className="w-3 h-3 text-blue-400" />
              <span>Результаты анализов в формате JSON/URL</span>
            </div>
            <div className="flex items-center space-x-2">
              <FileText className="w-3 h-3 text-purple-400" />
              <span>Планы курсов и информация о препаратах</span>
            </div>
          </div>
        </div>

        {/* Generate Sample */}
        <Button
          onClick={generateSampleQR}
          variant="outline"
          size="sm"
          className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
        >
          <QrCode className="w-4 h-4 mr-2" />
          Создать образец QR-кода
        </Button>
      </CardContent>
    </Card>
  );
}