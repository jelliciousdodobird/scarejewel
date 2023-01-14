import { Listbox } from "@headlessui/react";
import { IconSelector } from "@tabler/icons";
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
    <Listbox
      value={selectedOption}
      onChange={onChange}
      by="id"
      as="div"
      className="relative flex flex-col "
    >
      <Listbox.Button className="rounded-lg flex justify-center items-center gap-2 h-10 pl-4 pr-2 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold">
        <span className="flex ">{selectedOption.value.semester}</span>
        <span className="flex font-mono ">{selectedOption.value.year}</span>
        <IconSelector />
      </Listbox.Button>
      <Listbox.Options
        as="div"
        className="absolute top-12 p-2 pr-1 bg-white/60 shadow-xl rounded-lg backdrop-blur-sm outline-none  border border-slate-200"
      >
        <ul className="custom-scrollbar-tiny overflow-y-auto overflow-x-hidden max-h-48  pr-4 flex flex-col items-center">
          {options.map((opt) => (
            <Listbox.Option
              className="flex px-3 py-1 rounded cursor-pointer ui-active:bg-indigo-400 ui-active:text-white "
              key={opt.id}
              value={opt}
            >
              <span className="flex min-w-[5rem] font-semibold">
                {opt.value.semester}
              </span>
              <span className="flex font-mono">{opt.value.year}</span>
            </Listbox.Option>
          ))}
        </ul>
      </Listbox.Options>
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
