import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { 
  ContentItem, 
  ContentIdea, 
  BrandVoice, 
  SocialPost,
  InsertContentItem,
  InsertContentIdea,
  InsertBrandVoice,
  InsertSocialPost
} from "@shared/schema";

const DEMO_USER_ID = 1; // Using a fixed demo user for simplicity

// Content Items hooks
export function useContentItems() {
  return useQuery({
    queryKey: [`/api/content-items?userId=${DEMO_USER_ID}`],
  });
}

export function useContentItem(id: number) {
  return useQuery({
    queryKey: [`/api/content-items/${id}`],
    enabled: !!id,
  });
}

export function useCreateContentItem() {
  return useMutation({
    mutationFn: (newItem: Omit<InsertContentItem, "userId">) => {
      return apiRequest("POST", "/api/content-items", { 
        ...newItem,
        userId: DEMO_USER_ID 
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/content-items?userId=${DEMO_USER_ID}`] });
    },
  });
}

export function useUpdateContentItem() {
  return useMutation({
    mutationFn: ({ id, ...updates }: { id: number } & Partial<ContentItem>) => {
      return apiRequest("PATCH", `/api/content-items/${id}`, updates);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [`/api/content-items/${variables.id}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/content-items?userId=${DEMO_USER_ID}`] });
    },
  });
}

export function useDeleteContentItem() {
  return useMutation({
    mutationFn: (id: number) => {
      return apiRequest("DELETE", `/api/content-items/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/content-items?userId=${DEMO_USER_ID}`] });
    },
  });
}

// Content Ideas hooks
export function useContentIdeas() {
  return useQuery({
    queryKey: [`/api/content-ideas?userId=${DEMO_USER_ID}`],
  });
}

export function useCreateContentIdea() {
  return useMutation({
    mutationFn: (newIdea: Omit<InsertContentIdea, "userId">) => {
      return apiRequest("POST", "/api/content-ideas", { 
        ...newIdea,
        userId: DEMO_USER_ID 
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/content-ideas?userId=${DEMO_USER_ID}`] });
    },
  });
}

export function useMarkIdeaAsUsed() {
  return useMutation({
    mutationFn: (id: number) => {
      return apiRequest("PATCH", `/api/content-ideas/${id}/use`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/content-ideas?userId=${DEMO_USER_ID}`] });
    },
  });
}

export function useDeleteContentIdea() {
  return useMutation({
    mutationFn: (id: number) => {
      return apiRequest("DELETE", `/api/content-ideas/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/content-ideas?userId=${DEMO_USER_ID}`] });
    },
  });
}

// Brand Voice hooks
export function useBrandVoices() {
  return useQuery({
    queryKey: [`/api/brand-voices?userId=${DEMO_USER_ID}`],
  });
}

export function useBrandVoice(id: number) {
  return useQuery({
    queryKey: [`/api/brand-voices/${id}`],
    enabled: !!id,
  });
}

export function useCreateBrandVoice() {
  return useMutation({
    mutationFn: (newVoice: Omit<InsertBrandVoice, "userId">) => {
      return apiRequest("POST", "/api/brand-voices", { 
        ...newVoice,
        userId: DEMO_USER_ID 
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/brand-voices?userId=${DEMO_USER_ID}`] });
    },
  });
}

export function useUpdateBrandVoice() {
  return useMutation({
    mutationFn: ({ id, ...updates }: { id: number } & Partial<BrandVoice>) => {
      return apiRequest("PATCH", `/api/brand-voices/${id}`, updates);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [`/api/brand-voices?userId=${DEMO_USER_ID}`] });
    },
  });
}

export function useDeleteBrandVoice() {
  return useMutation({
    mutationFn: (id: number) => {
      return apiRequest("DELETE", `/api/brand-voices/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/brand-voices?userId=${DEMO_USER_ID}`] });
    },
  });
}

// Social Post hooks
export function useSocialPosts(contentItemId?: number) {
  const queryKey = contentItemId 
    ? [`/api/social-posts?userId=${DEMO_USER_ID}&contentItemId=${contentItemId}`]
    : [`/api/social-posts?userId=${DEMO_USER_ID}`];
    
  return useQuery({
    queryKey,
  });
}

export function useCreateSocialPost() {
  return useMutation({
    mutationFn: (newPost: Omit<InsertSocialPost, "userId">) => {
      return apiRequest("POST", "/api/social-posts", { 
        ...newPost,
        userId: DEMO_USER_ID 
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [`/api/social-posts?userId=${DEMO_USER_ID}`] });
      if (variables.contentItemId) {
        queryClient.invalidateQueries({ 
          queryKey: [`/api/social-posts?userId=${DEMO_USER_ID}&contentItemId=${variables.contentItemId}`] 
        });
      }
    },
  });
}

export function useUpdateSocialPost() {
  return useMutation({
    mutationFn: ({ id, ...updates }: { id: number } & Partial<SocialPost>) => {
      return apiRequest("PATCH", `/api/social-posts/${id}`, updates);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [`/api/social-posts?userId=${DEMO_USER_ID}`] });
    },
  });
}

export function useDeleteSocialPost() {
  return useMutation({
    mutationFn: (id: number) => {
      return apiRequest("DELETE", `/api/social-posts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/social-posts?userId=${DEMO_USER_ID}`] });
    },
  });
}

// AI Generation hooks
export function useGenerateIdeas() {
  return useMutation({
    mutationFn: ({ niche, count }: { niche: string, count?: number }) => {
      return apiRequest("POST", "/api/ai/generate-ideas", { niche, count });
    },
  });
}

export function useGenerateArticle() {
  return useMutation({
    mutationFn: ({ 
      title, 
      keywords, 
      tone, 
      wordCount 
    }: { 
      title: string, 
      keywords: string[], 
      tone?: string, 
      wordCount?: number 
    }) => {
      return apiRequest("POST", "/api/ai/generate-article", { 
        title, 
        keywords, 
        tone, 
        wordCount 
      });
    },
  });
}

export function useOptimizeContent() {
  return useMutation({
    mutationFn: ({ 
      content, 
      keywords, 
      contentType 
    }: { 
      content: string, 
      keywords: string[], 
      contentType?: string 
    }) => {
      return apiRequest("POST", "/api/ai/optimize-content", { 
        content, 
        keywords, 
        contentType 
      });
    },
  });
}

export function useCreateBrandVoiceAI() {
  return useMutation({
    mutationFn: ({ 
      description, 
      examples, 
      targetAudience 
    }: { 
      description: string, 
      examples?: string[], 
      targetAudience?: string 
    }) => {
      return apiRequest("POST", "/api/ai/create-brand-voice", { 
        description, 
        examples, 
        targetAudience 
      });
    },
  });
}

export function useGenerateSocialPost() {
  return useMutation({
    mutationFn: ({ 
      contentSource, 
      platform, 
      tone, 
      postType 
    }: { 
      contentSource: string, 
      platform: string, 
      tone?: string, 
      postType?: string 
    }) => {
      return apiRequest("POST", "/api/ai/generate-social-post", { 
        contentSource, 
        platform, 
        tone, 
        postType 
      });
    },
  });
}
