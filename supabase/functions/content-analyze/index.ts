
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
      systemPrompt += " Extract key points, summarize, and suggest 3-5 viral video clips from this video content. For each clip suggestion, provide a title, timestamp (if available), and brief description of what should be included in the clip. Format your response as structured JSON with an array of clip objects.";
    } else if (contentType === "audio") {
      systemPrompt += " Extract key points, summarize, and suggest 3-5 viral audio clips from this podcast or audio content. For each clip suggestion, provide a title, timestamp (if available), and brief description of what should be included in the clip. Format your response as structured JSON with an array of clip objects.";
    } else if (contentType === "text") {
      systemPrompt += " Extract key points, summarize, and suggest 3-5 viral quotes from this article or text content. For each quote suggestion, provide a title and the exact quote text. Format your response as structured JSON with an array of quote objects.";
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
        maxOutputTokens: 1024,
        responseMimeType: "application/json"
      }
    };

    console.log("Sending request to Gemini API with system prompt:", systemPrompt);
    
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

    let processedResponse;
    try {
      // Try to find and parse any JSON in the response
      const responseText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      console.log("Raw response text:", responseText);
      
      // Attempt to extract JSON from the text
      let jsonStr = responseText;
      
      // Find JSON-like pattern if it's embedded in text
      const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/) || 
                        responseText.match(/\{[\s\S]*\}/) ||
                        responseText.match(/\[[\s\S]*\]/);
      
      if (jsonMatch) {
        jsonStr = jsonMatch[0].replace(/```json|```/g, '').trim();
      }
      
      // Parse the JSON
      processedResponse = {
        rawAnalysis: responseText,
        suggestedClips: JSON.parse(jsonStr)
      };
    } catch (jsonError) {
      console.error("Error parsing JSON from response:", jsonError);
      // Fallback to raw text if JSON parsing fails
      processedResponse = {
        rawAnalysis: data?.candidates?.[0]?.content?.parts?.[0]?.text || "",
        suggestedClips: []
      };
    }

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
