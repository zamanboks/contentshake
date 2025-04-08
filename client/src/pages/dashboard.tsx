import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { HelpCircle, Plus } from 'lucide-react';
import { StatCard } from '@/components/dashboard/stat-card';
import { FeatureCard } from '@/components/dashboard/feature-card';
import { ContentTable } from '@/components/dashboard/content-table';
import { GettingStarted } from '@/components/dashboard/getting-started';
import { useContentItems } from '@/hooks/use-content';
import { useContentIdeas } from '@/hooks/use-content';
import { useSocialPosts } from '@/hooks/use-content';

export default function Dashboard() {
  // Fetch data for stats
  const { data: contentItems = [] } = useContentItems();
  const { data: contentIdeas = [] } = useContentIdeas();
  const { data: socialPosts = [] } = useSocialPosts();

  // Calculate average content score
  const avgScore = contentItems.length > 0 
    ? Math.round(contentItems.reduce((sum, item) => sum + (item.score || 0), 0) / contentItems.length) 
    : 0;

  return (
    <div className="py-6">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">Get started with ContentShake.ai and create engaging content</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <Button variant="outline" size="sm">
            <HelpCircle className="mr-2 h-4 w-4" />
            Help
          </Button>
          <Button asChild>
            <Link href="/content-writing">
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Link>
          </Button>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            icon="file" 
            title="Total Content Pieces" 
            value={contentItems.length} 
            colorClass="bg-primary-100" 
          />
          <StatCard 
            icon="chart" 
            title="Avg. Content Score" 
            value={`${avgScore}/100`} 
            colorClass="bg-green-100" 
          />
          <StatCard 
            icon="lightbulb" 
            title="Content Ideas" 
            value={contentIdeas.length} 
            colorClass="bg-purple-100" 
          />
          <StatCard 
            icon="share" 
            title="Social Posts" 
            value={socialPosts.length} 
            colorClass="bg-yellow-100" 
          />
        </div>

        {/* Feature Sections */}
        <div className="mt-8">
          <h2 className="text-lg leading-6 font-medium text-gray-900">Features</h2>
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon="lightbulb"
              title="Content Idea Generation"
              description="Get topic ideas based on what's trending in your niche. See what performs best for your competitors."
              features={[
                "Trending topic suggestions", 
                "Competitor analysis", 
                "Weekly idea refreshes"
              ]}
              buttonText="Generate Ideas"
              buttonClass="bg-primary-600 hover:bg-primary-700 text-white"
              onClick={() => { window.location.href = '/content-ideas'; }}
            />

            <FeatureCard
              icon="pen"
              title="Content Writing"
              description="Generate full articles optimized for your target keywords in multiple languages."
              features={[
                "SEO-optimized articles", 
                "7 language support", 
                "AI image generation"
              ]}
              buttonText="Create Content"
              buttonClass="bg-secondary-500 hover:bg-secondary-600 text-white"
              onClick={() => { window.location.href = '/content-writing'; }}
            />

            <FeatureCard
              icon="message"
              title="Brand Voice Creation"
              description="Generate brand voices based on your writing samples and target personas."
              features={[
                "Voice customization", 
                "Persona targeting", 
                "Consistent tone"
              ]}
              buttonText="Define Voice"
              buttonClass="bg-accent-500 hover:bg-accent-600 text-white"
              onClick={() => { window.location.href = '/brand-voice'; }}
            />

            <FeatureCard
              icon="chart"
              title="Content Optimization"
              description="Get a score based on how well your copy is optimized and improve it with one click."
              features={[
                "Content scoring", 
                "One-click improvement", 
                "SEO recommendations"
              ]}
              buttonText="Optimize Content"
              buttonClass="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => { window.location.href = '/optimization'; }}
            />

            <FeatureCard
              icon="users"
              title="Collaboration & Management"
              description="Send your articles to Google Docs, publish to WordPress, and track progress."
              features={[
                "Google Docs integration", 
                "WordPress publishing", 
                "Content tracking"
              ]}
              buttonText="Manage Content"
              buttonClass="bg-indigo-600 hover:bg-indigo-700 text-white"
              onClick={() => { window.location.href = '/collaboration'; }}
            />

            <FeatureCard
              icon="share"
              title="Social Media Posts"
              description="Instantly create social media posts to promote your articles on multiple platforms."
              features={[
                "Multi-platform support", 
                "Custom tone settings", 
                "Content promotion"
              ]}
              buttonText="Create Social Posts"
              buttonClass="bg-yellow-600 hover:bg-yellow-700 text-white"
              onClick={() => { window.location.href = '/social-media'; }}
            />
          </div>
        </div>

        {/* Recent Content */}
        <div className="mt-10">
          <div className="flex items-center justify-between">
            <h2 className="text-lg leading-6 font-medium text-gray-900">Recent Content</h2>
            <Link href="/content-writing" className="text-sm font-medium text-primary-600 hover:text-primary-500">
              View all
            </Link>
          </div>
          <ContentTable />
        </div>

        {/* Get Started Wizard */}
        <div className="mt-10 mb-8">
          <GettingStarted />
        </div>
      </div>
    </div>
  );
}
