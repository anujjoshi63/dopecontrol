"use client";

import { api } from "@/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Summary() {
  const { data: pointsData, isLoading } = api.post.getPoints.useQuery();

  return (
    <Card className="border-white/10 bg-white/5 shadow-lg backdrop-blur-sm transition-colors duration-200 hover:bg-white/10">
      <CardHeader>
        <CardTitle className="tracking-tighter text-white/90">
          Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-32 bg-white/20" />
        ) : (
          <div className="text-3xl font-bold text-white">
            {pointsData?.points ?? 0} Points
          </div>
        )}
      </CardContent>
    </Card>
  );
}
