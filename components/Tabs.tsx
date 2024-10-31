import { TabProps } from "@/types";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";

const Tabs = ({ active, setActive }: TabProps) => {
  return (
    <>
      <div className="hidden lg:flex flex-row space-x-2 items-center text-base transition-all duration-100">
        <div
          className={`cursor-pointer transition-colors p-2 rounded-xl hover:dark:bg-neutral-50/10 dark:hover:text-white hover:text-black hover:bg-neutral-200/50 ${
            active === "swap"
              ? "dark:text-white text-black"
              : "text-neutral-600"
          }`}
          onClick={() => setActive("swap")}
        >
          Swap
        </div>
        <div
          className={`cursor-pointer transition-colors p-2 rounded-xl hover:dark:bg-neutral-50/10 dark:hover:text-white hover:text-black hover:bg-neutral-200/50 ${
            active === "tokens"
              ? "dark:text-white text-black"
              : "text-neutral-600"
          }`}
          onClick={() => setActive("tokens")}
        >
          Tokens
        </div>
        <div
          className={`cursor-pointer transition-colors p-2 rounded-xl hover:dark:bg-neutral-50/10 dark:hover:text-white hover:text-black hover:bg-neutral-200/50 ${
            active === "launchpad"
              ? "dark:text-white text-black"
              : "text-neutral-600"
          }`}
          onClick={() => setActive("launchpad")}
        >
          Launchpad
        </div>

        <div
          className={`cursor-pointer transition-colors p-2 rounded-xl hover:dark:bg-neutral-50/10 dark:hover:text-white hover:text-black hover:bg-neutral-200/50 ${
            active === "dots"
              ? "dark:text-white text-black"
              : "text-neutral-600"
          }`}
          //onClick={() => setActive("launchpad")}
        >
          <EllipsisHorizontalIcon className="w-8" />
        </div>
      </div>
    </>
  );
};

export default Tabs;
