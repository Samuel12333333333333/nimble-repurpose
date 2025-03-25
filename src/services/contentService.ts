
import { supabase } from '@/lib/supabase';

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
