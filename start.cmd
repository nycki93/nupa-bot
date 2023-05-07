:loop
    CALL npm run discord
    IF %errorlevel% NEQ 2 GOTO break
    TIMEOUT 1
GOTO loop
:break
ECHO Exited with code %errorlevel%.