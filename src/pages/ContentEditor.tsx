
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { 
  Play, 
  Download, 
  Share, 
  ChevronLeft, 
  Save, 
  Sparkles,
  FileVideo,
  Type,
  Music,
  MessageSquare,
  Image,
  Loader2
} from 'lucide-react';
import { 
  getContentById, 
  updateContent,
  generateVideoFromScript,
  VideoGenerationOptions
} from '@/services/contentService';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const ContentEditor: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const contentId = searchParams.get('id');
  
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Video generation state
  const [scriptText, setScriptText] = useState<string>('');
  const [platform, setPlatform] = useState<'instagram' | 'tiktok' | 'youtube' | 'facebook'>('instagram');
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '1:1' | '16:9'>('9:16');
  const [selectedEffects, setSelectedEffects] = useState<string[]>(['subtitles']);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedVideo, setGeneratedVideo] = useState<any>(null);
  
  useEffect(() => {
    const fetchContent = async () => {
      if (!contentId) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        const contentData = await getContentById(contentId);
        if (!contentData) {
          throw new Error("Content not found");
        }
        
        setContent(contentData);
        setScriptText(contentData.transcript || '');
        
        // Set platform and aspect ratio based on first output if available
        if (contentData.outputs && contentData.outputs.length > 0) {
          const output = contentData.outputs[0];
          setPlatform(output.output_type as any);
          setAspectRatio(output.aspect_ratio as any || '9:16');
          setSelectedEffects(output.effects || ['subtitles']);
        }
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
  }, [contentId, toast]);
  
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
        subtitlesEnabled: selectedEffects.includes('subtitles'),
        avatarEnabled: selectedEffects.includes('avatar')
      };
      
      const result = await generateVideoFromScript(scriptText, videoOptions);
      
      setGeneratedVideo(result);
      
      // If we're editing existing content, update it
      if (contentId && content) {
        await updateContent(contentId, { 
          transcript: scriptText,
          status: 'completed'
        });
      }
      
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
    if (contentId && content) {
      updateContent(contentId, { 
        transcript: scriptText
      }).then(() => {
        toast({
          title: "Script Saved",
          description: "Your script has been saved successfully.",
        });
      }).catch(error => {
        console.error('Error saving script:', error);
        toast({
          title: "Save Failed",
          description: "Failed to save your script. Please try again.",
          variant: "destructive",
        });
      });
    }
  };
  
  const handleDownload = () => {
    if (generatedVideo?.videoUrl) {
      // Create a temporary anchor element
      const a = document.createElement('a');
      a.href = generatedVideo.videoUrl;
      a.download = `${content?.title || 'video'}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast({
        title: "Download Started",
        description: "Your video is being downloaded.",
      });
    } else {
      toast({
        title: "No Video Available",
        description: "Please generate a video first.",
        variant: "destructive",
      });
    }
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
              onClick={handleDownload}
              disabled={!generatedVideo?.videoUrl}
              className={`flex items-center px-3 py-1.5 text-sm rounded-md ${
                generatedVideo?.videoUrl 
                  ? 'bg-primary text-white hover:bg-primary/90' 
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              } transition-colors`}
            >
              <Download className="h-4 w-4 mr-1.5" />
              Download
            </button>
          </div>
        </div>
      </header>

      <main className="container py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Preview */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border overflow-hidden">
              <div className="aspect-video bg-gray-100 relative flex items-center justify-center">
                {isGenerating ? (
                  <div className="text-center">
                    <Loader2 className="h-12 w-12 text-gray-400 animate-spin mx-auto" />
                    <p className="mt-2 text-gray-500">Generating video...</p>
                  </div>
                ) : generatedVideo ? (
                  <div className="aspect-[9/16] relative h-full mx-auto overflow-hidden">
                    <img 
                      src={generatedVideo.previewUrl} 
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
            </div>

            {/* Script editor */}
            <div className="mt-6 bg-white rounded-lg border overflow-hidden p-4">
              <h2 className="font-medium mb-2">Video Script</h2>
              <Textarea 
                value={scriptText}
                onChange={(e) => setScriptText(e.target.value)}
                placeholder="Enter your video script here..."
                className="h-[150px]"
              />
            </div>
          </div>
          
          {/* Video Settings */}
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
                      { id: '9:16', label: 'Vertical' },
                      { id: '1:1', label: 'Square' },
                      { id: '16:9', label: 'Landscape' }
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
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Effects</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'subtitles', label: 'Subtitles', icon: <Type className="h-4 w-4 mr-1" /> },
                      { id: 'avatar', label: 'AI Avatar', icon: <Image className="h-4 w-4 mr-1" /> },
                      { id: 'music', label: 'Music', icon: <Music className="h-4 w-4 mr-1" /> },
                      { id: 'animations', label: 'Animations', icon: <MessageSquare className="h-4 w-4 mr-1" /> }
                    ].map((effect) => (
                      <button
                        key={effect.id}
                        className={`py-1.5 text-sm rounded-md border flex items-center justify-center ${
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
                
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !scriptText.trim()}
                  className={`w-full py-2 ${
                    isGenerating || !scriptText.trim()
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-primary hover:bg-primary/90'
                  } text-white rounded-md transition-colors flex items-center justify-center`}
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
                </button>
              </div>
            </div>
            
            {/* Video details */}
            <div className="bg-white rounded-lg border overflow-hidden">
              <div className="p-4 border-b">
                <h2 className="font-medium">Video Details</h2>
              </div>
              
              <div className="p-4 space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-1">Title</label>
                  <Input 
                    value={content?.title || ''} 
                    onChange={(e) => setContent({ ...content, title: e.target.value })}
                    placeholder="Video title" 
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium block mb-1">Video Statistics</label>
                  <div className="bg-gray-50 p-3 rounded-md text-sm">
                    {generatedVideo ? (
                      <ul className="space-y-1 text-sm">
                        <li><strong>Platform:</strong> {generatedVideo.platform}</li>
                        <li><strong>Aspect Ratio:</strong> {generatedVideo.aspectRatio}</li>
                        <li><strong>Effects:</strong> {generatedVideo.effects.join(", ") || "None"}</li>
                      </ul>
                    ) : (
                      <p className="text-gray-500">No video generated yet</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContentEditor;
