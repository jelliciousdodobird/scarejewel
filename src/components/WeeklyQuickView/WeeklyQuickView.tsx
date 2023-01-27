"use client";

import { Transition } from "@headlessui/react";
import { IconCalendarEvent, IconX } from "@tabler/icons";
import clsx from "clsx";
import { useAtomValue } from "jotai";
import { Dispatch, SetStateAction, useState } from "react";
import { selectedSectionsHasChanged } from "../../state/course-cart";
import { Backdrop } from "../Backdrop/Backdrop";
import { Portal } from "../Portal/Portal";
import { WeeklyView } from "../WeeklyView/WeeklyView";

export const WeeklyQuickView = () => {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <>
      <Portal portalToTag="body">
        <Backdrop open={open} close={close} manual>
          <Transition
            show={open}
            className="pack-content flex flex-col py-8 w-full pointer-events-none [&>*]:pointer-events-auto"
            enter="transition-[transform_opacity] duration-200 ease-linear"
            enterFrom="transform scale-50 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition-[transform_opacity] duration-200 ease-linear"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-50 opacity-0"
          >
            <WeeklyView />
          </Transition>
        </Backdrop>
      </Portal>
      <Portal portalToTag="body">
        {/* Need both divs since we're using position: fixed instead of sticky. Sticky has issues with chrome on android. */}
        <div className="fixed bottom-0 pb-4 h-min w-full sm:w-[calc(100%-1rem)] pointer-events-none ">
          <div className="flex justify-end pack-content w-full">
            <ShowButton open={open} setOpen={setOpen} />
          </div>
        </div>
      </Portal>
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
  const hasNewChanges = useAtomValue(selectedSectionsHasChanged);
  const toggleOpen = () => setOpen((v) => !v);

  return (
    <button
      type="button"
      className={clsx(
        "relative rounded-[50%] w-min h-min p-4 bg-primary-500 text-white pointer-events-auto ",
        "transition-[border-radius] duration-200 sha",
        "shadow-center hover:shadow-primary-500/80"
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
