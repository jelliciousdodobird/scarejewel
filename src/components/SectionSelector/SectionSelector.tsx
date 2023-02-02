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
import { SectionSelectorSkeleton } from "./SectionSelector.skeleton";

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
            "text-xl w-full rounded-xl flex gap-4",
            " [&>*]:hidden [&>*:first-child]:flex sm:[&>*:not(:last-child)]:flex md:[&>*]:flex"
          )}
        >
          {[...Array(3).keys()].map((i) => (
            <div key={i} className="h-80 w-full bg-slate-100 rounded-2xl"></div>
          ))}
        </div>
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex font-extrabold text-4xl text-slate-500">
          Get started by picking a department and course code.
        </span>
      </div>
    );

  if (isLoading)
    return (
      <SectionSelectorSkeleton></SectionSelectorSkeleton>
      // <div className="relative -z-10 flex flex-col">
      //   <div className="animate-pulse flex text-2xl font-bold p-4">LOADING</div>
      // </div>
    );

  const groups = splitIntoGroups(courseItem.availableSections);

  return (
    <div className="flex flex-col gap-12">
      {groups.length > 1 && <GroupMessage />}
      {groups.map((group, i) => (
        <div
          key={group.group_id}
          className="flex flex-col gap-8 my-8zz first:mt-0 py-2 pl-6zz "
        >
          <div className="flex flex-col gap-4">
            <h3 className="font-extrabold text-2xl uppercase">Group {i + 1}</h3>
            <div className="flex flex-wrap gap-2">
              <div className="flex flex-col gap-2 bg-slate-100 text-sm text-slate-900 p-3 px-4 rounded-xl">
                <span className="flex gap-2 items-center">
                  <span>
                    <IconAlertCircle />
                  </span>
                  <span className="font-bold text-base uppercase">
                    Instructions
                  </span>
                </span>
                <span className="whitespace-nowrap">
                  Enrollment requires one of each:
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
          <ul className="grid grid-cols-[repeat(auto-fill,minmax(min(320px,100%),1fr))] gap-8 rounded-md bg-transparent">
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

export const GroupMessage = () => {
  return (
    <span className="flex flex-col gap-4 text-sm rounded-xl p-6 bg-rose-50 text-rose-600 ">
      <span className="flex gap-2 items-center ">
        <span>
          <IconAlertCircle />
        </span>
        <span className="font-bold text-lg text-rose-600 uppercase">
          Warning
        </span>
      </span>
      <span className="">Do not pick sections from ACROSS groups. </span>

      <span className="">
        It is considered invalid when you register on the official CSULB site.
        For example, you cannot register for a
        <span className="font-bold ">{" lecture "}</span>
        section from<span className="font-bold">{" group 1 "}</span>then a
        <span className="font-bold ">{" lab "}</span>section from
        <span className="font-bold">{" group 2 "}</span>. It is only allowed
        here so that it is easier to rearrange your schedule to see what works.
      </span>
    </span>
  );
};
