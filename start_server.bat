@echo off
title LTSP - Linux Training Platform Server
echo ========================================================
echo Starting LTSP Web Server at http://localhost:8000
echo ========================================================
echo Press Ctrl+C in this window to stop the server anytime.
echo Opening browser...
start http://localhost:8000
python -m http.server 8000
pause
