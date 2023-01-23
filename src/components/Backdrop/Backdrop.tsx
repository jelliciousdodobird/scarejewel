import clsx from "clsx";
import { ReactNode } from "react";

type BackdropProps = {
  open: boolean;
  children: ReactNode;
  close?: () => void;
  manual?: boolean;
};

export const Backdrop = ({
  children,
  open,
  close,
  manual = false,
}: BackdropProps) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
      <div
        className={clsx(
          "relative w-full h-full max-h-full overflow-x-hidden",
          "transition-[backdrop-filter_background-color] duration-300",
          open ? "bg-slate-900/20" : "bg-slate-900/0",
          open ? "backdrop-blur-md" : "backdrop-blur-0",
          open ? "overflow-y-auto" : "overflow-y-hidden",
          open ? "pointer-events-auto" : "pointer-events-none"
        )}
      >
        <div
          className="isolate -z-10 absolute top-0 left-0 w-full h-full"
          onClick={close}
        />
        {manual ? children : open ? children : null}
      </div>
    </div>
  );
};
