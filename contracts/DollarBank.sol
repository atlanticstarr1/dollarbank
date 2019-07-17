pragma solidity ^0.5.10;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/lifecycle/Pausable.sol";
import "./Ilighthouse.sol";
import "./Lighthouse.sol";

/// @title A bank contract that pays its users interest on a daily basis.
/// @author David Noel
/// @notice Interest is based on maintaining a minumum balance in USD, which
/// is converted to ETH using a rate fed into the contract by an Oracle.
/// The rate is 10 cents (USD) of ETH.
/// @dev Daily interest = Interest Rate/365 * Balance
contract DollarBank is Ownable, Pausable, Searcher {
    using SafeMath for uint256;

    /// Bank interest rate
    uint public interestRate = 3;
    /// Min balance required (USD) to start receiving interest payments.
    uint public minBalanceUsd = 1;
    /// Min balance required (ETH)
    uint public minBalanceEth;
    /// Ten cents (USD) in ETH. Defaulted using (0.1 USD ~ 0.00033 ETH 6/28/19)
    uint public tenCents = 330000000000000;
    /// Total interest paid by bank to date
    uint private totalInterestPaid;
    /// Are interest payments running?
    bool public interestRunning;
    /// ETHUSD lighthouse oracle
    ILighthouse  public myLighthouse;
    /// Array of users registered
    address[] private accounts;
    mapping(address => uint) private accountsIndex;
    /// Users balance.
    mapping (address => uint) private balances;
    /// Function to allow contracts to be able to see if a user is enrolled.
    mapping (address => bool) public enrolled;
    /// Store IPFS hash of users profile pic
    mapping (address => string) private profilePics;

    /// When a user signs up
    event Enrolled(address indexed accountAddress);
    /// When a user makes a deposit
    event Deposited(address indexed accountAddress, uint amount);
    /// When a user makes a withdrawal
    event Withdrawn(address indexed accountAddress, uint withdrawAmount, uint newBalance);
    /// When a user closes their account
    event ClosedAccount(address indexed accountAddress, uint balanceAtClose);
    /// When interest payment starts
    event InterestStarted();
    /// When interest payment stops
    event InterestStopped();
    // When interest is paid by bank
    event InterestPaid(uint _totalInterestPaid);
    /// When oracle data is not valid
    event OracleDataNotValid();
    /// When profile pic updates; IPFS hash changes
    event ProfileUpdated(string _profIpfsHash);

    /// Check if user is enrolled.
    modifier isEnrolled(){
        require(enrolled[msg.sender], "You must first enroll");
        _;
    }

    /// Check user is not already enrolled, and user address is valid.
    modifier checkEnroll(){
        require(msg.sender != address(0), "Invalid address.");
        require(!enrolled[msg.sender], "Already enrolled.");
        _;
    }

    /// Ensure user has enough balance to withdraw, and bank can pay user.
    modifier checkWithdraw(uint withdrawAmount){
        require(balances[msg.sender] >= withdrawAmount, "Insufficient balance");
        require(address(this).balance >= balances[msg.sender], "Bank cannot pay interest at the moment");
        _;
    }

    /// Ensures sender is oracle.
    modifier onlyLighthouse {
        require(msg.sender == address(myLighthouse), "Unauthorised");
        _;
    }

        /// Ensures interest payments are enabled
    modifier interestEnabled {
        require(interestRunning, "Interest payments stopped.");
        _;
    }

    /**
     * @dev Initializes the contract setting the deployer as the initial owner
     * the Rhombus Oracle address, the minumum balance in ETH, and starts interest payments
     */
    constructor(ILighthouse _myLighthouse) public {
        myLighthouse = _myLighthouse;
        updateMinBalanceEth();
        startPayments();
    }

    /// @notice Enroll a customer with the bank
    /// @dev The the account and account index is saved, to aid in deletion of an account.
    /// @return The users enrolled status
    function enroll() public checkEnroll whenNotPaused returns (bool _enrolled){
        enrolled[msg.sender] = true;
        accounts.push(msg.sender);
        accountsIndex[msg.sender] = accounts.length - 1;
        _enrolled = enrolled[msg.sender];
        emit Enrolled(msg.sender);
    }

    /// @notice Deposit ether into bank
    /// @return The balance of the user after the deposit is made
    function deposit() external payable isEnrolled whenNotPaused returns (uint _balance) {
        require(msg.value > 0, "Deposit must be greater than 0");
        balances[msg.sender] = balances[msg.sender].add(msg.value);
        _balance = balances[msg.sender];
        emit Deposited(msg.sender, msg.value);
    }

    /// @notice Withdraw ether from bank using pull pattern (to prevent re-entrancy)
    /// checks-effects-interaction pattern to prevent re-entrancy
    /// @dev This does not return any excess ether sent to it
    /// @param withdrawAmount amount you want to withdraw
    /// @return The balance remaining for the user
    function withdraw(uint withdrawAmount) external isEnrolled checkWithdraw(withdrawAmount) returns (uint _balance) {
        balances[msg.sender] = balances[msg.sender].sub(withdrawAmount);
        msg.sender.transfer(withdrawAmount);
        _balance = balances[msg.sender];
        emit Withdrawn(msg.sender, withdrawAmount, _balance);
    }

    /// @notice Close bank account and return all user's balance to them.
    /// checks-effects-interaction pattern to prevent re-entrancy
    /// @return The enrolled status of the user.
    function closeAccount() external isEnrolled checkWithdraw(balances[msg.sender]) whenNotPaused returns (bool) {
        uint totalBalance = balances[msg.sender];
        balances[msg.sender] = 0;
        enrolled[msg.sender] = false;
        removeAccount(msg.sender);
        if (totalBalance > 0) {
            msg.sender.transfer(totalBalance);
        }
        emit ClosedAccount(msg.sender, totalBalance);
        return !enrolled[msg.sender];
    }

    /// @notice Get account balance
    /// @return The balance of the user
    function getBalance() public view returns (uint) {
        return balances[msg.sender];
    }

    /// @notice Get all registered accounts
    /// @return Array of accounts
    function getAccounts() public view onlyOwner returns (address[] memory) {
        return accounts;
    }

    /// @notice Get total accounts
    /// @return Account total
    function getNumAccounts() public view onlyOwner returns (uint) {
        return accounts.length;
    }

    /// @notice Get address of this contract
    /// @return The contract address
    function getContractAddress() public view returns (address) {
        return address(this);
    }

    /// @notice Get contract balance
    /// @return The balance of the contract
    function getContractBalance() public view returns(uint) {
        return address(this).balance;
    }

    /// @notice Set the bank interest rate.
    function setInterestRate(uint _rate) public onlyOwner {
        require(_rate >= 1 && _rate <= 6, "rate should be between 1 and 6");
        interestRate = _rate;
    }

    /// @notice Set ten cents (USD) worth of ETH.
    /// @dev Rate capped at 1 ETH. Could change if ETH becomes extremely valuable.
    function setTencentsOfEth(uint _rate) private {
        require(_rate >= 1 wei && _rate <= 1 ether, "rate should be between 1 wei and 1 ETH");
        tenCents = _rate;
    }

    /// @notice Set the minimum balance (USD, ETH) required to start receiving interest.
    function setMinBalance(uint _minBalance) public onlyOwner {
        require(_minBalance > 0, "balance should be greater than 0");
        minBalanceUsd = _minBalance;
        updateMinBalanceEth();
    }

    /// @notice Start interest payments. Circuit breaker pattern used.
    function startPayments() public onlyOwner whenNotPaused {
        if (!interestRunning) {
            interestRunning = true;
            emit InterestStarted();
        }
    }

    /// @notice Stop interest payments. Circuit breaker pattern used.
    function stopPayments() public onlyOwner whenNotPaused {
        if (interestRunning) {
            interestRunning = false;
            emit InterestStopped();
        }
    }

    /// @notice Pause the contract. This will disable enrollments, deposits and interest payments.
    /// Only withdrawals will be allowed
    function pauseContract() public onlyOwner {
        if (interestRunning) {
            interestRunning = false;
        }
        pause();
    }

    /// @notice Unpause the contract. This will resume all contract operations.
    function unPauseContract() public onlyOwner {
        interestRunning = true;
        unpause();
    }

    /// @notice Set 10 cents (USD) worth of ether. This will be called only by
    /// the oracle, and when the contract is not paused (circuit breaker pattern).
    function poke() public onlyLighthouse interestEnabled {
        bool _valid;
        uint _tenCents;
        (_tenCents, _valid) = myLighthouse.peekData();
        if (!_valid) {
            emit OracleDataNotValid();
            return;
        }
        setTencentsOfEth(_tenCents);
        updateMinBalanceEth();
        payInterest();
    }

    /// @notice Pays interest to every account once criteria is met
    /// @dev Warn: Unbounded for loop is an anti-pattern; interest is paid to every
    /// customer at once as opposed to individually
    function payInterest() private {
        for (uint i = 0; i < accounts.length; i++) {
            address customerAddress = accounts[i];
            /// get customer balance
            uint balance = balances[customerAddress];
            /// Customer is eligible for interest
            if (balance != 0 && balance >= minBalanceEth) {
                // Calculate interest per day
                uint interest = (balance * interestRate).div(36500);
                balances[customerAddress] = balances[customerAddress].add(interest);
                totalInterestPaid += interest;
            }
        }
        emit InterestPaid(totalInterestPaid);
    }

    /// @notice Pays interest to every account once criteria is met
    /// @dev Warn: Unbounded for loop is an anti-pattern
    function payInterestOwner() external onlyOwner interestEnabled {
        payInterest();
    }

    /// @notice Remove an account from the contract
    /// @dev Maybe look into safer algorithm to remove ?
    function removeAccount(address _account) private {
        uint index = accountsIndex[_account];
        if (index >= accounts.length) return;
        if (accounts.length > 1) {
            accounts[index] = accounts[accounts.length-1];
        }
        accounts.length--;
    }

    /// @notice Set the minimum balance in ETH.
    function updateMinBalanceEth() private {
        minBalanceEth = minBalanceUsd * 10 * tenCents;
    }

    /// @notice Set hash of user's profile pic.
    function setProfilePic(string memory _ipfsHash) public {
        require(msg.sender != address(0), "address must be valid");
        require(bytes(_ipfsHash).length > 0, "profile pic cannot be empty");
        profilePics[msg.sender] = _ipfsHash;
        emit ProfileUpdated(_ipfsHash);
    }

    /// @notice Get hash of the user's profile pic.
    /// @return The ipfs hash of the user's profile picture.
    function getProfilePic () public view returns (string memory) {
        return profilePics[msg.sender];
    }

    // Fallback function - Called if other functions don't match call or
    // sent ether without data
    function() external payable {
        emit Deposited(msg.sender, msg.value);
    }
}