//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// hello world

contract osERC20 {
    mapping(address => uint256) private _balances;

    address private _owner;

    uint256 private _totalSupply;

    string private _name;
    string private _symbol;

    event Transfer(address indexed from, address indexed to, uint256 value);

    constructor(string memory name_, string memory symbol_) {
        _name = name_;
        _symbol = symbol_;
        _owner = msg.sender;
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

    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }
    /**
     * @dev must be internal so nobody can mint new token !
     * TODO: Remove require statement if internal function
     */
    function mint(address account, uint256 amount) internal {
        require(_owner == msg.sender);
        _totalSupply += amount;
        _balances[account] += amount;
        emit Transfer(address(0), account, amount);
    }

    /**
     * @dev remove amount from account balance and substract from totalsupply
     * TODO: require that account balance is >= amount
     */
    function burn(address account, uint256 amount) internal {
    }

    /*TODO:
        - mint new token to addr
            - set (+) totalSupply
            - set (+) balances (mapping)
        - burn token from addr
            - set (-) totalSupply addr
            - set (-) balances
        - tranfer token with 2 patterns:
            - private version(admin)
            - public version(decentralized)
    */
}






















