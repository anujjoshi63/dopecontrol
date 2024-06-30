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
  const getMessage = () => {
    if (+habitId === 0) return "";

    const habit = userHabits[+habitId];
    if (habit?.points === undefined) return "";

    const action = habit.points < 0 ? "cost" : "earn";
    return `This action will ${action} you ${habit.points} points.`;
  };

  function getSubmitButtonText() {
    if (createPost.isPending) return "Submitting...";

    if (
      habitId !== "0" &&
      userHabits?.[habitId]?.points !== undefined &&
      userHabits?.[habitId] !== undefined
    ) {
      const points = userHabits[habitId]?.points;
      if (points === undefined) return "Select a habit first";
      return points > 0
        ? `Submit to get ${points} points`
        : `Redeem for ${points * -1} points`;
    }

    return "Select a habit first";
  }

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
          {getMessage()}
          {createPost.error && (
            <span className="text-red-500"> {createPost.error.message}</span>
          )}
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
          {getSubmitButtonText()}
        </button>
      </form>
    </MagicMotion>
  );
}
