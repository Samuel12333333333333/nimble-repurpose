
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

type MenuItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
  path?: string;
  action?: () => void;
};

const AppSidebar: React.FC = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { toast } = useToast();
  const [activeMenuItem, setActiveMenuItem] = useState<string | null>(null);

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
                    <p>Content for {item.label}</p>
                    {/* Placeholder for menu item content */}
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
            <p className="text-sm font-medium truncate">User Account</p>
            <p className="text-xs text-muted-foreground truncate">user@example.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppSidebar;
