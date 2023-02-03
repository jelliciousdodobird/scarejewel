"use client";
import { motion, Transition } from "framer-motion";
import { PrettyColor } from "../../utils/colors";

type CourseDetail = {
  color: PrettyColor;
  course: string;
};

const courses: CourseDetail[] = [{ course: "BIOL 260", color: "cyan" }];

const Card = () => {
  return (
    <div className="rounded-2xl min-w-[200px] w-[20vw] min-h-[340px] bg-white dark:bg-neutral-800/90"></div>
  );
};

const transition: Transition = {
  duration: 30,
  repeat: Infinity,
  repeatType: "mirror",
};

export const PlanPageHeroSection = () => {
  return (
    <div className="relative -top-16 overflow-hidden bg-gradient-to-br from-primary-400 via-primary-500 to-sky-500 h-[100vh]">
      <div className="absolute"></div>
      <div className="pack-contentzz w-full">
        <div className="relative overflow-hidden flex justify-center gap-8 w-full h-full">
          <motion.div
            animate={{ y: [0, -900] }}
            transition={transition}
            className="flex flex-col gap-8"
          >
            <Card />
            <Card />
            <Card />
            <Card />
            <Card />
          </motion.div>
          <motion.div
            animate={{ y: [-1200, 0] }}
            transition={transition}
            className="flex flex-col gap-8"
          >
            <Card />
            <Card />
            <Card />
            <Card />
            <Card />
          </motion.div>
          <motion.div
            animate={{ y: [0, -1300] }}
            transition={transition}
            className="flex flex-col gap-8"
          >
            <Card />
            <Card />
            <Card />
            <Card />
            <Card />
          </motion.div>
          <motion.div
            animate={{ y: [-900, 0] }}
            transition={transition}
            className="flex flex-col gap-8"
          >
            <Card />
            <Card />
            <Card />
            <Card />
            <Card />
          </motion.div>
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-white dark:from-neutral-800/70 dark:via-neutral-800/90 dark:to-neutral-800"></div>

      <div className="z-50 absolute inset-0 pack-content w-full h-full flex justify-center items-center">
        <div className="flex flex-col items-endzz gap-8">
          <h1 className="text-[clamp(56px,10vw,128px)] text-9xl font-extrabold w-min">
            {"Schedules Made "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-primary-500 to-indigo-500 animate-gradient-x">
              Easy.
            </span>
          </h1>
          <p className="text-[clamp(16px,5vw,32px)] font-medium text-slate-500 dark:text-neutral-500">
            Exclusively for CSULB students.
          </p>
        </div>
      </div>
    </div>
  );
};
