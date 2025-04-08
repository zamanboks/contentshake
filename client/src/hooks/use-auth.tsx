import { createContext, ReactNode, useContext } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
  useQueryClient
} from "@tanstack/react-query";
import { User as SelectUser } from "@shared/schema";
import { apiRequest } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type AuthContextType = {
  user: SelectUser | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<Omit<SelectUser, "password">, Error, LoginData>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerMutation: UseMutationResult<Omit<SelectUser, "password">, Error, RegisterData>;
  updateSubscriptionMutation: UseMutationResult<Omit<SelectUser, "password">, Error, {planName: string}>;
  verifyEmailMutation: UseMutationResult<Omit<SelectUser, "password">, Error, {code: string}>;
  resendVerificationMutation: UseMutationResult<{message: string}, Error, void>;
  forgotPasswordMutation: UseMutationResult<{message: string}, Error, {email: string}>;
  resetPasswordMutation: UseMutationResult<{message: string}, Error, {token: string, newPassword: string}>;
  validateResetTokenMutation: UseMutationResult<{valid: boolean}, Error, {token: string}>;
  subscriptionPlans: SubscriptionPlan[] | undefined;
  isSubscriptionPlansLoading: boolean;
};

type LoginData = {
  username: string;
  password: string;
};

type RegisterData = {
  username: string;
  password: string;
  email: string;
  displayName?: string;
};

type SubscriptionPlan = {
  id: number;
  name: string;
  price: number;
  contentLimit: number;
  optimizationLimit: number;
  socialPostLimit: number;
  description: string;
  features: string[];
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: user,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["/api/user"],
    queryFn: async () => {
      try {
        const res = await apiRequest("GET", "/api/user");
        if (res.status === 401) return null;
        return await res.json();
      } catch (error) {
        return null;
      }
    },
  });

  const {
    data: subscriptionPlans,
    isLoading: isSubscriptionPlansLoading,
  } = useQuery({
    queryKey: ["/api/subscription/plans"],
    queryFn: async () => {
      try {
        const res = await apiRequest("GET", "/api/subscription/plans");
        return await res.json();
      } catch (error) {
        console.error("Error fetching subscription plans:", error);
        return [];
      }
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData) => {
      const res = await apiRequest("POST", "/api/login", credentials);
      return await res.json();
    },
    onSuccess: (userData) => {
      queryClient.setQueryData(["/api/user"], userData);
      toast({
        title: "Login successful",
        description: `Welcome back, ${userData.username}!`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message || "Invalid username or password",
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterData) => {
      const res = await apiRequest("POST", "/api/register", data);
      return await res.json();
    },
    onSuccess: (userData) => {
      queryClient.setQueryData(["/api/user"], userData);
      toast({
        title: "Registration successful",
        description: `Welcome, ${userData.username}!`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message || "Could not create account",
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/logout");
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/user"], null);
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateSubscriptionMutation = useMutation({
    mutationFn: async ({ planName }: { planName: string }) => {
      const res = await apiRequest("POST", "/api/subscription/change", { planName });
      return await res.json();
    },
    onSuccess: (userData) => {
      queryClient.setQueryData(["/api/user"], userData);
      toast({
        title: "Subscription updated",
        description: `Your subscription has been updated to ${userData.plan}`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Subscription update failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const verifyEmailMutation = useMutation({
    mutationFn: async ({ code }: { code: string }) => {
      const res = await apiRequest("POST", "/api/verify-email", { code });
      return await res.json();
    },
    onSuccess: (userData) => {
      queryClient.setQueryData(["/api/user"], userData);
      toast({
        title: "Email verified",
        description: "Your email has been verified successfully!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Verification failed",
        description: error.message || "Invalid or expired verification code",
        variant: "destructive",
      });
    },
  });

  const resendVerificationMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/resend-verification");
      return await res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Verification email sent",
        description: "Please check your inbox for the verification code",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Sending verification failed",
        description: error.message || "Could not send verification email",
        variant: "destructive",
      });
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: async ({ email }: { email: string }) => {
      const res = await apiRequest("POST", "/api/forgot-password", { email });
      return await res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Password reset email sent",
        description: "Please check your inbox for a password reset link",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Password reset request failed",
        description: error.message || "Could not send password reset email",
        variant: "destructive",
      });
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async ({ token, newPassword }: { token: string, newPassword: string }) => {
      const res = await apiRequest("POST", "/api/reset-password", { token, newPassword });
      return await res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Password reset successful",
        description: "Your password has been reset. You can now log in with your new password.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Password reset failed",
        description: error.message || "Could not reset password",
        variant: "destructive",
      });
    },
  });

  const validateResetTokenMutation = useMutation({
    mutationFn: async ({ token }: { token: string }) => {
      const res = await apiRequest("GET", `/api/validate-reset-token/${token}`);
      return await res.json();
    },
    onError: (error: Error) => {
      toast({
        title: "Invalid reset token",
        description: "The password reset link is invalid or has expired",
        variant: "destructive",
      });
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        error: error as Error | null,
        loginMutation,
        logoutMutation,
        registerMutation,
        updateSubscriptionMutation,
        verifyEmailMutation,
        resendVerificationMutation,
        forgotPasswordMutation,
        resetPasswordMutation,
        validateResetTokenMutation,
        subscriptionPlans,
        isSubscriptionPlansLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}