import { ClassDay, SectionType } from "../../database/types";
import { ClassSectionWithState } from "../../state/course-cart";

export const formatFirstName = (name: string) =>
  name === "Staff" ? name : name + ".";

export const formatComment = (comment: string) =>
  comment.replace(/\. /g, ".").replace(/\./g, ". ");

export const formatLocation = (location: string) => location.replace(/-/g, " ");

// export const section_type_icons: Record<SectionType, React.ReactNode> = {
// lab: <IconMicroscope className="text-slate-500" />,
// lec: <IconNotes className="text-slate-500" />,
// sem: <IconBook className="text-slate-500" />,
// sup: <IconPencilPlus className="text-slate-500" />,
// act: <IconYoga className="text-slate-500" />,
// add: <IconLayersLinked className="text-slate-500" />,
// };

export const shortToFullDayMap: Record<ClassDay, string> = {
  s: "sun",
  m: "mon",
  tu: "tue",
  w: "wed",
  th: "thu",
  f: "fri",
  sa: "sat",
};

export const getDays = (dayStr: string) => dayStr.split(",");

// export const getTimeMarkup = (start: number, end: number) => {
// if (start === end) return <span className="flex gap-2">TBA</span>;

//  const startTime = formatTime(start);
//  const startTimePre = startTime.replace(/(am|pm)/gi, "");
//  const startTimePost = startTime.slice(-2);

//  const endTime = formatTime(end).toLowerCase();
//  const endTimePre = endTime.slice(-2);
//  const endTimePost = endTime.replace(/(am|pm)/gi, "");

// return (
//   <span className="flex">
//     <span className="text-slate-900 font-bold">{startTimePre}</span>
//     <span className="text-slate-500 lowercase">{startTimePost}</span>
//     <span className="text-slate-500 mx-1">-</span>
//     <span className="text-slate-900 font-bold">{endTimePost}</span>
//     <span className="text-slate-500 lowercase">{endTimePre}</span>
//   </span>
// );
// };

type SplitGroup = {
  group_id: string;
  uniqueSectionTypes: SectionType[];
  classSections: ClassSectionWithState[];
};

export const splitIntoGroups = (data: ClassSectionWithState[]) => {
  const groups: { [group_id: string]: SplitGroup } = {};

  for (let classSection of data) {
    const id = classSection.group_id;
    const type = classSection.section_type;

    const group: SplitGroup = groups[id] ?? {
      group_id: id,
      uniqueSectionTypes: [],
      classSections: [],
    };
    const { classSections, uniqueSectionTypes } = group;

    classSections.push(classSection);
    // only add a section type if its not already there:
    if (!uniqueSectionTypes.includes(type)) uniqueSectionTypes.push(type);

    groups[id] = group;
  }

  return Object.values(groups);
};
// export const splitIntoGroups = (data: ClassSectionWithState[]) => {
//   const groups: { [key: string]: ClassSectionWithState[] } = {};

//   for (let row of data) {
//     const id = row.group_id;
//     const prevItems = groups[id] ?? [];
//     groups[id] = [...prevItems, row];
//   }

//   return Object.values(groups);
// };

export const get_rmp_URL = (firstname: string, lastname: string) =>
  `https://www.ratemyprofessors.com/search/teachers?query=${firstname}%20${lastname}&sid=U2Nob29sLTE2Mg==`;
