import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../common/Logo';
import { ShieldAlert, BookOpen, GitBranch, HeartHandshake, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-ink-200/90 pt-14 pb-12 font-sans mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-ink-200/70">
          {/* Brand Column */}
          <div className="md:col-span-4 space-y-4">
            <Logo size="md" />
            <p className="text-xs text-ink-600 leading-relaxed max-w-sm">
              MEDVERITY is an open-access medical intelligence architecture bridging biomedical research literature and health literacy through rigorous NLP verification pipelines.
            </p>
            <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 w-fit">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Cochrane & PubMed Indexing Engine</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-ink-900">Intelligence</h4>
            <ul className="space-y-2 text-xs text-ink-600">
              <li>
                <Link to="/verify" className="hover:text-verity-700 transition-colors">
                  Claim Verifier
                </Link>
              </li>
              <li>
                <Link to="/nutrition" className="hover:text-verity-700 transition-colors">
                  Nutrition Analyzer
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-verity-700 transition-colors">
                  Product OCR Scan
                </Link>
              </li>
              <li>
                <Link to="/bmi" className="hover:text-verity-700 transition-colors">
                  Clinical BMI Gauge
                </Link>
              </li>
            </ul>
          </div>

          {/* Methodology & Resources */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-ink-900">Evidence Standards</h4>
            <ul className="space-y-2 text-xs text-ink-600">
              <li className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-ink-400" />
                <span>Level 1 GRADE Meta-Analyses</span>
              </li>
              <li className="flex items-center gap-1.5">
                <HeartHandshake className="w-3.5 h-3.5 text-ink-400" />
                <span>Clinical Consensus Protocols</span>
              </li>
              <li className="flex items-center gap-1.5">
                <GitBranch className="w-3.5 h-3.5 text-ink-400" />
                <span>Open Science API Schemas</span>
              </li>
            </ul>
          </div>

          {/* Compliance & Disclaimers */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-ink-900">Compliance & Scope</h4>
            <div className="p-3.5 rounded-lg bg-background-subtle border border-ink-200 text-[11px] text-ink-600 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-ink-800">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                <span>Non-Diagnostic Notice</span>
              </div>
              <p className="leading-snug">
                Not a medical device. For scientific reference, education, and health literacy only.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ink-500">
          <p>© {new Date().getFullYear()} MEDVERITY Evidence Intelligence. All rights reserved.</p>
          <div className="flex items-center gap-6 text-[11px] font-mono text-ink-500">
            <span>FastAPI + Vite TS Core</span>
            <span>•</span>
            <span>BioMed-NLP v4.2</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
