"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Sparkles } from "lucide-react";

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
    <Card className="border-white/10 bg-white/5 shadow-lg backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 tracking-tighter text-white/90">
          Log Your Activities{" "}
          <Sparkles className="h-5 w-5 fill-amber-500 stroke-amber-500" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            tabIndex={0}
            value={activities}
            onChange={(e) => setActivities(e.target.value)}
            placeholder="Start typing activities you did so Dope AI can help you track habits and points..."
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
  );
}
