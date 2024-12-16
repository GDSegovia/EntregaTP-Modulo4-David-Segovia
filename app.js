// Conectar con MetaMask y Web3.js
let web3;
let contract;
let account;

// Dirección del contrato desplegado (deberías cambiarla a la dirección real de tu contrato)
const contractAddress = "0x2b1d7f3f8041ef4a048069e8c701ab26b00bcb32"; 

// ABI del contrato
const contractABI = [
    {
        "constant": true,
        "inputs": [],
        "name": "reserveA",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "amountA",
                "type": "uint256"
            },
            {
                "name": "amountB",
                "type": "uint256"
            }
        ],
        "name": "addLiquidity",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "amountA",
                "type": "uint256"
            },
            {
                "name": "amountB",
                "type": "uint256"
            }
        ],
        "name": "removeLiquidity",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "amountA",
                "type": "uint256"
            }
        ],
        "name": "swapAforB",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "amountB",
                "type": "uint256"
            }
        ],
        "name": "swapBforA",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "getPrice",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }
];

window.addEventListener('load', async () => {
    // Verificar si MetaMask está instalado
    if (typeof window.ethereum !== 'undefined') {
        web3 = new Web3(window.ethereum);
        try {
            // Solicitar acceso a la cuenta de MetaMask
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            account = (await web3.eth.getAccounts())[0];
            document.getElementById("account").textContent = `Cuenta conectada: ${account}`;

            // Conectar con el contrato
            contract = new web3.eth.Contract(contractABI, contractAddress);
            console.log("Contrato conectado:", contract);

            // Mostrar reservaA
            checkLiquidity();

        } catch (error) {
            console.error("Error al conectar con MetaMask", error);
        }
    } else {
        console.log("MetaMask no está instalado");
    }
});

// Función para añadir liquidez
document.getElementById("addLiquidity").addEventListener("click", async () => {
    const amountA = document.getElementById("amountA").value;
    const amountB = document.getElementById("amountB").value;

    if (!amountA || !amountB) {
        alert("Por favor ingresa las cantidades de A y B");
        return;
    }

    try {
        const receipt = await contract.methods.addLiquidity(amountA, amountB).send({ from: account });
        console.log('Liquidez añadida:', receipt);
    } catch (error) {
        console.error('Error al añadir liquidez:', error);
    }
});

// Función para eliminar liquidez
document.getElementById("removeLiquidity").addEventListener("click", async () => {
    const removeAmountA = document.getElementById("removeAmountA").value;
    const removeAmountB = document.getElementById("removeAmountB").value;

    if (!removeAmountA || !removeAmountB) {
        alert("Por favor ingresa las cantidades de A y B");
        return;
    }

    try {
        const receipt = await contract.methods.removeLiquidity(removeAmountA, removeAmountB).send({ from: account });
        console.log('Liquidez eliminada:', receipt);
    } catch (error) {
        console.error('Error al eliminar liquidez:', error);
    }
});

// Función para intercambiar A por B
document.getElementById("swapAforB").addEventListener("click", async () => {
    const swapAmount = document.getElementById("swapAmount").value;

    if (!swapAmount) {
        alert("Por favor ingresa la cantidad de A");
        return;
    }

    try {
        const receipt = await contract.methods.swapAforB(swapAmount).send({ from: account });
        console.log('A por B intercambiado:', receipt);
    } catch (error) {
        console.error('Error al intercambiar A por B:', error);
    }
});

// Función para intercambiar B por A
document.getElementById("swapBforA").addEventListener("click", async () => {
    const swapAmount = document.getElementById("swapAmount").value;

    if (!swapAmount) {
        alert("Por favor ingresa la cantidad de B");
        return;
    }

    try {
        const receipt = await contract.methods.swapBforA(swapAmount).send({ from: account });
        console.log('B por A intercambiado:', receipt);
    } catch (error) {
        console.error('Error al intercambiar B por A:', error);
    }
});

// Función para obtener el precio
document.getElementById("getPrice").addEventListener("click", async () => {
    try {
        const price = await contract.methods.getPrice().call();
        document.getElementById("price").textContent = `Precio: ${price}`;
    } catch (error) {
        console.error('Error al obtener el precio:', error);
    }
});

// Función para verificar la liquidez disponible en la reserva A
async function checkLiquidity() {
    try {
        const reserveA = await contract.methods.reserveA().call();
        console.log('Reserva A:', reserveA);
        if (reserveA > 0) {
            document.getElementById("price").textContent = `Reserva A: ${reserveA}`;
        } else {
            document.getElementById("price").textContent = 'No hay liquidez en la reserva A';
        }
    } catch (error) {
        console.error('Error al obtener reserva A:', error);
    }
}

// Verificar la liquidez
checkLiquidity();

// Asegurarse de haber aprobado el contrato para gastar los tokens
const tokenContract = new web3.eth.Contract(tokenABI, tokenAddress);
const amount = web3.utils.toWei("100", "ether"); // Cantidad de tokens a aprobar

tokenContract.methods.approve(contractAddress, amount).send({ from: userAccount })
  .on('transactionHash', function(hash){
    console.log("Aprobación enviada: " + hash);
  })
  .on('receipt', function(receipt){
    console.log("Aprobación completada", receipt);
  })
  .on('error', console.error);
