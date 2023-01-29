"use client";

import { Switch, Transition } from "@headlessui/react";
import {
  IconAlertCircle,
  IconCalendarEvent,
  IconChevronRight,
} from "@tabler/icons";
import clsx from "clsx";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  createElement,
  CSSProperties,
  Fragment,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePopperTooltip } from "react-popper-tooltip";
import { useHasMounted } from "../../hooks/useHasMounted";
import { useLastValidValue } from "../../hooks/useLastValidValue";
import {
  ClassSectionWithState,
  selectedSectionsAtom,
  preferedTimeFormatAtom,
} from "../../state/course-cart";
import { DayName, dayNameMap, NumberRange } from "../../utils/types";
import { clamp, rangesOverlap } from "../../utils/util";
import { Backdrop } from "../Backdrop/Backdrop";
import { ClassSectionItem } from "../ClassSectionItem/ClassSectionItem";
import { section_type_icons } from "../ClassSectionItem/ClassSectionItem.helper";
import { Portal } from "../Portal/Portal";
import { SelectedSnapshot } from "../SelectedSnapshot/SelectedSnapshot";
import {
  clampTime,
  getTimeFormatted,
  ONE_HOUR_IN_MINS,
  roundToNearestHour,
  TWENTY_FOUR_HOURS_IN_MINS,
} from "./WeeklyView.helpers";
import {
  icon_bg_color,
  icon_text_color,
  ring_highlight,
  time_item_bg_color,
  tab_bg_color_on,
  time_item_text_color,
  tab_bg_color,
  icon_bg_color_on,
  icon_text_color_on,
  ring_highlight_on,
} from "./WeeklyView.variants";

export const selectedSectionAtom = atom<ClassSectionWithState | null>(null);

type DayColumn = {
  day: DayName;
  sections: ClassSectionWithState[];
  show: boolean;
  hasOverlap: boolean;
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

  // both preferedTimeFormatAtom/selectedSectionsAtom access local storage:
  const [timeFormat, setTimeFormat] = useAtom(preferedTimeFormatAtom);
  const sections = useAtomValue(selectedSectionsAtom);
  const containerRef = useRef<HTMLDivElement>(null);

  // since atleast one of our state uses local storage we have to ensure we're mounted,
  // before we can render anything or else we get hydration mismatches:
  if (!mounted) return null;

  // simple derived state:
  const timeFormatIs24h = timeFormat === "24h";
  const showFullView = sections.length === 0;

  // functions:
  const toggleTimeFormat = () =>
    setTimeFormat((v) => (v === "24h" ? "12h" : "24h"));

  // const getTime = (time: number) =>
  //   timeFormatIs24h ? formatTime(time, false) : hourOnly(time);

  // NO POINT IN MEMOIZING ANYTHING BELOW THIS POINT SINCE IT ALL DEPENDS ON "selectedSectionsAtom"
  const dayColumns: DayColumn[] = [
    { day: dayNameMap["su"], sections: [], show: true, hasOverlap: false },
    { day: dayNameMap["m"], sections: [], show: true, hasOverlap: false },
    { day: dayNameMap["tu"], sections: [], show: true, hasOverlap: false },
    { day: dayNameMap["w"], sections: [], show: true, hasOverlap: false },
    { day: dayNameMap["th"], sections: [], show: true, hasOverlap: false },
    { day: dayNameMap["f"], sections: [], show: true, hasOverlap: false },
    { day: dayNameMap["sa"], sections: [], show: true, hasOverlap: false },
    { day: dayNameMap["na"], sections: [], show: false, hasOverlap: false },
    { day: dayNameMap["tba"], sections: [], show: false, hasOverlap: false },
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

  // RUN SIDE EFFECTS THAT CAN ONLY BE KNOWN AFTER ALL SECTIONS ARE IN THEIR COLUMNS:
  dayColumns.forEach((col) => {
    // determines if a col has an time overlap:
    const timeRanges: NumberRange[] = col.sections.map((s) => ({
      start: s.time_start,
      end: s.time_end,
    }));
    col.hasOverlap = rangesOverlap(timeRanges);

    // most student don't have sunday/saturday classes so we only want to show that day
    // (1) if they do have a class for it,
    // or
    // (2) if we need to force a full week view
    const daykey = col.day.short;
    if (daykey === "sa") col.show = showFullView || col.sections.length !== 0;
    if (daykey === "su") col.show = showFullView || col.sections.length !== 0;
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

  const subViewSections = dayColumns.filter(
    (col) => !col.show && col.sections.length > 0
  );

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

  // finally, we adjust the start and ends times, depending on if we want the full view:
  const endTime = showFullView ? TWENTY_FOUR_HOURS_IN_MINS : endTimeOffset;
  const startTime = showFullView ? 0 : Math.min(startTimeOffset, endTime);

  // now with
  const timeSlotsLength = Math.min(
    Math.floor(TWENTY_FOUR_HOURS_IN_MINS / numOfMinsPerBlock), // this is the max number of time blocks we can have
    Math.floor((endTime - startTime) / numOfMinsPerBlock) // this is actually what we want (but it could be a bad value hences the above max number)
  );

  const timeSlots = [...Array(timeSlotsLength).keys()].map(
    (v) => startTime + v * numOfMinsPerBlock
  );

  // styles (it's a pain to edit these styles cus they're far apart in the code so i extracted them here):
  const sectionHeaderClass =
    "flex justify-center items-center h-14 bg-slate-100 text-slate-700 text-xl font-bold w-full";
  const headerClass =
    "h-12 uppercase font-semibold text-sm text-slate-500 bg-slate-50";
  const timeSlotClass = "border-b border-slate-100 last:border-b-0 bg-white";
  const timeSlotDynamicStyle: CSSProperties = {
    height: numOfMinsPerBlock * yScale,
  };

  return (
    <>
      <SelectedSnapshot />
      <SelectedSectionPopup />
      <div className="relative flex flex-col gap-8">
        <div className="absolute " id="tooltip-location"></div>
        {/* TABLE CONTAINER */}
        <div
          className="flex flex-col isolate relative overflow-hidden rounded-2xl border border-black/5"
          ref={containerRef}
        >
          {/* TABLE HEADER */}
          <p className={clsx("gap-6", sectionHeaderClass)}>Weekly View</p>
          {/* TABLE DATA*/}
          <div className="flex">
            {/* TIME COLUMN (1st column) (for ex: 0:00am to 11:59pm) */}
            <div className="flex flex-col min-w-[3.5rem] max-w-[3.5rem]">
              {/* TIME COLUMN HEADER */}
              <Switch
                checked={timeFormatIs24h}
                onChange={toggleTimeFormat}
                className={clsx(
                  "grid place-items-center hover:text-primary-500",
                  headerClass
                )}
              >
                {timeFormat}
              </Switch>

              {/* TIME COLUMN DATA */}
              <div className="relative flex flex-col w-full bg-white">
                {timeSlots.map((time) => (
                  <div
                    key={time}
                    className={clsx(
                      "group/time-slot relative flex justify-end p-2",
                      timeSlotClass
                    )}
                    style={timeSlotDynamicStyle}
                  >
                    <span
                      className={clsx(
                        "text-xs text-slate-500 lowercase",
                        "group-first/time-slot:opacity-0 group-first/time-slot:pointer-events-none"
                      )}
                    >
                      {getTimeFormatted(time, timeFormat)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            {/* DAY COLUMNS CONTAINER */}
            {mainView.map((col) => (
              <div
                key={col.day.long}
                className="isolate flex flex-col flex-1 hover:z-10zz"
              >
                {/* DAY COLUMN HEADER */}
                {/* <h2
                  className={clsx(
                    "relative flex justify-center items-center gap-0 sm:gap-2",
                    headerClass
                  )}
                >
                  <span className="hidden sm:block">{col.day.medium}</span>
                  <span className="sm:hidden">{col.day.short}</span>
                  {col.hasOverlap && <OverlapTooltip />}
                </h2> */}

                <OverlapTooltip
                  column={col}
                  className={clsx(
                    "relative flex justify-center items-center gap-0 sm:gap-2",
                    headerClass
                  )}
                />

                {/* DAY COLUMN HEADER DATA*/}
                <div className="relative flex w-full">
                  <div className="z-0 relative flex flex-col w-full">
                    {timeSlots.map((time) => (
                      <div
                        key={time}
                        className={clsx("text-[10px]", timeSlotClass)}
                        style={timeSlotDynamicStyle}
                      />
                    ))}
                  </div>
                  <div className="z-10 absolute top-0 left-0 flex flex-col w-full isolate h-full px-2 pointer-events-none">
                    {/* this extra div is needed so that TimeItem does not overflow because of the px-1 above */}
                    <div className="relative [&>*]:pointer-events-auto">
                      {col.sections.map((cs, i) => (
                        <TimeSlot
                          length={col.sections.length}
                          order={i}
                          key={cs.uid}
                          data={cs}
                          hasOverlap={col.hasOverlap}
                          startOffset={startTime}
                          yScale={yScale}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {subViewSections.length !== 0 && (
          <div className="flex flex-col overflow-hidden border border-slate-100 rounded-2xl bg-white">
            <p className={clsx("flex flex-col", sectionHeaderClass)}>
              <span>{"No Time or Day"}</span>
              <span className="text-xs font-semibold italic lowercase">
                {"(TBA • N/A • Async)"}
              </span>
            </p>

            <div className="flex gap-4 flex-wrap p-4">
              {subViewSections.map((dayCol) => (
                <Fragment key={dayCol.day.long}>
                  {dayCol.sections.map((section) => (
                    <div className="w-min-[20rem]" key={section.uid}>
                      <TimeItem data={section} />
                    </div>
                  ))}
                </Fragment>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

const TimeItem = ({
  data,
  collapsible = false,
  shrink = false,
  onClick,
}: {
  data: ClassSectionWithState;
  collapsible?: boolean;
  shrink?: boolean;
  onClick?: () => void;
}) => {
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
  const setPopoverContent = () => setSelected(data);

  // style tokens:
  const ringHighlight = ring_highlight[color];
  const ringHighlightOn = ring_highlight_on[color];

  const bgColor = time_item_bg_color[color];
  const textColor = time_item_text_color[color];

  const tabBgColor = tab_bg_color[color];
  const tabBgColorOn = tab_bg_color_on[color];

  const iconBgColor = icon_bg_color[color];
  const iconBgColorOn = icon_bg_color_on[color];
  const iconTextColor = icon_text_color[color];
  const iconTextColorOn = icon_text_color_on[color];

  const icon = useMemo(
    () =>
      createElement(section_type_icons[section_type], {
        className: "w-4 h-4 sm:w-6 sm:h-6",
      }),
    []
  );

  return (
    <div
      className={clsx(
        "relative flex w-full h-full rounded-lg overflow-hidden ring-1",
        ringHighlight,
        ringHighlightOn
      )}
    >
      {collapsible && (
        <button
          type="button"
          className={clsx(
            "flex justify-center items-start min-w-[1rem] sm:min-w-[1.5rem] h-full mix-blend-multiply hover:mix-blend-normal focus-visible:mix-blend-normal",
            shrink ? tabBgColor : bgColor,
            tabBgColorOn
          )}
          onClick={onClick}
        >
          <span className="hidden">toggle shrink</span>
          <span
            className={clsx(
              "mt-2 grid place-items-center transition-[transform] duration-500",
              shrink ? "rotate-180" : "rotate-0",
              textColor
            )}
          >
            <IconChevronRight
              className="text-whitezz w-3 h-3"
              // size={16}
              stroke={2.5}
            />
          </span>
        </button>
      )}
      <button
        type="button"
        className={clsx(
          "group/t-btn w-full h-full p-1 sm:p-2 text-xs overflow-hidden ",
          bgColor,
          textColor
        )}
        onClick={setPopoverContent}
      >
        <div className="w-full h-full overflow-hidden flex gap-3 sm:gap-2 rounded">
          <div className="flex gap-2 flex-col sm:flex-row  zzflex-row flex-wrap items-center font-semibold w-minzz h-minzz h-min w-full">
            <span
              className={clsx(
                "rounded h-6 w-6 sm:h-10 sm:w-10 grid place-items-center",
                iconBgColor,
                iconBgColorOn,
                iconTextColor,
                iconTextColorOn
              )}
            >
              {icon}
            </span>
            <div className="flex flex-col gap-3 sm:gap-0">
              <span className="text-left whitespace-nowrap [writing-mode:vertical-lr] sm:[writing-mode:horizontal-tb] font-bold">
                {dept_abbr} {course_number.toLowerCase()}{" "}
              </span>
              <span className="text-left whitespace-nowrap [writing-mode:vertical-lr] sm:[writing-mode:horizontal-tb] font-semibold font-mono lowercase">
                {`${class_number ? class_number : section_number}`}
              </span>
            </div>
          </div>
        </div>
      </button>
    </div>
  );
};

type TimeSlotProps = {
  data: ClassSectionWithState;
  startOffset: number;
  yScale?: number;
  hasOverlap: boolean;
  order: number;
  length: number;
};
const TimeSlot = ({
  data,
  order,
  length,
  startOffset,
  hasOverlap,
  yScale = 1,
}: TimeSlotProps) => {
  const [shrink, setShrink] = useState(false);

  const { time_start, time_end } = data;

  const height = (time_end - time_start) * yScale;
  const posY = (time_start - startOffset) * yScale;

  const widthPercentage = `${(length - order) * 20}%`;
  const widthRem = `${(length - order) * 1.5}rem`;
  const width = `min(${widthRem},${widthPercentage})`;

  const toggleShrink = () => {
    if (!hasOverlap) return;
    setShrink((v) => !v);
  };

  return (
    <div
      className={clsx(
        "absolute right-0",
        shrink && "isolate",
        hasOverlap && "transition-[width] duration-500"
      )}
      style={{
        height,
        top: posY,
        width: shrink ? width : "100%",
      }}
    >
      <TimeItem
        data={data}
        onClick={toggleShrink}
        collapsible={hasOverlap}
        shrink={shrink}
      />
    </div>
  );
};

export const SelectedSectionPopup = () => {
  const [selected, setSelected] = useAtom(selectedSectionAtom);
  const prev = useLastValidValue(selected);
  const close = () => setSelected(null);

  const opened = !!selected;
  const data = selected === null ? prev : selected;

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
            {!!data && (
              <ClassSectionItem
                data={{
                  ...data,
                  state: { ...data.state, selected: false, hidden: false },
                }}
              />
            )}
          </div>
        </Transition>
      </Backdrop>
    </Portal>
  );
};

const OverlapTooltip = ({
  className,
  column,
}: {
  className?: string;
  column: DayColumn;
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="relative flex flex-col">
      <h2
        className={clsx(className)}
        // safari can't gain focus onClick naturally, so we force it here
        // it's also here cus on mobile the button is too small to click accurately
        onClick={() => triggerRef?.current?.focus()}
      >
        <span className="hidden sm:block">{column.day.medium}</span>
        <span className="sm:hidden">{column.day.short}</span>
        {column.hasOverlap && (
          <button
            ref={triggerRef}
            type="button"
            className="text-rose-500"
            onFocus={() => setShowTooltip(true)}
            onBlur={() => setShowTooltip(false)}
          >
            <IconAlertCircle size={16} stroke={2.5} />
          </button>
        )}
      </h2>
      {column.hasOverlap && (
        <Portal portalToTag="body">
          <Backdrop
            open={showTooltip}
            close={close}
            manual
            className="grid place-items-center"
          >
            <Transition
              as={Fragment}
              show={showTooltip}
              enter="transition-[transform_opacity] duration-200 ease-linear"
              enterFrom="transform scale-50 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition-[transform_opacity] duration-200 ease-linear"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-50 opacity-0"
            >
              <div className="bg-white text-rose-500 text-sm p-4 ring-1 ring-rose-500/10 rounded-xl shadow-lg w-60">
                Looks like you have a time overlap. The overlapped segments are
                outlined as a tab on the left of each section. You can click on
                the tab to collapse it so you can see underneath that section.
              </div>
            </Transition>
          </Backdrop>
        </Portal>
      )}
    </div>
  );
};

// const OverlapTooltip = ({
//   className,
//   column,
//   width = 200,
// }: {
//   className?: string;
//   column: DayColumn;
//   width?: number;
// }) => {
//   const [showTooltip, setShowTooltip] = useState(false);
//   const [position, setPosition] = useState<{
//     x: number;
//     y: number;
//     width: number;
//     originalWidth: number;
//   }>({
//     x: 0,
//     y: 0,
//     width,
//     originalWidth: width,
//   });

//   const triggerRef = useRef<HTMLButtonElement>(null);

//   useEffect(() => {
//     const handle = () => {
//       const trigger = triggerRef.current?.getBoundingClientRect();
//       // const tooltip = tooltipRef.current?.getBoundingClientRect();

//       // console.log(triggerRef);
//       // console.log(tooltipRef);

//       if (trigger) {
//         setPosition((v) => {
//           const marginTop = 20;
//           const marginX = 10;

//           const maxRightEdge = marginX;
//           const maxLeftEdge = window.innerWidth - marginX;

//           const maxWidth = clamp(
//             v.originalWidth,
//             0,
//             window.innerWidth - marginX * 2
//           );

//           let width = maxWidth;
//           let x = trigger.x + -width / 2 + trigger.width / 2;
//           const y = trigger.y + trigger.height + marginTop;

//           const rightEdge = x + v.originalWidth;
//           const deltaRight = rightEdge - maxLeftEdge;

//           if (deltaRight > 0) x = x - deltaRight;
//           if (x < maxRightEdge) x = maxRightEdge;

//           return { ...v, x, y, width };
//         });
//       }
//     };

//     handle();

//     window.addEventListener("resize", handle);

//     return () => {
//       window.removeEventListener("resize", handle);
//     };
//   }, []);

//   return (
//     <div
//       className={clsx("relative flex flex-col z-20zz", showTooltip && "z-10zz")}
//     >
//       <h2
//         className={clsx(className)}
//         // safari can't gain focus onClick naturally, so we force it here
//         // it's also here cus on mobile the button is too small to click accurately
//         onClick={() => triggerRef?.current?.focus()}
//       >
//         <span className="hidden sm:block">{column.day.medium}</span>
//         <span className="sm:hidden">{column.day.short}</span>
//         {column.hasOverlap && (
//           <button
//             ref={triggerRef}
//             type="button"
//             className="text-rose-500"
//             onFocus={() => setShowTooltip(true)}
//             onBlur={() => setShowTooltip(false)}
//           >
//             <IconAlertCircle size={16} stroke={2.5} />
//           </button>
//         )}
//       </h2>
//       {column.hasOverlap && showTooltip && (
//         <Portal portalToTag="body">
//           <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
//             <div
//               className="absolute bg-white text-rose-500 text-sm p-4 ring-1 ring-rose-500/10 rounded-xl shadow-lg"
//               style={{
//                 top: position.y,
//                 left: position.x,
//                 width: position.width,
//               }}
//             >
//               Looks like you have a time overlap. The overlapped segments are
//               outlined as a tab on the left of each section. You can click on
//               the tab to collapse it so you can see underneath that section.
//             </div>
//           </div>
//         </Portal>
//       )}
//     </div>
//   );
// };
