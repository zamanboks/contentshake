import React from 'react';
import { Link, useRoute } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { ArticleGeneratorForm } from '@/components/forms/article-generator-form';
import { useContentItems } from '@/hooks/use-content';
import { ContentEditor } from '@/components/content/content-editor';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export default function ContentWriting() {
  const [match, params] = useRoute("/content-writing/:id/edit");
  const itemId = match ? parseInt(params.id) : undefined;
  
  const { data: contentItems = [], isLoading } = useContentItems();
  
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
            <h1 className="text-2xl font-semibold text-gray-900">Content Writing</h1>
            <p className="mt-1 text-sm text-gray-500">Generate and edit your content</p>
          </div>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <Button asChild variant="outline">
            <Link href="/optimization">
              Optimize Content
            </Link>
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-8">
        <Tabs defaultValue={itemId ? "edit" : "create"}>
          <TabsList className="mb-4">
            <TabsTrigger value="create">Create New Content</TabsTrigger>
            <TabsTrigger value="edit" disabled={!itemId}>Edit Content</TabsTrigger>
          </TabsList>
          
          <TabsContent value="create">
            <ArticleGeneratorForm />
          </TabsContent>
          
          <TabsContent value="edit">
            {itemId ? (
              <ContentEditor itemId={itemId} />
            ) : (
              <div className="text-center py-10 bg-gray-50 rounded-lg">
                <p className="text-gray-500">Select a content item to edit from the dashboard or create new content.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        {!itemId && contentItems.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-medium mb-4">Recent Content</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {contentItems.slice(0, 6).map(item => (
                <div key={item.id} className="border rounded-lg p-4 hover:border-primary-300 transition-colors">
                  <h3 className="font-medium truncate">{item.title}</h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {item.metaDescription || 'No description available.'}
                  </p>
                  <div className="mt-3 flex justify-between items-center">
                    <span className="text-xs text-gray-400">{item.type}</span>
                    <Button size="sm" variant="ghost" asChild>
                      <Link href={`/content-writing/${item.id}/edit`}>
                        Edit
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
