"use client";

import { IconArrowsMaximize, IconArrowsMinimize } from "@tabler/icons";
import clsx from "clsx";
import { useAtom } from "jotai";
import { ClassDay, ClassSection } from "../../database/types";
import { useHasMounted } from "../../hooks/useHasMounted";
import {
  // ClassSectionWithColor,
  ClassSectionWithState,
  selectedSectionsAtom,
  weeklyFullViewAtom,
} from "../../state/course-cart";
import { PrettyColor } from "../../utils/colors";
import { formatTime, roundToNearestMultipleOf } from "../../utils/util";
import {
  disclosure_header_bg_color,
  disclosure_header_text_color,
} from "../CourseSelector/CourseSelector.variants";
import {
  day_bg_color,
  day_text_color,
} from "../SectionSelector/SectionSelector.variants";

const one_hour = 60;
const twenty_four_hours = one_hour * 24;

type DayName = {
  short: ClassDay;
  medium: string;
  long: string;
};

type DayColumn = {
  day: DayName;
  sections: ClassSectionWithState[];
  // sections: ClassSectionWithColor[];
  show: boolean;
};

const dayNameMap: Record<ClassDay, DayName> = {
  m: { short: "m", medium: "mon", long: "monday" },
  tu: { short: "tu", medium: "tue", long: "tuesday" },
  w: { short: "w", medium: "wed", long: "wednesday" },
  th: { short: "th", medium: "thu", long: "thursday" },
  f: { short: "f", medium: "fri", long: "friday" },
  sa: { short: "sa", medium: "sat", long: "saturday" },
  s: { short: "s", medium: "sun", long: "sunday" },
};

export type WeeklyPreviewProps = {};

export function WeeklyPreview({}: WeeklyPreviewProps) {
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

  const monday = sections.filter(({ days }) =>
    days.toLowerCase().includes("m")
  );
  const tuesday = sections.filter(({ days }) =>
    days.toLowerCase().includes("tu")
  );
  const wednesday = sections.filter(({ days }) =>
    days.toLowerCase().includes("w")
  );
  const thursday = sections.filter(({ days }) =>
    days.toLowerCase().includes("th")
  );
  const friday = sections.filter(({ days }) =>
    days.toLowerCase().includes("f")
  );
  const saturday = sections.filter(({ days }) =>
    days.toLowerCase().includes("sa")
  );

  const showSaturday = saturday.length !== 0 || showFullView;

  const days: DayColumn[] = [
    { day: dayNameMap["m"], sections: monday, show: true },
    { day: dayNameMap["tu"], sections: tuesday, show: true },
    { day: dayNameMap["w"], sections: wednesday, show: true },
    { day: dayNameMap["th"], sections: thursday, show: true },
    { day: dayNameMap["f"], sections: friday, show: true },
    { day: dayNameMap["sa"], sections: saturday, show: showSaturday },
  ].filter(({ show }) => show);

  const block = 60; // each block is 60 minutes

  const endTime = showFullView ? twenty_four_hours : endTimeOffset;
  const startTime = showFullView ? 0 : Math.min(startTimeOffset, endTime);

  const L = Math.min(
    twenty_four_hours / block,
    Math.floor((endTime - startTime) / block)
  );

  const timeSlots = [...Array(L).keys()].map((v) => startTime + v * block);

  return (
    <div className="flex gap-[1px] bg-slate-100 rounded-md overflow-hidden large border border-slate-100">
      <div className="flex flex-col">
        <button
          type="button"
          className={`grid place-items-center uppercase font-semibold h-12 bg-slate-100 text-slate-600 hover:bg-slate-200`}
          onClick={() => setShowFullView((v) => !v)}
        >
          {showFullView ? <IconArrowsMinimize /> : <IconArrowsMaximize />}
        </button>
        <div className="relative flex flex-col w-full bg-white">
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
  );
}

type TimeItemProps = {
  // data: ClassSectionWithColor;
  data: ClassSectionWithState;
  startOffset: number;
};

function TimeItem({ data, startOffset }: TimeItemProps) {
  const {
    time_start,
    time_end,
    section_number,
    class_number,
    dept_abbr,
    course_number,
    state,
  } = data;
  const { color } = state;
  const bgColor = disclosure_header_bg_color[color];
  const textColor = disclosure_header_text_color[color];
  const height = time_end - time_start;

  const timeStart = formatTime(time_start);
  const timeEnd = formatTime(time_end);

  const posY = time_start - startOffset;

  return (
    <div
      className={clsx(
        "overflow-hidden absolute flex flex-col gap-1 rounded p-1 mix-blend-multiply w-full",
        bgColor,
        textColor
      )}
      style={{ height, top: posY }}
    >
      <span className="flex text-sm font-semibold">
        {dept_abbr} {course_number}
      </span>
      <span className="flex text-sm font-semibold">
        {section_number} {class_number}
      </span>
      <span className="flex text-sm font-semibold">
        {timeStart} {timeEnd}
      </span>
    </div>
  );
}

function roundToNearestHour(n: number) {
  return roundToNearestMultipleOf(60, n);
}

function hourOnly(time: number) {
  return formatTime(time).replace(":00", "");
}
