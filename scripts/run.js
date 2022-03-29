const main = async () => {
  // Account assignement
  ;[owner, proposer, applicant, voter1, voter2, notVoter, ...addrs] = await ethers.getSigners()
  console.log('Signers addresses')
  console.log(owner.address, proposer.address, applicant.address, voter1.address)
  console.log('----------------')

  // Skill Contract deployment
  console.log('DEPLOY SKILL CONTRACT')
  const skillContractFactory = await hre.ethers.getContractFactory('OsSkill')
  const skillContract = await skillContractFactory.deploy('https://metadata.io/{id}.json')
  await skillContract.deployed()
  console.log('Skill Contract deployed to: ', skillContract.address)
  console.log('----------------')

  // Add new skill
  console.log('ADD NEW SKILL')
  await skillContract.addSkill('Javascript', 'https://javascript.com/logo.jpg')
  console.log('New skill')
  console.log(await skillContract.getSkill(0))
  console.log('----------------')

  // Mint skill to owner
  console.log('MINT SKILL TO OWNER')
  await skillContract.mint(owner.address, 0, [])
  await hre.ethers.provider.send('evm_mine')
  console.log('owner balance: ', await skillContract.balanceOf(owner.address, 0))
  console.log('----------------')

  // Mint skill to owner
  console.log('MINT SKILL TO OWNER')
  await skillContract.mint(owner.address, 0, [])
  await hre.ethers.provider.send('evm_mine')
  console.log('owner balance: ', await skillContract.balanceOf(owner.address, 0))
  console.log('----------------')

  // Check for votes count
  console.log('CHECK SUPPLY AND VOTES')
  await hre.ethers.provider.send('evm_mine')
  let lastBlock = await hre.ethers.provider.getBlock('latest')
  console.log('- total supply: ', await skillContract.getPastTotalSupply(0, lastBlock.number - 1))
  console.log('- number of votes: ', await skillContract.getVotes(0, owner.address))
  console.log('----------------')

  // Delegate votes
  console.log('VOTES DELEGATION')
  console.log('Owner delegates to Proposer...')
  await skillContract.delegate(0, proposer.address)
  console.log('Proposer votes: ', await skillContract.getVotes(0, proposer.address))
  console.log('----------------')

  // Deploy OsGov Contract
  console.log('DEPLOY VOTING CONTRACT')
  const votingFactory = await ethers.getContractFactory('OsVoting')
  votingContract = await votingFactory.deploy(skillContract.address, 'OsVoting')
  await votingContract.deployed()
  console.log('Voting Contract deployed to: ', votingContract.address)
  console.log('----------------')

  // Add proposal
  console.log('ADD NEW PROPOSAL')
  calldata = skillContract.interface.encodeFunctionData('mint', [applicant.address, 0, []])
  txn = await votingContract.connect(proposer).propose(skillContract.address, 0, calldata, 'Issuance#1')
  const receipt = await txn.wait()
  const proposalId = receipt.events[0].args.proposalId
  console.log('New proposal Id: ', proposalId.toString())
  console.log('----------------')

  // Cast Vote
  console.log('CASTING VOTES')
  for (_ of Array(3)) {
    await hre.ethers.provider.send('evm_mine')
  }
  console.log('Proposer casts vote...')
  await votingContract.connect(proposer).castVote(proposalId, 1)
  console.log('Proposal votes count: ', await votingContract.proposalVotes(proposalId))
  await hre.ethers.provider.send('evm_mine')
  console.log('State before vote: ', await votingContract.state(proposalId))
  console.log('----------------')

  // Execute the proposal
  console.log('EXECUTE THE PROPOSAL')
  await skillContract.transferOwnership(votingContract.address)
  const descriptionHash = ethers.utils.id('Issuance#1')
  await votingContract.connect(owner).execute(skillContract.address, calldata, descriptionHash)
  console.log('----------------')

  // Check if NFT has been minted
  console.log('CHECK SUPPLY AND VOTES')
  lastBlock = await hre.ethers.provider.getBlock('latest')
  console.log('Token supply: ', await skillContract.getPastTotalSupply(0, lastBlock.number - 1))
  console.log("Applicant's balance: ", await skillContract.balanceOf(applicant.address, 0))
  await skillContract.connect(applicant).delegate(0, applicant.address)
  console.log("Applicant's votes: ", await skillContract.getVotes(0, applicant.address))
  console.log('----------------')
}

const runMain = async () => {
  try {
    await main()
    process.exit(0)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

runMain()
