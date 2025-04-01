
import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Upload, Video, Sparkles, Plus, ArrowRight, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { Card, CardContent } from '@/components/ui/card';
import { 
  getUserContent, 
  Content, 
  createContent, 
  createContentOutput,
  generateVideoFromScript,
  VideoGenerationResult
} from '@/services/contentService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const Dashboard: React.FC = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [userContent, setUserContent] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Video creation state
  const [title, setTitle] = useState('');
  const [scriptText, setScriptText] = useState('');
  const [platform, setPlatform] = useState<'instagram' | 'tiktok' | 'youtube' | 'facebook'>('instagram');
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '1:1' | '16:9'>('9:16');
  const [selectedEffects, setSelectedEffects] = useState<string[]>(['subtitles']);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<VideoGenerationResult | null>(null);
  
  const { toast } = useToast();
  const { user } = useAuth();
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
  
  const handleCreateVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !scriptText) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      if (!user) throw new Error("User not authenticated");
      
      // First create the content record
      const contentData = {
        title,
        source_url: '',
        content_type: 'video' as const,
        status: 'processing' as const,
        user_id: user.id
      };
      
      const contentResult = await createContent(contentData);
      
      if (!contentResult) {
        throw new Error("Failed to create content record");
      }
      
      // Generate the video
      const videoOptions = {
        platform,
        aspectRatio,
        effects: selectedEffects,
        subtitlesEnabled: selectedEffects.includes('subtitles'),
        avatarEnabled: selectedEffects.includes('avatar')
      };
      
      const videoResult = await generateVideoFromScript(scriptText, videoOptions);
      setGeneratedVideo(videoResult);
      
      // Create a content output record
      const outputData = {
        content_id: contentResult.id,
        output_type: platform,
        url: videoResult.videoUrl,
        title: title,
        aspect_ratio: videoResult.aspectRatio,
        effects: videoResult.effects
      };
      
      await createContentOutput(outputData);
      
      // Update content status to completed
      await fetch(`/api/content/${contentResult.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'completed' })
      });
      
      // Refresh the content list
      const updatedContent = await getUserContent();
      setUserContent(updatedContent);
      
      toast({
        title: "Video Created",
        description: "Your video has been created successfully.",
      });
      
      // Reset form
      setTitle('');
      setScriptText('');
      setPlatform('instagram');
      setAspectRatio('9:16');
      setSelectedEffects(['subtitles']);
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('Error creating video:', error);
      toast({
        title: "Error",
        description: "Failed to create your video. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEffectToggle = (effect: string) => {
    setSelectedEffects(prev => 
      prev.includes(effect)
        ? prev.filter(e => e !== effect)
        : [...prev, effect]
    );
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
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
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-semibold mb-1">AI Video Creator</h1>
          <p className="text-muted-foreground">Generate engaging videos for social media</p>
        </div>
        <Button 
          onClick={() => setIsCreateDialogOpen(true)}
          className="flex items-center space-x-2"
        >
          <Plus size={18} />
          <span>Create New Video</span>
        </Button>
      </div>

      <Tabs defaultValue="videos" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="videos">Your Videos</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="videos" className="space-y-6">
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
                      <span className={`text-xs px-2 py-1 rounded ${
                        content.status === 'completed' ? 'bg-green-100 text-green-800' : 
                        content.status === 'processing' ? 'bg-blue-100 text-blue-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {content.status.charAt(0).toUpperCase() + content.status.slice(1)}
                      </span>
                      <div className="flex items-center">
                        <Link to={`/editor?id=${content.id}`} className="text-primary text-sm flex items-center">
                          Edit <ArrowRight className="ml-1 h-4 w-4" />
                        </Link>
                      </div>
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
              <h3 className="text-lg font-medium mb-2">No videos yet</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Create your first AI-generated video by clicking the button below.
              </p>
              <button 
                onClick={() => setIsCreateDialogOpen(true)}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <Plus size={18} />
                <span>Create New Video</span>
              </button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="templates" className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "TikTok Vertical", icon: <Video className="h-5 w-5 text-white" />, aspectRatio: "9:16" },
              { name: "Instagram Reels", icon: <Video className="h-5 w-5 text-white" />, aspectRatio: "9:16" },
              { name: "YouTube Shorts", icon: <Video className="h-5 w-5 text-white" />, aspectRatio: "9:16" },
              { name: "Facebook Square", icon: <Video className="h-5 w-5 text-white" />, aspectRatio: "1:1" },
              { name: "Facebook Landscape", icon: <Video className="h-5 w-5 text-white" />, aspectRatio: "16:9" },
              { name: "Product Demo", icon: <Sparkles className="h-5 w-5 text-white" /> },
            ].map((template, i) => (
              <Card 
                key={i} 
                className="border rounded-lg p-5 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => {
                  setIsCreateDialogOpen(true);
                  if (template.aspectRatio) {
                    setAspectRatio(template.aspectRatio as '9:16' | '1:1' | '16:9');
                  }
                }}
              >
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-md bg-primary flex items-center justify-center mr-3">
                    {template.icon}
                  </div>
                  <h3 className="font-medium">{template.name}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Create optimized videos for {template.name} with our AI templates.
                </p>
                <button className="text-primary text-sm flex items-center">
                  Use Template <ArrowRight className="ml-1 h-4 w-4" />
                </button>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Video Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[900px]">
          <DialogHeader>
            <DialogTitle>Create AI Video</DialogTitle>
            <DialogDescription>
              Generate an engaging video for social media by entering your script and selecting options.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleCreateVideo} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Video Title</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a title for your video"
                  required
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Video Script</label>
                <Textarea 
                  placeholder="Enter your video script here..."
                  className="h-[200px]"
                  value={scriptText}
                  onChange={(e) => setScriptText(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Platform</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'instagram', label: 'Instagram Reels' },
                    { id: 'tiktok', label: 'TikTok' },
                    { id: 'youtube', label: 'YouTube Shorts' },
                    { id: 'facebook', label: 'Facebook' }
                  ].map((p) => (
                    <button
                      type="button"
                      key={p.id}
                      className={`py-2 px-3 text-sm rounded-md border ${
                        platform === p.id 
                          ? 'bg-primary text-white border-primary' 
                          : 'hover:bg-secondary transition-colors'
                      }`}
                      onClick={() => setPlatform(p.id as any)}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Aspect Ratio</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: '9:16', label: 'Vertical (9:16)' },
                    { id: '1:1', label: 'Square (1:1)' },
                    { id: '16:9', label: 'Landscape (16:9)' }
                  ].map((option) => (
                    <button
                      type="button"
                      key={option.id}
                      className={`py-2 px-3 text-sm rounded-md border ${
                        aspectRatio === option.id
                          ? 'bg-primary text-white border-primary' 
                          : 'hover:bg-secondary transition-colors'
                      }`}
                      onClick={() => setAspectRatio(option.id as any)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Effects</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'subtitles', label: 'Subtitles' },
                    { id: 'avatar', label: 'AI Avatar' },
                    { id: 'music', label: 'Background Music' },
                    { id: 'animations', label: 'Text Animations' }
                  ].map((effect) => (
                    <button
                      type="button"
                      key={effect.id}
                      className={`py-2 px-3 text-sm rounded-md border flex items-center justify-center ${
                        selectedEffects.includes(effect.id)
                          ? 'bg-primary text-white border-primary' 
                          : 'hover:bg-secondary transition-colors'
                      }`}
                      onClick={() => handleEffectToggle(effect.id)}
                    >
                      {effect.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gray-100 rounded-lg aspect-[9/16] relative overflow-hidden flex items-center justify-center">
                {isGenerating ? (
                  <div className="text-center">
                    <Loader2 className="h-12 w-12 text-gray-400 animate-spin mx-auto" />
                    <p className="mt-2 text-gray-500">Generating video...</p>
                  </div>
                ) : generatedVideo ? (
                  <div className="absolute inset-0 bg-black">
                    <img 
                      src={generatedVideo.previewUrl} 
                      alt="Video preview" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="text-center p-4">
                    <Video className="h-12 w-12 mx-auto text-gray-400" />
                    <p className="mt-2 text-gray-500">Video preview will appear here</p>
                  </div>
                )}
              </div>
              
              <Button
                type="submit"
                disabled={isGenerating || !title || !scriptText}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Video
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
