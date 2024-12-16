// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

// Importamos la interfaz del estándar ERC-20
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// Contrato SimpleDEX creado por Don David Segovia
contract SimpleDEX {
    // Variables para almacenar las direcciones de los tokens del pool
    IERC20 public tokenA;
    IERC20 public tokenB;

    // Reservas actuales de los tokens en el pool
    uint256 public reserveA;
    uint256 public reserveB;

    // Dirección del propietario del contrato
    address public owner;

    // Eventos para notificar acciones importantes
    event LiquidityAdded(address indexed provider, uint256 amountA, uint256 amountB);
    event LiquidityRemoved(address indexed provider, uint256 amountA, uint256 amountB);
    event Swap(address indexed user, address tokenIn, address tokenOut, uint256 amountIn, uint256 amountOut);

    // Modificador para funciones restringidas al propietario
    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    // Constructor: inicializa los tokens del pool y asigna el propietario
    constructor(address _tokenA, address _tokenB) {
        tokenA = IERC20(_tokenA);
        tokenB = IERC20(_tokenB);
        owner = msg.sender;
    }

    // Función para añadir liquidez al pool (solo el propietario puede hacerlo)
    function addLiquidity(uint256 amountA, uint256 amountB) external onlyOwner {
        require(amountA > 0 && amountB > 0, "Amounts must be greater than zero");

        // Transferir los tokens al contrato
        tokenA.transferFrom(msg.sender, address(this), amountA);
        tokenB.transferFrom(msg.sender, address(this), amountB);

        // Actualizar las reservas
        reserveA += amountA;
        reserveB += amountB;

        emit LiquidityAdded(msg.sender, amountA, amountB);
    }

    // Función para intercambiar TokenA por TokenB
    function swapAforB(uint256 amountAIn) external {
        require(amountAIn > 0, "Amount must be greater than zero");

        // Calcular la cantidad de TokenB que se recibirá
        uint256 amountBOut = (reserveB * amountAIn) / (reserveA + amountAIn);
        require(amountBOut > 0, "Invalid swap amount");

        // Transferir tokens entre el usuario y el contrato
        tokenA.transferFrom(msg.sender, address(this), amountAIn);
        tokenB.transfer(msg.sender, amountBOut);

        // Actualizar las reservas
        reserveA += amountAIn;
        reserveB -= amountBOut;

        emit Swap(msg.sender, address(tokenA), address(tokenB), amountAIn, amountBOut);
    }

    // Función para intercambiar TokenB por TokenA
    function swapBforA(uint256 amountBIn) external {
        require(amountBIn > 0, "Amount must be greater than zero");

        // Calcular la cantidad de TokenA que se recibirá
        uint256 amountAOut = (reserveA * amountBIn) / (reserveB + amountBIn);
        require(amountAOut > 0, "Invalid swap amount");

        // Transferir tokens entre el usuario y el contrato
        tokenB.transferFrom(msg.sender, address(this), amountBIn);
        tokenA.transfer(msg.sender, amountAOut);

        // Actualizar las reservas
        reserveB += amountBIn;
        reserveA -= amountAOut;

        emit Swap(msg.sender, address(tokenB), address(tokenA), amountBIn, amountAOut);
    }

    // Función para retirar liquidez del pool (solo el propietario puede hacerlo)
    function removeLiquidity(uint256 amountA, uint256 amountB) external onlyOwner {
        require(amountA > 0 && amountB > 0, "Amounts must be greater than zero");
        require(amountA <= reserveA && amountB <= reserveB, "Insufficient reserves");

        // Transferir tokens al propietario
        tokenA.transfer(msg.sender, amountA);
        tokenB.transfer(msg.sender, amountB);

        // Actualizar las reservas
        reserveA -= amountA;
        reserveB -= amountB;

        emit LiquidityRemoved(msg.sender, amountA, amountB);
    }

    // Función para obtener el precio relativo entre los tokens
    function getPrice(address _token) external view returns (uint256) {
        if (_token == address(tokenA)) {
            return reserveB / reserveA; // Precio de TokenA en términos de TokenB
        } else if (_token == address(tokenB)) {
            return reserveA / reserveB; // Precio de TokenB en términos de TokenA
        } else {
            revert("Invalid token address");
        }
    }
}