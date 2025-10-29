@echo off
REM Script de démarrage pour Jovoco (DB + Backend)
REM Usage: start-dev.bat

echo.
echo ========================================
echo   JOVOCO - Démarrage DB + Backend
echo ========================================
echo.

REM Démarrer PostgreSQL
echo [1/2] Démarrage de PostgreSQL...
docker-compose up -d

if %ERRORLEVEL% NEQ 0 (
    echo Erreur: Impossible de démarrer PostgreSQL
    pause
    exit /b 1
)

echo PostgreSQL démarré ✓
echo.

REM Attendre que PostgreSQL soit prêt
echo Attente du démarrage de PostgreSQL (5 secondes)...
timeout /t 5 /nobreak

REM Démarrer le backend
echo.
echo [2/2] Démarrage du Backend NestJS...
cd backend

if not exist node_modules (
    echo Installation des dépendances...
    call npm install
)

if not exist .env (
    echo Création du fichier .env...
    copy .env.example .env
)

echo.
echo ========================================
echo   Backend en cours de démarrage...
echo ========================================
echo.
echo Accédez à l'API sur: http://localhost:3000
echo.

call npm run start:dev

pause
