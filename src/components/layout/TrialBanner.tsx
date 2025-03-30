
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TrialBanner: React.FC = () => {
  return (
    <div className="p-4 bg-white border-b mb-2">
      <div className="max-w-7xl mx-auto">
        <div className="bg-orange-50 border border-orange-300 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3 text-orange-800">
            <AlertTriangle size={24} className="text-orange-500" />
            <div>
              <span className="font-semibold">Your free trial expires in 13 days</span>
              <p className="text-gray-700">Keep your client work organized and efficient by upgrading to paid today!</p>
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
