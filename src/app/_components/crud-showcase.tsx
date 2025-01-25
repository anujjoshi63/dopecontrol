import Summary from "@/app/_components/Summary";
import LatestPosts from "../_components/latest-posts";
import { CreatePost } from "./create-post";

export default function CrudShowcase({
  userHabits,
}: {
  userHabits: Record<
    string,
    {
      id: number;
      name: string;
      points: number;
    }
  >;
}) {
  return (
    <div className="flex w-full max-w-2xl flex-col gap-8">
      <Summary userHabits={userHabits} />
      <CreatePost userHabits={userHabits} />
      <LatestPosts userHabits={userHabits} />
    </div>
  );
}
