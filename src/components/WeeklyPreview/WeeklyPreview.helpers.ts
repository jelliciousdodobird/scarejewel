import { ClassSection } from "../../database/types";
import { ClassSectionWithState } from "../../state/course-cart";
import { clamp, formatTime, roundToNearestMultipleOf } from "../../utils/util";

export const ONE_HOUR_IN_MINS = 60;
export const TWENTY_FOUR_HOURS_IN_MINS = ONE_HOUR_IN_MINS * 24;

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

export const clampTime = (time: number) =>
  clamp(0, time, TWENTY_FOUR_HOURS_IN_MINS);
