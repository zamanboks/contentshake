import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateBrandVoiceAI, useCreateBrandVoice } from '@/hooks/use-content';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Save } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  examples: z.string().optional(),
  targetAudience: z.string().min(3, { message: "Target audience is required" }),
});

type BrandVoiceFormData = z.infer<typeof formSchema>;

export function BrandVoiceForm() {
  const [voiceDetails, setVoiceDetails] = useState<any>(null);
  const { toast } = useToast();
  
  const createBrandVoiceAI = useCreateBrandVoiceAI();
  const createBrandVoice = useCreateBrandVoice();
  
  const form = useForm<BrandVoiceFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      examples: '',
      targetAudience: '',
    },
  });
  
  const onSubmit = async (data: BrandVoiceFormData) => {
    try {
      setVoiceDetails(null);
      
      const examples = data.examples 
        ? data.examples.split('\n').filter(e => e.trim() !== '') 
        : [];
      
      const response = await createBrandVoiceAI.mutateAsync({
        description: data.description,
        examples,
        targetAudience: data.targetAudience,
      });
      
      const responseJson = await response.json();
      setVoiceDetails(responseJson);
      
      toast({
        title: "Brand voice generated",
        description: "Your brand voice has been analyzed and generated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate brand voice. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const saveBrandVoice = async () => {
    try {
      if (!voiceDetails) {
        throw new Error("No brand voice to save");
      }
      
      const formData = form.getValues();
      const examples = voiceDetails.samplePhrases || [];
      
      await createBrandVoice.mutateAsync({
        name: formData.name,
        description: formData.description,
        tone: voiceDetails.tone,
        persona: formData.targetAudience,
        examples,
      });
      
      toast({
        title: "Brand voice saved",
        description: "Your brand voice has been saved successfully.",
      });
      
      // Reset form and voice details
      form.reset();
      setVoiceDetails(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save brand voice. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Create Brand Voice</CardTitle>
          <CardDescription>
            Define your unique brand voice to make your content more personalized and engaging
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Voice Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Professional Expert, Friendly Guide" {...field} />
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
                      <Textarea 
                        placeholder="Describe how you want your brand to sound, e.g. 'Authoritative but friendly, using simple language to explain complex topics.'" 
                        rows={3}
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Describe the style, tone, and personality of your brand voice
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="examples"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Example Content (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Add examples of your existing content, one per line. This helps the AI understand your current style." 
                        rows={4}
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Provide examples of your existing content to help define your voice
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="targetAudience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Audience</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Marketing Professionals, Small Business Owners" {...field} />
                    </FormControl>
                    <FormDescription>
                      Describe who your content is primarily targeting
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button
                type="submit"
                className="w-full"
                disabled={createBrandVoiceAI.isPending}
              >
                {createBrandVoiceAI.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing Brand Voice...
                  </>
                ) : (
                  'Generate Brand Voice'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {voiceDetails && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>{form.getValues().name}</CardTitle>
            <CardDescription>
              Analyzed brand voice for {form.getValues().targetAudience}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Tone</h3>
                <p className="mt-1">{voiceDetails.tone}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Voice Characteristics</h3>
                <ul className="mt-1 list-disc list-inside space-y-1">
                  {voiceDetails.voiceCharacteristics?.map((char: string, idx: number) => (
                    <li key={idx}>{char}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Sample Phrases</h3>
                <div className="mt-1 p-3 bg-gray-50 rounded-md text-sm">
                  {voiceDetails.samplePhrases?.map((phrase: string, idx: number) => (
                    <p key={idx} className="mb-2">"{phrase}"</p>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={saveBrandVoice}
              className="w-full"
              disabled={createBrandVoice.isPending}
            >
              {createBrandVoice.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving Brand Voice...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Brand Voice
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
