const { expect } = require('chai')
const { ethers } = require('hardhat')

describe('OsGov', () => {
  let txn
  let owner
  let proposer
  let applicant
  let addrs
  let skillContract
  let voteContract
  let timelockContract
  let proposalId
  let calldata

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
    // const timelockDelay = 2
    // const timelockFactory = await ethers.getContractFactory('Timelock')
    // timelockContract = await timelockFactory.deploy(expectedContractAddress, timelockDelay)
    // await timelockContract.deployed()

    // Deploy OsSkill Contract
    const skillFactory = await ethers.getContractFactory('OsSkill')
    skillContract = await skillFactory.deploy('https://metadata.io/file.json', 'SKILL')

    // Deploy OsGov Contract
    const votingFactory = await ethers.getContractFactory('OsVoting')
    voteContract = await votingFactory.deploy(skillContract.address, 'Skills Voting')
    await voteContract.deployed()

    // Add new skill
    await skillContract.addSkill('Javascript', 'https://javascript.com/logo.jpg')

    // A minimum of 1 NFT is required by OsGov#proposalThreshold() to create a proposal
    // A quorum of 2 NFT is required by a proposal to be successful. See OsGov#quorum()
    await skillContract.connect(owner).mint(owner.address, 0, [])
    await skillContract.connect(owner).delegate(0, owner.address)
    await skillContract.connect(owner).mint(proposer.address, 0, [])
    await skillContract.connect(proposer).delegate(0, proposer.address)
    await skillContract.connect(owner).mint(voter1.address, 0, [])
    await skillContract.connect(voter1).delegate(0, voter1.address)
    await skillContract.connect(owner).mint(voter2.address, 0, [])
    await skillContract.connect(voter2).delegate(0, voter2.address)
  })

  it('should create a new proposal', async () => {
    calldata = skillContract.interface.encodeFunctionData('mint', [applicant.address, 0, []])
    txn = await voteContract.connect(proposer).propose(skillContract.address, 0, calldata, 'Issuance#1')
    const receipt = await txn.wait()
    proposalId = receipt.events[0].args.proposalId
    expect((await voteContract.proposalVotes(proposalId)).forVotes.toString()).to.eql('0')
  })

  it('should be not possible to cast a vote before voting delay', async () => {
    await expect(voteContract.connect(voter1).castVote(proposalId, 1)).to.be.revertedWith(
      'OsVoting: vote not currently active',
    )
  })

  it('proposal should be in correct state before and after voting delay period', async () => {
    expect(await voteContract.state(proposalId)).to.eql(ProposalState.Pending)
    // Mine 1 block to reach voting delay
    await hre.ethers.provider.send('evm_mine')
    expect(await voteContract.state(proposalId)).to.eql(ProposalState.Active)
  })

  //CURRENT
  it('only NFT holders should be able to vote', async () => {
    await voteContract.connect(applicant).castVote(proposalId, 1)
    expect((await voteContract.proposalVotes(proposalId)).forVotes.toString()).to.eql('0')
    for (voter of [owner, voter1, voter2]) {
      await voteContract.connect(voter).castVote(proposalId, 1)
    }
    expect((await voteContract.proposalVotes(proposalId)).forVotes.toString()).to.eql('3')
  })

  it('should be not possible to vote after voting period (9 blocks)', async () => {
    for (_ of Array(9)) {
      await hre.ethers.provider.send('evm_mine')
    }
    await expect(voteContract.connect(voter1).castVote(proposalId, 1)).to.be.revertedWith(
      'OsVoting: vote not currently active',
    )
  })

  it('should execute the proposal after voting period if quorum reached', async () => {
    await skillContract.connect(owner).transferOwnership(voteContract.address)

    await hre.ethers.provider.send('evm_mine')
    const descriptionHash = ethers.utils.id('Issuance#1')
    await voteContract.execute(skillContract.address, calldata, descriptionHash)

    expect(await voteContract.state(proposalId)).to.eql(ProposalState.Executed)
    expect((await skillContract.balanceOf(applicant.address, 0)).toString()).to.eql('1')
  })
})
