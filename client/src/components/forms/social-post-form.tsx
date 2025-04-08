import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useGenerateSocialPost, useCreateSocialPost, useContentItems } from '@/hooks/use-content';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Save } from 'lucide-react';
import { ContentItem } from '@shared/schema';

const formSchema = z.object({
  contentSource: z.string().min(10, { message: "Content source is required" }),
  contentItemId: z.string().optional(),
  platform: z.string().min(1, { message: "Platform is required" }),
  tone: z.string().min(1, { message: "Tone is required" }),
  postType: z.string().min(1, { message: "Post type is required" }),
});

type SocialPostFormData = z.infer<typeof formSchema>;

export function SocialPostForm() {
  const [generatedPost, setGeneratedPost] = useState('');
  const { toast } = useToast();
  
  const generateSocialPost = useGenerateSocialPost();
  const createSocialPost = useCreateSocialPost();
  const { data: contentItemsData = [] } = useContentItems();
  const contentItems = contentItemsData as ContentItem[];
  
  const form = useForm<SocialPostFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contentSource: '',
      contentItemId: 'custom',
      platform: 'LinkedIn',
      tone: 'professional',
      postType: 'promotion',
    },
  });
  
  const onSubmit = async (data: SocialPostFormData) => {
    try {
      setGeneratedPost('');
      
      const response = await generateSocialPost.mutateAsync({
        contentSource: data.contentSource,
        platform: data.platform,
        tone: data.tone,
        postType: data.postType,
      });
      
      const responseJson = await response.json();
      setGeneratedPost(responseJson.content || '');
      
      toast({
        title: "Social post generated",
        description: `Your ${data.platform} post has been generated successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate social post. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const saveSocialPost = async () => {
    try {
      if (!generatedPost) {
        throw new Error("No post to save");
      }
      
      const formData = form.getValues();
      
      await createSocialPost.mutateAsync({
        platform: formData.platform,
        content: generatedPost,
        tone: formData.tone,
        type: formData.postType,
        contentItemId: formData.contentItemId ? parseInt(formData.contentItemId) : undefined,
      });
      
      toast({
        title: "Social post saved",
        description: "Your social post has been saved successfully.",
      });
      
      // Reset generated post but keep form settings
      setGeneratedPost('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save social post. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const onContentItemChange = (value: string) => {
    form.setValue('contentItemId', value);
    
    if (value && value !== 'custom') {
      const selectedItem = contentItems.find((item) => item.id.toString() === value);
      if (selectedItem) {
        form.setValue('contentSource', selectedItem.title + '\n\n' + selectedItem.metaDescription);
      }
    } else if (value === 'custom') {
      // Clear content source when selecting custom option
      form.setValue('contentSource', '');
    }
  };
  
  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Generate Social Media Post</CardTitle>
          <CardDescription>
            Create engaging social media posts based on your content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="contentItemId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content Source (Optional)</FormLabel>
                    <Select 
                      onValueChange={onContentItemChange} 
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select existing content" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="custom">Write custom content</SelectItem>
                        {contentItems.map((item) => (
                          <SelectItem key={item.id} value={item.id.toString()}>
                            {item.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      You can choose from your existing content or write custom source text
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="contentSource"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content Source</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter the text about which you want to create a social post" 
                        rows={5}
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      This can be a summary, article excerpt, or key points you want to highlight
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="platform"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Platform</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select platform" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                          <SelectItem value="Facebook">Facebook</SelectItem>
                          <SelectItem value="Twitter">Twitter</SelectItem>
                          <SelectItem value="Instagram">Instagram</SelectItem>
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
                            <SelectValue placeholder="Select tone" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="professional">Professional</SelectItem>
                          <SelectItem value="casual">Casual</SelectItem>
                          <SelectItem value="friendly">Friendly</SelectItem>
                          <SelectItem value="excited">Excited</SelectItem>
                          <SelectItem value="authoritative">Authoritative</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="postType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Post Type</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select post type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="promotion">Promotion</SelectItem>
                          <SelectItem value="question">Question</SelectItem>
                          <SelectItem value="tip">Quick Tip</SelectItem>
                          <SelectItem value="announcement">Announcement</SelectItem>
                          <SelectItem value="story">Story</SelectItem>
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
                disabled={generateSocialPost.isPending}
              >
                {generateSocialPost.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Post...
                  </>
                ) : (
                  'Generate Social Post'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {generatedPost && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>{form.getValues().platform} Post</CardTitle>
            <CardDescription>
              Generated {form.getValues().postType} post with {form.getValues().tone} tone
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-gray-50 rounded-md">
              <p className="whitespace-pre-line">{generatedPost}</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={saveSocialPost}
              className="w-full"
              disabled={createSocialPost.isPending}
            >
              {createSocialPost.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving Post...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Post
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
