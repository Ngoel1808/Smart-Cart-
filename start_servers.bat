@echo off
echo ===================================================
echo Starting SmartCart Servers...
echo ===================================================

echo Starting Backend API (FastAPI) on port 8000...
start "SmartCart Backend" cmd /k "cd backend && .\venv\Scripts\activate && uvicorn app.main:app --reload"

echo Starting Frontend UI (React/Vite) on port 5173...
start "SmartCart Frontend" cmd /k "cd frontend && npm run dev"

echo Both servers are starting up in new windows!
echo.
echo Backend Swagger UI: http://127.0.0.1:8000/docs
echo Frontend App:       http://localhost:5173
echo.
pause
