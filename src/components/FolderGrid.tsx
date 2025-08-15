import React from 'react';
import { Folder, ChevronRight } from 'lucide-react';

interface FolderGridProps {
  folders: string[];
  onFolderClick: (folder: string) => void;
}

export const FolderGrid: React.FC<FolderGridProps> = ({ folders, onFolderClick }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
      {folders.map((folder) => (
        <button
          key={folder}
          onClick={() => onFolderClick(folder)}
          className="group bg-primary hover:bg-opacity-90 text-white font-bold text-lg p-6 min-h-[120px] rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 shadow-custom hover:shadow-xl fade-in flex flex-col items-center justify-center"
        >
          <Folder className="w-12 h-12 mb-3 group-hover:scale-110 transition-transform duration-300" />
          <span className="text-center break-words">{folder}</span>
          <ChevronRight className="w-5 h-5 mt-2 opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
        </button>
      ))}
    </div>
  );
};
