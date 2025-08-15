# Script para iniciar o ambiente de desenvolvimento no Windows
Write-Host "🚀 Iniciando Resumos Moderno - Prof F.silva" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green

# Verificar se as dependências estão instaladas
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Instalando dependências..." -ForegroundColor Yellow
    npm install
}

Write-Host "🔧 Configuração:" -ForegroundColor Cyan
Write-Host "- React App: http://localhost:3000" -ForegroundColor White
Write-Host "- PHP Server: http://localhost:8080" -ForegroundColor White
Write-Host ""
Write-Host "📝 Para usar:" -ForegroundColor Cyan
Write-Host "1. Crie uma conta ou faça login" -ForegroundColor White
Write-Host "2. Navegue pelas categorias" -ForegroundColor White
Write-Host "3. Use os recursos de leitura e anotações" -ForegroundColor White
Write-Host ""

# Iniciar PHP server em background
Write-Host "🔄 Iniciando servidor PHP..." -ForegroundColor Yellow
$phpProcess = Start-Process -FilePath "php" -ArgumentList "-S", "localhost:8080" -WindowStyle Hidden -PassThru

# Aguardar um momento para PHP iniciar
Start-Sleep -Seconds 2

# Função para cleanup
function Cleanup {
    if ($phpProcess -and !$phpProcess.HasExited) {
        Write-Host "🛑 Parando servidor PHP..." -ForegroundColor Yellow
        $phpProcess | Stop-Process -Force
    }
}

# Registrar cleanup no exit
Register-EngineEvent -SourceIdentifier PowerShell.Exiting -Action { Cleanup }

try {
    # Iniciar React
    Write-Host "⚛️ Iniciando React..." -ForegroundColor Yellow
    Write-Host "Pressione Ctrl+C para parar ambos os servidores" -ForegroundColor Red
    npm start
} finally {
    Cleanup
}
