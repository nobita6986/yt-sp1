
import React from 'react';
import { YoutubeIcon } from './icons/YoutubeIcon';

const Header: React.FC = () => {
  return (
    <header className="bg-brand-surface border-b border-brand-border sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <YoutubeIcon className="h-8 w-8 text-brand-primary" />
            <h1 className="text-xl font-bold text-brand-text-primary tracking-tight">
              YouTube Community Guidelines & SEO Checker
            </h1>
          </div>
          {/* Future elements like user profile can go here */}
        </div>
      </div>
    </header>
  );
};

export default Header;
