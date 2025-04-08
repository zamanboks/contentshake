import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useBrandVoice, useUpdateBrandVoice } from '@/hooks/use-content';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Save } from 'lucide-react';
import { useLocation } from 'wouter';
import { BrandVoice } from '@shared/schema';

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  tone: z.string().min(1, { message: "Tone is required" }),
  persona: z.string().min(1, { message: "Persona is required" }),
  examples: z.array(z.string()).optional(),
});

type BrandVoiceFormData = z.infer<typeof formSchema>;

interface BrandVoiceEditorProps {
  id: number;
}

export function BrandVoiceEditor({ id }: BrandVoiceEditorProps) {
  const { data: brandVoice, isLoading } = useBrandVoice(id);
  const updateBrandVoice = useUpdateBrandVoice();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  const form = useForm<BrandVoiceFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      tone: '',
      persona: '',
      examples: [],
    },
  });
  
  // Update form when data loads
  useEffect(() => {
    if (brandVoice) {
      form.reset({
        name: brandVoice.name,
        description: brandVoice.description,
        tone: brandVoice.tone,
        persona: brandVoice.persona,
        examples: brandVoice.examples || [],
      });
    }
  }, [brandVoice, form]);
  
  const onSubmit = async (data: BrandVoiceFormData) => {
    try {
      await updateBrandVoice.mutateAsync({
        id,
        ...data,
      });
      
      toast({
        title: "Brand voice updated",
        description: "Your brand voice has been updated successfully.",
      });
      
      // Redirect back to brand voice list
      setLocation('/brand-voice');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update brand voice. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3">Loading brand voice...</span>
      </div>
    );
  }
  
  if (!brandVoice) {
    return (
      <div className="py-6 text-center">
        <p className="text-red-500">Brand voice not found</p>
        <Button 
          variant="outline" 
          className="mt-4" 
          onClick={() => setLocation('/brand-voice')}
        >
          Back to Brand Voices
        </Button>
      </div>
    );
  }
  
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Voice Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  Give your brand voice a descriptive name
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Voice Description</FormLabel>
                <FormControl>
                  <Textarea rows={3} {...field} />
                </FormControl>
                <FormDescription>
                  Describe the style, tone, and personality of your brand voice
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="tone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tone</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    The overall tone of your brand voice
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="persona"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Persona</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    The persona your brand adopts
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="examples"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Examples</FormLabel>
                <FormControl>
                  <Textarea 
                    rows={5}
                    value={(field.value || []).join('\n')}
                    onChange={(e) => {
                      const examples = e.target.value.split('\n').filter(ex => ex.trim() !== '');
                      field.onChange(examples);
                    }}
                  />
                </FormControl>
                <FormDescription>
                  Example phrases that represent your brand voice (one per line)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setLocation('/brand-voice')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateBrandVoice.isPending}
            >
              {updateBrandVoice.isPending ? (
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
          </div>
        </form>
      </Form>
    </div>
  );
}