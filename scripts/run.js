const main = async () => {
  const tokenContractFactory = await hre.ethers.getContractFactory('osERC20');
  const tokenContract = await tokenContractFactory.deploy("OpenSchool Token", "OST");
  await tokenContract.deployed();
  console.log("Contract deployed to:", tokenContract.address);
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
