
import React from 'react';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const Billing: React.FC = () => {
  const { isAuthenticated, isLoading } = useProtectedRoute();
  const { user } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-semibold mb-6">Billing & Payments</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-2xl font-bold">Free Plan</p>
              <p className="text-muted-foreground">Your current subscription plan</p>
              <div className="mt-4 p-3 bg-accent/30 rounded-md">
                <h3 className="font-medium">Plan Features:</h3>
                <ul className="mt-2 space-y-1 text-sm">
                  <li>✓ Basic content generation</li>
                  <li>✓ 5 projects per month</li>
                  <li>✓ Standard support</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-muted-foreground">No payment methods added yet.</p>
              <button className="text-primary hover:underline text-sm">+ Add payment method</button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Billing History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-muted-foreground">No billing history available.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Billing;
