"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";
import {
  selectedSectionsAtom,
  selectedSectionsSnapshotAtom,
} from "../../state/course-cart";

export const useSelectedSnapshot = () => {
  const sections = useAtomValue(selectedSectionsAtom);
  const setSelectedSnapshot = useSetAtom(selectedSectionsSnapshotAtom);
  const takeSelectedSnapshot = () => setSelectedSnapshot(sections);
  return { takeSelectedSnapshot };
};

/**
 * This component helps contain the re-renders caused by selectedSectionsAtom updating.
 * Use this component when you need to take a snapshot of the current selected section,
 * without trigger re-renders to the entire parent component.
 * (which would happen if you used hook useSelectedSnapshot directly)
 * @returns
 */
export const SelectedSnapshot = () => {
  const { takeSelectedSnapshot } = useSelectedSnapshot();

  useEffect(() => {
    takeSelectedSnapshot();
  }, []);

  return null;
};
