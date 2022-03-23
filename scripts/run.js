const main = async () => {
  // Account assignement
  ;[owner, proposer, applicant, voter1, voter2, notVoter, ...addrs] = await ethers.getSigners()
  console.log('Signers addresses')
  console.log(owner.address, proposer.address, applicant.address, voter1.address)
  console.log('----------------')

  // Skill Contract deployment
  const skillContractFactory = await hre.ethers.getContractFactory('OsSkill')
  const skillContract = await skillContractFactory.deploy('https://metadata.io/{id}.json')
  await skillContract.deployed()
  console.log('Skill deployed to')
  console.log(skillContract.address)
  console.log('----------------')

  // Add new skill
  await skillContract.addSkill('Javascript', 'https://javascript.com/logo.jpg')
  console.log('New skill')
  console.log(await skillContract.getSkill(0))
  console.log('----------------')

  // Mint skill or transfer
  await skillContract.mint(owner.address, 0, [])
  await hre.ethers.provider.send('evm_mine')
  console.log('Mint: new owner balance for token 0')
  console.log(await skillContract.balanceOf(owner.address, 0))
  console.log('----------------')

  await skillContract.mint(owner.address, 0, [])
  await hre.ethers.provider.send('evm_mine')
  console.log('Mint: new owner balance for token 0')
  console.log(await skillContract.balanceOf(owner.address, 0))
  console.log('----------------')

  // Check for votes count
  await hre.ethers.provider.send('evm_mine')
  const latestBlock = await hre.ethers.provider.getBlock('latest')
  console.log('getPastTokenSupply: ')
  console.log(await skillContract.getPastTotalSupply(0, latestBlock.number - 1))
  console.log('getVotes of owner: ')
  console.log(await skillContract.getVotes(0, owner.address))

  // Delegate votes
  console.log('Delegate to proposer')
  await skillContract.delegate(0, proposer.address)
  console.log('getVotes of proposer')
  console.log(await skillContract.getVotes(0, proposer.address))
  console.log('----------------')

  // Deploy OsGov Contract
  const votingFactory = await ethers.getContractFactory('OsVoting')
  votingContract = await votingFactory.deploy(skillContract.address, 'OsVoting')
  await votingContract.deployed()
  console.log('Voting deployed to')
  console.log(votingContract.address)
  console.log('----------------')

  // Add proposal
  calldata = skillContract.interface.encodeFunctionData('mint', [applicant.address, 0, []])
  const proposalTxn = await votingContract.propose(skillContract.address, calldata, 'Issuance#1')
  console.log('Proposal created')
  const receipt = await proposalTxn.wait()
  const proposalId = receipt.events[0].args.proposalId
  console.log('New proposal id')
  console.log(proposalId)
  console.log('----------------')

  // Add vote on new proposal
  // await hre.ethers.provider.send('evm_mine')
  // const castVoteTxn = await votingContract.castVote(proposalId, 1)
  // console.log(castVoteTxn)
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
