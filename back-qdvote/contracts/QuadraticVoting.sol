// SPDX-License-Identifier: MIT
pragma solidity >=0.4.0 <0.9.0;

//test
contract QuadraticVoting {
    struct Item {
        address payable owner;
        uint256 amount;
        bytes32 title;
        // string imageHash; // IPFS cid
        string description;
        mapping(address => uint256) positiveVotes; // user => weight
        mapping(address => uint256) negativeVotes; // user => weight
        uint256 totalPositiveWeight;
        uint256 totalNegativeWeight;
        mapping(uint256 => Proposal) Proposals;
    }

        struct Proposal {
        address creator;
        uint256 yesVotes;
        uint256 noVotes;
        string description;
        address[] voters;
        uint expirationTime;
        mapping(address => Voter) voterInfo;
    }

        struct Voter {
        bool hasVoted;
        bool vote;
        uint256 weight;
    }

    uint256 public constant voteCost = 10_000_000_000; // wei

    mapping(uint256 => Item) public items; // itemId => id
    uint256 public itemCount = 0; // also next itemId

    event ItemCreated(uint256 itemId);
    event Voted(uint256 itemId, uint256 weight, bool positive);

    function currentWeight(
        uint256 itemId,
        address addr,
        bool isPositive
    ) public view returns (uint256) {
        if (isPositive) {
            return items[itemId].positiveVotes[addr];
        } else {
            return items[itemId].negativeVotes[addr];
        }
    }

    function calcCost(uint256 currWeight, uint256 weight)
        public
        pure
        returns (uint256)
    {
        if (currWeight > weight) {
            return weight * weight * voteCost; // cost is always quadratic
        } else if (currWeight < weight) {
            // this allows users to save on costs if they are increasing their vote
            // example: current weight is 3, they want to change it to 5
            // this would cost 16x (5 * 5 - 3 * 3) instead of 25x the vote cost
            return (weight * weight - currWeight * currWeight) * voteCost;
        } else {
            return 0;
        }
    }

    function createItem(
        bytes32 title,
        //string memory imageHash,
        string memory description
    ) public {
        uint256 itemId = itemCount++;
        Item storage item = items[itemId];
        item.owner = payable(msg.sender);
        item.title = title;
        //item.imageHash = imageHash;
        item.description = description;
        emit ItemCreated(itemId);
    }

    function positiveVote(uint256 itemId, uint256 weight) public payable {
        require(
            !userHasVoted(_ProposalID, msg.sender),
            "user already voted on this proposal"
        );
        require(
            getProposalExpirationTime(_ProposalID) > now,
            "for this proposal, the voting time expired"
        );
        
        Item storage item = items[itemId];
        require(msg.sender != item.owner); // owners cannot vote on their own items

        uint256 currWeight = item.positiveVotes[msg.sender];
        if (currWeight == weight) {
            return; // no need to process further if vote has not changed
        }

        uint256 cost = calcCost(currWeight, weight);
        require(msg.value >= cost); // msg.value must be enough to cover the cost

        item.positiveVotes[msg.sender] = weight;
        item.totalPositiveWeight += weight - currWeight;

        // weight cannot be both positive and negative simultaneously
        item.totalNegativeWeight -= item.negativeVotes[msg.sender];
        item.negativeVotes[msg.sender] = 0;

        item.amount += msg.value; // reward creator of item for their contribution

        emit Voted(itemId, weight, true);
        }
    }

    function negativeVote(uint256 itemId, uint256 weight) public payable {
        Item storage item = items[itemId];
        require(msg.sender != item.owner);

        uint256 currWeight = item.negativeVotes[msg.sender];
        if (currWeight == weight) {
            return; // no need to process further if vote has not changed
        }

        uint256 cost = calcCost(currWeight, weight);
        require(msg.value >= cost); // msg.value must be enough to cover the cost

        item.negativeVotes[msg.sender] = weight;
        item.totalNegativeWeight += weight - currWeight;

        // weight cannot be both positive and negative simultaneously
        item.totalPositiveWeight -= item.positiveVotes[msg.sender];
        item.positiveVotes[msg.sender] = 0;

        // distribute voting cost to every item except for this one
        uint256 reward = msg.value / (itemCount - 1);
        for (uint256 i = 0; i < itemCount; i++) {
            if (i != itemId) items[i].amount += reward;
        }

        emit Voted(itemId, weight, false);
    }

    function claim(uint256 itemId) public {
        Item storage item = items[itemId];
        require(msg.sender == item.owner);
        item.owner.transfer(item.amount);
        item.amount = 0;
    }
}
