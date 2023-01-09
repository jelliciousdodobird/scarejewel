import { atomWithStorage } from "jotai/utils";
import { ClassSection } from "../database/types";

export type CartItem = ClassSection & {
  hidden: boolean;
  selected: boolean;
};

export const courseCartAtom = atomWithStorage<CartItem[]>("course-cart", []);
