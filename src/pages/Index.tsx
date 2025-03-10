
import React from 'react';
import { AdBanner } from '@/components/AdBanner';
import { TextEditor } from '@/components/TextEditor';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <AdBanner />
      <main className="container mx-auto px-4 py-8">
        <TextEditor />
      </main>
    </div>
  );
};

export default Index;
