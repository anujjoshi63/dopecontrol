"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { api } from "@/trpc/react";

import { useRouter } from "next/navigation";
import SkeletonLogPost from "./_components/SkeletonLogPost";
import * as React from "react";

import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from "@/components/ui/drawer";

const Page = () => {
  const [open, setOpen] = React.useState(true);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const router = useRouter();
  const handleDialogClose =
    (open: boolean) => {
      if (!open) router.back();
    }
  //  const handleDialogClose = useCallback(
  //   (open: boolean) => {
  //     if (!open) router.back();
  //   },
  //   [router],
  // );
  const handleFullScreen = () => {
    window.location.reload();
  };

  const { data: posts, isLoading } = api.post.getPosts.useQuery(
    { offset: 1 },
    {
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  );
  const { data: habits, isLoading: isLoadingHabits } =
    api.habit.getHabits.useQuery();
  if (isDesktop) {
    return (
      <Dialog defaultOpen onOpenChange={handleDialogClose}>
        <DialogContent className="dark max-h-svh bg-gradient-to-b from-[hsl(170,56%,20%)] to-[hsl(180,35%,12%)]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between gap-10 pr-8">
              Your Logs
            </DialogTitle>
            <DialogDescription className="">
              {isLoading && (
                <div className="flex max-h-[50vh] flex-col gap-2 overflow-y-scroll py-2">
                  <SkeletonLogPost />
                  <SkeletonLogPost />
                  <SkeletonLogPost />
                </div>
              )}
              <div className="flex max-h-[50vh] flex-col gap-2 overflow-y-scroll py-2 pr-4 text-white">
                {!isLoadingHabits &&
                  posts?.map((post) => (
                    <div
                      key={post.id}
                      className="flex rounded-lg border border-slate-400/20 px-3 py-2"
                    >
                      <div className="flex flex-1 flex-col">
                        <div>{habits![post.habitId]?.name}</div>
                        <div>{post.createdAt.toDateString()}</div>
                      </div>
                      <div>{habits![post.habitId]?.points}</div>
                    </div>
                  ))}
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={handleDialogClose} noBodyStyles>
      <DrawerContent className="bg-gradient-to-b from-[hsl(170,56%,20%)] to-[hsl(180,35%,12%)] dark">
        <DrawerHeader className="text-left">
          <DrawerTitle> Your Logs </DrawerTitle>
          <DrawerDescription></DrawerDescription>
        </DrawerHeader>
        {isLoading && (
          <div className="flex max-h-[50vh] flex-col gap-2 overflow-y-scroll py-2">
            <SkeletonLogPost />
            <SkeletonLogPost />
            <SkeletonLogPost />
          </div>
        )}
        <div className="flex max-h-[50vh] flex-col gap-2 overflow-y-scroll py-2 px-4 text-white">
          {!isLoadingHabits &&
            posts?.map((post) => (
              <div
                key={post.id}
                className="flex rounded-lg border border-slate-400/20 px-3 py-2"
              >
                <div className="flex flex-1 flex-col">
                  <div>{habits![post.habitId]?.name}</div>
                  <div>{post.createdAt.toDateString()}</div>
                </div>
                <div>{habits![post.habitId]?.points}</div>
              </div>
            ))}
        </div>
        <DrawerFooter className="pt-2 flex-row justify-center">
          <DrawerClose asChild>
            <Button className="bg-white/5 opacity-80 text-white">Close</Button>
          </DrawerClose>
          <Button onClick={handleFullScreen} className="bg-white/5 opacity-80 text-white">Full Screen</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
export default Page;
