mkdir C:\mongodb_storage
TASKKILL /IM mongod.exe /F
TASKKILL /IM node.exe /F
start mongod --dbpath "C:\mongodb_storage"
start npm start

