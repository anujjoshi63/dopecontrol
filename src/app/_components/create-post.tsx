"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { MagicMotion } from "react-magic-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function CreatePost() {
  const router = useRouter();
  const [activities, setActivities] = useState("");
  const utils = api.useUtils();
  const { toast } = useToast();

  const createPost = api.post.createFromAIInput.useMutation({
    onSuccess: async () => {
      await Promise.all([
        utils.post.getLatest.invalidate(),
        utils.post.getPoints.invalidate(),
      ]);
      router.refresh();
      setActivities("");
      toast({
        title: "Activities logged",
        description: "Your activities have been processed and logged.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createPost.mutate({ activities });
  };

  return (
    <MagicMotion>
      <Card className="border-white/10 bg-white/5 shadow-lg backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="tracking-tighter text-white/90">
            Log Your Activities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              value={activities}
              onChange={(e) => setActivities(e.target.value)}
              placeholder="What have you been up to? Describe your activities..."
              className="border-white/20 bg-white/10 text-white placeholder:text-white/50"
              rows={4}
              maxLength={500}
            />
            <Button
              type="submit"
              className="w-full bg-white/10 text-white hover:bg-white/20"
              disabled={createPost.isPending || !activities.trim()}
            >
              {createPost.isPending ? "Processing..." : "Submit Activities"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </MagicMotion>
  );
}
