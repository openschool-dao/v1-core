import "../index.css";
import WalletButton from "./WalletButton";
import logo from "../ethereumLogo.png";

const Header = () => {
  return (
    <header className="flex justify-center items-center h-screen">
      <div>
        <WalletButton />
      </div>
      <div>
        <p className="text-xl text-red-600">
          Edit <code>packages/react-app/src/App.js</code> and save to reload.
        </p>
        <a href="https://reactjs.org">Learn React</a>
        <a href="https://usedapp.io/">Learn useDapp</a>
        <a href="https://thegraph.com/docs/quick-start">Learn The Graph</a>
      </div>
    </header>
  );
};

export default Header;
