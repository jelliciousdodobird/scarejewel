"use client";

import { Dialog } from "@headlessui/react";
import { IconCalendarEvent, IconX } from "@tabler/icons";
import clsx from "clsx";
import { useAtomValue } from "jotai";
import { Dispatch, Fragment, SetStateAction, useRef, useState } from "react";
import { selectedSectionsHasChanged } from "../../state/course-cart";
import { WeeklyView } from "../WeeklyView/WeeklyView";

import { AnimatePresence, motion } from "framer-motion";
import { useHasMounted } from "../../hooks/useHasMounted";

export const WeeklyQuickView = () => {
  const [open, setOpen] = useState(false);
  const openWeeklyView = () => setOpen(true);
  const closeWeeklyView = () => setOpen(false);
  const toggleOpen = () => setOpen((v) => !v);

  return (
    <>
      <div className="fixed bottom-0 pb-4 h-min w-full sm:w-[calc(100%-1rem)] pointer-events-none">
        <div className="flex justify-end pack-content w-full [&>*]:pointer-events-auto">
          <ShowButton open={open} setOpen={setOpen} />
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <Dialog
            static
            open={open}
            onClose={closeWeeklyView}
            className="relative"
          >
            {/* The backdrop, rendered as a fixed sibling to the panel container */}
            <motion.div
              className="fixed inset-0 bg-black/30 "
              aria-hidden="true"
              initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
              animate={{ opacity: 1, backdropFilter: "blur(2px)" }}
              exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
              transition={{ ease: "easeOut" }}
            />
            <div className="fixed inset-0 pt-8">
              <Dialog.Panel
                className={clsx(
                  "relative flex flex-col w-full bg-white dark:bg-neutral-800 rounded-tl-3xl rounded-tr-3xl overflow-hidden",
                  "max-h-full min-h-full h-full",
                  "pack-content !pl-0 !pr-0"
                )}
                as={motion.div}
                initial={{ y: "100vh", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "100vh", opacity: 0 }}
                transition={{ ease: "easeOut" }}
              >
                <button
                  type="button"
                  className="group/drawer-btn isolate z-10 grid place-items-center w-full pt-2 pb-8 bg-inherit"
                  onClick={toggleOpen}
                >
                  <div className="h-1 w-8 bg-slate-200 dark:bg-neutral-700 group-hover/drawer-btn:bg-primary-500 rounded-full"></div>
                </button>
                <div
                  className={clsx(
                    "relative z-0 w-full px-4 pt-4",
                    "overflow-y-scroll h-full custom-scrollbar-tiny"
                  )}
                >
                  <WeeklyView />
                  <div className="z-[100] sticky bottom-0 pb-4 pt-4 h-min w-full pointer-events-none">
                    <div className="flex justify-end [&>*]:pointer-events-auto">
                      <ShowButton open={open} setOpen={setOpen} />
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </div>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  );
};

const ShowButton = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const mounted = useHasMounted();
  const hasNewChanges = useAtomValue(selectedSectionsHasChanged);
  const toggleOpen = () => setOpen((v) => !v);

  if (!mounted) return null;

  return (
    <button
      type="button"
      className={clsx(
        "flex relative rounded-[50%] w-min h-min p-4 bg-primary-500 text-white pointer-events-auto ",
        "bg-gradient-to-br from-emerald-300 via-primary-500 to-indigo-500 animate-gradient-x",
        "shadow-center shadow-primary-500/40 hover:shadow-primary-500/80"
      )}
      onClick={toggleOpen}
    >
      {hasNewChanges && (
        <span className="absolute top-0 right-0 w-2 h-2 flex">
          <span className="absolute rounded-full h-full w-full animate-ping-slow bg-rose-500/75" />
          <span className="relative rounded-full h-full w-full bg-rose-500 scale-90" />
        </span>
      )}
      {open ? <IconX /> : <IconCalendarEvent />}
    </button>
  );
};
