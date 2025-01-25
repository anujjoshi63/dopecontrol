import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import NumberFlow from "@number-flow/react";
import clsx from "clsx";

interface UserHabit {
  id: number;
  name: string;
  points: number;
}

const Summary = async ({
  userHabits,
}: {
  userHabits: Record<string, UserHabit>;
}) => {
  const session = await getServerAuthSession();
  if (!session?.user) return null;

  const { points } = await api.post.getPoints();
  const earnedActions = Object.values(userHabits)
    .filter((el) => el.points <= 0 && Math.abs(el.points) <= points)
    .reduce((acc, el) => `${acc} ${el.name};;`, "")
    .split(";;")
    .filter((el) => el);
  return (
    <div className="flex flex-col justify-center gap-2 rounded-xl bg-white bg-opacity-5 p-6">
      {points ? (
        <p
          className={clsx("text-2xl font-medium", {
            "text-rose-400": points < 0,
            "text-emerald-500": points > 0,
            "text-gray-400": points === 0,
          })}
        >
          <NumberFlow value={points} /> points
        </p>
      ) : (
        <p>You have no points yet.</p>
      )}
      {earnedActions.length > 0 ? (
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
        <>
          <p className="text-white/70">
            You haven't worked enough to have fun yet.
          </p>
          <p className="text-white/70">
            Start by working on some productive or self-improvement habits.
          </p>
        </>
      )}
    </div>
  );
};

export default Summary;
