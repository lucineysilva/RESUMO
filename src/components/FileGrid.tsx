import React from 'react';
import { ArrowLeft, FileText } from 'lucide-react';

interface FileGridProps {
  currentPath: { folder: string; subfolder: string };
  files: string[];
  onFileClick: (file: string) => void;
  onBackClick: () => void;
}

export const FileGrid: React.FC<FileGridProps> = ({
  currentPath,
  files,
  onFileClick,
  onBackClick,
}) => {
  const formatFileName = (fileName: string) => {
    // Remove a extensão do arquivo para exibição
    return fileName.split('.').slice(0, -1).join('.');
  };

  return (
    <div className="fade-in">
      <div className="flex items-center mb-6 p-6">
        <button
          onClick={onBackClick}
          className="bg-accent hover:bg-opacity-90 text-white font-bold py-3 px-6 rounded-lg mr-4 transition-all duration-300 hover:scale-105 flex items-center"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Voltar para Subcategorias
        </button>
        <h2 className="text-2xl font-bold text-light bg-black bg-opacity-50 px-4 py-2 rounded-lg">
          {currentPath.folder} - {currentPath.subfolder === '__raiz__' ? 'Arquivos Principais' : currentPath.subfolder}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 px-6">
        {files.map((file, index) => (
          <button
            key={file}
            onClick={() => onFileClick(file)}
            className="group bg-secondary hover:bg-opacity-80 text-white font-bold text-lg p-4 h-72 rounded-lg cursor-pointer transition-all duration-300 hover:scale-110 shadow-custom relative overflow-hidden slide-in flex flex-col items-center justify-center"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary opacity-20 group-hover:opacity-40 transition-opacity duration-300" />
            <FileText className="w-16 h-16 mb-4 group-hover:scale-110 transition-transform duration-300 relative z-10" />
            <span className="text-center break-words relative z-10 px-2">
              {formatFileName(file)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
