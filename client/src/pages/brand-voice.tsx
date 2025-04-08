import React from 'react';
import { Link, useRoute, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trash2, Edit } from 'lucide-react';
import { BrandVoiceForm } from '@/components/forms/brand-voice-form';
import { BrandVoiceEditor } from '@/components/forms/brand-voice-editor';
import { useBrandVoices, useDeleteBrandVoice } from '@/hooks/use-content';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export default function BrandVoice() {
  const { data: brandVoices = [], isLoading } = useBrandVoices();
  const deleteBrandVoice = useDeleteBrandVoice();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  // Check if we're on an edit route
  const [isEditRoute, params] = useRoute('/brand-voice/:id/edit');
  const brandVoiceId = isEditRoute ? parseInt(params?.id || '0') : 0;

  const handleDelete = async (id: number) => {
    try {
      await deleteBrandVoice.mutateAsync(id);
      toast({
        title: "Brand voice deleted",
        description: "The brand voice was deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete brand voice.",
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
            <h1 className="text-2xl font-semibold text-gray-900">Brand Voice</h1>
            <p className="mt-1 text-sm text-gray-500">Create and manage your brand voices</p>
          </div>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <Button asChild>
            <Link href="/content-writing">
              Use Brand Voice
            </Link>
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-8">
        {isEditRoute ? (
          // Edit mode
          <div className="grid grid-cols-1 gap-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Edit Brand Voice</CardTitle>
              </CardHeader>
              <CardContent>
                <Button variant="outline" size="sm" onClick={() => setLocation('/brand-voice')} className="mb-6">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Brand Voices
                </Button>
                {/* We'll create this component next */}
                {brandVoiceId > 0 && <BrandVoiceEditor id={brandVoiceId} />}
              </CardContent>
            </Card>
          </div>
        ) : (
          // Create mode
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <BrandVoiceForm />
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Your Brand Voices ({brandVoices.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="text-center py-4">Loading your brand voices...</div>
                  ) : brandVoices.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">
                      No brand voices yet. Create your first brand voice to define your unique communication style.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {brandVoices.map(voice => (
                        <div key={voice.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <h3 className="font-medium">{voice.name}</h3>
                            <div className="flex space-x-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                asChild
                              >
                                <Link href={`/brand-voice/${voice.id}/edit`}>
                                  <Edit className="h-4 w-4 text-blue-500" />
                                </Link>
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleDelete(voice.id)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">{voice.description}</p>
                          <div className="mt-2">
                            <span className="text-xs bg-gray-100 text-gray-800 rounded-full px-2 py-0.5">
                              Tone: {voice.tone}
                            </span>
                            <span className="text-xs bg-gray-100 text-gray-800 rounded-full px-2 py-0.5 ml-2">
                              Persona: {voice.persona}
                            </span>
                          </div>
                          {voice.examples && voice.examples.length > 0 && (
                            <div className="mt-3">
                              <p className="text-xs text-gray-600 font-medium">Examples:</p>
                              <ul className="mt-1 text-xs text-gray-500">
                                {voice.examples.slice(0, 2).map((example, idx) => (
                                  <li key={idx} className="italic">"{example}"</li>
                                ))}
                                {voice.examples.length > 2 && (
                                  <li className="text-primary-500">+{voice.examples.length - 2} more examples</li>
                                )}
                              </ul>
                            </div>
                          )}
                          <div className="mt-3 text-xs text-gray-400">
                            Created: {format(new Date(voice.createdAt), 'PPP')}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
