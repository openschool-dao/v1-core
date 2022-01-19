const main = async () => {
  const osERC20ContractFactory = await hre.ethers.getContractFactory('osERC20');
  const osERC20Contract = await osERC20ContractFactory.deploy(
    'OpenSchool Token',
    'OST'
  );

  await osERC20Contract.deployed();
  console.log("Contract deployed to:", osERC20Contract.address);
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

// Rinkeby:
// 0xF628f67BD6651B18Bc91704a7bA729dfDf5FbD90
