const main = async () => {
  const timelockDelay = 2

  const skillContractFactory = await hre.ethers.getContractFactory('OsSkill')

  const signerAddress = await skillContractFactory.signer.getAddress()
  const signer = await ethers.getSigner(signerAddress)
  console.log('Signer adress: ', signerAddress)

  const adminAddressTransactionCount = await signer.getTransactionCount()
  const expectedContractAddress = ethers.utils.getContractAddress({
    from: signer.address,
    nonce: adminAddressTransactionCount + 2,
  })

  // Skill Contract deployment
  const skillContract = await skillContractFactory.deploy(
    ['Solidity', 'Javascript', 'Typescript'],
    ['https://i.imgur.com/HyyK9bq.png', 'https://i.imgur.com/DnvDSV1.png', 'https://i.imgur.com/PrBtG6g.png'],
  )
  await skillContract.deployed()

  // Timelock Contract deployment
  const timelockFactory = await hre.ethers.getContractFactory('Timelock')
  const timelockContract = await timelockFactory.deploy(expectedContractAddress, timelockDelay)
  await timelockContract.deployed()

  // Governor Contract deployment
  const governorFactory = await ethers.getContractFactory('OsGov')
  const governorContract = await governorFactory.deploy(skillContract.address, timelockContract.address)
  await governorContract.deployed()

  console.log('Dao deployed to: ', {
    expectedContractAddress,
    governor: governorContract.address,
    timelock: timelockContract.address,
    token: skillContract.address,
  })
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

// Rinkeby:
// 0xF628f67BD6651B18Bc91704a7bA729dfDf5FbD90
