import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  BookOpen,
  Search,
  ScanLine,
  Apple,
  Scale,
  CheckCircle2,
  FileCheck2,
  Activity,
  ChevronRight,
  Database,
  Lock,
} from 'lucide-react';
import { TRENDING_MYTHS } from '../mock/mockData';

export const LandingPage: React.FC = () => {
  const [quickQuery, setQuickQuery] = useState('');
  const navigate = useNavigate();

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickQuery.trim()) return;
    navigate(`/verify?q=${encodeURIComponent(quickQuery)}`);
  };

  const samplePills = [
    'Lemon water alkalizes blood & cures cancer',
    'Creatine causes kidney damage',
    'Intermittent fasting improves insulin sensitivity',
    'Vitamin D 50,000 IU daily cures autoimmunity',
  ];

  return (
    <div className="space-y-20 sm:space-y-28 py-4">
      {/* Hero Section */}
      <section className="relative text-center max-w-4xl mx-auto space-y-8 animate-fade-in pt-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50/90 border border-emerald-200 text-emerald-800 text-xs font-mono font-medium shadow-soft">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>EVIDENCE-BASED HEALTH INTELLIGENCE ENGINE v4.2</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-ink-900 tracking-tight font-sans leading-[1.15]">
          Medical Truth, Grounded in <span className="underline decoration-verity-400 decoration-4 underline-offset-4">Peer-Reviewed</span> Science.
        </h1>

        <p className="text-base sm:text-xl text-ink-600 leading-relaxed font-sans max-w-2xl mx-auto">
          MEDVERITY analyzes viral health claims, nutrition claims, and food additives against millions of indexed PubMed, Cochrane, and Lancet clinical trials in real time.
        </p>

        {/* Interactive Instant Verification Box */}
        <form
          onSubmit={handleQuickSubmit}
          className="max-w-2xl mx-auto bg-white p-2 sm:p-2.5 rounded-2xl border border-ink-200 shadow-elevated transition-all focus-within:border-verity-500 focus-within:ring-4 focus-within:ring-verity-500/10"
        >
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="flex items-center w-full px-3 gap-2.5 text-ink-400">
              <Search className="w-5 h-5 shrink-0 text-ink-400" />
              <input
                type="text"
                placeholder="Enter a health claim, dietary rumor, or supplement question..."
                value={quickQuery}
                onChange={(e) => setQuickQuery(e.target.value)}
                className="w-full text-sm sm:text-base text-ink-900 placeholder:text-ink-400 bg-transparent focus:outline-none py-2"
              />
            </div>
            <Button
              type="submit"
              variant="verity"
              size="md"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="w-full sm:w-auto shrink-0"
            >
              Analyze Claim
            </Button>
          </div>
        </form>

        {/* Sample Claim Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <span className="text-xs font-mono text-ink-400">Try Sample:</span>
          {samplePills.map((pill, idx) => (
            <button
              key={idx}
              onClick={() => navigate(`/verify?q=${encodeURIComponent(pill)}`)}
              className="text-xs font-sans text-ink-700 bg-white border border-ink-200/90 hover:border-verity-400 hover:text-verity-800 px-3 py-1 rounded-full transition-all shadow-2xs hover:shadow-soft text-left"
            >
              {pill}
            </button>
          ))}
        </div>
      </section>

      {/* Trust & Scientific Methodology Metrics Bar */}
      <section className="bg-white rounded-2xl border border-ink-200/80 p-8 shadow-card">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-ink-100 font-mono">
          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl font-black text-ink-900">36M+</span>
            <p className="text-xs text-ink-500 uppercase tracking-wider font-sans">Indexed PubMed Trials</p>
          </div>
          <div className="space-y-1 pt-4 md:pt-0">
            <span className="text-3xl sm:text-4xl font-black text-emerald-700">98.4%</span>
            <p className="text-xs text-ink-500 uppercase tracking-wider font-sans">Clinical Consensus Accuracy</p>
          </div>
          <div className="space-y-1 pt-4 md:pt-0">
            <span className="text-3xl sm:text-4xl font-black text-ink-900">12,500+</span>
            <p className="text-xs text-ink-500 uppercase tracking-wider font-sans">Debunked Viral Claims</p>
          </div>
          <div className="space-y-1 pt-4 md:pt-0">
            <span className="text-3xl sm:text-4xl font-black text-blue-700">&lt; 1.2s</span>
            <p className="text-xs text-ink-500 uppercase tracking-wider font-sans">BioMed Pipeline Latency</p>
          </div>
        </div>
      </section>

      {/* 4 Core Intelligence Modules Grid */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <Badge variant="sapphire" size="sm">
            SUITE OF SCIENTIFIC TOOLS
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-ink-900 tracking-tight">
            Comprehensive Biomedical Verification Platform
          </h2>
          <p className="text-sm text-ink-600">
            Engineered with strict clinical evidence standards to combat modern health disinformation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-2xl border border-ink-200/90 shadow-soft hover:shadow-card hover:border-verity-400 transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-ink-900">Medical Myth Verifier</h3>
              <p className="text-xs text-ink-600 leading-relaxed">
                Multimodal natural language verification of viral TikTok, YouTube, and news claims with sentence-level dissection.
              </p>
            </div>
            <Link to="/verify" className="mt-6 pt-4 border-t border-ink-100 flex items-center justify-between text-xs font-bold text-verity-700 hover:text-verity-900">
              <span>Launch Verifier</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-2xl border border-ink-200/90 shadow-soft hover:shadow-card hover:border-verity-400 transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 group-hover:scale-110 transition-transform">
                <Apple className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-ink-900">Food & Nutrition Analyzer</h3>
              <p className="text-xs text-ink-600 leading-relaxed">
                Evaluates superfoods, fad diets, macros, glycemic index, and dietary claims against systematic nutrition reviews.
              </p>
            </div>
            <Link to="/nutrition" className="mt-6 pt-4 border-t border-ink-100 flex items-center justify-between text-xs font-bold text-blue-700 hover:text-blue-900">
              <span>Analyze Foods</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 rounded-2xl border border-ink-200/90 shadow-soft hover:shadow-card hover:border-verity-400 transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700 group-hover:scale-110 transition-transform">
                <ScanLine className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-ink-900">Product Scanner & OCR</h3>
              <p className="text-xs text-ink-600 leading-relaxed">
                Scan ingredient labels to identify toxic additives, harmful preservatives, allergens, and international banned substances.
              </p>
            </div>
            <Link to="/products" className="mt-6 pt-4 border-t border-ink-100 flex items-center justify-between text-xs font-bold text-purple-700 hover:text-purple-900">
              <span>Scan Label</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 4 */}
          <div className="bg-white p-6 rounded-2xl border border-ink-200/90 shadow-soft hover:shadow-card hover:border-verity-400 transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 group-hover:scale-110 transition-transform">
                <Scale className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-ink-900">Clinical BMI & Metabolic Calc</h3>
              <p className="text-xs text-ink-600 leading-relaxed">
                Calculates dynamic BMI gauge, basal metabolic rate, and personalized cardiometabolic health guidelines.
              </p>
            </div>
            <Link to="/bmi" className="mt-6 pt-4 border-t border-ink-100 flex items-center justify-between text-xs font-bold text-amber-700 hover:text-amber-900">
              <span>Calculate BMI</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Trending Medical Myths Feed */}
      <section className="bg-white rounded-2xl border border-ink-200/90 p-8 shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-rose-500 animate-pulse" />
              <h3 className="text-lg font-bold text-ink-900">Trending Viral Health Claims</h3>
            </div>
            <p className="text-xs text-ink-500">Live feed of high-volume social media claims evaluated this week.</p>
          </div>
          <Link to="/history">
            <Button variant="outline" size="sm">
              View All History
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TRENDING_MYTHS.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(`/verify?q=${encodeURIComponent(item.claim)}`)}
              className="p-5 rounded-xl bg-background-subtle border border-ink-200/70 hover:border-ink-300 hover:bg-white transition-all cursor-pointer space-y-3 shadow-2xs hover:shadow-soft"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-mono font-semibold text-ink-500 uppercase">
                  {item.category} • {item.searches}
                </span>
                <span className="text-xs font-bold font-mono text-ink-900">
                  {item.verdict === 'false_debunked' && '🛑 DEBUNKED'}
                  {item.verdict === 'misleading_nuanced' && '⚠️ NUANCED'}
                  {item.verdict === 'confirmed_true' && '✅ VERIFIED'}
                </span>
              </div>
              <p className="text-sm font-bold text-ink-900 font-sans leading-snug">
                "{item.claim}"
              </p>
              <p className="text-xs text-ink-600 leading-relaxed">
                {item.summary}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Transparency & Scientific Architecture Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-ink-200/80 shadow-soft space-y-3">
          <div className="w-10 h-10 rounded-xl bg-ink-100 flex items-center justify-center text-ink-800">
            <Database className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-ink-900">Direct PubMed & DOI Citations</h4>
          <p className="text-xs text-ink-600 leading-relaxed">
            Every conclusion is supported with clickable links to published peer-reviewed journals, authors, and clinical study sample sizes.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-ink-200/80 shadow-soft space-y-3">
          <div className="w-10 h-10 rounded-xl bg-ink-100 flex items-center justify-center text-ink-800">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-ink-900">GRADE Evidence Grading</h4>
          <p className="text-xs text-ink-600 leading-relaxed">
            Distinguishes between Level 1 Systematic Reviews, human RCTs, and preclinical animal models to prevent overhyped claims.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-ink-200/80 shadow-soft space-y-3">
          <div className="w-10 h-10 rounded-xl bg-ink-100 flex items-center justify-center text-ink-800">
            <Lock className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-ink-900">FastAPI & Open Science Backend</h4>
          <p className="text-xs text-ink-600 leading-relaxed">
            Engineered for high throughput, local offline data resilience, and seamless Supabase authentication integration.
          </p>
        </div>
      </section>

      {/* Call to action section */}
      <section className="p-10 sm:p-12 rounded-3xl bg-ink-900 text-white text-center space-y-6 shadow-elevated relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10B981_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          <h2 className="text-2xl sm:text-4xl font-black font-sans tracking-tight">
            Stop Guessing. Start Verifying.
          </h2>
          <p className="text-sm text-ink-300 leading-relaxed">
            Join medical students, physicians, clinical dietitians, and informed patients who rely on MEDVERITY for clinical literature intelligence.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <Link to="/verify">
              <Button variant="verity" size="lg" rightIcon={<Sparkles className="w-4 h-4" />}>
                Launch Myth Verifier
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="outline" size="lg" className="bg-ink-800 text-white border-ink-700 hover:bg-ink-700">
                Explore Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
