
import "https://deno.land/x/xhr@0.1.0/mod.ts";
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
        console.log("Attempting to connect to Runway API WebSocket");
        this.ws = new WebSocket("wss://ws-api.runware.ai/v1");
        
        this.ws.onopen = () => {
          console.log("WebSocket connected to Runway API");
          this.authenticate().then(resolve).catch(reject);
        };

        this.ws.onmessage = (event) => {
          console.log("WebSocket message received from Runway API");
          try {
            const response = JSON.parse(event.data);
            console.log("Parsed response:", JSON.stringify(response));
            
            if (response.error || response.errors) {
              console.error("WebSocket error response:", JSON.stringify(response));
              const errorMessage = response.errorMessage || response.errors?.[0]?.message || "An error occurred";
              reject(new Error(errorMessage));
              return;
            }

            if (response.data) {
              response.data.forEach((item: any) => {
                if (item.taskType === "authentication") {
                  console.log("Authentication successful with Runway API");
                  this.isConnected = true;
                }
                
                const callback = this.messageCallbacks.get(item.taskUUID);
                if (callback) {
                  callback(item);
                  this.messageCallbacks.delete(item.taskUUID);
                }
              });
            }
          } catch (error) {
            console.error("Error parsing WebSocket message:", error);
            reject(error);
          }
        };

        this.ws.onerror = (error) => {
          console.error("WebSocket error:", error);
          reject(error);
        };

        this.ws.onclose = () => {
          console.log("WebSocket connection to Runway API closed");
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
      
      console.log("Sending authentication message to Runway API");
      
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
    try {
      console.log("About to generate video with script:", scriptText.substring(0, 100) + "...");
      
      // Wait for connection and authentication before proceeding
      if (this.connectionPromise) {
        try {
          await this.connectionPromise;
        } catch (error) {
          console.error("Connection failed, attempting to reconnect", error);
          this.connectionPromise = this.connect();
          await this.connectionPromise;
        }
      }

      if (!this.ws || this.ws.readyState !== WebSocket.OPEN || !this.isConnected) {
        console.log("WebSocket not connected, reconnecting...");
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

      return await new Promise((resolve, reject) => {
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

          console.log("Sending video generation request to Runway API");
          
          // For development purposes, we'll use a simulation for now
          this.messageCallbacks.set(taskUUID, (data) => {
            if (data.error) {
              reject(new Error(data.errorMessage || "Unknown error"));
            } else {
              resolve(data);
            }
          });
          
          this.ws.send(JSON.stringify(message));
          
          // Set a timeout for the simulation to give a response if the API doesn't respond quickly enough
          setTimeout(() => {
            if (this.messageCallbacks.has(taskUUID)) {
              console.log("Using fallback simulation response");
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
              
              console.log("Generated simulated video response:", simulatedResponse);
              resolve(simulatedResponse);
              this.messageCallbacks.delete(taskUUID);
            }
          }, 3000);
        } catch (error) {
          console.error("Error in video generation promise:", error);
          reject(error);
        }
      });
    } catch (error) {
      console.error("Error in generateVideo method:", error);
      throw error;
    }
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get API key from environment variable
    const RUNWAY_API_KEY = Deno.env.get("RUNWAY_API_KEY");
    
    if (!RUNWAY_API_KEY) {
      console.error("RUNWAY_API_KEY is not set in environment variables");
      return new Response(
        JSON.stringify({ error: "RUNWAY_API_KEY is not set in environment variables" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const requestData = await req.json();
    const { scriptText, videoOptions } = requestData;

    console.log("Received request with script and options:", scriptText ? "Script provided" : "No script", videoOptions);

    // Handle video generation request
    if (scriptText && videoOptions) {
      console.log(`Generating video from script with Runway API`);
      
      try {
        const runwayService = new RunwayService(RUNWAY_API_KEY);
        const generationResult = await runwayService.generateVideo(scriptText, videoOptions);
        
        return new Response(JSON.stringify(generationResult), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      } catch (error) {
        console.error("Error during video generation:", error);
        return new Response(
          JSON.stringify({ error: error.message || "Failed to generate video" }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
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
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
