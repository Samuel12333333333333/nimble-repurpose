
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Download, Share, Eye, Settings, ChevronLeft, Save, Sparkles } from 'lucide-react';
import { getContentById, updateContent } from '@/services/contentService';

const ContentEditor: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const contentId = searchParams.get('id');
  
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [clips, setClips] = useState<any[]>([]);
  
  useEffect(() => {
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
  
  const handleGenerate = () => {
    toast({
      title: "Content Generated",
      description: "Your clips have been successfully generated.",
    });
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

  if (!content) {
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
            <h1 className="text-lg font-medium">{content.title}</h1>
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

      <main className="container py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg border overflow-hidden">
              <div className="aspect-video bg-gray-100 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-black/70 rounded-full flex items-center justify-center cursor-pointer hover:bg-black/80 transition-colors">
                    <Play className="h-6 w-6 text-white ml-1" />
                  </div>
                </div>
              </div>
              
              <div className="p-4 border-t">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-medium">Original {content.content_type.charAt(0).toUpperCase() + content.content_type.slice(1)}</h2>
                  <div className="flex items-center space-x-2">
                    <a href={content.source_url} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-md hover:bg-secondary transition-colors">
                      <Eye className="h-4 w-4" />
                    </a>
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
                <h2 className="font-medium">AI Generated Clips</h2>
              </div>
              
              <div className="p-4">
                <div className="flex space-x-4 overflow-x-auto pb-4">
                  {clips.length > 0 ? (
                    clips.map((clip, index) => (
                      <div key={clip.id || index} className="w-64 flex-shrink-0">
                        <div className="aspect-video bg-gray-100 rounded-md mb-2 relative">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Play className="h-5 w-5 text-white" />
                          </div>
                          <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                            0:15
                          </div>
                        </div>
                        <h3 className="text-sm font-medium truncate">Clip {index + 1}</h3>
                        <p className="text-xs text-muted-foreground">
                          Generated for {clip.output_type.charAt(0).toUpperCase() + clip.output_type.slice(1)}
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
                    <span className="text-sm text-muted-foreground">Generate More Clips</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white rounded-lg border overflow-hidden">
              <div className="p-4 border-b">
                <h2 className="font-medium">AI Generation Settings</h2>
              </div>
              
              <div className="p-4 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Platform</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['TikTok', 'Instagram', 'YouTube'].map((platform) => (
                      <button
                        key={platform}
                        className={`py-1.5 text-sm rounded-md border text-center ${
                          platform === 'TikTok' 
                            ? 'bg-primary text-white border-primary' 
                            : 'hover:bg-secondary transition-colors'
                        }`}
                      >
                        {platform}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Content Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Key Points', 'Highlights', 'Tutorial', 'Quotes'].map((type, i) => (
                      <button
                        key={type}
                        className={`py-1.5 text-sm rounded-md border text-center ${
                          i === 0
                            ? 'bg-primary text-white border-primary' 
                            : 'hover:bg-secondary transition-colors'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="clips" className="text-sm font-medium flex justify-between">
                    <span>Number of Clips</span>
                    <span className="text-primary">3</span>
                  </label>
                  <input
                    id="clips"
                    type="range"
                    min="1"
                    max="10"
                    defaultValue="3"
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>1</span>
                    <span>5</span>
                    <span>10</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="duration" className="text-sm font-medium flex justify-between">
                    <span>Max Duration</span>
                    <span className="text-primary">15s</span>
                  </label>
                  <input
                    id="duration"
                    type="range"
                    min="5"
                    max="60"
                    defaultValue="15"
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>5s</span>
                    <span>30s</span>
                    <span>60s</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Add Captions</label>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="captions" className="rounded border-gray-300" checked readOnly />
                    <label htmlFor="captions" className="text-sm">Enable automatic captions</label>
                  </div>
                </div>
                
                <button
                  onClick={handleGenerate}
                  className="w-full py-2 mt-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors flex items-center justify-center"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate
                </button>
              </div>
            </div>
            
            <div className="bg-white rounded-lg border overflow-hidden">
              <div className="p-4 border-b">
                <h2 className="font-medium">Transcript</h2>
              </div>
              
              <div className="p-4 space-y-4 h-[300px] overflow-y-auto">
                {content.transcript ? (
                  <p className="text-sm leading-relaxed">{content.transcript}</p>
                ) : (
                  <>
                    <p className="text-sm leading-relaxed">
                      Welcome to our summer marketing campaign video. Today we're going to explore the key strategies that will help your business thrive during the busy summer season.
                    </p>
                    <p className="text-sm leading-relaxed">
                      First, let's talk about social media engagement. Studies show that user activity increases by 23% during summer months, especially on platforms like Instagram and TikTok.
                    </p>
                    <p className="text-sm leading-relaxed">
                      Second, seasonal promotions are essential. Limited-time offers create urgency and can boost conversion rates by up to 30%.
                    </p>
                    <p className="text-sm leading-relaxed">
                      Finally, don't forget about local partnerships. Collaborating with complementary businesses can help you reach new audiences and create memorable experiences for your customers.
                    </p>
                    <p className="text-sm leading-relaxed">
                      By implementing these strategies, you'll be well-positioned to make the most of the summer season and drive meaningful growth for your business.
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContentEditor;
