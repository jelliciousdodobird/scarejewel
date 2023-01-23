import {
  IconBook,
  IconLayersLinked,
  IconMicroscope,
  IconPencilPlus,
  IconVocabulary,
  IconYoga,
  TablerIcon,
} from "@tabler/icons";
import { SectionType } from "../../database/types";

export const formatFirstName = (name: string) =>
  name === "Staff" ? name : name + ".";

export const formatComment = (comment: string) =>
  comment.replace(/\. /g, ".").replace(/\./g, ". ");

export const formatLocation = (location: string) => location.replace(/-/g, " ");

export const getDays = (dayStr: string) => dayStr.split(",");

export const get_rmp_URL = (firstname: string, lastname: string) =>
  `https://www.ratemyprofessors.com/search/teachers?query=${firstname}%20${lastname}&sid=U2Nob29sLTE2Mg==`;

export const section_type_icons: Record<SectionType, TablerIcon> = {
  lab: IconMicroscope,
  lec: IconVocabulary,
  sem: IconBook,
  sup: IconPencilPlus,
  act: IconYoga,
  add: IconLayersLinked,
};
