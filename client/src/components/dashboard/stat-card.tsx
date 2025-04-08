import React from 'react';
import { Card } from '@/components/ui/card';
import { 
  FileText, 
  BarChart, 
  Lightbulb, 
  Share2, 
  Dot 
} from 'lucide-react';

interface StatCardProps {
  icon: 'file' | 'chart' | 'lightbulb' | 'share';
  title: string;
  value: string | number;
  colorClass: string;
}

const iconMap: Record<string, React.FC<Dot>> = {
  file: FileText,
  chart: BarChart,
  lightbulb: Lightbulb,
  share: Share2,
};

export function StatCard({ icon, title, value, colorClass }: StatCardProps) {
  const IconComponent = iconMap[icon];

  return (
    <Card className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center">
          <div className={`flex-shrink-0 ${colorClass} rounded-md p-3`}>
            <IconComponent className="h-5 w-5" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd>
                <div className="text-lg font-medium text-gray-900">{value}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </Card>
  );
}
