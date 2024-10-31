import { useState } from "react";
import SearchBar from "./SearchBar";
import { ThemeToggle } from "./ThemeToogle";
import Tabs from "./Tabs";

const Navbar = () => {
  const [active, setActive] = useState<string>("swap");
  return (
    <div className="flex flex-row justify-between pt-3 items-center w-full px-2 transition-all duration-100">
      <Tabs active={active} setActive={setActive} />

      <div className="md:flex hidden pl-8">
        <SearchBar />
      </div>
      <div className="flex flex-row items-center space-x-4">
        <div>{/* <ConnectButton /> */}</div>
      </div>
      <ThemeToggle />
    </div>
  );
};

export default Navbar;
