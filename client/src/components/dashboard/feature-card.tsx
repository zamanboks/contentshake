import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { 
  Lightbulb, 
  PenTool, 
  MessageSquare, 
  BarChart2, 
  Users, 
  Share2, 
  Dot 
} from 'lucide-react';

interface FeatureCardProps {
  icon: 'lightbulb' | 'pen' | 'message' | 'chart' | 'users' | 'share';
  title: string;
  description: string;
  features: string[];
  buttonText: string;
  buttonClass: string;
  onClick: () => void;
}

const iconMap: Record<string, React.FC<Dot>> = {
  lightbulb: Lightbulb,
  pen: PenTool,
  message: MessageSquare,
  chart: BarChart2,
  users: Users,
  share: Share2,
};

export function FeatureCard({
  icon,
  title,
  description,
  features,
  buttonText,
  buttonClass,
  onClick
}: FeatureCardProps) {
  const IconComponent = iconMap[icon];

  return (
    <Card className="bg-white overflow-hidden shadow rounded-lg">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <div className={`flex-shrink-0 ${iconMap[icon] ? buttonClass.replace('bg-', 'bg-') + '/10' : 'bg-gray-100'} rounded-full p-2`}>
            <IconComponent className={`h-5 w-5 ${buttonClass.replace('bg-', 'text-')}`} />
          </div>
          <h3 className="ml-3 text-lg leading-6 font-medium text-gray-900">{title}</h3>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          {description}
        </p>
        <ul className="text-sm text-gray-500 space-y-1 mb-5">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <Check className="h-4 w-4 text-green-500 mr-2" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <div className="mt-auto">
          <Button
            className={`w-full justify-center ${buttonClass}`}
            onClick={onClick}
          >
            {buttonText}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
