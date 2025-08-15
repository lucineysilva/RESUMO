@echo off
echo 🗄️ Configurando Banco de Dados MySQL...
echo.

REM Verificar se MySQL está instalado
mysql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ MySQL não encontrado. Instale o MySQL Server primeiro.
    echo 📥 Download: https://dev.mysql.com/downloads/mysql/
    pause
    exit /b 1
)

echo ✅ MySQL encontrado!

REM Executar script de criação do banco
echo 🔧 Criando banco de dados e tabelas...
mysql -h 127.0.0.1 -u root -p < database\setup.sql

if %errorlevel% equ 0 (
    echo ✅ Banco de dados configurado com sucesso!
    echo.
    echo 👤 Usuário de teste criado:
    echo    Email: teste@teste.com
    echo    Senha: password
    echo.
    echo 🚀 Agora você pode executar: .\start-dev.ps1
) else (
    echo ❌ Erro ao configurar banco de dados.
    echo 🔍 Verifique se o MySQL está rodando e as credenciais estão corretas.
)

echo.
pause
