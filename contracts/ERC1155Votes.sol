// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import '@openzeppelin/contracts/token/ERC1155/ERC1155.sol';
import './Votes.sol';

import 'hardhat/console.sol';

abstract contract ERC1155Votes is ERC1155, Votes {
    /**
     * @dev Must return the voting units held by an account.
     */
    function _getVotingUnits(address account, uint256 id) internal virtual override returns (uint256) {
        return balanceOf(account, id);
    }

    function _afterTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 amount
    ) internal virtual {
        _transferVotingUnits(from, to, tokenId, amount);
    }
}
