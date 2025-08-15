<?php
function listarPastasEmResumos() {
    $diretorioResumos = __DIR__ . '/resumos';
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
    
    return $pastas;
}

function listarSubpastasEmPasta($pastaPrincipal) {
    $diretorioPasta = __DIR__ . '/resumos/' . $pastaPrincipal;
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
    
    sort($subpastas); // Ordena as subpastas em ordem alfabética
    return $subpastas;
}

function listarArquivosEmSubpasta($pastaPrincipal, $subpasta) {
    $diretorioSubpasta = __DIR__ . '/resumos/' . $pastaPrincipal . '/' . $subpasta;
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

    sort($arquivos); // Ordena os arquivos em ordem alfabética
    return $arquivos;
}

// Função legada para compatibilidade com código existente
function listarArquivosEmDisciplina($pasta) {
    // Verifica se o caminho contém uma barra, indicando pasta/subpasta
    if (strpos($pasta, '/') !== false) {
        list($pastaPrincipal, $subpasta) = explode('/', $pasta, 2);
        return listarArquivosEmSubpasta($pastaPrincipal, $subpasta);
    }
    
    // Se não há subpastas com conteúdo, procura arquivos direto na pasta principal
    $diretorioDisciplina = __DIR__ . '/resumos/' . $pasta;
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

    sort($arquivos); // Ordena os arquivos em ordem alfabética
    return $arquivos;
}

$pastas = listarPastasEmResumos();

// Pré-carregar a estrutura de pastas
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
?>

<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resumos do Prof F.silva</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <h1>Resumos do Prof F.silva</h1>
    <!-- Menu principal (pastas) -->
    <div id="pastas">
        <?php foreach ($pastas as $pasta): ?>
            <button class="pasta-btn" onclick="mostrarSubpastas('<?php echo htmlspecialchars($pasta); ?>')">
                <?php echo htmlspecialchars($pasta); ?>
            </button>
        <?php endforeach; ?>
    </div>

    <!-- Submenu (subpastas) -->
    <div id="subpastas" style="display: none;">
        <button class="voltar-btn" onclick="voltarParaPastas()">Voltar para Categorias</button>
        <div id="subpastas-container" class="subpastas-container"></div>
    </div>

    <!-- Menu de arquivos -->
    <div id="arquivos" style="display: none;">
        <button class="voltar-btn" onclick="voltarParaSubpastas()">Voltar para Subcategorias</button>
        <div id="arquivos-container" class="arquivos-container"></div>
    </div>

    <div id="popup" class="popup">
        <div class="popup-content">
            <div class="menu-bar">
                <button class="close-popup" onclick="closePopup()">Fechar</button>
                <!-- <button id="readButton" onclick="lerComIA()">Ler </button>
                <button id="togglePauseButton" onclick="togglePause()">Pausar</button>
                <label for="speedSelector">Vel:</label>
                <select id="speedSelector">
                    <option value="1">1x</option>
                    <option value="1.5">1.5x</option>
                    <option value="2">2x</option>
                    <option value="2.5">2.5x</option>
                    <option value="3">3x</option>
                </select>
                <label for="voiceSelector">Voz:</label>
                <select id="voiceSelector"></select>-->
                <button onclick="zoomIn()">Zoom In</button>
                <button onclick="zoomOut()">Zoom Out</button>
                <button onclick="resetZoom()">Reset Zoom</button>
            </div>
            <iframe id="viewer"></iframe>
            <div id="highlight-overlay" style="pointer-events: none;"></div>
        </div>
    </div>

    <audio id="audioPlayer"></audio>    <script>
        // Precarregar som
        const hoverSound = new Audio('sound/som-arquivo.mp3');
        hoverSound.preload = 'auto';

        // Estrutura completa com todas as pastas, subpastas e arquivos
        const estruturaCompleta = <?php echo json_encode($estruturaCompleta); ?>;
        const audioPlayer = document.getElementById('audioPlayer');
        const seekSlider = document.getElementById('seekSlider');
        const pauseBtn = document.getElementById('pause-btn');
        
        // Armazena o caminho de navegação atual
        let pastaAtual = '';
        let subpastaAtual = '';

        // Função para mostrar as subpastas de uma pasta principal
        function mostrarSubpastas(pasta) {
            const pastasDiv = document.getElementById('pastas');
            const subpastasDiv = document.getElementById('subpastas');
            const subpastasContainer = document.getElementById('subpastas-container');

            // Salva a pasta atual para navegação
            pastaAtual = pasta;
            
            // Exibe o contêiner de subpastas
            pastasDiv.style.display = 'none';
            subpastasDiv.style.display = 'block';
            subpastasContainer.innerHTML = '';
            
            // Título da categoria selecionada
            const titulo = document.createElement('h2');
            titulo.textContent = `Categoria: ${pasta}`;
            subpastasContainer.appendChild(titulo);

            // Obtém as subpastas da pasta selecionada
            const subpastas = estruturaCompleta[pasta];
            
            if (subpastas && Object.keys(subpastas).length > 0) {
                // Primeiro, adicionar um botão para arquivos na raiz (se existirem)
                if (subpastas['__raiz__'] && subpastas['__raiz__'].length > 0) {
                    const subpastaBtn = document.createElement('button');
                    subpastaBtn.classList.add('subpasta-btn');
                    subpastaBtn.onclick = function() { 
                        mostrarArquivos(pasta, '__raiz__'); 
                    };
                    subpastaBtn.textContent = 'Arquivos Principais';
                    subpastaBtn.addEventListener('mouseover', () => {
                        hoverSound.currentTime = 0;
                        hoverSound.play();
                    });
                    subpastasContainer.appendChild(subpastaBtn);
                }
                
                // Adicionar botões para cada subpasta
                Object.keys(subpastas).forEach(subpasta => {
                    if (subpasta !== '__raiz__') {
                        const subpastaBtn = document.createElement('button');
                        subpastaBtn.classList.add('subpasta-btn');
                        subpastaBtn.onclick = function() { 
                            mostrarArquivos(pasta, subpasta); 
                        };
                        subpastaBtn.textContent = subpasta;
                        subpastaBtn.addEventListener('mouseover', () => {
                            hoverSound.currentTime = 0;
                            hoverSound.play();
                        });
                        subpastasContainer.appendChild(subpastaBtn);
                    }
                });
            } else {
                subpastasContainer.innerHTML += '<p>Nenhuma subcategoria encontrada.</p>';
            }
        }
        
        // Função para mostrar os arquivos de uma subpasta
        function mostrarArquivos(pasta, subpasta) {
            const subpastasDiv = document.getElementById('subpastas');
            const arquivosDiv = document.getElementById('arquivos');
            const arquivosContainer = document.getElementById('arquivos-container');

            // Salva a pasta e subpasta atuais para navegação
            pastaAtual = pasta;
            subpastaAtual = subpasta;
            
            // Exibe o contêiner de arquivos
            subpastasDiv.style.display = 'none';
            arquivosDiv.style.display = 'block';
            arquivosContainer.innerHTML = '';
            
            // Título da subpasta selecionada
            const titulo = document.createElement('h2');
            titulo.textContent = subpasta === '__raiz__' 
                ? `${pasta} - Arquivos Principais` 
                : `${pasta} - ${subpasta}`;
            arquivosContainer.appendChild(titulo);

            // Obtém os arquivos da subpasta selecionada
            const arquivos = estruturaCompleta[pasta][subpasta];
            
            if (arquivos && arquivos.length > 0) {
                arquivos.forEach(arquivo => {
                    const arquivoBtn = document.createElement('button');
                    arquivoBtn.classList.add('arquivo-btn');
                    arquivoBtn.onclick = function() { 
                        openPopup(pasta, subpasta, arquivo); 
                    };
                    // Remove a extensão do arquivo para exibição
                    arquivoBtn.textContent = arquivo.split('.').slice(0, -1).join('.');
                    arquivoBtn.addEventListener('mouseover', () => {
                        hoverSound.currentTime = 0;
                        hoverSound.play();
                    });
                    arquivosContainer.appendChild(arquivoBtn);
                });
            } else {
                arquivosContainer.innerHTML += '<p>Nenhum arquivo encontrado.</p>';
            }
        }

        // Funções de navegação
        function voltarParaPastas() {
            const pastasDiv = document.getElementById('pastas');
            const subpastasDiv = document.getElementById('subpastas');
            pastasDiv.style.display = 'flex';
            subpastasDiv.style.display = 'none';
            pastaAtual = '';
            subpastaAtual = '';
        }
        
        function voltarParaSubpastas() {
            const arquivosDiv = document.getElementById('arquivos');
            arquivosDiv.style.display = 'none';
            mostrarSubpastas(pastaAtual);
            subpastaAtual = '';
        }
        
        // Função legada mantida para compatibilidade
        function voltarParaDisciplinas() {
            voltarParaPastas();
        }

        // Função para abrir um arquivo no popup
        function openPopup(pasta, subpasta, arquivo) {
            const popup = document.getElementById('popup');
            const viewer = document.getElementById('viewer');
            
            let caminho;
            if (subpasta === '__raiz__') {
                // Arquivo está na raiz da pasta principal
                caminho = `resumos/${encodeURIComponent(pasta)}/${encodeURIComponent(arquivo)}`;
            } else {
                // Arquivo está em uma subpasta
                caminho = `resumos/${encodeURIComponent(pasta)}/${encodeURIComponent(subpasta)}/${encodeURIComponent(arquivo)}`;
            }
            
            viewer.src = caminho;
            popup.style.display = 'flex';
        }

        function closePopup() {
            const popup = document.getElementById('popup');
            popup.style.display = 'none';
            document.getElementById('viewer').src = '';
            audioPlayer.pause();
            audioPlayer.src = '';
            stopReading(); // Adicione esta linha para parar a leitura em voz alta
        }

        // função ler com ia
        function lerComIA() {
            const viewer = document.getElementById('viewer');
            if (viewer.contentWindow && viewer.contentWindow.document) {
                const viewerDocument = viewer.contentWindow.document;
                const text = viewerDocument.body ? viewerDocument.body.innerText : '';

                if (text) {
                    contentDiv.innerText = text;
                    textContent = text;

                    if (window.speechSynthesis.speaking) {
                        window.speechSynthesis.cancel();
                    }
                    currentIndex = 0;
                    utterance = new SpeechSynthesisUtterance(textContent);
                    utterance.voice = voices[voiceSelector.value];
                    utterance.rate = parseFloat(speedSelector.value);
                    utterance.lang = "pt-BR";

                    utterance.onboundary = (event) => {
                        if (event.name === "word") {
                            currentIndex = event.charIndex;
                            highlightWord(event.charIndex, event.charIndex + event.charLength);
                            updateProgress(event.charIndex, textContent.length);
                        }
                    };

                    utterance.onend = () => {
                        contentDiv.innerHTML = textContent;
                        progressBar.style.width = "0%";
                    };

                    window.speechSynthesis.speak(utterance);
                    isPaused = false;
                } else {
                    alert('Nenhum texto encontrado para leitura.');
                }
            } else {
                alert('O iframe ainda não está totalmente carregado.');
            }
        }

        // voca função ler com ia
        const readButton = document.getElementById("readButton");
        const togglePauseButton = document.getElementById("togglePauseButton");
        const speedSelector = document.getElementById("speedSelector");
        const voiceSelector = document.getElementById("voiceSelector");
        const contentDiv = document.createElement("div"); // Create a temporary div for content
        const progressBar = document.createElement("div"); // Create a temporary div for progress bar

        let voices = [];
        let utterance;
        let currentIndex = 0;
        let isPaused = false;
        let textContent = '';

        // Carrega as vozes
        function loadVoices() {
            voices = window.speechSynthesis.getVoices().filter(voice => voice.lang === "pt-BR");
            voiceSelector.innerHTML = "";
            voices.forEach((voice, index) => {
                const option = document.createElement("option");
                option.value = index;
                option.textContent = (index + 1).toString(); // Reduz o nome da voz para um número
                voiceSelector.appendChild(option);
            });

            // Se não houver vozes disponíveis, adicionar uma voz padrão
            if (voices.length === 0) {
                const option = document.createElement("option");
                option.value = "";
                option.textContent = "Voz padrão";
                voiceSelector.appendChild(option);
            }
        }
        window.speechSynthesis.onvoiceschanged = loadVoices;

        // Destaca a palavra atual
        function highlightWord(start, end) {
            const textBefore = textContent.substring(0, start);
            const word = textContent.substring(start, end);
            const textAfter = textContent.substring(end);
            contentDiv.innerHTML = `${textBefore}<span class="highlight">${word}</span>${textAfter}`;
        }

        // Atualiza a barra de progresso
        function updateProgress(currentChar, totalChar) {
            const progress = (currentChar / totalChar) * 100;
            progressBar.style.width = `${progress}%`;
        }

        // Inicia a leitura
        readButton.addEventListener("click", () => {
            if (window.speechSynthesis.speaking) {
                window.speechSynthesis.cancel();
            }
            currentIndex = 0;
            utterance = new SpeechSynthesisUtterance(textContent);
            utterance.voice = voices[voiceSelector.value];
            utterance.rate = parseFloat(speedSelector.value);
            utterance.lang = "pt-BR";

            utterance.onboundary = (event) => {
                if (event.name === "word") {
                    currentIndex = event.charIndex;
                    highlightWord(event.charIndex, event.charIndex + event.charLength);
                    updateProgress(event.charIndex, textContent.length);
                }
            };

            utterance.onend = () => {
                contentDiv.innerHTML = textContent;
                progressBar.style.width = "0%";
            };

            window.speechSynthesis.speak(utterance);
            isPaused = false;
        });

        // Pausa e retoma a leitura
        togglePauseButton.addEventListener("click", () => {
            if (isPaused) {
                window.speechSynthesis.resume();
                togglePauseButton.textContent = "Pausar";
                isPaused = false;
            } else {
                window.speechSynthesis.pause();
                togglePauseButton.textContent = "Continuar";
                isPaused = true;
            }
        });

        // Para a leitura
        function stopReading() {
            window.speechSynthesis.cancel();
            contentDiv.innerHTML = textContent;
            progressBar.style.width = "0%";
            togglePauseButton.textContent = "Pausar";
            isPaused = false;
        }

        // Atualiza a velocidade
        speedSelector.addEventListener("change", () => {
            if (utterance && window.speechSynthesis.speaking) {
                const wasPaused = isPaused;
                window.speechSynthesis.pause();
                utterance.rate = parseFloat(speedSelector.value);
                if (!wasPaused) {
                    window.speechSynthesis.resume();
                }
            }
        });

        // Atualiza a voz
        voiceSelector.addEventListener("change", () => {
            if (utterance) {
                utterance.voice = voices[voiceSelector.value];
            }
        });

        // final do codigo isserido

        function novidade() {
            alert('Funcão em analise didática. a marcação que por um lado ajuda a focar por outros pode atrapalhar facilitando demais o acompanhamento e deixando o aluno livre sem prestar a atenção necessária ');
        }

        function togglePause() {
            if (audioPlayer.paused) {
                audioPlayer.play();
                pauseBtn.innerText = "Pausar";  
            } else {
                audioPlayer.pause();
                pauseBtn.innerText = "Continuar";  
            }
        }

        function playAudio() {
            audioPlayer.play();
        }

        function pauseAudio() {
            audioPlayer.pause();
        }

        audioPlayer.addEventListener('timeupdate', () => {
            seekSlider.value = audioPlayer.currentTime;
        });

        seekSlider.addEventListener('input', (e) => {
            audioPlayer.currentTime = e.target.value;
        });

        document.querySelector('.speed-slider').addEventListener('input', function(event) {
            audioPlayer.playbackRate = parseFloat(event.target.value);
        });

        // Funções de zoom
        function zoomIn() {
            const viewer = document.getElementById('viewer');
            const currentZoom = parseFloat(viewer.style.zoom) || 1;
            viewer.style.zoom = currentZoom + 0.1;
        }

        function zoomOut() {
            const viewer = document.getElementById('viewer');
            const currentZoom = parseFloat(viewer.style.zoom) || 1;
            viewer.style.zoom = currentZoom - 0.1;
        }

        function resetZoom() {
            const viewer = document.getElementById('viewer');
            viewer.style.zoom = 1;
        }
       
    </script>
</body>
</html>
