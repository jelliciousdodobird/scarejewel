"use client";

import clsx from "clsx";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export const Catalog = () => {
  return (
    <div className="py-24 pack-content w-full flex flex-col gap-8 overflow-hidden">
      <div className="flex flex-col items-start gap-24">
        <span className="z-10 relative text-[clamp(28px,6vw,40px)] font-extrabold dark:font-bold text-slate-800 dark:text-white">
          Extensive Catalog of Classes
        </span>
        <div className="z-0 relative flex py-1 px-8 rounded-xl">
          <Year />
          <Semester />
        </div>
        <div className="z-10 relative text-[clamp(16px,5vw,24px)] text-slate-500 dark:text-neutral-500">
          Whether you're a student looking for the latest classes or an alumni
          looking for where you went wrong, our catalog has you covered.
          Features spring, summer, and fall semesters dating all the way back to
          2008.
        </div>
      </div>
    </div>
  );
};

const Year = () => {
  const [yearIndex, setYearIndex] = useState(3);

  useEffect(() => {
    const interval = setInterval(() => {
      setYearIndex((v) => (v + 1) % years.length);
    }, 500 * 3);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const getOpacity = (index: number, yearIndex: number) => {
    const diff = Math.abs(yearIndex - index);

    if (diff >= 3) return 0;
    else if (diff >= 2) return 0.1;
    else if (diff >= 1) return 0.2;
    else return 1;
  };

  const getBlur = (index: number, yearIndex: number) => {
    const diff = Math.abs(yearIndex - index);

    let blur = 0;

    if (diff >= 3) blur = 4;
    else if (diff >= 2) blur = 4;
    else if (diff >= 1) blur = 1;
    else blur = 0;

    return `blur(${blur}px)`;
  };

  return (
    <div className="relative flex">
      <span
        // this element ensures we have the width and height one item would take up
        className="text-[clamp(40px,10vw,100px)] [line-height:1] font-bold font-mono opacity-0 pointer-events-none"
      >
        {years[0]}
      </span>
      <div className="absolute top-0 left-0 flex flex-col">
        {years.map((year, i) => (
          <motion.span
            key={year}
            animate={{
              opacity: getOpacity(i, yearIndex),
              filter: getBlur(i, yearIndex),
              y: `${(i - yearIndex) * 100}%`,
            }}
            className={clsx(
              "absolute top-0 left-0",
              "text-[clamp(40px,10vw,100px)] [line-height:1] font-bold font-mono text-slate-800 dark:text-neutral-100"
            )}
          >
            {year}
          </motion.span>
        ))}
      </div>
    </div>
  );
};

const Semester = () => {
  const [semIndex, setSemIndex] = useState(0);
  const semester = semesters[semIndex];
  // const name = "spring";
  const name = semester.name;

  useEffect(() => {
    const interval = setInterval(() => {
      setSemIndex((v) => (v + 1) % semesters.length);
    }, 500);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <span
      className={clsx(
        "text-[clamp(40px,10vw,100px)] [line-height:1] font-extrabold uppercase text-transparent bg-clip-text bg-gradient-to-r",
        semester.to,
        semester.from
      )}
    >
      {name}
    </span>
  );
};

const start = 2008;
const end = 2023;
const length = end - start + 1;
const years = [...Array(length).keys()].map((_, i) => start + i).reverse();

const semesters = [
  { name: "Spring", from: "from-emerald-500", to: "to-lime-500" },
  { name: "Summer", from: "from-rose-500", to: "to-red-700" },
  { name: "Fall", from: "from-orange-500", to: "to-yellow-500" },
];
