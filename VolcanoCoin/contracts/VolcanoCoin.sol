// contracts/MyContract.sol
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";

contract VolcanoCoin is Ownable{
    uint256 public totalSupply;
    // address public owner;

    struct Payment {
        address recipient;
        uint256 amount;
    }
    mapping (address => uint256) public balances;
    Payment[] public payments;
    mapping(address => Payment[]) public transfersMap;

    event SupplyChanged(uint256 newSupply, address indexed whoChanged);
    event Transfer(address indexed receiver, uint256 amount);
    /*
    modifier onlyOwner() {
        require(msg.sender == owner, "Come on, you cannod possibly do that!");
        _;
    }
    */
    
    constructor() {
        totalSupply = 10_000;
        // owner = msg.sender;
        balances[owner()] = totalSupply;
    }

    function getSupply() public view returns (uint256){
        return totalSupply;
    }

    function addSupply() public onlyOwner{
        totalSupply += 1000;
        balances[owner()] += 1000;
        emit SupplyChanged(totalSupply, msg.sender);
    }

    function transfer(address receiver, uint256 amount) public {
        require(balances[msg.sender] >= amount, "Not enough fund in your wallet!");
        require(receiver != address(0), "ERC20: approve to the zero address");
        balances[msg.sender] -= amount;
        balances[receiver] += amount;
        payments.push(Payment({recipient: receiver, amount: amount}));
        transfersMap[msg.sender].push(Payment({recipient: receiver, amount: amount}));
        emit Transfer(receiver, amount);
    }

    function getTransferHistory(uint id) public view returns (Payment memory){
        return transfersMap[msg.sender][id];
    }

}
