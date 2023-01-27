import { nanoid } from "nanoid";
import { Semester } from "../database/types";
import { PrettyColor, prettyTailwindColors, pretty_colors } from "./colors";
import { HasId, NumberRange } from "./types";

export const rangeOverlaps = (a: NumberRange, b: NumberRange) => {
  return (
    (b.start <= a.start && a.start <= b.end) ||
    (b.start <= a.end && a.end <= b.end)
  );
};

export const rangesOverlap = (ranges: NumberRange[]) => {
  return ranges.some((a, i) => {
    return [...ranges.slice(i + 1)].some((b) => rangeOverlaps(a, b));
  });
};

export const getCurrentSemester = (): Semester => {
  // 0 = January
  const ranges: { semester: Semester; months: number[] }[] = [
    { semester: "Fall", months: [3, 4, 5, 6, 7, 8] },
    { semester: "Spring", months: [9, 10, 11, 0, 1, 2] },
  ];

  const currentMonth = new Date().getMonth();
  for (let { semester, months } of ranges)
    if (months.includes(currentMonth)) return semester;

  return "Fall";
};

/**
 * Only works with strings that have been passed through formatTitle().
 * Not comprehensive but good enough for most cases.
 * @param str
 * @returns
 */
export const upperCaseRomanNumerals = (str: string) =>
  str.replace(/Iii/g, "III").replace(/Ii/g, "II").replace(/Iv/g, "IV");

export const formatTitle = (str: string) => {
  let words = str.split(" ");

  words = words.map((word) => {
    if (word === "") return word;
    return upperCaseRomanNumerals(
      word[0].toUpperCase() + word.slice(1).toLowerCase()
    );
  });

  return words.join(" ");
};

/**
 *
 * @param time the number of minutes since 00:00 (12:00 AM)
 */
export const formatTime = (time: number, byMeridiem = true) => {
  const hours = Math.floor(time / 60);
  const minutes = time - hours * 60;
  const minutesPadded = zeroPad(minutes, 2);

  const h12 = hours % 12 === 0 ? 12 : hours % 12;
  const meridiem = hours >= 12 && hours < 24 ? "PM" : "AM";

  const format24Hours = `${hours}:${minutesPadded}`;
  const format12Hours = `${h12}:${minutesPadded}${meridiem}`;

  return byMeridiem ? format12Hours : format24Hours;
};

export const getRandomPrettyColor = (exclude?: PrettyColor[]) => {
  let arr = exclude
    ? pretty_colors.filter((c) => !exclude.includes(c))
    : pretty_colors;

  arr = arr.length === 0 ? pretty_colors : arr; // if you exclude everything then i ignore your excludes
  const index = Math.floor(Math.random() * arr.length);
  return arr[index] as PrettyColor;
};

export const getRandomIntInclusive = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
};

export const loadImage = (
  setImageDimensions: React.Dispatch<
    React.SetStateAction<{
      width: number;
      height: number;
    }>
  >,
  imageUrl: string
) => {
  const img = new Image();
  img.src = imageUrl;

  img.onload = () => {
    setImageDimensions({
      width: img.width,
      height: img.height,
    });
  };
  img.onerror = (err) => {
    console.log("img error");
    console.error(err);
  };
};

export const clamp = (num: number, min: number, max: number) =>
  Math.max(min, Math.min(num, max));

export const prettyNumber = (num: number) =>
  num.toFixed(2).replace(/[.,]00$/, "");

/**
 * Turns an array of item objects with type T into
 * an object with key value (k, v) pairs of (id, T)
 * @param arr an array of objects with atleast an "id" key
 * @returns an object with id strings as its keys and the item object as the values
 */
export const arrayToObject = <T extends HasId>(arr: T[]) => {
  const objects: { [id: string]: T } = {};
  arr.forEach((item) => {
    objects[item.id] = item;
  });

  return objects;
};

export const mapToArray = <T>(map: { [id: string]: T }) =>
  Object.entries(map).map(([id, item]) => item);

export const roundIntToNearestMultiple = (num: number, multiple: number) =>
  Math.round(num / multiple) * multiple;

export const round10 = (num: number) => Math.round(num * 10) / 10;
export const round100 = (num: number) => Math.round(num * 100) / 100;
export const roundToNearestMultipleOf = (m: number, n: number) =>
  Math.round(n / m) * m;

export const deepCopy = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));

export const mergeProps = <T>(oldValue: T, newValue: Partial<T>): T => {
  const a = deepCopy(oldValue);
  const b = deepCopy(newValue);
  return { ...a, ...b };
};

export const zeroPad = (num: number, zeroes: number) =>
  String(num).padStart(zeroes, "0");
