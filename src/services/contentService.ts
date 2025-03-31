
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
};

export type ContentOutput = {
  id: string;
  content_id: string;
  output_type: 'tiktok' | 'instagram' | 'twitter' | 'newsletter';
  url: string;
  created_at: string;
};

export type SuggestedClip = {
  title: string;
  timestamp?: string;
  description: string;
  duration?: number;
};

export type AIAnalysisResult = {
  rawAnalysis: string;
  suggestedClips: SuggestedClip[];
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
      .single();

    if (error) {
      throw error;
    }

    return data as Content;
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
      .single();

    if (error) {
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
      .single();

    if (error) {
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
    const { data, error } = await supabase
      .from('content')
      .update(contentData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
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
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error deleting content:', error);
    return false;
  }
}

export async function analyzeContentWithAI(content: string, contentType: 'video' | 'audio' | 'text'): Promise<AIAnalysisResult> {
  try {
    console.log(`Analyzing ${contentType} content with AI:`, content.substring(0, 100) + '...');
    
    const response = await supabase.functions.invoke('content-analyze', {
      body: { content, contentType }
    });

    if (response.error) {
      console.error('AI analysis error from Supabase function:', response.error);
      throw new Error(response.error.message);
    }

    console.log('AI analysis response:', response.data);
    
    // Handle the case where response.data might not have the expected structure
    if (!response.data || typeof response.data !== 'object') {
      console.error('Invalid response format from AI analysis:', response.data);
      throw new Error('Invalid response format from AI analysis');
    }

    return response.data as AIAnalysisResult;
  } catch (error) {
    console.error('Error analyzing content with AI:', error);
    throw error;
  }
}
