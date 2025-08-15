<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Permitir requests OPTIONS para CORS
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

// Reutilizar as funções do index.php original
require_once 'index.php';

// Função para obter a estrutura completa de arquivos
function getFileStructureAPI() {
    $pastas = listarPastasEmResumos();
    $estruturaCompleta = array();
    
    foreach ($pastas as $pasta) {
        $subpastas = listarSubpastasEmPasta($pasta);
        $subpastasComArquivos = array();
        
        foreach ($subpastas as $subpasta) {
            $arquivos = listarArquivosEmSubpasta($pasta, $subpasta);
            if (!empty($arquivos)) {
                $subpastasComArquivos[$subpasta] = $arquivos;
            }
        }
        
        // Também adicionar arquivos na raiz da pasta principal (se houver)
        $arquivosRaiz = listarArquivosEmDisciplina($pasta);
        if (!empty($arquivosRaiz)) {
            $subpastasComArquivos['__raiz__'] = $arquivosRaiz;
        }
        
        $estruturaCompleta[$pasta] = $subpastasComArquivos;
    }
    
    return $estruturaCompleta;
}

try {
    $estrutura = getFileStructureAPI();
    echo json_encode($estrutura, JSON_UNESCAPED_UNICODE);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro ao carregar estrutura de arquivos: ' . $e->getMessage()]);
}
