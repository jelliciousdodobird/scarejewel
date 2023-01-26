import { IconArrowBadgeRight, IconChevronDown } from "@tabler/icons";
import clsx from "clsx";
import Link from "next/link";

export const HeroSection = () => {
  return (
    <div className="w-full pack-content">
      <div className="overflow-hidden flex relative group flex-col-reverse sm:flex-col-reverse md:flex-row bg-gradient-to-t md:bg-gradient-to-r from-transparent to-indigo-50 rounded-3xl">
        <div className="z-10 isolate relative w-full p-4 md:p-8 md:pl-0 flex flex-col gap-6 rounded-2xl">
          <h1 className="w-full font-extrabold text-6xl">{"Yotëi"}</h1>
          <p className="flex gap-4 items-center">
            <span className="font-bold text-2xl">{"yo·tei"}</span>
            <span className="font-light text-2xl">{"/yoh teh/"}</span>
          </p>
          <div className="grid grid-cols-[5rem_1fr] gap-8 text-xl">
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
                  {"a web app to help CSULB students arrange their schedules: "}
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
              "absolute bottom-[-100px] left-[200px] [perspective:5000px]",
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
              // THIS IS THE TOP CARD
              className={clsx(
                "will-change-transform [border:1px_solid_rgba(0,0,0,0.01)] [-webkit-backface-visibility:hidden]",
                "      [transform:rotateX(60deg)_rotateZ(25deg)_translateZ(200px)]",
                "hover:[transform:rotateX(60deg)_rotateZ(25deg)_translateZ(200px)_translateY(40px)]",
                "overflow-hidden rounded-xl w-[400px] h-[800px] bg-indigo-100",
                "peer/top-card"
              )}
            />

            <div
              // THIS IS THE SHADOW FOR THE LITTLE BOXES
              className={clsx(
                "                    [transform:rotateX(60deg)_rotateZ(25deg)_translateZ(200px)]",
                "peer-hover/top-card:[transform:rotateX(60deg)_rotateZ(25deg)_translateZ(200px)_translateY(40px)]",
                "peer-hover/top-card:scale-[20%]zz scale-0zz",
                "overflow-hidden rounded-xl w-[400px] h-[800px] bg-transparent",
                "flex flex-col items-center justify-end p-12 pb-16",
                "pointer-events-none"
              )}
            >
              <span className="grid grid-cols-[1fr_1fr_1fr] gap-y-8  gap-x-6 w-full text-indigo-600 font-extrabold text-2xl">
                <span className="blur-smzz bg-primary-300/10 w-full h-16 rounded-xl col-span-full row-span-full grid place-items-center " />
                <span className="blur-smzz bg-primary-300/10 w-full h-12 rounded-xl" />
                <span className="blur-smzz bg-primary-300/10 w-full h-12 rounded-xl col-span-2" />
                <span className="blur-smzz bg-primary-300/10 w-full h-12 rounded-xl" />
                <span className="blur-smzz bg-primary-300/10 w-full h-12 rounded-xl col-span-2" />
              </span>
            </div>

            <div
              // THIS IS THE LITTLE BOXES
              className={clsx(
                "                    [transform:rotateX(60deg)_rotateZ(25deg)_translateZ(200px)]",
                "peer-hover/top-card:[transform:rotateX(60deg)_rotateZ(25deg)_translateZ(225px)_translateY(40px)]",
                "overflow-hidden rounded-xl w-[400px] h-[800px] bg-transparent",
                "flex flex-col items-center justify-end p-12 pb-16",
                "pointer-events-none"
              )}
            >
              <span className="grid grid-cols-[1fr_1fr_1fr] gap-y-8  gap-x-6 w-full text-indigo-600 font-extrabold text-2xl">
                <span className="bg-indigo-200 w-full h-16 rounded-xl col-span-full row-span-full grid place-items-center ">
                  MATH 101
                </span>
                <span className="bg-indigo-200 w-full h-12 rounded-xl" />
                <span className="bg-indigo-200 w-full h-12 rounded-xl col-span-2" />
                <span className="bg-indigo-200 w-full h-12 rounded-xl" />
                <span className="bg-indigo-200 w-full h-12 rounded-xl col-span-2" />
              </span>
            </div>
          </div>
          {/* 
              Instead of just settling for animating the scale of the button cus it blurs the borders, 
              we use padding to animate the size of the button. 
              However since we want the button to scale from the center (so the text of the button doesn't shift), 
              we wrap the button with a flex container that can center the button based on its box dimension.
              This means we have to use height and width on that flex container to position the button (after the absolute positioning).
              All this complexity just cus of the blurriness caused from transform:scale().
          */}
          <div className="absolute bottom-0 right-0 h-44 w-48 md:w-64 md:h-40 flex justify-center items-center pointer-events-none [&>*]:pointer-events-auto">
            <Link
              href="/plan"
              className={clsx(
                "relative group/hero-btn h-min w-min font-semibold text-lg text-opacity-100 text-white",
                "transition-[padding] duration-200",
                "      py-2       pl-5       pr-2", // note that difference between the normal and hover padding values
                "hover:py-3 hover:pl-8 hover:pr-5"
              )}
            >
              <span
                className={clsx(
                  "absolute top-0 left-0 w-full h-full rounded-full ring-[2px] ring-indigo-50",
                  "bg-gradient-to-r from-emerald-500 via-primary-500 to-rose-500 animate-gradient-x group-hover/hero-btn:animate-gradient-x-fast" // gradient animation
                )}
              ></span>
              <span className="isolate flex items-center gap-1 whitespace-nowrap uppercasezz">
                Start Plan <IconArrowBadgeRight />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
