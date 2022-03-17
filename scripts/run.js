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
  console.log('Owner balance for token 0')
  console.log(await skillContract.balanceOf(owner.address, 0))

  // Check for votes count
  console.log('Owner votes')
  console.log(await skillContract.getVotes(owner.address))

  // Deploy OsGov Contract
  // const votingFactory = await ethers.getContractFactory('OsVoting')
  // votingContract = await votingFactory.deploy(skillContract.address)
  // await votingContract.deployed()
  // console.log('Dao deployed to')
  // console.log(votingContract.address)
  // console.log('----------------')

  // Add proposal
  // calldata = skillContract.interface.encodeFunctionData('mint', [applicant.address, 0, []])
  // const proposalTxn = await votingContract['propose(address[],uint256[],bytes[],string)']([skillContract.address], [0], [calldata], 'Issuance#1')
  // const receipt = await proposalTxn.wait()
  // const proposalId = receipt.events[0].args.proposalId
  // console.log('New proposal id')
  // console.log(proposalId)
  // console.log('----------------')

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
