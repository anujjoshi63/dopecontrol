"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { api } from "@/trpc/react";
import clsx from "clsx";
import { MagicMotion } from "react-magic-motion";
export function CreatePost({ userHabits }: {
  userHabits: Record<string, {
    id: number;
    createdById: string;
    name: string;
    points: number;
  }>
}) {
  const router = useRouter();
  const [habitId, setHabitId] = useState(0)

  const createPost = api.post.create.useMutation({
    onSuccess: () => {
      router.refresh();
      setHabitId(0)
    },
  });

  return (
    <MagicMotion>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createPost.mutate({ habitId });
        }}
        className="flex flex-col gap-4"
      >
        <p className="truncate text-2xl font-semibold">Record an action</p>

        <select
          value={habitId}
          onChange={(e) => setHabitId(Number(e.target.value))}
          className="rounded-full bg-white/10 px-4 py-2 "
        >
          <option value={0} disabled>
            Select a habit
          </option>
          {Object.entries(userHabits).map(([id, habit]) => (
            <option key={id} value={id} className="text-zinc-950">
              {habit.name}
            </option>
          ))}
        </select>
        <p className="text-sm text-gray-400">
          {habitId === 0
            ? ""
            : `This action will ${userHabits[habitId]?.points && userHabits[habitId]!.points < 0 ? "cost" : "earn"} you ${userHabits[habitId]?.points} points.`}
        </p>
        <button
          type="submit"
          className={clsx(
            "rounded-full bg-white/10 px-10 py-3 font-semibold transition",
            {
              "hover:bg-white/20 text-white": !createPost.isPending && habitId !== 0,
              "text-gray-400": createPost.isPending || habitId === 0,
            }
          )}
          disabled={createPost.isPending || habitId === 0}
        >
          {createPost.isPending
            ? "Submitting..."
            : habitId !== 0 &&
              userHabits?.[habitId]?.points !== undefined ?
              (userHabits?.[habitId]?.points! > 0
                ? `Submit to get ${userHabits[habitId]?.points} points`
                : `Redeem for ${userHabits[habitId]?.points! * -1} points`) : "Select a habit first"}
        </button>
      </form>
    </MagicMotion>
  );
}
