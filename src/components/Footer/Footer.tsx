import Link from "next/link";

export const Footer = () => {
  return (
    <div className="w-full border-t border-black/[7%] bg-slate-100 text-slate-900 dark:border-white/10 dark:text-neutral-300 dark:bg-neutral-900">
      <nav className="pack-content w-full  flex flex-col justify-end min-h-[20rem]">
        <ul className="py-8 ml-auto">
          <li className="">
            <Link
              href="https://www.youtube.com/watch?v=rmABbHSOTqQ"
              target="_blank"
              className="text-xl flex flex-col items-end"
              title="this is a joke because I don't have content for a footer"
            >
              <q cite="https://www.youtube.com/watch?v=rmABbHSOTqQ">
                I'm just here so I won't get fined.
              </q>
              <span className="font-bold">{"— footer"}</span>
            </Link>
          </li>
          <li className="hidden">
            {
              "bro chill i know this is a list and it looks like i only have one item but there will be more stuff here in the future ok? and stop inpecting my html like that >:("
            }
          </li>
        </ul>
      </nav>
    </div>
  );
};
