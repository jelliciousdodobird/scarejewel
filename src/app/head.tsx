import DefaultHeadTags from "./DefaultHeadTags";

export default function Head() {
  return (
    <>
      <DefaultHeadTags />
      <title>{"Yotei"}</title>
      <meta name="description" content="CSULB Schedule Planner" />
      <meta name="keywords" content="yotei,plan,schedule,csulb,lbsu,course" />
    </>
  );
}
