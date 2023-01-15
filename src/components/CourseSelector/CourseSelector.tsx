"use client";

import { Combobox, Disclosure } from "@headlessui/react";
import { IconCheck, IconChevronDown, IconX } from "@tabler/icons";
import { useQuery } from "@tanstack/react-query";
import { PrimitiveAtom, useAtom } from "jotai";
import { Fragment, memo, useEffect, useMemo, useRef, useState } from "react";

import { CourseItem } from "../../state/course-cart";

import { ClassSection, Database, Semester } from "../../database/types";
import { PrettyColor } from "../../utils/colors";
import { formatTitle } from "../../utils/util";
import { SectionSelector } from "../SectionSelector/SectionSelector";
import {
  disclosure_header_bg_color,
  combobox_placeholder_text_color,
  disclosure_header_hover_ring_color,
  disclosure_header_text_color,
  input_bg,
  ring_color,
} from "./CourseSelector.variants";
import { fetchDistinctCourseIds, fetchDistinctDepts } from "../../database/api";
import clsx from "clsx";

const staleTime = 60 * 60 * 1000;

export interface ComboOption {
  id: string;
  label: string;
  value: string;
  title: string;
}

export type CourseSelectorProps = {
  semester: Semester;
  year: number;
  courseItemAtom: PrimitiveAtom<CourseItem>;
  index: number;
};

export const CourseSelector = memo(function CourseSelector({
  semester,
  year,
  courseItemAtom,
  index,
}: CourseSelectorProps) {
  const [courseItem, setCourseItem] = useAtom(courseItemAtom);

  const { data: distinctDepts } = useQuery({
    queryKey: ["fetchDistinctDepts", semester, year],
    queryFn: () => fetchDistinctDepts(semester, year),
    staleTime,
  });

  const { data: distinctCourseIds } = useQuery({
    queryKey: [
      "fetchDistinctCourseIds",
      semester,
      year,
      courseItem.selectedDept.value,
    ],
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

    setCourseItem({
      ...courseItem,
      selectedDept: updateItem,
      selectedCourse: {
        id: "",
        value: "",
        label: "",
        title: "",
      },
      availableSections: [],
    });
  };

  const updateSelectedCourse = (updateItem: ComboOption) => {
    const oldId = courseItem.selectedCourse.id;
    const newId = updateItem.id;
    if (oldId === newId) return;

    setCourseItem({
      ...courseItem,
      selectedCourse: updateItem,
      availableSections: [],
    });
  };

  const title = formatTitle(courseItem.selectedCourse.title);

  const { color } = courseItem;
  const bgc = disclosure_header_bg_color[color];
  const textColor = disclosure_header_text_color[color];

  const headerRingColor = disclosure_header_hover_ring_color[color];
  const headerBtnRingColor = ring_color[color];

  const disableCourseSelect = !courseItem.selectedDept.value;

  const headerRing = `${headerRingColor} ring-0 hover:ring-4 border border-white/0zz hover:border-black/30zz transition-[box-shadow]`;
  const headerBtnRing = `${headerBtnRingColor} ring-0 focus-visible:ring-2 ring-inset appearance-none outline-none transition-[box-shadow]`;

  useEffect(() => {
    console.log("CourseSelector RENDER", courseItem.id);
  });

  return (
    <Disclosure
      defaultOpen
      as="li"
      className="relative flex flex-col gap-4"
      style={{ zIndex: 20 - index }}
    >
      <div
        className={clsx(
          "sticky z-10 top-[calc(4rem+3rem+5px)] flex w-full justify-between rounded-lg p-2 text-sm font-medium",
          // "shadow-[0_2px_10px_10px_rgba(255,255,255,1)]",
          textColor,
          bgc,
          headerRing
        )}
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
          className={`flex justify-between items-center pl-3 pr-1 w-full rounded-md text-base ${headerBtnRing}`}
        >
          <span className="text-left line-clamp-1">
            {title || "Pick a department then course code"}
          </span>
          <span className="ml-5">
            <IconChevronDown
              className={`ui-open:rotate-180 ui-open:transform`}
            />
          </span>
        </Disclosure.Button>
      </div>

      <Disclosure.Panel className="relative z-0">
        <SectionSelector
          semester={semester}
          year={year}
          courseItemAtom={courseItemAtom}
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
  const inputRef = useRef<HTMLInputElement>(null!);
  const buttonRef = useRef<HTMLButtonElement>(null!);

  const [query, setQuery] = useState("");
  const resetQuery = () => {
    setQuery("");
    inputRef?.current?.focus();
  };
  const clickButton = (opened: boolean) =>
    !opened && buttonRef.current?.click();

  const filteredOptions =
    query === ""
      ? options
      : options.filter(
          (opt) =>
            fuzzyCompare(query, opt.value) || fuzzyCompare(query, opt.title)
        );

  // style tokens:
  const inputBg = input_bg[color];
  const placeholderTextColor = combobox_placeholder_text_color[color];
  const ringColor = ring_color[color];

  // styles:
  const openedStyles = `ring-2 bg-white`;
  const closedStyles = `ring-0 bg-white/0`;
  const placeholderStyles = `${placeholderTextColor} placeholder:text-base placeholder:lowercase`;
  const ringStyle = `${ringColor} ring-inset focus:ring-2 hover:ring-2 appearance-none outline-none transition-[box-shadow] `;

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
              ref={inputRef}
              autoComplete="off"
              placeholder={placeholder}
              className={`relative z-50 flex justify-between px-3 h-8 max-w-[62px] min-w-[62px] rounded-md caret-black w-full text-base font-mono font-semibold disabled:cursor-not-allowed ${placeholderStyles} ${ringStyle} ${
                open ? openedStyles : closedStyles
              }`}
              displayValue={(dept: ComboOption) => (open ? query : dept.value)}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => clickButton(open)}
              required
            />

            {/* 
                Taking advantage of this button in TWO ways:
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
            className="absolute z-40 top-0 left-0 p-2 pr-1 pt-12 bg-white/70 shadow-xl rounded-lg backdrop-blur-sm w-full sm:w-min min-w-[18rem] mb-32"
          >
            <Combobox.Button className=" absolute top-0 right-0 flex justify-center items-center p-3 text-rose-500 hover:text-rose-700">
              <IconX />
            </Combobox.Button>
            <ul className="flex flex-col gap-2 custom-scrollbar-tiny overflow-y-auto overflow-x-hidden max-h-48 pr-3">
              {filteredOptions.length === 0 && (
                <li className="w-full">
                  <button
                    type="button"
                    className="w-full flex justify-center items-center gap-4 px-3 py-2 whitespace-nowrap rounded text-rose-700  hover:bg-red-500 hover:text-white"
                    onClick={resetQuery}
                  >
                    No results. Click here to reset.
                  </button>
                </li>
              )}
              {filteredOptions.map((option) => (
                <Combobox.Option key={option.id} value={option} as={Fragment}>
                  {({ active, selected }) => (
                    <li
                      className={clsx(
                        "flex gap-4 px-3 py-2 cursor-pointer whitespace-nowrap rounded",
                        active || selected ? inputBg : "bg-transparent"
                      )}
                    >
                      <span
                        className={clsx(
                          "min-w-[2rem] font-mono font-semibold",
                          active || selected ? "text-white" : "text-stone-800"
                        )}
                      >
                        {option.label}
                      </span>
                      <span
                        className={clsx(
                          " flex-1",
                          active || selected ? "text-white" : "text-stone-600"
                        )}
                      >
                        {formatTitle(option.title)}
                      </span>
                      {selectedOption.id === option.id && (
                        <IconCheck
                          size={20}
                          stroke={3}
                          className="text-white"
                        />
                      )}
                    </li>
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

function arePropsEqual(
  prev: Readonly<CourseSelectorProps>,
  next: Readonly<CourseSelectorProps>
) {
  // if (prev.index !== next.index) return false;
  // if (prev.semester !== next.semester) return false;
  // if (prev.year !== next.year) return false;
  // if (prev.courseItem.id !== next.courseItem.id) return false;
  // if (prev.courseItem.color !== next.courseItem.color) return false;
  // if (prev.courseItem.selectedDept.id !== next.courseItem.selectedDept.id)
  //   return false;
  // if (prev.courseItem.selectedCourse.id !== next.courseItem.selectedCourse.id)
  //   return false;
  // return true;

  if (prev.courseItemAtom.toString() !== next.courseItemAtom.toString())
    return false;

  return true;
}
