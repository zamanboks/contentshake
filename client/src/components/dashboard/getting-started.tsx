import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

export function GettingStarted() {
  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">New to ContentShake.ai?</h3>
        <div className="mt-2 max-w-xl text-sm text-gray-500">
          <p>Follow these steps to create your first content piece</p>
        </div>
        <div className="mt-5 space-y-4">
          <div className="relative">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-medium">1</div>
              <div className="ml-4">
                <h4 className="text-base font-medium text-gray-900">Generate content ideas</h4>
                <p className="text-sm text-gray-500">Find trending topics in your niche</p>
              </div>
              <div className="ml-auto">
                <Button 
                  variant="default" 
                  size="sm" 
                  asChild
                >
                  <Link href="/content-ideas">
                    Start
                  </Link>
                </Button>
              </div>
            </div>
            <div className="ml-4 mt-2 border-l-2 border-gray-200 h-12 pl-8 py-2">
            </div>
          </div>
          <div className="relative">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-medium">2</div>
              <div className="ml-4">
                <h4 className="text-base font-medium text-gray-700">Create your brand voice</h4>
                <p className="text-sm text-gray-500">Define your unique writing style</p>
              </div>
              <div className="ml-auto">
                <Button 
                  variant="outline" 
                  size="sm" 
                  asChild
                >
                  <Link href="/brand-voice">
                    Start
                  </Link>
                </Button>
              </div>
            </div>
            <div className="ml-4 mt-2 border-l-2 border-gray-200 h-12 pl-8 py-2">
            </div>
          </div>
          <div className="relative">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-medium">3</div>
              <div className="ml-4">
                <h4 className="text-base font-medium text-gray-700">Generate your first article</h4>
                <p className="text-sm text-gray-500">Create SEO-optimized content</p>
              </div>
              <div className="ml-auto">
                <Button 
                  variant="outline" 
                  size="sm" 
                  asChild
                >
                  <Link href="/content-writing">
                    Start
                  </Link>
                </Button>
              </div>
            </div>
            <div className="ml-4 mt-2 border-l-2 border-gray-200 h-12 pl-8 py-2">
            </div>
          </div>
          <div className="relative">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-medium">4</div>
              <div className="ml-4">
                <h4 className="text-base font-medium text-gray-700">Optimize & publish</h4>
                <p className="text-sm text-gray-500">Improve score and publish to your blog</p>
              </div>
              <div className="ml-auto">
                <Button 
                  variant="outline" 
                  size="sm" 
                  asChild
                >
                  <Link href="/optimization">
                    Start
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
