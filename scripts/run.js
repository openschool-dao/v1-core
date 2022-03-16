const main = async () => {  
    // Skill Contract deployment
    const skillContractFactory = await hre.ethers.getContractFactory('OsSkill')
    const skillContract = await skillContractFactory.deploy('https://metadata.io/{id}.json')
    await skillContract.deployed()
    skillContract.addSkill('Javascript', 'https://javascript.com/logo.jpg')
    console.log('Dao deployed to: ', {
        Skills: skillContract.address
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
  