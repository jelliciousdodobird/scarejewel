import { IconArrowRight } from "@tabler/icons";
import Link from "next/link";

export const CallToAction = () => {
  return (
    <div className="py-24 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-neutral-700/80 dark:to-neutral-700/20">
      <div className="pack-content w-full flex flex-col md:flex-row gap-8">
        <div className="flex-1 text-[clamp(28px,6vw,40px)] font-extrabold dark:font-bold text-slate-800 dark:text-white">
          Just try it! It's free and you don't need to sign up for anything!
        </div>
        <span className="w-full md:w-auto flex-1 flex items-center gap-2 rounded-3xl text-3xl md:text-6xl font-bold ml-auto bg-gradient-to-r from-primary-500 via-indigo-500 to-red-500 animate-gradient-x ">
          <Link
            href="/plan"
            className="relative flex justify-center items-center gap-4 h-20 w-full px-10 whitespace-nowrap text-white"
          >
            {"Show me!"}
            <IconArrowRight size={40} stroke={2.5} />
          </Link>
        </span>
      </div>
    </div>
  );
};
