import React, { useState, useEffect } from 'react';
import { LogOut, User } from 'lucide-react';
import { FolderGrid } from './components/FolderGrid';
import { SubfolderGrid } from './components/SubfolderGrid';
import { FileGrid } from './components/FileGrid';
import { DocumentViewer } from './components/DocumentViewer';
import { Auth } from './components/Auth';
import { useAuth } from './hooks/useAuth';
import { FileStructure } from './types';

type ViewType = 'folders' | 'subfolders' | 'files' | 'document';

interface AppState {
  view: ViewType;
  currentFolder: string;
  currentSubfolder: string;
  currentFile: string;
}

function App() {
  const { user, loading, signIn, signUp, signOut } = useAuth();
  const [appState, setAppState] = useState<AppState>({
    view: 'folders',
    currentFolder: '',
    currentSubfolder: '',
    currentFile: '',
  });
  const [fileStructure, setFileStructure] = useState<FileStructure>({});
  const [loadingStructure, setLoadingStructure] = useState(true);

  // Carregar estrutura de arquivos do backend PHP
  useEffect(() => {
    const loadFileStructure = async () => {
      try {
        // Tentar carregar da API PHP primeiro
        try {
          const response = await fetch('/api/file-structure.php');
          if (response.ok) {
            const structure = await response.json();
            setFileStructure(structure);
            return;
          }
        } catch (apiError) {
          console.warn('API não disponível, usando dados de demonstração:', apiError);
        }

        // Fallback para dados de demonstração
        const mockStructure: FileStructure = {
          'DIREITO-ADMINISTRATIVO': {
            '__raiz__': ['arquivo1.html', 'arquivo2.html'],
            'subcategoria1': ['arquivo3.html'],
          },
          'DIREITO-CONSTITUCIONAL': {
            'subcategoria2': ['arquivo4.html', 'arquivo5.html'],
          },
          'DIREITO-PENAL': {
            '__raiz__': ['DELTA-CE-AULA - Copia (5).htm'],
          },
          'DIREITO-PROCESSUAL-PENAL': {
            'subcategoria3': ['arquivo6.html'],
          },
        };
        
        setFileStructure(mockStructure);
      } catch (error) {
        console.error('Erro ao carregar estrutura de arquivos:', error);
      } finally {
        setLoadingStructure(false);
      }
    };

    loadFileStructure();
  }, []);

  const handleFolderClick = (folder: string) => {
    setAppState({
      view: 'subfolders',
      currentFolder: folder,
      currentSubfolder: '',
      currentFile: '',
    });
  };

  const handleSubfolderClick = (subfolder: string) => {
    setAppState({
      ...appState,
      view: 'files',
      currentSubfolder: subfolder,
    });
  };

  const handleFileClick = (file: string) => {
    setAppState({
      ...appState,
      view: 'document',
      currentFile: file,
    });
  };

  const handleBackToFolders = () => {
    setAppState({
      view: 'folders',
      currentFolder: '',
      currentSubfolder: '',
      currentFile: '',
    });
  };

  const handleBackToSubfolders = () => {
    setAppState({
      ...appState,
      view: 'subfolders',
      currentSubfolder: '',
      currentFile: '',
    });
  };

  const handleCloseDocument = () => {
    setAppState({
      ...appState,
      view: 'files',
      currentFile: '',
    });
  };

  const getDocumentPath = () => {
    const { currentFolder, currentSubfolder, currentFile } = appState;
    if (currentSubfolder === '__raiz__') {
      return `/resumos/${currentFolder}/${currentFile}`;
    }
    return `/resumos/${currentFolder}/${currentSubfolder}/${currentFile}`;
  };

  const handleLogout = async () => {
    await signOut();
  };

  // Mostrar tela de loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-light text-xl">Carregando...</div>
      </div>
    );
  }

  // Mostrar tela de autenticação se não estiver logado
  if (!user) {
    return <Auth onLogin={signIn} onRegister={signUp} />;
  }

  return (
    <div 
      className="min-h-screen"
      style={{
        background: "url('/img/1.jpg') no-repeat center center fixed",
        backgroundSize: 'cover'
      }}
    >
      {/* Header */}
      <header className="bg-black bg-opacity-50 backdrop-blur-sm p-4">
        <div className="flex items-center justify-between">
          <h1 
            className="text-4xl md:text-5xl font-bold text-accent cursor-pointer hover:scale-105 transition-transform duration-300"
            onClick={handleBackToFolders}
          >
            Resumos do Prof F.silva
          </h1>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-light">
              <User className="w-5 h-5" />
              <span className="hidden md:inline">{user.email}</span>
            </div>
            <button
              onClick={handleLogout}
              className="bg-accent hover:bg-opacity-90 text-white p-2 rounded-lg transition-all duration-300 hover:scale-105 flex items-center space-x-2"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden md:inline">Sair</span>
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto">
        {loadingStructure ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-light text-xl">Carregando estrutura de arquivos...</div>
          </div>
        ) : (
          <>
            {appState.view === 'folders' && (
              <FolderGrid 
                folders={Object.keys(fileStructure)} 
                onFolderClick={handleFolderClick}
              />
            )}

            {appState.view === 'subfolders' && (
              <SubfolderGrid
                currentFolder={appState.currentFolder}
                subfolders={Object.keys(fileStructure[appState.currentFolder] || {})}
                onSubfolderClick={handleSubfolderClick}
                onBackClick={handleBackToFolders}
              />
            )}

            {appState.view === 'files' && (
              <FileGrid
                currentPath={{
                  folder: appState.currentFolder,
                  subfolder: appState.currentSubfolder,
                }}
                files={fileStructure[appState.currentFolder]?.[appState.currentSubfolder] || []}
                onFileClick={handleFileClick}
                onBackClick={handleBackToSubfolders}
              />
            )}

            {appState.view === 'document' && (
              <DocumentViewer
                filePath={getDocumentPath()}
                onClose={handleCloseDocument}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
