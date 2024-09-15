import { CreatePost } from "@/app/_components/create-post";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import Summary from "../_components/Summary";
import LatestPosts from "../_components/latest-posts";
export default async function CrudShowcase() {
  const session = await getServerAuthSession();
  if (!session?.user) return null;

  await api.habit.checkTemplateHabits();
  const userHabits = await api.habit.getHabits();

  return (
    <div className="flex w-full max-w-2xl flex-col gap-8">
      <Summary userHabits={userHabits} />
      <LatestPosts userHabits={userHabits} />
      <CreatePost userHabits={userHabits} />
    </div>
  );
}
