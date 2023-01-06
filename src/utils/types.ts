import { PrettyColor } from "./colors";

export interface HasId {
  id: string;
}

export type PrettyColorMap = Record<PrettyColor, string>;

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<T>;
