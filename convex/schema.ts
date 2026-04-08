import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,
  videos: defineTable({
    userId: v.id("users"),
    prompt: v.string(),
    title: v.string(),
    status: v.union(v.literal("generating"), v.literal("completed"), v.literal("failed")),
    videoData: v.optional(v.string()), // base64 video data
    thumbnailData: v.optional(v.string()), // base64 thumbnail image
    aspectRatio: v.union(v.literal("16:9"), v.literal("9:16")),
    createdAt: v.number(),
    completedAt: v.optional(v.number()),
    errorMessage: v.optional(v.string()),
  }).index("by_user", ["userId"]).index("by_user_and_status", ["userId", "status"]),
});
