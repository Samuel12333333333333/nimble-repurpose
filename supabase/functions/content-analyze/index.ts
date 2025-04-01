
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
              }
              
              const callback = this.messageCallbacks.get(item.taskUUID);
              if (callback) {
                callback(item);
                this.messageCallbacks.delete(item.taskUUID);
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
      const authCallback = (data: any) => {
        if (data.taskType === "authentication") {
          resolve();
        }
      };
      
      this.messageCallbacks.set("authentication", authCallback);
      this.ws.send(JSON.stringify(authMessage));
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
      try {
        const message = [{
          taskType: "videoGeneration",
          taskUUID,
          script: scriptText,
          width,
          height,
          platform: options.platform,
          effectOptions: {
            subtitles: options.subtitlesEnabled || false,
            avatars: options.avatarEnabled || false,
            voiceStyle: options.voiceStyle || "default",
            musicStyle: options.musicStyle || "default",
            effects: options.effects || []
          }
        }];

        console.log("Sending video generation request:", JSON.stringify(message));

        // For development purposes, we'll simulate a response until full API integration
        setTimeout(() => {
          const videoUrl = `https://example.com/generated-video-${taskUUID}.mp4`;
          const previewUrl = `https://placehold.co/${width}x${height}/jpeg?text=Generated+${options.platform}+Video`;
          
          const simulatedResponse = {
            videoUrl,
            previewUrl,
            generationId: taskUUID,
            platform: options.platform,
            aspectRatio: options.aspectRatio,
            effects: options.effects
          };
          
          console.log("Generated video response:", simulatedResponse);
          resolve(simulatedResponse);
        }, 2000);
        
        // Uncomment this when the API fully supports these features
        /*
        this.messageCallbacks.set(taskUUID, (data) => {
          if (data.error) {
            reject(new Error(data.errorMessage));
          } else {
            const response = {
              videoUrl: data.videoUrl,
              previewUrl: data.previewUrl || `https://placehold.co/${width}x${height}/jpeg?text=Generated+${options.platform}+Video`,
              generationId: taskUUID,
              platform: options.platform,
              aspectRatio: options.aspectRatio,
              effects: options.effects
            };
            resolve(response);
          }
        });
        
        this.ws.send(JSON.stringify(message));
        */
      } catch (error) {
        console.error("Error generating video:", error);
        reject(error);
      }
    });
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
    const { scriptText, videoOptions } = requestData;

    // Handle video generation request
    if (scriptText && videoOptions) {
      console.log(`Generating video from script with Runway API`);
      
      const runwayService = new RunwayService(RUNWAY_API_KEY);
      const generationResult = await runwayService.generateVideo(scriptText, videoOptions);
      
      return new Response(JSON.stringify(generationResult), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ error: "Invalid request. Required parameters missing." }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
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
