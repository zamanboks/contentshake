import React, { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Twitter, Linkedin, Facebook, Instagram } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { SocialPostForm } from '@/components/forms/social-post-form';
import { useSocialPosts, useDeleteSocialPost } from '@/hooks/use-content';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Trash2, ExternalLink } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { SocialPost } from '@shared/schema';

export default function SocialMedia() {
  const { data: socialPosts = [], isLoading } = useSocialPosts();
  const deleteSocialPost = useDeleteSocialPost();
  const { toast } = useToast();

  const handleDelete = async (id: number) => {
    try {
      await deleteSocialPost.mutateAsync(id);
      toast({
        title: "Post deleted",
        description: "The social post was deleted successfully.",
      });
    } catch (error: any) {
      console.error("Error deleting social post:", error);
      
      toast({
        title: "Error",
        description: error?.message || "Failed to delete social post. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Filter posts by platform - cast to SocialPost[] since we know the type
  const posts = socialPosts as SocialPost[];
  const linkedinPosts = posts.filter((post: SocialPost) => post.platform === 'LinkedIn');
  const facebookPosts = posts.filter((post: SocialPost) => post.platform === 'Facebook');
  const twitterPosts = posts.filter((post: SocialPost) => post.platform === 'Twitter');
  const instagramPosts = posts.filter((post: SocialPost) => post.platform === 'Instagram');

  return (
    <div className="py-6">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" asChild className="mr-2">
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Social Media</h1>
            <p className="mt-1 text-sm text-gray-500">Create and manage social media posts</p>
          </div>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <Button asChild>
            <Link href="/content-writing">
              Back to Content
            </Link>
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <SocialPostForm />
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Your Social Posts</CardTitle>
                <CardDescription>Manage your social media content</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-4">Loading your social posts...</div>
                ) : (
                  <Tabs defaultValue="all">
                    <TabsList className="mb-4 w-full">
                      <TabsTrigger value="all">All ({posts.length})</TabsTrigger>
                      <TabsTrigger value="linkedin">LinkedIn ({linkedinPosts.length})</TabsTrigger>
                      <TabsTrigger value="facebook">Facebook ({facebookPosts.length})</TabsTrigger>
                      <TabsTrigger value="twitter">Twitter ({twitterPosts.length})</TabsTrigger>
                      <TabsTrigger value="instagram">Instagram ({instagramPosts.length})</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="all">
                      <SocialPostList posts={posts} onDelete={handleDelete} />
                    </TabsContent>
                    
                    <TabsContent value="linkedin">
                      <SocialPostList posts={linkedinPosts} onDelete={handleDelete} emptyMessage="No LinkedIn posts yet." />
                    </TabsContent>
                    
                    <TabsContent value="facebook">
                      <SocialPostList posts={facebookPosts} onDelete={handleDelete} emptyMessage="No Facebook posts yet." />
                    </TabsContent>
                    
                    <TabsContent value="twitter">
                      <SocialPostList posts={twitterPosts} onDelete={handleDelete} emptyMessage="No Twitter posts yet." />
                    </TabsContent>
                    
                    <TabsContent value="instagram">
                      <SocialPostList posts={instagramPosts} onDelete={handleDelete} emptyMessage="No Instagram posts yet." />
                    </TabsContent>
                  </Tabs>
                )}
              </CardContent>
              <CardFooter className="flex justify-center border-t pt-4">
                <p className="text-sm text-gray-500">Coming soon: Schedule posts and analyze engagement</p>
              </CardFooter>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Connect Social Accounts</CardTitle>
                <CardDescription>Link your social media accounts for direct publishing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Linkedin className="h-5 w-5 text-blue-600" />
                      </div>
                      <span className="ml-3 font-medium">LinkedIn</span>
                    </div>
                    <Button size="sm" variant="outline">Connect</Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Facebook className="h-5 w-5 text-blue-600" />
                      </div>
                      <span className="ml-3 font-medium">Facebook</span>
                    </div>
                    <Button size="sm" variant="outline">Connect</Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Twitter className="h-5 w-5 text-blue-600" />
                      </div>
                      <span className="ml-3 font-medium">Twitter</span>
                    </div>
                    <Button size="sm" variant="outline">Connect</Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center">
                      <div className="bg-pink-100 p-2 rounded-full">
                        <Instagram className="h-5 w-5 text-pink-600" />
                      </div>
                      <span className="ml-3 font-medium">Instagram</span>
                    </div>
                    <Button size="sm" variant="outline">Connect</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

interface SocialPostListProps {
  posts: SocialPost[];
  onDelete: (id: number) => void;
  emptyMessage?: string;
}

function SocialPostList({ posts, onDelete, emptyMessage = "No social posts yet." }: SocialPostListProps) {
  const [deletePostId, setDeletePostId] = useState<number | null>(null);
  const { toast } = useToast();
  
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'LinkedIn':
        return <Linkedin className="h-4 w-4 text-blue-600" />;
      case 'Facebook':
        return <Facebook className="h-4 w-4 text-blue-600" />;
      case 'Twitter':
        return <Twitter className="h-4 w-4 text-blue-500" />;
      case 'Instagram':
        return <Instagram className="h-4 w-4 text-pink-600" />;
      default:
        return null;
    }
  };

  const handleDeleteClick = (id: number) => {
    setDeletePostId(id);
  };
  
  const confirmDelete = async () => {
    if (deletePostId !== null) {
      try {
        await onDelete(deletePostId);
        setDeletePostId(null);
        toast({
          title: "Post deleted",
          description: "Social post has been deleted successfully.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete post. Please try again.",
          variant: "destructive",
        });
      }
    }
  };
  
  const cancelDelete = () => {
    setDeletePostId(null);
  };

  if (posts.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
      {posts.map(post => (
        <div key={post.id} className={`border rounded-lg p-4 ${deletePostId === post.id ? 'border-red-300 bg-red-50' : ''}`}>
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              {getPlatformIcon(post.platform)}
              <span className="ml-2 text-sm font-medium">{post.platform}</span>
              <span className="ml-2 text-xs text-gray-500">{post.type}</span>
            </div>
            <div className="flex space-x-2">
              {deletePostId === post.id ? (
                <>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={confirmDelete}
                  >
                    Confirm
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={cancelDelete}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                  >
                    <ExternalLink className="h-4 w-4 text-gray-500" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleDeleteClick(post.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </>
              )}
            </div>
          </div>
          <p className="mt-2 text-sm whitespace-pre-line">{post.content}</p>
          <div className="mt-3 text-xs text-gray-400">
            Created: {format(new Date(post.createdAt), 'PPP')}
            {post.published && (
              <span className="ml-2 text-green-500">• Published</span>
            )}
            {!post.published && (
              <span className="ml-2 text-yellow-500">• Draft</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
