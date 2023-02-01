import { Listbox } from "@headlessui/react";
import { IconSelector } from "@tabler/icons";
import clsx from "clsx";
import { Fragment } from "react";
import { Semester, Term } from "../../database/types";

export interface TermOption {
  id: string;
  label: string;
  value: Term;
}

interface SelectProps {
  options: TermOption[];
  selectedOption: TermOption;
  onChange: (opt: TermOption) => void;
}

export const TermSelect = ({
  options,
  selectedOption,
  onChange,
}: SelectProps) => {
  return (
    <Listbox value={selectedOption} onChange={onChange} by="id">
      {({ open }) => (
        <div className="z-10 relative flex flex-col min-w-[12rem] w-full sm:w-auto">
          <Listbox.Button
            className={clsx(
              "group grid grid-cols-[1fr_min-content] justify-items-center items-center h-10 w-full text-slate-400 dark:text-neutral-500 font-semibold rounded-xl",
              "bg-white ring-0 ring-primary-100 hover:ring-4 focus:ring-4 border border-slate-200 hover:border-primary-300 focus:border-primary-300",
              "dark:bg-neutral-800 dark:ring-primary-900 dark:border-neutral-700 dark:hover:border-primary-700 dark:focus:border-primary-700",
              "appearance-none outline-none"
            )}
          >
            <span className="flex gap-2">
              <span className="flex font-extrabold text-slate-900 dark:text-white uppercase">
                {selectedOption.value.semester}
              </span>
              <span className="flex font-bold text-gray-500/80 dark:text-neutral-500">
                {selectedOption.value.year}
              </span>
            </span>

            <IconSelector
              size={20}
              className="group-hover:text-primary-500 group-focus:text-primary-500 mr-1"
            />
          </Listbox.Button>

          <Listbox.Options
            // this container/styles ensures that the list container pops up below the button
            as="div"
            className="relative outline-none appearance-none w-full"
          >
            <div
              className={clsx(
                "absolute top-0 left-0 mt-2 w-full", // positioning
                "p-2 rounded-md bg-white dark:bg-neutral-800 shadow-lg ring-1 ring-black/5 dark:ring-white/5 ", // appearance
                "pr-1" // makes space so that the scrollbar is not flush with the right of this container
              )}
            >
              <ul
                className={clsx(
                  "pr-3", // makes space so that the left of the scrollbar is not flush with the options,
                  "overflow-x-hidden overflow-y-auto max-h-[calc(5*2.5rem+4px)] custom-scrollbar-tiny", // scrollbar stuff
                  "flex flex-col gap-[1px]"
                )}
              >
                {options.map((opt) => (
                  <Listbox.Option as={Fragment} key={opt.id} value={opt}>
                    {({ active, selected }) => (
                      <li
                        className={clsx(
                          "flex justify-center items-center px-4 min-h-[2.5rem] rounded cursor-pointer text-sm",
                          selected ? "font-bold" : "font-normal",
                          active || selected
                            ? "bg-primary-100 dark:bg-primary-900"
                            : "bg-transparent",
                          active || selected
                            ? "text-primary-700 dark:text-primary-100"
                            : "text-slate-900 dark:text-white"
                        )}
                      >
                        <span className="min-w-[5rem]">
                          {opt.value.semester}
                        </span>
                        <span>{opt.value.year}</span>
                      </li>
                    )}
                  </Listbox.Option>
                ))}
              </ul>
            </div>
          </Listbox.Options>
        </div>
      )}
    </Listbox>
  );
};

export function createTermOption(semester: Semester, year: number): TermOption {
  return {
    id: `${semester}-${year}`,
    label: `${semester}-${year}`,
    value: { semester, year },
  };
}
