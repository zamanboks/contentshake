import { apiRequest } from "./queryClient";

/**
 * Helper function to handle API errors with better error messages
 */
async function handleApiResponse(response: Response) {
  try {
    const data = await response.json();
    return data;
  } catch (error: any) {
    if (response.status === 429) {
      throw new Error("API rate limit exceeded. Please check your OpenAI API quota and billing details.");
    } else if (response.status === 500) {
      throw new Error("The AI service is currently unavailable. Please try again later.");
    } else {
      throw new Error(`Error: ${error?.message || "Unknown error occurred"}`);
    }
  }
}

export async function generateContentIdeas(niche: string, count: number = 5) {
  try {
    const response = await apiRequest(
      "POST",
      "/api/ai/generate-ideas",
      { niche, count }
    );
    return await handleApiResponse(response);
  } catch (error) {
    console.error("Failed to generate content ideas:", error);
    throw error;
  }
}

export async function generateArticle(
  title: string,
  keywords: string[],
  tone: string = "professional",
  wordCount: number = 800
) {
  try {
    const response = await apiRequest(
      "POST",
      "/api/ai/generate-article",
      { title, keywords, tone, wordCount }
    );
    return await handleApiResponse(response);
  } catch (error) {
    console.error("Failed to generate article:", error);
    throw error;
  }
}

export async function optimizeContent(
  content: string,
  keywords: string[],
  contentType: string = "article"
) {
  try {
    const response = await apiRequest(
      "POST",
      "/api/ai/optimize-content",
      { content, keywords, contentType }
    );
    return await handleApiResponse(response);
  } catch (error) {
    console.error("Failed to optimize content:", error);
    throw error;
  }
}

export async function createBrandVoice(
  description: string,
  examples: string[],
  targetAudience: string
) {
  try {
    const response = await apiRequest(
      "POST",
      "/api/ai/create-brand-voice",
      { description, examples, targetAudience }
    );
    return await handleApiResponse(response);
  } catch (error) {
    console.error("Failed to create brand voice:", error);
    throw error;
  }
}

export async function generateSocialPost(
  contentSource: string,
  platform: string,
  tone: string,
  postType: string = "promotion"
) {
  try {
    const response = await apiRequest(
      "POST",
      "/api/ai/generate-social-post",
      { contentSource, platform, tone, postType }
    );
    return await handleApiResponse(response);
  } catch (error) {
    console.error("Failed to generate social post:", error);
    throw error;
  }
}
