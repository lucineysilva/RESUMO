import React from 'react';
import { ArrowLeft, FileText } from 'lucide-react';

interface SubfolderGridProps {
  currentFolder: string;
  subfolders: string[];
  onSubfolderClick: (subfolder: string) => void;
  onBackClick: () => void;
}

export const SubfolderGrid: React.FC<SubfolderGridProps> = ({
  currentFolder,
  subfolders,
  onSubfolderClick,
  onBackClick,
}) => {
  return (
    <div className="fade-in">
      <div className="flex items-center mb-6 p-6">
        <button
          onClick={onBackClick}
          className="bg-accent hover:bg-opacity-90 text-white font-bold py-3 px-6 rounded-lg mr-4 transition-all duration-300 hover:scale-105 flex items-center"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Voltar para Categorias
        </button>
        <h2 className="text-2xl font-bold text-light bg-black bg-opacity-50 px-4 py-2 rounded-lg">
          Categoria: {currentFolder}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 px-6">
        {subfolders.map((subfolder) => (
          <button
            key={subfolder}
            onClick={() => onSubfolderClick(subfolder)}
            className="group bg-secondary hover:bg-opacity-80 text-white font-bold text-lg p-5 min-h-[100px] rounded-lg cursor-pointer transition-all duration-300 hover:scale-105 shadow-custom slide-in flex flex-col items-center justify-center"
          >
            <FileText className="w-10 h-10 mb-2 group-hover:scale-110 transition-transform duration-300" />
            <span className="text-center break-words">{subfolder === '__raiz__' ? 'Arquivos Principais' : subfolder}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
