"use client";

import { memo, useCallback, useMemo } from "react";
import { FixedSizeList as List } from "react-window";
import { Card, CardContent } from "@/components/ui/card";
import AutoSizer from "react-virtualized-auto-sizer";

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
          <Card className="border-white/20 bg-white/10">
            <CardContent className="p-4">
              <p className="text-white/60">Invalid entry</p>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <div style={style}>
        <Card className="border-white/20 bg-white/10">
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="font-semibold text-white">{habit?.name}</p>
              <p className="text-sm text-white/60">
                {new Date(log.createdAt).toLocaleString()}
              </p>
            </div>
            <div
              className={`text-lg font-bold ${
                (habit?.points ?? 0) >= 0 ? "text-green-400" : "text-red-400"
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
  const itemData = useMemo(() => ({ logs, habits }), [logs, habits]);

  const renderRow = useCallback(
    (props: {
      index: number;
      style: React.CSSProperties;
      data: { logs: Log[]; habits: Record<string, Habit> };
    }) => <Row {...props} data={itemData} />,
    [itemData],
  );

  return (
    <div style={{ height: "calc(100vh - 16rem)" }}>
      <AutoSizer>
        {({ height, width }) => (
          <List
            height={height}
            itemCount={logs.length}
            itemSize={100}
            width={width}
            itemData={itemData}
            overscanCount={2} // Add overscan for smoother scrolling
          >
            {renderRow}
          </List>
        )}
      </AutoSizer>
    </div>
  );
});
