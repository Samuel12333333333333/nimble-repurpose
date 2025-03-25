
import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Upload, Video, Sparkles, Folder, Settings, Plus, ArrowRight, LogOut, User } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { Card, CardContent } from '@/components/ui/card';
import { getUserContent } from '@/services/contentService';
import { Content } from '@/services/contentService';

const Dashboard: React.FC = () => {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [userContent, setUserContent] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const { isAuthenticated, isLoading: authLoading } = useProtectedRoute();
  
  useEffect(() => {
    const fetchContent = async () => {
      if (isAuthenticated) {
        setIsLoading(true);
        try {
          const content = await getUserContent();
          setUserContent(content);
        } catch (error) {
          console.error('Error fetching content:', error);
          toast({
            title: "Error",
            description: "Failed to load your content. Please try again.",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchContent();
  }, [isAuthenticated, toast]);
  
  const handleUpload = () => {
    toast({
      title: "Upload Complete",
      description: "Your content has been uploaded successfully.",
    });
    setIsUploadDialogOpen(false);
  };

  const createNewProject = () => {
    toast({
      title: "New Project Created",
      description: "Your project has been created successfully.",
    });
    setIsCreatingProject(false);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 bg-primary/10 rounded-full mb-4"></div>
          <div className="h-4 w-48 bg-secondary rounded"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="relative w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="text-xl font-outfit font-semibold">ContentAI</span>
          </Link>
          <nav className="flex items-center space-x-4">
            <Link to="/account" className="flex items-center space-x-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors p-2 rounded-md hover:bg-secondary/50">
              <User size={18} />
              <span>Account</span>
            </Link>
            <button 
              onClick={() => signOut()} 
              className="flex items-center space-x-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors p-2 rounded-md hover:bg-secondary/50"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </nav>
        </div>
      </header>

      <main className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-semibold mb-1">Welcome, {user?.email?.split('@')[0] || 'User'}</h1>
            <p className="text-muted-foreground">Manage your content and projects</p>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={() => setIsCreatingProject(true)}
              className="flex items-center space-x-2 px-4 py-2 rounded-md bg-secondary text-foreground hover:bg-secondary/80 transition-colors"
            >
              <Plus size={18} />
              <span>New Project</span>
            </button>
            <button 
              onClick={() => setIsUploadDialogOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Upload size={18} />
              <span>Upload Content</span>
            </button>
          </div>
        </div>

        <Tabs defaultValue="recent" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="recent">Recent Content</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>
          
          <TabsContent value="recent" className="space-y-6">
            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="border rounded-lg overflow-hidden">
                    <div className="bg-secondary aspect-video animate-pulse"></div>
                    <CardContent className="p-5">
                      <div className="h-5 bg-secondary/60 rounded w-3/4 mb-2 animate-pulse"></div>
                      <div className="h-4 bg-secondary/40 rounded w-1/2 mb-4 animate-pulse"></div>
                      <div className="flex justify-between items-center">
                        <div className="h-4 bg-secondary/40 rounded w-1/4 animate-pulse"></div>
                        <div className="h-4 bg-secondary/40 rounded w-1/5 animate-pulse"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : userContent.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userContent.map((content) => (
                  <Card key={content.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    <div className="bg-secondary aspect-video flex items-center justify-center">
                      <Video className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <CardContent className="p-5">
                      <h3 className="font-medium mb-1">{content.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {new Date(content.created_at).toLocaleDateString()}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs bg-secondary px-2 py-1 rounded">
                          {content.outputs.length} outputs
                        </span>
                        <Link to={`/editor?id=${content.id}`} className="text-primary text-sm flex items-center">
                          View <ArrowRight className="ml-1 h-4 w-4" />
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <Video className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No content yet</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Upload your first video, audio, or text content to start generating content.
                </p>
                <button 
                  onClick={() => setIsUploadDialogOpen(true)}
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <Upload size={18} />
                  <span>Upload Content</span>
                </button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="projects" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(2)].map((_, i) => (
                <Card key={i} className="border rounded-lg p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center mr-3">
                      <Folder className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Marketing Campaign {i + 1}</h3>
                      <p className="text-xs text-muted-foreground">5 videos</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs bg-secondary px-2 py-1 rounded">Last edited 3 days ago</span>
                    <button className="text-primary text-sm flex items-center">
                      Open <ArrowRight className="ml-1 h-4 w-4" />
                    </button>
                  </div>
                </Card>
              ))}
              
              <Card 
                onClick={() => setIsCreatingProject(true)}
                className="border rounded-lg p-5 hover:shadow-md transition-shadow cursor-pointer flex flex-col items-center justify-center h-[172px]"
              >
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-3">
                  <Plus className="h-6 w-6 text-muted-foreground" />
                </div>
                <span className="text-muted-foreground">Create New Project</span>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="templates" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: "TikTok Highlights", icon: <Sparkles className="h-5 w-5 text-white" /> },
                { name: "YouTube Shorts", icon: <Video className="h-5 w-5 text-white" /> },
                { name: "Instagram Reels", icon: <Video className="h-5 w-5 text-white" /> }
              ].map((template, i) => (
                <Card key={i} className="border rounded-lg p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-md bg-primary flex items-center justify-center mr-3">
                      {template.icon}
                    </div>
                    <h3 className="font-medium">{template.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">Optimize your content for {template.name} with our AI templates.</p>
                  <button className="text-primary text-sm flex items-center">
                    Use Template <ArrowRight className="ml-1 h-4 w-4" />
                  </button>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Upload Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Content</DialogTitle>
            <DialogDescription>
              Upload your video, podcast, or article to start generating clips.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-10">
            <div className="mb-6 w-full max-w-sm p-8 border border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
              <Upload className="h-10 w-10 text-muted-foreground mb-4" />
              <p className="text-center text-sm text-muted-foreground mb-2">
                Drag and drop your files here, or click to browse
              </p>
              <p className="text-center text-xs text-muted-foreground">
                Supports MP4, MOV, MP3, WAV, PDF, DOCX
              </p>
            </div>
            <button 
              onClick={handleUpload}
              className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              Upload & Analyze
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* New Project Dialog */}
      <Dialog open={isCreatingProject} onOpenChange={setIsCreatingProject}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Organize your content into projects to keep things organized.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="project-name" className="text-sm font-medium">
                Project Name
              </label>
              <input
                id="project-name"
                type="text"
                placeholder="My Awesome Project"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="project-description" className="text-sm font-medium">
                Description (Optional)
              </label>
              <textarea
                id="project-description"
                placeholder="What's this project about?"
                rows={3}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <button 
              onClick={createNewProject}
              className="w-full px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors mt-2"
            >
              Create Project
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
