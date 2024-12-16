    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.26;

    // Importamos el estándar ERC-20 de OpenZeppelin
    import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

    // Contrato ERC-20: TokenB creado por Don David Segovia
    contract TokenB is ERC20 {
        // Constructor que inicializa el token
        constructor() ERC20("TokenB", "TKB") {
            // Se generan 1 millón de tokens y se asignan al creador del contrato
            _mint(msg.sender, 1000000 * 10**18);
        }
    }