import WalletButton from './WalletButton'
import Nav from './Nav'

const Header = () => {
  return (
    <header className="flex justify-between bg-gray-100 shadow-xl p-6 fixed w-full">
      <p className="cursor-pointer text-xl font-bold mt-2">LOGO</p>
      <div className="flex mr-6">
        <Nav label={'Votes'} />
        <Nav label={'Skills'} />
        <WalletButton />
      </div>
    </header>
  )
}

export default Header
