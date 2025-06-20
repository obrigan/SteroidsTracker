import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { BottomNavigation } from "@/components/BottomNavigation";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import Courses from "@/pages/Courses";
import Injections from "@/pages/Injections";
import BloodTests from "@/pages/BloodTests";
import Learning from "@/pages/Learning";
import LearningModule from "@/pages/LearningModule";
import Calculator from "@/pages/Calculator";
import AddFirstTest from "@/pages/AddFirstTest";
import Profile from "@/pages/Profile";
import BloodTests from "@/pages/BloodTests";
import Analytics from "@/pages/Analytics";
import BiometricLogin from "@/pages/BiometricLogin";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <div className="min-h-screen bg-deep-black">
      <Switch>
        {isLoading || !isAuthenticated ? (
          <Route path="/" component={Landing} />
        ) : (
          <>
            <Route path="/" component={Dashboard} />
            <Route path="/courses" component={Courses} />
            <Route path="/injections" component={Injections} />
            <Route path="/blood-tests" component={BloodTests} />
            <Route path="/learning" component={Learning} />
            <Route path="/learning/module/:moduleId" component={LearningModule} />
            <Route path="/learning/calculator/:calculatorId" component={Calculator} />
            <Route path="/add-first-test" component={AddFirstTest} />
            <Route path="/profile" component={Profile} />
            <Route path="/blood-tests" component={BloodTests} />
            <Route path="/analytics" component={Analytics} />
            <Route path="/biometric-login" component={BiometricLogin} />
          </>
        )}
        {/* Fallback to 404 */}
        <Route component={NotFound} />
      </Switch>

      {/* Bottom Navigation - Only show when authenticated */}
      {!isLoading && isAuthenticated && <BottomNavigation />}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;