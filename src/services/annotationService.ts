import { Highlight, Note } from '../types';

export class AnnotationService {
  private static baseUrl = '/api';
  
  private static async getCurrentUser(): Promise<{ id: number } | null> {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  private static async makeRequest(url: string, options: RequestInit = {}) {
    const user = await this.getCurrentUser();
    if (!user) throw new Error('Usuário não autenticado');

    return fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'X-User-ID': user.id.toString(),
        ...options.headers,
      },
    });
  }

  // Highlights
  static async createHighlight(highlight: Omit<Highlight, 'id' | 'createdAt'>): Promise<Highlight | null> {
    try {
      const response = await this.makeRequest(`${this.baseUrl}/annotations.php`, {
        method: 'POST',
        body: JSON.stringify({
          type: 'highlight',
          file_path: highlight.filePath,
          start_offset: highlight.startOffset,
          end_offset: highlight.endOffset,
          text: highlight.text,
        }),
      });

      const result = await response.json();
      
      if (result.success && result.highlight) {
        return {
          id: result.highlight.id.toString(),
          userId: result.highlight.user_id.toString(),
          filePath: result.highlight.file_path,
          startOffset: result.highlight.start_offset,
          endOffset: result.highlight.end_offset,
          text: result.highlight.text,
          createdAt: result.highlight.created_at,
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error creating highlight:', error);
      return null;
    }
  }

  static async getHighlights(filePath: string): Promise<Highlight[]> {
    try {
      const response = await this.makeRequest(
        `${this.baseUrl}/annotations.php?type=highlights&file_path=${encodeURIComponent(filePath)}`
      );

      const result = await response.json();

      if (result.success && result.highlights) {
        return result.highlights.map((item: any) => ({
          id: item.id.toString(),
          userId: item.user_id.toString(),
          filePath: item.file_path,
          startOffset: item.start_offset,
          endOffset: item.end_offset,
          text: item.text,
          createdAt: item.created_at,
        }));
      }

      return [];
    } catch (error) {
      console.error('Error fetching highlights:', error);
      return [];
    }
  }

  static async deleteHighlight(id: string): Promise<boolean> {
    try {
      const response = await this.makeRequest(
        `${this.baseUrl}/annotations.php?type=highlight&id=${id}`,
        { method: 'DELETE' }
      );

      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error('Error deleting highlight:', error);
      return false;
    }
  }

  // Notes
  static async createNote(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<Note | null> {
    try {
      const response = await this.makeRequest(`${this.baseUrl}/annotations.php`, {
        method: 'POST',
        body: JSON.stringify({
          type: 'note',
          file_path: note.filePath,
          start_offset: note.startOffset,
          end_offset: note.endOffset,
          text: note.text,
          note_content: note.noteContent,
        }),
      });

      const result = await response.json();

      if (result.success && result.note) {
        return {
          id: result.note.id.toString(),
          userId: result.note.user_id.toString(),
          filePath: result.note.file_path,
          startOffset: result.note.start_offset,
          endOffset: result.note.end_offset,
          text: result.note.text,
          noteContent: result.note.note_content,
          createdAt: result.note.created_at,
          updatedAt: result.note.updated_at,
        };
      }

      return null;
    } catch (error) {
      console.error('Error creating note:', error);
      return null;
    }
  }

  static async getNotes(filePath: string): Promise<Note[]> {
    try {
      const response = await this.makeRequest(
        `${this.baseUrl}/annotations.php?type=notes&file_path=${encodeURIComponent(filePath)}`
      );

      const result = await response.json();

      if (result.success && result.notes) {
        return result.notes.map((item: any) => ({
          id: item.id.toString(),
          userId: item.user_id.toString(),
          filePath: item.file_path,
          startOffset: item.start_offset,
          endOffset: item.end_offset,
          text: item.text,
          noteContent: item.note_content,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
        }));
      }

      return [];
    } catch (error) {
      console.error('Error fetching notes:', error);
      return [];
    }
  }

  static async updateNote(id: string, noteContent: string): Promise<boolean> {
    try {
      const response = await this.makeRequest(`${this.baseUrl}/annotations.php`, {
        method: 'PUT',
        body: JSON.stringify({
          id: parseInt(id),
          note_content: noteContent,
        }),
      });

      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error('Error updating note:', error);
      return false;
    }
  }

  static async deleteNote(id: string): Promise<boolean> {
    try {
      const response = await this.makeRequest(
        `${this.baseUrl}/annotations.php?type=note&id=${id}`,
        { method: 'DELETE' }
      );

      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error('Error deleting note:', error);
      return false;
    }
  }
}
