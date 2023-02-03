import { IconCalendarEvent } from "@tabler/icons";

export const Instructions = () => {
  return (
    <div className="w-full pack-content">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(min(320px,100%),1fr))] gap-8">
        <div className="w-full min-h-[20rem] rounded-3xl p-6 flex flex-col gap-6 bg-emerald-100 text-emerald-900">
          <span className="flex gap-6 ">
            <span className="min-w-[5rem] min-h-[5rem] rounded-3xl font-extrabold text-4xl bg-emerald-300 text-white grid place-items-center">
              1
            </span>

            <span className="flex flex-col justify-center">
              <span className="text-3xl">
                Pick a<span className="font-extrabold">{" term"}</span>
              </span>
              <span className="text-xs font-semibold">
                {"Spring 2023 · Fall 2020 · Summer 2016 · Spring 2009"}
              </span>
            </span>
          </span>

          <span className="">
            Look for classes for your upcoming semester or look back in time to
            figure out where you went wrong.
          </span>
          <span className="">
            WARNING: selecting a different term erases all your added sections.
          </span>
        </div>

        <div className="w-full min-h-[20rem] rounded-3xl p-6 flex flex-col gap-6 bg-yellow-100 text-yellow-900">
          <span className="flex gap-6 ">
            <span className="min-w-[5rem] min-h-[5rem] rounded-3xl font-extrabold text-4xl bg-yellow-300 text-white grid place-items-center">
              2
            </span>
            <span className="flex flex-col justify-center">
              <span className="text-3xl">
                Pick a<span className="font-extrabold">{" course"}</span>
              </span>
              <span className="text-xs font-semibold">
                {"MATH 260 · BIO 201 · LIT 420 · ECON 100"}
              </span>
            </span>
          </span>

          <span className="">
            A course is made up of a department abbreviation and a course code.
            Once you select both you can see the list of sections for that
            particular course.
          </span>
          <span className="">
            You can change the color of the course using the menu to the right.
          </span>
        </div>

        <div className="w-full min-h-[20rem] rounded-3xl p-6 flex flex-col gap-6 bg-rose-100 text-rose-900">
          <span className="flex gap-6 ">
            <span className="min-w-[5rem] min-h-[5rem] rounded-3xl font-extrabold text-4xl bg-rose-300 text-white grid place-items-center ">
              3
            </span>
            <span className="flex flex-col justify-center">
              <span className="text-3xl">
                Pick <span className="font-extrabold">{" sections"}</span>
              </span>
              <span className="text-xs font-semibold">
                {"Lab · Lecture · Seminar · Activity · Supplementary"}
              </span>
            </span>
          </span>

          <span className="">
            Some courses may only require one section, others may require that
            you register for multiple sections.
          </span>

          <span className="">
            After you add your sections, you can quickly switch to your weekly
            view using the floating button on the bottom right to see if you
            have time conflicts.
          </span>
        </div>
      </div>
    </div>
  );
};
