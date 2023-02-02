"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export const Logo = () => {
  const pathname = usePathname();
  return (
    <span className="relative flex items-center gap-2 h-min">
      <div className="grid grid-cols-2 grid-row-2 min-h-min min-w-min">
        <span className="w-3 aspect-square bg-primary-400 [clip-path:polygon(0_0,100%_100%,100%_0)]"></span>
        <span className="w-3 aspect-square bg-primary-400 [clip-path:polygon(0_100%,100%_100%,100%_0)]"></span>
        <span className="w-3 aspect-square bg-transparent-400"></span>
        <span className="w-3 aspect-square bg-primary-400 [clip-path:polygon(0_100%,100%_0,0_0)]"></span>
      </div>
      <span className="relative top-[-3px]zz [line-height:22px] h-min text-xl font-extrabold dark:font-semibold text-neutral-800 dark:text-white">
        {"Yotei"}
        {pathname === "/" && (
          <motion.div
            layoutId="nav-link"
            className="absolute -bottom-1 right-0 w-[5px]zz w-full  h-[2px] bg-primary-400z bg-neutral-400z bg-current"
            // className="absolute top-[3px] right-[8px] w-[6px] h-[2px] bg-neutral-400"
          />
        )}
      </span>
    </span>
  );
};
