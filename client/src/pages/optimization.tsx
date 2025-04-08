import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, FileCheck, Sparkles, Search, 
  LayoutGrid, BookCopy, ChevronDown, 
  BarChart, FileText, Settings, Newspaper
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useContentItems } from '@/hooks/use-content';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { OptimizationTool } from '@/components/content/optimization-tool';
import { ContentItem } from '@shared/schema';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Optimization() {
  const { data: contentItemsData = [], isLoading } = useContentItems();
  const contentItems = contentItemsData as ContentItem[];
  const [selectedItemId, setSelectedItemId] = useState<string>('');
  const [contentText, setContentText] = useState<string>('');
  const [keywords, setKeywords] = useState<string>('');
  const [contentType, setContentType] = useState<string>('article');
  const [activeTab, setActiveTab] = useState<string>('editor');
  const [mockSerps, setMockSerps] = useState<{title: string, url: string, wordCount: number}[]>([]);
  
  // Generate mock SERP data for demonstration purposes
  useEffect(() => {
    if (keywords) {
      const keywordsList = keywords.split(',').map(k => k.trim());
      const mainKeyword = keywordsList[0] || 'content';
      
      const mockData = [
        {
          title: `The Ultimate Guide to ${mainKeyword.charAt(0).toUpperCase() + mainKeyword.slice(1)}`,
          url: 'https://example.com/ultimate-guide',
          wordCount: 1845
        },
        {
          title: `10 Tips for Better ${mainKeyword.charAt(0).toUpperCase() + mainKeyword.slice(1)} Strategy`,
          url: 'https://contentpros.com/tips',
          wordCount: 1257
        },
        {
          title: `How to Improve Your ${mainKeyword.charAt(0).toUpperCase() + mainKeyword.slice(1)} in 2025`,
          url: 'https://seoguru.com/improve-content',
          wordCount: 2145
        },
        {
          title: `${mainKeyword.charAt(0).toUpperCase() + mainKeyword.slice(1)} Best Practices for Professionals`,
          url: 'https://industry-expert.com/best-practices',
          wordCount: 1652
        },
        {
          title: `Why ${mainKeyword.charAt(0).toUpperCase() + mainKeyword.slice(1)} Matters More Than Ever`,
          url: 'https://trendsetter.io/why-content-matters',
          wordCount: 1423
        }
      ];
      
      setMockSerps(mockData);
    }
  }, [keywords]);
  
  const handleContentItemChange = (value: string) => {
    setSelectedItemId(value);
    
    if (value && value !== 'custom') {
      const selectedItem = contentItems.find((item) => item.id.toString() === value);
      if (selectedItem) {
        setContentText(selectedItem.content);
        setKeywords(selectedItem.keywords?.join(', ') || '');
        setContentType(selectedItem.type.toLowerCase());
      }
    } else if (value === 'custom') {
      // Clear content text and keywords when selecting custom option
      setContentText('');
      setKeywords('');
    }
  };
  
  // Calculate average content length for optimal range based on top results
  const getOptimalWordRange = () => {
    if (mockSerps.length === 0) return { min: 800, max: 1500 };
    
    const wordCounts = mockSerps.map(serp => serp.wordCount);
    const average = Math.round(wordCounts.reduce((a, b) => a + b, 0) / wordCounts.length);
    
    return {
      min: Math.round(average * 0.8),
      max: Math.round(average * 1.2)
    };
  };
  
  const { min: minWords, max: maxWords } = getOptimalWordRange();
  
  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Modern Header with Accent Gradients */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button variant="ghost" size="sm" asChild className="mr-3">
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Dashboard
                </Link>
              </Button>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                ContentShake Optimizer
              </h1>
            </div>
            <div className="flex space-x-3">
              <Button asChild variant="outline" size="sm">
                <Link href="/content-writing">
                  <FileCheck className="mr-2 h-4 w-4" />
                  New Content
                </Link>
              </Button>
              <Button asChild variant="default" size="sm">
                <Link href="/content-ideas">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Get Ideas
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full mb-4 justify-start grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
            <TabsTrigger value="editor" className="flex-1">
              <FileText className="mr-2 h-4 w-4" /> Editor
            </TabsTrigger>
            <TabsTrigger value="serp" className="flex-1">
              <LayoutGrid className="mr-2 h-4 w-4" /> SERP Analysis
            </TabsTrigger>
            <TabsTrigger value="optimization" className="flex-1">
              <BarChart className="mr-2 h-4 w-4" /> Optimization
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex-1">
              <Settings className="mr-2 h-4 w-4" /> Settings
            </TabsTrigger>
          </TabsList>
        
          <TabsContent value="editor" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Editor Panel */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">Document Editor</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Newspaper className="h-4 w-4 mr-1" />
                          Templates
                        </Button>
                      </div>
                    </div>
                    <CardDescription>
                      Create or paste your content to optimize for search engines
                    </CardDescription>
                  </CardHeader>
                <CardContent className="space-y-4">
                  {contentItems.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Load Existing Content
                      </label>
                      <Select
                        value={selectedItemId}
                        onValueChange={handleContentItemChange}
                      >
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Choose content to optimize" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="custom">Paste custom content</SelectItem>
                          {contentItems.map((item: ContentItem) => (
                            <SelectItem key={item.id} value={item.id.toString()}>
                              {item.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Target Keywords <span className="text-xs text-gray-500">(comma separated)</span>
                      </label>
                      <Input
                        value={keywords}
                        onChange={(e) => setKeywords(e.target.value)}
                        placeholder="e.g. SEO, content marketing, optimization"
                        className="bg-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Content Type
                      </label>
                      <Select
                        value={contentType}
                        onValueChange={setContentType}
                      >
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Select content type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="article">Article</SelectItem>
                          <SelectItem value="blog post">Blog Post</SelectItem>
                          <SelectItem value="landing page">Landing Page</SelectItem>
                          <SelectItem value="product description">Product Description</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Content
                      </label>
                      <div className="flex items-center text-xs text-gray-500">
                        <span>Recommended length: {minWords}-{maxWords} words</span>
                      </div>
                    </div>
                    <Textarea
                      value={contentText}
                      onChange={(e) => setContentText(e.target.value)}
                      placeholder="Enter your content here or paste from another document..."
                      rows={18}
                      className="w-full bg-white font-sans resize-none"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex items-center justify-between pt-2 pb-4">
                  <div className="text-sm text-gray-500">
                    {contentText ? 
                      `${contentText.split(/\s+/).filter(Boolean).length} words` : 
                      'No content yet'
                    }
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline">Save Draft</Button>
                    <Button 
                      variant="default" 
                      disabled={!contentText || !keywords}
                      onClick={() => {
                        if (contentText && keywords) {
                          // Set tab to optimization tool display
                          setActiveTab('optimization');
                        }
                      }}
                    >
                      Analyze Content
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </div>
            
            {/* Optimization Tips Panel */}
            <div className="space-y-6">
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Optimization Tips</CardTitle>
                  <CardDescription>
                    Follow these best practices for higher ranking content
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-md bg-blue-50 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <Search className="h-5 w-5 text-blue-400" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800">SERP Analysis</h3>
                        <div className="mt-2 text-sm text-blue-700">
                          <p>Enter your target keywords to analyze the top-ranking content and get personalized recommendations.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Content Best Practices</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <span className="bg-green-100 text-green-800 flex items-center justify-center h-5 w-5 rounded-full text-xs mr-2 mt-0.5 font-bold">✓</span>
                        <span>Include your primary keyword in the first paragraph</span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-green-100 text-green-800 flex items-center justify-center h-5 w-5 rounded-full text-xs mr-2 mt-0.5 font-bold">✓</span>
                        <span>Use H2 and H3 headings to structure your content</span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-green-100 text-green-800 flex items-center justify-center h-5 w-5 rounded-full text-xs mr-2 mt-0.5 font-bold">✓</span>
                        <span>Aim for {minWords}-{maxWords} words based on top results</span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-green-100 text-green-800 flex items-center justify-center h-5 w-5 rounded-full text-xs mr-2 mt-0.5 font-bold">✓</span>
                        <span>Include related terms and synonyms for semantic SEO</span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-green-100 text-green-800 flex items-center justify-center h-5 w-5 rounded-full text-xs mr-2 mt-0.5 font-bold">✓</span>
                        <span>Use bulleted or numbered lists for better readability</span>
                      </li>
                    </ul>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Top Keywords to Include</h3>
                    {keywords ? (
                      <div className="flex flex-wrap gap-1">
                        {keywords.split(',').map((keyword, idx) => (
                          <Badge key={idx} variant="outline" className="bg-blue-50 border-blue-200">
                            {keyword.trim()}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500">Add keywords to see suggestions</p>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {/* Top SERP Results Preview */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">Top SERP Results</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => setActiveTab('serp')}>
                      View All <ChevronDown className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {mockSerps.length > 0 ? (
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {mockSerps.slice(0, 3).map((serp, idx) => (
                        <div key={idx} className="p-3 bg-gray-50 rounded-md">
                          <div className="font-medium text-sm text-blue-600 truncate">{serp.title}</div>
                          <div className="text-xs text-gray-500 truncate">{serp.url}</div>
                          <div className="flex mt-1 text-xs">
                            <Badge variant="outline" className="bg-gray-100 text-gray-600">
                              {serp.wordCount} words
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 py-4 text-center">
                      Enter target keywords to see top ranking content
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="serp" className="mt-0">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Top Ranking Content Analysis</CardTitle>
              <CardDescription>
                Analyze top-performing content for your keywords
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Placeholder for SERP analysis UI */}
              <div className="text-center py-8">
                <p>Full SERP analysis would appear here</p>
                <p className="text-sm text-gray-500 mt-2">This feature would be implemented with real data</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="optimization" className="mt-0">
          {contentText && keywords && (
            <OptimizationTool
              content={contentText}
              keywords={keywords.split(',').map(k => k.trim())}
              contentType={contentType}
              itemId={selectedItemId && selectedItemId !== 'custom' ? parseInt(selectedItemId) : undefined}
            />
          )}
          
          {(!contentText || !keywords) && (
            <Card className="border-0 shadow-sm">
              <CardContent className="py-12 text-center">
                <BookCopy className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Content to Optimize</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Enter your content and target keywords in the Editor tab to get optimization recommendations.
                </p>
                <Button 
                  variant="default" 
                  className="mt-6"
                  onClick={() => setActiveTab('editor')}
                >
                  Go to Editor
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="settings" className="mt-0">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Optimization Settings</CardTitle>
              <CardDescription>
                Customize your content optimization preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Placeholder for optimization settings */}
              <div className="text-center py-8">
                <p>Optimization settings would appear here</p>
                <p className="text-sm text-gray-500 mt-2">This feature would allow fine-tuning of analysis parameters</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
