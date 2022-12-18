// SPDX-License-Identifier: MIT
pragma solidity >=0.4.0 <0.9.0;

//test
contract Poll {
    struct Option {
        string title;
        mapping(address => uint256) positiveVotes; // user => weight
        mapping(address => uint256) negativeVotes; // user => weight
        uint256 totalPositiveWeight;
        uint256 totalNegativeWeight;
    }
    uint256 public deployTime;
    uint256 public validSeconds;
    mapping(uint256 => Option) public options; //
    uint256 public optionCount;

    uint256 public creditLimit = 100;
    uint256 public constant voteCost = 1; // base = 1 credit limit
    mapping(address => uint256) public creditVoters;

    address factory;
    address public admin;
    string public title;
    address[] eligibles;

    event Voted(uint256 optionId, uint256 weight, bool isPositive);

    constructor(
        address _admin,
        string memory _title,
        address[] memory _eligibles,
        string[] memory _opTitle,
        uint256 _validMinutes
    ) {
        factory = msg.sender;
        admin = _admin;
        title = _title;
        eligibles = _eligibles;
        optionCount = _opTitle.length;
        deployTime = block.timestamp;
        validSeconds = _validMinutes * 60;
        for (uint i = 0; i < _eligibles.length; i++) {
            creditVoters[_eligibles[i]] = creditLimit;
        }
        for (uint optionIndex = 0; optionIndex < _opTitle.length; optionIndex++) {
            Option storage option = options[optionIndex];
            option.title = _opTitle[optionIndex];
        }
    }

    function calcCost(uint256 weight) public pure returns (uint256) {
        return weight * weight * voteCost;
    }

    function existsEligible(address voter) public view returns (bool) {
        for (uint i = 0; i < eligibles.length; i++) {
            if (eligibles[i] == voter) {
                return true;
            }
        }
        return false;
    }

    function calMaxNeg() public view returns (uint256) {
        uint maxNeg = 0;
        for (uint i = 0; i < optionCount; i++) {
            if (options[i].totalNegativeWeight > maxNeg) {
                maxNeg = options[i].totalNegativeWeight;
            }
        }
        return maxNeg;
    }

    function positiveVote(address voter, uint256 optionId, uint256 weight) public payable {
        require(msg.sender == factory, "Not called via Fac");
        require(block.timestamp <= deployTime + validSeconds, "Poll time expired!");
        require(existsEligible(voter), "Not Eligible");

        Option storage option = options[optionId];
        bool positive = option.positiveVotes[voter] > 0 ? true : false;
        uint256 currWeight = positive ? option.positiveVotes[voter] : option.negativeVotes[voter];
        require(
            creditVoters[voter] + calcCost(currWeight) >= calcCost(weight),
            "Not enough credit"
        );
        creditVoters[voter] = creditVoters[voter] + calcCost(currWeight) - calcCost(weight);
        option.positiveVotes[voter] = weight;
        option.negativeVotes[voter] = 0;
        if (positive) {
            option.totalPositiveWeight = option.totalPositiveWeight + weight - currWeight;
        } else {
            option.totalPositiveWeight += weight;
            option.totalNegativeWeight -= currWeight;
        }
        emit Voted(optionId, weight, true);
    }

    function negativeVote(address voter, uint256 optionId, uint256 weight) public payable {
        require(msg.sender == factory, "Not called via Fac");
        require(block.timestamp <= deployTime + validSeconds, "Poll time expired!");
        require(existsEligible(voter), "Not eligible");

        Option storage option = options[optionId];
        bool positive = option.positiveVotes[voter] > 0 ? true : false;
        uint256 currWeight = positive ? option.positiveVotes[voter] : option.negativeVotes[voter];

        require(
            creditVoters[voter] + calcCost(currWeight) >= calcCost(weight),
            "Not enough credit"
        );
        creditVoters[voter] = creditVoters[voter] + calcCost(currWeight) - calcCost(weight);
        option.positiveVotes[voter] = 0;
        option.negativeVotes[voter] = weight;
        if (positive) {
            option.totalPositiveWeight -= currWeight;
            option.totalNegativeWeight += weight;
        } else {
            option.totalNegativeWeight = option.totalNegativeWeight + weight - currWeight;
        }
        emit Voted(optionId, weight, false);
    }

    function getOpTitle(uint optionId) public view returns (string memory) {
        return options[optionId].title;
    }

    function getOpPositiveWeight(uint optionId) public view returns (uint256) {
        return options[optionId].totalPositiveWeight;
    }

    function getOpNegativeWeight(uint optionId) public view returns (uint256) {
        return options[optionId].totalNegativeWeight;
    }

    function getCredit(address voter) public view returns (uint256) {
        return creditVoters[voter];
    }

    function getResult() public view returns (uint256) {
        // Need condition to be called only when time expired
        require(block.timestamp > deployTime + validSeconds, "Poll time not expired yet!");
        uint winner = 0;
        uint winnerAdjustedWeight = 0;
        for (uint i = 0; i < optionCount; i++) {
            if (
                options[i].totalPositiveWeight + calMaxNeg() - options[i].totalNegativeWeight >
                winnerAdjustedWeight
            ) {
                winner = i;
                winnerAdjustedWeight =
                    options[i].totalPositiveWeight +
                    calMaxNeg() -
                    options[i].totalNegativeWeight;
            }
        }
        return winner;
    }

    function getVoterOpPositiveWeight(uint optionId, address voter) public view returns (uint256) {
        return options[optionId].positiveVotes[voter];
    }

    function getVoterOpNegativeWeight(uint optionId, address voter) public view returns (uint256) {
        return options[optionId].negativeVotes[voter];
    }

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
}
