@echo off
chcp 65001 >nul
title Dogu Bati - Yedekleme
cd /d "%~dp0"
if not exist "data\store.json" (
  echo  Henuz yedeklenecek panel verisi yok (panelde hic kayit yapilmamis).
  pause
  exit /b 0
)
if not exist "yedekler" mkdir "yedekler"
for /f "tokens=1-3 delims=/. " %%a in ("%date%") do set D=%%c-%%b-%%a
for /f "tokens=1-2 delims=:." %%a in ("%time%") do set T=%%a%%b
set T=%T: =0%
copy /y "data\store.json" "yedekler\store-%D%-%T%.json" >nul
echo.
echo  Yedek alindi: yedekler\store-%D%-%T%.json
echo  Bu dosyayi guvenli bir yere (USB, bulut) kopyalayin.
echo.
pause
