import Link from "next/link";

import { CreatePost } from "@/app/_components/create-post";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import clsx from "clsx";
export default async function Home() {
  // const hello = await api.post.hello({ text: "from tRPC" });
  const session = await getServerAuthSession();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[hsl(170,56%,20%)] to-[hsl(180,35%,12%)] text-white">
      <div className="container flex flex-col items-center justify-start gap-12 px-4 py-6 flex-1">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[2rem]">
          Dope <span className="text-[hsl(162,78%,42%)]">Control</span>
        </h1>

        <div className="flex flex-col items-center gap-2">
          {/* <p className="text-2xl text-white">
            {hello ? hello.greeting : "Loading tRPC query..."}
          </p> */}

          <div className="flex flex-col items-center justify-center gap-4">
            <p className="text-center text-2xl text-white">
              {session && <span>Hello {session.user?.name?.split(" ")[0]}</span>} 👋
            </p>
            {/* <Link
              href={session ? "/api/auth/signout" : "/api/auth/signin"}
              className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
            >
              {session ? "Sign out" : "Sign in"}
            </Link> */}
          </div>
        </div>

        <CrudShowcase />
      </div>
    </main>
  );
}

async function CrudShowcase() {
  const session = await getServerAuthSession();
  if (!session?.user) return null;

  const latestPosts = await api.post.getLatest();
  const checkHabits = await api.habit.checkTemplateHabits();
  const userHabits = await api.habit.getHabits();
  const { points } = await api.post.getPoints();
  const earnedActions = Object.values(userHabits).filter(el => el.points <= 0 && Math.abs(el.points) <= points).reduce((acc, el) => `${acc} ${el.name};;`, "")
  return (
    <div className="w-full max-w-xs flex flex-col gap-8">
      <div className="bg-opacity-5 bg-white p-6 flex flex-col gap-4 justify-center rounded-xl">
        {
          points ? (
            <p className={clsx("text-2xl font-semibold", {
              "text-rose-500": points < 0,
              "text-emerald-500": points > 0,
              "text-gray-400": points === 0,
            })}>{points} points</p>
          ) : (
            <p>You have no points yet.</p>
          )
        }
        {
          earnedActions ? (
            <ul className="text-xl font-semibold">You can {earnedActions.split(";;").map((el, i) => el.length > 0 && <li key={el + i} className="font-normal text-lg">-{el}</li>)}</ul>
          ) : (
            <p>You haven't worked enough to have fun 🤨</p>
          )
        }
      </div>
      {latestPosts && latestPosts.length > 0 ? (
        <div className="flex flex-col gap-4">
          <div className="truncate text-2xl font-semibold flex justify-between items-center">Logs</div>
          <ul className="flex flex-col">
            {latestPosts.map(post => <li className="w-full">- {`${userHabits?.[post.habitId]?.name} -> ${userHabits?.[post.habitId]?.points}`}</li>)}
          </ul>
        </div >
      ) : (
        <p>You have no posts yet.</p>
      )
      }

      <CreatePost userHabits={userHabits} />
    </div >
  );
}
