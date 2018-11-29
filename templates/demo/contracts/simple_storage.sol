pragma solidity ^0.5.0;


import "./safe_math.sol";

contract SimpleStorage {
  using SafeMath for uint256;

  uint public storedData;

  constructor(uint initialValue) public {
    storedData = initialValue.mul(10);
  }

  function set(uint x) public {
    storedData = x.mul(10);
  }

  function get() public view returns (uint retVal) {
    return storedData.div(10);
  }

}
