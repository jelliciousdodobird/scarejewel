import { IconMenu, IconX } from "@tabler/icons";
import clsx from "clsx";
import Link from "next/link";
import { Logo } from "../Logo/Logo";
import { NavLink } from "../NavLink/NavLink";
import { NavItem, NavList } from "../NavList/NavList";
import { NavMenuButton } from "../NavMenuButton/NavMenuButton";
import { ThemeSwitch } from "../ThemeSwitch/ThemeSwitch";

const links: NavItem[] = [
  { label: "plan", href: "/plan" },
  { label: "week", href: "/week" },
  { label: "about", href: "/about" },
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
        <Link href="/">
          <Logo />
        </Link>

        <nav className="flex gap-0 sm:gap-4 h-min">
          <ThemeSwitch />
          <NavMenuButton />
          <NavList links={links} />
        </nav>
      </div>
    </div>
  );
};
