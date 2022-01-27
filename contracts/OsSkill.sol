// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts/utils/Strings.sol';

import './libraries/Base64.sol';

import 'hardhat/console.sol';

/**
 * @dev New skill minting must be allowed through a voting contract.
 * to interact with another contract use solidity Interface.
 * todo: function to add a new skill in _supportedSkills
 */

contract OsSkill is ERC721 {
    /**
     * @notice skillIndex in Skill define the type of the NFT
     * Ex: Python skill NFT is 1 so all the NFTs for python will be 1
     */

    struct Skill {
        uint skillIndex;
        string name;
        string imageURI;
        address recipient;
    }

    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;
    Skill[] private _supportedSkills;
    mapping(uint256 => Skill) private _idsToSkills;
    mapping(address => uint256) private _ownersToSkillIds;

    event SkillMinted(address indexed recipient, uint256 indexed skillIndex, uint256 newSkillId);

    /**
     * @notice Constructor populates the default skills available to be minted
     * @notice we initialize tokenId to start minting with an id of 1.
     *
     * @dev We should remove the issuance of skills in the constructor but only
     * invoke the addSupportedSkill function.
     */

    constructor(string[] memory skillNames, string[] memory skillImageURIs) ERC721('OpenSchool Skills', 'SKILL') {
        for (uint i = 0; i < skillNames.length; i += 1) {
            _supportedSkills.push(
                Skill({ skillIndex: i, name: skillNames[i], imageURI: skillImageURIs[i], recipient: address(0) })
            );
        }

        _tokenIds.increment();
    }

    function mintSkill(address recipient, uint skillIndex) external {
        uint256 newSkillId = _tokenIds.current();
        _safeMint(recipient, newSkillId);

        Skill memory skill = _supportedSkills[skillIndex];

        _idsToSkills[newSkillId] = Skill({
            skillIndex: skillIndex,
            name: skill.name,
            imageURI: skill.imageURI,
            recipient: recipient
        });

        _tokenIds.increment();

        emit SkillMinted(recipient, skillIndex, newSkillId);
    }

    function supportedSkills() external view returns (Skill[] memory) {
        return _supportedSkills;
    }

    function addSupportedSkill(string memory name, string memory imageURI) external {
        uint256 index = _supportedSkills.length;
        _supportedSkills.push(Skill({ skillIndex: index, name: name, imageURI: imageURI, recipient: address(0) }));
    }

    function tokenURI(uint256 _tokenId) public view override returns (string memory) {
        Skill memory skill = _idsToSkills[_tokenId];

        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "',
                        skill.name,
                        ' OS#',
                        Strings.toString(_tokenId),
                        '", "description": "This NFT certifies his owner master this skill", "image": "',
                        skill.imageURI,
                        '"}'
                    )
                )
            )
        );

        string memory output = string(abi.encodePacked('data:application/json;base64,', json));

        return output;
    }
}
