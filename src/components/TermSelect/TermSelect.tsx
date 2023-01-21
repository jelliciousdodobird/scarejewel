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
        <div className="relative flex flex-col">
          <Listbox.Button className="flex justify-center items-center gap-2 h-10 pl-4 pr-[2px] py-1 text-slate-400 hover:bg-slate-50 font-semibold rounded-lg bg-white  ring-1 ring-black ring-opacity-5">
            <span className="flex font-bold text-slate-900">
              {selectedOption.value.semester}
            </span>
            <span className="flex  font-bold text-slate-400">
              {selectedOption.value.year}
            </span>
            <IconSelector stroke={2} />
          </Listbox.Button>

          <Listbox.Options
            // this container/styles ensures that the list container pops up below the button
            as="div"
            className="relative outline-none appearance-none"
          >
            <div
              className={clsx(
                "absolute top-0 left-0 mt-2", // positioning
                // "p-2 rounded-lg bg-white border border-slate-200 shadow-xl", // appearance
                "p-2 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5",
                "pr-[2px]" // makes space so that the scrollbar is not flush with the right of this container
              )}
            >
              <ul
                className={clsx(
                  "pr-[calc(8px+2px)]", // makes space so that the left of the scrollbar is not flush with the options,
                  "overflow-x-hidden overflow-y-auto max-h-48 custom-scrollbar-tiny", // scrollbar stuff
                  "flex flex-col"
                )}
              >
                {options.map((opt) => (
                  <Listbox.Option as={Fragment} key={opt.id} value={opt}>
                    {({ active }) => (
                      <li
                        className={clsx(
                          "flex px-4 py-2 rounded cursor-pointer",
                          active ? "bg-slate-200" : "bg-transparent"
                        )}
                      >
                        <span className="flex text-sm font-bold min-w-[5rem]">
                          {opt.value.semester}
                        </span>
                        <span className="flex text-sm font-bold text-slate-400">
                          {opt.value.year}
                        </span>
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
