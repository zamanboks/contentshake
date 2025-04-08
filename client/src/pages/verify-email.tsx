import { EmailVerification } from "@/components/auth/email-verification";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";

export default function VerifyEmailPage() {
  const { user, isLoading } = useAuth();
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!user) {
    return <Redirect to="/auth" />;
  }
  
  return (
    <div className="container max-w-6xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold text-center mb-8">Email Verification</h1>
      <EmailVerification />
    </div>
  );
}