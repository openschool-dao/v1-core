//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract osERC20 {
    string private _name;
    string private _symbol;
    
    constructor(string memory name_, string memory symbol_) {
        _name = name_;
        _symbol = symbol_;
    }

    function name() public view returns (string memory) {
        return _name;
    }

    function symbol() public view returns (string memory){
        return _symbol;
    }

    function decimal() public pure returns (uint8){
        return 18;
    }

    /*TODO: 
        - mint new token for addr
            - set (+) totalSupply
            - set (+) balances (mapping)
        - burn token form addr
            - set (-) totalSupply addr
            - set (-) balances
        - tranfert token
    */
}
