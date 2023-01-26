import { SectionType } from "../../database/types";
import { ClassSectionWithState } from "../../state/course-cart";

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
