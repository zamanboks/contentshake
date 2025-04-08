import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import ContentIdeas from "@/pages/content-ideas";
import ContentWriting from "@/pages/content-writing";
import BrandVoice from "@/pages/brand-voice";
import Optimization from "@/pages/optimization";
import Collaboration from "@/pages/collaboration";
import SocialMedia from "@/pages/social-media";
import Subscription from "@/pages/subscription";
import AuthPage from "@/pages/auth-page";
import LandingPage from "@/pages/landing-page";
import VerifyEmailPage from "@/pages/verify-email";
import { MainLayout } from "@/components/layout/main-layout";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import { useAuth } from "@/hooks/use-auth";
import ForgotPasswordPage from "@/pages/forgot-password";
import ResetPasswordPage from "@/pages/reset-password";

// Routes that should be within the main app layout (with sidebar, etc.)
function AppRoutes() {
  return (
    <MainLayout>
      <Switch>
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/content-ideas" component={ContentIdeas} />
        <Route path="/content-writing" component={ContentWriting} />
        <Route path="/content-writing/:id/edit" component={ContentWriting} />
        <Route path="/brand-voice" component={BrandVoice} />
        <Route path="/brand-voice/:id/edit" component={BrandVoice} />
        <Route path="/optimization" component={Optimization} />
        <Route path="/collaboration" component={Collaboration} />
        <Route path="/social-media" component={SocialMedia} />
        <Route path="/subscription" component={Subscription} />
        <Route component={NotFound} />
      </Switch>
    </MainLayout>
  );
}

// Router component that determines which layout to use
function Router() {
  const { user, isLoading } = useAuth();
  const [location] = useLocation();

  // When app is loading auth state, show nothing
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // If user is authenticated, redirect from '/' to '/dashboard'
  if (user && location === "/") {
    return <Route path="/" component={() => { window.location.href = '/dashboard'; return null; }} />;
  }

  return (
    <Switch>
      {/* Public routes (no layout) */}
      <Route path="/" component={LandingPage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/forgot-password" component={ForgotPasswordPage} />
      <Route path="/reset-password" component={ResetPasswordPage} />
      
      {/* Email verification route */}
      {user && <Route path="/verify-email" component={VerifyEmailPage} />}
      
      {/* Protected app routes */}
      {user ? (
        <Route path="/:rest*">
          <AppRoutes />
        </Route>
      ) : (
        <Route path="/:rest*">
          <AuthPage />
        </Route>
      )}
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
