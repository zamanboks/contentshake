import OpenAI from "openai";

// The newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || 'your-api-key' });

export async function generateContentIdeas(niche: string, count: number = 5): Promise<Array<{ title: string, description: string, keywords: string[] }>> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a content strategist who specializes in generating engaging, SEO-friendly content ideas."
        },
        {
          role: "user",
          content: `Generate ${count} content ideas for the "${niche}" niche. Each idea should include a title, brief description, and relevant keywords for SEO. Respond with JSON in this format: [{ "title": "title here", "description": "description here", "keywords": ["keyword1", "keyword2", "keyword3"] }]`
        }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content);
    return result.ideas || [];
  } catch (error) {
    console.error("Error generating content ideas:", error);
    throw new Error(`Failed to generate content ideas: ${error}`);
  }
}

export async function generateArticle(
  title: string, 
  keywords: string[], 
  tone: string = "professional",
  wordCount: number = 800
): Promise<{ content: string, metaDescription: string }> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a skilled content writer who creates SEO-optimized articles with a ${tone} tone.`
        },
        {
          role: "user",
          content: `Write an article titled "${title}" optimized for these keywords: ${keywords.join(", ")}. 
          The article should be approximately ${wordCount} words and include appropriate headings, paragraphs, and a conclusion.
          Also provide a meta description of about 160 characters.
          Format your response as JSON: { "content": "full article content", "metaDescription": "meta description here" }`
        }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content);
    return {
      content: result.content,
      metaDescription: result.metaDescription
    };
  } catch (error) {
    console.error("Error generating article:", error);
    throw new Error(`Failed to generate article: ${error}`);
  }
}

export async function optimizeContent(
  content: string, 
  keywords: string[], 
  contentType: string = "article"
): Promise<{ optimizedContent: string, score: number, feedback: string[] }> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an SEO expert who specializes in content optimization."
        },
        {
          role: "user",
          content: `Analyze and optimize this ${contentType} for SEO using these keywords: ${keywords.join(", ")}. 
          Improve readability, keyword usage, and structure while maintaining the original message.
          Score the content from 1-100 based on SEO potential, provide specific feedback, and return the optimized version.
          Format your response as JSON: { "optimizedContent": "optimized content here", "score": number, "feedback": ["feedback point 1", "feedback point 2"] }`
        },
        {
          role: "user",
          content: content
        }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content);
    return {
      optimizedContent: result.optimizedContent,
      score: result.score || 0,
      feedback: result.feedback || []
    };
  } catch (error) {
    console.error("Error optimizing content:", error);
    throw new Error(`Failed to optimize content: ${error}`);
  }
}

export async function createBrandVoice(
  description: string,
  examples: string[],
  targetAudience: string
): Promise<{ tone: string, voiceCharacteristics: string[], samplePhrases: string[] }> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a brand voice strategist who helps companies develop consistent communication styles."
        },
        {
          role: "user",
          content: `Create a brand voice based on this description: "${description}". 
          Examples of existing content: ${examples.join(" | ")}
          Target audience: ${targetAudience}
          
          Analyze these examples and generate a consistent brand voice including the tone, key characteristics, and sample phrases.
          Format your response as JSON: { "tone": "tone name", "voiceCharacteristics": ["characteristic 1", "characteristic 2"], "samplePhrases": ["phrase 1", "phrase 2", "phrase 3"] }`
        }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content);
    return {
      tone: result.tone || "professional",
      voiceCharacteristics: result.voiceCharacteristics || [],
      samplePhrases: result.samplePhrases || []
    };
  } catch (error) {
    console.error("Error creating brand voice:", error);
    throw new Error(`Failed to create brand voice: ${error}`);
  }
}

export async function generateSocialPost(
  contentSource: string,
  platform: string,
  tone: string,
  postType: string = "promotion"
): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a social media expert who creates engaging ${platform} posts.`
        },
        {
          role: "user",
          content: `Create a ${tone} ${postType} post for ${platform} based on this content: 
          
          ${contentSource}
          
          Make it engaging and appropriate for the platform, with the right length and appropriate hashtags if needed.
          Respond with only the post text without any explanations.`
        }
      ]
    });

    return response.choices[0].message.content || "";
  } catch (error) {
    console.error("Error generating social post:", error);
    throw new Error(`Failed to generate social post: ${error}`);
  }
}
