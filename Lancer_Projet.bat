@echo off
echo ========================================================
echo   ChatVerdict - Analyseur de Conversations & Tribunal
echo ========================================================
echo [*] Demarrage du serveur HTTP sur le port 8097...
start "" "http://localhost:8097"
node server.js
pause
