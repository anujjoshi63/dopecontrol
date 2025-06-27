"use client";

import { memo, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ScrollAreaViewport } from "@radix-ui/react-scroll-area";

type Log = {
  id: number;
  habitId: number;
  createdAt: Date;
};

type Habit = {
  id: number;
  name: string;
  points: number;
};
interface LogsListProps {
  logs: Log[];
  habits: Record<string, Habit>;
}

const Row = memo(
  ({
    index,
    style,
    data,
  }: {
    index: number;
    style: React.CSSProperties;
    data: { logs: Log[]; habits: Record<string, Habit> };
  }) => {
    const { logs, habits } = data;
    const log = logs[index];
    const habit = log?.habitId ? habits[log.habitId] : null;

    if (!log || !habit) {
      return (
        <div style={style}>
          <Card className="mb-2 border-white/10 bg-white/5 shadow-lg backdrop-blur-sm">
            <CardContent className="p-4 py-2">
              <p className="text-white/60">Invalid entry</p>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <div style={style}>
        <Card className="mb-2 border-white/10 bg-white/5 shadow-lg backdrop-blur-sm">
          <CardContent className="flex items-center justify-between p-4 py-2">
            <div>
              <p className="font-semibold text-white">{habit?.name}</p>
              <p className="text-sm text-white/60">
                {new Date(log.createdAt).toLocaleString()}
              </p>
            </div>
            <div
              className={`text-lg font-bold ${(habit?.points ?? 0) >= 0 ? "text-green-400" : "text-red-400"
                }`}
            >
              {(habit?.points ?? 0) >= 0 ? "+" : ""}
              {habit?.points ?? 0}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  },
);
Row.displayName = "Row";
export default memo(function LogsList({ logs, habits }: LogsListProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: logs.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100,
    overscan: 15,
  });

  return (
    <ScrollArea className="h-[calc(100vh-16rem)] pr-4 pl-4">
      <ScrollAreaViewport ref={parentRef}>
        <div
          style={{
            height: `${virtualizer.getTotalSize() / 4.854 - 160}px`,
            width: "100%",
            position: "relative",
          }}
        >
          {virtualizer.getVirtualItems().map((virtualRow) => {
            const log = logs[virtualRow.index];
            const habit = log?.habitId ? habits[log.habitId] : null;
            if (!log || !habit) {
              return null;
            }
            return (
              <div
                key={log.id}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start / 1.25}px)`,
                }}
              >
                <Card className="border-white/10 bg-white/5 shadow-lg backdrop-blur-sm">
                  <CardContent className="flex items-center justify-between p-4 py-2">
                    <div>
                      <p className="font-semibold text-white">{habit?.name}</p>
                      <p className="text-sm text-white/60">
                        {new Date(log.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div
                      className={`text-lg font-bold ${(habit?.points ?? 0) >= 0
                        ? "text-green-400"
                        : "text-red-400"
                        }`}
                    >
                      {(habit?.points ?? 0) >= 0 ? "+" : ""}
                      {habit?.points ?? 0}
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </ScrollAreaViewport>
    </ScrollArea>
  );
});
