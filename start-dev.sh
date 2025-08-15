#!/bin/bash

echo "🚀 Iniciando Resumos Moderno - Prof F.silva"
echo "============================================"

# Verificar se as dependências estão instaladas
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm install
fi

echo "🔧 Configuração:"
echo "- React App: http://localhost:3000"
echo "- PHP Server: http://localhost:8080"
echo ""
echo "📝 Para usar:"
echo "1. Crie uma conta ou faça login"
echo "2. Navegue pelas categorias"
echo "3. Use os recursos de leitura e anotações"
echo ""

# Iniciar PHP server em background
echo "🔄 Iniciando servidor PHP..."
php -S localhost:8080 > /dev/null 2>&1 &
PHP_PID=$!

# Aguardar um momento para PHP iniciar
sleep 2

# Iniciar React
echo "⚛️ Iniciando React..."
npm start

# Cleanup: matar PHP server quando React parar
kill $PHP_PID
