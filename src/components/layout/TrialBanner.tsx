
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TrialBanner: React.FC = () => {
  return (
    <div className="p-4 bg-white border-b">
      <div className="max-w-7xl mx-auto">
        <div className="bg-orange-50 border border-orange-300 rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center gap-3 text-orange-800">
            <AlertTriangle size={20} className="text-orange-500" />
            <div>
              <span className="font-medium">Your free trial expires in 4 days</span>
              <p className="text-sm text-gray-700">Keep your client work organized and efficient by upgrading to paid today!</p>
            </div>
          </div>
          <Button className="bg-jetpack-blue hover:bg-blue-700 transition-colors">
            Upgrade account
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TrialBanner;
