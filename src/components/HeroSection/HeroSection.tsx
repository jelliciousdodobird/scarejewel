import { IconArrowBadgeRight, IconChevronDown } from "@tabler/icons";
import clsx from "clsx";
import Link from "next/link";

export const HeroSection = () => {
  return (
    <div className="w-full pack-content text-primary-900">
      <div className="overflow-hidden flex relative group flex-col-reverse sm:flex-col-reverse md:flex-row bg-gradient-to-t md:bg-gradient-to-r from-primary-500 to-sky-500 rounded-3xl">
        <div className="z-10 isolate relative w-full p-8 md:p-12 flex flex-col gap-6 rounded-2xl">
          <h1 className="w-full font-extrabold text-6xl text-white">
            {"Yotëi"}
          </h1>
          <p className="flex gap-4 items-center">
            <span className="font-bold text-2xl">{"yo·tei"}</span>
            <span className="font-light text-2xl">{"/yoh teh/"}</span>
          </p>
          <div className="grid grid-cols-[5rem_1fr] gap-8 text-xl">
            <span className="grid place-items-center bg-primary-900 text-slate-200 h-8 px-2 rounded-lg font-semibold text-lg italic">
              origin
            </span>
            <span className="mt-[2px]">
              the Japanese word for <span className="font-extrabold">plan</span>
              .
            </span>
            <span className="grid place-items-center bg-primary-900 text-slate-200 h-8 px-2 rounded-lg font-semibold text-lg italic">
              noun
            </span>
            <span className="mt-[2px] flex flex-col gap-4 ">
              <span className="">
                <span className="text-primary-900 font-extrabold mr-4">
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
                <span className="text-primary-900 font-extrabold mr-4">
                  {"2"}
                </span>
                <span className="">{"a Mike Tyson quote: "}</span>
                <span className=" italic font-light">
                  {"everybody has a plan until they get punched in the mouth."}
                </span>
              </span>
              <span className="text-white">
                <span className="text-primary-500 font-extrabold mr-4 relative">
                  <span className="-z-10 absolute top-1/2 left-1/2 rounded-full bg-white w-7 aspect-square -translate-x-1/2 -translate-y-1/2" />
                  {"3"}
                </span>
                <span className="font-semibold">
                  {"a web app to help CSULB students arrange their schedules: "}
                </span>
                <span className="italic font-light">
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
                "overflow-hidden rounded-xl w-[400px] h-[800px] bg-[#E7E7E7]"
              )}
            />

            <div
              className={clsx(
                "will-change-transform [border:1px_solid_rgba(0,0,0,0.01)] [-webkit-backface-visibility:hidden]",
                "      [transform:rotateX(60deg)_rotateZ(25deg)_translateZ(50px)]",
                "hover:[transform:rotateX(60deg)_rotateZ(25deg)_translateZ(50px)_translateY(40px)]",
                "overflow-hidden rounded-xl w-[400px] h-[800px] bg-[#EDEDED]"
              )}
            />

            <div
              className={clsx(
                "will-change-transform [border:1px_solid_rgba(0,0,0,0.01)] [-webkit-backface-visibility:hidden]",
                "      [transform:rotateX(60deg)_rotateZ(25deg)_translateZ(100px)]",
                "hover:[transform:rotateX(60deg)_rotateZ(25deg)_translateZ(100px)_translateY(40px)]",
                "overflow-hidden rounded-xl w-[400px] h-[800px] bg-[#F3F3F3]"
              )}
            />

            <div
              className={clsx(
                "will-change-transform [border:1px_solid_rgba(0,0,0,0.01)] [-webkit-backface-visibility:hidden]",
                "      [transform:rotateX(60deg)_rotateZ(25deg)_translateZ(150px)]",
                "hover:[transform:rotateX(60deg)_rotateZ(25deg)_translateZ(150px)_translateY(40px)]",
                "overflow-hidden rounded-xl w-[400px] h-[800px] bg-[#F9F9F9]"
              )}
            />

            <div
              // THIS IS THE TOP CARD
              className={clsx(
                "will-change-transform [border:1px_solid_rgba(0,0,0,0.01)] [-webkit-backface-visibility:hidden]",
                "      [transform:rotateX(60deg)_rotateZ(25deg)_translateZ(200px)]",
                "hover:[transform:rotateX(60deg)_rotateZ(25deg)_translateZ(200px)_translateY(40px)]",
                "overflow-hidden rounded-xl w-[400px] h-[800px] bg-[#FFFFFF]",
                "peer/top-card"
              )}
            />

            <div
              // THIS IS THE SHADOW FOR THE LITTLE BOXES
              className={clsx(
                "                    [transform:rotateX(60deg)_rotateZ(25deg)_translateZ(200px)]",
                "peer-hover/top-card:[transform:rotateX(60deg)_rotateZ(25deg)_translateZ(200px)_translateY(40px)]",
                "overflow-hidden rounded-xl w-[400px] h-[800px] bg-transparent",
                "flex flex-col items-center justify-end p-12 pb-16",
                "pointer-events-none"
              )}
            >
              <span className="grid grid-cols-[1fr_1fr_1fr] gap-y-8 gap-x-6 w-full text-primary-600 font-extrabold text-2xl">
                <span className="bg-neutral-300/10 scale-90 w-full h-16 rounded-xl col-span-full row-span-full grid place-items-center " />
                <span className="bg-neutral-300/10 scale-90 w-full h-12 rounded-xl" />
                <span className="bg-neutral-300/10 scale-90 w-full h-12 rounded-xl col-span-2" />
                <span className="bg-neutral-300/10 scale-90 w-full h-12 rounded-xl" />
                <span className="bg-neutral-300/10 scale-90 w-full h-12 rounded-xl col-span-2" />
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
              <span className="grid grid-cols-[1fr_1fr_1fr] gap-y-8  gap-x-6 w-full text-neutral-700 font-extrabold text-2xl">
                <span className="bg-neutral-100 w-full h-16 rounded-xl col-span-full row-span-full grid place-items-center ">
                  MATH 101
                </span>
                <span className="bg-neutral-100 w-full h-12 rounded-xl" />
                <span className="bg-neutral-100 w-full h-12 rounded-xl col-span-2" />
                <span className="bg-neutral-100 w-full h-12 rounded-xl" />
                <span className="bg-neutral-100 w-full h-12 rounded-xl col-span-2" />
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
          <div className="absolute bottom-8 right-4 md:bottom-12 md:right-12 flex justify-center items-center pointer-events-none [&>*]:pointer-events-auto">
            <Link
              href="/plan"
              className={clsx(
                "relative group/hero-btn font-semibold text-lg text-opacity-100 text-white",
                "transition-[padding] duration-200",
                "py-3 px-6"
                // "      py-3       pl-6       pr-6" // note that difference between the normal and hover padding values
                // "hover:py-4 hover:pl-8 hover:pr-8"
              )}
            >
              <span
                className={clsx(
                  "absolute top-0 left-0 w-full h-full rounded-full bg-white group-hover/hero-btn:scale-110 transition-[transform]"
                )}
              />
              <span className="isolate flex items-center gap-1 whitespace-nowrap text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-primary-500 to-indigo-500 animate-gradient-x font-extrabold">
                Start Planning
              </span>
            </Link>
          </div>
        </div>
        <div className="absolute inset-0 pointer-events-none rounded-3xl shadow-[inset_-5px_5px_20px_0px_rgba(0,0,0,0.50)] shadow-black/[0.02]"></div>
      </div>
    </div>
  );
};
