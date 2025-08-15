import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  Square, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Volume2,
  Settings,
  Highlighter,
  StickyNote
} from 'lucide-react';
import { useTTS } from '../hooks/useTTS';
import { useAuth } from '../hooks/useAuth';
import { AnnotationService } from '../services/annotationService';
import { Highlight, Note } from '../types';

interface DocumentViewerProps {
  filePath: string;
  onClose: () => void;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({ filePath, onClose }) => {
  const { user } = useAuth();
  const { isReading, isPaused, voices, settings, speak, pause, resume, stop, updateSettings } = useTTS();
  
  const [zoom, setZoom] = useState(1);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedText, setSelectedText] = useState('');
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [noteContent, setNoteContent] = useState('');
  const [currentHighlightIndex, setCurrentHighlightIndex] = useState(-1);
  
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Carregar highlights e notas do arquivo atual
  useEffect(() => {
    if (user && filePath) {
      loadAnnotations();
    }
  }, [user, filePath]);

  const loadAnnotations = async () => {
    const [highlightData, noteData] = await Promise.all([
      AnnotationService.getHighlights(filePath),
      AnnotationService.getNotes(filePath),
    ]);
    setHighlights(highlightData);
    setNotes(noteData);
  };

  // Extrair texto do iframe para leitura
  const extractTextFromIframe = (): string => {
    if (!iframeRef.current?.contentWindow?.document) return '';
    
    const doc = iframeRef.current.contentWindow.document;
    return doc.body?.innerText || '';
  };

  // Destacar texto durante a leitura
  const handleTTSBoundary = (event: SpeechSynthesisEvent) => {
    if (event.name === 'word' && iframeRef.current?.contentWindow?.document) {
      const doc = iframeRef.current.contentWindow.document;
      const text = extractTextFromIframe();
      
      // Remover highlight anterior
      const existingHighlights = doc.querySelectorAll('.highlight');
      existingHighlights.forEach(el => {
        const parent = el.parentNode;
        if (parent) {
          parent.replaceChild(document.createTextNode(el.textContent || ''), el);
          parent.normalize();
        }
      });
      
      // Adicionar novo highlight
      const startIndex = event.charIndex;
      const endIndex = startIndex + (event.charLength || 0);
      const wordToHighlight = text.substring(startIndex, endIndex);
      
      // Encontrar e destacar a palavra no DOM
      highlightTextInDOM(doc, wordToHighlight, startIndex);
    }
  };

  const highlightTextInDOM = (doc: Document, word: string, startIndex: number) => {
    const walker = doc.createTreeWalker(
      doc.body,
      NodeFilter.SHOW_TEXT,
      null
    );

    let currentIndex = 0;
    let node;

    while (node = walker.nextNode()) {
      const textContent = node.textContent || '';
      const nodeLength = textContent.length;
      
      if (currentIndex + nodeLength > startIndex) {
        const relativeStart = startIndex - currentIndex;
        const relativeEnd = relativeStart + word.length;
        
        if (relativeStart >= 0 && relativeEnd <= nodeLength) {
          const beforeText = textContent.substring(0, relativeStart);
          const highlightedText = textContent.substring(relativeStart, relativeEnd);
          const afterText = textContent.substring(relativeEnd);
          
          const parent = node.parentNode;
          if (parent) {
            const span = doc.createElement('span');
            span.className = 'highlight';
            span.textContent = highlightedText;
            
            parent.removeChild(node);
            if (beforeText) parent.appendChild(doc.createTextNode(beforeText));
            parent.appendChild(span);
            if (afterText) parent.appendChild(doc.createTextNode(afterText));
          }
          break;
        }
      }
      currentIndex += nodeLength;
    }
  };

  const handleReadAloud = () => {
    const text = extractTextFromIframe();
    if (text) {
      speak(text, handleTTSBoundary);
    }
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.5));
  const handleResetZoom = () => setZoom(1);

  // Gerenciar seleção de texto
  const handleTextSelection = (event: MouseEvent) => {
    const selection = iframeRef.current?.contentWindow?.getSelection();
    if (selection && selection.toString().trim()) {
      setSelectedText(selection.toString().trim());
      setContextMenuPos({ x: event.clientX, y: event.clientY });
      setShowContextMenu(true);
    } else {
      setShowContextMenu(false);
    }
  };

  const handleCreateHighlight = async () => {
    if (!user || !selectedText) return;
    
    const selection = iframeRef.current?.contentWindow?.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const highlight = await AnnotationService.createHighlight({
        userId: user.id.toString(),
        filePath,
        startOffset: range.startOffset,
        endOffset: range.endOffset,
        text: selectedText,
      });
      
      if (highlight) {
        setHighlights(prev => [...prev, highlight]);
      }
    }
    
    setShowContextMenu(false);
    setSelectedText('');
  };

  const handleCreateNote = () => {
    setShowNoteModal(true);
    setShowContextMenu(false);
  };

  const handleSaveNote = async () => {
    if (!user || !selectedText || !noteContent.trim()) return;
    
    const selection = iframeRef.current?.contentWindow?.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      
      if (editingNote) {
        const success = await AnnotationService.updateNote(editingNote.id, noteContent);
        if (success) {
          setNotes(prev => prev.map(note => 
            note.id === editingNote.id 
              ? { ...note, noteContent, updatedAt: new Date().toISOString() }
              : note
          ));
        }
      } else {
        const note = await AnnotationService.createNote({
          userId: user.id.toString(),
          filePath,
          startOffset: range.startOffset,
          endOffset: range.endOffset,
          text: selectedText,
          noteContent,
        });
        
        if (note) {
          setNotes(prev => [...prev, note]);
        }
      }
    }
    
    setShowNoteModal(false);
    setNoteContent('');
    setEditingNote(null);
    setSelectedText('');
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setNoteContent(note.noteContent);
    setSelectedText(note.text);
    setShowNoteModal(true);
  };

  const handleDeleteNote = async (noteId: string) => {
    const success = await AnnotationService.deleteNote(noteId);
    if (success) {
      setNotes(prev => prev.filter(note => note.id !== noteId));
    }
  };

  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe && iframe.contentWindow) {
      const doc = iframe.contentWindow.document;
      doc.addEventListener('mouseup', handleTextSelection);
      
      return () => {
        doc.removeEventListener('mouseup', handleTextSelection);
      };
    }
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-white w-full h-full max-w-7xl max-h-screen rounded-lg overflow-hidden">
        {/* Barra de ferramentas */}
        <div className="bg-secondary text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onClose}
              className="bg-accent hover:bg-opacity-90 text-white p-2 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            {/* Controles de leitura */}
            <div className="flex items-center space-x-2 border-l border-gray-400 pl-4">
              {!isReading ? (
                <button
                  onClick={handleReadAloud}
                  className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition-colors"
                >
                  <Play className="w-5 h-5" />
                </button>
              ) : isPaused ? (
                <button
                  onClick={resume}
                  className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
                >
                  <Play className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={pause}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white p-2 rounded-lg transition-colors"
                >
                  <Pause className="w-5 h-5" />
                </button>
              )}
              
              <button
                onClick={stop}
                className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors"
              >
                <Square className="w-4 h-4" />
              </button>
            </div>

            {/* Controles de zoom */}
            <div className="flex items-center space-x-2 border-l border-gray-400 pl-4">
              <button
                onClick={handleZoomIn}
                className="bg-primary hover:bg-opacity-90 text-white p-2 rounded-lg transition-colors"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
              <button
                onClick={handleZoomOut}
                className="bg-primary hover:bg-opacity-90 text-white p-2 rounded-lg transition-colors"
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              <button
                onClick={handleResetZoom}
                className="bg-primary hover:bg-opacity-90 text-white p-2 rounded-lg transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
              <span className="text-sm">{Math.round(zoom * 100)}%</span>
            </div>

            {/* Configurações TTS */}
            <div className="flex items-center space-x-2 border-l border-gray-400 pl-4">
              <Volume2 className="w-5 h-5" />
              <select
                value={voices.findIndex(v => v === settings.voice)}
                onChange={(e) => updateSettings({ voice: voices[parseInt(e.target.value)] })}
                className="bg-gray-700 text-white rounded px-2 py-1 text-sm"
              >
                {voices.map((voice, index) => (
                  <option key={voice.name} value={index}>
                    Voz {index + 1}
                  </option>
                ))}
              </select>
              
              <select
                value={settings.rate}
                onChange={(e) => updateSettings({ rate: parseFloat(e.target.value) })}
                className="bg-gray-700 text-white rounded px-2 py-1 text-sm"
              >
                <option value={0.5}>0.5x</option>
                <option value={1}>1x</option>
                <option value={1.25}>1.25x</option>
                <option value={1.5}>1.5x</option>
                <option value={2}>2x</option>
              </select>
            </div>
          </div>

          <div className="text-sm font-medium">
            {filePath.split('/').pop()?.split('.')[0]}
          </div>
        </div>

        {/* Visualizador do documento */}
        <div className="relative h-full" ref={containerRef}>
          <iframe
            ref={iframeRef}
            src={filePath}
            className="w-full h-full border-none"
            style={{ 
              transform: `scale(${zoom})`,
              transformOrigin: 'top left',
              width: `${100 / zoom}%`,
              height: `${100 / zoom}%`
            }}
            title="Document Viewer"
          />
          
          {/* Menu de contexto */}
          {showContextMenu && (
            <div
              className="absolute bg-white border rounded-lg shadow-lg p-2 z-10"
              style={{ left: contextMenuPos.x, top: contextMenuPos.y }}
            >
              <button
                onClick={handleCreateHighlight}
                className="flex items-center space-x-2 w-full p-2 hover:bg-gray-100 rounded text-left"
              >
                <Highlighter className="w-4 h-4" />
                <span>Marcar texto</span>
              </button>
              <button
                onClick={handleCreateNote}
                className="flex items-center space-x-2 w-full p-2 hover:bg-gray-100 rounded text-left"
              >
                <StickyNote className="w-4 h-4" />
                <span>Adicionar nota</span>
              </button>
            </div>
          )}
        </div>

        {/* Modal de nota */}
        {showNoteModal && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
            <div className="bg-white p-6 rounded-lg w-96 max-w-full">
              <h3 className="text-lg font-bold mb-4">
                {editingNote ? 'Editar Nota' : 'Nova Nota'}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Texto selecionado: "{selectedText}"
              </p>
              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                className="w-full h-32 p-3 border rounded-lg resize-none"
                placeholder="Digite sua nota aqui..."
              />
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  onClick={() => {
                    setShowNoteModal(false);
                    setNoteContent('');
                    setEditingNote(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveNote}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
