import React, { useState, useEffect } from 'react';
import { useContentItem, useUpdateContentItem } from '@/hooks/use-content';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save } from 'lucide-react';
import { scoreContent } from '@/lib/content-scoring';

interface ContentEditorProps {
  itemId: number;
}

export function ContentEditor({ itemId }: ContentEditorProps) {
  const { data: contentItem, isLoading: isLoadingItem } = useContentItem(itemId);
  const updateContentItem = useUpdateContentItem();
  const { toast } = useToast();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState('');
  const [keywordsString, setKeywordsString] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [score, setScore] = useState(0);
  
  // Initialize form with content item data
  useEffect(() => {
    if (contentItem) {
      setTitle(contentItem.title || '');
      setContent(contentItem.content || '');
      setType(contentItem.type || 'Blog Post');
      setKeywordsString(contentItem.keywords?.join(', ') || '');
      setMetaDescription(contentItem.metaDescription || '');
      setScore(contentItem.score || 0);
    }
  }, [contentItem]);
  
  // Recalculate score when content or keywords change
  useEffect(() => {
    if (content && keywordsString) {
      const keywords = keywordsString.split(',').map(k => k.trim());
      const calculatedScore = scoreContent(content, keywords);
      setScore(calculatedScore);
    }
  }, [content, keywordsString]);
  
  const handleSave = async () => {
    try {
      const keywords = keywordsString.split(',').map(k => k.trim());
      
      await updateContentItem.mutateAsync({
        id: itemId,
        title,
        content,
        type,
        keywords,
        metaDescription,
        score,
      });
      
      toast({
        title: "Content saved",
        description: "Your content has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save content. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  if (isLoadingItem) {
    return (
      <Card>
        <CardContent className="py-10">
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
          </div>
          <p className="text-center mt-4 text-gray-500">Loading content item...</p>
        </CardContent>
      </Card>
    );
  }
  
  if (!contentItem) {
    return (
      <Card>
        <CardContent className="py-10">
          <p className="text-center text-gray-500">Content item not found.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Content</CardTitle>
        <CardDescription>
          Update your content and SEO parameters
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input 
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Content Type</Label>
              <Select 
                value={type}
                onValueChange={setType}
              >
                <SelectTrigger id="type" className="mt-1">
                  <SelectValue placeholder="Select content type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Blog Post">Blog Post</SelectItem>
                  <SelectItem value="Article">Article</SelectItem>
                  <SelectItem value="Guide">Guide</SelectItem>
                  <SelectItem value="Tutorial">Tutorial</SelectItem>
                  <SelectItem value="Review">Review</SelectItem>
                  <SelectItem value="Template">Template</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="score">Content Score</Label>
              <div className="mt-2 flex items-center">
                <div className="h-4 rounded-full bg-gray-200 w-full">
                  <div 
                    className={`h-4 rounded-full ${
                      score >= 90 ? 'bg-green-500' : 
                      score >= 70 ? 'bg-yellow-500' : 
                      score >= 50 ? 'bg-orange-500' : 
                      'bg-red-500'
                    }`} 
                    style={{ width: `${score}%` }}
                  ></div>
                </div>
                <span className="ml-3 font-medium">{score}/100</span>
              </div>
            </div>
          </div>
          
          <div>
            <Label htmlFor="keywords">Keywords (comma separated)</Label>
            <Input 
              id="keywords"
              value={keywordsString}
              onChange={(e) => setKeywordsString(e.target.value)}
              className="mt-1"
              placeholder="e.g. SEO, content marketing, digital strategy"
            />
          </div>
          
          <div>
            <Label htmlFor="metaDescription">Meta Description</Label>
            <Textarea 
              id="metaDescription"
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              className="mt-1"
              placeholder="Brief description for search engines (max 160 characters)"
              maxLength={160}
            />
            <p className="text-xs text-gray-500 mt-1">
              {metaDescription.length}/160 characters
            </p>
          </div>
          
          <div>
            <Label htmlFor="content">Content</Label>
            <Textarea 
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="mt-1"
              rows={15}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          asChild
        >
          <Link href="/">
            Cancel
          </Link>
        </Button>
        <Button
          onClick={handleSave}
          disabled={updateContentItem.isPending}
        >
          {updateContentItem.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

import { Link } from 'wouter';
