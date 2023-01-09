"use client";

import { Combobox, Disclosure } from "@headlessui/react";
import { IconCheck, IconChevronDown, IconX } from "@tabler/icons";
import { useQuery } from "@tanstack/react-query";
import { Fragment, memo, useEffect, useMemo, useRef, useState } from "react";
import { CourseItem } from "../../client-pages/HomePage/HomePage";
import supabase from "../../database/supabase";
import { ClassSection, Database, Semester } from "../../database/types";
import { PrettyColor } from "../../utils/colors";
import { formatTitle } from "../../utils/util";
import { SectionSelector } from "../SectionSelector/SectionSelector";
import {
  disclosure_header_bg_color,
  combobox_placeholder_text_color,
  disclose_header_hover_gb_color,
  disclosure_header_text_color,
  input_bg,
  outline_color,
} from "./CourseSelector.variants";

const fetchDistinctDepts = async (semester: Semester, year: number) => {
  const { data, error } = await supabase.rpc("get_distinct_depts", {
    _semester: semester,
    _year: year,
  });
  if (error) console.log(error);
  return (
    data?.map((v) => ({ ...v, uid: `${semester}-${year}-${v.dept_abbr}` })) ??
    []
  );
};

const fetchDistinctCourseIds = async (
  semester: Semester,
  year: number,
  dept: string
) => {
  if (dept === "") return []; // if department is empty dont even try to fetch anything

  const { data, error } = await supabase.rpc("get_distinct_course_ids", {
    _semester: semester,
    _year: year,
    _dept_abbr: dept,
  });
  if (error) console.log(error);

  return (
    data?.map((v) => ({
      ...v,
      uid: `${semester}-${year}-${dept}-${v.course_number}`,
    })) ?? []
  );
};

export interface ComboOption {
  id: string;
  label: string;
  value: string;
  title: string;
}

export type CourseSelectorProps = {
  semester: Semester;
  year: number;
  courseItem: CourseItem;
  updateCourseItem: (item: CourseItem) => void;
  index: number;
};

const staleTime = 60 * 60 * 1000;

const arePropsEqual = (
  prev: Readonly<CourseSelectorProps>,
  next: Readonly<CourseSelectorProps>
) => {
  if (prev.semester !== next.semester) return false;
  if (prev.year !== next.year) return false;
  if (prev.courseItem.id !== next.courseItem.id) return false;
  if (prev.courseItem.color !== next.courseItem.color) return false;
  if (prev.courseItem.selectedDept.id !== next.courseItem.selectedDept.id)
    return false;
  if (prev.courseItem.selectedCourse.id !== next.courseItem.selectedCourse.id)
    return false;

  return true;
};

export const CourseSelector = memo(function CourseSelector({
  semester,
  year,
  courseItem,
  updateCourseItem,
  index,
}: CourseSelectorProps) {
  const { data: distinctDepts } = useQuery({
    queryKey: ["dept-abbrs", semester, year],
    queryFn: () => fetchDistinctDepts(semester, year),
    staleTime,
  });

  const { data: distinctCourseIds } = useQuery({
    queryKey: ["course-ids", semester, year, courseItem.selectedDept.value],
    queryFn: () =>
      fetchDistinctCourseIds(semester, year, courseItem.selectedDept.value),
    enabled: courseItem.selectedDept.id !== "",
    staleTime,
  });

  const deptOptions: ComboOption[] = useMemo(
    () =>
      (distinctDepts ?? []).map((v) => ({
        id: v.uid,
        label: v.dept_abbr,
        value: v.dept_abbr,
        title: v.dept_title,
      })),
    [distinctDepts]
  );

  const courseOptions: ComboOption[] = useMemo(
    () =>
      (distinctCourseIds ?? []).map((v) => ({
        id: v.uid,
        label: v.course_number,
        value: v.course_number,
        title: v.course_title,
      })),
    [distinctCourseIds]
  );

  const updateSelectedDept = (updateItem: ComboOption) => {
    const oldId = courseItem.selectedDept.id;
    const newId = updateItem.id;
    if (oldId === newId) return;

    updateCourseItem({
      ...courseItem,
      selectedDept: updateItem,
      selectedCourse: {
        id: "",
        value: "",
        label: "",
        title: "",
      },
    });
  };

  const updateSelectedCourse = (updateItem: ComboOption) => {
    updateCourseItem({ ...courseItem, selectedCourse: updateItem });
  };

  const title = formatTitle(courseItem.selectedCourse.title);

  const { color } = courseItem;
  const bgc = disclosure_header_bg_color[color];
  const hover_bgc = disclose_header_hover_gb_color[color];
  const textColor = disclosure_header_text_color[color];
  const outlineColor = outline_color[color];
  const disableCourseSelect = !courseItem.selectedDept.value;

  return (
    <Disclosure
      defaultOpen
      as="li"
      className="relative flex flex-col"
      style={{ zIndex: 20 - index }}
    >
      <div
        className={`sticky z-10 top-16 flex w-full justify-between rounded-lg p-2 text-sm font-medium ${textColor} ${bgc} ${hover_bgc} shadow-[0_2px_10px_10px_rgba(255,255,255,1)]`}
      >
        <AutoCompleteInput
          options={deptOptions}
          selectedOption={courseItem.selectedDept}
          onChange={updateSelectedDept}
          placeholder="Dept"
          color={color}
        />
        <AutoCompleteInput
          options={courseOptions}
          selectedOption={courseItem.selectedCourse}
          onChange={updateSelectedCourse}
          placeholder="Code"
          color={color}
          disabled={disableCourseSelect}
        />
        <Disclosure.Button
          className={`flex justify-between items-center pl-3 pr-1 w-full rounded-md -outline-offset-2 outline outline-0 focus:outline-2 ${outlineColor} text-base`}
        >
          <span className="text-left line-clamp-1">
            {title || "Pick a department then course code"}
          </span>
          <span className="ml-5">
            <IconChevronDown
              className={`ui-open:rotate-180 ui-open:transform h-5 w-5`}
            />
          </span>
        </Disclosure.Button>
      </div>

      <Disclosure.Panel className="relative z-0">
        <SectionSelector
          semester={semester}
          year={year}
          dept={courseItem.selectedDept.value}
          course_number={courseItem.selectedCourse.value}
        />
      </Disclosure.Panel>
    </Disclosure>
  );
},
arePropsEqual);

const fuzzy = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, "");
const fuzzyCompare = (searchTerm: string, comparedTerm: string) =>
  fuzzy(comparedTerm).includes(fuzzy(searchTerm));

interface ComboerProps {
  options: ComboOption[];
  selectedOption: ComboOption;
  onChange: (opt: ComboOption) => void;
  disabled?: boolean;
  placeholder?: string;
  color?: PrettyColor;
}

export const AutoCompleteInput = ({
  options,
  selectedOption,
  onChange,
  disabled = false,
  placeholder = "",
  color = "amber",
}: ComboerProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null!);
  const clickButton = (opened: boolean) =>
    !opened && buttonRef.current?.click();

  const [query, setQuery] = useState("");
  const filteredOptions =
    query === ""
      ? options
      : options.filter(
          (opt) =>
            fuzzyCompare(query, opt.value) || fuzzyCompare(query, opt.title)
        );

  const inputBg = input_bg[color];
  const placeholderTextColor = combobox_placeholder_text_color[color];
  const italic = selectedOption.value === "" ? "" : "";
  const outlineColor = outline_color[color];
  const openedStyles = `placeholder:text-white/80 ${inputBg} text-white  font-normal`;
  const closedStyles = `${placeholderTextColor} bg-transparent  font-semibold`;

  return (
    <Combobox
      disabled={disabled}
      value={selectedOption}
      onChange={onChange}
      by="id"
    >
      {({ open }) => (
        <>
          <div className="relative">
            <Combobox.Input
              autoComplete="off"
              placeholder={placeholder}
              className={`relative z-50 flex justify-between px-3 h-8 max-w-[62px] min-w-[62px] rounded-md text-base placeholder:text-base placeholder:capitalize  disabled:cursor-not-allowed caret-black  w-full font-mono font-semiboldzz ${outlineColor} outline -outline-offset-2 outline-0 hover:outline-2 focus:outline-2 ${
                open ? openedStyles : closedStyles
              } ${italic}`}
              displayValue={(dept: ComboOption) => (open ? query : dept.value)}
              onChange={(e) => setQuery(e.target.value)}
              onClick={() => clickButton(open)}
              required
            />

            {/* taking advantage of this button in TWO ways:
                1. as a graphic element to let the user know they must fill in the input field (red dot)
                2. as a way to force headless-ui to open the options menu when the input is clicked (using refs)
            */}
            <Combobox.Button
              className="absolute z-50 flex h-1 w-1 top-[5px] right-[5px] text-red-500 pointer-events-none"
              ref={buttonRef}
              disabled
            >
              {selectedOption.value === "" && (
                <>
                  <span
                    className={`absolute rounded-full h-2 w-2 -top-[0.125rem] -left-[0.125rem] ${
                      open ? "bg-white/75" : "bg-red-500/75"
                    } animate-ping-slow `}
                  />
                  <span
                    className={`relative rounded-full h-full w-full ${
                      open ? "bg-white" : "bg-red-500"
                    }`}
                  />
                </>
              )}
            </Combobox.Button>
          </div>

          <Combobox.Options
            as="div"
            className="absolute z-40 top-0 left-0 p-2 pr-1 pt-12 bg-white/60 shadow-xl rounded-lg backdrop-blur-sm w-full sm:w-min min-w-[18rem] mb-32 ring-1 ring-slate-200"
          >
            <Combobox.Button className=" absolute top-0 right-0 flex justify-center items-center p-3 text-rose-500 hover:text-rose-700">
              <IconX />
            </Combobox.Button>
            <ul className="overflow-y-auto overflow-x-hidden max-h-48 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-stone-400 hover:scrollbar-track-stone-200 hover:scrollbar-thumb-stone-900 pr-4">
              {filteredOptions.length === 0 && (
                <li className="px-3 py-1 text-rose-700">😵 No results</li>
              )}
              {filteredOptions.map((option) => (
                <Combobox.Option
                  key={option.id}
                  value={option}
                  className={`flex gap-4 px-3 py-2 cursor-pointer whitespace-nowrap rounded  ui-not-selected:ui-not-active:bg-transparent ${inputBg} `}
                >
                  <span className="text-stone-800 ui-active:text-white ui-selected:text-white min-w-[2rem] font-mono font-semibold">
                    {option.label}
                  </span>
                  <span className="text-stone-600 ui-active:text-white ui-selected:text-white flex-1">
                    {formatTitle(option.title)}
                  </span>
                  {selectedOption.id === option.id && (
                    <IconCheck size={20} stroke={3} className="text-white" />
                  )}
                </Combobox.Option>
              ))}
            </ul>
          </Combobox.Options>
        </>
      )}
    </Combobox>
  );
};
