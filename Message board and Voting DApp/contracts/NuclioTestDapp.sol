// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TestDapp {
    address private tokensDApp;
    address private owner;
    string private lastComent;
    uint maxOpenUsers;
    mapping(address => User) addressToUser;
    uint private numRegisteredUsers;

    uint maxSizeProposals;
    string[] private proposalToVote;
    mapping(string => bool) proposalToExists;
    uint numProposals;

    mapping(uint => Proposal) idToProposal;

    struct User {
        uint id;
        bool exists;
        bool banned;
    }

    struct Proposal {
        uint id;
        string message;
        bool exists;
        uint numVotes;
    }

    constructor(address _tokensDApp) {
        owner = msg.sender;
        tokensDApp = _tokensDApp;
        maxOpenUsers = 10;
        User memory user = addressToUser[msg.sender];
        user.exists = true;
        user.id = numRegisteredUsers;
        IERC20(_tokensDApp).transfer(msg.sender, 1000 * 10**18); //1000 + 18 decimals
        numRegisteredUsers++;
        maxSizeProposals = 5;
    }

    modifier isOwner() {
        require(msg.sender == owner, "You are not the owner");
        _;
    }

    modifier isRegistered() {
        require(addressToUser[msg.sender].exists, "You are not registered");
        _;
    }

    modifier isNotOwnerAndRegistered() {
        require(
            msg.sender != owner && addressToUser[msg.sender].exists,
            "Access limited to registered users. Banned to owner"
        );
        _;
    }

    modifier isProposalRegistered(uint _id) {
        require(idToProposal[_id].exists, "The proposal does not exist");
        _;
    }

    function setLastComent(string memory _lastComent)
        public
        isRegistered
        returns (bool success)
    {
        lastComent = _lastComent;
        return true;
    }

    function getLastComent() public view returns (string memory) {
        return lastComent;
    }

    function IsRegisteredUser(address _user)
        public
        view
        returns (bool registered)
    {
        registered = addressToUser[_user].exists;
    }

    function registerOpenUser() public {
        require(
            numRegisteredUsers < maxOpenUsers,
            "You have reached the maximum amount of registered users, contact the provider"
        );
        require(!addressToUser[msg.sender].exists, "User already registered");
        User storage user = addressToUser[msg.sender];
        user.exists = true;
        user.id = numRegisteredUsers;
        IERC20(tokensDApp).transfer(msg.sender, 1000 * 10**18); //1000 + 18 decimals
        numRegisteredUsers++;
    }

    function setMaxOpenUsers(uint _maxOpenUsers) public isOwner {
        maxOpenUsers = _maxOpenUsers;
    }

    function setMaxProposals(uint _maxProposals) public isOwner {
        maxSizeProposals = _maxProposals;
    }

    function addProposal(string memory _proposal)
        public
        isNotOwnerAndRegistered
    {
        require(
            maxSizeProposals <= 5,
            "You have reached the maximum proposals"
        );
        require(
            bytes(_proposal).length < maxSizeProposals,
            "The proposal exceeds the length limit"
        );
        require(!proposalToExists[_proposal], "The proposal already exists");
        proposalToVote.push(_proposal);
        proposalToExists[_proposal] = true;
        idToProposal[numProposals].message = _proposal;
        idToProposal[numProposals].id = numProposals;
        numProposals++;
    }

    function getProposals() public view returns (string[] memory _proposals) {
        return _proposals = proposalToVote;
    }

    function isRegisteredProposal(string memory _proposal)
        public
        view
        returns (bool _isRegistered)
    {
        _isRegistered = proposalToExists[_proposal];
    }

    // - or = 1000 tokens -> 10 vote || + or = 5000 tokens -> 100 votes
    function voteProposal(uint _id)
        public
        isRegistered
        isProposalRegistered(_id)
    {
        uint balanceTokens = IERC20(tokensDApp).balanceOf(msg.sender);
        uint8 voteWeight;

        if (balanceTokens < 1000) {
            voteWeight = 10;
        } else {
            voteWeight = 100;
        }

        idToProposal[_id].numVotes += voteWeight;
    }

    function checkVotes() public view returns (uint) {
        uint winnerID;
        for (uint i; i < proposalToVote.length; i++) {
            if (idToProposal[i].numVotes > winnerID) {
                winnerID = idToProposal[i].numVotes;
            }
        }
        return winnerID;
    }
}
