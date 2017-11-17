#!/bin/bash


ln -s config/ src/

node_modules/.bin/sequelize model:generate --name logins --attributes username:text,password:text
node_modules/.bin/sequelize db:migrate

mv models src/
mv migrations src/
mv seeders src/
cp -r config/ lib/

ln -s src/seeders
ln -s src/models
ln -s src/migrations
