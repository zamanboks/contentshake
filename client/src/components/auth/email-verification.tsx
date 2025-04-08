import React, { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, ShieldCheck } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function EmailVerification() {
  const { user, verifyEmailMutation, resendVerificationMutation } = useAuth();
  const [verificationCode, setVerificationCode] = useState("");

  // If the user's email is already verified, show a success message instead
  if (user?.emailVerified) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <ShieldCheck className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-center">Email Verified</CardTitle>
          <CardDescription className="text-center">
            Your email address has been successfully verified.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="bg-green-50 border-green-200">
            <ShieldCheck className="h-4 w-4 text-green-600" />
            <AlertTitle>Verification Complete</AlertTitle>
            <AlertDescription>
              Your account is fully verified and you have access to all features.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationCode.length < 6) return;
    verifyEmailMutation.mutate({ code: verificationCode });
  };

  const handleResend = () => {
    resendVerificationMutation.mutate();
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex justify-center mb-4">
          <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
            <Mail className="h-6 w-6 text-orange-600" />
          </div>
        </div>
        <CardTitle className="text-center">Verify Your Email</CardTitle>
        <CardDescription className="text-center">
          We sent a verification code to {user?.email}. Enter it below to verify your email address.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleVerify}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="verification-code">Verification Code</Label>
              <Input
                id="verification-code"
                type="text"
                placeholder="123456"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                maxLength={6}
                required
                className="text-center tracking-widest text-lg"
              />
            </div>
            <Button 
              type="submit" 
              disabled={verificationCode.length < 6 || verifyEmailMutation.isPending}
              className="w-full"
            >
              {verifyEmailMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Verify Email
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col items-center gap-4">
        <div className="text-sm text-gray-500 text-center">
          Didn't receive the code? Check your spam folder or request a new one.
        </div>
        <Button 
          variant="outline" 
          onClick={handleResend}
          disabled={resendVerificationMutation.isPending}
          className="w-full"
        >
          {resendVerificationMutation.isPending && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Resend Verification Code
        </Button>
      </CardFooter>
    </Card>
  );
}