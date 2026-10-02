import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { FileQuestion, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 space-y-6 animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-ink-100 flex items-center justify-center text-ink-600">
        <FileQuestion className="w-8 h-8" />
      </div>
      <div className="space-y-2 max-w-md">
        <h1 className="text-3xl font-black text-ink-900 tracking-tight font-sans">
          404 — Clinical Resource Not Found
        </h1>
        <p className="text-xs sm:text-sm text-ink-600 leading-relaxed">
          The requested page or evidence index does not exist or may have been relocated.
        </p>
      </div>
      <Link to="/">
        <Button variant="primary" size="md" leftIcon={<ArrowLeft className="w-4 h-4" />}>
          Return to Knowledge Hub
        </Button>
      </Link>
    </div>
  );
};
