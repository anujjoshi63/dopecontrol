import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { redirect } from "next/navigation";
import ProfilePicture from "../_components/ProfilePicture";
export default async function LogsPage() {
  const session = await getServerAuthSession();

  if (!session?.user) redirect("/"); //redirect to home page if user is not logged in
  const logs = await api.post.getPosts({ offset: 1 });
  const habits = await api.habit.getHabits();
  return (
    <div className="flex h-svh w-full flex-col items-center justify-center overflow-hidden">
      <div className="container flex h-full w-full flex-1 flex-col items-center justify-start gap-8 px-4 py-6 ">
        <h1 className="flex w-full items-center justify-between text-5xl font-extrabold tracking-tight sm:text-[2rem]">
          <div className="text-xl font-light">
            <Link
              href={"/"}
              className="flex w-fit items-center gap-2 rounded-full bg-white bg-opacity-5 px-3 py-2 text-base transition-all hover:bg-opacity-10"
            >
              <ArrowLeftIcon /> Home
            </Link>
          </div>
          <div className="flex-1 text-center text-3xl lg:text-5xl">
            Dope <span className="text-[hsl(162,78%,42%)]">Control</span>
          </div>
          <ProfilePicture
            imageURL={session.user.image!}
            name={session.user.name!}
          />
        </h1>
        <div className="flex h-[90%] w-full max-w-2xl flex-col gap-8">
          <h1 className="w-full text-4xl font-semibold">Logs</h1>
          <div className="flex h-full w-full flex-grow flex-col gap-2 overflow-y-auto">
            {logs.map((log) => {
              if (!log?.habitId) return null;
              return (
                <div
                  key={log.id}
                  className="w-full rounded-xl bg-white bg-opacity-5 px-4 py-3"
                >
                  <div className="flex justify-between">
                    <div>{habits[log.habitId]?.name}</div>
                    <div>{habits[log.habitId]?.points}</div>
                  </div>
                  <div>{log.createdAt.toLocaleString()}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
