import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useToast } from "@/hooks/use-toast";
import { TestTube, Calendar, TrendingUp, TrendingDown, AlertTriangle, Plus } from "lucide-react";

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
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
      }
    },
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
    // Extract key hormonal markers that are commonly tracked
    const keyMarkers = [
      "testosterone_total",
      "testosterone_free", 
      "estradiol",
      "lh",
      "fsh",
      "shbg",
      "liver_alt",
      "liver_ast"
    ];
    
    return keyMarkers
      .filter(marker => results[marker] !== undefined)
      .slice(0, 3) // Show max 3 key results
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
                          {hasAlerts(test.alertFlags) && (
                            <div className="flex items-center space-x-1 text-medical-red">
                              <AlertTriangle className="w-4 h-4" />
                              <span className="text-xs">Alert</span>
                            </div>
                          )}
                        </div>
                      </CardHeader>
                      
                      <CardContent>
                        {/* Key Results */}
                        {keyResults.length > 0 && (
                          <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-300 mb-2">Key Results</h4>
                            <div className="grid grid-cols-1 gap-2">
                              {keyResults.map((result, idx) => (
                                <div key={idx} className="flex items-center justify-between text-sm">
                                  <span className="text-gray-400">{result.name}</span>
                                  <span className="text-white font-medium">
                                    {result.value} {result.unit}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Alert Flags */}
                        {hasAlerts(test.alertFlags) && (
                          <div className="mb-4">
                            <div className="flex flex-wrap gap-1">
                              {test.alertFlags.slice(0, 2).map((flag, idx) => (
                                <Badge key={idx} variant="destructive" className="text-xs">
                                  {flag.replace(/_/g, " ")}
                                </Badge>
                              ))}
                              {test.alertFlags.length > 2 && (
                                <Badge variant="outline" className="text-xs text-gray-400">
                                  +{test.alertFlags.length - 2} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Doctor Notes */}
                        {test.doctorNotes && (
                          <div className="mb-4">
                            <p className="text-sm text-gray-400 italic">
                              "{test.doctorNotes}"
                            </p>
                          </div>
                        )}

                        {/* Bottom Row */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {test.xpEarned && (
                              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                                +{test.xpEarned} XP
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-energy-orange hover:text-energy-orange/90 hover:bg-energy-orange/10"
                            >
                              <TrendingUp className="w-4 h-4 mr-1" />
                              Trends
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-medical-blue hover:text-medical-blue/90 hover:bg-medical-blue/10"
                            >
                              View Full
                            </Button>
                          </div>
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
                    <div className="text-6xl mb-4">🩸</div>
                    <h3 className="text-xl font-google-sans font-semibold text-white mb-2">
                      No Blood Tests Yet
                    </h3>
                    <p className="text-gray-400 mb-6">
                      Regular blood work is essential for monitoring your health during cycles
                    </p>
                    <Button
                      className="bg-gradient-to-r from-energy-orange to-energy-orange/80 hover:from-energy-orange/90 hover:to-energy-orange/70"
                    >
                      <TestTube className="w-4 h-4 mr-2" />
                      Add Your First Test
                    </Button>
                  </CardContent>
                </Card>
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
      <FloatingActionButton icon={<TestTube className="w-6 h-6" />} />
    </>
  );
}
