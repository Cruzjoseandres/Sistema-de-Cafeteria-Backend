@echo off

@SET PATH="%~dp0\bin";%PATH%
@SET PGDATA=%~dp0\data
@SET PGDATABASE=postgres
@SET PGUSER=postgres
@SET PGPORT=5501
@SET PGLOCALEDIR=%~dp0\share\locale
rem "%~dp0\bin\initdb" -U postgres -A trust
"%~dp0\bin\pg_ctl" -D "%~dp0/data" -l logfile start

ECHO "Presionar ENTER para detener Servicio BD Nodo 1"
pause
"%~dp0\bin\pg_ctl" -D "%~dp0/data" stop


