//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract osERC20 {
    mapping(address => uint256) private _balances;
    uint256 private _totalSupply;
    address private _owner;
    string private _name;
    string private _symbol;

    event Transfer(address indexed from, address indexed to, uint256 amount);

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

    function mint(address account, uint256 amount) external {
        require(msg.sender == _owner, "Mint restricted to owner");
        _balances[account] += amount;
        _totalSupply += amount;
        emit Transfer(address(0), account, amount);
    }

    function burn(address account, uint256 amount) external {
        require(_balances[account] >= amount, "Address balance is too low");
        require(msg.sender == account, "Must be the token owner");
        _balances[account] -= amount;
        _totalSupply -= amount;
        emit Transfer(account, address(0), amount);
    }

    function balanceOf(address account) public view returns (uint256) {
        return _balances[account];
    }

    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }

    function transfer(address to, uint256 amount) external returns (bool) {
        _transfer(msg.sender, to, amount);
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        _transfer(from, to, amount);
        return true;
    }

    function _transfer(address sender, address recipient, uint256 amount) private {
        require( _balances[sender] >= amount, "Address sender balance is too low");
        // TODO: add balances over flow condition
        _balances[sender] -= amount;
        _balances[recipient] += amount;
        emit Transfer(sender, recipient, amount);
    }

    /*TODO:
        - tranfert token
            - under flow 
            - over flow
    */
}