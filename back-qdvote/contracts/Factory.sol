// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.0 <0.9.0;
import "./Poll.sol";

contract Factory {
    Poll[] public PollArray;
    bool[] public isActive;
    uint256[] public results;
    event PollCreated(string _title);
    //dummy for creating tx to keep block in localhost moving wen getResult.
    uint256 dummy = 0;

    function createPoll(
        string memory _title,
        address[] memory _eligibles,
        string[] memory _opTitle,
        uint256 _validMinutes
    ) public {
        PollArray.push(new Poll(msg.sender, _title, _eligibles, _opTitle, _validMinutes));
        emit PollCreated(_title);
        isActive.push(true);
        results.push(0);
    }

    function positiveVote(uint256 _pollIndex, uint256 _optionIndex, uint256 _num) public {
        PollArray[_pollIndex].positiveVote(msg.sender, _optionIndex, _num);
    }

    function negativeVote(uint256 _pollIndex, uint256 _optionIndex, uint256 _num) public {
        PollArray[_pollIndex].negativeVote(msg.sender, _optionIndex, _num);
    }

    function publishResult(uint _pollIndex) public {
        // To make sure a transaction happens to append the block, hence its time in
        // our hardhat localhost.
        dummy += 1;
        results[_pollIndex] = PollArray[_pollIndex].getResult();
        isActive[_pollIndex] = false;
    }

    function getNumEvents() public view returns (uint256) {
        return PollArray.length;
    }

    function getTitle(uint256 _pollIndex) public view returns (string memory) {
        return PollArray[_pollIndex].title();
    }

    function getOpTitle(uint256 _pollIndex, uint256 optionId) public view returns (string memory) {
        return PollArray[_pollIndex].getOpTitle(optionId);
    }

    function getOpPositiveWeight(
        uint256 _pollIndex,
        uint256 optionId
    ) public view returns (uint256) {
        return PollArray[_pollIndex].getOpPositiveWeight(optionId);
    }

    function getVoterOpPositiveWeight(
        uint256 _pollIndex,
        uint256 optionId
    ) public view returns (uint256) {
        return PollArray[_pollIndex].getVoterOpPositiveWeight(optionId, msg.sender);
    }

    function getOpNegativeWeight(
        uint256 _pollIndex,
        uint256 optionId
    ) public view returns (uint256) {
        return PollArray[_pollIndex].getOpNegativeWeight(optionId);
    }

    function getVoterOpNegativeWeight(
        uint256 _pollIndex,
        uint256 optionId
    ) public view returns (uint256) {
        return PollArray[_pollIndex].getVoterOpNegativeWeight(optionId, msg.sender);
    }

    function getCredit(uint256 _pollIndex, address voter) public view returns (uint256) {
        return PollArray[_pollIndex].getCredit(voter);
    }

    function getresult(uint256 _pollIndex) public view returns (uint256) {
        return PollArray[_pollIndex].getResult();
    }

    function getdeployTime(uint _pollIndex) public view returns (uint256) {
        return PollArray[_pollIndex].deployTime();
    }

    function getcurrentTime() public view returns (uint256) {
        return block.timestamp;
    }

    function getNumOptions(uint256 _pollIndex) public view returns (uint256) {
        return PollArray[_pollIndex].optionCount();
    }
}
