"use client";

import { api } from "@/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import clsx from "clsx";
import { formatDistanceToNow } from "date-fns";

export default function LatestPosts() {
  const { data: latestPosts, isLoading } = api.post.getLatest.useQuery();

  return (
    <Card className="border-white/10 bg-white/5 shadow-lg backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="tracking-tighter text-white/90">
          Latest Activities
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-fit">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="mb-4 h-24 w-full bg-white/10" />
            ))
          ) : latestPosts && latestPosts.length > 0 ? (
            latestPosts.map((post) => (
              <Card
                key={post.id}
                className="mb-4 overflow-hidden border-white/20 bg-white/10"
              >
                <CardContent className="p-0">
                  <div className="flex items-stretch">
                    <div
                      className={clsx(
                        "w-2",
                        post.habit.points > 0
                          ? "bg-emerald-400"
                          : "bg-rose-400",
                      )}
                    />
                    <div className="flex-grow p-4 py-1">
                      <div className="flex items-center gap-2 text-lg font-semibold text-white">
                        {post.habit?.name ?? "Unknown"}
                        <span className="text-sm text-white/60">
                          {formatDistanceToNow(new Date(post.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-white/80">
                        {post?.description ?? "No description"}
                      </p>
                    </div>
                    <div className="flex items-center justify-center bg-white/5 p-4">
                      {post.habit.points > 0 ? (
                        <ArrowUpIcon className="h-5 w-5 text-green-400" />
                      ) : (
                        <ArrowDownIcon className="h-5 w-5 text-red-400" />
                      )}
                      <span className="ml-2 text-xl font-bold text-white">
                        {Math.abs(post.habit.points)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="py-8 text-center text-white/60">
              No activities logged yet.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
