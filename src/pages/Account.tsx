
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, CreditCard, Settings, Bell, Shield, LogOut } from 'lucide-react';

const Account: React.FC = () => {
  const [firstName, setFirstName] = useState('John');
  const [lastName, setLastName] = useState('Doe');
  const [email, setEmail] = useState('john.doe@example.com');
  const { toast } = useToast();

  const saveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully.",
    });
  };

  const savePassword = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Password Updated",
      description: "Your password has been updated successfully.",
    });
  };

  const cancelSubscription = () => {
    toast({
      title: "Subscription Canceled",
      description: "Your subscription has been canceled.",
      variant: "destructive",
    });
  };

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
            <Link to="/" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
              Logout
            </Link>
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
                  <div className="font-medium">John Doe</div>
                  <div className="text-sm text-muted-foreground">Pro Plan</div>
                </div>
              </div>
              
              <nav className="space-y-1">
                {[
                  { name: 'Profile', icon: <User className="h-4 w-4 mr-2" />, href: '#profile' },
                  { name: 'Billing', icon: <CreditCard className="h-4 w-4 mr-2" />, href: '#billing' },
                  { name: 'Notifications', icon: <Bell className="h-4 w-4 mr-2" />, href: '#notifications' },
                  { name: 'Security', icon: <Shield className="h-4 w-4 mr-2" />, href: '#security' },
                  { name: 'Settings', icon: <Settings className="h-4 w-4 mr-2" />, href: '#settings' }
                ].map((item) => (
                  <a 
                    key={item.name}
                    href={item.href}
                    className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-secondary transition-colors"
                  >
                    {item.icon}
                    {item.name}
                  </a>
                ))}
                
                <Link 
                  to="/"
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-red-500 hover:bg-red-50 transition-colors mt-6"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Link>
              </nav>
            </div>
          </aside>
          
          <div className="flex-1">
            <section id="profile" className="mb-12">
              <h2 className="text-2xl font-semibold mb-6">Profile</h2>
              <div className="bg-white p-6 rounded-lg border">
                <form onSubmit={saveProfile} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="first-name" className="text-sm font-medium">
                        First Name
                      </label>
                      <input
                        id="first-name"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
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
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
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
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
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
                    <span>June 15, 2023</span>
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
                      { date: 'May 15, 2023', description: 'Pro Plan - Monthly', amount: '$49.00' },
                      { date: 'Apr 15, 2023', description: 'Pro Plan - Monthly', amount: '$49.00' },
                      { date: 'Mar 15, 2023', description: 'Pro Plan - Monthly', amount: '$49.00' }
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
          </div>
        </div>
      </main>
    </div>
  );
};

export default Account;
