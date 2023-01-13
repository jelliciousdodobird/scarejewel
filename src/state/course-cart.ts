import { Atom, atom } from "jotai";
import { atomWithStorage, splitAtom } from "jotai/utils";
import { ComboOption } from "../components/CourseSelector/CourseSelector";
import { ClassSection } from "../database/types";
import { PrettyColor } from "../utils/colors";

export type ClassSectionState = {
  selected: boolean;
  hidden: boolean;
  notes: string;
};

export type ClassSectionWithState = ClassSection & { state: ClassSectionState };
export type ClassSectionWithColor = ClassSectionWithState & {
  color: PrettyColor;
};

export type CourseItem = {
  id: string;
  color: PrettyColor;
  selectedDept: ComboOption;
  selectedCourse: ComboOption;
  availableSections: ClassSectionWithState[];
};

export const courseItemsAtom = atomWithStorage<CourseItem[]>("course-cart", []);

export const courseItemsAtomAtom = splitAtom(courseItemsAtom);

export const selectedSectionsAtom: Atom<ClassSectionWithColor[]> = atom((get) =>
  get(courseItemsAtom).flatMap(({ availableSections, color }) =>
    availableSections
      .filter((cs) => cs.state.selected)
      .map((cs) => ({ ...cs, color }))
  )
);

export const weeklyFullViewAtom = atomWithStorage("weeklyShowFullView", false);
