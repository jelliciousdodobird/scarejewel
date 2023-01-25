import { IconChevronDown } from "@tabler/icons";
import clsx from "clsx";
import { PrettyColor } from "../../utils/colors";

export const HeroSection = () => {
  return (
    <div className="overflow-hiddenzz relative w-full pack-content bg-indigo-50zz rounded-xlzz">
      <div className="overflow-hidden isolatezz flex gap-8zz relative group flex-col-reverse sm:flex-col-reverse md:flex-row bg-gradient-to-t md:bg-gradient-to-r from-white to-indigo-50 rounded-3xl">
        <div className="z-10 isolate relative max-w-[550px]zz w-full backdrop-blur-xlzz p-4 md:p-8 md:pl-0 flex flex-col gap-6 borderzz border-black/5zz rounded-2xl [backdrop-filter:grayscale(100%)_hue-rotate(120deg)]zz">
          <h1 className="w-full font-extrabold text-6xl">{"Yotëi"}</h1>
          <p className="flex gap-4 items-center">
            <span className="font-bold text-2xl">{"yo·tei"}</span>
            <span className="font-light text-2xl">{"/yoh teh/"}</span>
          </p>
          <div className="grid grid-cols-[5rem_1fr] gap-8 ring-1zz ring-slate-100 text-xl items-centerzz max-w-[550px]zz">
            <span className="grid place-items-center bg-slate-200 text-slate-500 h-8 px-2 rounded-lg font-semibold text-lg italic">
              origin
            </span>
            <span className="mt-[2px]">
              the Japanese word for <span className="font-extrabold">plan</span>
              .
            </span>
            <span className="grid place-items-center bg-slate-200 text-slate-500 h-8 px-2 rounded-lg font-semibold text-lg italic">
              noun
            </span>
            <span className="mt-[2px] flex flex-col gap-4 ">
              <span className="">
                <span className="text-slate-500 font-extrabold whitespace-pre">
                  {"1   "}
                </span>
                <span className="">
                  {"a design or scheme of arrangement: "}
                </span>
                <span className="text-neutral-700 italic font-light">
                  {"an elaborate plan for seating guests."}
                </span>
              </span>
              <span className="">
                <span className="text-slate-500 font-extrabold whitespace-pre">
                  {"2   "}
                </span>
                <span className="">{"a Mike Tyson quote: "}</span>
                <span className="text-neutral-700 italic font-light">
                  {"everybody has a plan until they get punched in the mouth."}
                </span>
              </span>
              <span className="text-indigo-700">
                <span className="text-slate-500zz font-extrabold whitespace-pre">
                  {"3   "}
                </span>
                <span className="text-indigo-700zz font-semibold">
                  {"a webapp to help CSULB students arrange their schedules: "}
                </span>
                <span className="text-neutral-700zz italic font-light">
                  {"the perfect plan for your next semester."}
                </span>
              </span>
            </span>
          </div>
        </div>
        <div className="overflow-hidden z-0 relative w-full flex-grow min-h-[500px]">
          <div
            className={clsx(
              "absolute bottom-[-100px] zztop-[-400px] left-[200px] [perspective:5000px]",
              "grid place-items-center [&>*]:row-span-full [&>*]:col-span-full", // used to stack all child elements on top of each other
              "[&>*]:transition-[transform] [&>*]:duration-300"
            )}
          >
            <div
              className={clsx(
                "will-change-transform [border:1px_solid_rgba(0,0,0,0.01)] [-webkit-backface-visibility:hidden]",
                "      [transform:rotateX(60deg)_rotateZ(25deg)_translateZ(0px)]",
                "hover:[transform:rotateX(60deg)_rotateZ(25deg)_translateZ(0px)_translateY(40px)]",
                "overflow-hidden rounded-xl w-[400px] h-[800px] bg-indigo-500"
              )}
            />

            <div
              className={clsx(
                "will-change-transform [border:1px_solid_rgba(0,0,0,0.01)] [-webkit-backface-visibility:hidden]",
                "      [transform:rotateX(60deg)_rotateZ(25deg)_translateZ(50px)]",
                "hover:[transform:rotateX(60deg)_rotateZ(25deg)_translateZ(50px)_translateY(40px)]",
                "overflow-hidden rounded-xl w-[400px] h-[800px] bg-indigo-400"
              )}
            />

            <div
              className={clsx(
                "will-change-transform [border:1px_solid_rgba(0,0,0,0.01)] [-webkit-backface-visibility:hidden]",
                "      [transform:rotateX(60deg)_rotateZ(25deg)_translateZ(100px)]",
                "hover:[transform:rotateX(60deg)_rotateZ(25deg)_translateZ(100px)_translateY(40px)]",
                "overflow-hidden rounded-xl w-[400px] h-[800px] bg-indigo-300"
              )}
            />

            <div
              className={clsx(
                "will-change-transform [border:1px_solid_rgba(0,0,0,0.01)] [-webkit-backface-visibility:hidden]",
                "      [transform:rotateX(60deg)_rotateZ(25deg)_translateZ(150px)]",
                "hover:[transform:rotateX(60deg)_rotateZ(25deg)_translateZ(150px)_translateY(40px)]",
                "overflow-hidden rounded-xl w-[400px] h-[800px] bg-indigo-200"
              )}
            />

            <div
              className={clsx(
                "will-change-transform [border:1px_solid_rgba(0,0,0,0.01)] [-webkit-backface-visibility:hidden]",
                "      [transform:rotateX(60deg)_rotateZ(25deg)_translateZ(200px)]",
                "hover:[transform:rotateX(60deg)_rotateZ(25deg)_translateZ(200px)_translateY(40px)]",
                "overflow-hidden rounded-xl w-[400px] h-[800px] bg-indigo-100",
                "flex flex-col items-center justify-end p-12 pb-16"
              )}
            >
              <span className="grid grid-cols-[1fr_1fr_1fr] gap-y-8  gap-x-6 w-full text-indigo-600 font-extrabold text-2xl">
                <span className="bg-indigo-200/50 w-full h-16 rounded-xl col-span-full row-span-full grid place-items-center ">
                  MATH 101
                </span>
                <span className="bg-indigo-200/50 w-full h-12 rounded-xl"></span>
                <span className="bg-indigo-200/50 w-full h-12 rounded-xl col-span-2"></span>
                <span className="bg-indigo-200/50 w-full h-12 rounded-xl"></span>
                <span className="bg-indigo-200/50 w-full h-12 rounded-xl col-span-2"></span>
              </span>
            </div>
          </div>
          <button
            type="button"
            className="absolute bottom-12 right-12 rounded-full py-2 px-5 h-min w-min whitespace-nowrap ring-2 ring-indigo-50 text-lg font-semibold text-opacity-100 bg-indigo-500 text-white"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};
