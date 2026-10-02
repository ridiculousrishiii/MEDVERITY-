import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/layout/PageHeader';
import { Button } from '../components/common/Button';
import { Badge, VerdictBadge } from '../components/common/Badge';
import { useAuth } from '../context/AuthContext';
import { verificationService } from '../services/verificationService';
import { VerificationResult } from '../types';
import {
  Sparkles,
  Apple,
  ScanLine,
  Scale,
  History,
  TrendingUp,
  ShieldCheck,
  Search,
  ExternalLink,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { TRENDING_MYTHS } from '../mock/mockData';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recentVerifications, setRecentVerifications] = useState<VerificationResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await verificationService.getStoredVerifications();
        setRecentVerifications(data.slice(0, 5));
      } catch (err) {
        console.error('Failed to load dashboard verifications:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <PageHeader
        badgeText="CLINICAL WORKSPACE"
        badgeVariant="verity"
        title={`Welcome back, ${user?.name || 'Practitioner'}`}
        description="Monitor scientific claim consensus, search recent peer-reviewed analyses, and access nutrition & product intelligence."
        actions={
          <Link to="/verify">
            <Button variant="verity" size="md" leftIcon={<Sparkles className="w-4 h-4" />}>
              New Claim Verification
            </Button>
          </Link>
        }
      />

      {/* Top 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 font-mono">
        <div className="bg-white p-5 rounded-2xl border border-ink-200/80 shadow-soft space-y-1">
          <span className="text-[11px] uppercase tracking-wider text-ink-500 font-sans">Total Claims Analyzed</span>
          <div className="text-3xl font-black text-ink-900">4,892</div>
          <span className="text-[11px] text-emerald-700 font-bold font-sans flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +14% this month
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-ink-200/80 shadow-soft space-y-1">
          <span className="text-[11px] uppercase tracking-wider text-ink-500 font-sans">Literature Consensus</span>
          <div className="text-3xl font-black text-emerald-700">97.8%</div>
          <span className="text-[11px] text-ink-500 font-sans">GRADE Level 1 Confidence</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-ink-200/80 shadow-soft space-y-1">
          <span className="text-[11px] uppercase tracking-wider text-ink-500 font-sans">Debunked Misinformation</span>
          <div className="text-3xl font-black text-rose-700">1,340</div>
          <span className="text-[11px] text-ink-500 font-sans">Social media myths refuted</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-ink-200/80 shadow-soft space-y-1">
          <span className="text-[11px] uppercase tracking-wider text-ink-500 font-sans">Indexed Citations</span>
          <div className="text-3xl font-black text-blue-700">18.4k</div>
          <span className="text-[11px] text-ink-500 font-sans">PubMed & Cochrane IDs</span>
        </div>
      </div>

      {/* Quick Launchpad Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-ink-900 font-mono">
          Clinical Tools Launchpad
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            onClick={() => navigate('/verify')}
            className="p-5 rounded-xl bg-white border border-ink-200/90 shadow-soft hover:border-verity-400 hover:shadow-card transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <ChevronRight className="w-4 h-4 text-ink-400 group-hover:text-verity-700 group-hover:translate-x-0.5 transition-all" />
            </div>
            <h4 className="text-sm font-bold text-ink-900">Myth Verifier</h4>
            <p className="text-xs text-ink-500 mt-1">Submit text, URLs, or screenshots for clinical analysis.</p>
          </div>

          <div
            onClick={() => navigate('/nutrition')}
            className="p-5 rounded-xl bg-white border border-ink-200/90 shadow-soft hover:border-verity-400 hover:shadow-card transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                <Apple className="w-5 h-5" />
              </div>
              <ChevronRight className="w-4 h-4 text-ink-400 group-hover:text-blue-700 group-hover:translate-x-0.5 transition-all" />
            </div>
            <h4 className="text-sm font-bold text-ink-900">Nutrition & Diets</h4>
            <p className="text-xs text-ink-500 mt-1">Assess glycemic index, macros, and diet claims.</p>
          </div>

          <div
            onClick={() => navigate('/products')}
            className="p-5 rounded-xl bg-white border border-ink-200/90 shadow-soft hover:border-verity-400 hover:shadow-card transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
                <ScanLine className="w-5 h-5" />
              </div>
              <ChevronRight className="w-4 h-4 text-ink-400 group-hover:text-purple-700 group-hover:translate-x-0.5 transition-all" />
            </div>
            <h4 className="text-sm font-bold text-ink-900">Product Scanner</h4>
            <p className="text-xs text-ink-500 mt-1">OCR label extraction and food additive hazard scan.</p>
          </div>

          <div
            onClick={() => navigate('/bmi')}
            className="p-5 rounded-xl bg-white border border-ink-200/90 shadow-soft hover:border-verity-400 hover:shadow-card transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                <Scale className="w-5 h-5" />
              </div>
              <ChevronRight className="w-4 h-4 text-ink-400 group-hover:text-amber-700 group-hover:translate-x-0.5 transition-all" />
            </div>
            <h4 className="text-sm font-bold text-ink-900">BMI & Metabolic Calc</h4>
            <p className="text-xs text-ink-500 mt-1">Personalized cardiometabolic guidance and calorie goals.</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Verifications & Trending Myths */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (8 cols): Recent Verifications */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-ink-900 font-mono">
              Recent Verifications
            </h3>
            <Link to="/history" className="text-xs font-semibold text-verity-700 hover:text-verity-900">
              View All History →
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-ink-200/90 shadow-soft overflow-hidden">
            {isLoading ? (
              <div className="p-8 text-center text-xs text-ink-400">Loading evidence logs...</div>
            ) : recentVerifications.length === 0 ? (
              <div className="p-8 text-center space-y-3">
                <p className="text-xs text-ink-500">No verifications recorded yet.</p>
                <Link to="/verify">
                  <Button variant="verity" size="sm">Verify Your First Claim</Button>
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-ink-100">
                {recentVerifications.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => navigate(`/verify?q=${encodeURIComponent(item.query)}`)}
                    className="p-5 hover:bg-background-subtle/70 transition-colors cursor-pointer space-y-2 group text-left"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-ink-100 text-ink-700">
                          {item.category.replace('_', ' ')}
                        </span>
                        <VerdictBadge verdict={item.verdict} size="sm" />
                      </div>
                      <span className="text-[11px] font-mono text-ink-400">
                        {new Date(item.timestamp).toLocaleDateString()}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-ink-900 group-hover:text-verity-800 transition-colors">
                      {item.query}
                    </h4>

                    <p className="text-xs text-ink-600 line-clamp-2 leading-relaxed">
                      {item.executiveSummary}
                    </p>

                    <div className="flex items-center gap-4 text-[11px] font-mono text-ink-500 pt-1">
                      <span>Score: <strong className="text-ink-800">{item.confidenceScore}%</strong></span>
                      <span>•</span>
                      <span>{item.citations.length} Indexed Citations</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (4 cols): Trending Myths & Fact-Check Spotlight */}
        <div className="lg:col-span-4 space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-ink-900 font-mono">
              Live Myth Wire
            </h3>

            <div className="space-y-3">
              {TRENDING_MYTHS.slice(0, 3).map((myth) => (
                <div
                  key={myth.id}
                  onClick={() => navigate(`/verify?q=${encodeURIComponent(myth.claim)}`)}
                  className="p-4 rounded-xl bg-white border border-ink-200/80 shadow-2xs hover:shadow-soft hover:border-verity-400 transition-all cursor-pointer text-left space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-semibold uppercase text-ink-400">
                      {myth.category}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-ink-800">
                      {myth.verdict === 'false_debunked' && '🛑 DEBUNKED'}
                      {myth.verdict === 'misleading_nuanced' && '⚠️ NUANCED'}
                      {myth.verdict === 'confirmed_true' && '✅ VERIFIED'}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-ink-900 leading-snug">
                    "{myth.claim}"
                  </p>
                  <p className="text-[11px] text-ink-600 line-clamp-2">
                    {myth.summary}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Daily Clinical Spotlight Card */}
          <div className="p-5 rounded-2xl bg-ink-900 text-white shadow-elevated space-y-3 text-left">
            <div className="flex items-center gap-2 text-verity-400 text-xs font-mono font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>CLINICAL PEARL OF THE DAY</span>
            </div>
            <h4 className="text-sm font-bold font-sans">
              "Serum Creatinine vs Cystatin C in Kidney Evaluation"
            </h4>
            <p className="text-xs text-ink-300 leading-relaxed font-sans">
              High dietary protein or creatine supplementation elevates serum creatinine without reducing glomerular filtration. Use Cystatin C for definitive confirmation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
