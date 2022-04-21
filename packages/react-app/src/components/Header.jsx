import WalletButton from "./WalletButton";

const Header = () => {
  return (
    <header className="flex justify-between shadow-lg p-6">
      <p className="cursor-pointer text-xl font-bold">LOGO</p>
      <WalletButton />
    </header>
  );
};

export default Header;
