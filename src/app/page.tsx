// import HomePage from "../client-pages/HomePage/HomePage";
// import supabase from "../database/supabase";
// import { Semester } from "../database/types";

import { HeroSection } from "../components/HeroSection/HeroSection";
import { Instructions } from "../components/Instructions/Instructions";

// export default async function Page() {
//   const { data } = await supabase.rpc("get_distinct_terms");

//   const terms = data ?? [];

//   return <HomePage terms={terms} />;
// }

export default async function HomePage() {
  // Fetch data directly in a Server Component
  // const recentPosts = await getPosts();
  // Forward fetched data to your Client Component
  return (
    <div className="relative flex flex-col gap-8 bg-gradient-to-bzz from-whitezz to-slate-100zz min-h-full py-8">
      <HeroSection />
      <Instructions />
    </div>
  );
}
