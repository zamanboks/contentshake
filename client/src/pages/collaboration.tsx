import React, { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, FileText, BookOpen, Share2, Users, Calendar, BarChart, 
  Check, Clock, FileEdit, AlertCircle, Eye, PlusCircle, UserPlus, 
  LayoutList, CheckCircle2, Briefcase, Workflow, Copy, ChevronDown,
  Facebook, Instagram, Linkedin, Twitter, Send, Settings
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, 
  DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { 
  Popover, PopoverContent, PopoverTrigger 
} from "@/components/ui/popover";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useContentItems } from '@/hooks/use-content';
import { format, addDays } from 'date-fns';
import { getScoreTextColor } from '@/lib/content-scoring';
import { ContentItem } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';

// Workflow statuses
type WorkflowStatus = 'draft' | 'review' | 'approved' | 'scheduled' | 'published';

const workflowStatusColors = {
  draft: "bg-gray-100 text-gray-800",
  review: "bg-yellow-100 text-yellow-800",
  approved: "bg-blue-100 text-blue-800",
  scheduled: "bg-purple-100 text-purple-800",
  published: "bg-green-100 text-green-800"
};

const workflowStatusLabels: Record<WorkflowStatus, string> = {
  draft: "Draft",
  review: "In Review",
  approved: "Approved",
  scheduled: "Scheduled",
  published: "Published"
};

const workflowSteps = [
  { label: "Draft", value: "draft", icon: <FileEdit className="h-4 w-4" /> },
  { label: "Review", value: "review", icon: <Eye className="h-4 w-4" /> },
  { label: "Approved", value: "approved", icon: <CheckCircle2 className="h-4 w-4" /> },
  { label: "Scheduled", value: "scheduled", icon: <Calendar className="h-4 w-4" /> },
  { label: "Published", value: "published", icon: <Share2 className="h-4 w-4" /> },
];

// Team members
const teamMembers = [
  { id: 1, name: "Alex Morgan", role: "Content Manager", avatar: "A" },
  { id: 2, name: "Jamie Chen", role: "SEO Specialist", avatar: "J" },
  { id: 3, name: "Taylor Wilson", role: "Content Writer", avatar: "T" },
  { id: 4, name: "Sam Rodriguez", role: "Editor", avatar: "S" },
];

export default function Collaboration() {
  const { data: contentItems = [], isLoading } = useContentItems();
  const [activeTab, setActiveTab] = useState("workflow");
  const { toast } = useToast();
  
  // For modals and actions
  const [viewingItemId, setViewingItemId] = useState<number | null>(null);
  const [publishingItemId, setPublishingItemId] = useState<number | null>(null);
  const [sharingItemId, setSharingItemId] = useState<number | null>(null);
  const [commentingItemId, setCommentingItemId] = useState<number | null>(null);
  const [newComment, setNewComment] = useState("");
  const [changeStatusItemId, setChangeStatusItemId] = useState<number | null>(null);
  
  // Cast content items to proper type and add workflow status
  const items = (contentItems as ContentItem[]).map(item => {
    // Assign a random workflow status for demo purposes
    const statuses: WorkflowStatus[] = ['draft', 'review', 'approved', 'scheduled', 'published'];
    const randomStatus = item.published 
      ? 'published' 
      : statuses[Math.floor(Math.random() * (statuses.length - 1))];
    
    return {
      ...item,
      workflowStatus: randomStatus
    };
  });
  
  // Filter content items by status
  const publishedContent = items.filter(item => item.workflowStatus === 'published');
  const draftContent = items.filter(item => item.workflowStatus === 'draft');
  const inReviewContent = items.filter(item => item.workflowStatus === 'review');
  const approvedContent = items.filter(item => item.workflowStatus === 'approved');
  const scheduledContent = items.filter(item => item.workflowStatus === 'scheduled');
  
  const handleStatusChange = (itemId: number, newStatus: WorkflowStatus) => {
    // In a real app, we would call an API to update the workflow status
    setChangeStatusItemId(itemId);
    
    // Simulate a status change with a timeout
    setTimeout(() => {
      setChangeStatusItemId(null);
      toast({
        title: "Status updated",
        description: `Content status updated to ${workflowStatusLabels[newStatus]}.`,
      });
    }, 800);
  };
  
  const handlePublish = (itemId: number) => {
    // In a real app, we would call an API to publish the content
    setPublishingItemId(itemId);
    
    // Simulate a publish action with a timeout
    setTimeout(() => {
      setPublishingItemId(null);
      toast({
        title: "Content published",
        description: "Your content has been published successfully.",
      });
    }, 1500);
  };
  
  const handleShare = (itemId: number) => {
    // In a real app, we would generate a shareable link
    setSharingItemId(itemId);
    
    // Simulate a share action with a timeout
    setTimeout(() => {
      setSharingItemId(null);
      
      // Simulate copying a link to the clipboard
      const dummyLink = `https://contentshake.ai/share/${itemId}`;
      
      // In a real app, we would use navigator.clipboard.writeText(dummyLink)
      
      toast({
        title: "Link copied to clipboard",
        description: "Shareable link has been generated and copied to your clipboard.",
      });
    }, 1000);
  };
  
  const handleAddComment = (itemId: number) => {
    if (!newComment.trim()) return;
    
    setCommentingItemId(itemId);
    
    // Simulate adding a comment
    setTimeout(() => {
      setCommentingItemId(null);
      setNewComment("");
      toast({
        title: "Comment added",
        description: "Your comment has been added to the content.",
      });
    }, 800);
  };
  
  return (
    <div className="py-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Content Collaboration</h1>
            <p className="mt-1 text-sm text-gray-500">
              Collaborate with your team, manage content workflow, and schedule publications.
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <Button variant="outline" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </Button>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Content
            </Button>
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <div className="mt-6">
          <div className="w-full">
            <div className="grid grid-cols-5 gap-2 mb-4 w-full max-w-4xl">
              <Button 
                variant={activeTab === "workflow" ? "default" : "outline"}
                className="flex items-center justify-center"
                onClick={() => setActiveTab("workflow")}
              >
                <Workflow className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Workflow</span>
              </Button>
              <Button 
                variant={activeTab === "team" ? "default" : "outline"}
                className="flex items-center justify-center"
                onClick={() => setActiveTab("team")}
              >
                <Users className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Team</span>
              </Button>
              <Button 
                variant={activeTab === "calendar" ? "default" : "outline"}
                className="flex items-center justify-center"
                onClick={() => setActiveTab("calendar")}
              >
                <Calendar className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Calendar</span>
              </Button>
              <Button 
                variant={activeTab === "analytics" ? "default" : "outline"}
                className="flex items-center justify-center"
                onClick={() => setActiveTab("analytics")}
              >
                <BarChart className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Analytics</span>
              </Button>
              <Button 
                variant={activeTab === "publishing" ? "default" : "outline"}
                className="flex items-center justify-center"
                onClick={() => setActiveTab("publishing")}
              >
                <Share2 className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Publishing</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Workspace */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Workflow Tab */}
        <div className={activeTab === "workflow" ? "block" : "hidden"}>
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-6">
            <Card className="flex-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  <LayoutList className="h-4 w-4 mr-2 text-primary-500" />
                  Content Workflow
                </CardTitle>
                <CardDescription>
                  Track and manage your content creation process
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-2 text-center mb-2">
                  {workflowSteps.map(step => (
                    <div key={step.value} className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center mb-1">
                        {step.icon}
                      </div>
                      <span className="text-xs font-medium">{step.label}</span>
                      <span className="text-xs text-gray-500">
                        {items.filter(item => item.workflowStatus === step.value).length}
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="relative mt-4">
                  <div className="h-1 w-full bg-gray-200 rounded-full">
                    <div className="absolute h-1 bg-primary-500 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                  <div className="grid grid-cols-5 w-full mt-1">
                    {workflowSteps.map((_, idx) => (
                      <div key={idx} className="flex justify-center">
                        <div className={`w-3 h-3 rounded-full ${idx <= 2 ? 'bg-primary-500' : 'bg-gray-300'}`}></div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="flex-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-primary-500" />
                  Content Due Soon
                </CardTitle>
                <CardDescription>
                  Upcoming content publishing schedule
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {scheduledContent.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between border-b pb-2 last:border-0">
                      <div className="flex items-center">
                        <div className="flex flex-col">
                          <span className="font-medium text-sm line-clamp-1">{item.title}</span>
                          <span className="text-xs text-gray-500">Due: {format(addDays(new Date(), idx + 1), 'MMM dd')}</span>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {item.type}
                      </Badge>
                    </div>
                  ))}
                  
                  {scheduledContent.length === 0 && (
                    <div className="text-center py-3 text-sm text-gray-500">
                      No scheduled content
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="mb-6">
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All Content ({items.length})</TabsTrigger>
                <TabsTrigger value="drafts">Drafts ({draftContent.length})</TabsTrigger>
                <TabsTrigger value="review">In Review ({inReviewContent.length})</TabsTrigger>
                <TabsTrigger value="approved">Approved ({approvedContent.length})</TabsTrigger>
                <TabsTrigger value="published">Published ({publishedContent.length})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                <ContentWorkflowGrid contentItems={items} isLoading={isLoading} />
              </TabsContent>
              
              <TabsContent value="drafts">
                <ContentWorkflowGrid contentItems={draftContent} isLoading={isLoading} emptyMessage="No draft content yet." />
              </TabsContent>
              
              <TabsContent value="review">
                <ContentWorkflowGrid contentItems={inReviewContent} isLoading={isLoading} emptyMessage="No content in review." />
              </TabsContent>
              
              <TabsContent value="approved">
                <ContentWorkflowGrid contentItems={approvedContent} isLoading={isLoading} emptyMessage="No approved content yet." />
              </TabsContent>
              
              <TabsContent value="published">
                <ContentWorkflowGrid contentItems={publishedContent} isLoading={isLoading} emptyMessage="No published content yet." />
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        {/* Team Tab */}
        <div className={activeTab === "team" ? "block" : "hidden"}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Team Members</span>
                    <Button size="sm">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add Member
                    </Button>
                  </CardTitle>
                  <CardDescription>Manage your team and their permissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {teamMembers.map(member => (
                      <div key={member.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10 mr-4">
                            <AvatarFallback>{member.avatar}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium">{member.name}</h4>
                            <p className="text-sm text-gray-500">{member.role}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline">
                            Message
                          </Button>
                          <Button size="sm" variant="ghost">
                            Manage
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Recent Team Activity</CardTitle>
                  <CardDescription>Track your team's recent content activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {items.slice(0, 4).map((item, idx) => (
                      <div key={idx} className="flex items-start border-b pb-4 last:border-0">
                        <Avatar className="h-8 w-8 mr-3 mt-0.5">
                          <AvatarFallback>{teamMembers[idx % 4].avatar}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm">
                            <span className="font-medium">{teamMembers[idx % 4].name}</span> {' '}
                            {idx % 3 === 0 ? 'created' : idx % 3 === 1 ? 'edited' : 'commented on'} {' '}
                            <Link href={`/content-writing/${item.id}/edit`} className="text-primary-600 hover:underline">
                              {item.title}
                            </Link>
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {format(new Date(item.createdAt), 'MMM dd, yyyy • h:mm a')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Team Performance</CardTitle>
                  <CardDescription>Content productivity this month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {teamMembers.map((member, idx) => {
                      const progress = Math.floor(Math.random() * 40) + 60;
                      const count = Math.floor(Math.random() * 5) + 2;
                      
                      return (
                        <div key={member.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{member.name}</span>
                            <span className="text-sm text-gray-500">{count} articles</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>
                      );
                    })}
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-primary-50 rounded-lg p-3">
                      <h3 className="text-2xl font-bold text-primary-600">{items.length}</h3>
                      <p className="text-xs text-gray-500">Total Content</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3">
                      <h3 className="text-2xl font-bold text-green-600">{publishedContent.length}</h3>
                      <p className="text-xs text-gray-500">Published</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Comments & Feedback</CardTitle>
                  <CardDescription>Latest team discussions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3].map((_, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center mb-2">
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarFallback>{teamMembers[idx % 4].avatar}</AvatarFallback>
                          </Avatar>
                          <span className="text-xs font-medium">{teamMembers[idx % 4].name}</span>
                          <span className="text-xs text-gray-500 ml-auto">2h ago</span>
                        </div>
                        <p className="text-xs">
                          {idx === 0 ? 
                            "Great job on the SEO optimization. The keyword placement looks natural." :
                            idx === 1 ? 
                            "Could we add more statistics to back up the main points?" :
                            "This is ready for publishing now. Approved!"
                          }
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        
        {/* Calendar Tab */}
        <div className={activeTab === "calendar" ? "block" : "hidden"}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Content Calendar</span>
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="outline">Today</Button>
                  <Button size="sm" variant="ghost">Month</Button>
                  <Button size="sm" variant="ghost">Week</Button>
                </div>
              </CardTitle>
              <CardDescription>Schedule and plan your content publishing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg">
                {/* Calendar Header (Days of Week) */}
                <div className="grid grid-cols-7 text-center border-b py-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-sm font-medium">{day}</div>
                  ))}
                </div>
                
                {/* Calendar Grid */}
                <div className="grid grid-cols-7 min-h-[500px]">
                  {Array.from({ length: 35 }).map((_, idx) => {
                    const day = idx % 31 + 1;
                    const isToday = day === new Date().getDate() && idx >= 3 && idx < 34;
                    const hasContent = [8, 12, 15, 22, 25, 28].includes(day) && idx >= 3 && idx < 34;
                    
                    return (
                      <div 
                        key={idx} 
                        className={`min-h-24 p-1 border-r border-b relative ${
                          idx < 3 || idx >= 34 ? 'bg-gray-50 text-gray-400' : ''
                        } ${isToday ? 'bg-primary-50' : ''}`}
                      >
                        <div className={`text-sm ${isToday ? 'font-bold text-primary-600' : ''}`}>
                          {day}
                        </div>
                        
                        {hasContent && (
                          <div 
                            className={`mt-1 p-1 text-xs rounded 
                              ${idx % 4 === 0 ? 'bg-blue-100 text-blue-800' : 
                                idx % 4 === 1 ? 'bg-green-100 text-green-800' : 
                                idx % 4 === 2 ? 'bg-purple-100 text-purple-800' : 
                                'bg-yellow-100 text-yellow-800'}`}
                          >
                            {items[idx % items.length]?.title.slice(0, 18)}...
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Upcoming Publications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {scheduledContent.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between border-b pb-3 last:border-0">
                      <div className="flex flex-col">
                        <span className="font-medium text-sm line-clamp-1">{item.title}</span>
                        <span className="text-xs text-gray-500">
                          {format(addDays(new Date(), idx + 2), 'MMM dd, yyyy')}
                        </span>
                      </div>
                      <Button size="sm" variant="ghost">View</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Schedule Content</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Select Content</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose content to schedule" />
                      </SelectTrigger>
                      <SelectContent>
                        {draftContent.map(item => (
                          <SelectItem key={item.id} value={item.id.toString()}>
                            {item.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Publication Date</label>
                    <Input type="date" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Notes</label>
                    <Textarea placeholder="Add notes about this scheduled content" className="resize-none" />
                  </div>
                  
                  <Button className="w-full">Schedule Publication</Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Content Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b pb-3">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <Linkedin className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="font-medium text-sm">LinkedIn</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {Math.floor(Math.random() * 3) + 2} scheduled
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between border-b pb-3">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <Facebook className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="font-medium text-sm">Facebook</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {Math.floor(Math.random() * 3) + 1} scheduled
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between border-b pb-3">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                        <Instagram className="h-4 w-4 text-purple-600" />
                      </div>
                      <span className="font-medium text-sm">Instagram</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {Math.floor(Math.random() * 3) + 1} scheduled
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <Twitter className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="font-medium text-sm">Twitter</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {Math.floor(Math.random() * 4) + 2} scheduled
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Analytics Tab */}
        <div className={activeTab === "analytics" ? "block" : "hidden"}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Content</p>
                    <h3 className="text-2xl font-bold">{items.length}</h3>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-primary-100 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-primary-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Last 30 days</span>
                    <span className="text-green-600 font-medium">+12%</span>
                  </div>
                  <div className="w-full h-1 bg-gray-100 rounded-full mt-1">
                    <div className="h-1 bg-primary-500 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Published</p>
                    <h3 className="text-2xl font-bold">{publishedContent.length}</h3>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                    <Share2 className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Last 30 days</span>
                    <span className="text-green-600 font-medium">+5%</span>
                  </div>
                  <div className="w-full h-1 bg-gray-100 rounded-full mt-1">
                    <div className="h-1 bg-green-500 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Avg. Quality Score</p>
                    <h3 className="text-2xl font-bold">78<span className="text-sm">/100</span></h3>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                    <BarChart className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Last 30 days</span>
                    <span className="text-green-600 font-medium">+4%</span>
                  </div>
                  <div className="w-full h-1 bg-gray-100 rounded-full mt-1">
                    <div className="h-1 bg-blue-500 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Team Members</p>
                    <h3 className="text-2xl font-bold">{teamMembers.length}</h3>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Active contributors</span>
                    <span className="text-green-600 font-medium">100%</span>
                  </div>
                  <div className="w-full h-1 bg-gray-100 rounded-full mt-1">
                    <div className="h-1 bg-purple-500 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Content Performance</CardTitle>
                  <CardDescription>Views and engagement over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-center justify-center bg-gray-50 rounded border border-dashed">
                    <div className="text-center">
                      <BarChart className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                      <p className="text-sm text-gray-500">Analytics chart would be displayed here</p>
                      <p className="text-xs text-gray-400 mt-1">Showing data for last 30 days</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Content</CardTitle>
                  <CardDescription>Based on views, engagement and conversions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {items.slice(0, 5).map((item, idx) => (
                      <div key={idx} className="flex items-start justify-between border-b pb-4 last:border-0">
                        <div className="flex items-start space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-medium ${
                            idx === 0 ? 'bg-yellow-500' : 
                            idx === 1 ? 'bg-gray-400' : 
                            idx === 2 ? 'bg-amber-600' : 
                            'bg-gray-300'
                          }`}>
                            {idx + 1}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{item.title}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {item.type}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {format(new Date(item.createdAt), 'MMM dd')}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{Math.floor(Math.random() * 900) + 100}</p>
                          <p className="text-xs text-gray-500">views</p>
                          <div className="flex items-center justify-end mt-1 text-green-600">
                            <span className="text-xs font-medium">+{Math.floor(Math.random() * 20) + 5}%</span>
                            <ChevronDown className="h-3 w-3 rotate-180" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Content Analysis</CardTitle>
                  <CardDescription>Performance by content type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Blog posts</span>
                        <span className="text-sm font-medium text-green-600">68%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full">
                        <div className="h-2 bg-green-500 rounded-full" style={{ width: '68%' }}></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Articles</span>
                        <span className="text-sm font-medium text-blue-600">84%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full">
                        <div className="h-2 bg-blue-500 rounded-full" style={{ width: '84%' }}></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Product descriptions</span>
                        <span className="text-sm font-medium text-purple-600">76%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full">
                        <div className="h-2 bg-purple-500 rounded-full" style={{ width: '76%' }}></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Social media posts</span>
                        <span className="text-sm font-medium text-orange-600">62%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full">
                        <div className="h-2 bg-orange-500 rounded-full" style={{ width: '62%' }}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg mt-6 p-4">
                    <h4 className="font-medium text-sm mb-2">Conversion rate by type</h4>
                    <div className="h-40 flex items-center justify-center bg-gray-50 rounded border border-dashed mb-2">
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Chart visualization</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">Product descriptions have the highest conversion rate at 4.2%</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Content Health</CardTitle>
                  <CardDescription>Content quality metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-green-50 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-green-600">92%</div>
                        <p className="text-xs text-gray-500">SEO Score</p>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-blue-600">84%</div>
                        <p className="text-xs text-gray-500">Readability</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-purple-50 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-purple-600">78%</div>
                        <p className="text-xs text-gray-500">Engagement</p>
                      </div>
                      <div className="bg-amber-50 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-amber-600">88%</div>
                        <p className="text-xs text-gray-500">Originality</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        
        {/* Publishing Tab */}
        <div className={activeTab === "publishing" ? "block" : "hidden"}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {[
              { name: "LinkedIn", icon: <Linkedin className="h-6 w-6" />, color: "bg-blue-100 text-blue-600", connected: true, desc: "Professional network" },
              { name: "Facebook", icon: <Facebook className="h-6 w-6" />, color: "bg-blue-100 text-blue-600", connected: true, desc: "Social media platform" },
              { name: "Twitter", icon: <Twitter className="h-6 w-6" />, color: "bg-blue-100 text-blue-600", connected: true, desc: "Microblogging platform" },
              { name: "Instagram", icon: <Instagram className="h-6 w-6" />, color: "bg-purple-100 text-purple-600", connected: false, desc: "Photo and video sharing" },
              { name: "WordPress", icon: <FileText className="h-6 w-6" />, color: "bg-blue-100 text-blue-600", connected: true, desc: "Website & blog platform" },
              { name: "Medium", icon: <BookOpen className="h-6 w-6" />, color: "bg-gray-100 text-gray-600", connected: false, desc: "Online publishing platform" },
            ].map((platform, idx) => (
              <Card key={idx}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className={`w-12 h-12 ${platform.color} rounded-lg flex items-center justify-center`}>
                      {platform.icon}
                    </div>
                    {platform.connected ? (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Connected</Badge>
                    ) : (
                      <Badge variant="outline" className="border-dashed">Connect</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pb-3">
                  <h3 className="font-medium text-lg">{platform.name}</h3>
                  <p className="text-sm text-muted-foreground">{platform.desc}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="text-sm text-muted-foreground">
                    {platform.connected ? 
                      `${Math.floor(Math.random() * 10) + 2} posts this month` : 
                      "Not connected"}
                  </div>
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Content Distribution Schedule</CardTitle>
              <CardDescription>Schedule your content across multiple platforms</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="upcoming">
                <TabsList className="mb-4">
                  <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                  <TabsTrigger value="published">Published</TabsTrigger>
                  <TabsTrigger value="draft">Drafts</TabsTrigger>
                </TabsList>
                
                <TabsContent value="upcoming">
                  <div className="space-y-4">
                    {scheduledContent.slice(0, 4).map((item, idx) => (
                      <div key={idx} className="flex flex-col md:flex-row md:items-center justify-between border-b pb-4 gap-2">
                        <div className="flex items-start space-x-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            idx % 3 === 0 ? 'bg-blue-100 text-blue-600' : 
                            idx % 3 === 1 ? 'bg-green-100 text-green-600' : 
                            'bg-purple-100 text-purple-600'
                          }`}>
                            {idx % 3 === 0 ? <Linkedin className="h-5 w-5" /> : 
                             idx % 3 === 1 ? <Facebook className="h-5 w-5" /> : 
                             <Instagram className="h-5 w-5" />}
                          </div>
                          <div>
                            <h4 className="font-medium">{item.title}</h4>
                            <div className="flex flex-wrap gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {item.type}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                Scheduled: {format(addDays(new Date(), idx + 1), 'MMM dd, yyyy')}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-2 md:mt-0">
                          <Button size="sm" variant="outline">Edit</Button>
                          <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="published">
                  <div className="space-y-4">
                    {publishedContent.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="flex flex-col md:flex-row md:items-center justify-between border-b pb-4 gap-2">
                        <div className="flex items-start space-x-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            idx % 3 === 0 ? 'bg-blue-100 text-blue-600' : 
                            idx % 3 === 1 ? 'bg-green-100 text-green-600' : 
                            'bg-purple-100 text-purple-600'
                          }`}>
                            {idx % 3 === 0 ? <Linkedin className="h-5 w-5" /> : 
                             idx % 3 === 1 ? <Facebook className="h-5 w-5" /> : 
                             <Twitter className="h-5 w-5" />}
                          </div>
                          <div>
                            <h4 className="font-medium">{item.title}</h4>
                            <div className="flex flex-wrap gap-2 mt-1">
                              <Badge className="bg-green-100 text-green-800 text-xs">
                                Published
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {format(new Date(item.createdAt), 'MMM dd, yyyy')}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center space-y-1 md:space-y-0 md:space-x-4 text-sm">
                          <div className="flex items-center">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></div>
                            <span>{Math.floor(Math.random() * 900) + 100} views</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1.5"></div>
                            <span>{Math.floor(Math.random() * 80) + 20} engagements</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="draft">
                  <div className="space-y-4">
                    {draftContent.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="flex flex-col md:flex-row md:items-center justify-between border-b pb-4 gap-2">
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-medium">{item.title}</h4>
                            <div className="flex flex-wrap gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {item.type}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                Created: {format(new Date(item.createdAt), 'MMM dd, yyyy')}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-2 md:mt-0">
                          <Button size="sm" variant="outline">Edit</Button>
                          <Button size="sm">Schedule</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

interface ContentWorkflowGridProps {
  contentItems: any[];
  isLoading: boolean;
  emptyMessage?: string;
}

function ContentWorkflowGrid({ contentItems, isLoading, emptyMessage = "No content items yet." }: ContentWorkflowGridProps) {
  const [publishingItemId, setPublishingItemId] = useState<number | null>(null);
  const [sharingItemId, setSharingItemId] = useState<number | null>(null);
  const [commentingItemId, setCommentingItemId] = useState<number | null>(null);
  const [viewingItemId, setViewingItemId] = useState<number | null>(null);
  const [changeStatusItemId, setChangeStatusItemId] = useState<number | null>(null);
  const [newComment, setNewComment] = useState("");
  const { toast } = useToast();
  
  const handleStatusChange = (itemId: number, newStatus: WorkflowStatus) => {
    // In a real app, we would call an API to update the workflow status
    setChangeStatusItemId(itemId);
    
    // Simulate a status change with a timeout
    setTimeout(() => {
      setChangeStatusItemId(null);
      toast({
        title: "Status updated",
        description: `Content status updated to ${workflowStatusLabels[newStatus]}.`,
      });
    }, 800);
  };
  
  const handlePublish = (itemId: number) => {
    // In a real app, we would call an API to publish the content
    setPublishingItemId(itemId);
    
    // Simulate a publish action with a timeout
    setTimeout(() => {
      setPublishingItemId(null);
      toast({
        title: "Content published",
        description: "Your content has been published successfully.",
      });
    }, 1500);
  };
  
  const handleShare = (itemId: number) => {
    // In a real app, we would generate a shareable link
    setSharingItemId(itemId);
    
    // Simulate a share action with a timeout
    setTimeout(() => {
      setSharingItemId(null);
      
      // Simulate copying a link to the clipboard
      const dummyLink = `https://contentshake.ai/share/${itemId}`;
      
      // In a real app, we would use navigator.clipboard.writeText(dummyLink)
      
      toast({
        title: "Link copied to clipboard",
        description: "Shareable link has been generated and copied to your clipboard.",
      });
    }, 1000);
  };
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="h-5 w-20 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-6 w-full bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 w-4/5 bg-gray-200 rounded animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse mb-3"></div>
              <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
            </CardContent>
            <CardFooter className="bg-gray-50 flex justify-between">
              <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }
  
  if (contentItems.length === 0) {
    return (
      <div className="text-center py-10 bg-gray-50 rounded-lg">
        <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">{emptyMessage}</p>
        <Button className="mt-4" asChild>
          <Link href="/content-writing">Create Content</Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {contentItems.map((item: any) => (
        <Card key={item.id} className="overflow-hidden border-t-2 border-t-primary-400">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-xs">
                  {item.type}
                </Badge>
                <Badge 
                  variant="secondary" 
                  className={`text-xs ${workflowStatusColors[item.workflowStatus as WorkflowStatus]}`}
                >
                  {workflowStatusLabels[item.workflowStatus as WorkflowStatus]}
                </Badge>
              </div>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <div className="flex flex-col gap-1">
                      <div className="h-1 w-1 rounded-full bg-gray-600"></div>
                      <div className="h-1 w-1 rounded-full bg-gray-600"></div>
                      <div className="h-1 w-1 rounded-full bg-gray-600"></div>
                    </div>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-0">
                  <div className="grid gap-1 p-2">
                    <Button size="sm" variant="ghost" className="flex justify-start" asChild>
                      <Link href={`/content-writing/${item.id}/edit`}>
                        <FileEdit className="h-4 w-4 mr-2" />
                        Edit Content
                      </Link>
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="flex justify-start"
                      onClick={() => handleShare(item.id)}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Link
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="flex justify-start"
                      onClick={() => setViewingItemId(item.id)}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Assign
                    </Button>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid gap-1 p-2">
                    <div className="text-xs font-semibold pl-2 pt-1 pb-2">Change Status</div>
                    {workflowSteps.map(step => (
                      <Button 
                        key={step.value} 
                        size="sm" 
                        variant="ghost" 
                        className={`flex justify-start ${
                          item.workflowStatus === step.value ? 'bg-primary-50' : ''
                        }`}
                        onClick={() => handleStatusChange(item.id, step.value as WorkflowStatus)}
                        disabled={item.workflowStatus === step.value}
                      >
                        {step.icon}
                        <span className="ml-2">{step.label}</span>
                        {item.workflowStatus === step.value && (
                          <Check className="h-4 w-4 ml-2 text-primary-500" />
                        )}
                      </Button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            
            <Link href={`/content-writing/${item.id}/edit`}>
              <CardTitle className="mt-2 text-lg hover:text-primary-600 hover:underline cursor-pointer">
                {item.title}
              </CardTitle>
            </Link>
            <div className="flex items-center mt-1">
              <span className={`text-xs font-medium ${getScoreTextColor(item.score || 0)}`}>
                Score: {item.score}/100
              </span>
              {item.score && (
                <Progress 
                  value={item.score} 
                  max={100} 
                  className="h-1 ml-2 flex-1"
                />
              )}
            </div>
          </CardHeader>
          
          <CardContent className="pt-0">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
              <span>Created: {format(new Date(item.createdAt), 'MMM dd, yyyy')}</span>
              {item.published && (
                <span>Published: {format(new Date(item.updatedAt), 'MMM dd, yyyy')}</span>
              )}
            </div>
            
            <div className="flex flex-wrap gap-1 mb-2">
              {item.keywords && item.keywords.slice(0, 3).map((keyword: string, idx: number) => (
                <span 
                  key={idx}
                  className="text-xs bg-gray-100 text-gray-800 rounded-full px-2 py-0.5"
                >
                  {keyword}
                </span>
              ))}
              {item.keywords && item.keywords.length > 3 && (
                <span className="text-xs text-gray-500">+{item.keywords.length - 3} more</span>
              )}
            </div>
            
            {viewingItemId === item.id && (
              <Dialog open={true} onOpenChange={() => setViewingItemId(null)}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Assign Team Members</DialogTitle>
                    <DialogDescription>
                      Select team members to work on "{item.title}"
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <div className="space-y-3">
                      {teamMembers.map(member => (
                        <div key={member.id} className="flex items-center">
                          <input type="checkbox" id={`member-${member.id}`} className="mr-2 rounded text-primary-600" />
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarFallback>{member.avatar}</AvatarFallback>
                          </Avatar>
                          <label htmlFor={`member-${member.id}`} className="text-sm">
                            {member.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setViewingItemId(null)}>Cancel</Button>
                    <Button onClick={() => {
                      setViewingItemId(null);
                      toast({
                        title: "Team members assigned",
                        description: "The selected team members have been assigned to this content item.",
                      });
                    }}>Assign</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </CardContent>
          
          <CardFooter className="bg-gray-50 flex items-center justify-between">
            <div className="flex space-x-2">
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-8 px-2"
                asChild
              >
                <Link href={`/content-writing/${item.id}/edit`}>
                  <FileEdit className="h-4 w-4" />
                </Link>
              </Button>
              
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-8 px-2"
                onClick={() => handleShare(item.id)}
                disabled={sharingItemId === item.id}
              >
                {sharingItemId === item.id ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-400 border-t-transparent" />
                ) : (
                  <Share2 className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            <div>
              {item.workflowStatus === 'draft' && (
                <Button 
                  size="sm" 
                  variant="ghost"
                  className="bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                  onClick={() => handleStatusChange(item.id, 'review')}
                  disabled={changeStatusItemId === item.id}
                >
                  {changeStatusItemId === item.id ? 
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-yellow-400 border-t-transparent" /> :
                    <>Send for Review</>
                  }
                </Button>
              )}
              
              {item.workflowStatus === 'review' && (
                <Button 
                  size="sm" 
                  variant="ghost"
                  className="bg-blue-50 text-blue-700 hover:bg-blue-100"
                  onClick={() => handleStatusChange(item.id, 'approved')}
                  disabled={changeStatusItemId === item.id}
                >
                  {changeStatusItemId === item.id ? 
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-blue-400 border-t-transparent" /> :
                    <>Approve</>
                  }
                </Button>
              )}
              
              {item.workflowStatus === 'approved' && (
                <Button 
                  size="sm" 
                  variant="ghost"
                  className="bg-purple-50 text-purple-700 hover:bg-purple-100"
                  onClick={() => handleStatusChange(item.id, 'scheduled')}
                  disabled={changeStatusItemId === item.id}
                >
                  {changeStatusItemId === item.id ? 
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-purple-400 border-t-transparent" /> :
                    <>Schedule</>
                  }
                </Button>
              )}
              
              {item.workflowStatus === 'scheduled' && (
                <Button 
                  size="sm" 
                  variant="default"
                  onClick={() => handlePublish(item.id)}
                  disabled={publishingItemId === item.id}
                >
                  {publishingItemId === item.id ? (
                    <>
                      <span className="animate-pulse mr-1">Publishing</span>
                      <span className="h-4 w-4 ml-1 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    </>
                  ) : (
                    <>Publish Now</>
                  )}
                </Button>
              )}
              
              {item.workflowStatus === 'published' && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <Check className="h-3 w-3 mr-1" />Published
                </Badge>
              )}
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}