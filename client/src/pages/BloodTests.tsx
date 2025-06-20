import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import { CreateBloodTestModal } from "@/components/CreateBloodTestModal";
import { AIAnalysisCard } from "@/components/AIAnalysisCard";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useToast } from "@/hooks/use-toast";
import { TestTube, Calendar, TrendingUp, TrendingDown, AlertTriangle, Plus, CheckCircle, XCircle } from "lucide-react";

interface BloodTest {
  id: number;
  testDate: string;
  testType: string;
  results: Record<string, any>;
  doctorNotes: string;
  alertFlags: string[];
  xpEarned: number;
  createdAt: string;
}

export default function BloodTests() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
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

  const { data: bloodTests, isLoading } = useQuery<BloodTest[]>({
    queryKey: ["/api/blood-tests"],
    enabled: !!user,
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getTestTypeDisplayName = (testType: string) => {
    return testType
      .split("_")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const getKeyResults = (results: Record<string, any>) => {
    const keyMarkers = [
      "testosterone_total",
      "testosterone_free", 
      "estradiol",
      "liver_alt"
    ];
    
    return keyMarkers
      .filter(marker => results[marker] !== undefined)
      .map(marker => ({
        name: marker.replace(/_/g, " ").toUpperCase(),
        value: results[marker],
        unit: getUnit(marker)
      }));
  };

  const getUnit = (marker: string) => {
    const units: Record<string, string> = {
      testosterone_total: "ng/dL",
      testosterone_free: "pg/mL", 
      estradiol: "pg/mL",
      lh: "mIU/mL",
      fsh: "mIU/mL",
      shbg: "nmol/L",
      liver_alt: "U/L",
      liver_ast: "U/L"
    };
    return units[marker] || "";
  };

  const hasAlerts = (alertFlags: string[]) => {
    return alertFlags && alertFlags.length > 0;
  };

  if (isAuthLoading || isLoading) {
    return (
      <div className="min-h-screen bg-deep-black p-6 pb-24">
        <div className="max-w-md mx-auto">
          <Skeleton className="h-8 w-32 mb-6 bg-card-surface" />
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 w-full mb-4 bg-card-surface" />
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
                <h1 className="text-2xl font-google-sans font-bold">Blood Tests</h1>
                <p className="text-gray-400 text-sm">Monitor your health markers</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-energy-orange">
                  {bloodTests?.length || 0}
                </div>
                <p className="text-xs text-gray-400">tests</p>
              </div>
            </div>
          </motion.div>

          {/* AI Analysis Section */}
          {bloodTests && bloodTests.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="px-6"
            >
              <AIAnalysisCard 
                bloodTestResults={bloodTests[0]?.results || {}} 
                courseData={null}
              />
            </motion.div>
          )}

          {/* Blood Tests List */}
          <div className="px-6 space-y-4">
            {bloodTests && bloodTests.length > 0 ? (
              bloodTests.map((test, index) => {
                const keyResults = getKeyResults(test.results);
                
                return (
                  <motion.div
                    key={test.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className={`bg-card-surface border-gray-800 hover:border-energy-orange/50 transition-colors ${
                      hasAlerts(test.alertFlags) ? 'ring-1 ring-medical-red/30' : ''
                    }`}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-energy-orange/20 rounded-full flex items-center justify-center">
                              <TestTube className="w-5 h-5 text-energy-orange" />
                            </div>
                            <div>
                              <CardTitle className="text-white font-google-sans text-lg">
                                {getTestTypeDisplayName(test.testType)}
                              </CardTitle>
                              <div className="flex items-center space-x-1 text-gray-400 text-sm">
                                <Calendar className="w-4 h-4" />
                                <span>{formatDate(test.testDate)}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {hasAlerts(test.alertFlags) && (
                              <Badge variant="destructive" className="bg-medical-red/20 text-medical-red border-medical-red/30">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                Alert
                              </Badge>
                            )}
                            <Badge variant="secondary" className="bg-energy-orange/20 text-energy-orange border-energy-orange/30">
                              +{test.xpEarned} XP
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="pt-0">
                        {/* Key Results */}
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          {keyResults.map((result, idx) => (
                            <div key={idx} className="bg-card-background/50 rounded-lg p-3">
                              <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                                {result.name}
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-lg font-bold text-white">
                                  {result.value}
                                </span>
                                <span className="text-xs text-gray-400">
                                  {result.unit}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Doctor Notes */}
                        {test.doctorNotes && (
                          <div className="mb-4 p-3 bg-medical-blue/10 rounded-lg border border-medical-blue/20">
                            <div className="text-xs text-medical-blue uppercase tracking-wide mb-1">
                              Doctor Notes
                            </div>
                            <p className="text-sm text-gray-300">{test.doctorNotes}</p>
                          </div>
                        )}

                        {/* Alert Flags */}
                        {hasAlerts(test.alertFlags) && (
                          <div className="mb-4">
                            <div className="text-xs text-medical-red uppercase tracking-wide mb-2">
                              Health Alerts
                            </div>
                            <div className="space-y-2">
                              {test.alertFlags.map((flag, idx) => (
                                <div key={idx} className="flex items-center space-x-2 text-sm">
                                  <AlertTriangle className="w-4 h-4 text-medical-red flex-shrink-0" />
                                  <span className="text-gray-300">{flag}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800">
                            View Details
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800">
                            Share with Doctor
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <TestTube className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">No Blood Tests Yet</h3>
                <p className="text-gray-400 mb-4">Start tracking your health markers</p>
                <Button 
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-medical-blue hover:bg-medical-blue/90"
                >
                  Add First Test
                </Button>
              </motion.div>
            )}
          </div>

          {/* Health Reminder */}
          {bloodTests && bloodTests.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="px-6 mt-8"
            >
              <Card className="bg-gradient-to-r from-medical-blue/10 to-energy-orange/10 border border-medical-blue/30">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-medical-blue/20 rounded-full flex items-center justify-center">
                      <TestTube className="w-4 h-4 text-medical-blue" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">Regular Monitoring</h4>
                      <p className="text-sm text-gray-300">
                        Keep track of liver enzymes, lipid panels, and hormonal markers 
                        every 6-8 weeks during active cycles.
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
        onClick={() => setIsCreateModalOpen(true)}
        icon={<TestTube className="w-6 h-6" />} 
      />

      {/* Create Blood Test Modal */}
      <CreateBloodTestModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />
    </>
  );
}