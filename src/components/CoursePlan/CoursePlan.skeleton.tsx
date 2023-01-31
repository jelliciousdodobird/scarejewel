import clsx from "clsx";

export const CoursePlanSkeleton = () => {
  return (
    <div className="relative flex flex-col gap-4">
      <div className="flex gap-4 h-14 w-full rounded-2xl bg-slate-100 p-3">
        <div className="rounded-lg w-20 h-full bg-slate-200" />
        <div className="rounded-lg w-20 h-full bg-slate-200" />
      </div>
      <div className="flex gap-4 w-full">
        <div className="rounded-2xl w-full h-80 bg-slate-100" />
        <div className="rounded-2xl w-full h-80 bg-slate-100" />
        <div className="rounded-2xl w-full h-80 bg-slate-100 hidden md:flex" />
      </div>

      <div className="absolute inset-0 grid place-content-center p-6 text-4xl font-extrabold text-slate-500">
        <div
          className={clsx(
            "w-full max-w-lg grid text-center",
            "text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-primary-500 to-indigo-500 animate-gradient-x"
          )}
        >
          {"You have no courses. Click the plus (+) button to add a course!"}
        </div>
      </div>
    </div>
  );
};
