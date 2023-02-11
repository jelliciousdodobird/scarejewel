import Image from "next/image";
import WeekViewGifLight from "../../../../public/assets/week-view-light.gif";
import WeekViewGifDark from "../../../../public/assets/week-view-dark.gif";

export const TimeConflict = () => {
  return (
    <div className="py-24 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-neutral-700/80 dark:to-neutral-700/20">
      <div className="pack-content w-full flex flex-col gap-8">
        <div className="flex flex-col gap-12">
          <span className="text-[clamp(28px,6vw,40px)] font-extrabold dark:font-bold text-slate-800 dark:text-white">
            {"Time Conflicts at a Glance"}
          </span>
          <div className="flex gap-4 flex-wrap">
            <Image
              src={WeekViewGifLight}
              alt="week view gif"
              className="rounded-2xl overflow-hidden dark:hidden max-w-[50rem]"
            />
            <Image
              src={WeekViewGifDark}
              alt="week view gif"
              className="rounded-2xl overflow-hidden hidden dark:flex max-w-[50rem]"
            />
          </div>
          <div className="text-[clamp(16px,5vw,24px)] text-slate-400 dark:text-neutral-500">
            {
              "As you add class sections, you can quickly open the week view to see if you have time conflicts and even pinpoint the exact range with a single glance."
            }
          </div>
          <div className="text-[clamp(16px,5vw,24px)] text-slate-400 dark:text-neutral-500">
            <span className="relative -top-1 rounded-md px-2 py-1 mr-4 text-base font-bold uppercase bg-slate-300 dark:bg-neutral-500 text-slate-700 dark:text-neutral-100">
              {"Tip"}
            </span>
            {
              "Use two windows to see both the week view and the plan view at the same time, our app syncs across tabs!"
            }
          </div>
        </div>
      </div>
    </div>
  );
};
