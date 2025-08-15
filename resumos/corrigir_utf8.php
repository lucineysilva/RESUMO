<?php

// Função para corrigir a codificação e adicionar a meta tag UTF-8 se não existir
function corrigirCodificacaoHtml($filePath) {
    // Carrega o conteúdo do arquivo
    $conteudo = file_get_contents($filePath);

    // Verifica se a meta tag UTF-8 já existe no documento
    if (stripos($conteudo, '<meta charset="UTF-8">') === false) {
        // Se a meta tag não existe, insere após a tag <head>
        if (stripos($conteudo, '<head>') !== false) {
            // Adiciona a meta tag logo após a abertura da tag <head>
            $conteudoCorrigido = preg_replace('/<head>/', "<head>\n    <meta charset=\"UTF-8\">", $conteudo, 1);
            echo "Correção aplicada ao arquivo: $filePath\n";
        } else {
            // Se o arquivo não tiver a tag <head>, não pode ser um HTML válido
            echo "Aviso: O arquivo $filePath não contém a tag <head>. Não foi corrigido.\n";
            return;
        }

        // Converte o conteúdo para UTF-8 e salva
        $conteudoCorrigido = mb_convert_encoding($conteudoCorrigido, 'UTF-8', mb_detect_encoding($conteudo, 'UTF-8, ISO-8859-1, ISO-8859-15', true));
        file_put_contents($filePath, $conteudoCorrigido);
    } else {
        echo "Arquivo já está corretamente configurado: $filePath\n";
    }
}

// Função para percorrer os arquivos HTML/HTM e corrigir
function corrigirArquivosHtml($dir) {
    // Busca todos os arquivos HTML e HTM na pasta atual
    $htmlFiles = array_merge(glob($dir . '/*.html'), glob($dir . '/*.htm'));

    // Verifica cada arquivo HTML ou HTM e corrige
    foreach ($htmlFiles as $file) {
        corrigirCodificacaoHtml($file);
    }

    // Percorre as subpastas recursivamente
    $folders = array_filter(glob($dir . '/*'), 'is_dir');
    foreach ($folders as $folder) {
        corrigirArquivosHtml($folder); // Chama a função para cada subpasta
    }
}

// Caminho da pasta onde estão os arquivos HTML/HTM
$directory = __DIR__ . '/resumos';  // Ajuste o caminho conforme sua estrutura

// Inicia o processo
corrigirArquivosHtml($directory);

echo "Processo de correção concluído!\n";

?>
