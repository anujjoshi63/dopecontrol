"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { api } from "@/trpc/react";
import clsx from "clsx";
import { MagicMotion } from "react-magic-motion";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function CreatePost({
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
  const router = useRouter();
  const [habitId, setHabitId] = useState("0");

  const createPost = api.post.create.useMutation({
    onSuccess: () => {
      router.refresh();
      setHabitId("0");
    },
  });

  return (
    <MagicMotion>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createPost.mutate({ habitId: Number(habitId) });
        }}
        className="flex flex-col gap-4"
      >
        <p className="truncate text-2xl font-semibold">Record an action</p>
        <Select
          value={habitId}
          onValueChange={(value) => {
            setHabitId(value);
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a Habit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={"0"} disabled hidden>
              Select a Habit
            </SelectItem>
            {Object.entries(userHabits).map(([id, habit]) => (
              <SelectItem value={`${habit.id}`} key={id}>
                {habit.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-sm text-gray-400">
          {+habitId === 0
            ? ""
            : `This action will ${userHabits[+habitId]?.points && userHabits[+habitId]!.points < 0 ? "cost" : "earn"} you ${userHabits[+habitId]?.points} points.`}
        </p>
        <button
          type="submit"
          className={clsx(
            "rounded-full bg-white/10 px-10 py-3 font-semibold transition",
            {
              "text-white hover:bg-white/20":
                !createPost.isPending && habitId !== "0",
              "text-gray-400": createPost.isPending || habitId === "0",
            },
          )}
          disabled={createPost.isPending || habitId === "0"}
        >
          {createPost.isPending
            ? "Submitting..."
            : habitId !== "0" && userHabits?.[habitId]?.points !== undefined
              ? userHabits?.[habitId]?.points! > 0
                ? `Submit to get ${userHabits[habitId]?.points} points`
                : `Redeem for ${userHabits[habitId]?.points! * -1} points`
              : "Select a habit first"}
        </button>
      </form>
    </MagicMotion>
  );
}
