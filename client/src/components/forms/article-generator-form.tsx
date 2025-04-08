import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useGenerateArticle, useCreateContentItem, useBrandVoices } from '@/hooks/use-content';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Save } from 'lucide-react';
import { BrandVoice } from '@shared/schema';

// Define interfaces for API responses
interface ArticleResponse {
  content: string;
  metaDescription: string;
}

// Zod schema for string values from the form
const formSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  keywords: z.string().min(3, { message: "Keywords are required" }),
  type: z.string().min(1, { message: "Content type is required" }),
  tone: z.string().min(1, { message: "Tone is required" }),
  wordCount: z.string(), // Keep as string in the form, we'll convert as needed for API
});

type ArticleFormData = z.infer<typeof formSchema>;

export function ArticleGeneratorForm() {
  const [generatedContent, setGeneratedContent] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const { toast } = useToast();
  
  const generateArticle = useGenerateArticle();
  const createContentItem = useCreateContentItem();
  const { data: brandVoicesData = [] } = useBrandVoices();
  const brandVoices = brandVoicesData as BrandVoice[];
  
  const form = useForm<ArticleFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      keywords: '',
      type: 'Blog Post',
      tone: 'professional',
      wordCount: '800', // This is a string initially that gets transformed to number via zod
    },
  });
  
  const onSubmit = async (data: ArticleFormData) => {
    try {
      setGeneratedContent('');
      setMetaDescription('');
      
      const keywords = data.keywords.split(',').map(k => k.trim());
      
      // Convert wordCount to number for API call
      const wordCount = parseInt(data.wordCount);
      
      // Make API call through the mutation hook
      const response = await generateArticle.mutateAsync({
        title: data.title,
        keywords,
        tone: data.tone,
        wordCount,
      });
      
      // Parse response assuming it's JSON with our expected structure
      const responseData = response as unknown as ArticleResponse;
      
      // Set the content and meta description from parsed response
      setGeneratedContent(responseData.content || '');
      setMetaDescription(responseData.metaDescription || '');
      
      toast({
        title: "Article generated",
        description: "Your article has been generated successfully.",
      });
    } catch (error: any) {
      console.error("Article generation error:", error);
      
      // Provide more specific error messages
      let errorMessage = "Failed to generate article. Please try again.";
      
      if (error?.message?.includes("quota") || error?.message?.includes("rate limit")) {
        errorMessage = "OpenAI API quota exceeded. Please check your API key or try again later.";
      } else if (error?.message?.includes("API")) {
        errorMessage = "API service issue. Please try again later.";
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };
  
  const saveArticle = async () => {
    try {
      if (!generatedContent) {
        throw new Error("No content to save");
      }
      
      const formData = form.getValues();
      const keywords = formData.keywords.split(',').map(k => k.trim());
      
      await createContentItem.mutateAsync({
        title: formData.title,
        type: formData.type,
        content: generatedContent,
        keywords,
        metaDescription,
        score: 85, // Default score
      });
      
      toast({
        title: "Article saved",
        description: "Your article has been saved successfully.",
      });
      
      // Reset form and generated content
      form.reset();
      setGeneratedContent('');
      setMetaDescription('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save article. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Generate Article</CardTitle>
          <CardDescription>
            Create a SEO-optimized article with AI assistance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Article Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 10 Effective SEO Strategies for 2023" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter a descriptive title for your article
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="keywords"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Keywords</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. SEO, digital marketing, strategy" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter keywords separated by commas
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content Type</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select content type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Blog Post">Blog Post</SelectItem>
                          <SelectItem value="Article">Article</SelectItem>
                          <SelectItem value="Guide">Guide</SelectItem>
                          <SelectItem value="Tutorial">Tutorial</SelectItem>
                          <SelectItem value="Review">Review</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="tone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tone</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select content tone" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="professional">Professional</SelectItem>
                          <SelectItem value="casual">Casual</SelectItem>
                          <SelectItem value="formal">Formal</SelectItem>
                          <SelectItem value="friendly">Friendly</SelectItem>
                          <SelectItem value="authoritative">Authoritative</SelectItem>
                          {(brandVoices || []).map((voice) => (
                            <SelectItem key={voice.id} value={`brand_${voice.id}`}>
                              {voice.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="wordCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Word Count</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select word count" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="500">Short (~500 words)</SelectItem>
                          <SelectItem value="800">Medium (~800 words)</SelectItem>
                          <SelectItem value="1200">Long (~1200 words)</SelectItem>
                          <SelectItem value="1500">Comprehensive (~1500 words)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <Button
                type="submit"
                className="w-full"
                disabled={generateArticle.isPending}
              >
                {generateArticle.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Article...
                  </>
                ) : (
                  'Generate Article'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {generatedContent && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>{form.getValues().title}</CardTitle>
            <CardDescription>
              {metaDescription}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              {generatedContent.split('\n').map((paragraph, idx) => {
                // Handle headings
                if (paragraph.startsWith('# ')) {
                  return <h1 key={idx} className="text-2xl font-bold mt-4 mb-2">{paragraph.replace('# ', '')}</h1>;
                }
                if (paragraph.startsWith('## ')) {
                  return <h2 key={idx} className="text-xl font-bold mt-4 mb-2">{paragraph.replace('## ', '')}</h2>;
                }
                if (paragraph.startsWith('### ')) {
                  return <h3 key={idx} className="text-lg font-bold mt-3 mb-2">{paragraph.replace('### ', '')}</h3>;
                }
                
                // Handle lists
                if (paragraph.startsWith('- ')) {
                  return <li key={idx} className="ml-6">{paragraph.replace('- ', '')}</li>;
                }
                
                // Handle normal paragraphs with empty line check
                if (paragraph.trim() === '') {
                  return <br key={idx} />;
                }
                
                return <p key={idx} className="mb-4">{paragraph}</p>;
              })}
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={saveArticle}
              className="w-full"
              disabled={createContentItem.isPending}
            >
              {createContentItem.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving Article...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Article
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
