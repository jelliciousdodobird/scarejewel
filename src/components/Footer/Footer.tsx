import Link from "next/link";

export const Footer = () => {
  return (
    <div className="w-full min-h-[20rem] border-t border-t-black/[7%] bg-slate-100 text-slate-900">
      <nav className="pack-content w-full">
        <ul className="py-8">
          <li className="">
            <Link
              href="https://www.youtube.com/watch?v=rmABbHSOTqQ"
              target="_blank"
              className="text-xl flex flex-col items-end"
            >
              <span>I'm just here so I won't get fined </span>
              <span className="font-bold">-footer</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};
