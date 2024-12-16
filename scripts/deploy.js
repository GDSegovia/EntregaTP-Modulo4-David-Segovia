const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Desplegando contratos con la cuenta:", deployer.address);

    // Verificar el balance de la cuenta antes de desplegar
    let balance = await deployer.getBalance();
    console.log("Balance de la cuenta antes de desplegar:", ethers.utils.formatEther(balance));

    if (balance.lt(ethers.utils.parseEther("1"))) {
        console.log("No hay suficiente saldo en la cuenta.");
        // Aquí puedes agregar alguna acción para enviar ETH si es necesario
    }

    // Desplegar los contratos
    const TokenA = await ethers.getContractFactory("TokenA");
    const tokenA = await TokenA.deploy();
    console.log("TokenA desplegado en:", tokenA.address);

    const TokenB = await ethers.getContractFactory("TokenB");
    const tokenB = await TokenB.deploy();
    console.log("TokenB desplegado en:", tokenB.address);

    const SimpleDEX = await ethers.getContractFactory("SimpleDEX");
    const simpleDEX = await SimpleDEX.deploy(tokenA.address, tokenB.address);
    console.log("SimpleDEX desplegado en:", simpleDEX.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });