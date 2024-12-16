module.exports = {
  solidity: "0.8.26",  // Versión de Solidity
  networks: {
    localhost: {
      url: "http://127.0.0.1:8546",  // Asegúrate de que el puerto esté correcto
      accounts: [
        "0x11e7fe078022dd8648d1b52e2c506fc627281183206810fe396f0f1c0e492398"  // Tu clave privada
      ]
    }
  }
};

