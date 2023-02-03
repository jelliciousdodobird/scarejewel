export default async function AboutPage() {
  return (
    <div className="pack-content w-full">
      <Definition />
    </div>
  );
}

const Definition = () => {
  return (
    <div className="w-full py-16">
      <div className="pack-content w-full flex flex-col gap-8 justify-center ">
        <span className="text-xl font-bold">What exactly is Yotei?</span>
        <div className="z-10 isolate relative w-full max-w-lg flex flex-col gap-6 rounded-2xl">
          <h1 className="w-full font-extrabold text-6xl">{"Yotei"}</h1>
          <p className="flex gap-4 items-center">
            <span className="font-bold text-2xl">{"yo·tei"}</span>
            <span className="font-light text-2xl">{"/yoh teh/"}</span>
          </p>
          <div className="grid grid-cols-[5rem_1fr] gap-8 text-xl">
            <span className="grid place-items-center bg-neutral-300 text-neutral-500 h-8 px-2 rounded-lg font-semibold text-lg italic">
              origin
            </span>
            <span className="mt-[2px]">
              the Japanese word for <span className="font-extrabold">plan</span>
              .
            </span>
            <span className="grid place-items-center bg-neutral-300 text-neutral-500 h-8 px-2 rounded-lg font-semibold text-lg italic">
              noun
            </span>
            <span className="mt-[2px] flex flex-col gap-4 ">
              <span className="">
                <span className="text-neutral-500 font-extrabold mr-4">
                  {"1"}
                </span>
                <span className="">
                  {"a design or scheme of arrangement: "}
                </span>
                <span className=" italic font-light">
                  {"an elaborate plan for seating guests."}
                </span>
              </span>
              <span className="">
                <span className="text-neutral-500 font-extrabold mr-4">
                  {"2"}
                </span>
                <span className="">{"a Mike Tyson quote: "}</span>
                <span className=" italic font-light">
                  {"everybody has a plan until they get punched in the mouth."}
                </span>
              </span>
              <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-primary-500 to-indigo-500 animate-gradient-x">
                <span className="text-primary-500 font-extrabold mr-4">
                  {"3"}
                </span>
                <span className="">
                  {"a web app to help CSULB students arrange their schedules: "}
                </span>
                <span className="italic font-medium">
                  {"the perfect plan for your next semester."}
                </span>
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
