
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// WebSocket implementation for Runway API
class RunwayService {
  private ws: WebSocket | null = null;
  private apiKey: string;
  private messageCallbacks: Map<string, (data: any) => void> = new Map();
  private isConnected: boolean = false;
  private connectionPromise: Promise<void> | null = null;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.connectionPromise = this.connect();
  }

  private connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket("wss://ws-api.runware.ai/v1");
        
        this.ws.onopen = () => {
          console.log("WebSocket connected");
          this.authenticate().then(resolve).catch(reject);
        };

        this.ws.onmessage = (event) => {
          console.log("WebSocket message received:", event.data);
          const response = JSON.parse(event.data);
          
          if (response.error || response.errors) {
            console.error("WebSocket error response:", response);
            const errorMessage = response.errorMessage || response.errors?.[0]?.message || "An error occurred";
            reject(new Error(errorMessage));
            return;
          }

          if (response.data) {
            response.data.forEach((item: any) => {
              if (item.taskType === "authentication") {
                console.log("Authentication successful");
                this.isConnected = true;
              } else {
                const callback = this.messageCallbacks.get(item.taskUUID);
                if (callback) {
                  callback(item);
                  this.messageCallbacks.delete(item.taskUUID);
                }
              }
            });
          }
        };

        this.ws.onerror = (error) => {
          console.error("WebSocket error:", error);
          reject(error);
        };

        this.ws.onclose = () => {
          console.log("WebSocket closed");
          this.isConnected = false;
        };
      } catch (error) {
        console.error("Error creating WebSocket:", error);
        reject(error);
      }
    });
  }

  private authenticate(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
        reject(new Error("WebSocket not ready for authentication"));
        return;
      }
      
      const authMessage = [{
        taskType: "authentication",
        apiKey: this.apiKey,
      }];
      
      console.log("Sending authentication message");
      
      // Set up authentication callback
      const authCallback = (event: MessageEvent) => {
        const response = JSON.parse(event.data);
        if (response.data?.[0]?.taskType === "authentication") {
          this.ws?.removeEventListener("message", authCallback);
          resolve();
        }
      };
      
      this.ws.addEventListener("message", authCallback);
      this.ws.send(JSON.stringify(authMessage));
    });
  }

  async generateVideoAnalysis(videoUrl: string): Promise<any> {
    // Wait for connection and authentication before proceeding
    await this.connectionPromise;

    if (!this.ws || this.ws.readyState !== WebSocket.OPEN || !this.isConnected) {
      this.connectionPromise = this.connect();
      await this.connectionPromise;
    }

    const taskUUID = crypto.randomUUID();
    
    return new Promise((resolve, reject) => {
      const message = [{
        taskType: "videoAnalysis",
        taskUUID,
        videoUrl: videoUrl,
        analysisDepth: "detailed",
        clipSuggestions: true,
        numberOfClips: 5,
      }];

      console.log("Sending video analysis request:", message);

      this.messageCallbacks.set(taskUUID, (data) => {
        if (data.error) {
          reject(new Error(data.errorMessage));
        } else {
          resolve(data);
        }
      });

      this.ws.send(JSON.stringify(message));
    });
  }
  
  async generateVideo(scriptText: string, options: {
    platform: string;
    aspectRatio: string;
    effects: string[];
    voiceStyle?: string;
    musicStyle?: string;
    subtitlesEnabled?: boolean;
    avatarEnabled?: boolean;
  }): Promise<any> {
    // Wait for connection and authentication before proceeding
    await this.connectionPromise;

    if (!this.ws || this.ws.readyState !== WebSocket.OPEN || !this.isConnected) {
      this.connectionPromise = this.connect();
      await this.connectionPromise;
    }

    const taskUUID = crypto.randomUUID();
    
    let width = 1080;
    let height = 1920; // Default vertical 9:16

    if (options.aspectRatio === "1:1") {
      width = 1080;
      height = 1080;
    } else if (options.aspectRatio === "16:9") {
      width = 1920;
      height = 1080;
    }

    return new Promise((resolve, reject) => {
      // For now, we'll create a simulation response since the actual Runway API may not directly
      // support this specific video generation with all these options
      
      const message = [{
        taskType: "videoGeneration",
        taskUUID,
        script: scriptText,
        width,
        height,
        effectOptions: {
          subtitles: options.subtitlesEnabled || false,
          avatars: options.avatarEnabled || false,
          voiceStyle: options.voiceStyle || "default",
          musicStyle: options.musicStyle || "default",
          effects: options.effects || []
        }
      }];

      console.log("Sending video generation request:", message);

      // Simulate response until full API integration is complete
      setTimeout(() => {
        const simulatedResponse = {
          videoUrl: "https://example.com/generated-video.mp4",
          previewUrl: "https://example.com/video-preview.jpg",
          generationId: taskUUID,
          platform: options.platform,
          aspectRatio: options.aspectRatio,
          effects: options.effects
        };
        resolve(simulatedResponse);
      }, 2000);

      // Comment out the actual send until API supports these features
      // this.ws.send(JSON.stringify(message));
      
      // This would be the actual implementation once the API supports these features
      /*
      this.messageCallbacks.set(taskUUID, (data) => {
        if (data.error) {
          reject(new Error(data.errorMessage));
        } else {
          resolve(data);
        }
      });
      
      this.ws.send(JSON.stringify(message));
      */
    });
  }
  
  // Mock implementation for text content
  async analyzeTextContent(text: string): Promise<any> {
    // For text content, we'll create a simulated response
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const suggestedClips = [
      {
        title: "Key Insight #1",
        description: "Important point from the beginning of the text",
        timestamp: "00:00",
        duration: 15
      },
      {
        title: "Primary Argument",
        description: "The central argument of the content",
        timestamp: "00:15",
        duration: 20
      },
      {
        title: "Supporting Example",
        description: "An example that reinforces the main point",
        timestamp: "00:35",
        duration: 15
      }
    ];
    
    return {
      suggestedClips,
      rawAnalysis: `Analysis of text: ${text.substring(0, 100)}...`
    };
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RUNWAY_API_KEY = Deno.env.get("RUNWAY_API_KEY");
    if (!RUNWAY_API_KEY) {
      throw new Error("RUNWAY_API_KEY is not set");
    }

    const requestData = await req.json();
    const { content, contentType, sourceUrl, scriptText, videoOptions } = requestData;

    // Handle video generation request
    if (scriptText && videoOptions) {
      console.log(`Generating video from script with Runway API`);
      
      const runwayService = new RunwayService(RUNWAY_API_KEY);
      const generationResult = await runwayService.generateVideo(scriptText, videoOptions);
      
      return new Response(JSON.stringify(generationResult), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Handle content analysis request
    if (!content && !sourceUrl) {
      return new Response(
        JSON.stringify({ error: "Content or source URL is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log(`Processing ${contentType} content with Runway API`);
    
    const runwayService = new RunwayService(RUNWAY_API_KEY);
    let analysisResult;
    
    if (contentType === "video") {
      analysisResult = await runwayService.generateVideoAnalysis(sourceUrl || content);
    } else if (contentType === "text") {
      analysisResult = await runwayService.analyzeTextContent(content);
    } else {
      // For now, handle audio similar to text
      analysisResult = await runwayService.analyzeTextContent(content);
    }
    
    // Process and format the response
    const processedResponse = {
      rawAnalysis: analysisResult.rawAnalysis || "Analysis complete",
      suggestedClips: analysisResult.suggestedClips || []
    };

    return new Response(JSON.stringify(processedResponse), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error processing request:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
