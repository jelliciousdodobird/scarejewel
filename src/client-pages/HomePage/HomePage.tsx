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
import { Database, Semester, validSemesters } from "../../database/types";
import { getCurrentSemester, getRandomPrettyColor } from "../../utils/util";
import { PartialBy } from "../../utils/types";

type ClassSection = Database["public"]["Tables"]["class_sections"]["Row"];

export type CourseItem = {
  id: string;
  color: PrettyColor;
  selectedDept: ComboOption;
  selectedCourse: ComboOption;
};

export type HomePageProps = {
  semesters: Semester[];
  years: number[];
};

export default function HomePage({ semesters, years }: HomePageProps) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ClassSection[]>([]);

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

  const semesterOptions: SelectOption<Semester>[] = useMemo(
    () =>
      semesters.map((season) => ({
        id: season,
        label: season,
        value: season,
      })),
    [semesters]
  );

  const yearOptions: SelectOption<number>[] = useMemo(
    () =>
      years.map((year) => ({
        id: `${year}`,
        label: `${year}`,
        value: year,
      })),
    [years]
  );

  const [semester, setSemester] =
    useState<SelectOption<Semester>>(default_semester);
  const [year, setYear] = useState<SelectOption<number>>(default_year);

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

          <div className="flex">
            {/* <button
              className="rounded-md p-2 bg-gradient-to-r from-emerald-400 to-fuchsia-600 disabled:cursor-not-allowed"
              type="button"
              disabled={loading}
              onClick={() => {
                console.log(courseItems);
                // setLoading(true);
                // const { data, error } = await supabase
                //   .from("class_sections")
                //   .select("*")
                //   .match({
                //     semester: semester.value,
                //     year: year.value,
                //     dept_abbr: dept.value,
                //     course_number: course.value,
                //   });
                // if (error) console.error(error);
                // setLoading(false);
                // if (data) setData(data);
              }}
            >
              Submit
            </button> */}
          </div>
        </div>
      </div>

      <div className="pack-content w-full flex flex-col gap-4">
        <ThemeSwitch />
        <div className="flex gap-4">
          <Select
            options={semesterOptions}
            onChange={setSemester}
            selectedOption={semester}
          />
          <Select
            options={yearOptions}
            onChange={setYear}
            selectedOption={year}
          />
        </div>

        <ul className="flex flex-col gap-6">
          {courseItems.map((v, i) => (
            <CourseSelector
              key={v.id}
              courseItem={v}
              updateCourseItem={updateCourseItem}
              semester={semester.value}
              year={year.value}
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
      <div className="w-full">
        <pre className="pack-content">{JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  );
}

interface SelectOption<T> {
  id: string;
  label: string;
  value: T;
}

interface SelectProps<T> {
  options: SelectOption<T>[];
  selectedOption: SelectOption<T>;
  onChange: (opt: SelectOption<T>) => void;
}

export const Select = <T extends string | number>({
  options,
  selectedOption,
  onChange,
}: SelectProps<T>) => {
  return (
    <Listbox value={selectedOption} onChange={onChange}>
      <div className="relative flex flex-col">
        <Listbox.Button className="h-10 px-3 py-1 rounded-sm bg-slate-500">
          {selectedOption.label}
        </Listbox.Button>
        <Listbox.Options className="absolute top-9 overflow-hidden flex flex-col bg-slate-500 rounded-sm">
          {options.map((opt) => (
            <Listbox.Option
              className="px-3 py-1 cursor-pointer hover:bg-red-500 hover:text-white "
              key={opt.id}
              value={opt}
            >
              {opt.label}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
    </Listbox>
  );
};

const currentSem = getCurrentSemester();
const default_semester: SelectOption<Semester> = {
  id: currentSem,
  label: currentSem,
  value: currentSem,
};

const currentYear = new Date().getFullYear();
const default_year: SelectOption<number> = {
  id: currentYear.toString(),
  label: currentYear.toString(),
  value: currentYear,
};
