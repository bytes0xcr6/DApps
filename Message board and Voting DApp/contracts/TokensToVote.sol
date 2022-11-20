// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;  

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";


contract TokensToVote is ERC20{

    address private votingDApp;
    address private owner;

    modifier onlyVotingDApp{
        msg.sender == votingDApp;
        _;
    }

    modifier onlyOwner {
        msg.sender == owner;
        _;
    }

    constructor() ERC20("Vote token", "VOTE"){
        owner = msg.sender;
        _mint(address(this), 10000000000 *10**18); //10.000.000.000 + 18 decimals
    }
    

    function setVotingDApp(address _votingDApp) public onlyOwner {
        votingDApp = _votingDApp;
    }

}