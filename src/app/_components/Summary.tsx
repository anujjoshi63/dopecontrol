"use client";

import { api } from "@/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

export default function Summary() {
  const { data: pointsData, isLoading } = api.post.getPoints.useQuery();

  return (
    <Card className="border-white/10 bg-white/5 bg-gradient-to-br from-white/5 to-white/10 shadow-lg backdrop-blur-sm transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 tracking-tighter text-white/90">
          Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading || pointsData === undefined ? (
          <Skeleton className="h-12 w-40 rounded-xl bg-white/20" />
        ) : (
          <AnimatePresence mode="popLayout">
            <motion.div
              key="points"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex items-center gap-3"
            >
              <div
                className={clsx(
                  "bg-gradient-to-br bg-clip-text text-4xl font-bold leading-none text-transparent",
                  {
                    "from-emerald-600 to-green-600": pointsData?.points! > 0,
                    "from-rose-400 to-red-400": pointsData.points < 0,
                    "from-white/90 to-white/50": !pointsData?.points,
                  },
                )}
              >
                {pointsData?.points ?? 0}
              </div>
              <div className="text-xl font-semibold text-white/80">Points</div>
            </motion.div>
          </AnimatePresence>
        )}
      </CardContent>
    </Card>
  );
}
