const main = async () => {
  // const tokenContractFactory = await hre.ethers.getContractFactory('OsERC20');
  // const tokenContract = await tokenContractFactory.deploy("OpenSchool Token", "OST");

  // await tokenContract.deployed();
  // console.log("OsERC20 contract deployed to:", tokenContract.address);

  const skillContractFactory = await hre.ethers.getContractFactory('OsSkill');
  const skillContract = await skillContractFactory.deploy(
    [
    'Solidity',
    'Javascript',
    'Typescript'
    ],
    [
    'https://i.imgur.com/HyyK9bq.png',
    'https://i.imgur.com/DnvDSV1.png',
    'https://i.imgur.com/PrBtG6g.png'
    ]
  );

  await skillContract.deployed();
  console.log("Skill contract deployed to:", skillContract.address);
  const supportedSkills = await skillContract.supportedSkills();
  console.log(supportedSkills);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
