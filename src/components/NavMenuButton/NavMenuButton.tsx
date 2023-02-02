"use client";

import { Switch } from "@headlessui/react";
import { IconMenu, IconX } from "@tabler/icons";
import clsx from "clsx";
import { atom, useAtom } from "jotai";

export const navMenuOpenAtom = atom(false);

export const NavMenuButton = () => {
  const [open, setOpen] = useAtom(navMenuOpenAtom);
  return (
    <Switch
      checked={open}
      onChange={setOpen}
      className={clsx(
        "rounded-xl w-10 aspect-square grid place-items-center sm:hidden hover:text-primary-500 ring-current",
        "hover:bg-primary-100 hover:text-primary-500 dark:hover:bg-primary-900 dark:hover:text-primary-100"
      )}
    >
      {open ? <IconX /> : <IconMenu />}
    </Switch>
  );
};
