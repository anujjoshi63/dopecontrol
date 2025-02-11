import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import ProfilePicture from "../_components/ProfilePicture";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import LogsList from "./_components/LogsList";
export default async function LogsPage() {
  const session = await getServerAuthSession();
  if (!session?.user) redirect("/");
  const [logs, habits] = await Promise.all([
    api.post.getPosts({ offset: 1 }),
    api.habit.getHabits(),
  ]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#165046] to-[hsl(180,35%,12%)]">
      <div className="container mx-auto flex min-h-screen flex-col px-4 py-6">
        <header className="mb-6 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" className="text-white">
              <ArrowLeftIcon className="mr-2 h-4 w-4" /> Home
            </Button>
          </Link>
          <div className="text-3xl font-extrabold text-white lg:text-4xl">
            Dope <span className="text-[hsl(162,78%,42%)]">Control</span>
          </div>
          <ProfilePicture
            imageURL={session.user.image!}
            name={session.user.name!}
          />
        </header>

        <Card className="flex-grow border-white/10 bg-white/5 shadow-lg backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white/90">Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-16rem)] pr-4">
              <LogsList logs={logs} habits={habits} />
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
