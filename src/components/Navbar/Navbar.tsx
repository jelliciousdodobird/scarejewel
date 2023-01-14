import Link from "next/link";

const links = [
  { label: "home", path: "/", color: "#555468" },
  { label: "schedule", path: "/schedule", color: "#555468" },
];

export const Navbar = () => {
  return (
    <nav className="w-full h-16 bg-white/50 dark:bg-black/50 backdrop-blur-md">
      <ul className="pack-content flex items-center gap-4 h-full">
        {links.map((link) => (
          <li key={link.label} className="uppercase font-semibold">
            <Link href={link.path}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
