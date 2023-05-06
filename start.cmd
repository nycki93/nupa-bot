CALL npm run build
CALL npm run discord
:loop
    IF %errorlevel% NEQ 2 GOTO break
    @ECHO "Reloading in 5 seconds"
    TIMEOUT 5
    CALL npm run discord
GOTO loop
:break
@ECHO Exited with code %errorlevel%.