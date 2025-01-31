import Summary from "@/app/_components/Summary";
import LatestPosts from "../_components/latest-posts";
import { CreatePost } from "./create-post";

export default function CrudShowcase() {
  return (
    <div className="flex w-full max-w-2xl flex-col gap-8">
      <Summary />
      <CreatePost />
      <LatestPosts />
    </div>
  );
}
