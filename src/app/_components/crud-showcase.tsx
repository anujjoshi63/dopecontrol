import Summary from "../_components/Summary";
import LatestPosts from "../_components/latest-posts";
import { CreatePost } from "./create-post";

export default function CrudShowcase({
  userHabits,
}: {
  userHabits: Record<
    string,
    {
      id: number;
      createdById: string;
      name: string;
      points: number;
    }
  >;
}) {
  return (
    <div className="flex w-full max-w-2xl flex-col gap-8">
      <Summary userHabits={userHabits} />
      <LatestPosts userHabits={userHabits} />
      <CreatePost userHabits={userHabits} />
    </div>
  );
}
