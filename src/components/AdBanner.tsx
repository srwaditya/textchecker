
import React from 'react';

export const AdBanner = () => {
  return (
    <div className="w-full bg-secondary p-4 border-b border-gray-200 animate-fade-in">
      <div className="max-w 800px mx-auto text-center">
        <p className="text-sm text-gray-600">Advertisement</p>
        {/* Google Ads Integration Placeholder */}
        <div className="h-16 bg-white rounded-md shadow-sm flex items-center justify-center">
          <p className="text-gray-400">Google Ads will appear here</p>
        </div>
      </div>
    </div>
  );
};
