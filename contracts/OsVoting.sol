// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import '@openzeppelin/contracts/utils/Timers.sol';
import '@openzeppelin/contracts/utils/math/SafeCast.sol';
import '@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol';
import '@openzeppelin/contracts/utils/Address.sol';

import './votes/IVotes.sol';
import './IOsVoting.sol';

// TODO implement or remove all the functions: quorum(), getVotesWithParams()

contract OsVoting is ERC165, EIP712, IOsVoting {
    using SafeCast for uint256;
    using Timers for Timers.BlockNumber;

    IVotes public immutable token;

    struct ProposalCore {
        uint256 tokenId;
        Timers.BlockNumber voteStart;
        Timers.BlockNumber voteEnd;
        bool executed;
        bool canceled;
    }
    mapping(uint256 => ProposalCore) private _proposals;

    struct ProposalVote {
        uint256 againstVotes;
        uint256 forVotes;
        uint256 abstainVotes;
        mapping(address => bool) hasVoted;
    }

    mapping(uint256 => ProposalVote) private _proposalVotes;

    string private _name;

    constructor(IVotes _token, string memory name_) EIP712(name_, version()) {
        token = _token;
        _name = name_;
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(IERC165, ERC165) returns (bool) {
        return interfaceId == type(IOsVoting).interfaceId || super.supportsInterface(interfaceId);
    }

    function name() public view virtual override returns (string memory) {
        return _name;
    }

    function version() public view virtual override returns (string memory) {
        return '1';
    }

    function proposalThreshold() public pure override returns (uint256) {
        return 1;
    }

    function quorum(uint256 blockNumber) public pure override returns (uint256) {
        return 3;
    }

    function votingDelay() public pure override returns (uint256) {
        return 1; // 1 block
    }

    function votingPeriod() public pure override returns (uint256) {
        return 5; // 1 week
    }

    function hasVoted(uint256 proposalId, address account) public view virtual override returns (bool) {
        return _proposalVotes[proposalId].hasVoted[account];
    }

    function _quorumReached(uint256 proposalId) internal view virtual returns (bool) {
        ProposalVote storage proposalvote = _proposalVotes[proposalId];
        return quorum(proposalSnapshot(proposalId)) <= proposalvote.forVotes + proposalvote.abstainVotes;
    }

    function _voteSucceeded(uint256 proposalId) internal view virtual returns (bool) {
        ProposalVote storage proposalvote = _proposalVotes[proposalId];

        return proposalvote.forVotes > proposalvote.againstVotes;
    }

    function hashProposal(
        address target,
        bytes memory data,
        bytes32 descriptionHash
    ) public pure virtual override returns (uint256) {
        return uint256(keccak256(abi.encode(target, data, descriptionHash)));
    }

    function state(uint256 proposalId) public view virtual override returns (ProposalState) {
        ProposalCore storage proposal = _proposals[proposalId];

        if (proposal.executed) {
            return ProposalState.Executed;
        }

        if (proposal.canceled) {
            return ProposalState.Canceled;
        }

        uint256 snapshot = proposalSnapshot(proposalId);

        if (snapshot == 0) {
            revert('OsVoting: unknown proposal id');
        }

        if (snapshot >= block.number) {
            return ProposalState.Pending;
        }

        uint256 deadline = proposalDeadline(proposalId);

        if (deadline >= block.number) {
            return ProposalState.Active;
        }

        if (_quorumReached(proposalId) && _voteSucceeded(proposalId)) {
            return ProposalState.Succeeded;
        } else {
            return ProposalState.Defeated;
        }
    }

    function proposalSnapshot(uint256 proposalId) public view virtual override returns (uint256) {
        return _proposals[proposalId].voteStart.getDeadline();
    }

    function proposalDeadline(uint256 proposalId) public view virtual override returns (uint256) {
        return _proposals[proposalId].voteEnd.getDeadline();
    }

    function proposalVotes(uint256 proposalId)
        public
        view
        virtual
        returns (
            uint256 againstVotes,
            uint256 forVotes,
            uint256 abstainVotes
        )
    {
        ProposalVote storage proposalvote = _proposalVotes[proposalId];
        return (proposalvote.againstVotes, proposalvote.forVotes, proposalvote.abstainVotes);
    }

    function propose(
        address target,
        uint256 tokenId,
        bytes memory data,
        string memory description
    ) public virtual override returns (uint256) {
        require(
            getVotes(tokenId, msg.sender, block.number - 1) >= proposalThreshold(),
            'OsVoting: proposer votes below proposal threshold'
        );

        uint256 proposalId = hashProposal(target, data, keccak256(bytes(description)));

        ProposalCore storage proposal = _proposals[proposalId];
        require(proposal.voteStart.isUnset(), 'OsVoting: proposal already exists');

        uint64 snapshot = block.number.toUint64() + votingDelay().toUint64();
        uint64 deadline = snapshot + votingPeriod().toUint64();

        proposal.voteStart.setDeadline(snapshot);
        proposal.voteEnd.setDeadline(deadline);
        proposal.tokenId = tokenId;

        emit ProposalCreated(
            proposalId,
            msg.sender,
            target,
            // signature,
            data,
            tokenId,
            snapshot,
            deadline,
            description
        );

        return proposalId;
    }

    function execute(
        address target,
        bytes memory data,
        bytes32 descriptionHash
    ) public virtual override returns (uint256) {
        uint256 proposalId = hashProposal(target, data, descriptionHash);

        ProposalState status = state(proposalId);
        require(
            status == ProposalState.Succeeded || status == ProposalState.Queued,
            'OsVoting: proposal not successful'
        );
        _proposals[proposalId].executed = true;

        emit ProposalExecuted(proposalId);

        _execute(proposalId, target, data, descriptionHash);

        return proposalId;
    }

    function _execute(
        uint256, /* proposalId */
        address target,
        bytes memory data,
        bytes32 /*descriptionHash*/
    ) internal virtual {
        string memory errorMessage = 'OsVoting: call reverted without message';
        (bool success, bytes memory returndata) = target.call{ value: 0 }(data);
        Address.verifyCallResult(success, returndata, errorMessage);
    }

    function _cancel(
        address target,
        bytes memory data,
        bytes32 descriptionHash
    ) internal virtual returns (uint256) {
        uint256 proposalId = hashProposal(target, data, descriptionHash);
        ProposalState status = state(proposalId);

        require(
            status != ProposalState.Canceled && status != ProposalState.Expired && status != ProposalState.Executed,
            'OsVoting: proposal not active'
        );
        _proposals[proposalId].canceled = true;

        emit ProposalCanceled(proposalId);

        return proposalId;
    }

    function castVote(uint256 proposalId, uint8 support) public virtual override returns (uint256) {
        address voter = msg.sender;
        return _castVote(proposalId, voter, support, '');
    }

    function _castVote(
        uint256 proposalId,
        address account,
        uint8 support,
        string memory reason
    ) internal virtual returns (uint256) {
        ProposalCore storage proposal = _proposals[proposalId];
        require(state(proposalId) == ProposalState.Active, 'OsVoting: vote not currently active');

        uint256 weight = getVotes(proposal.tokenId, account, proposal.voteStart.getDeadline());
        _countVote(proposalId, account, support, weight);

        emit VoteCast(account, proposalId, support, weight, reason);

        return weight;
    }

    function _countVote(
        uint256 proposalId,
        address account,
        uint8 support,
        uint256 weight
    ) internal virtual {
        ProposalVote storage proposalvote = _proposalVotes[proposalId];

        require(!proposalvote.hasVoted[account], 'OsVoting: vote already cast');
        proposalvote.hasVoted[account] = true;

        if (support == uint8(VoteType.Against)) {
            proposalvote.againstVotes += weight;
        } else if (support == uint8(VoteType.For)) {
            proposalvote.forVotes += weight;
        } else if (support == uint8(VoteType.Abstain)) {
            proposalvote.abstainVotes += weight;
        } else {
            revert('OsVoting: invalid value for enum VoteType');
        }
    }

    function getVotes(
        uint256 id,
        address account,
        uint256 blockNumber
    ) public view virtual override returns (uint256) {
        return token.getPastVotes(id, account, blockNumber);
    }

    function _executor() internal view virtual returns (address) {
        return address(this);
    }
}
