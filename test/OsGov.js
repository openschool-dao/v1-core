const { expect } = require('chai')
const { ethers } = require('hardhat')

describe('OsGov', () => {
  let txn
  let owner
  let receiver
  let applicant
  let addrs
  let skillContract
  let governorContract

  before(async () => {
    // Set Signers
    ;[owner, receiver, applicant, ...addrs] = await ethers.getSigners()

    const adminAddressTransactionCount = await owner.getTransactionCount()
    const expectedContractAddress = ethers.utils.getContractAddress({
      from: owner.address,
      nonce: adminAddressTransactionCount + 2,
    })

    // Deploy OsSkill Contract
    const skillFactory = await ethers.getContractFactory('OsSkill')
    skillContract = await skillFactory.deploy(
      ['Solidity', 'Javascript', 'Typescript'],
      ['https://i.imgur.com/HyyK9bq.png', 'https://i.imgur.com/DnvDSV1.png', 'https://i.imgur.com/PrBtG6g.png'],
    )

    // Deploy Timelock Contract
    const timelockDelay = 2
    const timelockFactory = await ethers.getContractFactory('Timelock')
    const timelockContract = await timelockFactory.deploy(expectedContractAddress, timelockDelay)
    await timelockContract.deployed()

    // Deploy OsGov Contract
    const governorFactory = await ethers.getContractFactory('OsGov')
    governorContract = await governorFactory.deploy(skillContract.address, timelockContract.address)
    await governorContract.deployed()

    // A minimum of 2 NFTs are required in the Osgov.proposalThreshold() to create a proposal
    await skillContract.connect(owner).mintSkill(receiver.address, 0)
    await skillContract.connect(owner).mintSkill(receiver.address, 0)
  })

  it('should create a new proposal', async () => {
    const calldata = skillContract.interface.encodeFunctionData('mintSkill', [applicant.address, 0])
    txn = await governorContract
      .connect(receiver)
      ['propose(address[],uint256[],bytes[],string)']([skillContract.address], [0], [calldata], 'Issuance#1')
    const receipt = await txn.wait()
    const proposalId = receipt.events[0].args.proposalId

    expect((await governorContract.proposals(proposalId)).forVotes.toString()).to.eql('0')
  })
})
