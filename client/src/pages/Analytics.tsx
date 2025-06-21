
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, Activity, Calendar, Target } from "lucide-react";
import { motion } from "framer-motion";

export default function Analytics() {
  const { user } = useAuth();

  const { data: analyticsData } = useQuery({
    queryKey: ["/api/analytics"],
    enabled: !!user,
  });

  const mockTestosteroneData = [
    { date: '2024-01', total: 350, free: 12 },
    { date: '2024-02', total: 420, free: 15 },
    { date: '2024-03', total: 580, free: 22 },
    { date: '2024-04', total: 650, free: 28 },
    { date: '2024-05', total: 720, free: 32 },
  ];

  const mockInjectionFrequency = [
    { site: 'Дельта', count: 12 },
    { site: 'Квадрицепс', count: 8 },
    { site: 'Ягодица', count: 15 },
    { site: 'Широчайшая', count: 6 },
  ];

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
          <h1 className="text-2xl font-google-sans font-bold mb-6">Аналитика</h1>

          <Tabs defaultValue="hormones" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-800">
              <TabsTrigger value="hormones">Гормоны</TabsTrigger>
              <TabsTrigger value="injections">Инъекции</TabsTrigger>
              <TabsTrigger value="progress">Прогресс</TabsTrigger>
            </TabsList>

            <TabsContent value="hormones" className="space-y-4">
              <Card className="bg-card-surface border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Уровень тестостерона
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={mockTestosteroneData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="date" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="total" 
                        stroke="#10B981" 
                        strokeWidth={2}
                        name="Общий (нг/дл)"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="free" 
                        stroke="#3B82F6" 
                        strokeWidth={2}
                        name="Свободный (пг/мл)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="injections" className="space-y-4">
              <Card className="bg-card-surface border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Activity className="w-5 h-5 mr-2" />
                    Места инъекций
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={mockInjectionFrequency}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="site" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar dataKey="count" fill="#F59E0B" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="progress" className="space-y-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <Card className="bg-card-surface border-gray-800">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-health-green">24</div>
                    <div className="text-sm text-gray-400">Дней подряд</div>
                  </CardContent>
                </Card>
                <Card className="bg-card-surface border-gray-800">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-medical-blue">8.5kg</div>
                    <div className="text-sm text-gray-400">Прирост массы</div>
                  </CardContent>
                </Card>
              </div>

              {/* Корреляционный анализ */}
              <Card className="bg-card-surface border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Корреляционный анализ
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                      <span className="text-sm text-gray-300">Дозировка ↔ Масса тела</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-700 rounded-full h-2">
                          <div className="bg-health-green h-2 rounded-full" style={{width: '87%'}}></div>
                        </div>
                        <span className="text-xs font-bold text-health-green">87%</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                      <span className="text-sm text-gray-300">Частота ↔ Побочные эффекты</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-700 rounded-full h-2">
                          <div className="bg-energy-orange h-2 rounded-full" style={{width: '34%'}}></div>
                        </div>
                        <span className="text-xs font-bold text-energy-orange">34%</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                      <span className="text-sm text-gray-300">Анализы ↔ Безопасность</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-700 rounded-full h-2">
                          <div className="bg-medical-blue h-2 rounded-full" style={{width: '92%'}}></div>
                        </div>
                        <span className="text-xs font-bold text-medical-blue">92%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Прогнозирование */}
              <Card className="bg-card-surface border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Прогнозы ИИ
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-medical-blue/10 border border-medical-blue/30 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-white">Достижение цели</span>
                        <span className="text-xs text-medical-blue">95% уверенность</span>
                      </div>
                      <p className="text-xs text-gray-300">
                        При текущем темпе вы достигнете цели +10кг через 4-6 недель
                      </p>
                    </div>
                    
                    <div className="p-3 bg-energy-orange/10 border border-energy-orange/30 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-white">Рекомендация по анализам</span>
                        <span className="text-xs text-energy-orange">78% уверенность</span>
                      </div>
                      <p className="text-xs text-gray-300">
                        Через 2 недели рекомендуется проверить уровень эстрадиола
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
