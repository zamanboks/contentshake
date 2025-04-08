import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import {
  Home,
  Lightbulb,
  PenTool,
  MessageSquare,
  BarChart2,
  Users,
  Share2,
  Settings,
  Menu,
  X,
} from 'lucide-react';

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

const mainNavItems: NavItem[] = [
  {
    href: "/",
    label: "Dashboard",
    icon: <Home className="h-4 w-4" />,
  },
  {
    href: "/content-ideas",
    label: "Content Ideas",
    icon: <Lightbulb className="h-4 w-4" />,
  },
  {
    href: "/content-writing",
    label: "Content Writing",
    icon: <PenTool className="h-4 w-4" />,
  },
  {
    href: "/brand-voice",
    label: "Brand Voice",
    icon: <MessageSquare className="h-4 w-4" />,
  },
  {
    href: "/optimization",
    label: "Optimization",
    icon: <BarChart2 className="h-4 w-4" />,
  },
  {
    href: "/collaboration",
    label: "Collaboration",
    icon: <Users className="h-4 w-4" />,
  },
  {
    href: "/social-media",
    label: "Social Media",
    icon: <Share2 className="h-4 w-4" />,
  },
];

const recentProjects = [
  { href: "#", label: "SEO Blog Post Strategy" },
  { href: "#", label: "Product Announcement" },
  { href: "#", label: "Marketing Campaign" },
];

export function Sidebar() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <button
        type="button"
        className="px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 md:hidden"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Sidebar container */}
      <aside className={cn(
        "transition-all duration-300 ease-in-out",
        isMobileMenuOpen 
          ? "fixed inset-0 z-40 block" 
          : "hidden md:flex md:flex-shrink-0"
      )}>
        <div className="flex flex-col w-64 bg-white border-r border-gray-200">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary-500 text-white rounded-md flex items-center justify-center">
                <PenTool className="h-4 w-4" />
              </div>
              <span className="ml-2 text-xl font-semibold">ContentShake.ai</span>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto scrollbar-hide">
            {mainNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center px-4 py-2 text-sm font-medium rounded-md group transition-colors duration-150",
                  location === item.href || (item.href !== "/" && location.startsWith(item.href))
                    ? "text-white bg-primary-500 hover:bg-primary-600"
                    : "text-gray-700 hover:bg-gray-100 hover:text-primary-600"
                )}
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </Link>
            ))}
            
            <div className="pt-4 mt-4 border-t border-gray-200">
              <h3 className="px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Recent Projects</h3>
              <div className="mt-2 space-y-1">
                {recentProjects.map((project) => (
                  <a
                    key={project.label}
                    href={project.href}
                    className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
                  >
                    <span className="truncate">{project.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </nav>
          
          {/* User Account */}
          <div className="flex items-center p-4 border-t border-gray-200">
            <div className="flex-shrink-0">
              <img 
                className="h-8 w-8 rounded-full" 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                alt="User profile"
              />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">Tom Cook</p>
              <p className="text-xs font-medium text-gray-500">Premium Plan</p>
            </div>
            <button className="ml-auto bg-white rounded-full p-1 text-gray-400 hover:text-gray-500">
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
