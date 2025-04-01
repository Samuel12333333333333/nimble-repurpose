
import { supabase } from '@/integrations/supabase/client';

export type Content = {
  id: string;
  title: string;
  content_type: 'video' | 'audio' | 'text';
  source_url: string;
  created_at: string;
  status: 'processing' | 'completed' | 'failed';
  user_id: string;
  outputs: ContentOutput[];
  transcript?: string;
};

export type ContentOutput = {
  id: string;
  content_id: string;
  output_type: 'tiktok' | 'instagram' | 'twitter' | 'newsletter' | 'youtube' | 'facebook';
  url: string;
  created_at: string;
  title?: string;
  description?: string;
  timestamp?: string;
  duration?: number;
  aspect_ratio?: string;
  effects?: string[];
};

export type VideoGenerationOptions = {
  platform: 'instagram' | 'tiktok' | 'youtube' | 'facebook';
  aspectRatio: '9:16' | '1:1' | '16:9';
  effects: string[];
  voiceStyle?: string;
  musicStyle?: string;
  subtitlesEnabled?: boolean;
  avatarEnabled?: boolean;
};

export type VideoGenerationResult = {
  videoUrl: string;
  previewUrl: string;
  generationId: string;
  platform: string;
  aspectRatio: string;
  effects: string[];
};

export async function getUserContent() {
  try {
    const { data, error } = await supabase
      .from('content')
      .select(`
        *,
        outputs:content_outputs(*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user content:', error);
      throw error;
    }

    return data as Content[];
  } catch (error) {
    console.error('Error fetching user content:', error);
    return [];
  }
}

export async function getContentById(id: string) {
  try {
    const { data, error } = await supabase
      .from('content')
      .select(`
        *,
        outputs:content_outputs(*)
      `)
      .eq('id', id)
      .maybeSingle();  // Use maybeSingle instead of single to prevent errors when no data is found

    if (error) {
      console.error('Error fetching content by ID:', error);
      throw error;
    }

    return data as Content | null;
  } catch (error) {
    console.error('Error fetching content by ID:', error);
    return null;
  }
}

export async function createContent(contentData: Omit<Content, 'id' | 'created_at' | 'outputs'>) {
  try {
    const { data, error } = await supabase
      .from('content')
      .insert(contentData)
      .select()
      .maybeSingle(); // Use maybeSingle instead of single

    if (error) {
      console.error('Error creating content:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error creating content:', error);
    return null;
  }
}

export async function createContentOutput(outputData: Omit<ContentOutput, 'id' | 'created_at'>) {
  try {
    const { data, error } = await supabase
      .from('content_outputs')
      .insert(outputData)
      .select()
      .maybeSingle(); // Use maybeSingle instead of single

    if (error) {
      console.error('Error creating content output:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error creating content output:', error);
    return null;
  }
}

export async function updateContent(id: string, contentData: Partial<Content>) {
  try {
    // Ensure we're not accidentally sending the outputs array which would cause errors
    const { outputs, ...dataToUpdate } = contentData as any;
    
    const { data, error } = await supabase
      .from('content')
      .update(dataToUpdate)
      .eq('id', id)
      .select()
      .maybeSingle(); // Use maybeSingle instead of single

    if (error) {
      console.error('Error updating content:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error updating content:', error);
    return null;
  }
}

export async function deleteContent(id: string) {
  try {
    const { error } = await supabase
      .from('content')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting content:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error deleting content:', error);
    return false;
  }
}

export async function generateVideoFromScript(
  scriptText: string,
  videoOptions: VideoGenerationOptions
): Promise<VideoGenerationResult> {
  try {
    console.log(`Generating video from script with options:`, videoOptions);
    
    const response = await supabase.functions.invoke('content-analyze', {
      body: { scriptText, videoOptions }
    });

    if (response.error) {
      console.error('Video generation error from Supabase function:', response.error);
      throw new Error(response.error.message || "Failed to generate video");
    }

    console.log('Video generation response:', response.data);
    
    if (!response.data || typeof response.data !== 'object') {
      console.error('Invalid response format from video generation:', response.data);
      throw new Error('Invalid response format from video generation');
    }

    return response.data as VideoGenerationResult;
  } catch (error) {
    console.error('Error generating video:', error);
    throw error;
  }
}
