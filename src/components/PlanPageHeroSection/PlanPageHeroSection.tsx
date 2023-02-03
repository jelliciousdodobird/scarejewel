"use client";
import { IconArrowRight } from "@tabler/icons";
import clsx from "clsx";
import { motion, Transition } from "framer-motion";
import Link from "next/link";
import { PrettyColor } from "../../utils/colors";
import { bg_color, text_color } from "./HeroSection.variants";

type Column = {
  range: string[];
  courses: CardProps[];
};

const columns: Column[] = [
  {
    range: ["0%", "-50%"],
    courses: [
      { course: "MATH 224", color: "cyan" },
      { course: "CHEM 331", color: "orange" },
      { course: "ECON 300", color: "fuchsia" },
      { course: "GEOG 101", color: "lime" },
      { course: "HIST 383b", color: "rose" },
    ],
  },
  {
    range: ["-50%", "0%"],
    courses: [
      { course: "MUS 120a", color: "emerald" },
      { course: "ENGL 301a", color: "rose" },
      { course: "MATH 113", color: "violet" },
      { course: "PSY 130", color: "yellow" },
      { course: "ART 227", color: "cyan" },
    ],
  },
  {
    range: ["0%", "-60%"],
    courses: [
      { course: "MATH 347", color: "fuchsia" },
      { course: "CHEM 220a", color: "yellow" },
      { course: "ENGL 363", color: "emerald" },
      { course: "STAT 381", color: "indigo" },
      { course: "MAE 272", color: "sky" },
    ],
  },
  {
    range: ["-40%", "0%"],
    courses: [
      { course: "MAE 452", color: "cyan" },
      { course: "ART 131", color: "cyan" },
      { course: "ASTR 100l", color: "cyan" },
      { course: "BLAW 309", color: "cyan" },
      { course: "BIOL 260", color: "cyan" },
    ],
  },
];

type CardProps = {
  color: PrettyColor;
  course: string;
};

const Card = ({ color, course }: CardProps) => {
  const textColor = text_color[color];
  const bgc = bg_color[color];
  return (
    <div
      className={clsx(
        "flex flex-col gap-4 justify-between rounded-2xl min-w-[200px] w-[20vw] aspect-[4/5] p-4 lg:p-8 bg-white dark:bg-neutral-800"
      )}
    >
      <span
        className={clsx(
          "p-4 rounded-2xl text-2xl font-extrabold w-full text-center whitespace-nowrap overflow-hidden",
          bgc,
          textColor
        )}
      >
        {course}
      </span>
      <div className="flex gap-4">
        <span className="rounded-xl w-1/3 h-12 bg-slate-300 dark:bg-neutral-700"></span>
        <span className="rounded-xl w-2/3 h-12 bg-slate-300 dark:bg-neutral-700"></span>
      </div>
      <span className="rounded-xl w-full h-24 bg-slate-300 dark:bg-neutral-700"></span>
    </div>
  );
};

const transition: Transition = {
  duration: 30,
  repeat: Infinity,
  repeatType: "mirror",
  ease: "linear",
};

export const PlanPageHeroSection = () => {
  return (
    <div className="flex flex-col gap-8  w-full">
      <HeroSection />
      {/* <Definition /> */}
    </div>
  );
};

const HeroSection = () => {
  return (
    <div className="relative -top-16 overflow-hidden bg-gradient-to-br from-primary-400 via-primary-500 to-sky-500 h-[100vh]">
      <div className="w-full">
        <div className="relative overflow-hidden flex justify-center gap-8 w-full h-full">
          {columns.map((col, i) => (
            <motion.div
              key={i}
              initial={{ y: col.range[0] }}
              animate={{ y: col.range }}
              transition={transition}
              className="flex flex-col gap-8"
            >
              {col.courses.map((course, j) => (
                <Card key={j} {...course} />
              ))}
            </motion.div>
          ))}
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-white dark:from-neutral-800/70 dark:via-neutral-800/90 dark:to-neutral-800" />

      <div className="z-50 absolute inset-0 pack-content w-full h-full flex justify-center items-center">
        <div className="flex flex-col gap-8">
          <h1 className="text-[clamp(56px,12vw,128px)] text-9xl font-extrabold w-min">
            {"Schedules Made "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-primary-500 to-indigo-500 animate-gradient-x">
              {"Easy."}
            </span>
          </h1>
          <p className="text-[clamp(16px,3vw,32px)] font-medium text-slate-500 dark:text-neutral-500">
            {"Exclusively for CSULB students"}
          </p>
          <motion.span
            whileTap={{ scale: 0.8 }}
            className="flex items-center gap-2 rounded-3xl text-3xl font-bold ml-auto bg-gradient-to-r from-primary-500 via-indigo-500 to-red-500 animate-gradient-x "
          >
            <Link
              href="/plan"
              className="flex items-center gap-2 h-20 w-full px-10 whitespace-nowrap text-white"
            >
              {"Get Planning"}
              <IconArrowRight size={40} stroke={2.5} />
            </Link>
          </motion.span>
        </div>
      </div>

      <div className="absolute right-0 bottom-0 m-6 text-neutral-500">
        {"Not affliated with CSULB in any way."}
      </div>
    </div>
  );
};

const Definition = () => {
  return (
    <div className="w-full py-16 bg-gradient-to-b from-white to-slate-100 dark:from-neutral-800 dark:to-neutral-700">
      <div className="pack-content w-full flex flex-col gap-8 justify-center ">
        <span className="text-7xl font-bold">What exactly is Yotei?</span>
        <div className="z-10 isolate relative w-full max-w-lg flex flex-col gap-6 rounded-2xl ml-auto">
          <h1 className="w-full font-extrabold text-6xl">{"Yotëi"}</h1>
          <p className="flex gap-4 items-center">
            <span className="font-bold text-2xl">{"yo·tei"}</span>
            <span className="font-light text-2xl">{"/yoh teh/"}</span>
          </p>
          <div className="grid grid-cols-[5rem_1fr] gap-8 text-xl">
            <span className="grid place-items-center bg-neutral-300 text-neutral-500 h-8 px-2 rounded-lg font-semibold text-lg italic">
              origin
            </span>
            <span className="mt-[2px]">
              the Japanese word for <span className="font-extrabold">plan</span>
              .
            </span>
            <span className="grid place-items-center bg-neutral-300 text-neutral-500 h-8 px-2 rounded-lg font-semibold text-lg italic">
              noun
            </span>
            <span className="mt-[2px] flex flex-col gap-4 ">
              <span className="">
                <span className="text-neutral-500 font-extrabold mr-4">
                  {"1"}
                </span>
                <span className="">
                  {"a design or scheme of arrangement: "}
                </span>
                <span className=" italic font-light">
                  {"an elaborate plan for seating guests."}
                </span>
              </span>
              <span className="">
                <span className="text-neutral-500 font-extrabold mr-4">
                  {"2"}
                </span>
                <span className="">{"a Mike Tyson quote: "}</span>
                <span className=" italic font-light">
                  {"everybody has a plan until they get punched in the mouth."}
                </span>
              </span>
              <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-primary-500 to-indigo-500 animate-gradient-x">
                <span className="text-primary-500 font-extrabold mr-4">
                  {"3"}
                </span>
                <span className="">
                  {"a web app to help CSULB students arrange their schedules: "}
                </span>
                <span className="italic font-medium">
                  {"the perfect plan for your next semester."}
                </span>
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
