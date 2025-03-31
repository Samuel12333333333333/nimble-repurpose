
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, CreditCard, Settings, Bell, Shield, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { supabase } from '@/integrations/supabase/client';

type ProfileData = {
  firstName: string;
  lastName: string;
  email: string;
};

const Account: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: '',
    lastName: '',
    email: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  
  // Protect this route - redirect if not authenticated
  const { isAuthenticated, isLoading: authLoading } = useProtectedRoute();

  // Fetch user data from Supabase when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        
        // Get user metadata from auth user
        const metadata = user.user_metadata || {};
        const userEmail = user.email || '';
        
        setProfileData({
          firstName: metadata.first_name || 'User',
          lastName: metadata.last_name || '',
          email: userEmail
        });
      } catch (error: any) {
        console.error("Error fetching user data:", error);
        toast({
          title: "Error loading profile",
          description: error.message || "Could not load your profile information",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchUserData();
    }
  }, [user, toast]);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          first_name: profileData.firstName,
          last_name: profileData.lastName,
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message || "Could not update your profile",
        variant: "destructive",
      });
    }
  };

  const savePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const currentPassword = (form.elements.namedItem('current-password') as HTMLInputElement).value;
    const newPassword = (form.elements.namedItem('new-password') as HTMLInputElement).value;
    const confirmPassword = (form.elements.namedItem('confirm-password') as HTMLInputElement).value;
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirmation must match.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Supabase doesn't have a direct method to verify current password before changing
      // In a production app, you might want to implement this verification differently
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
      
      toast({
        title: "Password Updated",
        description: "Your password has been updated successfully.",
      });
      
      // Clear the form
      form.reset();
    } catch (error: any) {
      toast({
        title: "Error updating password",
        description: error.message || "Could not update your password",
        variant: "destructive",
      });
    }
  };

  const cancelSubscription = () => {
    // In a real app, this would connect to your payment processor
    toast({
      title: "Subscription Canceled",
      description: "Your subscription has been canceled.",
      variant: "destructive",
    });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="relative w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="text-xl font-outfit font-semibold">ContentAI</span>
          </Link>
          <nav className="ml-auto flex items-center space-x-4">
            <Link to="/dashboard" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
              Dashboard
            </Link>
            <button 
              onClick={handleLogout}
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      <main className="container py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-64">
            <div className="sticky top-8 space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="font-medium">
                    {isLoading ? 'Loading...' : `${profileData.firstName} ${profileData.lastName}`}
                  </div>
                  <div className="text-sm text-muted-foreground">Pro Plan</div>
                </div>
              </div>
              
              <nav className="space-y-1">
                {[
                  { name: 'Profile', icon: <User className="h-4 w-4 mr-2" />, href: '#profile', id: 'profile' },
                  { name: 'Billing', icon: <CreditCard className="h-4 w-4 mr-2" />, href: '#billing', id: 'billing' },
                  { name: 'Notifications', icon: <Bell className="h-4 w-4 mr-2" />, href: '#notifications', id: 'notifications' },
                  { name: 'Security', icon: <Shield className="h-4 w-4 mr-2" />, href: '#security', id: 'security' },
                  { name: 'Settings', icon: <Settings className="h-4 w-4 mr-2" />, href: '#settings', id: 'settings' }
                ].map((item) => (
                  <a 
                    key={item.name}
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab(item.id);
                      document.querySelector(item.href)?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                      ${activeTab === item.id ? 'bg-secondary text-primary' : 'hover:bg-secondary'}`}
                  >
                    {item.icon}
                    {item.name}
                  </a>
                ))}
                
                <button 
                  onClick={handleLogout}
                  className="flex w-full items-center px-3 py-2 text-sm font-medium rounded-md text-red-500 hover:bg-red-50 transition-colors mt-6"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </button>
              </nav>
            </div>
          </aside>
          
          <div className="flex-1">
            <section id="profile" className="mb-12">
              <h2 className="text-2xl font-semibold mb-6">Profile</h2>
              <div className="bg-white p-6 rounded-lg border">
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
                  </div>
                ) : (
                  <form onSubmit={saveProfile} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="first-name" className="text-sm font-medium">
                          First Name
                        </label>
                        <input
                          id="first-name"
                          type="text"
                          value={profileData.firstName}
                          onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="last-name" className="text-sm font-medium">
                          Last Name
                        </label>
                        <input
                          id="last-name"
                          type="text"
                          value={profileData.lastName}
                          onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={profileData.email}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md"
                      />
                      <p className="text-xs text-muted-foreground">
                        Email address cannot be changed. Contact support if needed.
                      </p>
                    </div>
                    
                    <div className="pt-4">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </section>
            
            <section id="billing" className="mb-12">
              <h2 className="text-2xl font-semibold mb-6">Billing</h2>
              <div className="bg-white p-6 rounded-lg border mb-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="font-medium mb-1">Pro Plan</h3>
                    <p className="text-sm text-muted-foreground">Billed monthly</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-semibold">$49</span>
                    <span className="text-sm text-muted-foreground">/month</span>
                  </div>
                </div>
                
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                    <span>Next billing date</span>
                    <span>{new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Payment method</span>
                    <span>•••• 4242</span>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <button className="px-4 py-2 bg-secondary text-foreground rounded-md hover:bg-secondary/80 transition-colors">
                    Update Payment Method
                  </button>
                  <button 
                    onClick={cancelSubscription}
                    className="px-4 py-2 border border-red-300 text-red-500 rounded-md hover:bg-red-50 transition-colors"
                  >
                    Cancel Subscription
                  </button>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg border">
                <h3 className="font-medium mb-4">Billing History</h3>
                <table className="w-full text-sm">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left py-2">Date</th>
                      <th className="text-left py-2">Description</th>
                      <th className="text-right py-2">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { date: new Date(Date.now() - 30*24*60*60*1000).toLocaleDateString(), description: 'Pro Plan - Monthly', amount: '$49.00' },
                      { date: new Date(Date.now() - 60*24*60*60*1000).toLocaleDateString(), description: 'Pro Plan - Monthly', amount: '$49.00' },
                      { date: new Date(Date.now() - 90*24*60*60*1000).toLocaleDateString(), description: 'Pro Plan - Monthly', amount: '$49.00' }
                    ].map((item, i) => (
                      <tr key={i} className="border-b last:border-0">
                        <td className="py-3">{item.date}</td>
                        <td className="py-3">{item.description}</td>
                        <td className="py-3 text-right">{item.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
            
            <section id="security" className="mb-12">
              <h2 className="text-2xl font-semibold mb-6">Security</h2>
              <div className="bg-white p-6 rounded-lg border">
                <h3 className="font-medium mb-4">Change Password</h3>
                <form onSubmit={savePassword} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="current-password" className="text-sm font-medium">
                      Current Password
                    </label>
                    <input
                      id="current-password"
                      type="password"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="new-password" className="text-sm font-medium">
                      New Password
                    </label>
                    <input
                      id="new-password"
                      type="password"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="••••••••"
                      required
                      minLength={6}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="confirm-password" className="text-sm font-medium">
                      Confirm New Password
                    </label>
                    <input
                      id="confirm-password"
                      type="password"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="••••••••"
                      required
                      minLength={6}
                    />
                  </div>
                  
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                    >
                      Update Password
                    </button>
                  </div>
                </form>
              </div>
            </section>
            
            <section id="notifications" className="mb-12">
              <h2 className="text-2xl font-semibold mb-6">Notifications</h2>
              <div className="bg-white p-6 rounded-lg border">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Email Notifications</h3>
                      <p className="text-sm text-muted-foreground">Receive emails about activity on your account</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Content Updates</h3>
                      <p className="text-sm text-muted-foreground">Get notified when your content is processed</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Marketing</h3>
                      <p className="text-sm text-muted-foreground">Receive promotional emails and product updates</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t">
                  <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
                    Save Preferences
                  </button>
                </div>
              </div>
            </section>
            
            <section id="settings" className="mb-12">
              <h2 className="text-2xl font-semibold mb-6">Settings</h2>
              <div className="bg-white p-6 rounded-lg border">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Dark Mode</h3>
                      <p className="text-sm text-muted-foreground">Toggle between light and dark theme</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Timezone</h3>
                      <p className="text-sm text-muted-foreground">Set your preferred timezone</p>
                    </div>
                    <select className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50">
                      <option>UTC (Universal Time Coordinated)</option>
                      <option>EST (Eastern Standard Time)</option>
                      <option>CST (Central Standard Time)</option>
                      <option>MST (Mountain Standard Time)</option>
                      <option>PST (Pacific Standard Time)</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Language</h3>
                      <p className="text-sm text-muted-foreground">Select your preferred language</p>
                    </div>
                    <select className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50">
                      <option>English (US)</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>German</option>
                      <option>Chinese (Simplified)</option>
                    </select>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t">
                  <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
                    Save Settings
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Account;
