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
import Link from "next/link";
import { Fragment, useEffect, useRef, useState } from "react";
import supabase from "../../database/supabase";
import {
  ClassDay,
  ClassSection,
  SectionType,
  Semester,
} from "../../database/types";
import { formatTime } from "../../utils/util";
import { day_bg_color, day_text_color } from "./SectionSelector.variants";

const staleTime = 60 * 60 * 1000; // 1 hour

const fetchSections = async (
  semester: Semester,
  year: number,
  dept: string,
  course_number: string
) => {
  if (dept === "") return []; // if department is empty dont even try to fetch anything

  const { data, error } = await supabase
    .from("class_sections")
    .select("*")
    .match({
      semester,
      year,
      dept_abbr: dept,
      course_number,
    });
  if (error) console.log(error);

  return data ?? [];
};

const formatFirstName = (name: string) =>
  name === "Staff" ? name : name + ".";

const formatComment = (comment: string) =>
  comment.replace(/\. /g, ".").replace(/\./g, ". ");

const formatLocation = (location: string) => location.replace(/-/g, " ");

export const section_type_icons: Record<SectionType, React.ReactNode> = {
  lab: <IconMicroscope className="text-slate-500" />,
  lec: <IconNotes className="text-slate-500" />,
  sem: <IconBook className="text-slate-500" />,
  sup: <IconPencilPlus className="text-slate-500" />,
  act: <IconYoga className="text-slate-500" />,
  add: <IconLayersLinked className="text-slate-500" />,
};

const shortToFullDayMap: Record<ClassDay, string> = {
  s: "sun",
  m: "mon",
  tu: "tue",
  w: "wed",
  th: "thu",
  f: "fri",
  sa: "sat",
};

const getDays = (dayStr: string) => dayStr.split(",");

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

const splitIntoGroups = (data: ClassSection[]) => {
  const groups: { [key: string]: ClassSection[] } = {};

  for (let row of data) {
    const id = row.group_id;
    const prevItems = groups[id] ?? [];
    groups[id] = [...prevItems, row];
  }

  return Object.values(groups);
};

const get_rmp_URL = (firstname: string, lastname: string) =>
  `https://www.ratemyprofessors.com/search/teachers?query=${firstname}%20${lastname}&sid=U2Nob29sLTE2Mg==`;

type SectionSelectorProps = {
  semester: Semester;
  year: number;
  dept: string;
  course_number: string;
};

export const SectionSelector = ({
  semester,
  year,
  dept,
  course_number,
}: SectionSelectorProps) => {
  const { data, isLoading, isPaused, isInitialLoading } = useQuery({
    queryKey: ["fetchSections", semester, year, dept, course_number],
    queryFn: () => fetchSections(semester, year, dept, course_number),
    enabled: dept !== "" && course_number !== "",
    staleTime,
  });

  if (isPaused) return <div className="flex">PAUSE</div>;
  if (isInitialLoading) return <div className="flex">isInitialLoading</div>;

  if (isLoading)
    return (
      <div className="relative -z-10 flex flex-col">
        <div className="animate-pulse flex text-2xl font-bold p-4">LOADING</div>
      </div>
    );
  const groups = splitIntoGroups(data ?? []);

  return (
    <div className="flex flex-col gap-4 pt-4">
      {groups.map((group, i) => (
        <Fragment key={group[0].group_id}>
          {groups.length > 1 && (
            <h2 className="font-extrabold text-xl uppercase pt-4 border-b border-slate-300">
              Group {i + 1}
            </h2>
          )}
          <ul className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-8 rounded-md bg-transparent">
            {group.map((s) => (
              <ClassCard s={s} key={s.uid} />
            ))}
          </ul>
        </Fragment>
      ))}
    </div>
  );
};

const ClassCard = ({ s }: { s: ClassSection }) => {
  const [disable, setDisabled] = useState(false);
  const [chosen, setChosen] = useState(false);
  const toggleDisable = () => setDisabled((v) => !v);

  const toggleChosen = () => setChosen((v) => !v);

  const grayscale = disable
    ? "grayscale-[80%] opacity-50"
    : "grayscale-0 opacity-100 ";
  const bgColor = disable ? "bg-slate-100" : "bg-white";
  const collapse = disable ? "overflow-hidden h-16" : "h-auto";
  const borderColor = chosen
    ? "ring-[4px] ring-emerald-100 border-emerald-500"
    : "border-slate-200 group-hover:border-slate-300 group-hover:shadow ";

  return (
    <li className="flex flex-col group self-stretch">
      <span className="flex text-slate-400 ">
        <h3
          className={`flex items-center flex-1 pl-2 text-slate-900 text-lg font-mono font-extrabold ${grayscale}`}
        >
          {s.section_number} {s.class_number}
          {chosen && (
            <span className="text-slate-500 font-semibold text-sm font-base ml-4">
              (added)
            </span>
          )}
          {disable && (
            <span className="text-slate-500 font-semibold text-sm font-base ml-2 ">
              (hidden)
            </span>
          )}
        </h3>
        <button
          className="flex justify-center items-center w-12 h-12 rounded-[50%] hover:text-slate-600"
          onClick={toggleDisable}
        >
          {disable ? <IconEyeOff /> : <IconEye />}
        </button>
        <button
          className="flex justify-center items-center w-12 h-12 rounded-[50%] hover:text-slate-600"
          onClick={toggleChosen}
        >
          {chosen ? (
            <IconCircleMinus className="text-rose-500 hover:text-rose-400" />
          ) : (
            <IconCirclePlus className="text-emerald-500 hover:text-emerald-400" />
          )}
        </button>
      </span>
      <div
        className={`flex-grow relative flex flex-col gap-6 p-4 rounded-md border transition-[opacity_filter_background-color] ${borderColor} ${bgColor} ${grayscale} ${collapse}`}
      >
        <div className="flex gap-2 ">
          <div className="flex min-w-[7rem]">
            <span className="flex items-center gap-1 rounded-md font-semibold capitalize pl-2 pr-3 py-[0.125rem]zz py-1 w-min bg-slate-200 text-slate-500 h-min">
              {section_type_icons[s.section_type]}
              {s.section_type}
            </span>
          </div>
          <div className="flex flex-col items-start gap-2">
            <span className="flex gap-1 text-slate-500">
              with
              <Link
                className="flex items-center gap-1 font-bold hover:underline text-slate-900"
                target="_blank" // open in new tab/window
                href={get_rmp_URL(s.instructor_fn, s.instructor_ln)}
              >
                {formatFirstName(s.instructor_fn)} {s.instructor_ln}
                <IconExternalLink size={16} />
              </Link>
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <div className="flex min-w-[7rem]">
            <span className="text-slate-500 font-semibold">
              {formatLocation(s.location)}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            {getTimeMarkup(s.time_start, s.time_end)}
            <div className="flex gap-2 flex-wrap">
              {getDays(s.days).map((day) => (
                <DayTag key={day} day={day} />
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <div className="flex min-w-[7rem]"></div>
          <div className="flex flex-col gap-1">
            <Comment comment={s.comment} />
          </div>
        </div>
      </div>
    </li>
  );
};

const Comment = ({ comment }: { comment: string }) => {
  const contentRef = useRef<HTMLDivElement>(null!);
  const [isClamped, setClamped] = useState(false);
  const [isExpanded, setExpanded] = useState(false);
  const toggleExpand = () => setExpanded((v) => !v);
  const clamp = isExpanded ? "line-clamp-none" : "line-clamp-2";

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
    <div className="flex flex-col">
      <span
        ref={contentRef}
        className={`${clamp} bg-transparent text-slate-500`}
      >
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
