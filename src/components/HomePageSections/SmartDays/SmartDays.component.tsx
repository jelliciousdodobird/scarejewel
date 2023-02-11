"use client";

import { DayTag } from "../../ClassSectionItem/ClassSectionItem";
import { ThemeSwitch } from "../../ThemeSwitch/ThemeSwitch";

export const SmartDays = () => {
  return (
    <div className="py-24 bg-gradient-to-br from-indigo-500 to-primary-500">
      <div className="pack-content w-full flex flex-col gap-8">
        <div className="flex items-start flex-col gap-12">
          <span className="text-[clamp(28px,6vw,40px)] font-extrabold text-white">
            {"Colors With Purpose"}
          </span>
          <div className="flex justify-center items-center gap-4 flex-wrap p-8 bg-white dark:bg-neutral-800 rounded-3xl w-auto">
            <DayTag day="m" />
            <DayTag day="tu" />
            <DayTag day="w" />
            <DayTag day="th" />
            <DayTag day="f" />
            <DayTag day="sa" />
          </div>
          <div className="text-[clamp(16px,5vw,24px)] text-white/60">
            {
              "Every color is hand picked for a purpose. Mon/Wed are represented by warm colors while Tue/Thu are represented by cold colors. These two day combinations are most common and students tend to have to piece together classes from both types to create a balanced schedule."
            }
          </div>

          <div className="text-[clamp(16px,5vw,24px)] italic text-white/60 flex flex-wrap items-center">
            <span className="mr-2">
              {"And yes, both themes account for this."}
            </span>
            <span className="flex gap-2 items-center p-1 pl-4 rounded-2xl text-base bg-white dark:bg-neutral-800 text-slate-900 dark:text-neutral-400">
              {"Try it ->"}
              <ThemeSwitch />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
