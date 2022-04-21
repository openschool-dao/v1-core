import WalletButton from './WalletButton'
import Nav from './Nav'

const Header = () => {
  return (
    <header className="flex justify-between bg-white shadow-color p-6 fixed w-full">
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
