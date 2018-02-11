pragma solidity ^0.4.8;

import "./ERC20Token.sol";

interface VestingInterface {
  function withdraw() public;
}

/* One address lock up */
contract Vesting is VestingInterface {
  address withdrawalAddress;
  address token;
  uint[] dates;
  uint[] distribution;
  uint currentCliff;

  function Vesting(address _token, uint[] _dates, uint[] _distribution) public {
    require(_token != address(0));
    require(_dates.length > 0);
    require(_dates.length == _distribution.length);
    require(ERC20Token(_token).totalSupply() > 0);

    for (uint i = 0; i < _dates.length; i++) {
      /* verify subscriber interface */
      require(i == 0 || _dates[i] > _dates[i-1]);
      require(_distribution[i] > 0);
    }

    withdrawalAddress = msg.sender;
    token = _token;
    dates = _dates;
    distribution = _distribution;
    currentCliff = 0;
  }


  function withdraw() public {
    /* partial verification that the address is ERC20Token */
    require(msg.sender == withdrawalAddress);
    require(now > dates[currentCliff]);

    uint transferAmount = distribution[currentCliff];
    if (currentCliff + 1 == dates.length) {
      transferAmount = ERC20Token(token).balanceOf(this);
    }

    assert(ERC20Token(token).transfer(withdrawalAddress, transferAmount));
    currentCliff += 1;

    if (currentCliff == dates.length) {
      selfdestruct(withdrawalAddress);
    }
  }
}
