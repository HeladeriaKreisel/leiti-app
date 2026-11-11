@echo off
title Servidor Local Leitti - Gestion Ganadera
echo ========================================================
echo  Iniciando Servidor Web Local para el proyecto Leitti...
echo ========================================================
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0servidor.ps1" -Port 3000
pause
