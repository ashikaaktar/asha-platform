@echo off
title ASHA Website Platform - Public Cloud Server
set "PATH=C:\Users\MS ASHIKA AKTAR\AppData\Local\Programs\nodejs;%PATH%"
cd /d "C:\Users\MS ASHIKA AKTAR\Downloads\Ashika"
echo ========================================================
echo    ASHA - AI-Powered Website Builder
echo    Starting Local Server and Public Internet Cloud Tunnel...
echo ========================================================
start /b "" node scripts\tunnel.js
timeout /t 2 /nobreak >nul
start http://localhost:3000
call npm start
pause
