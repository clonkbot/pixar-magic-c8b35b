import { query, mutation, action } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { api } from "./_generated/api";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("videos")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const get = query({
  args: { id: v.id("videos") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    const video = await ctx.db.get(args.id);
    if (!video || video.userId !== userId) return null;
    return video;
  },
});

export const create = mutation({
  args: {
    prompt: v.string(),
    title: v.string(),
    aspectRatio: v.union(v.literal("16:9"), v.literal("9:16")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    return await ctx.db.insert("videos", {
      userId,
      prompt: args.prompt,
      title: args.title,
      status: "generating",
      aspectRatio: args.aspectRatio,
      createdAt: Date.now(),
    });
  },
});

export const updateWithVideo = mutation({
  args: {
    id: v.id("videos"),
    videoData: v.string(),
    thumbnailData: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const video = await ctx.db.get(args.id);
    if (!video || video.userId !== userId) throw new Error("Not found");
    await ctx.db.patch(args.id, {
      videoData: args.videoData,
      thumbnailData: args.thumbnailData,
      status: "completed",
      completedAt: Date.now(),
    });
  },
});

export const markFailed = mutation({
  args: { id: v.id("videos"), errorMessage: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const video = await ctx.db.get(args.id);
    if (!video || video.userId !== userId) throw new Error("Not found");
    await ctx.db.patch(args.id, {
      status: "failed",
      errorMessage: args.errorMessage,
      completedAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { id: v.id("videos") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const video = await ctx.db.get(args.id);
    if (!video || video.userId !== userId) throw new Error("Not found");
    await ctx.db.delete(args.id);
  },
});

export const generateVideo = action({
  args: {
    videoId: v.id("videos"),
    prompt: v.string(),
    aspectRatio: v.union(v.literal("16:9"), v.literal("9:16")),
  },
  handler: async (ctx, args) => {
    try {
      // Enhance the prompt for Pixar-style kids content
      const enhancedPrompt = `Create a Pixar-style animated scene for children: ${args.prompt}.
        Style: 3D animation with soft lighting, vibrant colors, cute expressive characters,
        smooth movements, whimsical atmosphere, child-friendly, magical and heartwarming mood.
        The animation should be gentle and suitable for young children.`;

      // Generate the video
      const videoData = await ctx.runAction(api.ai.generateVideo, {
        prompt: enhancedPrompt,
        aspectRatio: args.aspectRatio,
      });

      // Generate a thumbnail image
      const thumbnailPrompt = `Pixar-style 3D animated scene for children: ${args.prompt}.
        Cute characters, vibrant colors, soft lighting, magical atmosphere, child-friendly.`;
      const thumbnailData = await ctx.runAction(api.ai.generateImage, {
        prompt: thumbnailPrompt,
      });

      // Update the video record with the generated content
      await ctx.runMutation(api.videos.updateWithVideo, {
        id: args.videoId,
        videoData,
        thumbnailData: thumbnailData || undefined,
      });
    } catch (error) {
      // Mark the video as failed
      await ctx.runMutation(api.videos.markFailed, {
        id: args.videoId,
        errorMessage: error instanceof Error ? error.message : "Video generation failed",
      });
    }
  },
});
