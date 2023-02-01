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
    <div className="rounded-2xl min-w-[300px] min-h-[340px] bg-white dark:bg-neutral-800"></div>
  );
};

const transition: Transition = {
  duration: 30,
  repeat: Infinity,
  repeatType: "mirror",
};

export const PlanPageHeroSection = () => {
  return (
    <div className="pack-content w-full">
      <div className="relative rounded-3xl bg-gradient-to-br from-primary-400 via-primary-500 to-sky-500 h-96">
        {/*  */}
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
        <div className="rounded-3xl absolute inset-0 shadow-[inset_0_0_20px_0_rgba(0,0,0,0.2)] shadow-black/10"></div>
      </div>
    </div>
  );
};
