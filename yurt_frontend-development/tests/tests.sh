#!/bin/bash

REL_PATH=$(dirname "$(0)")
CURRENT_DIR=$(pwd)

echo $REL_PATH
echo $CURRENT_DIR

if ! command -v pm2 &> /dev/null
then
  echo "pm2 is not installed or ot in PATH"
  exit 1
fi

echo "#########################"
echo "##### Запуск тестов #####"
echo "#########################"

echo "### Backend"
cd ../../yurt_backend || exit 1

echo "### Запуск фиксиур"
npm run seed:test

echo "### Запуск Backend сервера в тестовом режиме"
pm2 start "npm run start:test" --name="Backend-test"

echo "### Frontend"
cd ../yurt_frontend || exit 1

echo "### Запуск сервера Frontend в тестовом режиме"
pm2 start "npm run start:test" --name="Frontend-test"

while ! nc -z localhost 5183; do
  sleep 0.1
done

echo "### Запуск тестов"
cd ./tests || exit 1

npx codeceptjs run --steps "$@"
EXIT_CODE=$?

echo "### Остановка всех процессов"
pm2 kill

exit ${EXIT_CODE}
