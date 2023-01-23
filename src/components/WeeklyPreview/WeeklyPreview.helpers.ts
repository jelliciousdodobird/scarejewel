import { ClassSection } from "../../database/types";
import { ClassSectionWithState } from "../../state/course-cart";
import { formatTime, roundToNearestMultipleOf } from "../../utils/util";

export const roundToNearestHour = (n: number) => {
  return roundToNearestMultipleOf(60, n);
};

export const hourOnly = (time: number) => {
  return formatTime(time).replace(":00", "");
};

export const isTimeNA = (start: number, end: number) =>
  start === -1 && start === end;

export const isTimeTBA = (start: number, end: number) =>
  start === 0 && start === end;
