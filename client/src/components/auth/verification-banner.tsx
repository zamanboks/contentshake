import { useAuth } from "@/hooks/use-auth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";

export function VerificationBanner() {
  const { user } = useAuth();
  const [hidden, setHidden] = useState(false);
  const [, navigate] = useLocation();

  // Don't show if:
  // - User isn't logged in
  // - User's email is already verified
  // - The banner has been manually dismissed
  if (!user || user.emailVerified || hidden) {
    return null;
  }

  return (
    <Alert className="mb-4 bg-amber-50 border-amber-200">
      <AlertCircle className="h-4 w-4 text-amber-600" />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-2">
        <div>
          <AlertTitle className="text-amber-800">Verify your email address</AlertTitle>
          <AlertDescription className="text-amber-700">
            Please verify your email address to access all features of ContentShake.ai.
          </AlertDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            size="sm" 
            variant="outline"
            className="border-amber-300 hover:bg-amber-100 hover:text-amber-900"
            onClick={() => setHidden(true)}
          >
            Dismiss
          </Button>
          <Button 
            size="sm" 
            onClick={() => navigate("/verify-email")}
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            Verify Now
          </Button>
        </div>
      </div>
    </Alert>
  );
}