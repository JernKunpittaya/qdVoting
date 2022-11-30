// SPDX-License-Identifier: MIT
pragma solidity >=0.4.0 <0.9.0;
pragma experimental ABIEncoderV2;
//second line is necessary to store an event array of options structs 

//test
contract Poll {



    struct Option {
        //to clarify this is an option inside an event, TO DO: replace Item with Option in other files
        //address payable owner; //this can also be the admin
        //uint256 amount; //used to reward the creator of option, entire amount transferred to creator once it wins 
        bytes32 title;
        //string imageHash; // IPFS cid, TO DO: how to send this as argument 
        //string description;
        mapping(address => uint256) positiveVotes; // user => weight
        mapping(address => uint256) negativeVotes; // user => weight
        uint256 totalPositiveWeight;
        uint256 totalNegativeWeight;
    }

    struct Voter {
        uint256 currentCredits;
    }

    //constructor for the whole contract creates a new event contract, not new option 
     constructor(address _admin, string memory _title, address[] memory  _eligibles, string[] memory _options) {

       //from Jern: parameters he used in Factory
       factory= msg.sender;
       admin = _admin;
       title = _title;
       eligibles = _eligibles;
       options = _options;
       //optionCount = new uint[](_options.length);
       //isValid = true; //for expiration if we get to it

        //TO DO: make an array of structs containing options 
       function loop(
       ) public returns(uint[] memory){
        for(uint i=0; i<options.length; i++){
            createOption();
     }
      return data;
    }

   }

       //public instance variables in original contract 
       uint256 public constant voteCost = 10_000_000_000; // wei
       mapping(uint256 => Option) public options; // optionId => id
       uint256 public optionCount = 0; // also next optionId
       event OptionCreated(uint256 optionId);
       event Voted(uint256 optionId, uint256 weight, bool positive);

    function currentWeight(
        uint256 optionId,
        address addr,
        bool isPositive
    ) public view returns (uint256) {
        if (isPositive) {
            return options[optionId].positiveVotes[addr];
        } else {
            return options[optionId].negativeVotes[addr];
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

    function createOption(
        bytes32 title
        //string memory imageHash,
        //string memory description
    ) public {
        uint256 optionId = optionCount++;
        Option storage option = options[optionId];
        //option.owner = payable(msg.sender);
        option.title = title;
        //option.imageHash = imageHash;
        //option.description = description;
        emit OptionCreated(optionId);
    }

    function positiveVote(uint256 optionId, uint256 weight) public payable {

        while(voter.currentCredits <100){
        Option storage option = options[optionId];
        require(msg.sender != option.owner); // owners cannot vote on their own options

        uint256 currWeight = option.positiveVotes[msg.sender];
        if (currWeight == weight) {
            return; // no need to process further if vote has not changed
        }

        uint256 cost = calcCost(currWeight, weight);
        require(msg.value >= cost); // msg.value must be enough to cover the cost

        option.positiveVotes[msg.sender] = weight;
        option.totalPositiveWeight += weight - currWeight;

        // weight cannot be both positive and negative simultaneously
        option.totalNegativeWeight -= option.negativeVotes[msg.sender];
        option.negativeVotes[msg.sender] = 0;

        option.amount += msg.value; // reward creator of option for their contribution

        emit Voted(optionId, weight, true);
        voter.currentCredits += cost;
        }
    }

    function negativeVote(uint256 optionId, uint256 weight) public payable {

        while(voter.currentCredits <100){
        Option storage option = options[optionId];
        require(msg.sender != option.owner);

        uint256 currWeight = option.negativeVotes[msg.sender];
        if (currWeight == weight) {
            return; // no need to process further if vote has not changed
        }

        uint256 cost = calcCost(currWeight, weight);
        require(msg.value >= cost); // msg.value must be enough to cover the cost

        option.negativeVotes[msg.sender] = weight;
        option.totalNegativeWeight += weight - currWeight;

        // weight cannot be both positive and negative simultaneously
        option.totalPositiveWeight -= option.positiveVotes[msg.sender];
        option.positiveVotes[msg.sender] = 0;

        // distribute voting cost to every option except for this one
        uint256 reward = msg.value / (optionCount - 1);
        for (uint256 i = 0; i < optionCount; i++) {
            if (i != optionId) options[i].amount += reward;
        }

        emit Voted(optionId, weight, false);
        voter.currentCredits -= cost;
        }
    }

    // function claim(uint256 optionId) public {
    //     Option storage option = options[optionId];
    //     require(msg.sender == option.owner);
    //     option.owner.transfer(option.amount);
    //     option.amount = 0;
    // }
}
