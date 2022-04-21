import WalletButton from './WalletButton'
import Nav from './Nav'

const Header = () => {
  return (
    <header className="flex justify-between bg-gray-200 shadow-xl p-6 fixed w-full">
      <div className="flex">
        <Nav label={'Votes'} />
        <Nav label={'Skills'} />
      </div>
      <span className="cursor-pointer text-2xl md:text-3xl lg:text-4xl font-bold logo">LOGO</span>
      <WalletButton />
    </header>
  )
}

export default Header
