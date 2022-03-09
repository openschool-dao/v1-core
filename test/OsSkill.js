const { expect } = require('chai')
const { ethers } = require('hardhat')

describe('OsSkill', () => {
  let Token
  let osToken
  let owner
  let addr1
  let addr2
  let addrs
  let txn
  const imageURIs = [
    'https://i.imgur.com/HyyK9bq.png',
    'https://i.imgur.com/DnvDSV1.png',
    'https://i.imgur.com/PrBtG6g.png',
  ]
  const names = ['Solidity', 'Javascript', 'Typescript']

  describe('Deployment', function () {
    before(async () => {
      Token = await ethers.getContractFactory('OsSkill')
      osToken = await Token.deploy('https://metadata.io/{id}.json')
      ;[owner, addr1, addr2, ...addrs] = await ethers.getSigners()
    })

    it('Should set the right name', async function () {
      expect(await osToken.name()).to.equal('OpenSchool Skills')
    })

    it('Should set the right symbol', async function () {
      expect(await osToken.symbol()).to.equal('SKILL')
    })
  })

  describe('Add a new skill', () => {
    it('Only contract owner can add new skill', async function () {
      await expect(osToken.connect(addr1).addSkill(names[1], imageURIs[1])).to.be.revertedWith(
        'Ownable: caller is not the owner',
      )
    })
    it('Should add new supported skill', async function () {
      await osToken.addSkill(names[1], imageURIs[1])
      const skillsTxn = await osToken.skills()
      const skills = skillsTxn.map(skillData => {
        return {
          name: skillData.name,
          imageURI: skillData.imageURI,
        }
      })
      expect(skillsTxn).to.have.lengthOf(1)
      expect(skills[0].name).to.equal(names[1])
    })
    it('function getSkill() must return skill attributes', async () => {
      const [name, imageURI] = await osToken.getSkill(0)
      expect(name).to.equal(names[1])
      expect(imageURI).to.equal(imageURIs[1])
    })

    it('function skills() must return the list of skills', async () => {
      await osToken.addSkill(names[0], imageURIs[0])
      txn = await osToken.skills()
      expect(txn).to.have.lengthOf(2)
    })
  })

  describe('Minting token', () => {
    it('Only contract owner can mint token', async function () {
      await expect(osToken.connect(addr1).mint(addr1.address, 0, [])).to.be.revertedWith(
        'Ownable: caller is not the owner',
      )
      expect(await osToken.balanceOf(addr1.address, 0)).to.equal(0)
    })
    it('Owner can mint token to user', async () => {
      await osToken.connect(owner).mint(addr1.address, 0, [])
      expect(await osToken.balanceOf(addr1.address, 0)).to.equal(1)
    })
  })

  describe('Burning token', () => {
    it('Only contract owner can burn a token', async () => {
      await expect(osToken.connect(addr1).burn(addr1.address, 0)).to.be.revertedWith('Ownable: caller is not the owner')
      expect(await osToken.balanceOf(addr1.address, 0)).to.equal(1)
    })
    it('Owner can burn a token', async () => {
      await osToken.connect(owner).burn(addr1.address, 0)
      expect(await osToken.balanceOf(addr1.address, 0)).to.equal(0)
    })
  })
})
