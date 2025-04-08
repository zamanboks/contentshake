import {
  users, User, InsertUser,
  contentItems, ContentItem, InsertContentItem,
  contentIdeas, ContentIdea, InsertContentIdea,
  brandVoices, BrandVoice, InsertBrandVoice,
  socialPosts, SocialPost, InsertSocialPost,
  subscriptionPlans, SubscriptionPlan, InsertSubscriptionPlan
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql } from "drizzle-orm";

// Define the storage interface with CRUD operations for all entities
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
  
  // Email verification
  setVerificationCode(userId: number, code: string): Promise<User | undefined>;
  verifyEmail(userId: number, code: string): Promise<boolean>;
  
  // Password reset
  setResetToken(email: string, token: string): Promise<User | undefined>;
  getUserByResetToken(token: string): Promise<User | undefined>;
  resetPassword(token: string, newPassword: string): Promise<boolean>;
  
  // User Usage Tracking
  incrementUserContentCount(userId: number): Promise<User | undefined>;
  incrementUserOptimizationCount(userId: number): Promise<User | undefined>;
  incrementUserSocialPostCount(userId: number): Promise<User | undefined>;
  checkContentLimit(userId: number): Promise<boolean>;
  checkOptimizationLimit(userId: number): Promise<boolean>;
  checkSocialPostLimit(userId: number): Promise<boolean>;
  
  // Subscription Plan operations
  getSubscriptionPlan(id: number): Promise<SubscriptionPlan | undefined>;
  getSubscriptionPlanByName(name: string): Promise<SubscriptionPlan | undefined>;
  getAllSubscriptionPlans(): Promise<SubscriptionPlan[]>;
  createSubscriptionPlan(plan: InsertSubscriptionPlan): Promise<SubscriptionPlan>;
  updateSubscriptionPlan(id: number, updates: Partial<SubscriptionPlan>): Promise<SubscriptionPlan | undefined>;
  deleteSubscriptionPlan(id: number): Promise<boolean>;
  
  // Content Item operations
  getContentItem(id: number): Promise<ContentItem | undefined>;
  getContentItemsByUserId(userId: number): Promise<ContentItem[]>;
  createContentItem(item: InsertContentItem): Promise<ContentItem>;
  updateContentItem(id: number, item: Partial<ContentItem>): Promise<ContentItem | undefined>;
  deleteContentItem(id: number): Promise<boolean>;
  
  // Content Idea operations
  getContentIdea(id: number): Promise<ContentIdea | undefined>;
  getContentIdeasByUserId(userId: number): Promise<ContentIdea[]>;
  createContentIdea(idea: InsertContentIdea): Promise<ContentIdea>;
  markIdeaAsUsed(id: number): Promise<ContentIdea | undefined>;
  deleteContentIdea(id: number): Promise<boolean>;
  
  // Brand Voice operations
  getBrandVoice(id: number): Promise<BrandVoice | undefined>;
  getBrandVoicesByUserId(userId: number): Promise<BrandVoice[]>;
  createBrandVoice(voice: InsertBrandVoice): Promise<BrandVoice>;
  updateBrandVoice(id: number, voice: Partial<BrandVoice>): Promise<BrandVoice | undefined>;
  deleteBrandVoice(id: number): Promise<boolean>;
  
  // Social Post operations
  getSocialPost(id: number): Promise<SocialPost | undefined>;
  getSocialPostsByUserId(userId: number): Promise<SocialPost[]>;
  getSocialPostsByContentItemId(contentItemId: number): Promise<SocialPost[]>;
  createSocialPost(post: InsertSocialPost): Promise<SocialPost>;
  updateSocialPost(id: number, post: Partial<SocialPost>): Promise<SocialPost | undefined>;
  deleteSocialPost(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result.length > 0 ? result[0] : undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result.length > 0 ? result[0] : undefined;
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result.length > 0 ? result[0] : undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    // Initialize usage counters for new users
    const userWithDefaults = {
      ...insertUser,
      contentCreated: 0,
      optimizationsUsed: 0,
      socialPostsCreated: 0,
      plan: insertUser.plan || 'free' // Default to free plan
    };
    
    const result = await db.insert(users).values(userWithDefaults).returning();
    return result[0];
  }
  
  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const result = await db.update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return result.length > 0 ? result[0] : undefined;
  }
  
  // Email verification methods
  async setVerificationCode(userId: number, code: string): Promise<User | undefined> {
    // Set verification code with 10 minute expiration
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);
    
    const result = await db.update(users)
      .set({
        verificationCode: code,
        verificationCodeExpiresAt: expiresAt
      })
      .where(eq(users.id, userId))
      .returning();
    
    return result.length > 0 ? result[0] : undefined;
  }
  
  async verifyEmail(userId: number, code: string): Promise<boolean> {
    // Get user with verification code
    const [user] = await db.select()
      .from(users)
      .where(eq(users.id, userId));
    
    if (!user) return false;
    
    // Check if code matches and hasn't expired
    const now = new Date();
    if (
      user.verificationCode === code &&
      user.verificationCodeExpiresAt &&
      now < new Date(user.verificationCodeExpiresAt)
    ) {
      // Mark email as verified and clear verification code
      await db.update(users)
        .set({
          emailVerified: true,
          verificationCode: null,
          verificationCodeExpiresAt: null
        })
        .where(eq(users.id, userId));
      
      return true;
    }
    
    return false;
  }
  
  // Password reset methods
  async setResetToken(email: string, token: string): Promise<User | undefined> {
    // Find user by email
    const user = await this.getUserByEmail(email);
    if (!user) return undefined;
    
    // Set reset token with 1 hour expiration
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);
    
    const result = await db.update(users)
      .set({
        resetToken: token,
        resetTokenExpiresAt: expiresAt
      })
      .where(eq(users.id, user.id))
      .returning();
    
    return result.length > 0 ? result[0] : undefined;
  }
  
  async getUserByResetToken(token: string): Promise<User | undefined> {
    const result = await db.select()
      .from(users)
      .where(eq(users.resetToken, token));
    
    if (result.length === 0) return undefined;
    
    const user = result[0];
    const now = new Date();
    
    // Check if token has expired
    if (
      user.resetTokenExpiresAt &&
      now < new Date(user.resetTokenExpiresAt)
    ) {
      return user;
    }
    
    // Token has expired
    return undefined;
  }
  
  async resetPassword(token: string, newPassword: string): Promise<boolean> {
    const user = await this.getUserByResetToken(token);
    if (!user) return false;
    
    // Update the password and clear reset token
    const result = await db.update(users)
      .set({
        password: newPassword,
        resetToken: null,
        resetTokenExpiresAt: null
      })
      .where(eq(users.id, user.id))
      .returning();
    
    return result.length > 0;
  }
  
  // User Usage Tracking
  async incrementUserContentCount(userId: number): Promise<User | undefined> {
    const result = await db.update(users)
      .set({
        contentCreated: sql`${users.contentCreated} + 1`
      })
      .where(eq(users.id, userId))
      .returning();
    return result.length > 0 ? result[0] : undefined;
  }
  
  async incrementUserOptimizationCount(userId: number): Promise<User | undefined> {
    const result = await db.update(users)
      .set({
        optimizationsUsed: sql`${users.optimizationsUsed} + 1`
      })
      .where(eq(users.id, userId))
      .returning();
    return result.length > 0 ? result[0] : undefined;
  }
  
  async incrementUserSocialPostCount(userId: number): Promise<User | undefined> {
    const result = await db.update(users)
      .set({
        socialPostsCreated: sql`${users.socialPostsCreated} + 1`
      })
      .where(eq(users.id, userId))
      .returning();
    return result.length > 0 ? result[0] : undefined;
  }
  
  async checkContentLimit(userId: number): Promise<boolean> {
    const user = await this.getUser(userId);
    if (!user) return false;
    
    // Get the user's plan
    let planLimits: SubscriptionPlan | undefined;
    if (user.plan) {
      planLimits = await this.getSubscriptionPlanByName(user.plan);
    }
    
    // Default to free tier limits if no plan found
    const contentLimit = planLimits?.contentLimit || 3;
    const currentUsage = user.contentCreated || 0;
    
    return currentUsage < contentLimit;
  }
  
  async checkOptimizationLimit(userId: number): Promise<boolean> {
    const user = await this.getUser(userId);
    if (!user) return false;
    
    // Get the user's plan
    let planLimits: SubscriptionPlan | undefined;
    if (user.plan) {
      planLimits = await this.getSubscriptionPlanByName(user.plan);
    }
    
    // Default to free tier limits if no plan found
    const optimizationLimit = planLimits?.optimizationLimit || 3;
    const currentUsage = user.optimizationsUsed || 0;
    
    return currentUsage < optimizationLimit;
  }
  
  async checkSocialPostLimit(userId: number): Promise<boolean> {
    const user = await this.getUser(userId);
    if (!user) return false;
    
    // Get the user's plan
    let planLimits: SubscriptionPlan | undefined;
    if (user.plan) {
      planLimits = await this.getSubscriptionPlanByName(user.plan);
    }
    
    // Default to free tier limits if no plan found
    const socialPostLimit = planLimits?.socialPostLimit || 5;
    const currentUsage = user.socialPostsCreated || 0;
    
    return currentUsage < socialPostLimit;
  }
  
  // Subscription Plan methods
  async getSubscriptionPlan(id: number): Promise<SubscriptionPlan | undefined> {
    const result = await db.select().from(subscriptionPlans).where(eq(subscriptionPlans.id, id));
    return result.length > 0 ? result[0] : undefined;
  }
  
  async getSubscriptionPlanByName(name: string): Promise<SubscriptionPlan | undefined> {
    const result = await db.select().from(subscriptionPlans).where(eq(subscriptionPlans.name, name));
    return result.length > 0 ? result[0] : undefined;
  }
  
  async getAllSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    return await db.select().from(subscriptionPlans).orderBy(subscriptionPlans.price);
  }
  
  async createSubscriptionPlan(plan: InsertSubscriptionPlan): Promise<SubscriptionPlan> {
    const result = await db.insert(subscriptionPlans).values(plan).returning();
    return result[0];
  }
  
  async updateSubscriptionPlan(id: number, updates: Partial<SubscriptionPlan>): Promise<SubscriptionPlan | undefined> {
    const result = await db.update(subscriptionPlans)
      .set(updates)
      .where(eq(subscriptionPlans.id, id))
      .returning();
    return result.length > 0 ? result[0] : undefined;
  }
  
  async deleteSubscriptionPlan(id: number): Promise<boolean> {
    const result = await db.delete(subscriptionPlans)
      .where(eq(subscriptionPlans.id, id))
      .returning();
    return result.length > 0;
  }
  
  // Content Item methods
  async getContentItem(id: number): Promise<ContentItem | undefined> {
    const result = await db.select().from(contentItems).where(eq(contentItems.id, id));
    return result.length > 0 ? result[0] : undefined;
  }
  
  async getContentItemsByUserId(userId: number): Promise<ContentItem[]> {
    return await db.select()
      .from(contentItems)
      .where(eq(contentItems.userId, userId))
      .orderBy(desc(contentItems.createdAt));
  }
  
  async createContentItem(item: InsertContentItem): Promise<ContentItem> {
    const now = new Date();
    const result = await db.insert(contentItems).values({
      ...item,
      createdAt: now,
      updatedAt: now,
      published: false
    }).returning();
    return result[0];
  }
  
  async updateContentItem(id: number, updates: Partial<ContentItem>): Promise<ContentItem | undefined> {
    const now = new Date();
    const result = await db.update(contentItems)
      .set({ ...updates, updatedAt: now })
      .where(eq(contentItems.id, id))
      .returning();
    return result.length > 0 ? result[0] : undefined;
  }
  
  async deleteContentItem(id: number): Promise<boolean> {
    const result = await db.delete(contentItems)
      .where(eq(contentItems.id, id))
      .returning();
    return result.length > 0;
  }
  
  // Content Idea methods
  async getContentIdea(id: number): Promise<ContentIdea | undefined> {
    const result = await db.select().from(contentIdeas).where(eq(contentIdeas.id, id));
    return result.length > 0 ? result[0] : undefined;
  }
  
  async getContentIdeasByUserId(userId: number): Promise<ContentIdea[]> {
    return await db.select()
      .from(contentIdeas)
      .where(eq(contentIdeas.userId, userId))
      .orderBy(desc(contentIdeas.createdAt));
  }
  
  async createContentIdea(idea: InsertContentIdea): Promise<ContentIdea> {
    const now = new Date();
    const result = await db.insert(contentIdeas).values({
      ...idea,
      createdAt: now,
      used: false
    }).returning();
    return result[0];
  }
  
  async markIdeaAsUsed(id: number): Promise<ContentIdea | undefined> {
    const result = await db.update(contentIdeas)
      .set({ used: true })
      .where(eq(contentIdeas.id, id))
      .returning();
    return result.length > 0 ? result[0] : undefined;
  }
  
  async deleteContentIdea(id: number): Promise<boolean> {
    const result = await db.delete(contentIdeas)
      .where(eq(contentIdeas.id, id))
      .returning();
    return result.length > 0;
  }
  
  // Brand Voice methods
  async getBrandVoice(id: number): Promise<BrandVoice | undefined> {
    const result = await db.select().from(brandVoices).where(eq(brandVoices.id, id));
    return result.length > 0 ? result[0] : undefined;
  }
  
  async getBrandVoicesByUserId(userId: number): Promise<BrandVoice[]> {
    return await db.select()
      .from(brandVoices)
      .where(eq(brandVoices.userId, userId))
      .orderBy(desc(brandVoices.createdAt));
  }
  
  async createBrandVoice(voice: InsertBrandVoice): Promise<BrandVoice> {
    const now = new Date();
    const result = await db.insert(brandVoices).values({
      ...voice,
      createdAt: now
    }).returning();
    return result[0];
  }
  
  async updateBrandVoice(id: number, updates: Partial<BrandVoice>): Promise<BrandVoice | undefined> {
    const result = await db.update(brandVoices)
      .set(updates)
      .where(eq(brandVoices.id, id))
      .returning();
    return result.length > 0 ? result[0] : undefined;
  }
  
  async deleteBrandVoice(id: number): Promise<boolean> {
    const result = await db.delete(brandVoices)
      .where(eq(brandVoices.id, id))
      .returning();
    return result.length > 0;
  }
  
  // Social Post methods
  async getSocialPost(id: number): Promise<SocialPost | undefined> {
    const result = await db.select().from(socialPosts).where(eq(socialPosts.id, id));
    return result.length > 0 ? result[0] : undefined;
  }
  
  async getSocialPostsByUserId(userId: number): Promise<SocialPost[]> {
    return await db.select()
      .from(socialPosts)
      .where(eq(socialPosts.userId, userId))
      .orderBy(desc(socialPosts.createdAt));
  }
  
  async getSocialPostsByContentItemId(contentItemId: number): Promise<SocialPost[]> {
    return await db.select()
      .from(socialPosts)
      .where(eq(socialPosts.contentItemId, contentItemId))
      .orderBy(desc(socialPosts.createdAt));
  }
  
  async createSocialPost(post: InsertSocialPost): Promise<SocialPost> {
    const now = new Date();
    const result = await db.insert(socialPosts).values({
      ...post,
      createdAt: now,
      published: false
    }).returning();
    return result[0];
  }
  
  async updateSocialPost(id: number, updates: Partial<SocialPost>): Promise<SocialPost | undefined> {
    const result = await db.update(socialPosts)
      .set(updates)
      .where(eq(socialPosts.id, id))
      .returning();
    return result.length > 0 ? result[0] : undefined;
  }
  
  async deleteSocialPost(id: number): Promise<boolean> {
    const result = await db.delete(socialPosts)
      .where(eq(socialPosts.id, id))
      .returning();
    return result.length > 0;
  }
}

// Function to seed initial demo data
async function seedDemoData() {
  try {
    // Check if subscription plans exist
    const existingPlans = await db.select().from(subscriptionPlans);
    if (existingPlans.length === 0) {
      console.log('Seeding subscription plans...');
      
      // Add subscription plans
      await db.insert(subscriptionPlans).values([
        {
          name: 'free',
          price: 0,
          contentLimit: 3,
          optimizationLimit: 3,
          socialPostLimit: 5,
          description: 'Basic plan with limited content generation',
          features: ['3 content generations per month', '3 content optimizations', '5 social media posts']
        },
        {
          name: 'basic',
          price: 1999, // $19.99 in cents
          contentLimit: 10,
          optimizationLimit: 15,
          socialPostLimit: 30,
          description: 'Great for bloggers and small businesses',
          features: ['10 content generations per month', '15 content optimizations', '30 social media posts', 'Basic competitor analysis']
        },
        {
          name: 'premium',
          price: 4999, // $49.99 in cents
          contentLimit: 50,
          optimizationLimit: 100,
          socialPostLimit: 200,
          description: 'Perfect for marketing teams and agencies',
          features: ['Unlimited content generations', 'Unlimited content optimizations', 'Unlimited social media posts', 'Advanced competitor analysis', 'Priority support']
        }
      ]);
      
      console.log('Subscription plans seeded');
    }
    
    // Check if users already exist
    const existingUsers = await db.select().from(users);
    if (existingUsers.length === 0) {
      console.log('Seeding initial demo data...');
      
      // Create demo user
      const [demoUser] = await db.insert(users).values({
        username: 'demo',
        email: 'demo@example.com',
        password: 'password',
        displayName: 'Tom Cook',
        plan: 'premium',
        contentCreated: 1,
        optimizationsUsed: 0,
        socialPostsCreated: 1,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      }).returning();
      
      // Add sample content for demo user
      const [item1] = await db.insert(contentItems).values({
        userId: demoUser.id,
        title: '10 SEO Strategies for 2023',
        type: 'Blog Post',
        content: 'Sample content for SEO strategies article...',
        score: 92,
        keywords: ['SEO', 'digital marketing', 'strategy'],
        metaDescription: 'Learn the top 10 SEO strategies to boost your website ranking in 2023.',
        createdAt: new Date(),
        updatedAt: new Date(),
        published: false
      }).returning();
      
      await db.insert(contentItems).values({
        userId: demoUser.id,
        title: 'Email Marketing Best Practices',
        type: 'Guide',
        content: 'Sample content for email marketing guide...',
        score: 78,
        keywords: ['email marketing', 'newsletter', 'conversion'],
        metaDescription: 'Discover the best practices for effective email marketing campaigns.',
        createdAt: new Date(),
        updatedAt: new Date(),
        published: false
      });
      
      await db.insert(contentItems).values({
        userId: demoUser.id,
        title: 'Social Media Calendar Template',
        type: 'Template',
        content: 'Sample content for social media calendar...',
        score: 95,
        keywords: ['social media', 'content calendar', 'planning'],
        metaDescription: 'Use this template to plan your social media content effectively.',
        createdAt: new Date(),
        updatedAt: new Date(),
        published: false
      });
      
      // Add sample content ideas
      await db.insert(contentIdeas).values({
        userId: demoUser.id,
        title: 'How AI is Transforming Content Marketing',
        description: 'Explore the ways AI tools are changing how marketers create and distribute content.',
        niche: 'Technology',
        keywords: ['AI', 'content marketing', 'technology'],
        createdAt: new Date(),
        used: false
      });
      
      await db.insert(contentIdeas).values({
        userId: demoUser.id,
        title: 'The Ultimate Guide to Video SEO',
        description: 'Techniques to optimize video content for search engines and improve visibility.',
        niche: 'Digital Marketing',
        keywords: ['video SEO', 'YouTube optimization', 'video marketing'],
        createdAt: new Date(),
        used: false
      });
      
      // Add sample brand voice
      await db.insert(brandVoices).values({
        userId: demoUser.id,
        name: 'Professional Expert',
        description: 'Authoritative voice that establishes industry expertise',
        tone: 'professional',
        persona: 'Industry Leaders',
        examples: ['Our research indicates that...', 'Industry best practices suggest...'],
        createdAt: new Date()
      });
      
      // Add sample social posts
      await db.insert(socialPosts).values({
        userId: demoUser.id,
        contentItemId: item1.id,
        platform: 'LinkedIn',
        content: 'Just published: 10 SEO Strategies that are working in 2023. Check out our latest blog post to learn how to boost your website ranking.',
        tone: 'professional',
        type: 'promotion',
        createdAt: new Date(),
        published: false
      });
      
      console.log('Demo data seeded successfully');
    } else {
      console.log('Database already contains data, skipping seed');
    }
  } catch (error) {
    console.error('Error seeding demo data:', error);
  }
}

// Create and export the storage instance
export const storage = new DatabaseStorage();

// Seed demo data
seedDemoData();
