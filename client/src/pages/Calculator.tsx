import { useState } from "react";
import { useLocation, useRoute } from "wouter";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Calculator as CalcIcon, TestTube, Syringe, Shield, Info } from "lucide-react";

export default function Calculator() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/learning/calculator/:calculatorId");
  const calculatorId = params?.calculatorId || "half-life";
  const [activeTab, setActiveTab] = useState("calculator");

  // Half-life calculator state
  const [compound, setCompound] = useState("");
  const [dosage, setDosage] = useState("");
  const [result, setResult] = useState<any>(null);

  const compounds = {
    "testosterone-enanthate": { name: "Тестостерон энантат", halfLife: 4.5, peakTime: 24 },
    "testosterone-cypionate": { name: "Тестостерон ципионат", halfLife: 8, peakTime: 24 },
    "testosterone-propionate": { name: "Тестостерон пропионат", halfLife: 0.8, peakTime: 12 },
    "nandrolone-decanoate": { name: "Нандролон деканоат", halfLife: 6, peakTime: 36 },
    "trenbolone-acetate": { name: "Тренболон ацетат", halfLife: 3, peakTime: 24 },
    "stanozolol": { name: "Станозолол", halfLife: 1, peakTime: 8 },
    "masteron": { name: "Мастерон", halfLife: 2.5, peakTime: 24 },
  };

  const calculatorData = {
    "half-life": {
      title: "Калькулятор периодов полувыведения",
      description: "Рассчитайте время выведения препаратов из организма",
      icon: <CalcIcon className="w-6 h-6" />
    },
    "dosage": {
      title: "Расчет оптимальных дозировок", 
      description: "Определите подходящие дозировки на основе целей",
      icon: <TestTube className="w-6 h-6" />
    },
    "injection-schedule": {
      title: "Планировщик инъекций",
      description: "Создайте расписание инъекций для курса",
      icon: <Syringe className="w-6 h-6" />
    },
    "pct-calculator": {
      title: "Калькулятор PCT",
      description: "Рассчитайте протокол послекурсовой терапии",
      icon: <Shield className="w-6 h-6" />
    }
  };

  const currentCalc = calculatorData[calculatorId as keyof typeof calculatorData] || calculatorData["half-life"];

  const calculateHalfLife = () => {
    if (!compound || !dosage) return;

    const compoundData = compounds[compound as keyof typeof compounds];
    const dose = parseFloat(dosage);
    
    if (!compoundData || isNaN(dose)) return;

    const clearanceData = [];
    let currentLevel = dose;
    
    for (let day = 0; day <= 21; day++) {
      clearanceData.push({
        day,
        level: currentLevel,
        percentage: (currentLevel / dose) * 100
      });
      currentLevel = currentLevel * Math.pow(0.5, 1 / compoundData.halfLife);
    }

    setResult({
      compound: compoundData,
      clearanceData,
      completelyCleared: clearanceData.findIndex(d => d.percentage < 1) || 21
    });
  };

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
          <div className="flex items-center mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/learning")}
              className="mr-3 text-gray-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-energy-orange/20 rounded-full flex items-center justify-center">
                {currentCalc.icon}
              </div>
              <div>
                <h1 className="text-xl font-google-sans font-bold">{currentCalc.title}</h1>
                <p className="text-gray-400 text-sm">{currentCalc.description}</p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="px-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 bg-gray-800">
              <TabsTrigger value="calculator">Калькулятор</TabsTrigger>
              <TabsTrigger value="info">Информация</TabsTrigger>
            </TabsList>

            <TabsContent value="calculator" className="mt-6">
              <Card className="bg-card-surface border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Параметры расчета</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="compound" className="text-white">Препарат</Label>
                    <Select value={compound} onValueChange={setCompound}>
                      <SelectTrigger className="bg-gray-800 border-gray-700">
                        <SelectValue placeholder="Выберите препарат" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(compounds).map(([key, data]) => (
                          <SelectItem key={key} value={key}>{data.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="dosage" className="text-white">Дозировка (мг)</Label>
                    <Input
                      id="dosage"
                      type="number"
                      value={dosage}
                      onChange={(e) => setDosage(e.target.value)}
                      className="bg-gray-800 border-gray-700"
                      placeholder="Введите дозировку"
                    />
                  </div>

                  <Button 
                    onClick={calculateHalfLife}
                    className="w-full bg-gradient-to-r from-energy-orange to-energy-orange/80"
                    disabled={!compound || !dosage}
                  >
                    Рассчитать
                  </Button>
                </CardContent>
              </Card>

              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6"
                >
                  <Card className="bg-card-surface border-gray-800">
                    <CardHeader>
                      <CardTitle className="text-white">Результаты расчета</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-3 bg-medical-blue/10 rounded-lg">
                            <div className="text-2xl font-bold text-medical-blue">{result.compound.halfLife}</div>
                            <div className="text-sm text-gray-400">дней полувыведения</div>
                          </div>
                          <div className="text-center p-3 bg-health-green/10 rounded-lg">
                            <div className="text-2xl font-bold text-health-green">{result.completelyCleared}</div>
                            <div className="text-sm text-gray-400">дней до очищения</div>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-white font-semibold mb-3">График выведения</h4>
                          <div className="space-y-2">
                            {result.clearanceData.slice(0, 8).map((data: any) => (
                              <div key={data.day} className="flex items-center justify-between">
                                <span className="text-sm text-gray-400">День {data.day}</span>
                                <div className="flex-1 mx-3">
                                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                    <div 
                                      className="h-full bg-gradient-to-r from-energy-orange to-medical-blue"
                                      style={{ width: `${Math.max(data.percentage, 2)}%` }}
                                    />
                                  </div>
                                </div>
                                <span className="text-sm text-white w-12 text-right">
                                  {data.percentage.toFixed(0)}%
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </TabsContent>

            <TabsContent value="info" className="mt-6">
              <Card className="bg-card-surface border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Info className="w-5 h-5 mr-2" />
                    О периоде полувыведения
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-gray-300">
                  <p>
                    Период полувыведения - это время, за которое концентрация препарата 
                    в крови снижается наполовину.
                  </p>
                  <p>
                    Для полного выведения препарата из организма обычно требуется 
                    5-7 периодов полувыведения.
                  </p>
                  <div className="bg-energy-orange/10 p-3 rounded-lg border border-energy-orange/30">
                    <p className="text-energy-orange font-semibold">Важно:</p>
                    <p className="text-gray-300">
                      Эти расчеты являются приблизительными и могут варьироваться 
                      в зависимости от индивидуальных особенностей организма.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}