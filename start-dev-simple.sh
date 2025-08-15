#!/bin/bash

echo "🚀 Iniciando Sistema Moderno de Resumos..."

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Instale Node.js primeiro."
    exit 1
fi

# Verificar se PHP está instalado  
if ! command -v php &> /dev/null; then
    echo "❌ PHP não encontrado. Instale PHP primeiro."
    exit 1
fi

# Instalar dependências se necessário
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm install
fi

echo "🔧 Iniciando servidor PHP na porta 8080..."
php -S localhost:8080 &
PHP_PID=$!

echo "⚡ Aguardando servidor PHP..."
sleep 3

echo "⚛️ Iniciando React na porta 3000..."
echo ""
echo "🌐 Aplicação estará disponível em:"
echo "   React: http://localhost:3000"
echo "   PHP:   http://localhost:8080"
echo ""
echo "✅ Para parar: Ctrl+C"

npm start

# Limpar processos ao sair
trap "kill $PHP_PID" EXIT
