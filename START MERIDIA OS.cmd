@echo off
title Meridia OS
cd /d "%~dp0"
set "PATH=%PATH%;C:\Program Files\nodejs"

echo Starting Meridia OS...
echo.
echo Leave this window open while you use the app.
echo Close it (or press Ctrl+C) to stop.
echo.

call npm.cmd run dev -- --open

echo.
echo Meridia OS stopped.
pause
