import { NextApiRequest, NextApiResponse } from "next";
import supabase from "../../../database/supabase";

const getClasses = async () => {
  const { data, error } = await supabase.from("class_sections").select("*");

  if (error) console.error(error);

  return data;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const t = await getClasses();

  res.status(200).json(t);
}
