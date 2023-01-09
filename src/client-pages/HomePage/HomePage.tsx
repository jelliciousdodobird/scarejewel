"use client";

import { Listbox } from "@headlessui/react";
import { nanoid } from "nanoid";
import { useEffect, useMemo, useRef, useState } from "react";
import { PrettyColor } from "../../utils/colors";
import {
  ComboOption,
  CourseSelector,
} from "../../components/CourseSelector/CourseSelector";
import { ThemeSwitch } from "../../components/ThemeSwitch/ThemeSwitch";
import { Semester } from "../../database/types";
import { getRandomPrettyColor } from "../../utils/util";
import { PartialBy } from "../../utils/types";
import { IconSelector } from "@tabler/icons";

type Term = { semester: Semester; year: number };

export type CourseItem = {
  id: string;
  color: PrettyColor;
  selectedDept: ComboOption;
  selectedCourse: ComboOption;
};

export type HomePageProps = {
  terms: Term[];
};

export default function HomePage({ terms }: HomePageProps) {
  const [loading, setLoading] = useState(false);
  const [courseItems, setCourseItems] = useState<CourseItem[]>([]);

  const addCourseItem = (
    updateItem: PartialBy<PartialBy<CourseItem, "id">, "color">
  ) =>
    setCourseItems((items) => {
      if (items.length > 10) return items;
      const id = nanoid();
      const excludeColors = items.map((v) => v.color);
      const color = getRandomPrettyColor(excludeColors);
      const { selectedDept, selectedCourse } = updateItem;
      return [...items, { id, color, selectedDept, selectedCourse }];
    });

  const updateCourseItem = (updateItem: CourseItem) =>
    setCourseItems((items) =>
      items.map((item) =>
        item.id === updateItem.id ? { ...item, ...updateItem } : item
      )
    );

  const removeCourseItem = (updateItem: CourseItem) =>
    setCourseItems((items) => items.filter(({ id }) => id !== updateItem.id));

  const termOptions: SelectOption[] = useMemo(
    () =>
      [...terms]
        .sort((a, b) => {
          // sort by year (greatest year first, lowest year last):
          if (a.year < b.year) return 1;
          if (a.year > b.year) return -1;

          // if the years are equal then sort by semester:
          return a.semester.localeCompare(b.semester);
        })
        .map((term) => ({
          id: `${term.semester}-${term.year}`,
          label: `${term.semester}-${term.year}`,
          value: term,
        })),
    [terms]
  );

  const [term, setTerm] = useState<SelectOption>(termOptions[0]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative isolate">
        <div className="-z-10 absolute -top-16 w-full h-[calc(100%+4rem)] bg-gradient-to-r from-purple-500 to-pink-500"></div>
        <div className="pack-content flex flex-col py-8">
          <h1 className="text-7xl font-bold">Hero Section</h1>
          <h2 className="text-2xl font-semibold max-w-md">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolore
            eius minima animi eos ipsum aut id similique distinctio, quod
            eveniet?
          </h2>
          <h2 className="text-2xl font-semibold max-w-md">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolore
            eius minima animi eos ipsum aut id similique distinctio, quod
            eveniet?
          </h2>
        </div>
      </div>

      <div className="pack-content w-full flex flex-col gap-4">
        <ThemeSwitch />
        <div className="relative z-10 flex">
          <Select
            options={termOptions}
            onChange={setTerm}
            selectedOption={term}
          />
        </div>

        <ul className="relative z-0 flex flex-col gap-6">
          {courseItems.map((v, i) => (
            <CourseSelector
              key={v.id}
              courseItem={v}
              updateCourseItem={updateCourseItem}
              semester={term.value.semester}
              year={term.value.year}
              index={i}
            />
          ))}
        </ul>

        <button
          className="rounded-md p-2 bg-gradient-to-r from-emerald-400 to-fuchsia-600 disabled:cursor-not-allowed"
          type="button"
          disabled={loading}
          onClick={() => {
            addCourseItem({
              selectedCourse: { id: "", label: "", title: "", value: "" },
              selectedDept: { id: "", label: "", title: "", value: "" },
            });
          }}
        >
          ADD COURSE ITEM
        </button>
      </div>
    </div>
  );
}

interface SelectOption {
  id: string;
  label: string;
  value: Term;
}

interface SelectProps {
  options: SelectOption[];
  selectedOption: SelectOption;
  onChange: (opt: SelectOption) => void;
}

export const Select = ({ options, selectedOption, onChange }: SelectProps) => {
  return (
    <Listbox
      value={selectedOption}
      onChange={onChange}
      by="id"
      as="div"
      className="relative flex flex-col "
    >
      <Listbox.Button className="rounded flex justify-center items-center gap-2 h-10 pl-4 pr-2 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold">
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
              className="flex px-3 py-1 rounded cursor-pointer  ui-active:bg-indigo-400 ui-active:text-white "
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
