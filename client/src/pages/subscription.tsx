import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function SubscriptionPage() {
  const { 
    user, 
    subscriptionPlans, 
    isSubscriptionPlansLoading, 
    updateSubscriptionMutation 
  } = useAuth();

  const formatPrice = (price: number) => {
    // Price is stored in cents, convert to dollars
    return (price / 100).toFixed(2);
  };

  const handleSubscribe = (planName: string) => {
    updateSubscriptionMutation.mutate({ planName });
  };

  if (isSubscriptionPlansLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container max-w-6xl py-10">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-2">Subscription Plans</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Choose a plan that fits your needs. Upgrade anytime to get more content generations, optimizations, and social posts.
        </p>
        {user && (
          <div className="mt-4">
            <Badge variant="outline" className="bg-primary/10 text-primary">
              Current Plan: {user.plan?.charAt(0).toUpperCase() + user.plan?.slice(1) || "Free"}
            </Badge>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {subscriptionPlans?.map((plan) => (
          <Card key={plan.id} className={`flex flex-col ${user?.plan === plan.name ? 'border-primary border-2' : ''}`}>
            <CardHeader className="pb-2">
              <CardTitle className="flex justify-between items-center">
                <span className="capitalize">{plan.name}</span>
                {user?.plan === plan.name && (
                  <Badge variant="default" className="bg-primary text-primary-foreground">
                    Current
                  </Badge>
                )}
              </CardTitle>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold">
                  ${formatPrice(plan.price)}
                </span>
                {plan.price > 0 && <span className="text-muted-foreground ml-1">/month</span>}
              </div>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-2">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <Check className="h-5 w-5 text-primary shrink-0 mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                variant={user?.plan === plan.name ? "outline" : "default"}
                disabled={
                  user?.plan === plan.name || 
                  updateSubscriptionMutation.isPending
                }
                onClick={() => handleSubscribe(plan.name)}
              >
                {updateSubscriptionMutation.isPending && 
                 updateSubscriptionMutation.variables?.planName === plan.name ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : user?.plan === plan.name ? (
                  "Current Plan"
                ) : (
                  `Subscribe to ${plan.name}`
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-12 p-6 border rounded-lg bg-card">
        <h3 className="text-xl font-semibold mb-4">
          Usage Statistics
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg bg-background">
            <div className="text-muted-foreground text-sm mb-1">Content Created</div>
            <div className="text-3xl font-semibold">
              {user?.contentCreated || 0} 
              <span className="text-base text-muted-foreground ml-1">/ {subscriptionPlans?.find(p => p.name === user?.plan)?.contentLimit || 0}</span>
            </div>
          </div>
          <div className="p-4 border rounded-lg bg-background">
            <div className="text-muted-foreground text-sm mb-1">Optimizations Used</div>
            <div className="text-3xl font-semibold">
              {user?.optimizationsUsed || 0} 
              <span className="text-base text-muted-foreground ml-1">/ {subscriptionPlans?.find(p => p.name === user?.plan)?.optimizationLimit || 0}</span>
            </div>
          </div>
          <div className="p-4 border rounded-lg bg-background">
            <div className="text-muted-foreground text-sm mb-1">Social Posts Created</div>
            <div className="text-3xl font-semibold">
              {user?.socialPostsCreated || 0} 
              <span className="text-base text-muted-foreground ml-1">/ {subscriptionPlans?.find(p => p.name === user?.plan)?.socialPostLimit || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}