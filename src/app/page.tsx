import { CreatePost } from "@/app/_components/create-post";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import clsx from "clsx";
import ProfilePicture from "./_components/ProfilePicture";
import SignInWithGoogleButton from "./_components/login";
import Link from "next/link";

export default async function Home() {
  // const hello = await api.post.hello({ text: "from tRPC" });
  const session = await getServerAuthSession();
  if (!session?.user)
    return (
      <main className="flex min-h-svh flex-col items-center justify-center gap-4">
        <h1 className="flex flex-col justify-center text-5xl font-extrabold tracking-tight sm:text-[2rem]">
          <div>
            Dope <span className="text-[hsl(162,78%,42%)]">Control</span>
          </div>
        </h1>
        <div className="text-base font-semibold tracking-tight">
          Don&apos;t just have fun, earn it.
        </div>
        <SignInWithGoogleButton />
      </main>
    );

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="container flex flex-1 flex-col items-center justify-start gap-12 px-4 py-6">
        <h1 className="flex w-full justify-between text-5xl font-extrabold tracking-tight sm:text-[2rem]">
          <div></div>
          <div className="text-center text-3xl lg:text-5xl">
            Dope <span className="text-[hsl(162,78%,42%)]">Control</span>
          </div>
          <ProfilePicture
            imageURL={session.user.image!}
            name={session.user.name!}
          />
        </h1>

        {/* <p className="text-2xl text-white">
            {hello ? hello.greeting : "Loading tRPC query..."}
          </p> */}
        <CrudShowcase />
      </div>
    </main>
  );
}

async function CrudShowcase() {
  const session = await getServerAuthSession();
  if (!session?.user) return null;

  await api.habit.checkTemplateHabits();
  const latestPosts = await api.post.getLatest();
  const userHabits = await api.habit.getHabits();
  const { points } = await api.post.getPoints();
  const earnedActions = Object.values(userHabits)
    .filter((el) => el.points <= 0 && Math.abs(el.points) <= points)
    .reduce((acc, el) => `${acc} ${el.name};;`, "")
    .split(";;")
    .filter((el) => el);
  return (
    <div className="flex w-full max-w-2xl flex-col gap-8">
      <div className="flex flex-col justify-center gap-4 rounded-xl bg-white bg-opacity-5 p-6">
        {points ? (
          <p
            className={clsx("-mt-3 text-2xl font-semibold", {
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
        {earnedActions.length > 0 ? (
          <ul className="text-xl font-semibold">
            You can{" "}
            {earnedActions.map(
              (el, i) =>
                el.length > 0 && (
                  <li key={el + i} className="text-lg font-normal">
                    -{el}
                  </li>
                ),
            )}
          </ul>
        ) : (
          <p>You haven&apos;t worked enough to have fun 🤨</p>
        )}
      </div>
      {latestPosts && latestPosts.length > 0 ? (
        <div className="flex flex-col justify-center gap-4 rounded-xl bg-white bg-opacity-5 p-6">
          <div className="flex items-center justify-between truncate text-2xl font-semibold">
            Logs
            <Link
              href="/logs"
              className="rounded-full bg-white bg-opacity-10 px-3 py-1 text-sm opacity-75 transition-all hover:bg-opacity-20 hover:opacity-90"
            >
              see all
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            {latestPosts.map((post) => {
              const habit = userHabits?.[post.habitId];
              if (!habit) return null;
              const pointsDisplay =
                habit?.points > 0 ? `+${habit.points}` : habit?.points;

              return (
                <div
                  className="w-full rounded-xl bg-white bg-opacity-5 px-4 py-3"
                  key={post.id}
                >
                  <div className="flex justify-between">
                    <div>{habit?.name}</div>
                    <div>{pointsDisplay}</div>
                  </div>
                  <div>{new Date(post.createdAt).toDateString()}</div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <p>You have no posts yet.</p>
      )}

      <CreatePost userHabits={userHabits} />
    </div>
  );
}
