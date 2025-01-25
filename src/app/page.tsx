import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import ProfilePicture from "./_components/ProfilePicture";
import CrudShowcase from "./_components/crud-showcase";
import SignInWithGoogleButton from "./_components/login";

export default async function Home() {
  const session = await getServerAuthSession();
  if (!session?.user)
    return (
      <main className="flex min-h-svh flex-col items-center justify-center gap-2">
        <h1 className="flex flex-col justify-center text-5xl font-extrabold tracking-tighter sm:text-[3rem]">
          <div>
            Dope <span className="text-[hsl(162,78%,42%)]">Control</span>
          </div>
        </h1>
        <div className="text-xl font-semibold tracking-tight">
          Don&apos;t just have fun, earn it.
        </div>
        <SignInWithGoogleButton />
      </main>
    );
  await api.habit.checkTemplateHabits();
  const userHabits = await api.habit.getHabits();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="container flex flex-1 flex-col items-center justify-start gap-12 px-4 py-6">
        <h1 className="flex w-full justify-between text-5xl font-extrabold tracking-tighter sm:text-[2rem]">
          <div></div>
          <div className="text-center text-3xl lg:text-4xl">
            Dope <span className="text-[hsl(162,78%,42%)]">Control</span>
          </div>
          <ProfilePicture
            imageURL={session.user.image!}
            name={session.user.name!}
          />
        </h1>
        <CrudShowcase userHabits={userHabits} />
      </div>
    </main>
  );
}
