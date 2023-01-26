"use client";

import { Transition } from "@headlessui/react";
import { IconCirclePlus, IconAlertOctagon, IconX } from "@tabler/icons";
import { useAtom } from "jotai";
import { nanoid } from "nanoid";
import { useMemo, useState, Fragment } from "react";
import { Term } from "../../database/types";
import { useHasMounted } from "../../hooks/useHasMounted";
import {
  courseItemsAtomAtom,
  selectedTermOptionAtom,
  courseItemsAtom,
} from "../../state/course-cart";
import { getRandomPrettyColor } from "../../utils/util";
import { Backdrop } from "../Backdrop/Backdrop";
import { CourseSelector } from "../CourseSelector/CourseSelector";
import { Portal } from "../Portal/Portal";
import {
  TermOption,
  createTermOption,
  TermSelect,
} from "../TermSelect/TermSelect";
import { CoursePlanSkeleton } from "./CoursePlan.skeleton";

export const CoursePlan = ({ terms }: { terms: Term[] }) => {
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

  // useEffect(() => {
  //   document.body.scrollTo({
  //     top: document.body.scrollHeight,
  //     behavior: "smooth",
  //   });
  // }, [courseItems.length]);

  if (!mounted) return null;

  return (
    <div className="pack-content w-full flex flex-col gap-8">
      <div className=" w-full relative z-10 flex justify-between gap-4">
        <TermSelect
          options={termOptions}
          onChange={setSelectedTermOption}
          selectedOption={selectedTermOption}
        />
        <AddButton />
      </div>

      {courseItems.length === 0 && <CoursePlanSkeleton />}

      <ul className="relative z-0 flex flex-col gap-4">
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
  const [showError, setShowError] = useState(false);
  const close = () => setShowError(false);

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
  };

  return (
    <>
      <button
        type="button"
        className="flex justify-center items-center gap-2 w-min px-2 h-10 rounded-3xl rounded-bl bg-primary-500 text-white font-bold disabled:cursor-not-allowed"
        onClick={addCourseItem}
      >
        <span className="hidden sm:flex whitespace-nowrap pl-2 text-opacity-100">
          Course
        </span>
        <IconCirclePlus />
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
