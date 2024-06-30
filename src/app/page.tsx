import { CreatePost } from "@/app/_components/create-post";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import clsx from "clsx";
import ProfilePicture from "./_components/ProfilePicture";
import SignInWithGoogleButton from "./_components/login";

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
        <SignInWithGoogleButton />
      </main>
    );

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[hsl(170,56%,20%)] to-[hsl(180,35%,12%)] text-white">
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

  await api.habit.checkTemplateHabits();
  const latestPosts = await api.post.getLatest();
  const userHabits = await api.habit.getHabits();
  const { points } = await api.post.getPoints();
  const earnedActions = Object.values(userHabits)
    .filter((el) => el.points <= 0 && Math.abs(el.points) <= points)
    .reduce((acc, el) => `${acc} ${el.name};;`, "")
    .split(";;");
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
          <p>You haven't worked enough to have fun 🤨</p>
        )}
      </div>
      {latestPosts && latestPosts.length > 0 ? (
        <div className="flex flex-col justify-center gap-4 rounded-xl bg-white bg-opacity-5 p-6">
          <div className="flex items-center justify-between truncate text-2xl font-semibold">
            Logs
            <div className="rounded-full bg-white bg-opacity-10 px-3 py-1 text-sm opacity-75">
              see all
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {latestPosts.map((post) => (
              <div
                className="w-full rounded-xl bg-white bg-opacity-5 px-4 py-3"
                key={post.id}
              >
                <div className="flex justify-between">
                  <div className="">{userHabits?.[post.habitId]?.name}</div>
                  <div>
                    {userHabits?.[post.habitId]?.points !== undefined &&
                    userHabits?.[post?.habitId]?.points! > 0
                      ? `+${userHabits?.[post.habitId]?.points}`
                      : userHabits?.[post.habitId]?.points}
                  </div>
                </div>
                <div>{new Date(post.createdAt).toDateString()}</div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>You have no posts yet.</p>
      )}

      <CreatePost userHabits={userHabits} />
    </div>
  );
}
