// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import '@openzeppelin/contracts/utils/Timers.sol';
import '@openzeppelin/contracts/utils/math/SafeCast.sol';
import '@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol';
import './votes/IVotes.sol';

// TODO implement ERC165 and IERC165

contract OsVoting is EIP712 {
    using SafeCast for uint256;
    using Timers for Timers.BlockNumber;

    IVotes public immutable token;

    struct ProposalCore {
        Timers.BlockNumber voteStart;
        Timers.BlockNumber voteEnd;
        bool executed;
        bool canceled;
    }

    string private _name;

    mapping(uint256 => ProposalCore) private _proposals;

    constructor(IVotes _token, string memory name_) EIP712(name_, version()) {
        token = _token;
        _name = name_;
    }

    function name() public view virtual returns (string memory) {
        return _name;
    }

    function version() public view virtual returns (string memory) {
        return '1';
    }

    function votingDelay() public pure returns (uint256) {
        return 1; // 1 block
    }

    function votingPeriod() public pure returns (uint256) {
        return 45818; // 1 week
    }

    function hashProposal(
        address target,
        bytes memory data,
        bytes32 descriptionHash
    ) public pure virtual returns (uint256) {
        return uint256(keccak256(abi.encode(target, data, descriptionHash)));
    }

    function propose(
        address target,
        bytes memory data,
        string memory description
    ) public virtual returns (uint256) {
        uint256 proposalId = hashProposal(target, data, keccak256(bytes(description)));

        ProposalCore storage proposal = _proposals[proposalId];
        require(proposal.voteStart.isUnset(), 'Governor: proposal already exists');

        uint64 snapshot = block.number.toUint64() + votingDelay().toUint64();
        uint64 deadline = snapshot + votingPeriod().toUint64();

        proposal.voteStart.setDeadline(snapshot);
        proposal.voteEnd.setDeadline(deadline);

        return proposalId;
    }

    function getVotes(
        uint256 id,
        address account,
        uint256 blockNumber
    ) public view virtual returns (uint256) {
        return token.getPastVotes(id, account, blockNumber);
    }
}
