## Avoiding common attacks ##

### Integer Over/Underflow ###
Occurs when trying to set a value larger than the maximum allowable for the integer type e.g. setting a value greater than 4294967296 (2^32) for a uint32; It will overflow and restart counting at 0.

Mitigated by:
* using the SafeMath library from OpenZeppelin (https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/math/SafeMath.sol)

### Re-entrancy Attact ###
This attack recursively calls a function in a vulnerable contract, without waiting for the first invocation of the function to finish. This makes changes in the contract the calling function was not expecting. e.g recursively calling a withdrawal function.

Mitigated by:
* using transfer() instead of call when calling external functions.
* using ***Pull over Push payments*** (withdrawal pattern) to transfer funds. This pattern updates the internal state of the contract BEFORE transfering funds.

### Denial of Service ###
Similar to a re-entrancy attack, a DOS attack prevents a function from successfully executing thus blocking the intended transactions from succeeding. e.g. blocking a refund function from refunding fees to customers.

Mitigated by:
* updating the state of the contract BEFORE transfering funds.
* using a ***Pull over Push*** pattern.
