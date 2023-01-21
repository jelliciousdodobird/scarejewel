import {
  IconAlertCircle,
  IconBook,
  IconCaretDown,
  IconCheck,
  IconChevronDown,
  IconChevronUp,
  IconCircle,
  IconCircleChevronDown,
  IconCircleChevronUp,
  IconCircleMinus,
  IconCirclePlus,
  IconDotsCircleHorizontal,
  IconExternalLink,
  IconEye,
  IconEyeOff,
  IconLayersLinked,
  IconMicroscope,
  IconNotes,
  IconPencilPlus,
  IconPlus,
  IconSquare,
  IconSquareCheck,
  IconSquareRounded,
  IconSquareRoundedCheck,
  IconSquareRoundedChevronDown,
  IconSquareRoundedChevronUp,
  IconSquareRoundedMinus,
  IconSquareRoundedPlus,
  IconYoga,
  TablerIcon,
} from "@tabler/icons";
import { useQuery } from "@tanstack/react-query";
import { PrimitiveAtom, SetStateAction, useAtom } from "jotai";
import Link from "next/link";
import {
  createElement,
  Fragment,
  memo,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ClassSectionWithState, CourseItem } from "../../state/course-cart";
import { ClassDay, SectionType, Semester } from "../../database/types";
import { ClassSectionState } from "../../state/course-cart";
import { formatTime } from "../../utils/util";
import { day_bg_color, day_text_color } from "./SectionSelector.variants";
import { fetchSections } from "../../database/api";
import {
  formatComment,
  formatFirstName,
  formatLocation,
  getDays,
  get_rmp_URL,
  shortToFullDayMap,
  splitIntoGroups,
} from "./helpers";
import clsx from "clsx";
import { Switch } from "@headlessui/react";

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
      <div className="text-xl">Please pick a department and course code</div>
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
            <h3 className="sticky top-0 font-extrabold text-xl uppercase pt-4zz">
              Group {i + 1}
            </h3>
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
          <ul className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-8 rounded-md bg-transparent">
            {group.classSections.map((cs) => (
              <ClassEntry
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

export type BaseClassEntryProps = {
  data: ClassSectionWithState;
  update: (updateItem: ClassSectionWithState) => void;
};

export type ClassEntryProps = BaseClassEntryProps & {
  type: "row" | "card";
};

export const ClassRow = ({ data, update }: BaseClassEntryProps) => {
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
          <SelectedButton
            type="row"
            checked={selected}
            onChange={setSelected}
          />
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

export const ClassCard = ({ data, update }: BaseClassEntryProps) => {
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

  const childGrayscale = hidden
    ? "opacity-50 grayscale-[80%]"
    : "opacity-100 grayscale-0";

  const selectedNotHidden = selected && !hidden;

  return (
    <li className="flex flex-col">
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
          "rounded-lg border transition-[opacity_background-color_box-shadow]",
          "ring-0 ring-transparent hover:ring-[3px]",

          hidden ? "bg-slate-100" : "bg-white", // background color
          selectedNotHidden ? "border-emerald-400" : "border-slate-200", // border color
          selectedNotHidden ? "hover:ring-emerald-100" : "hover:ring-slate-100" // ring color
        )}
      >
        <span className="flex text-slate-400 rounded-md">
          <span
            className={clsx(
              "flex items-center flex-1 lowercase text-slate-900 text-lg font-mono font-extrabold",
              childGrayscale
            )}
          >
            {section_number} {class_number}
          </span>
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
        </span>

        <div
          className={clsx(
            "grid grid-cols-[7rem_1fr] gap-x-2 gap-y-8",
            childGrayscale
          )}
        >
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
        </div>
        <div className={clsx("flex gap-2", childGrayscale)}>
          <Comment comment={comment} />
        </div>
      </div>
    </li>
  );
};

const useClassEntry = (
  data: BaseClassEntryProps["data"],
  update: BaseClassEntryProps["update"]
) => {
  const setSelected = useCallback(
    (value: boolean) =>
      update({
        ...data,
        state: { ...data.state, selected: value },
      }),
    [data, update]
  );

  const setHidden = useCallback(
    (value: boolean) =>
      update({
        ...data,
        state: { ...data.state, hidden: value },
      }),
    [data, update]
  );

  return { setSelected, setHidden };
};

const ClassEntry = memo(function ClassEntry({
  type,
  data,
  update,
}: ClassEntryProps) {
  return type === "card" ? (
    <ClassCard data={data} update={update} />
  ) : (
    <ClassRow data={data} update={update} />
  );
},
arePropsEqual);

function arePropsEqual(
  prev: Readonly<ClassEntryProps>,
  next: Readonly<ClassEntryProps>
) {
  if (prev.data.uid !== next.data.uid) return false;
  if (prev.data.state.selected !== next.data.state.selected) return false;
  if (prev.data.state.hidden !== next.data.state.hidden) return false;
  if (prev.data.state.notes !== next.data.state.notes) return false;
  if (prev.data.state.color !== next.data.state.color) return false;
  if (prev.type !== next.type) return false;

  return true;
}

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

const SectionTypeLabel = ({
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
          className="flex justify-center items-center self-end px-2 py-[0.125rem]zz rounded-md text-sm text-slate-400 cursor-pointer hover:bg-slate-200 hover:text-slate-700 w-min whitespace-nowrap "
          onClick={toggleExpand}
        >
          {isExpanded ? "less" : "more"}
        </button>
      )}
    </div>
  );
};

export const DayTag = ({ day }: { day: ClassDay | string }) => {
  // if day is an empty string, we'll use sunday's colors
  // and force the text to be something else
  const empty = day === "";
  const key = empty ? "s" : (day as ClassDay);
  const text = empty ? "Async" : shortToFullDayMap[key];
  const textColor = day_text_color[key];
  const bgColor = day_bg_color[key];

  return (
    <span
      className={clsx(
        "relative grid place-items-center rounded-full px-4 py-1  capitalize text-sm",
        // "sm:px-[0.625rem] sm:py-[0.125rem] sm:rounded",
        bgColor,
        textColor
      )}
    >
      <span className="relative top-0">{text}</span>
    </span>
  );
};

export const InstructorLink = ({
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
  if (start === end) return <span className="flex gap-2">TBA</span>;

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

const SelectedButton = ({
  type = "card",
  checked,
  onChange,
}: {
  type: ClassEntryProps["type"];
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

export type ParticleType = "plus" | "check" | "circle";

export const typeToIcon: Record<ParticleType, TablerIcon> = {
  plus: IconPlus,
  check: IconCheck,
  circle: IconCircle,
};

export const Particle = ({
  type,
  size,
  x,
  y,
  color,
  trigger,
}: {
  type: "plus" | "check" | "circle";
  size: number;
  x: number;
  y: number;
  color: string;
  trigger: boolean;
}) => {
  // const icon = typeToIcon[type];

  return (
    <span
      className={clsx(
        "absolute top-1/2 left-1/2 transition-[transform] duration-500",
        !trigger && "opacity-0",
        "rounded-full",
        color
      )}
      style={{
        transform: trigger
          ? `translate3d(${x}px, ${y}px, 0px)`
          : "translate3d(-50%, -50%, 0px)",
        width: size,
        height: size,
      }}
    >
      {/* {createElement(icon, {
        size,
        stroke: 4,
        shapeRendering: "crispEdges",
      })} */}
    </span>
  );
};

export const ParticleAnimation = ({ trigger }: { trigger: boolean }) => {
  return (
    <span
      className={clsx(
        "pointer-events-none",
        // "border border-red-500",
        "absolute top-0 left-0 w-full h-full",
        trigger && "animate-fade-in-out"
      )}
    >
      <Particle
        trigger={trigger}
        type="plus"
        color="bg-emerald-100"
        size={8}
        x={5}
        y={30}
      />
      <Particle
        trigger={trigger}
        type="plus"
        color="bg-emerald-400"
        size={5}
        x={-30}
        y={-20}
      />
      <Particle
        trigger={trigger}
        type="plus"
        color="bg-emerald-300"
        size={12}
        x={-20}
        y={20}
      />
      <Particle
        trigger={trigger}
        type="plus"
        color="bg-emerald-500"
        size={16}
        x={15}
        y={-20}
      />

      <Particle
        trigger={trigger}
        type="plus"
        color="bg-emerald-200"
        size={9}
        x={10}
        y={10}
      />
      <Particle
        trigger={trigger}
        type="plus"
        color="bg-emerald-400"
        size={5}
        x={-15}
        y={-15}
      />
      <Particle
        trigger={trigger}
        type="plus"
        color="bg-emerald-100"
        size={20}
        x={-10}
        y={10}
      />
      <Particle
        trigger={trigger}
        type="plus"
        color="bg-emerald-400"
        size={10}
        x={10}
        y={-10}
      />

      <Particle
        trigger={trigger}
        type="plus"
        color="bg-emerald-500"
        size={6}
        x={0}
        y={-25}
      />
    </span>
  );
};

export const section_type_icons: Record<SectionType, TablerIcon> = {
  lab: IconMicroscope,
  lec: IconNotes,
  sem: IconBook,
  sup: IconPencilPlus,
  act: IconYoga,
  add: IconLayersLinked,
};
