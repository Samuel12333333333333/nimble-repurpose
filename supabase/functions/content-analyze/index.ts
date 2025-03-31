
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not set");
    }

    const requestData = await req.json();
    const { content, contentType } = requestData;

    if (!content) {
      return new Response(
        JSON.stringify({ error: "Content is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Different prompt based on content type
    let systemPrompt = "You are an AI content assistant that analyzes content and provides insights.";
    
    if (contentType === "video") {
      systemPrompt += " Extract key points, summarize, and suggest viral video clips from this video content.";
    } else if (contentType === "audio") {
      systemPrompt += " Extract key points, summarize, and suggest viral audio clips from this podcast or audio content.";
    } else if (contentType === "text") {
      systemPrompt += " Extract key points, summarize, and suggest viral quotes from this article or text content.";
    }

    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";
    
    const payload = {
      contents: [
        {
          parts: [
            {
              text: systemPrompt
            },
            {
              text: content
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024
      }
    };

    console.log("Sending request to Gemini API");
    
    const response = await fetch(`${url}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", errorText);
      throw new Error(`Gemini API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log("Received response from Gemini API");

    return new Response(JSON.stringify(data), {
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
