import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import { CreateCourseModal } from "@/components/CreateCourseModal";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useToast } from "@/hooks/use-toast";
import { Plus, Calendar, TrendingUp, AlertCircle } from "lucide-react";

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
                <h1 className="text-2xl font-google-sans font-bold">Courses</h1>
                <p className="text-gray-400 text-sm">Manage your steroid cycles</p>
              </div>
              <Button
                size="sm"
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-medical-blue hover:bg-medical-blue/90 rounded-full"
              >
                <Plus className="w-4 h-4 mr-1" />
                New
              </Button>
            </div>
          </motion.div>

          {/* Courses List */}
          <div className="px-6 space-y-4">
            {courses && courses.length > 0 ? (
              courses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="bg-card-surface border-gray-800 hover:border-medical-blue/50 transition-colors">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge
                            className={`${getStatusColor(course.status)} text-white`}
                          >
                            {course.status}
                          </Badge>
                          <Badge variant="outline" className="text-gray-400 border-gray-600">
                            {course.courseType}
                          </Badge>
                        </div>
                        {course.status === "active" && (
                          <div className="text-xs text-health-green font-medium">
                            Week {course.currentWeek}/{course.totalWeeks}
                          </div>
                        )}
                      </div>
                      <CardTitle className="text-white font-google-sans">
                        {course.name}
                      </CardTitle>
                      {course.description && (
                        <p className="text-sm text-gray-400">
                          {course.description}
                        </p>
                      )}
                    </CardHeader>
                    
                    <CardContent>
                      {/* Progress Bar */}
                      {course.status === "active" && course.totalWeeks && (
                        <div className="mb-4">
                          <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>Progress</span>
                            <span>
                              {Math.round(getProgressPercentage(course.currentWeek, course.totalWeeks))}%
                            </span>
                          </div>
                          <Progress
                            value={getProgressPercentage(course.currentWeek, course.totalWeeks)}
                            className="h-2"
                          />
                        </div>
                      )}

                      {/* Course Details */}
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1 text-gray-400">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(course.startDate)}</span>
                          </div>
                          {course.endDate && (
                            <div className="flex items-center space-x-1 text-gray-400">
                              <span>→</span>
                              <span>{formatDate(course.endDate)}</span>
                            </div>
                          )}
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-medical-blue hover:text-medical-blue/90 hover:bg-medical-blue/10"
                        >
                          <TrendingUp className="w-4 h-4 mr-1" />
                          View
                        </Button>
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
                    <h3 className="text-xl font-google-sans font-semibold text-white mb-2">
                      No Courses Yet
                    </h3>
                    <p className="text-gray-400 mb-6">
                      Start your first steroid cycle to begin tracking your progress
                    </p>
                    <Button
                      onClick={() => setIsCreateModalOpen(true)}
                      className="bg-gradient-to-r from-medical-blue to-health-green hover:from-medical-blue/90 hover:to-health-green/90"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Course
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Info Card */}
          {courses && courses.length > 0 && (
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
