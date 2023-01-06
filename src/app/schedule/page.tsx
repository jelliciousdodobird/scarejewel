import { SchedulePage } from "../../client-pages/SchedulePage/SchedulePage";

export default async function Page() {
  // Fetch data directly in a Server Component
  // const recentPosts = await getPosts();
  // Forward fetched data to your Client Component
  return <SchedulePage />;
}
