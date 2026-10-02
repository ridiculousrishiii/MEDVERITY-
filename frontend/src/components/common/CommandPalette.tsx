import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';
import { Search, Sparkles, Apple, ScanLine, Scale, History, User, ExternalLink } from 'lucide-react';
import { TRENDING_MYTHS } from '../../mock/mockData';

export const CommandPalette: React.FC = () => {
  const { commandPaletteOpen, setCommandPaletteOpen } = useSettings();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (commandPaletteOpen) {
      setQuery('');
    }
  }, [commandPaletteOpen]);

  if (!commandPaletteOpen) return null;

  const quickNav = [
    { label: 'Medical Myth Verifier', icon: <Sparkles className="w-4 h-4 text-verity-600" />, path: '/verify' },
    { label: 'Food & Nutrition Analyzer', icon: <Apple className="w-4 h-4 text-emerald-600" />, path: '/nutrition' },
    { label: 'Product & OCR Label Scanner', icon: <ScanLine className="w-4 h-4 text-blue-600" />, path: '/products' },
    { label: 'Clinical BMI & Metabolic Calc', icon: <Scale className="w-4 h-4 text-amber-600" />, path: '/bmi' },
    { label: 'Evidence History & Saved Reports', icon: <History className="w-4 h-4 text-slate-600" />, path: '/history' },
    { label: 'User Profile & Settings', icon: <User className="w-4 h-4 text-slate-600" />, path: '/profile' },
  ];

  const filteredNav = quickNav.filter((n) =>
    n.label.toLowerCase().includes(query.toLowerCase())
  );

  const filteredMyths = TRENDING_MYTHS.filter(
    (m) =>
      m.claim.toLowerCase().includes(query.toLowerCase()) ||
      m.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelectNav = (path: string) => {
    setCommandPaletteOpen(false);
    navigate(path);
  };

  const handleSelectMyth = (claim: string) => {
    setCommandPaletteOpen(false);
    navigate(`/verify?q=${encodeURIComponent(claim)}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-ink-900/60 backdrop-blur-sm animate-fade-in">
      <div
        className="fixed inset-0"
        onClick={() => setCommandPaletteOpen(false)}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-elevated border border-ink-200 overflow-hidden z-10 animate-slide-up">
        {/* Search Header */}
        <div className="flex items-center px-4 py-3.5 border-b border-ink-100 bg-background-subtle">
          <Search className="w-5 h-5 text-ink-400 mr-3 shrink-0" />
          <input
            autoFocus
            type="text"
            placeholder="Search medical claims, tools, literature, or press ESC..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none"
          />
          <kbd className="hidden sm:inline-block font-mono text-[10px] bg-ink-200 text-ink-600 px-2 py-0.5 rounded border border-ink-300">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4">
          {/* Quick Actions */}
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-ink-400 px-3 block mb-1.5 font-semibold">
              Tools & Navigation
            </span>
            <div className="space-y-1">
              {filteredNav.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleSelectNav(item.path)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-ink-800 hover:bg-ink-100/80 hover:text-ink-900 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-ink-400" />
                </button>
              ))}
            </div>
          </div>

          {/* Trending Claims */}
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-ink-400 px-3 block mb-1.5 font-semibold">
              Trending Medical Claims
            </span>
            <div className="space-y-1">
              {filteredMyths.map((myth) => (
                <button
                  key={myth.id}
                  onClick={() => handleSelectMyth(myth.claim)}
                  className="w-full flex items-start gap-3 px-3 py-2.5 rounded-lg text-left hover:bg-verity-50/60 transition-colors group"
                >
                  <Sparkles className="w-4 h-4 text-verity-600 mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-ink-900 group-hover:text-verity-800 truncate">
                      {myth.claim}
                    </p>
                    <p className="text-[11px] text-ink-500 mt-0.5 truncate">{myth.summary}</p>
                  </div>
                  <span className="text-[10px] font-mono bg-ink-100 text-ink-600 px-2 py-0.5 rounded shrink-0">
                    {myth.category}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer shortcuts */}
        <div className="p-2.5 bg-background-subtle border-t border-ink-100 flex items-center justify-between text-[11px] text-ink-500 px-4">
          <span>Navigate with <strong>↑</strong> <strong>↓</strong></span>
          <span>Select with <strong>Enter</strong></span>
        </div>
      </div>
    </div>
  );
};
