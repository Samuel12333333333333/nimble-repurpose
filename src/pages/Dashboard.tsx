
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Upload, Video, Sparkles, Folder, Settings, Plus, ArrowRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

const Dashboard: React.FC = () => {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const { toast } = useToast();
  
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
            <Link to="/account" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
              Account
            </Link>
            <Link to="/" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
              Logout
            </Link>
          </nav>
        </div>
      </header>

      <main className="container py-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold">Dashboard</h1>
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
          <TabsList className="mb-4">
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>
          
          <TabsContent value="recent" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="border rounded-lg p-5 hover:shadow-md transition-shadow">
                  <div className="bg-secondary aspect-video rounded-md flex items-center justify-center mb-4">
                    <Video className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="font-medium mb-1">Sample Video {i + 1}</h3>
                  <p className="text-sm text-muted-foreground mb-3">Uploaded 2 days ago</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs bg-secondary px-2 py-1 rounded">4 clips generated</span>
                    <button className="text-primary text-sm flex items-center">
                      View <ArrowRight className="ml-1 h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-8">
              <button 
                onClick={() => setIsUploadDialogOpen(true)}
                className="flex items-center justify-center w-full max-w-md p-4 border border-dashed rounded-lg text-muted-foreground hover:text-primary hover:border-primary transition-colors"
              >
                <Upload className="mr-2 h-5 w-5" />
                <span>Upload new content</span>
              </button>
            </div>
          </TabsContent>
          
          <TabsContent value="projects" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="border rounded-lg p-5 hover:shadow-md transition-shadow">
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
                </div>
              ))}
              
              <div 
                onClick={() => setIsCreatingProject(true)}
                className="border rounded-lg p-5 hover:shadow-md transition-shadow cursor-pointer flex flex-col items-center justify-center h-[172px]"
              >
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-3">
                  <Plus className="h-6 w-6 text-muted-foreground" />
                </div>
                <span className="text-muted-foreground">Create New Project</span>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="templates" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: "TikTok Highlights", icon: <Sparkles className="h-5 w-5 text-white" /> },
                { name: "YouTube Shorts", icon: <Video className="h-5 w-5 text-white" /> },
                { name: "Instagram Reels", icon: <Video className="h-5 w-5 text-white" /> }
              ].map((template, i) => (
                <div key={i} className="border rounded-lg p-5 hover:shadow-md transition-shadow">
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
                </div>
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
