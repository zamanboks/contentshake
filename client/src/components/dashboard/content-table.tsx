import React from 'react';
import { useContentItems, useDeleteContentItem } from '@/hooks/use-content';
import { format, formatDistanceToNow } from 'date-fns';
import { Link } from 'wouter';
import { Edit, ExternalLink, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getScoreColor, getScoreTextColor } from '@/lib/content-scoring';
import { ContentItem } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';

export function ContentTable() {
  const { data: contentItems = [], isLoading } = useContentItems();
  const deleteContentItem = useDeleteContentItem();
  const { toast } = useToast();

  const handleDelete = async (id: number) => {
    try {
      await deleteContentItem.mutateAsync(id);
      toast({
        title: "Content deleted",
        description: "The content item was deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete content item",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="mt-4 overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
        <div className="p-4 text-center">Loading content items...</div>
      </div>
    );
  }

  if (!contentItems.length) {
    return (
      <div className="mt-4 overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
        <div className="p-6 text-center">
          <p className="text-gray-500">No content items yet. Get started by creating your first piece of content.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Title</th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Type</th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Score</th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {contentItems.map((item: ContentItem) => (
            <tr key={item.id}>
              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{item.title}</td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{item.type}</td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <span className={`${getScoreTextColor(item.score || 0)} font-medium`}>{item.score}</span>
                  <div className="ml-1 w-16 bg-gray-200 rounded-full h-2">
                    <div className={`${getScoreColor(item.score || 0)} h-2 rounded-full`} style={{ width: `${item.score}%` }}></div>
                  </div>
                </div>
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
              </td>
              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                <div className="flex items-center justify-end space-x-2">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/content-writing/${item.id}/edit`}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon">
                    <ExternalLink className="h-4 w-4" />
                    <span className="sr-only">View</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDelete(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
