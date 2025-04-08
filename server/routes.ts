import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertContentIdeaSchema, 
  insertContentItemSchema, 
  insertBrandVoiceSchema, 
  insertSocialPostSchema,
  insertUserSchema
} from "@shared/schema";
import { 
  generateContentIdeas, 
  generateArticle, 
  optimizeContent, 
  createBrandVoice, 
  generateSocialPost 
} from "./utils/openai";
import { setupAuth } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication and session handling
  setupAuth(app);
  // User routes
  app.post("/api/users", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(validatedData);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const user = await storage.getUser(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  });

  // Content Items routes
  app.get("/api/content-items", async (req, res) => {
    const userId = parseInt(req.query.userId as string);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Valid userId is required" });
    }
    const items = await storage.getContentItemsByUserId(userId);
    res.json(items);
  });

  app.get("/api/content-items/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const item = await storage.getContentItem(id);
    if (!item) {
      return res.status(404).json({ message: "Content item not found" });
    }
    res.json(item);
  });

  app.post("/api/content-items", async (req, res) => {
    try {
      const validatedData = insertContentItemSchema.parse(req.body);
      const item = await storage.createContentItem(validatedData);
      res.status(201).json(item);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/content-items/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      const item = await storage.updateContentItem(id, req.body);
      if (!item) {
        return res.status(404).json({ message: "Content item not found" });
      }
      res.json(item);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/content-items/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const success = await storage.deleteContentItem(id);
    if (!success) {
      return res.status(404).json({ message: "Content item not found" });
    }
    res.status(204).send();
  });

  // Content Ideas routes
  app.get("/api/content-ideas", async (req, res) => {
    const userId = parseInt(req.query.userId as string);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Valid userId is required" });
    }
    const ideas = await storage.getContentIdeasByUserId(userId);
    res.json(ideas);
  });

  app.post("/api/content-ideas", async (req, res) => {
    try {
      const validatedData = insertContentIdeaSchema.parse(req.body);
      const idea = await storage.createContentIdea(validatedData);
      res.status(201).json(idea);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/content-ideas/:id/use", async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      const idea = await storage.markIdeaAsUsed(id);
      if (!idea) {
        return res.status(404).json({ message: "Content idea not found" });
      }
      res.json(idea);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/content-ideas/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const success = await storage.deleteContentIdea(id);
    if (!success) {
      return res.status(404).json({ message: "Content idea not found" });
    }
    res.status(204).send();
  });

  // Brand Voice routes
  app.get("/api/brand-voices", async (req, res) => {
    const userId = parseInt(req.query.userId as string);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Valid userId is required" });
    }
    const voices = await storage.getBrandVoicesByUserId(userId);
    res.json(voices);
  });
  
  app.get("/api/brand-voices/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const voice = await storage.getBrandVoice(id);
    if (!voice) {
      return res.status(404).json({ message: "Brand voice not found" });
    }
    res.json(voice);
  });

  app.post("/api/brand-voices", async (req, res) => {
    try {
      const validatedData = insertBrandVoiceSchema.parse(req.body);
      const voice = await storage.createBrandVoice(validatedData);
      res.status(201).json(voice);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/brand-voices/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      const voice = await storage.updateBrandVoice(id, req.body);
      if (!voice) {
        return res.status(404).json({ message: "Brand voice not found" });
      }
      res.json(voice);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/brand-voices/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const success = await storage.deleteBrandVoice(id);
    if (!success) {
      return res.status(404).json({ message: "Brand voice not found" });
    }
    res.status(204).send();
  });

  // Social Posts routes
  app.get("/api/social-posts", async (req, res) => {
    const userId = parseInt(req.query.userId as string);
    const contentItemId = req.query.contentItemId ? parseInt(req.query.contentItemId as string) : undefined;
    
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Valid userId is required" });
    }
    
    let posts;
    if (contentItemId) {
      posts = await storage.getSocialPostsByContentItemId(contentItemId);
    } else {
      posts = await storage.getSocialPostsByUserId(userId);
    }
    
    res.json(posts);
  });

  app.post("/api/social-posts", async (req, res) => {
    try {
      const validatedData = insertSocialPostSchema.parse(req.body);
      const post = await storage.createSocialPost(validatedData);
      res.status(201).json(post);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/social-posts/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      const post = await storage.updateSocialPost(id, req.body);
      if (!post) {
        return res.status(404).json({ message: "Social post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/social-posts/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const success = await storage.deleteSocialPost(id);
    if (!success) {
      return res.status(404).json({ message: "Social post not found" });
    }
    res.status(204).send();
  });

  // AI Generation routes
  app.post("/api/ai/generate-ideas", async (req, res) => {
    try {
      const { niche, count } = req.body;
      if (!niche) {
        return res.status(400).json({ message: "Niche is required" });
      }
      
      const ideas = await generateContentIdeas(niche, count || 5);
      res.json({ ideas });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/ai/generate-article", async (req, res) => {
    try {
      const { title, keywords, tone, wordCount } = req.body;
      if (!title || !keywords) {
        return res.status(400).json({ message: "Title and keywords are required" });
      }
      
      const article = await generateArticle(title, keywords, tone, wordCount);
      res.json(article);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/ai/optimize-content", async (req, res) => {
    try {
      const { content, keywords, contentType } = req.body;
      if (!content || !keywords) {
        return res.status(400).json({ message: "Content and keywords are required" });
      }
      
      const optimized = await optimizeContent(content, keywords, contentType);
      res.json(optimized);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/ai/create-brand-voice", async (req, res) => {
    try {
      const { description, examples, targetAudience } = req.body;
      if (!description) {
        return res.status(400).json({ message: "Description is required" });
      }
      
      const brandVoice = await createBrandVoice(
        description, 
        examples || [], 
        targetAudience || "General audience"
      );
      res.json(brandVoice);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/ai/generate-social-post", async (req, res) => {
    try {
      const { contentSource, platform, tone, postType } = req.body;
      if (!contentSource || !platform) {
        return res.status(400).json({ message: "Content source and platform are required" });
      }
      
      const post = await generateSocialPost(contentSource, platform, tone || "professional", postType);
      res.json({ content: post });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
