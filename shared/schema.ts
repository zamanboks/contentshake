import { pgTable, text, serial, integer, boolean, timestamp, json, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Subscription Plan schema
export const subscriptionPlans = pgTable("subscription_plans", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  price: integer("price").notNull(), // in cents
  contentLimit: integer("content_limit").notNull(),
  optimizationLimit: integer("optimization_limit").notNull(),
  socialPostLimit: integer("social_post_limit").notNull(),
  description: text("description"),
  features: text("features").array(),
});

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  displayName: text("display_name"),
  avatar: text("avatar"),
  emailVerified: boolean("email_verified").default(false),
  verificationCode: text("verification_code"),
  verificationCodeExpiresAt: timestamp("verification_code_expires_at"),
  resetToken: text("reset_token"),
  resetTokenExpiresAt: timestamp("reset_token_expires_at"),
  plan: text("plan").default("free"),
  planId: integer("plan_id"),
  planExpiresAt: timestamp("plan_expires_at"),
  contentCreated: integer("content_created").default(0),
  optimizationsUsed: integer("optimizations_used").default(0),
  socialPostsCreated: integer("social_posts_created").default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  displayName: true,
  avatar: true,
  plan: true,
});

export const insertSubscriptionPlanSchema = createInsertSchema(subscriptionPlans).pick({
  name: true,
  price: true,
  contentLimit: true,
  optimizationLimit: true,
  socialPostLimit: true,
  description: true,
  features: true,
});

// Content Item schema
export const contentItems = pgTable("content_items", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  type: text("type").notNull(), // blog, guide, template, etc.
  content: text("content").notNull(),
  score: integer("score"), // SEO score or quality score
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at"),
  published: boolean("published").default(false),
  keywords: text("keywords").array(),
  metaDescription: text("meta_description"),
});

export const insertContentItemSchema = createInsertSchema(contentItems).pick({
  userId: true,
  title: true,
  type: true,
  content: true,
  score: true,
  keywords: true,
  metaDescription: true,
});

// Content Idea schema
export const contentIdeas = pgTable("content_ideas", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  niche: text("niche"),
  keywords: text("keywords").array(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  used: boolean("used").default(false),
});

export const insertContentIdeaSchema = createInsertSchema(contentIdeas).pick({
  userId: true,
  title: true,
  description: true,
  niche: true,
  keywords: true,
});

// Brand Voice schema
export const brandVoices = pgTable("brand_voices", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  tone: text("tone").notNull(), // formal, casual, professional, etc.
  persona: text("persona"), // target audience persona
  examples: text("examples").array(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertBrandVoiceSchema = createInsertSchema(brandVoices).pick({
  userId: true,
  name: true,
  description: true,
  tone: true,
  persona: true,
  examples: true,
});

// Social Media Post schema
export const socialPosts = pgTable("social_posts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  contentItemId: integer("content_item_id"), // Optional reference to a content item
  platform: text("platform").notNull(), // Facebook, LinkedIn, Twitter, Instagram
  content: text("content").notNull(),
  tone: text("tone"), // casual, formal, promotional, etc.
  type: text("type"), // promotion, announcement, etc.
  createdAt: timestamp("created_at").notNull().defaultNow(),
  published: boolean("published").default(false),
});

export const insertSocialPostSchema = createInsertSchema(socialPosts).pick({
  userId: true,
  contentItemId: true,
  platform: true,
  content: true,
  tone: true,
  type: true,
});

// Type definitions
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type ContentItem = typeof contentItems.$inferSelect;
export type InsertContentItem = z.infer<typeof insertContentItemSchema>;

export type ContentIdea = typeof contentIdeas.$inferSelect;
export type InsertContentIdea = z.infer<typeof insertContentIdeaSchema>;

export type BrandVoice = typeof brandVoices.$inferSelect;
export type InsertBrandVoice = z.infer<typeof insertBrandVoiceSchema>;

export type SocialPost = typeof socialPosts.$inferSelect;
export type InsertSocialPost = z.infer<typeof insertSocialPostSchema>;

export type SubscriptionPlan = typeof subscriptionPlans.$inferSelect;
export type InsertSubscriptionPlan = z.infer<typeof insertSubscriptionPlanSchema>;
