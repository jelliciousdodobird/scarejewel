import Link from "next/link";

export const Footer = () => {
  return (
    <div className="w-full border-t border-black/[7%] bg-slate-100 text-slate-700 dark:border-white/10 dark:text-neutral-500 dark:bg-neutral-900">
      <nav className="pack-content w-full flex flex-col min-h-[20rem]">
        <ul className="py-8 mt-auto">
          <li className="text-center">
            {
              "Made by two alumni for all CSULB students. Not affliated with CSULB in any capacity."
            }
          </li>
        </ul>
      </nav>
    </div>
  );
};
