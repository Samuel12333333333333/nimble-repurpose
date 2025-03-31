
import React, { useState } from 'react';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Shield, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const Security: React.FC = () => {
  const { isAuthenticated, isLoading } = useProtectedRoute();
  const { user } = useAuth();
  const { toast } = useToast();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [activityAlerts, setActivityAlerts] = useState(true);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleEnableTwoFactor = () => {
    toast({
      title: "Two-factor authentication",
      description: "This feature is coming soon.",
    });
  };

  const recentActivities = [
    { id: 1, activity: 'Login from Chrome on macOS', location: 'San Francisco, CA', time: '5 minutes ago' },
    { id: 2, activity: 'Password changed', location: 'San Francisco, CA', time: '2 days ago' },
    { id: 3, activity: 'Login from Safari on iOS', location: 'San Francisco, CA', time: '5 days ago' },
  ];

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-semibold mb-6">Security</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle>Two-Factor Authentication</CardTitle>
            </div>
            <CardDescription>Add an extra layer of security to your account</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="two-factor" className="font-medium">Enable 2FA</Label>
                  <p className="text-sm text-muted-foreground">Protect your account with 2FA</p>
                </div>
                <Switch 
                  id="two-factor" 
                  checked={twoFactorEnabled} 
                  onCheckedChange={(value) => {
                    if (value) {
                      handleEnableTwoFactor();
                    } else {
                      setTwoFactorEnabled(false);
                    }
                  }} 
                />
              </div>
              
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={handleEnableTwoFactor}
                disabled={twoFactorEnabled}
              >
                Setup Two-Factor Authentication
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Key className="h-5 w-5 text-primary" />
              <CardTitle>Password</CardTitle>
            </div>
            <CardDescription>Manage your password</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Last changed: 30 days ago</p>
              </div>
              
              <Button variant="outline" className="w-full">
                Change Password
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Recent security activities on your account</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="activity-alerts" className="font-medium">Activity Alerts</Label>
                  <p className="text-sm text-muted-foreground">Get notified about suspicious activity</p>
                </div>
                <Switch 
                  id="activity-alerts" 
                  checked={activityAlerts} 
                  onCheckedChange={setActivityAlerts} 
                />
              </div>
              
              <div className="space-y-4 mt-6">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-4 p-4 rounded-md border">
                    <div>
                      <p className="font-medium">{activity.activity}</p>
                      <div className="flex text-sm text-muted-foreground mt-1">
                        <p>{activity.location}</p>
                        <span className="mx-2">•</span>
                        <p>{activity.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Security;
