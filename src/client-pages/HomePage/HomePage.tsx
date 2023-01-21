"use client";

import { Tab } from "@headlessui/react";
import { nanoid } from "nanoid";
import { ElementType, useEffect, useMemo, useRef, useState } from "react";

import { CourseSelector } from "../../components/CourseSelector/CourseSelector";

import { Term } from "../../database/types";
import { getRandomPrettyColor } from "../../utils/util";
import { PartialBy } from "../../utils/types";
import {
  IconCalendar,
  IconCalendarEvent,
  IconPlaylistAdd,
  IconPlus,
  IconSelector,
} from "@tabler/icons";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
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
  const [showWeekly, setShowWeekly] = useState(false);
  const toggleWeekly = () => setShowWeekly((v) => !v);

  return (
    <div className="flex flex-col gap-4 bg-gradient-to-bzz from-whitezz to-slate-100zz min-h-full justify-betweenzz">
      <CourseListPanel terms={terms} />

      <Portal portalToTag="main">
        <div className="z-10 sticky bottom-0 flex justify-end pack-content pb-4 h-min w-full pointer-events-none">
          <button
            type="button"
            className="rounded-full w-min h-min p-4 bg-indigo-500 text-white pointer-events-auto shadow-lg"
            onClick={toggleWeekly}
          >
            <IconCalendar />
          </button>
        </div>
      </Portal>
    </div>
  );
}

// const TabNav = ({ terms }: HomePageProps) => {
//   const [selectedTab, setSelectedTab] = useState(0);

//   return (
//     <div className="flex flex-col gap-4 bg-gradient-to-bzz from-whitezz to-slate-100zz min-h-full">
//       <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
//         <div className="z-10 sticky top-16 backdrop-blur-md bg-slate-200/30 border-b border-t border-slate-200/50">
//           <Tab.List className="pack-content flex gap-0 w-full h-12  pt-1 sm:gap-4">
//             {tabs.map(({ name, icon }) => (
//               <Tab
//                 key={name}
//                 className="flex-grow sm:flex-grow-0 h-full  overflow-hidden "
//               >
//                 {({ selected }) => (
//                   <span
//                     className={clsx(
//                       "flex justify-center items-center gap-1 h-full font-semibold text-sm whitespace-nowrap px-2",
//                       selected ? "text-indigo-500" : "text-slate-500",
//                       selected
//                         ? "border-b-[3px] border-indigo-500"
//                         : "border-b-[3px] border-transparent"
//                     )}
//                   >
//                     {icon}
//                     {name}
//                   </span>
//                 )}
//               </Tab>
//             ))}
//           </Tab.List>
//         </div>
//         <Tab.Panels className="z-0 relative">
//           <Tab.Panel>
//             <WeeklyPanel />
//           </Tab.Panel>
//           <Tab.Panel>
//             <CourseListPanel terms={terms} />
//           </Tab.Panel>
//         </Tab.Panels>
//       </Tab.Group>
//     </div>
//   );
// };

// const WeeklyPanel = () => {
//   // need to make sure we're mounted so we can use the localstorage in the courseItemsAtomAtom

//   return (
//     <div className="relative isolate">
//       <div className="pack-content flex flex-col py-8">
//         <WeeklyPreview />
//       </div>
//     </div>
//   );
// };

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

      {/* <div className="min-h-[20rem]"></div> */}
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
