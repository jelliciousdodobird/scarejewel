import { IconMenu, IconX } from "@tabler/icons";
import clsx from "clsx";
import Link from "next/link";
import { Logo } from "../Logo/Logo";
import { ThemeSwitch } from "../ThemeSwitch/ThemeSwitch";

const links = [
  { label: "plan", path: "/plan" },
  { label: "week", path: "/week" },
  { label: "about", path: "/about" },
];

export const Navbar = () => {
  return (
    <div
      className={clsx(
        "bg-white/80 dark:bg-neutral-800/90 backdrop-blur-md",
        "border-b border-black/[7%] dark:border-white/[7%]"
      )}
    >
      <div className="flex justify-between items-center h-16 pack-content">
        <ThemeSwitch />
        <Link href="/">
          <Logo />
        </Link>
        <nav className="relative">
          <input
            id="nav-toggle"
            type="checkbox"
            className="absolute top-0 right-0 w-0 h-0 opacity-0 peer/nav-toggle"
          />
          <label
            tabIndex={1}
            htmlFor="nav-toggle"
            className={clsx(
              "rounded-full w-12 h-12 grid place-items-center sm:hidden cursor-pointer hover:text-primary-500 ring-current peer-focus-visible/nav-toggle:ring-2",
              "[&>.nav-menu-icon]:flex [&>.nav-close-icon]:hidden",
              "peer-checked/nav-toggle:[&>.nav-menu-icon]:hidden peer-checked/nav-toggle:[&>.nav-close-icon]:flex"
            )}
          >
            <span className="hidden">Nav Toggle</span>
            <IconMenu className="nav-menu-icon" />
            <IconX className="nav-close-icon" />
          </label>

          <ul
            className={clsx(
              "flex min-h-min border-black/5 transition-[transform_opacity] duration-300",
              // styles for mobile:
              "[visibility:hidden] translate-x-full opacity-0 flex-col gap-0 w-full fixed top-16 left-0 bg-white dark:bg-neutral-800 pb-2 border-b",
              "peer-checked/nav-toggle:visible peer-checked/nav-toggle:translate-x-0 peer-checked/nav-toggle:opacity-100", // transition states for mobiles
              // styles for desktop:
              "sm:visible sm:translate-x-0 sm:opacity-100 sm:flex-row sm:gap-4 sm:w-auto sm:relative sm:top-auto sm:left-auto sm:bg-transparent sm:dark:bg-transparent sm:pb-0 sm:border-none"
            )}
          >
            {links.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.path}
                  className={clsx(
                    "capitalize font-medium",
                    // styles for mobile:
                    "pl-4 pr-8 h-12 flex items-center justify-center hover:bg-primary-400 hover:text-white hover:font-bold ",
                    // styles for desktop:
                    "sm:pl-0 sm:pr-0 sm:h-auto sm:hover:bg-transparent sm:hover:text-primary-500 sm:hover:font-medium"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};
