@echo off
chcp 65001 >nul
title Dogu Bati - Kurulum
echo.
echo  ============================================================
echo   DOGU BATI WEB SITESI - ILK KURULUM
echo  ============================================================
echo.
echo  Bu islem internetten gerekli parcalari indirir (yaklasik 2-5 dakika).
echo  Sadece bir kez yapmaniz yeterlidir.
echo.
where node >nul 2>nul
if errorlevel 1 (
  echo  [HATA] Node.js bulunamadi.
  echo  Lutfen once https://nodejs.org adresinden "LTS" surumunu kurun,
  echo  bilgisayari yeniden baslatin ve bu dosyayi tekrar calistirin.
  echo.
  pause
  exit /b 1
)
for /f "tokens=*" %%v in ('node -v') do set NODEV=%%v
echo  Node.js surumu: %NODEV%
echo.
cd /d "%~dp0"
call npm install --no-audit --no-fund
if errorlevel 1 (
  echo.
  echo  [HATA] Kurulum tamamlanamadi. Internet baglantinizi kontrol edip tekrar deneyin.
  pause
  exit /b 1
)
echo.
echo  Site derleniyor (ilk seferde 1-3 dakika surebilir)...
call npm run build
if errorlevel 1 (
  echo.
  echo  [HATA] Derleme basarisiz. Bu pencerenin ekran goruntusunu gonderin.
  pause
  exit /b 1
)
echo.
echo  ============================================================
echo   KURULUM TAMAMLANDI. Simdi "2-Baslat.bat" dosyasina cift tiklayin.
echo  ============================================================
echo.
pause
