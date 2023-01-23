"use client";

import { Transition } from "@headlessui/react";
import { IconArrowsMaximize, IconArrowsMinimize } from "@tabler/icons";
import clsx from "clsx";
import { atom, useAtom, useSetAtom } from "jotai";
import { createElement, Fragment, useState } from "react";
import { useHasMounted } from "../../hooks/useHasMounted";
import { useLastValidValue } from "../../hooks/useLastValidValue";
import {
  ClassSectionWithState,
  selectedSectionsAtom,
  weeklyFullViewAtom,
} from "../../state/course-cart";
import { DayName, dayNameMap } from "../../utils/types";
import { Backdrop } from "../Backdrop/Backdrop";
import { ClassSectionItem } from "../ClassSectionItem/ClassSectionItem";
import { section_type_icons } from "../ClassSectionItem/ClassSectionItem.helper";
import {
  bg_color_base,
  text_color,
} from "../CourseSelector/CourseSelector.variants";
import { Portal } from "../Portal/Portal";
import { hourOnly, roundToNearestHour } from "./WeeklyPreview.helpers";
import {
  icon_bg_color,
  icon_text_color,
  ring_highlight,
} from "./WeeklyPreview.variants";

const one_hour = 60;
const twenty_four_hours = one_hour * 24;

type DayColumn = {
  day: DayName;
  sections: ClassSectionWithState[];
  show: boolean;
};

export type WeeklyPreviewProps = {};

export const WeeklyPreview = ({}: WeeklyPreviewProps) => {
  const mounted = useHasMounted();

  const [showFullView, setShowFullView] = useAtom(weeklyFullViewAtom);
  const [sections, setSections] = useAtom(selectedSectionsAtom);

  if (!mounted) return null;
  if (sections.length === 0) return null;

  const earliestTime = Math.min(
    twenty_four_hours,
    Math.min(...sections.map(({ time_start }) => time_start))
  );

  const latestTime = Math.min(
    twenty_four_hours,
    Math.max(...sections.map(({ time_end }) => time_end))
  );

  const startTimeOffset = roundToNearestHour(earliestTime - one_hour);
  const endTimeOffset = roundToNearestHour(latestTime + one_hour);

  let days: DayColumn[] = [
    { day: dayNameMap["m"], sections: [], show: true },
    { day: dayNameMap["tu"], sections: [], show: true },
    { day: dayNameMap["w"], sections: [], show: true },
    { day: dayNameMap["th"], sections: [], show: true },
    { day: dayNameMap["f"], sections: [], show: true },
    { day: dayNameMap["sa"], sections: [], show: true },
  ];

  sections.forEach((section) => {
    days.forEach((column) => {
      const { day, sections } = column;
      const d = day.short;
      if (section.days.toLowerCase().includes(d)) sections.push(section);

      // most student don't have saturday classes so we only want
      // to show saturday if the calendar is expanded (showFullView)
      // or if they do have a saturday class (sections.length !== 0)
      if (d === "sa") column.show = showFullView || sections.length !== 0;
    });
  });

  days = days
    .filter(({ show }) => show)
    .map((column) => ({
      ...column,
      sections: [...column.sections].sort((a, b) => {
        if (a.time_start - b.time_start > 0) return 1;
        else if (a.time_start - b.time_start < 0) return -1;

        return b.time_end - a.time_end;
      }),
    }));

  const block = 60; // each block is 60 minutes
  const endTime = showFullView ? twenty_four_hours : endTimeOffset;
  const startTime = showFullView ? 0 : Math.min(startTimeOffset, endTime);

  const L = Math.min(
    twenty_four_hours / block,
    Math.floor((endTime - startTime) / block)
  );

  const timeSlots = [...Array(L).keys()].map((v) => startTime + v * block);

  return (
    <>
      <div className="relative flex gap-[1px] bg-slate-100 rounded-md overflow-hidden large border border-slate-100">
        <div className="flex flex-col">
          <button
            type="button"
            className={`grid place-items-center uppercase font-semibold h-12 bg-slate-100 text-slate-600 hover:bg-slate-200`}
            onClick={() => setShowFullView((v) => !v)}
          >
            {showFullView ? <IconArrowsMinimize /> : <IconArrowsMaximize />}
          </button>
          <div className="relative flex flex-col w-full bg-white min-w-[3rem]">
            {timeSlots.map((time, i) => (
              <div
                key={time}
                className="relative w-full flex justify-end bg-transparent px-2"
                style={{ height: block }}
              >
                <span className="relative -top-2 text-xs text-slate-500 lowercase">
                  {i !== 0 && hourOnly(time)}
                </span>
              </div>
            ))}
          </div>
        </div>
        {days.map((col) => (
          <div key={col.day.long} className="flex flex-col flex-1">
            <h2 className="grid place-items-center uppercase font-semibold h-12 bg-slate-50 text-slate-600 ">
              <span className="hidden sm:block">{col.day.medium}</span>
              <span className="sm:hidden">{col.day.short}</span>
            </h2>

            <div className="relative flex w-full">
              <div className="z-0 relative flex flex-col gap-[1px] w-full opacity-100">
                {timeSlots.map((time) => (
                  <div
                    key={time}
                    className="text-[10px]  w-full bg-white "
                    style={{ height: block - 1 }} // the -1 is to compensate for the gap-[1px]
                  >
                    {/* {formatTime(time)} */}
                  </div>
                ))}
              </div>
              <div className="z-10 absolute top-0 left-0 flex flex-col w-full isolate h-full px-1">
                {/* this extra div is needed so that TimeItem does not overflow because of the px-1 above */}
                <div className="relative w-full">
                  {col.sections.map((cs) => (
                    <TimeItem key={cs.uid} data={cs} startOffset={startTime} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <OpenSesame />
    </>
  );
};

export const selectedSectionAtom = atom<ClassSectionWithState | null>(null);

type TimeItemProps = {
  data: ClassSectionWithState;
  startOffset: number;
};

const TimeItem = ({ data, startOffset }: TimeItemProps) => {
  const {
    time_start,
    time_end,
    section_number,
    class_number,
    dept_abbr,
    course_number,
    state,
    section_type,
  } = data;
  const { color } = state;

  const setSelected = useSetAtom(selectedSectionAtom);
  const choose = () => setSelected(data);

  // style tokens:
  const bgColor = bg_color_base[color];
  const textColor = text_color[color];
  const iconColor = icon_text_color[color];
  const iconBgColor = icon_bg_color[color];
  const ringHighlight = ring_highlight[color];

  // dynamic values to be used in styles:
  const height = time_end - time_start;
  const posY = time_start - startOffset;
  const icon = createElement(section_type_icons[section_type], {
    className: "w-4 h-4 sm:w-6 sm:h-6",
  });

  return (
    <button
      type="button"
      className={clsx(
        "group absolute flex rounded overflow-hidden w-full outline-none appearance-none",
        "ring-0 focus:ring-2 hover:ring-2 focus:z-10 hover:z-10 ",
        ringHighlight
      )}
      style={{ height, top: posY }}
      onClick={choose}
    >
      <div
        className={clsx(
          "w-full h-full p-1 sm:p-2 text-xs overflow-hidden",
          bgColor,
          textColor
        )}
      >
        <div className="w-full h-full overflow-hidden flex gap-3 sm:gap-2">
          <span className="flex gap-2 flex-col sm:flex-row items-center font-semibold w-min h-min">
            <span
              className={clsx(
                "rounded h-6 w-6 sm:h-10  sm:w-10 grid place-items-center",
                iconBgColor,
                iconColor
              )}
            >
              {icon}
            </span>
            <div className="flex flex-col gap-3 sm:gap-0">
              <span className="text-left whitespace-nowrap [writing-mode:vertical-lr] sm:[writing-mode:horizontal-tb] font-bold">
                {dept_abbr} {course_number.toLowerCase()}
              </span>
              <span className="text-left whitespace-nowrap [writing-mode:vertical-lr] sm:[writing-mode:horizontal-tb] font-mono lowercase">
                {class_number ? class_number : section_number}
              </span>
            </div>
          </span>
        </div>
      </div>
      <span
        className={clsx(
          "min-w-[1rem] h-full mix-blend-multiply group-hover:bg-opacity-50 group-focus:bg-opacity-50",
          bgColor
        )}
      ></span>
    </button>
  );
};

export const OpenSesame = () => {
  const [selected, setSelected] = useAtom(selectedSectionAtom);
  const prev = useLastValidValue(selected);
  const close = () => setSelected(null);

  const opened = !!selected;
  const data =
    selected === null
      ? prev
      : {
          ...selected,
          state: { ...selected.state, selected: false, hidden: false },
        };

  return (
    <Portal portalToTag="body">
      <Backdrop open={opened} close={close} manual>
        <Transition
          className="pointer-events-none [&>*]:pointer-events-auto grid pack-content place-items-center h-full w-full"
          show={opened}
          enter="transition-[transform_opacity] duration-200 ease-linear"
          enterFrom="transform scale-50 opacity-0"
          enterTo="transform scale-100 opacity-100"
          leave="transition-[transform_opacity] duration-200 ease-linear"
          leaveFrom="transform scale-100 opacity-100"
          leaveTo="transform scale-50 opacity-0"
        >
          <div className="max-w-md min-w-[min(400px,100%)]">
            {!!data && <ClassSectionItem data={data} />}
          </div>
        </Transition>
      </Backdrop>
    </Portal>
  );
};
