import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useGenerateIdeas, useCreateContentIdea } from '@/hooks/use-content';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Check, Plus } from 'lucide-react';

const formSchema = z.object({
  niche: z.string().min(2, { message: "Niche must be at least 2 characters" }),
  count: z.string().transform(val => parseInt(val)),
});

type IdeaFormData = z.infer<typeof formSchema>;

export function IdeaGeneratorForm() {
  const [ideas, setIdeas] = useState<any[]>([]);
  const [selectedIdeas, setSelectedIdeas] = useState<Set<number>>(new Set());
  const { toast } = useToast();
  
  const generateIdeas = useGenerateIdeas();
  const createContentIdea = useCreateContentIdea();
  
  const form = useForm<IdeaFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      niche: '',
      count: '5',
    },
  });
  
  const onSubmit = async (data: IdeaFormData) => {
    try {
      setIdeas([]);
      const response = await generateIdeas.mutateAsync({
        niche: data.niche,
        count: data.count,
      });
      
      const responseJson = await response.json();
      setIdeas(responseJson.ideas || []);
      
      toast({
        title: "Ideas generated",
        description: `${responseJson.ideas?.length || 0} content ideas have been generated for your niche.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate content ideas. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const toggleIdeaSelection = (index: number) => {
    const newSelected = new Set(selectedIdeas);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedIdeas(newSelected);
  };
  
  const saveSelectedIdeas = async () => {
    try {
      const savedIdeas = [];
      for (const index of selectedIdeas) {
        const idea = ideas[index];
        const savedIdea = await createContentIdea.mutateAsync({
          title: idea.title,
          description: idea.description,
          niche: form.getValues().niche,
          keywords: idea.keywords,
        });
        savedIdeas.push(savedIdea);
      }
      
      toast({
        title: "Ideas saved",
        description: `${savedIdeas.length} content ideas have been saved to your library.`,
      });
      
      setSelectedIdeas(new Set());
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save content ideas. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Generate Content Ideas</CardTitle>
          <CardDescription>
            Enter your niche to get AI-powered content ideas with high ranking potential
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="niche"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Niche/Topic</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Digital Marketing, Fitness, Web Development" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter a niche or topic for which you want content ideas
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="count"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Ideas</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select how many ideas to generate" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="3">3 Ideas</SelectItem>
                        <SelectItem value="5">5 Ideas</SelectItem>
                        <SelectItem value="10">10 Ideas</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button
                type="submit"
                className="w-full"
                disabled={generateIdeas.isPending}
              >
                {generateIdeas.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Ideas...
                  </>
                ) : (
                  'Generate Ideas'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {ideas.length > 0 && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Generated Content Ideas</CardTitle>
            <CardDescription>
              Select the ideas you want to save to your content idea library
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ideas.map((idea, index) => (
                <div 
                  key={index}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedIdeas.has(index) 
                      ? 'border-primary-500 bg-primary-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => toggleIdeaSelection(index)}
                >
                  <div className="flex items-start justify-between">
                    <h3 className="text-base font-medium">{idea.title}</h3>
                    <div className={`h-5 w-5 rounded-full border ${
                      selectedIdeas.has(index) 
                        ? 'bg-primary-500 border-primary-500 flex items-center justify-center' 
                        : 'border-gray-300'
                    }`}>
                      {selectedIdeas.has(index) && <Check className="h-3 w-3 text-white" />}
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">{idea.description}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {idea.keywords.map((keyword: string, kidx: number) => (
                      <span 
                        key={kidx}
                        className="text-xs bg-gray-100 text-gray-800 rounded-full px-2 py-0.5"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={saveSelectedIdeas}
              className="w-full"
              disabled={selectedIdeas.size === 0 || createContentIdea.isPending}
            >
              {createContentIdea.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving Ideas...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Save {selectedIdeas.size} Selected Idea{selectedIdeas.size !== 1 ? 's' : ''}
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
