@echo off
cd %~dp0
docker-compose --env-file docker-compose.env up -d --build
echo Docker Compose command has been executed.
pause
