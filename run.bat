@echo off
title ComplyScan AI - Legal Metrology System (SIH 2026)
echo ====================================================================
echo Starting ComplyScan AI - Automated Legal Metrology Compliance System
echo Problem Statement: SIH26034 (Ministry of Consumer Affairs)
echo ====================================================================
echo.

echo [1/2] Launching FastAPI Backend on http://127.0.0.1:8000 ...
start "ComplyScan AI - Backend" cmd /k "cd /d %~dp0backend && python main.py"

timeout /t 2 /nobreak >nul

echo [2/2] Launching React Vite Frontend on http://localhost:5173 ...
start "ComplyScan AI - Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ====================================================================
echo Both servers are starting up!
echo Frontend: http://localhost:5173
echo Backend API Docs: http://127.0.0.1:8000/docs
echo ====================================================================
timeout /t 3 >nul
start http://localhost:5173
