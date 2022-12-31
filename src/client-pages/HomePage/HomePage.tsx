"use client";

import { useEffect, useState } from "react";
import { ThemeSwitch } from "../../components/ThemeSwitch/ThemeSwitch";
import supabase from "../../database/supabase";
import { Database } from "../../database/types";

type ClassSection = Database["public"]["Tables"]["class_sections"]["Row"];

const insertNewStuff = async () => {
  const rand = crypto.randomUUID().slice(0, 5);
  const group_id = crypto.randomUUID();
  const { data, error } = await supabase.from("class_sections").insert({
    semester: "Fall",
    year: 2020,
    dept_abbr: "CECS",
    dept_title: "Idk man just try it",
    course_number: rand,
    course_title: rand,
    units: "5",
    group_id: group_id,
    section_type: "lec",
    section_number: rand,
    class_number: rand,
    instructor_fn: "",
    instructor_ln: "",
    days: "",
    time_start: 0,
    time_end: 6000,
    location: "",
    comment: "",
  });

  console.warn(error);
};
const deleteStuff = async () => {
  const { data, error } = await supabase
    .from("class_sections")
    .delete()
    .eq("uid", "3b793ce3-ce74-4d85-a998-f09825794359");

  console.log(data);

  console.warn(error);
};

export default function HomePage() {
  const str = "The quick brown fox jumps";
  const [data, setData] = useState<ClassSection[]>([]);

  useEffect(() => {
    const getClasses = async () => {
      const { data, error } = await supabase.from("class_sections").select("*");

      if (error) console.log(error);
      if (data) setData(data);
    };
    getClasses();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative isolate">
        <div className="-z-10 absolute -top-16 w-full h-[calc(100%+4rem)] bg-gradient-to-r from-purple-500 to-pink-500 "></div>
        <div className="pack-content flex flex-col py-8">
          <h1 className="text-7xl font-bold">Hero Section</h1>
          <h2 className="text-2xl font-semibold max-w-md">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolore
            eius minima animi eos ipsum aut id similique distinctio, quod
            eveniet?
          </h2>
          <h2 className="text-2xl font-semibold max-w-md">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolore
            eius minima animi eos ipsum aut id similique distinctio, quod
            eveniet?
          </h2>

          <div className="flex">
            <button
              className="p-2 bg-gradient-to-r from-emerald-400 to-fuchsia-600"
              type="button"
              onClick={insertNewStuff}
            >
              INSERT
            </button>
            <button
              className="p-2 bg-gradient-to-r from-emerald-400 to-fuchsia-600"
              type="button"
              onClick={deleteStuff}
            >
              DELETE
            </button>
          </div>
        </div>
      </div>
      <div className="w-full">
        <pre className="pack-content">{JSON.stringify(data, null, 2)}</pre>
      </div>
      <div className="pack-content flex flex-col">
        <ThemeSwitch />
        <h1 className="text-5xl">{str}</h1>
        <h1 className="font-sans text-5xl">{str}</h1>
        <h1 className="font-mono text-5xl dark:text-blue-500">{str}</h1>

        {[...Array(10).keys()].map((v) => (
          <h2 key={v} className="text-2xl">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Suscipit
            cupiditate nam eveniet. Tempora provident autem reiciendis ratione
            unde quos distinctio.
          </h2>
        ))}
      </div>
    </div>
  );
}
