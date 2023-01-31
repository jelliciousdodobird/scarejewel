import clsx from "clsx";
import { PrettyColor } from "../../utils/colors";

const colors: PrettyColor[] = ["emerald", "yellow", "rose", "sky"];

export const SectionSelectorSkeleton = () => {
  //   return <div className="">LOADING</div>;
  return (
    <div className="relative -z-10 flex flex-col">
      <div className="animate-pulse flex text-2xl font-bold p-4">LOADING</div>
    </div>
  );
};
