import React from 'react'
import Skill from '../components/Skill'

const Home = () => {
  return (
    <div className="flex justify-center items-center bg pt-28">
      <div className="grid grid-cols-1 md:grid-cols-3 md:gap-4 p-6">
        <Skill src={'/Javascript.png'} alt={'skill'} label={'Javascript'} />
        <Skill src={'/solidity.png'} alt={'skill'} label={'Solidity'} />
        <Skill src={'/rust.png'} alt={'skill'} label={'Rust'} />
        <Skill src={'/Javascript.png'} alt={'skill'} label={'Javascript'} />
        <Skill src={'/solidity.png'} alt={'skill'} label={'Solidity'} />
        <Skill src={'/rust.png'} alt={'skill'} label={'Rust'} />
        <Skill src={'/Javascript.png'} alt={'skill'} label={'Javascript'} />
        <Skill src={'/solidity.png'} alt={'skill'} label={'Solidity'} />
        <Skill src={'/rust.png'} alt={'skill'} label={'Rust'} />
      </div>
    </div>
  )
}

export default Home
