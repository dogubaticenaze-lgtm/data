@echo off
chcp 65001 >nul
title Dogu Bati - Site calisiyor (bu pencereyi kapatmayin)
cd /d "%~dp0"
if not exist ".next\BUILD_ID" (
  echo  Site henuz kurulmamis. Once "1-Kurulum.bat" dosyasini calistirin.
  pause
  exit /b 1
)
echo.
echo  ============================================================
echo   DOGU BATI WEB SITESI CALISIYOR
echo  ============================================================
echo.
echo   Site:            http://localhost:3000
echo   Yonetim paneli:  http://localhost:3000/admin
echo.
echo   Bu pencere acik kaldigi surece site calisir.
echo   Kapatmak icin pencereyi kapatin veya Ctrl+C basin.
echo.
start "" http://localhost:3000/admin
call npm start
pause
