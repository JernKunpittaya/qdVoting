// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.0 <0.9.0;
import "./Poll.sol";

contract Factory {
    Poll[] public PollArray;
    event PollCreated(string _title);

    function createPoll(
        string memory _title,
        address[] memory _eligibles,
        string[] memory _opTitle
    ) public {
        PollArray.push(new Poll(msg.sender, _title, _eligibles, _opTitle));
        emit PollCreated(_title);
    }

    function positiveVote(uint256 _pollIndex, uint256 _optionIndex, uint256 _num) public {
        PollArray[_pollIndex].positiveVote(msg.sender, _optionIndex, _num);
    }

    function negativeVote(uint256 _pollIndex, uint256 _optionIndex, uint256 _num) public {
        PollArray[_pollIndex].negativeVote(msg.sender, _optionIndex, _num);
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
}
