export interface FileStructure {
  [folder: string]: {
    [subfolder: string]: string[];
  };
}

export interface Highlight {
  id: string;
  userId: string;
  filePath: string;
  startOffset: number;
  endOffset: number;
  text: string;
  createdAt: string;
}

export interface Note {
  id: string;
  userId: string;
  filePath: string;
  startOffset: number;
  endOffset: number;
  text: string;
  noteContent: string;
  createdAt: string;
  updatedAt: string;
}

export interface TTSSettings {
  voice: SpeechSynthesisVoice | null;
  rate: number;
  pitch: number;
  volume: number;
}
