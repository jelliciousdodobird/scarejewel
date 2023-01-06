import { NextApiRequest, NextApiResponse } from "next";
import supabase from "../../../database/supabase";

const getClasses = async () => {
  const { data, error } = await supabase.from("class_sections").select("*");

  if (error) console.error(error);

  return data;
};

export default async function userHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { id },
    method,
  } = req;

  switch (method) {
    case "GET":
      // const { data, error } = await supabase.from("class_sections").select("*");

      res.status(200).json({ id, name: `User ${id}` });
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
