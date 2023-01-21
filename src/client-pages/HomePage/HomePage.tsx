"use client";

import { Popover, Transition } from "@headlessui/react";
import { nanoid } from "nanoid";
import { Fragment, useMemo } from "react";

import { CourseSelector } from "../../components/CourseSelector/CourseSelector";

import { Term } from "../../database/types";
import { getRandomPrettyColor } from "../../utils/util";
import {
  IconCalendarEvent,
  IconPlus,
  IconX,
} from "@tabler/icons";
import { useAtom} from "jotai";
import {
  courseItemsAtomAtom,
  selectedTermOptionAtom,
} from "../../state/course-cart";
import { useHasMounted } from "../../hooks/useHasMounted";
import { WeeklyPreview } from "../../components/WeeklyPreview/WeeklyPreview";
import { courseItemsAtom } from "../../state/course-cart";
import {
  createTermOption,
  TermOption,
  TermSelect,
} from "../../components/TermSelect/TermSelect";
import clsx from "clsx";
import { Portal } from "../../components/Portal/Portal";

export type HomePageProps = {
  terms: Term[];
};

export default function HomePage({ terms }: HomePageProps) {
  return (
    <div className="relative flex flex-col gap-4 bg-gradient-to-bzz from-whitezz to-slate-100zz min-h-full justify-betweenzz">
      <CourseListPanel terms={terms} />
      <WeeklySidebar />
    </div>
  );
}

const WeeklySidebar = () => {
  return (
    <Popover as={Fragment}>
      <Portal portalToTag="body">
        {/* Need both divs since we're using position: fixed instead of sticky. Sticky has issues with chrome on android. */}
        <div className="z-50 fixed bottom-0 pb-4 h-min w-full sm:w-[calc(100%-1rem)] pointer-events-none ">
          <div className="flex justify-end pack-content w-full">
            <Popover.Button
              type="button"
              className="rounded-full w-min h-min p-4 bg-indigo-500 text-white pointer-events-auto shadow-lg "
            >
              {({ open }) => (open ? <IconX /> : <IconCalendarEvent />)}
            </Popover.Button>
          </div>
        </div>
      </Portal>
      <Portal portalToTag="body">
        <Popover.Panel
          static
          className="z-40 fixed top-0 left-0 w-full h-full pointer-events-none"
        >
          {({ open, close }) => (
            <div
              className={clsx(
                "relative w-full h-full max-h-full overflow-x-hidden transition-[backdrop-filter_background-color]",
                open ? "bg-slate-500/10" : "bg-slate-500/0",
                open ? "backdrop-blur-md" : "backdrop-blur-0",
                open ? "overflow-y-auto" : "overflow-y-hidden",
                open ? "pointer-events-auto" : "pointer-events-none"
              )}
            >
              <div
                className="absolute top-0 left-0 w-full h-full"
                onClick={() => close()}
              />
              <Transition
                show={open}
                as={Fragment}
                enter="transition duration-250 ease-linear"
                enterFrom="transform translate-x-[100%]"
                enterTo="transform translate-x-0"
                leave="transition duration-250 ease-linear"
                leaveFrom="transform translate-x-0"
                leaveTo="transform translate-x-[100%]"
              >
                <div className="pointer-events-none pack-content flex flex-col py-8 [&>*]:pointer-events-auto">
                  <WeeklyPreview />
                </div>
              </Transition>
            </div>
          )}
        </Popover.Panel>
      </Portal>
    </Popover>
  );
};

const CourseListPanel = ({ terms }: { terms: Term[] }) => {
  const mounted = useHasMounted(); // need to make sure we're mounted so we can use the localstorage in the courseItemsAtomAtom
  const [courseItems, setCourseItems] = useAtom(courseItemsAtomAtom);
  const [selectedTermOption, setSelectedTermOption] = useAtom(
    selectedTermOptionAtom
  );

  const termOptions: TermOption[] = useMemo(
    () =>
      [...terms]
        .sort((a, b) => {
          // sort by year (greatest year first, lowest year last):
          if (a.year < b.year) return 1;
          if (a.year > b.year) return -1;

          // if the years are equal then sort by semester:
          return a.semester.localeCompare(b.semester);
        })
        .map((term) => createTermOption(term.semester, term.year)),
    [terms]
  );

  if (!mounted) return null;

  return (
    <div className="pack-content w-full flex flex-col gap-4">
      <div className="pack-contentzz w-full relative z-10 flex justify-between">
        <TermSelect
          options={termOptions}
          onChange={setSelectedTermOption}
          selectedOption={selectedTermOption}
        />

        <AddButton />
      </div>

      <ul className="relative z-0 flex flex-col gap-6">
        {courseItems.map((v, i) => (
          <CourseSelector
            key={v.toString()}
            courseItemAtom={v}
            semester={selectedTermOption.value.semester}
            year={selectedTermOption.value.year}
            index={i}
          />
        ))}
      </ul>
    </div>
  );
};

const AddButton = ({ addLimit = 10 }: { addLimit?: number }) => {
  const [courseItems, setCourseItems] = useAtom(courseItemsAtom);

  const addCourseItem = () => {
    if (courseItems.length >= addLimit) return;

    setCourseItems((items) => {
      const takenColors = items.map(({ color }) => color);
      const newItem = {
        id: nanoid(),
        color: getRandomPrettyColor(takenColors),
        selectedCourse: { id: "", label: "", title: "", value: "" },
        selectedDept: { id: "", label: "", title: "", value: "" },
        availableSections: [],
      };

      return [...items, newItem];
    });
  };

  return (
    <button
      type="button"
      className="flex justify-center items-center gap-2 rounded-lg p-2 pr-3 bg-indigo-500 text-white font-semibold disabled:cursor-not-allowed"
      onClick={addCourseItem}
    >
      <IconPlus />
      Add Course
    </button>
  );
};
