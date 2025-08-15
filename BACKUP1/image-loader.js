const fs = require('fs');
const path = require('path');

function loadImagesFromDirectory(directoryPath) {
    try {
        // Lê todos os arquivos do diretório
        const files = fs.readdirSync(directoryPath);
        
        // Filtra apenas arquivos de imagem
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
        const imageFiles = files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return imageExtensions.includes(ext);
        });
        
        // Obtém informações de cada arquivo e ordena por data de modificação
        const imagesWithStats = imageFiles.map(file => {
            const filePath = path.join(directoryPath, file);
            const stats = fs.statSync(filePath);
            return {
                name: file,
                title: path.parse(file).name, // Nome sem extensão como título
                path: filePath,
                modifiedDate: stats.mtime
            };
        });
        
        // Ordena por data de modificação (decrescente)
        imagesWithStats.sort((a, b) => b.modifiedDate - a.modifiedDate);
        
        return imagesWithStats;
    } catch (error) {
        console.error('Erro ao carregar imagens:', error);
        return [];
    }
}

// Exemplo de uso
const imagesDirectory = 'c:\\Users\\lucin\\OneDrive\\PROJETOS\\RESUMOS\\images';
const images = loadImagesFromDirectory(imagesDirectory);

// Exporte para uso em outros módulos
module.exports = { loadImagesFromDirectory };
