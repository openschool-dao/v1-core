const { expect } = require('chai')
const { ethers } = require('hardhat')

describe('OsGov', () => {
  let txn
  let owner
  let proposer
  let applicant
  let addrs
  let skillContract
  let governorContract
  let timelockContract
  let proposalId

  const ProposalState = {
    Pending: 0,
    Active: 1,
    Canceled: 2,
    Defeated: 3,
    Succeeded: 4,
    Queued: 5,
    Expired: 6,
    Executed: 7,
  }

  before(async () => {
    // Set Signers
    ;[owner, proposer, applicant, voter1, voter2, notVoter, ...addrs] = await ethers.getSigners()

    const adminAddressTransactionCount = await owner.getTransactionCount()
    const expectedContractAddress = ethers.utils.getContractAddress({
      from: owner.address,
      nonce: adminAddressTransactionCount + 2,
    })

    // Deploy Timelock Contract
    const timelockDelay = 2
    const timelockFactory = await ethers.getContractFactory('Timelock')
    timelockContract = await timelockFactory.deploy(expectedContractAddress, timelockDelay)
    await timelockContract.deployed()

    // Deploy OsSkill Contract
    const skillFactory = await ethers.getContractFactory('OsSkill')
    skillContract = await skillFactory.deploy(
      ['Solidity', 'Javascript', 'Typescript'],
      ['https://i.imgur.com/HyyK9bq.png', 'https://i.imgur.com/DnvDSV1.png', 'https://i.imgur.com/PrBtG6g.png'],
    )

    // Deploy OsGov Contract
    const governorFactory = await ethers.getContractFactory('OsGov')
    governorContract = await governorFactory.deploy(skillContract.address, timelockContract.address)
    await governorContract.deployed()

    // A minimum of 1 NFT is required by OsGov#proposalThreshold() to create a proposal
    // A quorum of 2 NFT is required by a proposal to be successful. See OsGov#quorum()
    await skillContract.connect(owner).mintSkill(owner.address, 0)
    await skillContract.connect(owner).mintSkill(proposer.address, 0)
    await skillContract.connect(owner).mintSkill(voter1.address, 0)
    await skillContract.connect(owner).mintSkill(voter2.address, 0)
  })

  it('should create a new proposal', async () => {
    calldata = skillContract.interface.encodeFunctionData('mintSkill', [applicant.address, 0])
    txn = await governorContract
      .connect(proposer)
      ['propose(address[],uint256[],bytes[],string)']([skillContract.address], [0], [calldata], 'Issuance#1')
    const receipt = await txn.wait()
    proposalId = receipt.events[0].args.proposalId
    expect((await governorContract.proposals(proposalId)).forVotes.toString()).to.eql('0')
  })
  it('should be not possible to cast a vote before voting delay', async () => {
    await expect(governorContract.connect(voter1).castVote(proposalId, 1)).to.be.revertedWith(
      'Governor: vote not currently active',
    )
  })
  it('proposal should be in correct state before and after voting delay period', async () => {
    expect(await governorContract.state(proposalId)).to.eql(ProposalState.Pending)
    // Mine 1 block of voting delay
    await hre.ethers.provider.send('evm_mine')
    expect(await governorContract.state(proposalId)).to.eql(ProposalState.Active)
  })
  it('only NFT holders should be able to vote', async () => {
    await governorContract.connect(notVoter).castVote(proposalId, 1)
    expect((await governorContract.proposals(proposalId)).forVotes.toString()).to.eql('0')
    for (voter of [owner, voter1, voter2]) {
      await governorContract.connect(voter).castVote(proposalId, 1)
    }
    expect((await governorContract.proposals(proposalId)).forVotes.toString()).to.eql('3')
  })
  it('should not be possible to queue proposal before voting period ends', async () => {
    await expect(governorContract['queue(uint256)'](proposalId)).to.be.revertedWith('Governor: proposal not successful')
  })
  it('should be not possible to vote after voting period (9 blocks)', async () => {
    for (_ of Array(9)) {
      await hre.ethers.provider.send('evm_mine')
    }
    await expect(governorContract.connect(voter1).castVote(proposalId, 1)).to.be.revertedWith(
      'Governor: vote not currently active',
    )
  })
  it('should be possible to queue and execute proposal after voting period if quorum reached', async () => {
    await skillContract.transferOwnership(timelockContract.address)
    expect(await governorContract.state(proposalId)).to.eql(ProposalState.Succeeded)
    await expect(governorContract['queue(uint256)'](proposalId)).to.not.be.revertedWith(
      'Governor: proposal not successful',
    )
    expect(await governorContract.state(proposalId)).to.eql(ProposalState.Queued)
    await hre.ethers.provider.send('evm_mine')
    await expect(governorContract['execute(uint256)'](proposalId)).to.not.be.revertedWith(
      'Governor: proposal not successful',
    )
    expect(await governorContract.state(proposalId)).to.eql(ProposalState.Executed)
  })
})
