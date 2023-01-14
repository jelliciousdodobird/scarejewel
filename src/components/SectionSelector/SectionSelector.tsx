import {
  IconBook,
  IconCircleMinus,
  IconCirclePlus,
  IconExternalLink,
  IconEye,
  IconEyeOff,
  IconLayersLinked,
  IconMicroscope,
  IconNotes,
  IconPencilPlus,
  IconYoga,
} from "@tabler/icons";
import { useQuery } from "@tanstack/react-query";
import { PrimitiveAtom, SetStateAction, useAtom } from "jotai";
import Link from "next/link";
import { Fragment, memo, useEffect, useMemo, useRef, useState } from "react";
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
import { useMediaQuery } from "react-responsive";
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

  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 640px)",
  });

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

        const state: ClassSectionState = !!oldItem ? oldItem.state : freshState;

        return {
          ...cs,
          state,
        };
      });

      return { ...v, availableSections: dataWithState };
    });
  }, [data]);

  useEffect(() => {
    console.log("SectionSelector", courseItem.id);
  });

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
    <div className="flex flex-col gap-4">
      {groups.map((group, i) => (
        <Fragment key={group[0].group_id}>
          {groups.length > 1 && (
            <h2 className="font-extrabold text-xl uppercase pt-4">
              Group {i + 1}
            </h2>
          )}
          <ul className="flex flex-col gap-8 sm:gap-4 rounded-md bg-transparent">
            {/* <ul className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-8 rounded-md bg-transparent"> */}
            {group.map((s) => (
              <ClassEntry
                key={s.uid}
                type={isDesktopOrLaptop ? "row" : "card"}
                data={s}
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

  const bgColor = hidden ? "bg-slate-100" : "bg-white";
  const collapse = hidden ? "overflow-hidden h-16" : "h-auto";
  const grayscale = hidden
    ? "grayscale-[80%] opacity-50"
    : "grayscale-0 opacity-100 ";
  const ringGlow = selected
    ? "ring-4 ring-emerald-100 border-emerald-400 group-hover:ring-4 group-hover:ring-emerald-200  group-hover:border-emerald-500"
    : "ring-0 ring-transparent border-slate-200 group-hover:ring-4 group-hover:ring-slate-100  group-hover:border-slate-300";

  const toggleSelected = () => {
    update(transformToggleSelected(data));
  };

  const toggleHidden = () => {
    update(transformToggleHidden(data));
  };

  return (
    <li
      className={clsx(
        "grid grid-cols-[min-content_80px_2fr_2fr_2fr_2fr_8rem] grid-rows-[min-content_min-content] justify-items-start items-center place-items-centerzz  gap-0",
        "rounded-md py-2 px-2 bg-transparent border border-slate-200"
      )}
    >
      <div className="flex">
        <button
          className="flex justify-center items-center w-10 h-10 rounded-[50%] hover:text-slate-600"
          onClick={toggleSelected}
        >
          {selected ? (
            <IconCircleMinus className="text-rose-500 hover:text-rose-400" />
          ) : (
            <IconCirclePlus className="text-emerald-500 hover:text-emerald-400" />
          )}
        </button>
        <button
          className="flex justify-center items-center w-10 h-10 rounded-[50%] hover:text-slate-600"
          onClick={toggleHidden}
        >
          {hidden ? <IconEyeOff /> : <IconEye />}
        </button>
      </div>

      <span className="flex items-center gap-1 rounded-md font-semibold capitalize pl-1 pr-2 py-[0.125rem]zz py-1 w-min bg-slate-200 text-slate-500 h-min">
        {section_type_icons[section_type]}
        {section_type}
      </span>
      <h3
        className={`flex items-center flex-1 pl-2 text-slate-900 text-lg font-mono font-extrabold ${grayscale}`}
      >
        {section_number} {class_number}
      </h3>
      <div className="flex flex-col gap-1">
        {getTimeMarkup(time_start, time_end)}
      </div>
      <div className="flex gap-2 flex-wrap">
        {getDays(days).map((day) => (
          <DayTag key={day} day={day} />
        ))}
      </div>
      <span className="flex gap-1 text-slate-500">
        <Link
          className="flex items-center gap-1 font-bold hover:underline text-slate-900"
          target="_blank" // open in new tab/window
          href={get_rmp_URL(instructor_fn, instructor_ln)}
        >
          {formatFirstName(instructor_fn)} {instructor_ln}
          <IconExternalLink size={16} />
        </Link>
      </span>

      <span className="text-slate-500 font-semibold">
        {formatLocation(data.location)}
      </span>

      <Comment comment={comment} />
    </li>
  );
};

export const ClassCard = ({ data, update }: BaseClassEntryProps) => {
  const { selected, hidden, notes } = data.state;

  const toggleSelected = () => {
    update(transformToggleSelected(data));
  };

  const toggleHidden = () => {
    update(transformToggleHidden(data));
  };

  const bgColor = hidden ? "bg-slate-100" : "bg-white";
  const collapse = hidden ? "overflow-hidden h-16" : "h-auto";
  const grayscale = hidden
    ? "grayscale-[80%] opacity-50"
    : "grayscale-0 opacity-100 ";
  const ringGlow = selected
    ? "ring-4 ring-emerald-100 border-emerald-400 group-hover:ring-4 group-hover:ring-emerald-200  group-hover:border-emerald-500"
    : "ring-0 ring-transparent border-slate-200 group-hover:ring-4 group-hover:ring-slate-100  group-hover:border-slate-300";

  return (
    <li className="flex flex-col group self-stretchzz">
      <span className="flex text-slate-400">
        <h3
          className={`flex items-center flex-1 pl-2 text-slate-900 text-lg font-mono font-extrabold ${grayscale}`}
        >
          {data.section_number} {data.class_number}
          {selected && (
            <span className="text-slate-500 font-semibold text-sm font-base ml-4">
              (added)
            </span>
          )}
          {hidden && (
            <span className="text-slate-500 font-semibold text-sm font-base ml-2 ">
              (hidden)
            </span>
          )}
        </h3>
        <button
          className="flex justify-center items-center w-12 h-12 rounded-[50%] hover:text-slate-600"
          onClick={toggleHidden}
        >
          {hidden ? <IconEyeOff /> : <IconEye />}
        </button>
        <button
          className="flex justify-center items-center w-12 h-12 rounded-[50%] hover:text-slate-600"
          onClick={toggleSelected}
        >
          {selected ? (
            <IconCircleMinus className="text-rose-500 hover:text-rose-400" />
          ) : (
            <IconCirclePlus className="text-emerald-500 hover:text-emerald-400" />
          )}
        </button>
      </span>
      <div
        className={`flex-grow relative flex flex-col gap-8 p-4 rounded-md border transition-[opacity_filter_background-color_box-shadow] ${ringGlow} ${bgColor} ${grayscale} ${collapse}`}
      >
        <div className="flex gap-2 ">
          <div className="flex min-w-[7rem]">
            <span className="flex items-center gap-1 rounded-md font-semibold capitalize pl-1 pr-2 py-[0.125rem]zz py-1 w-min bg-slate-200 text-slate-500 h-min">
              {section_type_icons[data.section_type]}
              {data.section_type}
            </span>
          </div>
          <div className="flex flex-col items-start gap-2">
            <span className="flex gap-1 text-slate-500">
              <Link
                className="flex items-center gap-1 font-bold hover:underline text-slate-900"
                target="_blank" // open in new tab/window
                href={get_rmp_URL(data.instructor_fn, data.instructor_ln)}
              >
                {formatFirstName(data.instructor_fn)} {data.instructor_ln}
                <IconExternalLink size={16} />
              </Link>
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <div className="flex min-w-[7rem]">
            <span className="text-slate-500 font-semibold">
              {formatLocation(data.location)}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            {getTimeMarkup(data.time_start, data.time_end)}
            <div className="flex gap-2 flex-wrap">
              {getDays(data.days).map((day) => (
                <DayTag key={day} day={day} />
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Comment comment={data.comment} />
        </div>
      </div>
    </li>
  );
};

const ClassEntry = memo(function ClassEntry({
  type,
  data,
  update,
}: ClassEntryProps) {
  useEffect(() => {
    console.log("ClassEntry", data.section_number);
  });

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

const Comment = ({ comment }: { comment: string }) => {
  const contentRef = useRef<HTMLDivElement>(null!);
  const [isClamped, setClamped] = useState(false);
  const [isExpanded, setExpanded] = useState(false);
  const toggleExpand = () => setExpanded((v) => !v);
  const clamp = isExpanded ? "line-clamp-none" : "line-clamp-1";

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
      <span ref={contentRef} className={`${clamp} text-sm text-slate-500`}>
        {formatComment(comment)}
      </span>
      {isClamped && (
        <button
          type="button"
          className="flex justify-center items-center self-end px-2 py-[0.125rem] rounded-md text-sm text-slate-400 cursor-pointer hover:bg-slate-300 hover:text-slate-700 w-min whitespace-nowrap "
          onClick={toggleExpand}
        >
          {isExpanded ? "- less" : "+ more"}
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
      className={`flex justify-center items-center rounded-full px-4 py-1 capitalize text-sm ${bgColor} ${textColor}`}
    >
      {text}
    </span>
  );
};

export const section_type_icons: Record<SectionType, React.ReactNode> = {
  lab: <IconMicroscope className="text-slate-500" />,
  lec: <IconNotes className="text-slate-500" />,
  sem: <IconBook className="text-slate-500" />,
  sup: <IconPencilPlus className="text-slate-500" />,
  act: <IconYoga className="text-slate-500" />,
  add: <IconLayersLinked className="text-slate-500" />,
};

const getTimeMarkup = (start: number, end: number) => {
  if (start === end) return <span className="flex gap-2">TBA</span>;

  const startTime = formatTime(start);
  const startTimePre = startTime.replace(/(am|pm)/gi, "");
  const startTimePost = startTime.slice(-2);

  const endTime = formatTime(end).toLowerCase();
  const endTimePre = endTime.slice(-2);
  const endTimePost = endTime.replace(/(am|pm)/gi, "");

  return (
    <span className="flex">
      <span className="text-slate-900 font-bold">{startTimePre}</span>
      <span className="text-slate-500 lowercase">{startTimePost}</span>
      <span className="text-slate-500 mx-1">-</span>
      <span className="text-slate-900 font-bold">{endTimePost}</span>
      <span className="text-slate-500 lowercase">{endTimePre}</span>
    </span>
  );
};

const transformToggleSelected = (data: ClassSectionWithState) => {
  return { ...data, state: { ...data.state, selected: !data.state.selected } };
};
const transformToggleHidden = (data: ClassSectionWithState) => {
  return { ...data, state: { ...data.state, hidden: !data.state.hidden } };
};
