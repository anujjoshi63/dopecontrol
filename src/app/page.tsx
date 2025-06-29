import { getServerAuthSession } from "@/server/auth";
import ProfilePicture from "./_components/ProfilePicture";
import CrudShowcase from "./_components/crud-showcase";
import SignInWithGoogleButton from "./_components/login";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { History } from "lucide-react";

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

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="container flex flex-1 flex-col items-center justify-start gap-12 px-4 py-6">
        <h1 className="flex w-full items-center justify-between text-5xl font-extrabold tracking-tight sm:text-[2rem] md:grid md:grid-cols-3">
          <div className="hidden md:block"></div>
          <div className="text-3xl lg:text-4xl md:text-center">
            Dope <span className="text-[hsl(162,78%,42%)]">Control</span>
          </div>
          <div className="flex items-center gap-4 justify-self-end">
            <Link href="/logs" className="flex justify-center items-center">
              <Button variant="ghost" className="text-white">
                <History className="w-4 mr-2" />
                Logs
              </Button>
            </Link>
            <ProfilePicture
              imageURL={session.user.image!}
              name={session.user.name!}
            />
          </div>
        </h1>
        <CrudShowcase />
      </div>
    </main>
  );
}
