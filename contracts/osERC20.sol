// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import './interfaces/IOsERC20.sol';
import 'hardhat/console.sol';

/**
 * @dev we should restrict mint and burn with Ownable library
 * we should look if ownable can work with Governor contracts.
 * Mint and burn will be called by the voting contract named Governor.
 */

contract OsERC20 is IOsERC20 {
    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;

    uint256 private _totalSupply;

    address private _owner;

    string private _name;
    string private _symbol;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    constructor(string memory name_, string memory symbol_) {
        _name = name_;
        _symbol = symbol_;
        _owner = msg.sender;
    }

    function name() public view returns (string memory) {
        return _name;
    }

    function symbol() public view returns (string memory) {
        return _symbol;
    }

    function decimal() public pure returns (uint8) {
        return 18;
    }

    function mint(address account, uint256 amount) public {
        require(msg.sender == _owner, 'Mint restricted to owner');
        _balances[account] += amount;
        _totalSupply += amount;

        emit Transfer(address(0), account, amount);
    }

    function burn(address account, uint256 amount) external {
        uint256 accountBalance = _balances[account];

        require(accountBalance >= amount, 'Address balance is too low');
        require(msg.sender == account, 'Burn restricted to token holder');

        // TODO: handle underflow calculation
        _balances[account] = accountBalance - amount;
        _totalSupply -= amount;

        emit Transfer(account, address(0), amount);
    }

    function balanceOf(address account) public view returns (uint256) {
        return _balances[account];
    }

    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }

    function transfer(address recipient, uint256 amount) public returns (bool) {
        _transfer(msg.sender, recipient, amount);
        return true;
    }

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) public returns (bool) {
        _transfer(sender, recipient, amount);

        uint256 currentAllowance = _allowances[sender][msg.sender];
        require(currentAllowance >= amount, 'Transfer amount exceeds allowance');

        // TODO: handle underflow calculation
        _approve(sender, msg.sender, currentAllowance - amount);

        return true;
    }

    function allowance(address owner, address spender) public view returns (uint256) {
        return _allowances[owner][spender];
    }

    function approve(address spender, uint256 amount) public returns (bool) {
        _approve(msg.sender, spender, amount);
        return true;
    }

    function _approve(
        address owner,
        address spender,
        uint256 amount
    ) internal {
        _allowances[owner][spender] = amount;

        emit Approval(owner, spender, amount);
    }

    function _transfer(
        address sender,
        address recipient,
        uint256 amount
    ) private {
        uint256 senderBalance = _balances[sender];
        require(senderBalance >= amount, 'Address sender balance is too low');
        // TODO: check underflow calculation
        _balances[sender] = senderBalance - amount;
        _balances[recipient] += amount;

        emit Transfer(sender, recipient, amount);
    }
}
