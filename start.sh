#/bin/sh
while :
do
    npm run discord
    if [ $? -ne 2 ]; then
        break
    fi
    sleep 1
done
echo Exited with code $?.
