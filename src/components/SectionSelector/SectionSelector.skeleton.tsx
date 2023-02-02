import clsx from "clsx";
import { PrettyColor } from "../../utils/colors";

const colors: PrettyColor[] = ["emerald", "yellow", "rose", "sky"];
const skeletonQuantity: number = 3;

export const SectionSelectorSkeleton = () => {
  //   return <div className="">LOADING</div>;
  return (
    <div className="flex flex-col gap-8 first:mt-0 py-2">
      <div className="flex flex-col gap-4"></div>
      <ul className="grid grid-cols-[repeat(auto-fill,minmax(min(320px,100%),1fr))] gap-8 rounded-md bg-transparent">
        {[...Array(skeletonQuantity)].map((x, i) => (
          <ClassSectionItemSkeleton></ClassSectionItemSkeleton>
        ))}
      </ul>
    </div>
    // <div className="relative -z-10 flex flex-col">
    //   <div className="animate-pulse flex text-2xl font-bold p-4">LOADING</div>
    // </div>
  );
};

export const ClassSectionItemSkeleton = () => {
  return (
    // <div className="relative -z-10 flex flex-col">
    //   <div className="animate-pulse flex text-2xl font-bold p-4">LOADING</div>
    // </div>
    <li className="relative flex flex-col">
      <div
        className={clsx(
          "flex-grow h-auto",
          "flex flex-col gap-8 p-6 bg-white",
          "rounded-2xl transition-[opacity_background-color_box-shadow] duration-300",
          "shadow-[rgba(149,157,165,0.15)_0px_8px_24px]"
        )}
      >
        <div className={clsx("flex flex-col gap-8")}>
          <div className="flex gap-6">
            <div className="w-20 h-20 rounded-lg pl-2 pr-3 py-1 bg-slate-100"></div>
            <div className="flex flex-col justify-center gap-[0.35rem]">
              <div className="h-6 w-24 bg-slate-100 rounded-md"></div>
              <div className="h-4 w-16 bg-slate-100 rounded-md"></div>
              <div className="h-4 w-20 bg-slate-100 rounded-md"></div>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex flex-row gap-2">
              <div className="h-4 w-36 bg-slate-100 rounded-md"></div>
              <div className="h-4 w-16 bg-slate-100 rounded-md"></div>
            </div>
            <div className="h-6 w-14 bg-slate-100 rounded-full"></div>
          </div>
          <div className="h-4 w-auto bg-slate-100 rounded-md"></div>
        </div>
      </div>
      <div className="absolute top-4 right-4 flex flex-col items-center gap-2 h-min w-min">
        <div className="h-12 w-12 rounded-full bg-slate-100"></div>
        <div className="h-10 w-10 rounded-full bg-slate-100"></div>
      </div>
    </li>
  );
};
