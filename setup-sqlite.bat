@echo off
echo Configurando sistema de resumos com SQLite...
echo.

REM Criar diretório database se não existir
if not exist "database" mkdir database

echo Sistema configurado com SQLite!
echo.
echo Para testar o sistema:
echo 1. Execute: .\start-dev.ps1
echo 2. Acesse: http://localhost:3000
echo 3. Login: teste@teste.com / password
echo.
pause
