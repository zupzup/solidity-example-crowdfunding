#!/bin/bash -e
solc /sol/contract.sol 
CONTRACT=`tr -d "\n\r" < /sol/contract.sol`
echo "contractSource = '${CONTRACT}';" > /sol/contract.js
echo "contract built successfully"
