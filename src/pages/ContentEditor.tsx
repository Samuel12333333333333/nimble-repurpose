
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, 
  Download, 
  Share, 
  Eye, 
  Settings, 
  ChevronLeft, 
  Save, 
  Sparkles,
  FileVideo,
  Type,
  Music,
  MessageSquare,
  Image
} from 'lucide-react';
import { 
  getContentById, 
  updateContent, 
  generateVideoFromScript, 
  VideoGenerationOptions
} from '@/services/contentService';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';

const ContentEditor: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const contentId = searchParams.get('id');
  
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [clips, setClips] = useState<any[]>([]);

  // Video generation state
  const [scriptText, setScriptText] = useState<string>('');
  const [platform, setPlatform] = useState<'instagram' | 'tiktok' | 'youtube' | 'facebook'>('instagram');
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '1:1' | '16:9'>('9:16');
  const [selectedEffects, setSelectedEffects] = useState<string[]>(['subtitles']);
  const [voiceStyle, setVoiceStyle] = useState<string>('default');
  const [musicStyle, setMusicStyle] = useState<string>('upbeat');
  const [subtitlesEnabled, setSubtitlesEnabled] = useState<boolean>(true);
  const [avatarEnabled, setAvatarEnabled] = useState<boolean>(false);
  
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedVideo, setGeneratedVideo] = useState<any>(null);
  const [showNewVideoDialog, setShowNewVideoDialog] = useState<boolean>(false);
  
  // Effect to check if we are in creation mode (no content ID)
  useEffect(() => {
    if (!contentId) {
      setLoading(false);
      setShowNewVideoDialog(true);
      return;
    }
    
    const fetchContent = async () => {
      if (!contentId) {
        toast({
          title: "Error",
          description: "No content ID provided.",
          variant: "destructive",
        });
        navigate('/dashboard');
        return;
      }
      
      setLoading(true);
      try {
        const contentData = await getContentById(contentId);
        if (!contentData) {
          throw new Error("Content not found");
        }
        
        setContent(contentData);
        setClips(contentData.outputs || []);
      } catch (error) {
        console.error('Error fetching content:', error);
        toast({
          title: "Error",
          description: "Failed to load content. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchContent();
  }, [contentId, navigate, toast]);
  
  const handleGenerate = async () => {
    if (!scriptText.trim()) {
      toast({
        title: "Missing Script",
        description: "Please enter a script for your video.",
        variant: "destructive",
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const videoOptions: VideoGenerationOptions = {
        platform,
        aspectRatio,
        effects: selectedEffects,
        voiceStyle,
        musicStyle,
        subtitlesEnabled,
        avatarEnabled
      };
      
      const result = await generateVideoFromScript(scriptText, videoOptions);
      
      setGeneratedVideo(result);
      
      toast({
        title: "Video Generated",
        description: "Your video has been successfully generated.",
      });
    } catch (error) {
      console.error('Error generating video:', error);
      toast({
        title: "Generation Failed",
        description: "There was an error generating your video. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleSave = () => {
    toast({
      title: "Project Saved",
      description: "Your project has been saved successfully.",
    });
  };
  
  const handlePublish = () => {
    toast({
      title: "Ready to Publish",
      description: "Your content is ready to be published.",
    });
  };
  
  const handleEffectToggle = (effect: string) => {
    setSelectedEffects(prev => 
      prev.includes(effect)
        ? prev.filter(e => e !== effect)
        : [...prev, effect]
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 bg-primary/10 rounded-full mb-4"></div>
          <div className="h-4 w-48 bg-secondary rounded"></div>
        </div>
      </div>
    );
  }

  if (!content && !showNewVideoDialog) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-medium mb-2">Content Not Found</h2>
          <p className="text-muted-foreground mb-4">The content you're looking for doesn't exist or has been removed.</p>
          <Link to="/dashboard" className="text-primary hover:underline">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link to="/dashboard" className="flex items-center text-sm font-medium mr-4">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </Link>
          
          <div className="flex-1 flex justify-center">
            <h1 className="text-lg font-medium">{content?.title || "New Video"}</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <button 
              onClick={handleSave}
              className="flex items-center px-3 py-1.5 text-sm rounded-md hover:bg-secondary transition-colors"
            >
              <Save className="h-4 w-4 mr-1.5" />
              Save
            </button>
            
            <button 
              onClick={handlePublish}
              className="flex items-center px-3 py-1.5 text-sm bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              <Share className="h-4 w-4 mr-1.5" />
              Publish
            </button>
          </div>
        </div>
      </header>

      {/* New Video Creation Dialog */}
      <Dialog open={showNewVideoDialog} onOpenChange={setShowNewVideoDialog}>
        <DialogContent className="sm:max-w-[900px]">
          <DialogHeader>
            <DialogTitle>Create New Video</DialogTitle>
            <DialogDescription>
              Enter your script and choose video settings to generate a new video.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Video Script</label>
                <Textarea 
                  placeholder="Enter your video script here..."
                  className="h-[200px]"
                  value={scriptText}
                  onChange={(e) => setScriptText(e.target.value)}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Platform</label>
                <div className="grid grid-cols-4 gap-2">
                  {['instagram', 'tiktok', 'youtube', 'facebook'].map((p) => (
                    <button
                      key={p}
                      className={`py-2 px-3 text-sm capitalize rounded-md border ${
                        platform === p 
                          ? 'bg-primary text-white border-primary' 
                          : 'hover:bg-secondary transition-colors'
                      }`}
                      onClick={() => setPlatform(p as any)}
                    >
                      {p}
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
                    { id: 'subtitles', label: 'Subtitles', icon: <Type className="h-4 w-4 mr-1.5" /> },
                    { id: 'avatar', label: 'AI Avatar', icon: <Image className="h-4 w-4 mr-1.5" /> },
                    { id: 'music', label: 'Background Music', icon: <Music className="h-4 w-4 mr-1.5" /> },
                    { id: 'animations', label: 'Text Animations', icon: <MessageSquare className="h-4 w-4 mr-1.5" /> }
                  ].map((effect) => (
                    <button
                      key={effect.id}
                      className={`py-2 px-3 text-sm rounded-md border flex items-center ${
                        selectedEffects.includes(effect.id)
                          ? 'bg-primary text-white border-primary' 
                          : 'hover:bg-secondary transition-colors'
                      }`}
                      onClick={() => handleEffectToggle(effect.id)}
                    >
                      {effect.icon}
                      {effect.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-gray-100 rounded-lg aspect-[9/16] relative overflow-hidden flex items-center justify-center">
                {isGenerating ? (
                  <div className="animate-pulse">
                    <FileVideo className="h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">Generating video...</p>
                  </div>
                ) : generatedVideo ? (
                  <div className="absolute inset-0 bg-black">
                    <img 
                      src={generatedVideo.previewUrl || "https://placehold.co/1080x1920/jpeg?text=Video+Preview"} 
                      alt="Video preview" 
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-black/60 rounded-full flex items-center justify-center cursor-pointer hover:bg-black/80 transition-colors">
                        <Play className="h-6 w-6 text-white ml-1" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-4">
                    <FileVideo className="h-12 w-12 mx-auto text-gray-400" />
                    <p className="mt-2 text-gray-500">Video preview will appear here after generation</p>
                  </div>
                )}
              </div>
              
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !scriptText.trim()}
                className={`w-full py-3 ${
                  isGenerating || !scriptText.trim()
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-primary hover:bg-primary/90'
                } text-white rounded-md transition-colors flex items-center justify-center`}
              >
                {isGenerating ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Video
                  </>
                )}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Main Content Area - Only shown if content exists or after video generation */}
      {(!showNewVideoDialog || generatedVideo) && (
        <main className="container py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg border overflow-hidden">
                <div className="aspect-video bg-gray-100 relative">
                  {content?.content_type === 'video' ? (
                    <iframe 
                      className="absolute inset-0 w-full h-full"
                      src={content.source_url.includes('youtube.com') 
                        ? content.source_url.replace('/watch?v=', '/embed/') 
                        : content.source_url}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : generatedVideo ? (
                    <div className="absolute inset-0 bg-black">
                      <img 
                        src={generatedVideo.previewUrl || "https://placehold.co/1080x1920/jpeg?text=Video+Preview"} 
                        alt="Video preview" 
                        className="w-full h-full object-contain"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-black/60 rounded-full flex items-center justify-center cursor-pointer hover:bg-black/80 transition-colors">
                          <Play className="h-6 w-6 text-white ml-1" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-black/70 rounded-full flex items-center justify-center cursor-pointer hover:bg-black/80 transition-colors">
                        <Play className="h-6 w-6 text-white ml-1" />
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="p-4 border-t">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="font-medium">
                      {generatedVideo 
                        ? `Generated ${generatedVideo.platform.charAt(0).toUpperCase() + generatedVideo.platform.slice(1)} Video`
                        : content ? 
                          `Original ${content.content_type.charAt(0).toUpperCase() + content.content_type.slice(1)}`
                          : "Generated Video"
                      }
                    </h2>
                    <div className="flex items-center space-x-2">
                      {content && (
                        <a href={content.source_url} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-md hover:bg-secondary transition-colors">
                          <Eye className="h-4 w-4" />
                        </a>
                      )}
                      <button className="p-1.5 rounded-md hover:bg-secondary transition-colors">
                        <Download className="h-4 w-4" />
                      </button>
                      <button className="p-1.5 rounded-md hover:bg-secondary transition-colors">
                        <Settings className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="h-1.5 bg-gray-100 rounded-full relative">
                      <div className="absolute left-0 top-0 h-full w-1/3 bg-primary rounded-full"></div>
                      <div className="absolute h-3 w-3 bg-primary rounded-full top-1/2 left-1/3 transform -translate-y-1/2 -translate-x-1/2"></div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>0:35</span>
                      <span>2:14</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg border overflow-hidden">
                <div className="p-4 border-b">
                  <h2 className="font-medium">Generated Videos</h2>
                </div>
                
                <div className="p-4">
                  <div className="flex space-x-4 overflow-x-auto pb-4">
                    {/* Generated video or clips */}
                    {generatedVideo ? (
                      <div className="w-64 flex-shrink-0">
                        <div className="aspect-video bg-gray-100 rounded-md mb-2 relative">
                          <img 
                            src={generatedVideo.previewUrl || "https://placehold.co/1080x1920/jpeg?text=Video+Preview"} 
                            alt="Video preview" 
                            className="w-full h-full object-cover rounded-md"
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Play className="h-5 w-5 text-white" />
                          </div>
                          <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                            {generatedVideo.aspectRatio}
                          </div>
                        </div>
                        <h3 className="text-sm font-medium truncate">{generatedVideo.platform} Video</h3>
                        <p className="text-xs text-muted-foreground truncate">
                          Generated video with {generatedVideo.effects.join(", ")} effects
                        </p>
                      </div>
                    ) : clips.length > 0 ? (
                      clips.map((clip, index) => (
                        <div key={clip.id || index} className="w-64 flex-shrink-0">
                          <div className="aspect-video bg-gray-100 rounded-md mb-2 relative">
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Play className="h-5 w-5 text-white" />
                            </div>
                            <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                              {clip.duration ? `${Math.floor(clip.duration)}s` : (clip.timestamp || '0:15')}
                            </div>
                          </div>
                          <h3 className="text-sm font-medium truncate">{clip.title || `Clip ${index + 1}`}</h3>
                          <p className="text-xs text-muted-foreground truncate">
                            {clip.description || `Generated for ${clip.output_type.charAt(0).toUpperCase() + clip.output_type.slice(1)}`}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="w-full text-center py-8">
                        <p className="text-muted-foreground">No clips generated yet. Click "Generate" to create clips.</p>
                      </div>
                    )}
                    
                    <div className="w-64 flex-shrink-0 border border-dashed rounded-md flex flex-col items-center justify-center p-4 cursor-pointer hover:border-primary transition-colors">
                      <Sparkles className="h-6 w-6 text-muted-foreground mb-2" />
                      <span className="text-sm text-muted-foreground">Generate More Videos</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white rounded-lg border overflow-hidden">
                <div className="p-4 border-b">
                  <h2 className="font-medium">Video Generation Settings</h2>
                </div>
                
                <div className="p-4 space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Platform</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'instagram', label: 'Instagram' },
                        { id: 'tiktok', label: 'TikTok' },
                        { id: 'youtube', label: 'YouTube' },
                        { id: 'facebook', label: 'Facebook' }
                      ].map((p) => (
                        <button
                          key={p.id}
                          className={`py-1.5 text-sm rounded-md border text-center ${
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
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Aspect Ratio</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: '9:16', label: 'Vertical (9:16)' },
                        { id: '1:1', label: 'Square (1:1)' },
                        { id: '16:9', label: 'Landscape (16:9)' }
                      ].map((option) => (
                        <button
                          key={option.id}
                          className={`py-1.5 text-sm rounded-md border text-center ${
                            aspectRatio === option.id
                              ? 'bg-primary text-white border-primary' 
                              : 'hover:bg-secondary transition-colors'
                          }`}
                          onClick={() => setAspectRatio(option.id as any)}
                        >
                          {option.id}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Effects</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'subtitles', label: 'Subtitles' },
                        { id: 'avatar', label: 'AI Avatar' },
                        { id: 'music', label: 'Music' },
                        { id: 'animations', label: 'Animations' }
                      ].map((effect) => (
                        <button
                          key={effect.id}
                          className={`py-1.5 text-sm rounded-md border text-center ${
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
                  
                  <div>
                    <label className="text-sm font-medium">Script</label>
                    <Textarea
                      className="mt-1"
                      placeholder="Enter your video script here..."
                      value={scriptText}
                      onChange={(e) => setScriptText(e.target.value)}
                    />
                  </div>
                  
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating || !scriptText.trim()}
                    className={`w-full py-2 mt-2 ${
                      isGenerating || !scriptText.trim()
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-primary hover:bg-primary/90'
                    } text-white rounded-md transition-colors flex items-center justify-center`}
                  >
                    {isGenerating ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Generate
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  );
};

export default ContentEditor;
