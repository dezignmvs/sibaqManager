@echo off
echo Starting Sibaq Desktop App...
IF NOT EXIST "node_modules" (
    call npm install
)
call npm start
