"use client";

import { Popover, Transition } from "@headlessui/react";
import { nanoid } from "nanoid";
import {
  Dispatch,
  Fragment,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { CourseSelector } from "../../components/CourseSelector/CourseSelector";

import { Term } from "../../database/types";
import { getRandomPrettyColor } from "../../utils/util";
import {
  IconAlertOctagon,
  IconCalendarEvent,
  IconChevronDown,
  IconCirclePlus,
  IconPlus,
  IconX,
} from "@tabler/icons";
import { useAtom, useAtomValue } from "jotai";
import {
  courseItemsAtomAtom,
  selectedSectionsHasChanged,
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
import { SelectedSnapshot } from "../../components/SelectedSnapshot/SelectedSnapshot";
import { SetStateAction } from "jotai/vanilla";
import { CourseItemsSkeleton } from "./HomePage.skeleton";
import { HeroSection } from "../../components/HeroSection/HeroSection";
import { Instructions } from "../../components/Instructions/Instructions";

export type HomePageProps = {
  terms: Term[];
};

export default function HomePage({ terms }: HomePageProps) {
  return (
    <div className="relative flex flex-col gap-8 bg-gradient-to-bzz from-whitezz to-slate-100zz min-h-full py-8">
      <HeroSection />
      <Instructions />
      <SelectedSnapshot />
      <CourseListPanel terms={terms} />
      <WeeklySidebar />
    </div>
  );
}

const WeeklySidebar = () => {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

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
            <ShowButton open={open} setOpen={setOpen} />
          </div>
        </div>
      </Portal>
    </>
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

  useEffect(() => {
    document.body.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  }, [courseItems.length]);

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

      {courseItems.length === 0 && <CourseItemsSkeleton />}

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

const ShowButton = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const hasNewChanges = useAtomValue(selectedSectionsHasChanged);
  const toggleOpen = () => setOpen((v) => !v);

  return (
    <button
      type="button"
      className={clsx(
        "relative rounded-[50%] w-min h-min p-4 bg-indigo-500 text-white text-indigo-900zz pointer-events-auto shadow-lg",
        "transition-[border-radius] duration-200",
        hasNewChanges && "rounded-tl-md"
      )}
      onClick={toggleOpen}
    >
      {hasNewChanges && (
        <span className="absolute top-1 left-1 w-2 h-2 flex">
          <span className="absolute rounded-full h-full w-full animate-ping-slow bg-white/75" />
          <span className="relative rounded-full h-full w-full bg-white" />
        </span>
      )}
      {open ? <IconX /> : <IconCalendarEvent />}
    </button>
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
        className="flex justify-center items-center gap-2 w-min px-2 h-10 rounded-3xl rounded-bl bg-indigo-500 text-white font-bold disabled:cursor-not-allowed"
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
