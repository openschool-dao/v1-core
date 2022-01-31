# Basic Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, a sample script that deploys that contract, and an example of a task implementation, which simply lists the available accounts.

Try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
node scripts/sample-script.js
npx hardhat help
```

## Usage

First install dependencies:

```shell
yarn install
```

### Compile

Compile smart contracts with hardhat compile:

```shell
$ yarn compile
```

### Lint

Actually run lint:sol and prettier. Lint solidity code:

```shell
$ yarn lint
```

### Test

Run the Mocha/Chai tests:

```shell
$ yarn test
```

### How to call contract from hardhat console

```
const provider = new ethers.providers.JsonRpcProvider() // using default http://localhost:8545
const signer = new ethers.Wallet(privkey, provider)
const osSkill = await ethers.getContractAt('OsSkill', contractAddress, signer)
const out = await osSkill.balanceOf(walletAddress) // or any contract's function
console.log(out)
```

### How to create a proposal

```
const mintCalldata = osSkill.interface.encodeFunctionData('mintSkill', [Address, skillIndex]);
await governor.propose(
  [osSkill.address],
  [0],
  [mintCalldata],
  “Proposal #1: Give grant to team”,
);
```

## Roadmap

- ERC721 (NFT) or ERC1155 (multi NFT & tokens) for each track
- Voting system to allow NFT holder to vote on attribution for new applicant
- Complete test for every Contracts and functions
