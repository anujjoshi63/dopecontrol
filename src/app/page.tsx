import { getServerAuthSession } from "@/server/auth";
import ProfilePicture from "./_components/ProfilePicture";
import SignInWithGoogleButton from "./_components/login";
import CrudShowcase from "./crud-showcase/page";

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
