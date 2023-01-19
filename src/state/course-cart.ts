import { Atom, atom } from "jotai";
import { focusAtom } from "jotai-optics";
import { atomWithStorage, splitAtom } from "jotai/utils";

import { ComboOption } from "../components/CourseSelector/CourseSelector";
import {
  createTermOption,
  TermOption,
} from "../components/TermSelect/TermSelect";
import { ClassSection, Term } from "../database/types";
import { PrettyColor } from "../utils/colors";
import { getCurrentSemester } from "../utils/util";

export type ClassSectionState = {
  selected: boolean;
  hidden: boolean;
  notes: string;
  color: PrettyColor;
};

export type ClassSectionWithState = ClassSection & { state: ClassSectionState };

export type CourseItem = {
  id: string;
  color: PrettyColor;
  selectedDept: ComboOption;
  selectedCourse: ComboOption;
  availableSections: ClassSectionWithState[];
};

const semester = getCurrentSemester();
const year = new Date().getFullYear();
const termOption: TermOption = createTermOption(semester, year);

export type ScheduleState = {
  selectedTermOption: TermOption;
  courseItems: CourseItem[];
};

export const scheduleStateAtom = atomWithStorage<ScheduleState>(
  "scheduleState",
  {
    selectedTermOption: termOption,
    courseItems: [],
  }
);

export const selectedTermOptionAtom = focusAtom(scheduleStateAtom, (optic) =>
  optic.prop("selectedTermOption")
);

export const courseItemsAtom = focusAtom(scheduleStateAtom, (optic) =>
  optic.prop("courseItems")
);

export const courseItemsAtomAtom = splitAtom(courseItemsAtom);

export const selectedSectionsAtom: Atom<ClassSectionWithState[]> = atom(
  (get) => {
    const state = get(scheduleStateAtom);

    const { semester, year } = state.selectedTermOption.value;

    return state.courseItems.flatMap(({ availableSections, color }) =>
      availableSections
        .filter(
          (cs) =>
            cs.state.selected && cs.semester === semester && cs.year === year
        )
        .map((cs) => ({ ...cs, state: { ...cs.state, color } }))
    );
  }
);

export const weeklyFullViewAtom = atomWithStorage("weeklyShowFullView", false);
