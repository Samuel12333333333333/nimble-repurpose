
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { 
  LayoutDashboard, 
  User, 
  CreditCard, 
  Bell, 
  Shield, 
  Settings, 
  LogOut,
  ChevronDown
} from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

type MenuItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
  path?: string;
  action?: () => void;
};

const AppSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut, user } = useAuth();
  const { toast } = useToast();
  const [activeMenuItem, setActiveMenuItem] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Get current path to highlight active menu item
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/dashboard')) setActiveMenuItem('dashboard');
    else if (path.includes('/account')) setActiveMenuItem('profile');
    else if (path.includes('/billing')) setActiveMenuItem('billing');
    else if (path.includes('/notifications')) setActiveMenuItem('notifications');
    else if (path.includes('/security')) setActiveMenuItem('security');
    else if (path.includes('/settings')) setActiveMenuItem('settings');
  }, [location.pathname]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          setIsLoading(true);
          
          // Fetch user profile data from Supabase or other data source
          // Replace with your actual user data fetching logic
          const { data: userData, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
            
          if (error) {
            console.error('Error fetching user data:', error);
            setUserData({
              email: user.email
            });
          } else {
            setUserData({
              ...userData,
              email: user.email
            });
          }
        } catch (error) {
          console.error('Error:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchUserData();
  }, [user]);

  const menuItems: MenuItem[] = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: <LayoutDashboard size={18} />,
      path: '/dashboard'
    },
    { 
      id: 'profile', 
      label: 'Profile', 
      icon: <User size={18} />,
      path: '/account'
    },
    { 
      id: 'billing', 
      label: 'Billing', 
      icon: <CreditCard size={18} />,
      path: '/billing'
    },
    { 
      id: 'notifications', 
      label: 'Notifications', 
      icon: <Bell size={18} />,
      path: '/notifications'
    },
    { 
      id: 'security', 
      label: 'Security', 
      icon: <Shield size={18} />,
      path: '/security'
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: <Settings size={18} />,
      path: '/settings'
    },
    { 
      id: 'logout', 
      label: 'Logout', 
      icon: <LogOut size={18} />,
      action: async () => {
        try {
          await signOut();
          toast({
            title: "Logged out successfully",
          });
        } catch (error) {
          console.error('Logout error:', error);
          toast({
            title: "Error logging out",
            variant: "destructive",
          });
        }
      }
    }
  ];

  const handleMenuClick = (item: MenuItem) => {
    if (activeMenuItem === item.id) {
      setActiveMenuItem(null);
    } else {
      setActiveMenuItem(item.id);
    }

    if (item.path) {
      navigate(item.path);
    } else if (item.action) {
      item.action();
    }
  };

  return (
    <div className="w-64 h-screen bg-background border-r flex flex-col">
      {/* Sidebar Header */}
      <div className="p-4 border-b">
        <div className="flex items-center space-x-2">
          <div className="relative w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">C</span>
          </div>
          <span className="text-xl font-outfit font-semibold">ContentAI</span>
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="px-2 space-y-1">
          {menuItems.map((item) => (
            <Collapsible 
              key={item.id} 
              open={activeMenuItem === item.id}
              onOpenChange={() => {}}
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className={`w-full justify-start px-3 py-2 text-sm font-medium rounded-md flex items-center space-x-3 
                    ${activeMenuItem === item.id ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50'}`}
                  onClick={() => handleMenuClick(item)}
                >
                  {item.icon}
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.id !== 'logout' && (
                    <ChevronDown 
                      className={`h-4 w-4 transition-transform ${activeMenuItem === item.id ? 'transform rotate-180' : ''}`} 
                    />
                  )}
                </Button>
              </CollapsibleTrigger>
              {item.id !== 'logout' && (
                <CollapsibleContent>
                  <div className="pl-10 pr-2 py-2 text-sm text-muted-foreground">
                    {/* Dynamic content based on menu item */}
                    {item.id === 'dashboard' && <p>My Dashboard</p>}
                    {item.id === 'profile' && <p>My Profile</p>}
                    {item.id === 'billing' && <p>Billing Info</p>}
                    {item.id === 'notifications' && <p>My Notifications</p>}
                    {item.id === 'security' && <p>Security Settings</p>}
                    {item.id === 'settings' && <p>App Settings</p>}
                  </div>
                </CollapsibleContent>
              )}
            </Collapsible>
          ))}
        </nav>
      </div>

      {/* Sidebar Footer */}
      <div className="p-4 border-t">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-secondary rounded-full"></div>
          <div className="flex-1">
            <p className="text-sm font-medium truncate">
              {isLoading 
                ? "Loading..." 
                : userData?.full_name || userData?.name || userData?.email?.split('@')[0] || "User"}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {userData?.email || ""}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppSidebar;
