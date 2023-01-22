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
        <div className="relative flex flex-col min-w-[12rem] w-full sm:w-auto">
          <Listbox.Button className="flex justify-between items-center h-10 pl-3 pr-[2px] w-full text-slate-400 hover:bg-slate-50 font-semibold rounded-lg bg-white ring-1 ring-black ring-opacity-5">
            <span className="flex gap-2">
              <span className="flex font-extrabold text-slate-900 uppercase">
                {selectedOption.value.semester}
              </span>
              <span className="flex font-bold text-gray-500/80">
                {selectedOption.value.year}
              </span>
            </span>

            <IconSelector stroke={2} className="" />
          </Listbox.Button>

          <Listbox.Options
            // this container/styles ensures that the list container pops up below the button
            as="div"
            className="relative outline-none appearance-none w-full"
          >
            <div
              className={clsx(
                "absolute top-0 left-0 mt-2 w-full", // positioning
                "p-2 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5", // appearance
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
                          "flex items-center px-4 py-2zz min-h-[2.5rem] rounded cursor-pointer text-sm",
                          selected ? "font-bold" : "font-normal",
                          active || selected
                            ? "bg-indigo-50"
                            : "bg-transparent",
                          active || selected
                            ? "text-indigo-700"
                            : "text-slate-900"
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
