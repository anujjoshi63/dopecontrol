import Link from "next/link";

import { CreatePost } from "@/app/_components/create-post";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import clsx from "clsx";
import Image from "next/image";
export default async function Home() {
  // const hello = await api.post.hello({ text: "from tRPC" });
  const session = await getServerAuthSession();
  if (!session?.user)
    return (
      <main className="flex min-h-svh flex-col items-center justify-center gap-4 bg-gradient-to-b from-[hsl(170,56%,20%)] to-[hsl(180,35%,12%)] text-white">
        <h1 className="flex flex-col justify-center text-5xl font-extrabold tracking-tight sm:text-[2rem]">
          <div>
            Dope <span className="text-[hsl(162,78%,42%)]">Control</span>
          </div>
        </h1>
        <div className="text-base font-semibold tracking-tight">
          Don't just have fun, earn it.
        </div>
        <Link
          href={session ? "/api/auth/signout" : "/api/auth/signin"}
          className="mt-6 rounded-full bg-white/10 bg-gradient-to-r from-[hsla(170,56%,20%,10%)] to-[hsla(180,35%,12%,10%)] px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
        >
          Get Started
        </Link>
      </main>
    );

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[hsl(170,56%,20%)] to-[hsl(180,35%,12%)] text-white">
      <div className="container flex flex-1 flex-col items-center justify-start gap-12 px-4 py-6">
        <h1 className="flex w-full justify-between text-5xl font-extrabold tracking-tight sm:text-[2rem]">
          <div></div>
          <div>
            Dope <span className="text-[hsl(162,78%,42%)]">Control</span>
          </div>
          <Link
            href={session ? "/api/auth/signout" : "/api/auth/signin"}
            className=""
          >
            <Image
              src={session.user.image!}
              width={35}
              height={35}
              className="rounded-full outline outline-2 outline-offset-2 outline-emerald-700 transition-all duration-200 hover:outline-emerald-500"
              alt="User Profile Picture"
            />
          </Link>
        </h1>

        <div className="flex flex-col items-center gap-2">
          {/* <p className="text-2xl text-white">
            {hello ? hello.greeting : "Loading tRPC query..."}
          </p> */}

          <div className="flex flex-col items-center justify-center gap-4">
            <p className="text-center text-2xl text-white">
              {session && (
                <span>Hello {session.user?.name?.split(" ")[0]}</span>
              )}{" "}
              👋
            </p>
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
  const earnedActions = Object.values(userHabits)
    .filter((el) => el.points <= 0 && Math.abs(el.points) <= points)
    .reduce((acc, el) => `${acc} ${el.name};;`, "");
  return (
    <div className="flex w-full max-w-2xl flex-col gap-8">
      <div className="flex flex-col justify-center gap-4 rounded-xl bg-white bg-opacity-5 p-6">
        {points ? (
          <p
            className={clsx("text-2xl font-semibold", {
              "text-rose-500": points < 0,
              "text-emerald-500": points > 0,
              "text-gray-400": points === 0,
            })}
          >
            {points} points
          </p>
        ) : (
          <p>You have no points yet.</p>
        )}
        {earnedActions ? (
          <ul className="text-xl font-semibold">
            You can{" "}
            {earnedActions.split(";;").map(
              (el, i) =>
                el.length > 0 && (
                  <li key={el + i} className="text-lg font-normal">
                    -{el}
                  </li>
                ),
            )}
          </ul>
        ) : (
          <p>You haven't worked enough to have fun 🤨</p>
        )}
      </div>
      {latestPosts && latestPosts.length > 0 ? (
        <div className="flex flex-col justify-center gap-4 rounded-xl bg-white bg-opacity-5 p-6">
          <div className="flex items-center justify-between truncate text-2xl font-semibold">
            Logs{" "}
            <div className="rounded-full bg-white bg-opacity-10 px-3 py-1 text-sm opacity-75">
              see all
            </div>
          </div>
          <ul className="flex flex-col">
            {latestPosts.map((post) => (
              <li className="w-full" key={post.id}>
                -{" "}
                {`${userHabits?.[post.habitId]?.name} -> ${userHabits?.[post.habitId]?.points}`}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>You have no posts yet.</p>
      )}

      <CreatePost userHabits={userHabits} />
    </div>
  );
}
