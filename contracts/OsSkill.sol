// SPDX-License-Identifier: MIT

/**
  /$$$$$$  /$$       /$$ /$$ /$$
 /$$__  $$| $$      |__/| $$| $$
| $$  \__/| $$   /$$ /$$| $$| $$
|  $$$$$$ | $$  /$$/| $$| $$| $$
 \____  $$| $$$$$$/ | $$| $$| $$
 /$$  \ $$| $$_  $$ | $$| $$| $$
|  $$$$$$/| $$ \  $$| $$| $$| $$
 \______/ |__/  \__/|__/|__/|__/
*/

pragma solidity ^0.8.6;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC1155/ERC1155.sol';
import '@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol';
import '@openzeppelin/contracts/utils/Strings.sol';

import './ERC1155Votes.sol';
import './libraries/Base64.sol';

// standard function "uri" must be implemented
// metadataURI must be implemented for opensea, compatibility
// https://docs.opensea.io/docs/metadata-standards#metadata-structure
// we may use openzeppelin's ERC1155Supply.sol to count votes.

contract OsSkill is ERC1155, Ownable, EIP712, ERC1155Votes {
    string public symbol;

    struct Skill {
        string name;
        string imageURI;
    }
    Skill[] private _skills;

    constructor(string memory uri) ERC1155(uri) EIP712('OpenSchool Skills', '1') {
        symbol = 'SKILL';
    }

    function skills() external view returns (Skill[] memory) {
        return _skills;
    }

    function addSkill(string memory name, string memory imageURI) external onlyOwner {
        _skills.push(Skill({ name: name, imageURI: imageURI }));
    }

    function mint(
        address to,
        uint256 id,
        bytes memory data
    ) external onlyOwner {
        require(_skills.length >= 1, 'OsSkill: skill does not exist');
        require(id <= _skills.length - 1, 'OsSkill: id do not match with skills');

        _mint(to, id, 1, data);

        _afterTokenTransfer(address(0), to, id, 1);
    }

    function burn(address from, uint256 id) external {
        require(msg.sender == from, 'OsSkill: caller is not owner of this id');

        _burn(from, id, 1);

        _afterTokenTransfer(from, address(0), id, 1);
    }

    function tokenURI(uint256 tokenId) public view returns (string memory) {
        Skill memory skill = _skills[tokenId];

        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "',
                        skill.name,
                        '#',
                        Strings.toString(tokenId),
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

    function getSkill(uint256 id) public view returns (string memory name, string memory imageURI) {
        Skill memory skill = _skills[id];
        return (skill.name, skill.imageURI);
    }
}
