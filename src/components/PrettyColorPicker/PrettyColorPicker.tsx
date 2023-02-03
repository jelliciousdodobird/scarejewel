import { RadioGroup } from "@headlessui/react";
import clsx from "clsx";
import { PrettyColor, pretty_colors } from "../../utils/colors";
import { bg_color, ring_color } from "./PrettyColorPicker.variants";

type PrettyColorPickerProps = {
  colors?: PrettyColor[];
  selectedColor: PrettyColor;
  onChange: (value: PrettyColor) => void;
};

const defaultColors = [...pretty_colors];

export const PrettyColorPicker = ({
  colors = defaultColors,
  selectedColor,
  onChange,
}: PrettyColorPickerProps) => {
  return (
    <RadioGroup
      value={selectedColor}
      onChange={onChange}
      className="relative flex flex-col gap-4"
    >
      <RadioGroup.Label className="font-bold text-slate-700 dark:text-white">
        Course Color
      </RadioGroup.Label>
      <ul className="grid grid-cols-[repeat(5,min-content)] justify-start gap-3">
        {colors.map((color) => (
          <RadioGroup.Option
            as="li"
            className="outline-none appearance-none"
            key={color}
            value={color}
          >
            {({ checked, active }) => (
              <button
                type="button"
                className={clsx(
                  "w-8 h-8 rounded-full outline-none appearance-none",
                  "grid place-items-center",
                  "ring-2 ring-offset-2 dark:ring-offset-neutral-800",
                  active || checked ? ring_color[color] : "ring-transparent",
                  bg_color[color]
                )}
              ></button>
            )}
          </RadioGroup.Option>
        ))}
      </ul>
    </RadioGroup>
  );
};
