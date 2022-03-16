// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import '@openzeppelin/contracts/token/ERC1155/ERC1155.sol';
import '@openzeppelin/contracts/governance/utils/Votes.sol';

abstract contract ERC1155Votes is ERC1155, Votes {

    function _getVotingUnits(address account, uint256 id) internal virtual returns (uint256) {
        return balanceOf(account, id);
    }

    /**
     * @dev declared only to override from Votes. Not compatible with ERC1155. 
     */
    function _getVotingUnits(address account) internal virtual override returns (uint256) {
        return 0;
    }
}