import React, { ReactNode } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { DisclaimerBanner } from '../common/DisclaimerBanner';
import { ToastContainer } from '../common/ToastContainer';
import { CommandPalette } from '../common/CommandPalette';

interface AppLayoutProps {
  children: ReactNode;
  showFloatingDisclaimer?: boolean;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  showFloatingDisclaimer = true,
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBFA] selection:bg-verity-100 selection:text-verity-900 bg-medical-grid font-sans">
      <DisclaimerBanner />
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <Footer />
      {showFloatingDisclaimer && <DisclaimerBanner floating />}
      <ToastContainer />
      <CommandPalette />
    </div>
  );
};
