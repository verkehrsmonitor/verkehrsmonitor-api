#!/bin/bash
source $HOME/.nvm/nvm.sh
nvm use

# cp $HOME/.env $HOME/d3-discoverer/current/.env

npm install --prod
npm start
