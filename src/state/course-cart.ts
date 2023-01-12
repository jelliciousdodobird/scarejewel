import { atom } from "jotai";
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

export type CourseItem = {
  id: string;
  color: PrettyColor;
  selectedDept: ComboOption;
  selectedCourse: ComboOption;
  selectedSections: ClassSectionWithState[];
};

export const courseItemsAtom = atomWithStorage<CourseItem[]>("course-cart", []);

export const courseItemsAtomAtom = splitAtom(courseItemsAtom);

export const selectedSectionsAtom = atom((get) =>
  get(courseItemsAtom).flatMap(({ selectedSections, color }) =>
    selectedSections
      .filter((cs) => cs.state.selected)
      .map((cs) => ({ ...cs, color }))
  )
);
