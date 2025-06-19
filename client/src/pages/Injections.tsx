import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import { CreateInjectionModal } from "@/components/CreateInjectionModal";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useToast } from "@/hooks/use-toast";
import { Syringe, MapPin, Clock, Camera, Plus, Zap, Award } from "lucide-react";

interface Injection {
  id: number;
  compoundName: string;
  dosageAmount: string;
  dosageUnit: string;
  injectionSite: string;
  injectionDate: string;
  notes: string;
  painLevel: number;
  photoUrl: string;
  xpEarned: number;
}

export default function Injections() {
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

  const { data: injections, isLoading } = useQuery<Injection[]>({
    queryKey: ["/api/injections"],
    enabled: !!user,
  });

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
    };
  };

  const getPainLevelColor = (level: number) => {
    if (level <= 3) return "text-health-green";
    if (level <= 6) return "text-energy-orange";
    return "text-medical-red";
  };

  const getPainLevelText = (level: number) => {
    if (level === 0) return "No pain";
    if (level <= 3) return "Mild";
    if (level <= 6) return "Moderate";
    return "Severe";
  };

  if (isAuthLoading || isLoading) {
    return (
      <div className="min-h-screen bg-deep-black p-6 pb-24">
        <div className="max-w-md mx-auto">
          <Skeleton className="h-8 w-32 mb-6 bg-card-surface" />
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-40 w-full mb-4 bg-card-surface" />
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
                <h1 className="text-2xl font-google-sans font-bold">Injections</h1>
                <p className="text-gray-400 text-sm">Track your injection history</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-health-green">
                  {injections?.length || 0}
                </div>
                <p className="text-xs text-gray-400">total</p>
              </div>
            </div>
          </motion.div>

          {/* Injections List */}
          <div className="px-6 space-y-4">
            {injections && injections.length > 0 ? (
              injections.map((injection, index) => {
                const { date, time } = formatDateTime(injection.injectionDate);
                
                return (
                  <motion.div
                    key={injection.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="bg-card-surface border-gray-800 hover:border-health-green/50 transition-colors">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-health-green/20 rounded-full flex items-center justify-center">
                              <Syringe className="w-5 h-5 text-health-green" />
                            </div>
                            <div>
                              <CardTitle className="text-white font-google-sans text-lg">
                                {injection.compoundName}
                              </CardTitle>
                              <p className="text-health-green font-semibold">
                                {injection.dosageAmount}{injection.dosageUnit}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-400">{date}</div>
                            <div className="text-xs text-gray-500">{time}</div>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent>
                        {/* Injection Site */}
                        <div className="flex items-center space-x-2 mb-3">
                          <MapPin className="w-4 h-4 text-medical-blue" />
                          <span className="text-gray-300 capitalize">
                            {injection.injectionSite.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                        </div>

                        {/* Pain Level */}
                        {injection.painLevel !== null && injection.painLevel !== undefined && (
                          <div className="flex items-center space-x-2 mb-3">
                            <div className="w-4 h-4 rounded-full bg-gray-600 flex items-center justify-center">
                              <div className="w-2 h-2 rounded-full bg-current"></div>
                            </div>
                            <span className={`text-sm ${getPainLevelColor(injection.painLevel)}`}>
                              Pain Level: {injection.painLevel}/10 ({getPainLevelText(injection.painLevel)})
                            </span>
                          </div>
                        )}

                        {/* Notes */}
                        {injection.notes && (
                          <div className="mb-3">
                            <p className="text-sm text-gray-400 italic">
                              "{injection.notes}"
                            </p>
                          </div>
                        )}

                        {/* Bottom Row */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {injection.photoUrl && (
                              <Badge variant="outline" className="text-medical-blue border-medical-blue/50">
                                <Camera className="w-3 h-3 mr-1" />
                                Photo
                              </Badge>
                            )}
                            {injection.xpEarned && (
                              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                                +{injection.xpEarned} XP
                              </Badge>
                            )}
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-health-green hover:text-health-green/90 hover:bg-health-green/10"
                          >
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <Card className="bg-card-surface border-gray-800">
                  <CardContent className="p-8">
                    <div className="text-6xl mb-4">💉</div>
                    <h3 className="text-xl font-google-sans font-semibold text-white mb-2">
                      No Injections Yet
                    </h3>
                    <p className="text-gray-400 mb-6">
                      Start logging your injections to track your progress and build streaks
                    </p>
                    <Button
                      onClick={() => setIsCreateModalOpen(true)}
                      className="bg-gradient-to-r from-health-green to-health-green/80 hover:from-health-green/90 hover:to-health-green/70"
                    >
                      <Syringe className="w-4 h-4 mr-2" />
                      Log Your First Injection
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Quick Stats */}
          {injections && injections.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="px-6 mt-8"
            >
              <Card className="bg-gradient-to-r from-health-green/10 to-medical-blue/10 border border-health-green/30">
                <CardContent className="p-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-health-green">
                        {injections.length}
                      </div>
                      <p className="text-xs text-gray-400">Total Injections</p>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-medical-blue">
                        {new Set(injections.map(inj => inj.injectionSite)).size}
                      </div>
                      <p className="text-xs text-gray-400">Sites Used</p>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-energy-orange">
                        {injections.reduce((sum, inj) => sum + (inj.xpEarned || 0), 0)}
                      </div>
                      <p className="text-xs text-gray-400">XP Earned</p>
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
        icon={<Syringe className="w-6 h-6" />} 
        onClick={() => setIsCreateModalOpen(true)}
      />

      {/* Create Injection Modal */}
      <CreateInjectionModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />
    </>
  );
}
