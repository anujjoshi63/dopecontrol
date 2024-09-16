"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/trpc/react"; // Adjust import to client-side usage
import clsx from "clsx";
import Link from "next/link";
import { useEffect, useState } from "react";

function LatestPosts({
  userHabits,
}: {
  userHabits: Record<
    string,
    {
      id: number;
      createdById: string;
      name: string;
      points: number;
    }
  >;
}) {
  const { data: latestPosts, isLoading } = api.post.getLatest.useQuery();
  const [hasLoaded, setHasLoaded] = useState(false);
  useEffect(() => {
    if (!isLoading) {
      const timeout = setTimeout(() => {
        setHasLoaded(true);
      }, 300); // Adjust the timeout to match the transition duration

      return () => clearTimeout(timeout); // Clean up timeout on component unmount
    } else {
      setHasLoaded(false); // Reset state if it goes back to loading
    }
  }, [isLoading]);

  return (
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
        {isLoading
          ? Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="flex h-16 w-full animate-pulse flex-col justify-evenly gap-2 rounded-xl bg-white bg-opacity-5 p-4"
              >
                <div className="flex justify-between">
                  <Skeleton className="h-3 w-[15ch] rounded-full opacity-50" />
                  <Skeleton className="h-3 w-[6ch] rounded-full opacity-50" />
                </div>
                <div>
                  <Skeleton className="h-3 w-[10ch] rounded-full opacity-50" />
                </div>
              </div>
            ))
          : latestPosts?.map((post) => {
              const habit = userHabits?.[post.habitId];
              if (!habit) return null;
              const pointsDisplay =
                habit?.points > 0 ? `+${habit.points}` : habit?.points;

              return (
                <div
                  className={clsx(
                    "h-16 w-full rounded-xl bg-white bg-opacity-5 px-4 py-3 transition-opacity duration-300",
                    {
                      "opacity-100": hasLoaded,
                      "opacity-5": !hasLoaded,
                    },
                  )}
                  style={{
                    transitionTimingFunction: "cubic-bezier(.21,.58,.69,.66)",
                  }}
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
  );
}

export default LatestPosts;
