/*
 * Chai cheatsheet : https://gist.github.com/samwize/8877226
 * Use instanceContract.connect(address) to change the signer
 * To test events please use:
 * expect().to.emit(contract, "Transfer")
 * .withArgs(arg1, arg1, etc);
 */

const { expect } = require('chai')
const { ethers } = require('hardhat')

describe('OsERC20', () => {
  let Token
  let osToken
  let owner
  let addr1
  let addr2
  let addrs

  describe('Deployment', function () {
    before(async () => {
      Token = await ethers.getContractFactory('OsERC20')
      osToken = await Token.deploy('OpenSchool Token', 'OST')
      ;[owner, addr1, addr2, ...addrs] = await ethers.getSigners()
    })

    it('Should set the right name', async function () {
      expect(await osToken.name()).to.equal('OpenSchool Token')
    })

    it('Should set the right symbol', async function () {
      expect(await osToken.symbol()).to.equal('OST')
    })

    it('Should have the right decimal', async () => {
      expect(await osToken.decimal()).to.equal(18)
    })

    it('Should have no supply', async function () {
      expect(await osToken.totalSupply()).to.equal(0)
    })
  })

  describe('Minting token', () => {
    it('Only the owner is allowed to mint', async () => {
      osToken = osToken.connect(addr1)

      await expect(osToken.mint(addr1.address, 10)).to.be.reverted
    })

    it('Should mint tokens amount to account', async () => {
      osToken = osToken.connect(owner)
      const setMintTx = await osToken.mint(addr1.address, 10)
      await setMintTx.wait()

      expect(await osToken.balanceOf(addr1.address)).to.equal(10)
      expect(await osToken.totalSupply()).to.equal(10)
    })

    it('Should trigger Transfer event', async () => {
      osToken = osToken.connect(owner)

      await expect(osToken.mint(addr1.address, 10))
        .to.emit(osToken, 'Transfer')
        .withArgs(ethers.constants.AddressZero, addr1.address, 10)
    })
  })

  describe('Burning token', () => {
    beforeEach(async () => {
      Token = await ethers.getContractFactory('OsERC20')
      osToken = await Token.deploy('OpenSchool Token', 'OST')
      ;[owner, addr1, addr2, ...addrs] = await ethers.getSigners()

      const setMintTx = await osToken.mint(addr1.address, 10)
      await setMintTx.wait()
    })

    it('Only the Holder is allowed to burn', async () => {
      osToken = osToken.connect(owner)

      await expect(osToken.burn(addr1.address, 10)).to.be.reverted
    })

    it('Holder must have enough token to burn', async () => {
      osToken = osToken.connect(addr2)

      await expect(osToken.burn(addr2.address, 10)).to.be.reverted
    })

    it('Should burn tokens amount of account', async () => {
      osToken = osToken.connect(addr1)

      const setTokenTx = await osToken.burn(addr1.address, 10)
      await setTokenTx.wait()

      expect(await osToken.balanceOf(addr1.address)).to.equal(0)
      expect(await osToken.totalSupply()).to.equal(0)
    })
  })

  describe('Transfer token', () => {
    beforeEach(async () => {
      Token = await ethers.getContractFactory('OsERC20')
      osToken = await Token.deploy('OpenSchool Token', 'OST')
      ;[owner, addr1, addr2, ...addrs] = await ethers.getSigners()

      const setMintTx = await osToken.mint(addr1.address, 100)
      await setMintTx.wait()
    })

    it('Should be transferable from sender to account', async () => {
      osToken = osToken.connect(addr1)
      const setTokenTx = await osToken.transfer(addr2.address, 10)
      await setTokenTx.wait()

      expect(await osToken.balanceOf(addr1.address)).to.equal(90)
      expect(await osToken.balanceOf(addr2.address)).to.equal(10)
      expect(await osToken.totalSupply()).to.equal(100)
    })

    it('Amount must be limited to sender supply', async () => {
      osToken = osToken.connect(addr1)
      await expect(osToken.transfer(addr2.address, 110)).to.be.reverted
    })
  })

  describe('Allowance of token', () => {
    before(async () => {
      Token = await ethers.getContractFactory('OsERC20')
      osToken = await Token.deploy('OpenSchool Token', 'OST')
      ;[owner, addr1, addr2, ...addrs] = await ethers.getSigners()

      const setMintTx = await osToken.mint(addr1.address, 100)
      await setMintTx.wait()
    })

    it('Tokens should be allowable', async () => {
      osToken = osToken.connect(addr1)
    })
  })
})
