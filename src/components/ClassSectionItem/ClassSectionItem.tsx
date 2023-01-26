import { Switch } from "@headlessui/react";
import {
  IconEyeOff,
  IconEye,
  IconChevronDown,
  IconSquareRoundedCheck,
  IconSquareRoundedPlus,
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

export type BaseClassSectionItemProps = {
  data: ClassSectionWithState;
  update?: (updateItem: ClassSectionWithState) => void;
};

export type ClassSectionItemProps = BaseClassSectionItemProps & {
  type?: "row" | "card";
};

export const ClassSectionItem = memo(function ClassSectionItem({
  type = "card",
  data,
  update,
}: ClassSectionItemProps) {
  return type === "card" ? (
    <ClassCard data={data} update={update} />
  ) : (
    <ClassRow data={data} update={update} />
  );
},
arePropsEqual);

function arePropsEqual(
  prev: Readonly<ClassSectionItemProps>,
  next: Readonly<ClassSectionItemProps>
) {
  if (prev.data.uid !== next.data.uid) return false;
  if (prev.data.state.selected !== next.data.state.selected) return false;
  if (prev.data.state.hidden !== next.data.state.hidden) return false;
  if (prev.data.state.notes !== next.data.state.notes) return false;
  if (prev.data.state.color !== next.data.state.color) return false;
  if (prev.type !== next.type) return false;

  return true;
}

const useClassEntry = (
  data: BaseClassSectionItemProps["data"],
  update: BaseClassSectionItemProps["update"]
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

const ClassCard = ({ data, update }: BaseClassSectionItemProps) => {
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

  const selectedNotHidden = selected && !hidden;

  return (
    <li className="flex flex-col" onClick={() => console.log(data)}>
      <div
        className={clsx(
          ////////////////////////////////////////////////////////////////////////////////////////
          // Using the next two lines in combination with the parent having flex-col ensures that
          // we maintain the card height until all items in a row are hidden (collapsed)
          "flex-grow", //------------------------------> IMPORTANT (read above / DONT CHANGE)
          hidden ? "h-16 overflow-hidden" : "h-auto", // IMPORTANT (this line changes the height)
          ////////////////////////////////////////////////////////////////////////////////////////

          // base styles:
          "flex flex-col gap-8 p-4",
          "rounded-lg border transition-[opacity_background-color_box-shadow] duration-300",
          "ring-0 ring-transparent hover:ring-[3px]",

          hidden ? "bg-slate-50" : "bg-white", // background color
          selectedNotHidden ? "border-emerald-400" : "border-slate-200", // border color
          selectedNotHidden ? "hover:ring-emerald-100" : "hover:ring-slate-100" // ring color
        )}
      >
        <div
          className={clsx(
            "grid grid-cols-[7rem_1fr] gap-x-2 gap-y-8",
            "[&>*]:duration-300 [&>*]:transition-[filter_opacity]",
            hidden
              ? "[&>*:not(.nograyscale)]:grayscale-[80%]"
              : "[&>*]:grayscale-0",
            hidden ? "[&>*:not(.nograyscale)]:opacity-20" : "[&>*]:opacity-100"
          )}
        >
          <span className="flex items-center flex-1 lowercase text-slate-900 text-lg font-mono font-extrabold">
            {section_number} {class_number}
          </span>
          {!!update ? (
            <div className="w-full flex justify-end text-slate-400 nograyscale">
              <Switch
                checked={hidden}
                onChange={setHidden}
                className="grid place-items-center w-8 h-8 hover:text-slate-600"
              >
                {hidden ? <IconEyeOff /> : <IconEye />}
              </Switch>

              <SelectedButton
                type="card"
                checked={selected}
                onChange={setSelected}
              />
            </div>
          ) : (
            <span
              className={clsx(
                "flex items-center gap-2 font-bold w-min whitespace-nowrap px-3 rounded-md",
                text_color[color],
                bg_color_base[color]
              )}
            >
              {dept_abbr} {course_number.toLowerCase()}
            </span>
          )}
          <SectionTypeLabel sectionType={section_type} />
          <span className="flex gap-1 text-slate-500">
            <InstructorLink
              firstName={instructor_fn}
              lastName={instructor_ln}
            />
          </span>
          <span className="text-slate-500 font-semibold">
            {formatLocation(location)}
          </span>
          <div className="flex flex-col gap-1">
            <TimeRange start={time_start} end={time_end} />
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
    </li>
  );
};

const ClassRow = ({ data, update }: BaseClassSectionItemProps) => {
  const { selected, hidden, notes } = data.state;
  const {
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
  const [showExtraContent, setShowExtraContent] = useState(false);
  const toggleShowContent = () => setShowExtraContent((v) => !v);

  const bgColor = hidden ? "bg-stone-100" : "bg-white";

  return (
    <li className={clsx("relative flex flex-col", bgColor)}>
      <div className="flex w-full">
        <div className="grid place-items-center p-2 border-r border-slate-200 bg-white">
          {!!update && (
            <SelectedButton
              type="row"
              checked={selected}
              onChange={setSelected}
            />
          )}
        </div>
        <div
          className={clsx(
            "grid justify-items-start items-start justify-between gap-0",
            "grid-cols-[5rem_6rem_14rem_10rem]",
            "relative flex-1 bg-inherit px-4 pt-8 pb-3",
            hidden && "[&>*]:opacity-20 [&>*]:grayscale-[80%]"
          )}
        >
          <SectionTypeLabel sectionType={section_type} />

          <span className="flex items-center flex-1 lowercase text-slate-700 font-semibold">
            {section_number} {class_number}
          </span>

          <div className="flex flex-col">
            <TimeRange start={time_start} end={time_end} />
            <div className="flex gap-2 flex-wrap">
              {getDays(days).map((day) => (
                <DayTag key={day} day={day} />
              ))}
            </div>
          </div>

          <span className="flex text-slate-500 ">
            <InstructorLink
              firstName={instructor_fn}
              lastName={instructor_ln}
            />
          </span>
        </div>
        <div className="absolute right-0 top-0 flex gap-2 p-2 bg-inherit">
          {!!update && (
            <>
              <Switch
                checked={hidden}
                onChange={setHidden}
                className="grid place-items-center text-slate-500 hover:text-slate-700"
              >
                {hidden ? <IconEyeOff size={16} /> : <IconEye size={16} />}
              </Switch>
              <Switch
                checked={showExtraContent}
                onChange={setShowExtraContent}
                className={clsx(
                  "grid place-items-center bg-inherit text-slate-500 hover:text-slate-700"
                )}
                onClick={toggleShowContent}
              >
                <IconChevronDown
                  size={16}
                  className={clsx(
                    "transition-[transform]",
                    showExtraContent ? "rotate-180" : "rotate-0"
                  )}
                />
              </Switch>
            </>
          )}
        </div>
      </div>
      {showExtraContent && (
        <div
          className={clsx(
            "flex flex-col gap-4  p-4 pl-[4rem] border-t border-slate-200",
            hidden ? "bg-stone-100" : "bg-stone-100",
            hidden && "[&>*]:opacity-20 [&>*]:grayscale-[80%]"
          )}
        >
          <span className="text-slate-500 font-semibold">
            {formatLocation(location)}
          </span>

          <Comment comment={comment} forceShowFull />
        </div>
      )}
    </li>
  );
};

const SelectedButton = ({
  type = "card",
  checked,
  onChange,
}: {
  type: ClassSectionItemProps["type"];
  checked: boolean;
  onChange: (value: boolean) => void;
}) => {
  return (
    <Switch
      checked={checked}
      onChange={onChange}
      className={clsx(
        "relative grid place-items-center w-8 h-8 hover:text-emerald-500",
        checked && "text-emerald-500"
      )}
    >
      {checked ? <IconSquareRoundedCheck /> : <IconSquareRoundedPlus />}
    </Switch>
  );
};

export const SectionTypeLabel = ({
  size = "normal",
  sectionType,
}: {
  size?: "small" | "normal";
  sectionType: ClassSectionWithState["section_type"];
}) => {
  const iconSize = size === "normal" ? 24 : 16;
  const iconStroke = size === "normal" ? 2 : 2.3;
  const icon = createElement(section_type_icons[sectionType], {
    size: iconSize,
    stroke: iconStroke,
  });

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded-md font-semibold uppercase w-min h-min bg-slate-200 text-slate-700",
        size === "normal" && "text-sm pl-2 pr-3 py-1",
        size === "small" &&
          "text-xs pl-[0.325rem] pr-2 py-1 border border-slate-300"
      )}
    >
      {icon}
      {sectionType}
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
}: {
  firstName: string;
  lastName: string;
}) => {
  const link = get_rmp_URL(firstName, lastName);

  return (
    <Link
      className={clsx(
        "relative flex items-center gap-1 font-bold hover:underline text-slate-900"
        // "sm:font-semibold sm:text-slate-700"
      )}
      target="_blank" // open in new tab/window
      href={link}
    >
      {formatFirstName(firstName)} {lastName}
      {/* <IconExternalLink size={14} /> */}
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
