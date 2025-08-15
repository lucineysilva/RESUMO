<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

function listarPastasEmResumos() {
    $diretorioResumos = __DIR__ . '/../resumos';
    $pastas = [];
    
    if (is_dir($diretorioResumos)) {
        if ($dh = opendir($diretorioResumos)) {
            while (($file = readdir($dh)) !== false) {
                if ($file != '.' && $file != '..' && is_dir($diretorioResumos . '/' . $file)) {
                    $pastas[] = $file;
                }
            }
            closedir($dh);
        }
    }
    
    sort($pastas);
    return $pastas;
}

function listarSubpastasEmPasta($pastaPrincipal) {
    $diretorioPasta = __DIR__ . '/../resumos/' . $pastaPrincipal;
    $subpastas = [];
    
    if (is_dir($diretorioPasta)) {
        if ($dh = opendir($diretorioPasta)) {
            while (($file = readdir($dh)) !== false) {
                if ($file != '.' && $file != '..' && is_dir($diretorioPasta . '/' . $file)) {
                    $subpastas[] = $file;
                }
            }
            closedir($dh);
        }
    }
    
    sort($subpastas);
    return $subpastas;
}

function listarArquivosEmSubpasta($pastaPrincipal, $subpasta) {
    $diretorioSubpasta = __DIR__ . '/../resumos/' . $pastaPrincipal . '/' . $subpasta;
    $arquivos = [];

    if (is_dir($diretorioSubpasta)) {
        if ($dh = opendir($diretorioSubpasta)) {
            while (($file = readdir($dh)) !== false) {
                if ($file != '.' && $file != '..' && preg_match('/\.(html|htm)$/', $file)) {
                    $arquivos[] = $file;
                }
            }
            closedir($dh);
        }
    }

    sort($arquivos);
    return $arquivos;
}

function listarArquivosEmDisciplina($pasta) {
    if (strpos($pasta, '/') !== false) {
        list($pastaPrincipal, $subpasta) = explode('/', $pasta, 2);
        return listarArquivosEmSubpasta($pastaPrincipal, $subpasta);
    }
    
    $diretorioDisciplina = __DIR__ . '/../resumos/' . $pasta;
    $arquivos = [];

    if (is_dir($diretorioDisciplina)) {
        if ($dh = opendir($diretorioDisciplina)) {
            while (($file = readdir($dh)) !== false) {
                if ($file != '.' && $file != '..' && preg_match('/\.(html|htm)$/', $file)) {
                    $arquivos[] = $file;
                }
            }
            closedir($dh);
        }
    }

    sort($arquivos);
    return $arquivos;
}

try {
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

    echo json_encode($estruturaCompleta, JSON_UNESCAPED_UNICODE);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
