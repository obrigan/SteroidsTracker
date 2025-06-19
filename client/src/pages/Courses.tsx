import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import { CreateCourseModal } from "@/components/CreateCourseModal";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useToast } from "@/hooks/use-toast";
import { Plus, Calendar, TrendingUp, AlertCircle, Clock, Target, Syringe, MoreHorizontal, Play, Pause, Square } from "lucide-react";

interface Course {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  courseType: string;
  totalWeeks: number;
  currentWeek: number;
  createdAt: string;
}

export default function Courses() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { toast } = useToast();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");

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

  const { data: courses, isLoading } = useQuery<Course[]>({
    queryKey: ["/api/courses"],
    enabled: !!user,
  });

  const filteredCourses = courses?.filter(course => {
    if (activeFilter === "all") return true;
    if (activeFilter === "active") return course.status === "active";
    if (activeFilter === "completed") return course.status === "completed";
    return true;
  }) || [];

  const getDaysUntilNextInjection = (course: Course) => {
    // Mock calculation - in real app would be based on injection schedule
    return Math.floor(Math.random() * 7) + 1;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-health-green";
      case "completed":
        return "bg-gray-500";
      case "paused":
        return "bg-energy-orange";
      default:
        return "bg-gray-500";
    }
  };

  const getProgressPercentage = (currentWeek: number, totalWeeks: number) => {
    return totalWeeks ? Math.min((currentWeek / totalWeeks) * 100, 100) : 0;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (isAuthLoading || isLoading) {
    return (
      <div className="min-h-screen bg-deep-black p-6 pb-24">
        <div className="max-w-md mx-auto">
          <Skeleton className="h-8 w-32 mb-6 bg-card-surface" />
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full mb-4 bg-card-surface" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
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
                <h1 className="text-2xl font-bold text-white">Курсы</h1>
                <p className="text-gray-400 text-sm">Управление курсами препаратов</p>
              </div>
              <Button
                size="sm"
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-medical-blue hover:bg-medical-blue/90 rounded-full"
              >
                <Plus className="w-4 h-4 mr-1" />
                Новый
              </Button>
            </div>

            {/* Filter Tabs */}
            <Tabs value={activeFilter} onValueChange={setActiveFilter}>
              <TabsList className="grid w-full grid-cols-3 bg-gray-800">
                <TabsTrigger value="all">Все</TabsTrigger>
                <TabsTrigger value="active">Активные</TabsTrigger>
                <TabsTrigger value="completed">Завершенные</TabsTrigger>
              </TabsList>
            </Tabs>
          </motion.div>

          {/* Courses List */}
          <div className="px-6 space-y-4">
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="bg-card-surface border-gray-700 hover:shadow-lg transition-all duration-200">
                    {/* Status indicator bar */}
                    <div className={`h-1 w-full ${getStatusColor(course.status)} rounded-t-lg`} />
                    
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Badge
                            className={`${getStatusColor(course.status)} text-white`}
                          >
                            {course.status === "active" ? "Активный" : 
                             course.status === "completed" ? "Завершен" : 
                             course.status === "paused" ? "Приостановлен" : course.status}
                          </Badge>
                          <Badge variant="outline" className="text-gray-400 border-gray-600">
                            {course.courseType}
                          </Badge>
                        </div>
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <CardTitle className="text-white text-lg mb-2">
                        {course.name}
                      </CardTitle>
                      
                      {course.description && (
                        <p className="text-sm text-gray-400">
                          {course.description}
                        </p>
                      )}
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      {/* Progress Section */}
                      {course.status === "active" && course.totalWeeks && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Прогресс курса</span>
                            <span className="text-white font-medium">
                              Неделя {course.currentWeek} из {course.totalWeeks}
                            </span>
                          </div>
                          <Progress
                            value={getProgressPercentage(course.currentWeek, course.totalWeeks)}
                            className="h-3"
                          />
                          <div className="text-xs text-gray-400 text-right">
                            {Math.round(getProgressPercentage(course.currentWeek, course.totalWeeks))}% завершено
                          </div>
                        </div>
                      )}

                      {/* Course Info Grid */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-medical-blue" />
                          <div>
                            <p className="text-xs text-gray-400">Начало</p>
                            <p className="text-sm text-white">{formatDate(course.startDate)}</p>
                          </div>
                        </div>
                        
                        {course.endDate && (
                          <div className="flex items-center space-x-2">
                            <Target className="w-4 h-4 text-health-green" />
                            <div>
                              <p className="text-xs text-gray-400">Окончание</p>
                              <p className="text-sm text-white">{formatDate(course.endDate)}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Next Injection Info for Active Courses */}
                      {course.status === "active" && (
                        <div className="bg-medical-blue/10 border border-medical-blue/20 rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4 text-medical-blue" />
                              <div>
                                <p className="text-xs text-gray-400">Следующая инъекция</p>
                                <p className="text-sm font-medium text-medical-blue">
                                  через {getDaysUntilNextInjection(course)} дня
                                </p>
                              </div>
                            </div>
                            <Button size="sm" className="bg-medical-blue hover:bg-medical-blue/90 text-white">
                              <Syringe className="w-4 h-4 mr-1" />
                              Добавить укол
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex items-center justify-between pt-2">
                        <Button variant="outline" size="sm" className="text-gray-400 border-gray-600 hover:text-white">
                          Подробнее
                        </Button>
                        
                        <div className="flex space-x-2">
                          {course.status === "active" && (
                            <>
                              <Button variant="ghost" size="sm" className="text-energy-orange hover:text-energy-orange/90">
                                <Pause className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-400">
                                <Square className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                          {course.status === "paused" && (
                            <Button variant="ghost" size="sm" className="text-health-green hover:text-health-green/90">
                              <Play className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <Card className="bg-card-surface border-gray-800">
                  <CardContent className="p-8">
                    <div className="text-6xl mb-4">💊</div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Нет курсов
                    </h3>
                    <p className="text-gray-400 mb-6">
                      Создайте свой первый курс для отслеживания прогресса
                    </p>
                    <Button
                      onClick={() => setIsCreateModalOpen(true)}
                      className="bg-gradient-to-r from-medical-blue to-health-green hover:from-medical-blue/90 hover:to-health-green/90"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Создать первый курс
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Info Card */}
          {filteredCourses.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="px-6 mt-8"
            >
              <Card className="bg-gradient-to-r from-energy-orange/10 to-medical-red/10 border border-energy-orange/30">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-energy-orange mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-white mb-1">Safety Reminder</h4>
                      <p className="text-sm text-gray-300">
                        Always consult with healthcare professionals and get regular blood work
                        during your cycles.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>

      {/* Floating Action Button */}
      <FloatingActionButton 
        icon={<Plus className="w-6 h-6" />} 
        onClick={() => setIsCreateModalOpen(true)}
      />

      {/* Create Course Modal */}
      <CreateCourseModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />
    </>
  );
}
