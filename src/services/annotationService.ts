import { supabase } from './supabase';
import { Highlight, Note } from '../types';

export class AnnotationService {
  // Highlights
  static async createHighlight(highlight: Omit<Highlight, 'id' | 'createdAt'>): Promise<Highlight | null> {
    try {
      const { data, error } = await supabase
        .from('highlights')
        .insert({
          user_id: highlight.userId,
          file_path: highlight.filePath,
          start_offset: highlight.startOffset,
          end_offset: highlight.endOffset,
          text: highlight.text,
        })
        .select()
        .single();

      if (error) throw error;
      
      return {
        id: data.id,
        userId: data.user_id,
        filePath: data.file_path,
        startOffset: data.start_offset,
        endOffset: data.end_offset,
        text: data.text,
        createdAt: data.created_at,
      };
    } catch (error) {
      console.error('Error creating highlight:', error);
      return null;
    }
  }

  static async getHighlights(filePath: string): Promise<Highlight[]> {
    try {
      const { data, error } = await supabase
        .from('highlights')
        .select('*')
        .eq('file_path', filePath);

      if (error) throw error;

      return data.map((item: any) => ({
        id: item.id,
        userId: item.user_id,
        filePath: item.file_path,
        startOffset: item.start_offset,
        endOffset: item.end_offset,
        text: item.text,
        createdAt: item.created_at,
      }));
    } catch (error) {
      console.error('Error fetching highlights:', error);
      return [];
    }
  }

  static async deleteHighlight(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('highlights')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting highlight:', error);
      return false;
    }
  }

  // Notes
  static async createNote(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<Note | null> {
    try {
      const { data, error } = await supabase
        .from('notes')
        .insert({
          user_id: note.userId,
          file_path: note.filePath,
          start_offset: note.startOffset,
          end_offset: note.endOffset,
          text: note.text,
          note_content: note.noteContent,
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        userId: data.user_id,
        filePath: data.file_path,
        startOffset: data.start_offset,
        endOffset: data.end_offset,
        text: data.text,
        noteContent: data.note_content,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    } catch (error) {
      console.error('Error creating note:', error);
      return null;
    }
  }

  static async getNotes(filePath: string): Promise<Note[]> {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('file_path', filePath);

      if (error) throw error;

      return data.map((item: any) => ({
        id: item.id,
        userId: item.user_id,
        filePath: item.file_path,
        startOffset: item.start_offset,
        endOffset: item.end_offset,
        text: item.text,
        noteContent: item.note_content,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      }));
    } catch (error) {
      console.error('Error fetching notes:', error);
      return [];
    }
  }

  static async updateNote(id: string, noteContent: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notes')
        .update({ 
          note_content: noteContent, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating note:', error);
      return false;
    }
  }

  static async deleteNote(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting note:', error);
      return false;
    }
  }
}
