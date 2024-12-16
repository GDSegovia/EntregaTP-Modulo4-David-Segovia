const { ethers } = require("hardhat");

async function main() {
    // Obtener las cuentas disponibles
    const [sender, receiver] = await ethers.getSigners();

    console.log("Cuenta que envía:", sender.address);
    console.log("Cuenta que recibe:", receiver.address);

    // Definir la cantidad de ETH a transferir (por ejemplo, 1 ETH)
    const amount = ethers.utils.parseEther("1.0"); // 1 ETH

    // Realizar la transacción
    console.log("Enviando", ethers.utils.formatEther(amount), "ETH...");
    const tx = await sender.sendTransaction({
        to: receiver.address,
        value: amount,
    });

    // Esperar a que la transacción se confirme
    console.log("Transacción enviada:", tx.hash);
    await tx.wait();

    console.log("ETH transferido exitosamente.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
