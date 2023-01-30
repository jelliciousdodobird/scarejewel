import { Switch } from "@headlessui/react";
import {
  IconEyeOff,
  IconEye,
  IconChevronDown,
  IconSquareRoundedCheck,
  IconSquareRoundedPlus,
  IconCheck,
  IconPlus,
} from "@tabler/icons";
import clsx from "clsx";
import { useAtom, useSetAtom } from "jotai";
import Link from "next/link";
import {
  createElement,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { ClassDay, isClassDays } from "../../database/types";
import { ClassSectionWithState } from "../../state/course-cart";
import { dayNameMap } from "../../utils/types";
import { formatTime } from "../../utils/util";
import {
  bg_color_base,
  text_color,
} from "../CourseSelector/CourseSelector.variants";
import { bg_color } from "../PrettyColorPicker/PrettyColorPicker.variants";
import {
  formatComment,
  formatFirstName,
  formatLocation,
  getDays,
  get_rmp_URL,
  section_type_icons,
} from "./ClassSectionItem.helper";
import { day_bg_color, day_text_color } from "./ClassSectionItem.variants";

export type ClassSectionItemProps = {
  data: ClassSectionWithState;
  update?: (updateItem: ClassSectionWithState) => void;
};

export const ClassSectionItem = memo(ClassCard, arePropsEqual);

function arePropsEqual(
  prev: Readonly<ClassSectionItemProps>,
  next: Readonly<ClassSectionItemProps>
) {
  if (prev.data.uid !== next.data.uid) return false;
  if (prev.data.state.selected !== next.data.state.selected) return false;
  if (prev.data.state.hidden !== next.data.state.hidden) return false;
  if (prev.data.state.notes !== next.data.state.notes) return false;
  if (prev.data.state.color !== next.data.state.color) return false;
  // if (prev.type !== next.type) return false;

  return true;
}

const useClassEntry = (
  data: ClassSectionItemProps["data"],
  update: ClassSectionItemProps["update"]
) => {
  const setSelected = useCallback(
    (value: boolean) =>
      update &&
      update({
        ...data,
        state: { ...data.state, selected: value },
      }),
    [data, update]
  );

  const setHidden = useCallback(
    (value: boolean) =>
      update &&
      update({
        ...data,
        state: { ...data.state, hidden: value },
      }),
    [data, update]
  );

  return { setSelected, setHidden };
};

function ClassCard({ data, update }: ClassSectionItemProps) {
  const { selected, hidden, notes, color } = data.state;
  const {
    dept_abbr,
    course_number,
    section_type,
    section_number,
    class_number,
    instructor_fn,
    instructor_ln,
    time_start,
    time_end,
    days,
    location,
    comment,
  } = data;

  const { setHidden, setSelected } = useClassEntry(data, update);

  const displayMode = !update;

  return (
    <li className="relative flex flex-col">
      <div
        className={clsx(
          ////////////////////////////////////////////////////////////////////////////////////////
          // Using the next two lines in combination with the parent having flex-col ensures that
          // we maintain the card height until all items in a row are hidden (collapsed)
          "flex-grow", //------------------------------> IMPORTANT (read above / DONT CHANGE)
          hidden ? "h-[8rem] overflow-hidden" : "h-auto", // IMPORTANT (this line changes the height)
          ////////////////////////////////////////////////////////////////////////////////////////

          // base styles:
          "flex flex-col gap-8 p-6 bg-white",
          "rounded-lg transition-[opacity_background-color_box-shadow] duration-300",

          displayMode ? "" : "rounded-tr-[6rem]",

          !hidden && "shadow-center shadow-slate-500/10",
          hidden ? "bg-stone-50" : "bg-white" // background color
        )}
      >
        <div
          className={clsx(
            "flex flex-col gap-6",
            "[&>*]:duration-300 [&>*]:transition-[filter_opacity]",
            hidden ? "[&>*]:grayscale-[80%]" : "[&>*]:grayscale-0",
            hidden ? "[&>*]:opacity-20" : "[&>*]:opacity-100"
          )}
        >
          <div className="flex gap-6">
            <SectionTypeLabel sectionType={section_type} />
            <div className="flex flex-col justify-center">
              <span className="text-slate-700 font-bold">
                {dept_abbr} {course_number.toLowerCase()}
              </span>
              <span className="text-slate-500 text-sm font-semibold lowercase">
                {section_number} {class_number}
              </span>
              <InstructorLink
                firstName={instructor_fn}
                lastName={instructor_ln}
                className="text-slate-500 text-sm hover:underline"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex gap-2 items-center">
              <TimeRange start={time_start} end={time_end} />
              <span className="text-sm text-slate-500 font-semibold">
                {`(${formatLocation(location)})`}
              </span>
            </div>

            <div className="flex gap-2 flex-wrap">
              {getDays(days).map((day) => (
                <DayTag key={day} day={day} />
              ))}
            </div>
          </div>
          <div className="col-span-full">
            <Comment comment={comment} />
          </div>
        </div>
      </div>
      {!displayMode && (
        <div className="absolute top-0 right-0 flex flex-col items-center gap-2 w-min h-min text-slate-400">
          <Switch
            checked={selected}
            onChange={setSelected}
            className={clsx(
              "grid place-items-center w-12 h-12 rounded-full shadow-center",
              selected ? "" : "shadow-emerald-500/20",
              selected
                ? "hover:shadow-emerald-500/60"
                : "hover:shadow-emerald-500/40",
              selected ? "text-white" : "text-emerald-500",
              selected ? "bg-emerald-500" : "bg-white"
            )}
          >
            {selected ? <IconCheck /> : <IconPlus />}
          </Switch>
          <Switch
            checked={hidden}
            onChange={setHidden}
            className={clsx(
              "grid place-items-center w-10 h-10 rounded-full bg-white text-rose-500 hover:text-red-500",
              "shadow-center shadow-rose-500/20 hover:shadow-rose-500/40"
            )}
          >
            {hidden ? <IconEyeOff /> : <IconEye />}
          </Switch>
        </div>
      )}
    </li>
  );
}

export const SectionTypeLabel = ({
  size = "normal",
  sectionType,
}: {
  size?: "small" | "normal";
  sectionType: ClassSectionWithState["section_type"];
}) => {
  const icon = createElement(section_type_icons[sectionType], {
    size: 36,
  });

  return (
    <span
      className={clsx(
        "w-20 h-20 flex flex-col justify-center items-center gap-1 rounded-lg  pl-2 pr-3 py-1",
        "uppercase font-extrabold text-slate-700 text-sm bg-slate-100"
      )}
    >
      <span>{icon}</span>
      <span className="relative">{sectionType}</span>
    </span>
  );
};

const Comment = ({
  comment,
  forceShowFull = false,
}: {
  comment: string;
  forceShowFull?: boolean;
}) => {
  const contentRef = useRef<HTMLDivElement>(null!);
  const [isClamped, setClamped] = useState(false);
  const [isExpanded, setExpanded] = useState(false);
  const toggleExpand = () => setExpanded((v) => !v);

  useEffect(() => {
    const handleResize = () => {
      if (contentRef && contentRef.current) {
        setClamped(
          contentRef.current.scrollHeight > contentRef.current.clientHeight
        );
      }
    };

    setClamped(
      contentRef.current.scrollHeight > contentRef.current.clientHeight
    );

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={clsx("flex", isExpanded ? "flex-col" : "flex-row")}>
      <span
        ref={contentRef}
        className={clsx(
          "text-sm text-slate-500",
          isExpanded || forceShowFull ? "line-clamp-none" : "line-clamp-1"
        )}
      >
        {formatComment(comment)}
      </span>
      {isClamped && !forceShowFull && (
        <button
          type="button"
          className="flex justify-center items-center self-end px-2 rounded-md text-sm text-slate-400 cursor-pointer hover:bg-slate-200 hover:text-slate-700 w-min whitespace-nowrap "
          onClick={toggleExpand}
        >
          {isExpanded ? "less" : "more"}
        </button>
      )}
    </div>
  );
};

export const DayTag = ({ day }: { day: ClassDay | string }) => {
  const key = isClassDays(day) ? day : "na";
  const text = dayNameMap[key].medium;
  const textColor = day_text_color[key];
  const bgColor = day_bg_color[key];

  return (
    <span
      className={clsx(
        "relative grid place-items-center rounded-full px-4 py-1 capitalize text-sm",
        // "sm:px-[0.625rem] sm:py-[0.125rem] sm:rounded",
        bgColor,
        textColor
      )}
    >
      <span className="relative top-0">{text}</span>
    </span>
  );
};

const InstructorLink = ({
  firstName,
  lastName,
  className,
}: {
  firstName: string;
  lastName: string;
  className?: string;
}) => {
  const link = get_rmp_URL(firstName, lastName);

  return (
    <Link
      className={className}
      target="_blank" // open in new tab/window
      href={link}
    >
      {formatFirstName(firstName)} {lastName}
    </Link>
  );
};

const TimeRange = ({ start, end }: { start: number; end: number }) => {
  if (start === 0 && start === end)
    return <span className="flex gap-2 font-bold">TBA</span>;
  if (start === -1 && start === end)
    return <span className="flex gap-2 font-bold">{"N/A"}</span>;

  const startTime = formatTime(start);
  const startTimePre = startTime.replace(/(am|pm)/gi, "");
  const startTimePost = startTime.slice(-2);

  const endTime = formatTime(end).toLowerCase();
  const endTimePre = endTime.slice(-2);
  const endTimePost = endTime.replace(/(am|pm)/gi, "");

  return (
    <span className="relative flex">
      <span className="text-slate-900 font-bold">{startTimePre}</span>
      <span className="relative top-0 text-slate-400 lowercase text-[12px] font-semibold">
        {startTimePost}
      </span>
      <span className="text-slate-900 mx-1">-</span>
      <span className="text-slate-900 font-bold">{endTimePost}</span>
      <span className="relative top-0 text-slate-400 lowercase text-[12px] font-semibold">
        {endTimePre}
      </span>
    </span>
  );
};
