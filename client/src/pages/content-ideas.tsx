import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { IdeaGeneratorForm } from '@/components/forms/idea-generator-form';
import { useContentIdeas, useDeleteContentIdea, useMarkIdeaAsUsed } from '@/hooks/use-content';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Check, Trash2, BookOpen } from 'lucide-react';

export default function ContentIdeas() {
  const { data: contentIdeas = [], isLoading } = useContentIdeas();
  const markIdeaAsUsed = useMarkIdeaAsUsed();
  const deleteContentIdea = useDeleteContentIdea();
  const { toast } = useToast();

  // Filter ideas that are not used yet
  const availableIdeas = contentIdeas.filter(idea => !idea.used);
  const usedIdeas = contentIdeas.filter(idea => idea.used);

  const handleMarkAsUsed = async (id: number) => {
    try {
      await markIdeaAsUsed.mutateAsync(id);
      toast({
        title: "Idea marked as used",
        description: "The idea has been marked as used and moved to your history.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark idea as used.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteContentIdea.mutateAsync(id);
      toast({
        title: "Idea deleted",
        description: "The content idea was deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete content idea.",
        variant: "destructive",
      });
    }
  };

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
            <h1 className="text-2xl font-semibold text-gray-900">Content Ideas</h1>
            <p className="mt-1 text-sm text-gray-500">Generate and manage your content ideas</p>
          </div>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <Button asChild>
            <Link href="/content-writing">
              Create Article from Idea
            </Link>
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <IdeaGeneratorForm />
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Content Ideas ({availableIdeas.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-4">Loading your ideas...</div>
                ) : availableIdeas.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    No saved ideas yet. Generate some ideas to get started!
                  </div>
                ) : (
                  <div className="space-y-4">
                    {availableIdeas.map(idea => (
                      <div key={idea.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium">{idea.title}</h3>
                          <div className="flex space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleMarkAsUsed(idea.id)}
                              title="Mark as Used"
                            >
                              <Check className="h-4 w-4 text-green-500" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleDelete(idea.id)}
                              title="Delete Idea"
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{idea.description}</p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {idea.keywords?.map((keyword, kidx) => (
                            <span 
                              key={kidx}
                              className="text-xs bg-gray-100 text-gray-800 rounded-full px-2 py-0.5"
                            >
                              {keyword}
                            </span>
                          ))}
                        </div>
                        <div className="mt-3 text-xs text-gray-400">
                          Created: {format(new Date(idea.createdAt), 'PPP')}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {usedIdeas.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Used Ideas History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {usedIdeas.map(idea => (
                      <div key={idea.id} className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium text-gray-600">{idea.title}</h3>
                          <div className="flex space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="opacity-70"
                              title="Used Idea"
                            >
                              <BookOpen className="h-4 w-4 text-blue-500" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleDelete(idea.id)}
                              title="Delete Idea"
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{idea.description}</p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {idea.keywords?.map((keyword, kidx) => (
                            <span 
                              key={kidx}
                              className="text-xs bg-gray-100 text-gray-800 rounded-full px-2 py-0.5"
                            >
                              {keyword}
                            </span>
                          ))}
                        </div>
                        <div className="mt-3 text-xs text-gray-400">
                          Created: {format(new Date(idea.createdAt), 'PPP')}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
