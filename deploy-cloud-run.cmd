@echo off
setlocal
powershell -ExecutionPolicy Bypass -File "%~dp0deploy-cloud-run.ps1" %*
endlocal
