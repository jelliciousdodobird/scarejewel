import clsx from "clsx";
import { PrettyColor } from "../../utils/colors";

const colors: PrettyColor[] = ["emerald", "yellow", "rose", "sky"];
const skeletonQuantity: number = 3;

export const SectionSelectorSkeleton = () => {
  //   return <div className="">LOADING</div>;
  return (
    <ul className="grid grid-cols-[repeat(auto-fill,minmax(min(320px,100%),1fr))] gap-8 rounded-md bg-transparent">
      {[...Array(skeletonQuantity)].map((x, i) => (
        <ClassSectionItemSkeleton></ClassSectionItemSkeleton>
      ))}
    </ul>
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
          "flex flex-col gap-8 p-6 bg-white",
          "rounded-lg transition-[opacity_background-color_box-shadow] duration-300",
          "rounded-tr-[6rem]",
          "shadow-center shadow-slate-500/10 border-2"
        )}
      >
        owo
        {/* <div className="flex gap-6">
          <div className={clsx("w-20 h-20 rounded-lg", "bg-slate-100")}></div>
        </div> */}
      </div>
    </li>
  );
};
