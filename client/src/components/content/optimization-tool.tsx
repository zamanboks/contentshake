import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useOptimizeContent, useUpdateContentItem } from '@/hooks/use-content';
import { useToast } from '@/hooks/use-toast';
import { 
  Loader2, Check, AlertTriangle, FileText, Lightbulb, 
  Share, Type, Search, Edit3, CheckCircle, XCircle, Info
} from 'lucide-react';
import { scoreContent, getScoreColor, getScoreTextColor, getScoringFeedback } from '@/lib/content-scoring';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface OptimizationToolProps {
  content: string;
  keywords: string[];
  contentType: string;
  itemId?: number;
}

interface KeywordAnalysis {
  keyword: string;
  count: number;
  density: number;
  status: 'missing' | 'low' | 'good' | 'high';
  suggestion: string;
}

interface ScoreBreakdown {
  wordCount: { score: number, max: number, description: string };
  keywordUsage: { score: number, max: number, description: string };
  headingStructure: { score: number, max: number, description: string };
  readability: { score: number, max: number, description: string };
}

export function OptimizationTool({ content, keywords, contentType, itemId }: OptimizationToolProps) {
  const [localContent, setLocalContent] = useState(content);
  const [score, setScore] = useState(0);
  const [scoreBreakdown, setScoreBreakdown] = useState<ScoreBreakdown>({
    wordCount: { score: 0, max: 25, description: 'Content length and depth' },
    keywordUsage: { score: 0, max: 25, description: 'Keyword usage and density' },
    headingStructure: { score: 0, max: 25, description: 'Headings structure and hierarchy' },
    readability: { score: 0, max: 25, description: 'Readability and paragraph structure' }
  });
  const [feedback, setFeedback] = useState<string[]>([]);
  const [optimizedContent, setOptimizedContent] = useState('');
  const [aiScore, setAiScore] = useState(0);
  const [aiFeedback, setAiFeedback] = useState<string[]>([]);
  const [keywordAnalysis, setKeywordAnalysis] = useState<KeywordAnalysis[]>([]);
  const [activeTab, setActiveTab] = useState('analysis');
  
  const optimizeContent = useOptimizeContent();
  const updateContentItem = useUpdateContentItem();
  const { toast } = useToast();

  // Function to calculate keyword analysis
  const analyzeKeywords = (text: string, keywordList: string[]) => {
    if (!text || keywordList.length === 0) return [];
    
    const contentLower = text.toLowerCase();
    const wordCount = text.split(/\s+/).length;
    const keywordAnalysis: KeywordAnalysis[] = [];
    
    for (const keyword of keywordList) {
      if (!keyword.trim()) continue;
      
      const keywordLower = keyword.toLowerCase();
      const regex = new RegExp('\\b' + keywordLower + '\\b', 'g');
      const keywordCount = (contentLower.match(regex) || []).length;
      const keywordDensity = keywordCount / wordCount;
      
      let status: 'missing' | 'low' | 'good' | 'high' = 'missing';
      let suggestion = '';
      
      if (keywordCount === 0) {
        status = 'missing';
        suggestion = `Add "${keyword}" to your content at least 1-2 times.`;
      } else if (keywordDensity < 0.005) {
        status = 'low';
        suggestion = `Increase usage of "${keyword}" slightly for better optimization.`;
      } else if (keywordDensity > 0.03) {
        status = 'high';
        suggestion = `Reduce frequency of "${keyword}" to avoid keyword stuffing.`;
      } else {
        status = 'good';
        suggestion = `Excellent usage of "${keyword}".`;
      }
      
      keywordAnalysis.push({
        keyword,
        count: keywordCount,
        density: keywordDensity,
        status,
        suggestion
      });
    }
    
    return keywordAnalysis;
  };
  
  // Function to calculate score breakdown
  const calculateScoreBreakdown = (content: string, keywords: string[], totalScore: number): ScoreBreakdown => {
    if (!content || keywords.length === 0) {
      return {
        wordCount: { score: 0, max: 25, description: 'Content length and depth' },
        keywordUsage: { score: 0, max: 25, description: 'Keyword usage and density' },
        headingStructure: { score: 0, max: 25, description: 'Headings structure and hierarchy' },
        readability: { score: 0, max: 25, description: 'Readability and paragraph structure' }
      };
    }
    
    const wordCount = content.split(/\s+/).length;
    let wordCountScore = 0;
    
    // Word count scoring
    if (wordCount >= 300) {
      wordCountScore += 15;
    } else {
      wordCountScore += (wordCount / 300) * 15;
    }
    
    if (wordCount >= 800 && wordCount <= 1500) {
      wordCountScore += 10;
    } else if (wordCount > 1500) {
      wordCountScore += 7;
    } else {
      wordCountScore += (wordCount / 800) * 10;
    }
    
    // Keyword usage
    let keywordScore = 0;
    const maxKeywordScore = 25;
    const keywordDensityTarget = 0.02;
    
    for (const keyword of keywords) {
      if (!keyword.trim()) continue;
      
      const keywordLower = keyword.toLowerCase();
      const keywordCount = (content.toLowerCase().match(new RegExp('\\b' + keywordLower + '\\b', 'g')) || []).length;
      const keywordDensity = keywordCount / wordCount;
      
      if (keywordCount > 0) {
        if (keywordDensity <= keywordDensityTarget) {
          keywordScore += (maxKeywordScore / keywords.length) * (keywordDensity / keywordDensityTarget);
        } else {
          keywordScore += (maxKeywordScore / keywords.length) * (keywordDensityTarget / keywordDensity);
        }
      }
    }
    
    // Heading structure
    const h1Count = (content.match(/<h1>|<H1>|# /g) || []).length;
    const h2Count = (content.match(/<h2>|<H2>|## /g) || []).length;
    const h3Count = (content.match(/<h3>|<H3>|### /g) || []).length;
    
    let headingScore = 0;
    if (h1Count === 1) headingScore += 10;
    if (h2Count >= 2) headingScore += 10; else headingScore += h2Count * 5;
    if (h3Count >= 2) headingScore += 5; else headingScore += h3Count * 2.5;
    
    // Readability
    const paragraphs = content.split(/\n\n+/);
    const reasonableParagraphCount = paragraphs.filter(p => {
      const words = p.trim().split(/\s+/).length;
      return words > 20 && words < 150;
    }).length;
    
    let readabilityScore = 0;
    if (paragraphs.length > 0) {
      readabilityScore += 20 * (reasonableParagraphCount / paragraphs.length);
    }
    
    const linkCount = (content.match(/<a\s|http/g) || []).length;
    if (linkCount > 0 && linkCount <= 5) {
      readabilityScore += 5;
    } else if (linkCount > 5) {
      readabilityScore += 5 * (5 / linkCount);
    }
    
    // Normalize scores to match the total score
    const rawTotal = wordCountScore + keywordScore + headingScore + readabilityScore;
    const scaleFactor = totalScore / (rawTotal || 1); // Avoid division by zero
    
    return {
      wordCount: { 
        score: Math.round(wordCountScore * scaleFactor), 
        max: 25, 
        description: 'Content length and depth' 
      },
      keywordUsage: { 
        score: Math.round(keywordScore * scaleFactor), 
        max: 25, 
        description: 'Keyword usage and density' 
      },
      headingStructure: { 
        score: Math.round(headingScore * scaleFactor), 
        max: 25, 
        description: 'Headings structure and hierarchy' 
      },
      readability: { 
        score: Math.round(readabilityScore * scaleFactor), 
        max: 25, 
        description: 'Readability and paragraph structure' 
      }
    };
  };
  
  // Highlight keywords in content
  const highlightKeywords = (text: string, keywordList: string[]) => {
    if (!text || keywordList.length === 0) return text;
    
    let highlightedText = text;
    
    keywordList.forEach(keyword => {
      if (!keyword.trim()) return;
      
      const regex = new RegExp(`\\b(${keyword})\\b`, 'gi');
      highlightedText = highlightedText.replace(regex, '<mark>$1</mark>');
    });
    
    return highlightedText;
  };
  
  // Format content for display with highlighted keywords
  const formattedContent = useMemo(() => {
    let processedContent = highlightKeywords(localContent, keywords);
    
    // Handle headings
    processedContent = processedContent.replace(/# (.*?)(\n|$)/g, '<h1>$1</h1>$2');
    processedContent = processedContent.replace(/## (.*?)(\n|$)/g, '<h2>$1</h2>$2');
    processedContent = processedContent.replace(/### (.*?)(\n|$)/g, '<h3>$1</h3>$2');
    
    // Handle lists
    processedContent = processedContent.replace(/- (.*?)(\n|$)/g, '<li>$1</li>$2');
    
    // Handle paragraphs
    processedContent = processedContent.replace(/(?:\r\n|\r|\n){2,}/g, '</p><p>');
    processedContent = `<p>${processedContent}</p>`;
    
    return processedContent;
  }, [localContent, keywords]);
  
  // Calculate score whenever content or keywords change
  useEffect(() => {
    if (localContent && keywords.length > 0) {
      const calculatedScore = scoreContent(localContent, keywords);
      setScore(calculatedScore);
      
      const feedbackItems = getScoringFeedback(calculatedScore, localContent, keywords);
      setFeedback(feedbackItems);
      
      const analysis = analyzeKeywords(localContent, keywords);
      setKeywordAnalysis(analysis);
      
      const breakdown = calculateScoreBreakdown(localContent, keywords, calculatedScore);
      setScoreBreakdown(breakdown);
    }
  }, [localContent, keywords]);
  
  // Update local content when prop content changes
  useEffect(() => {
    setLocalContent(content);
  }, [content]);
  
  const handleOptimize = async () => {
    try {
      setOptimizedContent('');
      setAiScore(0);
      setAiFeedback([]);
      
      const response = await optimizeContent.mutateAsync({
        content: localContent,
        keywords,
        contentType,
      });
      
      // Handle the response
      const responseData = response as unknown as {
        optimizedContent: string;
        score: number;
        feedback: string[];
      };
      
      setOptimizedContent(responseData.optimizedContent);
      setAiScore(responseData.score);
      setAiFeedback(responseData.feedback);
      
      toast({
        title: "Content optimized",
        description: "Your content has been analyzed and optimized.",
      });
      
      // Switch to the optimized tab
      setActiveTab('optimized');
    } catch (error: any) {
      console.error("Content optimization error:", error);
      
      // Provide more specific error messages
      let errorMessage = "Failed to optimize content. Please try again.";
      
      if (error?.message?.includes("quota") || error?.message?.includes("rate limit")) {
        errorMessage = "OpenAI API quota exceeded. Please check your API key or try again later.";
      } else if (error?.message?.includes("API")) {
        errorMessage = "API service issue. Please try again later.";
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };
  
  const applyOptimization = () => {
    if (!optimizedContent) return;
    
    setLocalContent(optimizedContent);
    setActiveTab('editor');
    
    toast({
      title: "Optimization applied",
      description: "The optimized content has been applied to the editor.",
    });
  };
  
  const saveOptimizedContent = async () => {
    if (!itemId) {
      toast({
        title: "Cannot save",
        description: "This content is not linked to a saved item. Please create a new content item first.",
      });
      return;
    }
    
    try {
      // Calculate final score
      const finalScore = optimizedContent && activeTab === 'optimized' ? aiScore : score;
      
      await updateContentItem.mutateAsync({
        id: itemId,
        content: localContent,
        score: finalScore,
      });
      
      toast({
        title: "Content saved",
        description: `Your content has been updated successfully with a score of ${finalScore}/100.`,
      });
    } catch (error: any) {
      console.error("Error saving optimized content:", error);
      
      toast({
        title: "Error",
        description: error?.message || "Failed to save content. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const getKeywordStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-100 text-green-800 border-green-300';
      case 'low': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'missing': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };
  
  const getKeywordStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'low': return <Info className="h-4 w-4 text-yellow-500" />;
      case 'high': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'missing': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return null;
    }
  };
  
  const getFeedbackCategory = (feedback: string): 'critical' | 'important' | 'suggestion' => {
    if (feedback.includes('too short') || 
        feedback.includes('not found') || 
        feedback.includes('Missing main heading')) {
      return 'critical';
    } else if (feedback.includes('appears too frequently') || 
               feedback.includes('Too many main headings') ||
               feedback.includes('too long')) {
      return 'important';
    } else {
      return 'suggestion';
    }
  };
  
  const getFeedbackIcon = (category: 'critical' | 'important' | 'suggestion') => {
    switch (category) {
      case 'critical': return <XCircle className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />;
      case 'important': return <AlertTriangle className="h-4 w-4 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />;
      case 'suggestion': return <Info className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />;
      default: return null;
    }
  };
  
  // Format optimized content for display
  const formattedOptimizedContent = useMemo(() => {
    if (!optimizedContent) return '';
    
    let processedContent = highlightKeywords(optimizedContent, keywords);
    
    // Handle headings
    processedContent = processedContent.replace(/# (.*?)(\n|$)/g, '<h1>$1</h1>$2');
    processedContent = processedContent.replace(/## (.*?)(\n|$)/g, '<h2>$1</h2>$2');
    processedContent = processedContent.replace(/### (.*?)(\n|$)/g, '<h3>$1</h3>$2');
    
    // Handle lists
    processedContent = processedContent.replace(/- (.*?)(\n|$)/g, '<li>$1</li>$2');
    
    // Handle paragraphs
    processedContent = processedContent.replace(/(?:\r\n|\r|\n){2,}/g, '</p><p>');
    processedContent = `<p>${processedContent}</p>`;
    
    return processedContent;
  }, [optimizedContent, keywords]);
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center mb-2">
            <CardTitle>Content Optimization Tool</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant={score >= 80 ? "success" : score >= 60 ? "warning" : "destructive"} className="text-md px-3 py-1">
                Score: {score}/100
              </Badge>
              <Progress value={score} className="w-24 h-2" 
                indicator={getScoreColor(score).replace('bg-', '')} />
            </div>
          </div>
          <CardDescription className="mt-1">
            Analyze and optimize your content for search engines and better engagement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="editor" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full mb-4">
              <TabsTrigger value="editor" className="flex-1">
                <Edit3 className="mr-2 h-4 w-4" /> Editor
              </TabsTrigger>
              <TabsTrigger value="analysis" className="flex-1">
                <Search className="mr-2 h-4 w-4" /> Analysis
              </TabsTrigger>
              {optimizedContent && (
                <TabsTrigger value="optimized" className="flex-1">
                  <Check className="mr-2 h-4 w-4" /> Optimized
                </TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="editor" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <Type className="mr-2 h-4 w-4" />
                      Content Editor
                    </h3>
                    <Textarea 
                      value={localContent}
                      onChange={(e) => setLocalContent(e.target.value)}
                      rows={18}
                      className="w-full font-mono text-sm resize-none"
                      placeholder="Enter or paste your content here..."
                    />
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <FileText className="mr-2 h-4 w-4" />
                      Content Score Details
                    </h3>
                    <div className="bg-slate-50 rounded-md p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Overall Score</span>
                        <div className="flex items-center gap-2">
                          <span className={`text-md font-semibold ${getScoreTextColor(score)}`}>
                            {score}/100
                          </span>
                          <Progress value={score} className="w-24 h-2" 
                            indicator={getScoreColor(score).replace('bg-', '')} />
                        </div>
                      </div>
                      
                      <Separator className="my-2" />
                      
                      {/* Score Breakdown */}
                      <div className="space-y-3 mt-2">
                        <h4 className="text-xs font-semibold uppercase text-gray-500">Score Breakdown</h4>
                        
                        <div className="space-y-2">
                          {Object.entries(scoreBreakdown).map(([key, value]) => (
                            <div key={key} className="flex justify-between items-center">
                              <div className="flex flex-col">
                                <span className="text-xs font-medium">{value.description}</span>
                                <span className="text-xs text-gray-500">{value.score}/{value.max} points</span>
                              </div>
                              <Progress 
                                value={(value.score / value.max) * 100} 
                                className="w-24 h-1.5" 
                                indicator={value.score > value.max * 0.7 ? 'green' : 
                                          value.score > value.max * 0.4 ? 'yellow' : 'red'} 
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <Lightbulb className="mr-2 h-4 w-4" />
                      Improvement Suggestions
                    </h3>
                    <div className="bg-slate-50 rounded-md p-4 max-h-64 overflow-y-auto">
                      {feedback.length === 0 ? (
                        <p className="text-sm text-gray-500">No feedback available yet. Add more content to get suggestions.</p>
                      ) : (
                        <div className="space-y-1">
                          {/* Group feedback by category */}
                          {feedback.filter(item => getFeedbackCategory(item) === 'critical').length > 0 && (
                            <div className="mb-3">
                              <h4 className="text-xs font-semibold uppercase text-red-600 mb-1">Critical Issues</h4>
                              <ul className="space-y-1">
                                {feedback
                                  .filter(item => getFeedbackCategory(item) === 'critical')
                                  .map((item, index) => (
                                    <li key={`critical-${index}`} className="flex items-start text-sm bg-red-50 p-2 rounded-md">
                                      {getFeedbackIcon('critical')}
                                      <span>{item}</span>
                                    </li>
                                  ))}
                              </ul>
                            </div>
                          )}
                          
                          {feedback.filter(item => getFeedbackCategory(item) === 'important').length > 0 && (
                            <div className="mb-3">
                              <h4 className="text-xs font-semibold uppercase text-amber-600 mb-1">Important Issues</h4>
                              <ul className="space-y-1">
                                {feedback
                                  .filter(item => getFeedbackCategory(item) === 'important')
                                  .map((item, index) => (
                                    <li key={`important-${index}`} className="flex items-start text-sm bg-amber-50 p-2 rounded-md">
                                      {getFeedbackIcon('important')}
                                      <span>{item}</span>
                                    </li>
                                  ))}
                              </ul>
                            </div>
                          )}
                          
                          {feedback.filter(item => getFeedbackCategory(item) === 'suggestion').length > 0 && (
                            <div>
                              <h4 className="text-xs font-semibold uppercase text-blue-600 mb-1">Suggestions</h4>
                              <ul className="space-y-1">
                                {feedback
                                  .filter(item => getFeedbackCategory(item) === 'suggestion')
                                  .map((item, index) => (
                                    <li key={`suggestion-${index}`} className="flex items-start text-sm bg-blue-50 p-2 rounded-md">
                                      {getFeedbackIcon('suggestion')}
                                      <span>{item}</span>
                                    </li>
                                  ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between mt-4">
                <Button
                  variant="outline"
                  disabled={!itemId || updateContentItem.isPending}
                  onClick={saveOptimizedContent}
                >
                  {updateContentItem.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
                
                <Button
                  onClick={handleOptimize}
                  disabled={!localContent || optimizeContent.isPending}
                >
                  {optimizeContent.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Optimizing...
                    </>
                  ) : (
                    'AI Optimize Content'
                  )}
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="analysis" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Search className="mr-2 h-4 w-4" />
                    Keyword Analysis
                  </h3>
                  <div className="bg-slate-50 rounded-md p-4">
                    {keywordAnalysis.length === 0 ? (
                      <p className="text-sm text-gray-500">No keywords analyzed yet. Add keywords and content to see the analysis.</p>
                    ) : (
                      <div className="space-y-4">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left pb-2 font-medium">Keyword</th>
                              <th className="text-center pb-2 font-medium">Count</th>
                              <th className="text-center pb-2 font-medium">Density</th>
                              <th className="text-center pb-2 font-medium">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {keywordAnalysis.map((analysis, index) => (
                              <tr key={index} className="border-b last:border-0">
                                <td className="py-2">{analysis.keyword}</td>
                                <td className="py-2 text-center">{analysis.count}</td>
                                <td className="py-2 text-center">{(analysis.density * 100).toFixed(1)}%</td>
                                <td className="py-2 text-center">
                                  <Badge 
                                    className={`${getKeywordStatusColor(analysis.status)} border`}
                                    variant="outline"
                                  >
                                    <span className="mr-1 flex items-center gap-1">
                                      {getKeywordStatusIcon(analysis.status)}
                                      {analysis.status.charAt(0).toUpperCase() + analysis.status.slice(1)}
                                    </span>
                                  </Badge>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        
                        <div className="space-y-2 bg-gray-100 p-3 rounded-md mt-4">
                          <h4 className="text-xs font-semibold uppercase text-gray-500">Keyword Recommendations</h4>
                          <ul className="space-y-1">
                            {keywordAnalysis.map((analysis, index) => (
                              <li key={index} className="text-sm flex items-start">
                                {analysis.status === 'good' ? (
                                  <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                ) : (
                                  <Info className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                                )}
                                <span>{analysis.suggestion}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    Content Preview with Highlighted Keywords
                  </h3>
                  <div 
                    className="bg-white border rounded-md p-4 prose max-w-none prose-sm h-96 overflow-y-auto"
                    dangerouslySetInnerHTML={{ __html: formattedContent }}
                  />
                </div>
              </div>
              
              <div className="flex justify-end mt-4">
                <Button
                  onClick={handleOptimize}
                  disabled={!localContent || optimizeContent.isPending}
                >
                  {optimizeContent.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Optimizing...
                    </>
                  ) : (
                    'AI Optimize Content'
                  )}
                </Button>
              </div>
            </TabsContent>
            
            {optimizedContent && (
              <TabsContent value="optimized" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-medium text-gray-700 flex items-center">
                          <Check className="mr-2 h-4 w-4 text-green-500" />
                          AI-Optimized Content
                        </h3>
                        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                          Score: {aiScore}/100
                        </Badge>
                      </div>
                      <div 
                        className="bg-white border rounded-md p-4 prose max-w-none prose-sm h-[36rem] overflow-y-auto"
                        dangerouslySetInnerHTML={{ __html: formattedOptimizedContent }}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <Lightbulb className="mr-2 h-4 w-4 text-amber-500" />
                        Optimization Insights
                      </h3>
                      <div className="bg-slate-50 rounded-md p-4">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-sm font-medium">Performance Comparison</span>
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center">
                              <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
                              <span className="text-xs">Original</span>
                            </div>
                            <div className="flex items-center">
                              <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                              <span className="text-xs">Optimized</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs">Score</span>
                          <div className="w-48 flex items-center gap-2">
                            <Progress value={score} className="h-2" indicator="blue" />
                            <span className="text-xs w-6">{score}</span>
                            <Progress value={aiScore} className="h-2" indicator="green" />
                            <span className="text-xs w-6">{aiScore}</span>
                          </div>
                        </div>
                        
                        <Separator className="my-4" />
                        
                        <div className="space-y-3">
                          <h4 className="text-xs font-semibold uppercase text-gray-500">Improvements Made</h4>
                          {aiFeedback.length === 0 ? (
                            <p className="text-sm text-gray-500">No feedback available.</p>
                          ) : (
                            <ul className="space-y-2">
                              {aiFeedback.map((item, index) => (
                                <li key={index} className="flex items-start text-sm bg-green-50 p-2 rounded-md">
                                  <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                        
                        <div className="mt-6">
                          <h4 className="text-xs font-semibold uppercase text-gray-500 mb-2">Keyword Usage Comparison</h4>
                          {keywordAnalysis.length > 0 && (
                            <table className="w-full text-xs">
                              <thead>
                                <tr className="border-b">
                                  <th className="text-left pb-2 font-medium">Keyword</th>
                                  <th className="text-center pb-2 font-medium">Original</th>
                                  <th className="text-center pb-2 font-medium">Optimized</th>
                                </tr>
                              </thead>
                              <tbody>
                                {keywordAnalysis.map((analysis, index) => {
                                  // Calculate count in optimized content
                                  const optimizedCount = optimizedContent
                                    ? (optimizedContent.toLowerCase().match(new RegExp('\\b' + analysis.keyword.toLowerCase() + '\\b', 'g')) || []).length
                                    : 0;
                                  
                                  return (
                                    <tr key={index} className="border-b last:border-0">
                                      <td className="py-1.5">{analysis.keyword}</td>
                                      <td className="py-1.5 text-center">
                                        <Badge variant="outline" className={`${getKeywordStatusColor(analysis.status)} text-xs`}>
                                          {analysis.count}
                                        </Badge>
                                      </td>
                                      <td className="py-1.5 text-center">
                                        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300 text-xs">
                                          {optimizedCount}
                                          {optimizedCount > analysis.count && (
                                            <span className="text-green-600 ml-1">↑</span>
                                          )}
                                        </Badge>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between mt-4">
                  <Button variant="outline" onClick={() => setActiveTab('editor')}>
                    Return to Editor
                  </Button>
                  <Button onClick={applyOptimization} className="bg-green-600 hover:bg-green-700">
                    Apply Optimized Version
                  </Button>
                </div>
              </TabsContent>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
