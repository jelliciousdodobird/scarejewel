"use client";

import { Popover, Transition } from "@headlessui/react";
import { nanoid } from "nanoid";
import { Fragment, useMemo, useState } from "react";

import { CourseSelector } from "../../components/CourseSelector/CourseSelector";

import { Term } from "../../database/types";
import { getRandomPrettyColor } from "../../utils/util";
import { IconCalendarEvent, IconPlus, IconX } from "@tabler/icons";
import { useAtom } from "jotai";
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
import { Backdrop } from "../../components/Backdrop/Backdrop";

export type HomePageProps = {
  terms: Term[];
};

export default function HomePage({ terms }: HomePageProps) {
  return (
    <div className="relative flex flex-col gap-4 bg-gradient-to-bzz from-whitezz to-slate-100zz min-h-full py-8">
      <CourseListPanel terms={terms} />
      <WeeklySidebar />
    </div>
  );
}

const WeeklySidebar = () => {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const toggleOpen = () => setOpen((v) => !v);

  return (
    <>
      <Portal portalToTag="body">
        <Backdrop open={open} close={close} manual>
          <Transition
            show={open}
            className="pack-content flex flex-col py-8 w-full pointer-events-none [&>*]:pointer-events-auto"
            enter="transition-[transform_opacity] duration-200 ease-linear"
            enterFrom="transform scale-50 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition-[transform_opacity] duration-200 ease-linear"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-50 opacity-0"
          >
            <WeeklyPreview />
          </Transition>
        </Backdrop>
      </Portal>
      <Portal portalToTag="body">
        {/* Need both divs since we're using position: fixed instead of sticky. Sticky has issues with chrome on android. */}
        <div className="fixed bottom-0 pb-4 h-min w-full sm:w-[calc(100%-1rem)] pointer-events-none ">
          <div className="flex justify-end pack-content w-full">
            <button
              type="button"
              className="rounded-full w-min h-min p-4 bg-indigo-500 text-white pointer-events-auto shadow-lg "
              onClick={toggleOpen}
            >
              {open ? <IconX /> : <IconCalendarEvent />}
            </button>
          </div>
        </div>
      </Portal>
    </>
  );
  // return (
  //   <Popover as={Fragment}>
  //     <Portal portalToTag="body">
  //       <Popover.Panel
  //         static
  //         className="zzz-40 fixed top-0 left-0 w-full h-full pointer-events-none"
  //       >
  //         {({ open, close }) => (
  //           <div
  //             className={clsx(
  //               "relative w-full h-full max-h-full overflow-x-hidden transition-[backdrop-filter_background-color]",
  //               open ? "bg-slate-500/10" : "bg-slate-500/0",
  //               open ? "backdrop-blur-md" : "backdrop-blur-0",
  //               open ? "overflow-y-auto" : "overflow-y-hidden",
  //               open ? "pointer-events-auto" : "pointer-events-none"
  //             )}
  //           >
  //             <div
  //               className="absolute top-0 left-0 w-full h-full"
  //               onClick={() => close()}
  //             />
  //             <Transition
  //               show={open}
  //               as={Fragment}
  //               enter="transition duration-250 ease-linear"
  //               enterFrom="transform translate-x-[100%]"
  //               enterTo="transform translate-x-0"
  //               leave="transition duration-250 ease-linear"
  //               leaveFrom="transform translate-x-0"
  //               leaveTo="transform translate-x-[100%]"
  //             >
  //               <div className="pointer-events-none pack-content flex flex-col py-8 [&>*]:pointer-events-auto">
  //                 <WeeklyPreview />
  //               </div>
  //             </Transition>
  //           </div>
  //         )}
  //       </Popover.Panel>
  //     </Portal>
  //     <Portal portalToTag="body">
  //       {/* Need both divs since we're using position: fixed instead of sticky. Sticky has issues with chrome on android. */}
  //       <div className="zzz-50 fixed bottom-0 pb-4 h-min w-full sm:w-[calc(100%-1rem)] pointer-events-none ">
  //         <div className="flex justify-end pack-content w-full">
  //           <Popover.Button
  //             type="button"
  //             className="rounded-full w-min h-min p-4 bg-indigo-500 text-white pointer-events-auto shadow-lg "
  //           >
  //             {({ open }) => (open ? <IconX /> : <IconCalendarEvent />)}
  //           </Popover.Button>
  //         </div>
  //       </div>
  //     </Portal>
  //   </Popover>
  // );
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
      <div className=" w-full relative z-10 flex justify-between gap-4">
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
      className="flex justify-center items-center gap-2 w-min px-2 sm:pr-3 h-10 rounded-lg bg-indigo-500 text-white font-semibold disabled:cursor-not-allowed"
      onClick={addCourseItem}
    >
      <IconPlus />
      <span className="hidden sm:flex whitespace-nowrap">Add Course</span>
    </button>
  );
};
