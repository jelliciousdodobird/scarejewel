"use client";

export type Semester = "Fall" | "Spring" | "Winter" | "Summer";
export type ClassType = "LAB" | "LEC" | "SEM";
export type ClassDays = "M" | "Tu" | "W" | "Th" | "F" | "Sa";

export type TimeInfo = {
  rawStr: string;
  h12: {
    hour: number;
    minute: number;
    meridiem: string;
  };
  h24: {
    hour: number;
    minute: number;
    rawMinutes: number; // use this to compare
  };
};

export type ClassTime = {
  rawStrRange: string;
  start: TimeInfo; // number of minutes since 0:00 (the beginning of the day)
  end: TimeInfo; // number of minutes since 0:00 (the beginning of the day)
};

export type ClassSection = {
  semester: Semester;
  year: number;

  subject: string; // ex: CECS, BIOL, MATH, ...
  courseNumber: string; // 100, 104, 242, 491a, 491b, ...
  courseTitle: string; // Web Design, Discrete Structures, ...

  groupSection: string;

  type: ClassType;
  section: string;
  class: string;

  instructor: string;

  days: ClassDays[];
  time: ClassTime;
  location: string;

  comment: string;
};

const strs = [
  "7-7:50PM", //    7:00PM -  7:50PM //
  "9-10:15AM", //    9:00AM - 10:15AM //
  "11-12:30PM", // 11:00AM - 12:30PM //
  "11-2:45PM", //  11:00AM -  2:45PM // 11:00 - 14:45
];

const extractHourMinutes = (str: string) => {
  const s = str.split(":");
  const nums = s.map((token) => parseInt(token.replace(/\D/g, "")));

  const h = nums[0];
  const m = s.length > 1 ? nums[1] : 0;

  const meridiem = str.toLowerCase().includes("pm") ? "pm" : "am";

  return { str, h, m, meridiem };
};

const convert12To24 = (hour: number, minute: number, meridiem: string) => {
  const h = hour % 12;
  const factor = meridiem === "pm" ? 12 : 0;
  const H = h + factor;

  return { hour: H, minute, rawMinutes: H * 60 + minute };
};

const extractTime = (str: string): ClassTime => {
  const s = str.split("-");

  const startStr = s[0];
  const start = extractHourMinutes(startStr);

  const endStr = s[1];
  const end = extractHourMinutes(endStr);

  // we do not know whether the start time is "am" or "pm",
  // so we convert to both so that we can compare with the end time
  const start24am = convert12To24(start.h, start.m, "am");
  const start24pm = convert12To24(start.h, start.m, "pm");

  // we will always know the meridiem of the end time
  const end24 = convert12To24(end.h, end.m, end.meridiem);

  // the end time should always be greater than the start time:
  const am = end24.rawMinutes > start24am.rawMinutes;
  const pm = end24.rawMinutes > start24pm.rawMinutes;

  // choose the correct meridiem for the start time:
  // note: when am && pm is true, it means that hours are the same,
  // so the meridiem of the start time is the same as the end time
  if (am && pm) start.meridiem = end.meridiem;
  else if (am) start.meridiem = "am";
  else if (pm) start.meridiem = "pm";

  return {
    rawStrRange: str,
    start: {
      rawStr: startStr,
      h12: { hour: start.h, minute: start.m, meridiem: start.meridiem },
      h24: convert12To24(start.h, start.m, start.meridiem),
    },
    end: {
      rawStr: endStr,
      h12: { hour: end.h, minute: end.m, meridiem: end.meridiem },
      h24: end24,
    },
  };
};

const extractTimes = () => {
  strs.forEach((str) => {
    console.log("-----------");
    console.log(extractTime(str));
  });
};

export const SchedulePage = () => {
  return (
    <div className="pack-content">
      <button onClick={extractTimes}>time</button>
    </div>
  );
};
