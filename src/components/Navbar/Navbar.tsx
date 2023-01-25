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
        "bg-white/80 dark:bg-slate-900/80 backdrop-blur-md",
        "border-b border-black/[7%]"
      )}
    >
      <div className="flex justify-between items-center h-16 pack-content">
        <ThemeSwitch />
        <Link href="/">
          <Logo />
        </Link>
        <nav className="">
          <ul className="flex items-center gap-4 h-full">
            {links.map((link) => (
              <li key={link.label} className="capitalize font">
                <Link href={link.path}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};
