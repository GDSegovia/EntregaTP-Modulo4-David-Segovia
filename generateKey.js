const { ethers } = require("ethers");

// Generar una nueva wallet (con clave privada)
const wallet = ethers.Wallet.createRandom();

// Mostrar la clave privada
console.log("Clave privada:", wallet.privateKey);
console.log("Dirección de la wallet:", wallet.address);
