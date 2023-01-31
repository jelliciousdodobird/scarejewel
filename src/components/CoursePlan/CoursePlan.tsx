"use client";

import { Tab, Transition } from "@headlessui/react";
import {
  IconCirclePlus,
  IconAlertOctagon,
  IconX,
  IconChevronLeft,
  IconChevronRight,
  IconPlus,
} from "@tabler/icons";
import clsx from "clsx";
import { motion } from "framer-motion";
import { atom, PrimitiveAtom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { nanoid } from "nanoid";
import { useMemo, useState, Fragment, WheelEventHandler, useRef } from "react";
import { Term } from "../../database/types";
import { useHasMounted } from "../../hooks/useHasMounted";
import {
  courseItemsAtomAtom,
  selectedTermOptionAtom,
  courseItemsAtom,
  CourseItem,
} from "../../state/course-cart";
import { getRandomPrettyColor } from "../../utils/util";
import { Backdrop } from "../Backdrop/Backdrop";
import { CourseSelector } from "../CourseSelector/CourseSelector";
import {
  bg_color_base,
  text_color,
} from "../CourseSelector/CourseSelector.variants";
import { Portal } from "../Portal/Portal";
import {
  TermOption,
  createTermOption,
  TermSelect,
} from "../TermSelect/TermSelect";
import { CoursePlanSkeleton } from "./CoursePlan.skeleton";
import { hex_bg_color } from "./CoursePlan.variants";

export const selectedTabAtom = atom(0);
const defaultAtom = atom({
  id: "",
  color: "cyan",
  availableSections: [],
  selectedDept: {},
  selectedCourse: {},
});

export const CoursePlan = ({ terms }: { terms: Term[] }) => {
  const mounted = useHasMounted(); // need to make sure we're mounted so we can use the localstorage in the courseItemsAtomAtom
  const [courseItems, setCourseItems] = useAtom(courseItemsAtomAtom);
  const [selectedTermOption, setSelectedTermOption] = useAtom(
    selectedTermOptionAtom
  );

  const [selectedTab, setSelectedTab] = useAtom(selectedTabAtom);

  const ref = useRef<HTMLDivElement>(null!);
  const scrollRight = () => {
    if (ref.current) ref.current.scrollLeft += 150;
  };
  const scrollLeft = () => {
    if (ref.current) ref.current.scrollLeft -= 150;
  };

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
    <Tab.Group
      selectedIndex={selectedTab}
      onChange={setSelectedTab}
      defaultIndex={0}
    >
      <div className="flex flex-col gap-4 w-full">
        <div className="z-10 sticky top-[4rem] backdrop-blur-sm bg-white/90 w-full border-b border-slate-200 pt-4 sm:pt-0">
          <div className="pack-content w-full flex items-center flex-col sm:flex-row max-w-full rounded-xlzz gap-0 sm:gap-4">
            <TermSelect
              options={termOptions}
              onChange={setSelectedTermOption}
              selectedOption={selectedTermOption}
            />
            <div className="flex items-center gap-2 min-w-0 flex-1 w-full">
              <Tab.List
                ref={ref}
                className={clsx(
                  "flex gap-2 flex-1 w-full overflow-x-auto no-scrollbar py-4 scroll-smooth"
                )}
              >
                {courseItems.map((v) => (
                  <TabItem key={v.toString()} courseItemAtom={v} />
                ))}
                {[...Array(10 - courseItems.length)].map((_, i) => (
                  <div
                    key={i}
                    className="h-10 min-w-[5rem] bg-slate-100 rounded-xl"
                  />
                ))}
              </Tab.List>
              <div className="flex rounded-xl overflow-hidden w-10 h-10 text-slate-500 bg-slate-200">
                <button
                  type="button"
                  className="w-4 grid place-items-center bg-inherit hover:bg-slate-300 flex-1"
                  onClick={scrollLeft}
                >
                  <IconChevronLeft size={12} stroke={2.5} />
                </button>
                <button
                  type="button"
                  className="w-4 grid place-items-center bg-inherit hover:bg-slate-300 flex-1"
                  onClick={scrollRight}
                >
                  <IconChevronRight size={12} stroke={2.5} />
                </button>
              </div>
              <AddButton />
            </div>
          </div>
        </div>
        <Tab.Panels className="isolate z-0 pack-content w-full">
          {courseItems.map((v) => (
            <Tab.Panel key={v.toString()}>
              <CourseSelector
                courseItemAtom={v}
                semester={selectedTermOption.value.semester}
                year={selectedTermOption.value.year}
              />
            </Tab.Panel>
          ))}
          {courseItems.length === 0 && <CoursePlanSkeleton />}
        </Tab.Panels>
      </div>
    </Tab.Group>
  );
};

const TabItem = ({
  courseItemAtom,
}: {
  courseItemAtom: PrimitiveAtom<CourseItem>;
}) => {
  const [courseItem, setCourseItem] = useAtom(courseItemAtom);

  const { color } = courseItem;

  const dept = courseItem.selectedDept.value;
  const courseCode = courseItem.selectedCourse.value;
  const empty = dept === "" || courseCode === "";
  const title = empty ? "Untitled" : `${dept} ${courseCode.toLowerCase()}`;

  // style tokens:
  const bgColor = bg_color_base[color];
  const textColor = text_color[color];

  return (
    <Tab as={Fragment}>
      {({ selected }) => (
        <button
          className={clsx(
            "relative px-4 h-10 rounded-xl whitespace-nowrap font-bold text-sm",
            "outline-none appearance-none",
            bgColor,
            textColor
          )}
        >
          <span>{title}</span>
          {selected && (
            <motion.span
              layoutId="slide"
              animate={{ backgroundColor: hex_bg_color[color] }}
              className="absolute left-0 -bottom-4 h-1 w-full bg-slate-500"
            />
          )}
        </button>
      )}
    </Tab>
  );
};

const AddButton = ({ addLimit = 10 }: { addLimit?: number }) => {
  const [courseItems, setCourseItems] = useAtom(courseItemsAtom);
  const [showError, setShowError] = useState(false);
  const close = () => setShowError(false);
  const setSelectedTab = useSetAtom(selectedTabAtom);

  const overlimit = courseItems.length >= addLimit;

  const addCourseItem = () => {
    if (overlimit) {
      setShowError(true);
      return;
    }

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

    setSelectedTab(courseItems.length);
  };

  return (
    <>
      <button
        type="button"
        className="flex justify-center items-center gap-2 w-min px-2 h-10 rounded-xl rounded-3xlzz rounded-blzz bg-primary-500 text-white font-bold disabled:cursor-not-allowed"
        onClick={addCourseItem}
      >
        <IconPlus />
      </button>
      <ErrorMessage show={showError} close={close} />
    </>
  );
};

const ErrorMessage = ({
  show,
  close,
}: {
  show: boolean;
  close: () => void;
}) => {
  return (
    <Portal portalToTag="body">
      <Backdrop
        open={show}
        manual
        close={close}
        className="grid place-items-center"
      >
        <Transition
          as={Fragment}
          show={show}
          enter="transition-[transform_opacity] duration-200 ease-in"
          enterFrom="transform scale-50 opacity-0"
          enterTo="transform scale-100 opacity-100"
          leave="transition-[transform_opacity] duration-200 ease-out"
          leaveFrom="transform scale-100 opacity-100"
          leaveTo="transform scale-50 opacity-0"
        >
          <div className="relative flex flex-col gap-4 rounded-xl max-w-xs w-full p-4 bg-white text-red-500 ring-1 ring-black/5 shadow-lg shadow-red-500/10">
            <span className="flex justify-between items-center font-bold text-lg uppercase">
              <span className="flex items-center gap-2">
                <span className="rounded-lg bg-red-50 p-2">
                  <IconAlertOctagon />
                </span>
                <span>Warning</span>
              </span>
              <button
                type="button"
                onClick={close}
                className="outline-none appearance-none rounded-full p-2 hover:bg-red-50 focus:bg-red-50"
              >
                <IconX />
              </button>
            </span>
            <span className="bg-red-50 rounded-3xl rounded-tl p-4 text-sm">
              You cannot have more than<span className="font-bold"> 10 </span>
              courses. Try to consolidate your options for a better experience.
            </span>
          </div>
        </Transition>
      </Backdrop>
    </Portal>
  );
};
