// TODO: deployment must be coded. It does not work currently.

const main = async () => {
  // const erc20ContractFactory = await hre.ethers.getContractFactory('OsERC20');
  // const erc20Contract = await erc20ContractFactory.deploy(
  //     'OpenSchool Token',
  //     'OST'
  // );

  // await erc20Contract.deployed();
  // console.log("ERC20 Contract deployed to:", erc20Contract.address);

  const skillContractFactory = await hre.ethers.getContractFactory('OsSkill')
  const skillContract = await skillContractFactory.deploy(
    ['Solidity', 'Javascript', 'Typescript'],
    ['https://i.imgur.com/HyyK9bq.png', 'https://i.imgur.com/DnvDSV1.png', 'https://i.imgur.com/PrBtG6g.png'],
  )

  await skillContract.deployed()
  console.log('Skill Contract deployed to:', skillContract.address)
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
