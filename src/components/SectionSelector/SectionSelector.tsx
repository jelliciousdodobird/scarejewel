"use client";

import {
  IconAlertCircle,
  IconAlertTriangle,
  IconTrafficCone,
} from "@tabler/icons";
import { useQuery } from "@tanstack/react-query";
import { PrimitiveAtom, useAtom } from "jotai";
import { Fragment, useEffect, useState } from "react";
import { ClassSectionWithState, CourseItem } from "../../state/course-cart";
import { Semester } from "../../database/types";
import { ClassSectionState } from "../../state/course-cart";
import { fetchSections } from "../../database/api";
import { splitIntoGroups } from "./SectionSelector.helpers";
import {
  ClassSectionItem,
  SectionTypeLabel,
} from "../ClassSectionItem/ClassSectionItem";
import clsx from "clsx";
import * as Popover from "@radix-ui/react-popover";
import { AnimatePresence, motion } from "framer-motion";

const staleTime = 60 * 60 * 1000; // 1 hour

type SectionSelectorProps = {
  semester: Semester;
  year: number;
  courseItemAtom: PrimitiveAtom<CourseItem>;
};

export const SectionSelector = ({
  semester,
  year,
  courseItemAtom,
}: SectionSelectorProps) => {
  const [courseItem, setCourseItem] = useAtom(courseItemAtom);
  const dept = courseItem.selectedDept.value;
  const course_number = courseItem.selectedCourse.value;
  const queryDisabled = dept === "" || course_number === "";

  const { data, isLoading } = useQuery({
    queryKey: ["fetchSections", semester, year, dept, course_number],
    queryFn: () => fetchSections(semester, year, dept, course_number),
    enabled: !queryDisabled,
    staleTime,
  });

  const updateClassSectionState = (updateItem: ClassSectionWithState) => {
    setCourseItem((v) => {
      const sections = v.availableSections;
      const index = sections.findIndex(({ uid }) => uid === updateItem.uid);

      if (index === -1) return v;
      return {
        ...v,
        availableSections: [
          ...sections.slice(0, index),
          updateItem,
          ...sections.slice(index + 1),
        ],
      };
    });
  };

  useEffect(() => {
    if (!data) return;

    setCourseItem((v) => {
      const dataWithState = data.map((cs) => {
        const oldItem = v.availableSections.find(({ uid }) => uid === cs.uid);

        const freshState: ClassSectionState = {
          hidden: false,
          selected: false,
          notes: "",
          color: v.color,
        };

        const state: ClassSectionState = oldItem ? oldItem.state : freshState;

        return {
          ...cs,
          state,
        };
      });

      return { ...v, availableSections: dataWithState };
    });
  }, [data]);

  if (isLoading)
    return (
      <div className="relative -z-10 flex flex-col">
        <div className="animate-pulse flex text-2xl font-bold p-4">LOADING</div>
      </div>
    );

  const groups = splitIntoGroups(courseItem.availableSections);

  return (
    <div className="flex flex-col gap-16">
      {groups.map((group, i) => (
        <div key={group.group_id} className="flex flex-col gap-8">
          <div className="relative z-10 flex flex-col gap-4 rounded-xl">
            {groups.length > 1 && (
              <h3 className="isolate z-10 flex gap-2 items-center">
                <span className="font-extrabold text-2xl flex gap-2 uppercase">{`Group ${
                  i + 1
                }`}</span>

                <GroupMessageTooltip />
              </h3>
            )}
            <div className="isolate flex flex-wrap gap-2">
              <div className="flex flex-col gap-2 bg-slate-100 text-sm text-slate-900 p-3 px-4 rounded-xl">
                <span className="flex gap-2 items-center">
                  <span>
                    <IconAlertCircle />
                  </span>
                  <span className="font-bold text-base uppercase">
                    Must Pick
                  </span>
                </span>
                <span className="whitespace-nowrap">
                  Enrollment requires one of each section:
                </span>
              </div>
              <div className="flex flex-col">
                <span className="flex gap-2">
                  {group.uniqueSectionTypes.map((type) => (
                    <SectionTypeLabel
                      key={type}
                      size="small"
                      sectionType={type}
                    />
                  ))}
                </span>
              </div>
            </div>
          </div>
          <ul className="isolate grid grid-cols-[repeat(auto-fill,minmax(min(320px,100%),1fr))] gap-8 rounded-md bg-transparent">
            {group.classSections.map((cs) => (
              <ClassSectionItem
                key={cs.uid}
                data={cs}
                update={updateClassSectionState}
              />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

const GroupMessageTooltip = () => {
  const [open, setOpen] = useState(false);
  const closeTooltip = () => setOpen(false);
  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          className="w-8 h-8 grid place-items-center text-yellow-500 bg-yellow-100 hover:bg-yellow-200 hover:text-yellow-700 rounded-full"
          aria-label="Show time overlap tip"
        >
          <IconAlertTriangle stroke={2} size={20} />
        </button>
      </Popover.Trigger>
      <AnimatePresence>
        {open && (
          <Popover.Content
            forceMount
            sideOffset={2}
            align="center"
            side="bottom"
          >
            <motion.div
              initial={{ y: -50, opacity: 0, scale: 0.5 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -80, opacity: 0, scale: 0 }}
              transition={{ ease: "easeOut" }}
            >
              <div className="overflow-hidden flex flex-col gap-2 p-4 max-w-[80vw] w-96 bg-white text-yellow-500 text-sm rounded-sm shadow-center shadow-black/20 ring-[3px] ring-white/80">
                <span className="flex font-bold text-base uppercase w-full">
                  Stay in group!
                </span>
                <span className="text-sm px-4 text-neutral-700 border-l-2 border-yellow-400">
                  Do not pick sections from ACROSS groups. It is considered
                  invalid when you register on the official CSULB site. For
                  example, you cannot register for a
                  <span className="font-bold ">{" lecture "}</span>
                  section from<span className="font-bold">{" group 1 "}</span>
                  then a<span className="font-bold ">{" lab "}</span>section
                  from
                  <span className="font-bold">{" group 2 "}</span>. It is only
                  allowed here so that it is easier to rearrange your schedule
                  to see what works.
                </span>
              </div>
              <Popover.Arrow
                className="fill-white"
                height="0.5rem"
                width="1rem"
              />
            </motion.div>
          </Popover.Content>
        )}
      </AnimatePresence>
    </Popover.Root>
  );
};
