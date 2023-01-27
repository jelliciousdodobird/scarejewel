"use client";

import { Switch, Transition } from "@headlessui/react";
import { IconAlertCircle } from "@tabler/icons";
import clsx from "clsx";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  createElement,
  Dispatch,
  Fragment,
  RefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { useHasMounted } from "../../hooks/useHasMounted";
import { useLastValidValue } from "../../hooks/useLastValidValue";
import {
  ClassSectionWithState,
  selectedSectionsAtom,
  preferedTimeFormatAtom,
} from "../../state/course-cart";
import { DayName, dayNameMap } from "../../utils/types";
import { formatTime, rangesOverlap } from "../../utils/util";
import { Backdrop } from "../Backdrop/Backdrop";
import { ClassSectionItem } from "../ClassSectionItem/ClassSectionItem";
import { section_type_icons } from "../ClassSectionItem/ClassSectionItem.helper";
import { Portal } from "../Portal/Portal";
import { SelectedSnapshot } from "../SelectedSnapshot/SelectedSnapshot";
import {
  clampTime,
  hourOnly,
  ONE_HOUR_IN_MINS,
  roundToNearestHour,
  TWENTY_FOUR_HOURS_IN_MINS,
} from "./WeeklyView.helpers";
import {
  icon_bg_color,
  icon_text_color,
  ring_highlight,
  time_item_bg_color,
  time_item_border_color,
  time_item_text_color,
} from "./WeeklyView.variants";

type DayColumn = {
  day: DayName;
  sections: ClassSectionWithState[];
  show: boolean;
};

export type WeeklyPreviewProps = {
  minsPerBlock?: number; // each block is 60 minutes by default
  yScale?: number; // how much each time block is stretched vertically
};

export const WeeklyView = ({
  minsPerBlock: numOfMinsPerBlock = 60,
  yScale = 1.5,
}: WeeklyPreviewProps) => {
  const mounted = useHasMounted();

  // both weeklyFullViewAtom/selectedSectionsAtom access local storage:
  const [timeFormat, setTimeFormat] = useAtom(preferedTimeFormatAtom);
  const sections = useAtomValue(selectedSectionsAtom);
  const containerRef = useRef<HTMLDivElement>(null);
  const [highlightTime, setHighlightTime] = useState({ start: -1, end: -1 });

  // since atleast one of our state uses local storage we have to ensure we're mounted,
  // before we can render anything or else we get hydration mismatches:
  if (!mounted) return null;
  // if (sections.length === 0) return null;

  // simple derived state:
  const timeFormatIs24h = timeFormat === "24h";
  const showFullView = sections.length === 0;

  // functions:
  const resetHighlightTime = () => setHighlightTime({ start: -1, end: -1 });
  const toggleTimeFormat = () =>
    setTimeFormat((v) => (v === "24h" ? "12h" : "24h"));

  // NO POINT IN MEMOIZING ANYTHING BELOW THIS POINT SINCE IT ALL DEPENDS ON "selectedSectionsAtom"
  const dayColumns: DayColumn[] = [
    { day: dayNameMap["su"], sections: [], show: true },
    { day: dayNameMap["m"], sections: [], show: true },
    { day: dayNameMap["tu"], sections: [], show: true },
    { day: dayNameMap["w"], sections: [], show: true },
    { day: dayNameMap["th"], sections: [], show: true },
    { day: dayNameMap["f"], sections: [], show: true },
    { day: dayNameMap["sa"], sections: [], show: true },
    { day: dayNameMap["na"], sections: [], show: false },
    { day: dayNameMap["tba"], sections: [], show: false },
  ];

  // PUSH SECTIONS INTO THEIR RESPECTIVE COLUMNS BY THEIR DAY:
  sections.forEach((section) => {
    const dayStr = section.days.toLowerCase();

    // a section might happen on more than one day so we have to check all of days for each section:
    dayColumns.forEach((column) => {
      const { sections } = column;
      const day = column.day.short;
      if (dayStr.includes(day)) sections.push(section);
    });
  });

  // VALIDATE IF A DAY SHOULD BE SHOWN:
  dayColumns.forEach((dayCol) => {
    const daykey = dayCol.day.short;

    // most student don't have sunday/saturday classes so we only want to show that day
    // (1) if they do have a class for it,
    // or
    // (2) if we need to force a full week view
    if (daykey === "sa")
      dayCol.show = showFullView || dayCol.sections.length !== 0;
    if (daykey === "su")
      dayCol.show = showFullView || dayCol.sections.length !== 0;
  });

  // FROM HERE TIL THE RENDER FUNCTION, WE ARE DETERMINING WHAT WILL GET RENDERED:
  const mainView = dayColumns
    .filter(({ show }) => show)
    .map((column) => ({
      ...column,
      sections: [...column.sections].sort((a, b) => {
        // this ordering is so that tabbing goes from top to bottom:
        if (a.time_start - b.time_start > 0) return 1;
        else if (a.time_start - b.time_start < 0) return -1;
        return b.time_end - a.time_end; // this helps reveal sections that might get completely hidden if there is an overlap
      }),
    }));

  const subViewSections = dayColumns.filter(({ show }) => !show);

  // we do not want to render time ranges where the user
  // hasn't selected a class so this finds the earliest and latest times
  // so we can determine which time ranges we should render:
  const mainViewSections = mainView.flatMap(({ sections }) =>
    sections.map((section) => section)
  );

  const earliestTime = clampTime(
    Math.min(...mainViewSections.map(({ time_start }) => time_start))
  );

  const latestTime = clampTime(
    Math.max(...mainViewSections.map(({ time_end }) => time_end))
  );

  // ensures that we get one time block above the earliestTime and one time
  // block below the latestTime so that the times aren't flush with the top
  // and bottom of the week UI:
  const startTimeOffset = clampTime(
    roundToNearestHour(earliestTime - ONE_HOUR_IN_MINS)
  );
  const endTimeOffset = clampTime(
    roundToNearestHour(latestTime + ONE_HOUR_IN_MINS)
  );

  // finally, we adjust the start and ends times, depending on if the user wants the full view:
  const endTime = showFullView ? TWENTY_FOUR_HOURS_IN_MINS : endTimeOffset;
  const startTime = showFullView ? 0 : Math.min(startTimeOffset, endTime);

  // now with
  const timeSlotsLength = Math.min(
    Math.floor(TWENTY_FOUR_HOURS_IN_MINS / numOfMinsPerBlock), // this is the max number of time blocks we can have
    Math.floor((endTime - startTime) / numOfMinsPerBlock)
  );

  const timeSlots = [...Array(timeSlotsLength).keys()].map(
    (v) => startTime + v * numOfMinsPerBlock
  );

  return (
    <>
      <SelectedSnapshot />
      <SelectedSectionPopup />
      <div className="flex flex-col gap-8">
        <div
          ref={containerRef}
          className={clsx(
            "isolate relative flex gap-[1px]zz overflow-hidden bg-slate-100 bg-whitezz borderzborder-transparent p-[1px]",
            "rounded-xlzz[&>*:last-child]:[border-top-right-radius:12px]zz[&>*:last-child]:[border-bottom-right-radius:12px]zz[&>*:last-child]:overflow-hidden"
          )}
          onMouseLeave={resetHighlightTime}
        >
          <BorderGlow containerRef={containerRef} />
          {/* the time column (for ex: 0:00am to 11:59pm) */}
          <div className="overflow-hidden flex flex-col gap-[1px] [border-top-left-radius:inherit] [border-bottom-left-radius:inherit] mr-[1px]">
            <Switch
              checked={timeFormatIs24h}
              onChange={toggleTimeFormat}
              className="grid place-items-center uppercase font-semibold h-full bg-slate-100 text-slate-600 text-sm hover:text-primary-500 hover:text-whitezz"
            >
              {timeFormat}
            </Switch>
            <div className="relative flex flex-col gap-[1px] w-full bg-white min-w-[3.5rem] [&>*:first-child]:opacity-0 [&>*:first-child]:pointer-events-none">
              {timeSlots.map((time) => (
                <div
                  key={time}
                  className="relative w-full flex justify-end bg-transparent px-2"
                  style={{ height: numOfMinsPerBlock * yScale - 1 }} // the -1 is to compensate for the gap-[1px]
                >
                  <span
                    className={clsx(
                      "absolute top-[-9px] text-xs zztext-slate-500 lowercase",
                      time >= highlightTime.start && time <= highlightTime.end
                        ? "text-primary-500 font-bold"
                        : "text-slate-500"
                    )}
                  >
                    {timeFormatIs24h ? formatTime(time, false) : hourOnly(time)}
                  </span>
                </div>
              ))}
            </div>
          </div>
          {mainView.map((col) => (
            //the days columns:
            <div key={col.day.long} className="flex flex-col flex-1 gap-[1px]">
              <h2 className="flex justify-center items-center gap-0 sm:gap-2 uppercase font-semibold h-12 bg-slate-50 text-slate-600 ">
                <span className="hidden sm:block">{col.day.medium}</span>
                <span className="sm:hidden">{col.day.short}</span>
                {rangesOverlap(
                  col.sections.map((s) => ({
                    start: s.time_start,
                    end: s.time_end,
                  }))
                ) && (
                  <span className="right-0 text-rose-400">
                    <IconAlertCircle size={16} stroke={3} />
                  </span>
                )}
              </h2>

              <div className="relative flex w-full">
                <div className="z-0 relative flex flex-col gap-[1px] w-full opacity-100">
                  {timeSlots.map((time) => (
                    <div
                      key={time}
                      className="text-[10px] w-full bg-white"
                      style={{ height: numOfMinsPerBlock * yScale - 1 }} // the -1 is to compensate for the gap-[1px]
                      onMouseEnter={() => {
                        setHighlightTime({
                          start: time,
                          end: time + ONE_HOUR_IN_MINS,
                        });
                      }}
                    >
                      {/* {formatTime(time)} */}
                    </div>
                  ))}
                </div>
                <div className="z-10 absolute top-0 left-0 flex flex-col w-full isolate h-full px-1 pointer-events-none">
                  {/* this extra div is needed so that TimeItem does not overflow because of the px-1 above */}
                  <div className="relative w-full [&>*]:pointer-events-auto">
                    {col.sections.map((cs) => (
                      <TimeItem
                        key={cs.uid}
                        data={cs}
                        startOffset={startTime}
                        yScale={yScale}
                        setHighlightTime={setHighlightTime}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="">
          <div>TBA sections</div>
          {subViewSections.map((dayCol) => (
            <div key={dayCol.day.long}>
              {dayCol.sections.map((section) => (
                <ClassSectionItem key={section.uid} data={section} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export const BorderGlow = ({
  containerRef,
}: {
  containerRef: RefObject<HTMLDivElement>;
}) => {
  const glowRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const { x, y } = position;

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      const box = containerRef.current?.getBoundingClientRect();
      const glow = glowRef.current?.getBoundingClientRect();

      if (box && glow) {
        const x = e.clientX - box.left - glow.width / 2;
        const y = e.clientY - box.top - glow.height / 2;
        setPosition({ x, y });
      }
    };
    window.addEventListener("mousemove", updatePosition);

    return () => {
      window.removeEventListener("mousemove", updatePosition);
    };
  }, []);
  return (
    <>
      <div
        ref={glowRef}
        className="isolate -z-10 absolute top-0 left-0 bg-gradient-radial from-slate-300 via-transparent to-transparent w-96 h-96 origin-top-right"
        style={{ transform: `translate(${x}px,${y}px)` }}
      />
      {/* <div
        // ref={glowRef}
        className="z-50 absolute top-0 left-0 bg-gradient-radial from-white/50 via-transparent to-transparent w-96 h-96 origin-top-right mix-blend-multiplyzz opacity-50zz pointer-events-none"
        style={{ transform: `translate(${x}px,${y}px)` }}
      /> */}
    </>
  );
};

export const selectedSectionAtom = atom<ClassSectionWithState | null>(null);

type TimeItemProps = {
  data: ClassSectionWithState;
  startOffset: number;
  yScale?: number;
  setHighlightTime: Dispatch<
    SetStateAction<{
      start: number;
      end: number;
    }>
  >;
};

const TimeItem = ({
  data,
  startOffset,
  yScale = 1,
  setHighlightTime,
}: TimeItemProps) => {
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
  const bgColor = time_item_bg_color[color];
  const textColor = time_item_text_color[color];
  const borderColor = time_item_border_color[color];
  const iconColor = icon_text_color[color];
  const iconBgColor = icon_bg_color[color];
  const ringHighlight = ring_highlight[color];

  // dynamic values to be used in styles:
  const height = (time_end - time_start) * yScale;
  const posY = (time_start - startOffset) * yScale - 1;
  const icon = createElement(section_type_icons[section_type], {
    className: "w-4 h-4 sm:w-6 sm:h-6",
  });

  return (
    <button
      type="button"
      className={clsx(
        "group absolute flex roundedzz overflow-hiddenzz w-full outline-none appearance-none",
        "ring-0 focus:ring-1 hover:ring-1 focus:z-10 hover:z-10",
        ringHighlight
      )}
      style={{ height, top: posY }}
      onClick={choose}
      onMouseEnter={() => {
        setHighlightTime({
          start: data.time_start,
          end: data.time_end,
        });
      }}
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
          "isolate min-w-[0.5rem] sm:min-w-[1rem] h-full mix-blend-multiply group-hover:bg-opacity-0 group-focus:bg-opacity-0",
          bgColor
        )}
      />
    </button>
  );
};

export const SelectedSectionPopup = () => {
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
