import clsx from "clsx";
import Link from "next/link";
import { Logo } from "../Logo/Logo";
import { ThemeSwitch } from "../ThemeSwitch/ThemeSwitch";

const links = [
  { label: "home", path: "/", color: "#555468" },
  { label: "schedule", path: "/schedule", color: "#555468" },
];

export const Navbar = () => {
  return (
    <nav
      className={clsx(
        "bg-white dark:bg-black backdrop-blur-mdzz",
        "border-b border-black/[7%]"
      )}
    >
      <div className="h-16 pack-content flex justify-between items-center w-full">
        <ThemeSwitch />
        <Logo />
        <ul className="flex items-center gap-4 h-full">
          {links.map((link) => (
            <li key={link.label} className="capitalize font">
              <Link href={link.path}>{link.label}</Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};
