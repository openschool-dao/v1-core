const { expect } = require('chai')
const { ethers } = require('hardhat')

describe('OsSkill', () => {
  let Token
  let osToken
  let owner
  let addr1
  let addr2
  let addrs

  describe('Deployment', function () {
    before(async () => {
      Token = await ethers.getContractFactory('OsSkill')
      osToken = await Token.deploy(
        ['Solidity', 'Javascript', 'Typescript'],
        ['https://i.imgur.com/HyyK9bq.png', 'https://i.imgur.com/DnvDSV1.png', 'https://i.imgur.com/PrBtG6g.png'],
      )
      ;[owner, addr1, addr2, ...addrs] = await ethers.getSigners()
    })

    it('Should set the right name', async function () {
      expect(await osToken.name()).to.equal('OpenSchool Skills')
    })

    it('Should set the right symbol', async function () {
      expect(await osToken.symbol()).to.equal('SKILL')
    })

    it('Should initialized the skills', async function () {
      expect(await osToken.supportedSkills()).to.have.lengthOf(3)
    })
  })

  describe('Add supported Skill', () => {
    it('Should add new supported skill', async function () {
      await osToken.addSupportedSkill('Rust', 'https://i.imgur.com/zgqvHVy.png')

      const getSkillsTxn = await osToken.supportedSkills()
      expect(getSkillsTxn).to.have.lengthOf(4)

      const skills = getSkillsTxn.map(skillData => {
        return {
          skillIndex: skillData.skillIndex,
          name: skillData.name,
          imageURI: skillData.imageURI,
          recipient: skillData.recipient,
        }
      })

      expect(skills[3].name).to.equal('Rust')
      expect(skills[3].recipient).to.equal(ethers.constants.AddressZero)
    })
  })

  describe('Minting token', () => {
    it('Should mint a new Skill for user', async function () {
      await expect(osToken.mintSkill(addr1.address, 0)).to.emit(osToken, 'SkillMinted').withArgs(addr1.address, 0, 1)

      expect(await osToken.balanceOf(addr1.address)).to.equal(1)
      expect(await osToken.ownerOf(1)).to.equal(addr1.address)
    })
  })
})
