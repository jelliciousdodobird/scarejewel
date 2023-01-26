"use client";

import { IconAlertCircle } from "@tabler/icons";
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

  if (queryDisabled)
    return (
      <div className="relative">
        <div
          className={clsx(
            "text-xl bg-slate-100zz w-full rounded-xl flex gap-4",
            " [&>*]:hidden [&>*:first-child]:flex sm:[&>*:not(:last-child)]:flex md:[&>*]:flex"
          )}
        >
          {[...Array(3).keys()].map((i) => (
            <div
              key={i}
              className="aaaaaa h-80 w-full bg-slate-100 rounded-2xl"
            ></div>
          ))}
        </div>
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex font-extrabold text-4xl text-slate-500">
          Get started by picking a department and course code.
        </span>
      </div>
    );

  if (isLoading)
    return (
      <div className="relative -z-10 flex flex-col">
        <div className="animate-pulse flex text-2xl font-bold p-4">LOADING</div>
      </div>
    );

  const groups = splitIntoGroups(courseItem.availableSections);

  return (
    <div className="flex flex-col gap-8">
      {groups.map((group, i) => (
        <Fragment key={group.group_id}>
          {groups.length > 1 && (
            <h3 className="font-extrabold text-xl uppercase">Group {i + 1}</h3>
          )}
          <span className="flex gap-4 text-sm rounded-lg p-4 bg-slate-100 text-slate-900">
            <span className="">
              <IconAlertCircle />
            </span>

            <span className="flex flex-col gap-4">
              <span className="flex items-center whitespace-pre flex-wrap">
                <span>Enrollment requires</span>
                {group.uniqueSectionTypes.map((type, i) => (
                  <Fragment key={type}>
                    {group.uniqueSectionTypes.length === i + 1 && (
                      <span className="whitespace-pre"> and</span>
                    )}
                    <span className="font-bold whitespace-pre"> one </span>
                    <SectionTypeLabel size="small" sectionType={type} />
                    {group.uniqueSectionTypes.length !== i + 1 && (
                      <span className="whitespace-pre">
                        {group.uniqueSectionTypes.length > 2 && ","}
                      </span>
                    )}
                  </Fragment>
                ))}
                <span className="whitespace-pre"> within a group.</span>
              </span>

              {groups.length > 1 && <GroupMessage />}
            </span>
          </span>
          <ul className="grid grid-cols-[repeat(auto-fill,minmax(min(320px,100%),1fr))] gap-8 rounded-md bg-transparent">
            {group.classSections.map((cs) => (
              <ClassSectionItem
                key={cs.uid}
                type="card"
                data={cs}
                update={updateClassSectionState}
              />
            ))}
          </ul>
        </Fragment>
      ))}
    </div>
  );
};

export const GroupMessage = () => {
  const [open, setOpen] = useState(false);
  const toggleOpen = () => setOpen((v) => !v);
  return (
    <span className="flex flex-col gap-4 text-sm">
      <span className="">
        Do not pick sections from ACROSS groups.{" "}
        <button className="font-bold" type="button" onClick={toggleOpen}>
          {open ? "(close)" : "Why?"}
        </button>
      </span>
      {open && (
        <span className="">
          It is considered{" "}
          <span className="font-bold uppercase underline text-rose-600">
            invalid
          </span>{" "}
          when you register on the official CSULB site. For example, you cannot
          register for a
          <span className="font-semibold italic uppercase"> lecture </span>
          section from<span className="font-bold"> Group 1 </span>then a
          <span className="font-semibold italic uppercase"> lab </span>section
          from
          <span className="font-bold"> Group 2 </span>. It is only allowed here
          so that it is easier to rearrange your schedule to see what works.
        </span>
      )}
    </span>
  );
};
