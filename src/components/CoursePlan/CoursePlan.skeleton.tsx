import clsx from "clsx";
import {
  bg_color_base,
  text_color,
} from "../../components/CourseSelector/CourseSelector.variants";
import { PrettyColor } from "../../utils/colors";

const colors: PrettyColor[] = ["emerald", "yellow", "rose", "sky"];

export const CoursePlanSkeleton = () => {
  return (
    <div className="">
      <div className="flex flex-col gap-4 h-80 w-full rounded-lg blur-[2px]zz blur-lg">
        {colors.map((color) => (
          <div
            key={color}
            className={clsx(
              "w-full h-14 rounded-full",
              bg_color_base[color]
              // text_color[color]
            )}
          ></div>
        ))}
      </div>
    </div>
  );
};
