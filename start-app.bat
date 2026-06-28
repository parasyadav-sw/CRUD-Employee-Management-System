@echo off
echo ===================================================
echo   Starting Employee Management System Launcher...
echo ===================================================
echo.

:: 1. Open the project directory in Windows File Explorer
echo [1/4] Opening project files in File Explorer...
explorer.exe "C:\Users\Abhijeet\Desktop\WeIntern\CRUD Employee Management System"
timeout /t 1 >nul

:: 2. Launch the backend Node/Express server in a new window
echo [2/4] Booting Backend Server (Port 5000)...
start "EMS Backend Server (Node.js)" cmd /k "cd /d C:\Users\Abhijeet\Desktop\WeIntern\CRUD Employee Management System\server && npm run dev"

:: 3. Launch the frontend React client in a new window
echo [3/4] Booting Frontend Client (Port 5173)...
start "EMS Frontend Client (Vite/React)" cmd /k "cd /d C:\Users\Abhijeet\Desktop\WeIntern\CRUD Employee Management System\frontend && npm run dev"

:: 4. Open the browser to the application page
echo [4/4] Opening dashboard in your default browser...
timeout /t 4 >nul
start http://localhost:5173

echo.
echo ===================================================
echo   Launcher Done! 
echo   Keep the two command prompt windows open 
echo   while using the application in your browser.
echo ===================================================
echo.
pause
