import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageHeader } from '../components/layout/PageHeader';
import { Button } from '../components/common/Button';
import { Input, Textarea } from '../components/common/Input';
import { VerificationSkeleton } from '../components/common/Skeleton';
import { VerdictCard } from '../components/verification/VerdictCard';
import { ConsensusMeter } from '../components/verification/ConsensusMeter';
import { CitationList } from '../components/verification/CitationList';
import { ClaimBreakdownView } from '../components/verification/ClaimBreakdownView';
import { ClinicalNuanceCard } from '../components/verification/ClinicalNuanceCard';
import { EvidencePanel } from '../components/verification/EvidencePanel';
import { verificationService, EnrichedVerificationResult } from '../services/verificationService';
import { useToast } from '../context/ToastContext';
import { AlertTriangle } from 'lucide-react';
import {
  Sparkles,
  Link as LinkIcon,
  Image as ImageIcon,
  Share2,
  Bookmark,
  Printer,
  Upload,
  X,
  FileSearch,
} from 'lucide-react';

export const VerifyPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const { addToast } = useToast();

  const [claimText, setClaimText] = useState(initialQuery);
  const [sourceUrl, setSourceUrl] = useState('');
  const [category, setCategory] = useState('general_health');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [inputMode, setInputMode] = useState<'text' | 'url' | 'image'>('text');

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<EnrichedVerificationResult | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-run if query param present
  useEffect(() => {
    if (initialQuery) {
      setClaimText(initialQuery);
      handleVerify(initialQuery);
    }
  }, [initialQuery]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      if (!claimText) {
        setClaimText(`Medical claim extracted from image: ${file.name}`);
      }
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleVerify = async (textToVerify?: string) => {
    const query = textToVerify || claimText;
    if (!query.trim()) {
      addToast({
        type: 'warning',
        title: 'Input Required',
        message: 'Please provide a health claim, URL, or screenshot to evaluate.',
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await verificationService.verifyClaim({
        query,
        sourceUrl: sourceUrl || undefined,
        imageFile,
        category,
      });
      setResult(res);
      setIsSaved(!!res.saved);
      addToast({
        type: 'success',
        title: 'Evidence Verification Complete',
        message: `Synthesized clinical consensus from peer-reviewed databases.`,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Verification failed';
      addToast({
        type: 'error',
        title: 'Verification Failed',
        message: msg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleSave = async () => {
    if (!result) return;
    try {
      const newSaved = await verificationService.toggleSaveVerification(result.id);
      setIsSaved(newSaved);
      addToast({
        type: 'info',
        title: newSaved ? 'Saved to History' : 'Removed from Saved',
        message: newSaved ? 'Report bookmarked in your history records.' : 'Report removed.',
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      addToast({
        type: 'success',
        title: 'Link Copied',
        message: 'Shareable verification report link copied to clipboard.',
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const sampleQuickClaims = [
    'Lemon water alkalizes your blood and cures cancer',
    'Creatine supplementation damages kidneys in healthy adults',
    'High dose Vitamin D3 cures autoimmune conditions',
    'Intermittent fasting 16:8 improves insulin sensitivity',
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        badgeText="CLINICAL NLP VERIFIER"
        badgeVariant="verity"
        title="Medical Myth & Claim Verification"
        description="Submit any health rumor, social media trend, supplement claim, or dietary advice to cross-reference against PubMed, Cochrane reviews, and clinical trial databases."
      />

      {/* Input Formulation Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-ink-200/90 shadow-card space-y-6">
        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-2 border-b border-ink-100 pb-4">
          <button
            onClick={() => setInputMode('text')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              inputMode === 'text'
                ? 'bg-ink-900 text-white shadow-sm'
                : 'text-ink-600 hover:bg-ink-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Claim Text</span>
          </button>
          <button
            onClick={() => setInputMode('url')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              inputMode === 'url'
                ? 'bg-ink-900 text-white shadow-sm'
                : 'text-ink-600 hover:bg-ink-100'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>Article / Video URL</span>
          </button>
          <button
            onClick={() => setInputMode('image')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              inputMode === 'image'
                ? 'bg-ink-900 text-white shadow-sm'
                : 'text-ink-600 hover:bg-ink-100'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Screenshot / Label Upload</span>
          </button>
        </div>

        {/* Input Controls */}
        <div className="space-y-4">
          {inputMode === 'text' && (
            <Textarea
              label="Health Claim or Medical Statement"
              placeholder="e.g. Taking 1000mg of Vitamin C prevents 100% of seasonal viral infections..."
              rows={3}
              value={claimText}
              onChange={(e) => setClaimText(e.target.value)}
            />
          )}

          {inputMode === 'url' && (
            <div className="space-y-3">
              <Input
                label="Article, TikTok or YouTube Link"
                placeholder="https://tiktok.com/@healthguru/video/... or news link"
                leftIcon={<LinkIcon className="w-4 h-4" />}
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
              />
              <Textarea
                label="Extracted / Associated Claim (Optional)"
                placeholder="Specify specific sentence to verify or leave blank to scrape full article"
                rows={2}
                value={claimText}
                onChange={(e) => setClaimText(e.target.value)}
              />
            </div>
          )}

          {inputMode === 'image' && (
            <div className="space-y-3">
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink-700">
                Upload Medical Infographic or Screenshot
              </label>
              {!imagePreview ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-ink-300 hover:border-verity-500 rounded-xl p-6 text-center cursor-pointer bg-background-subtle/60 hover:bg-verity-50/20 transition-all"
                >
                  <Upload className="w-8 h-8 text-ink-400 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-ink-800">
                    Click or drag image file here (PNG, JPG, WebP)
                  </p>
                  <p className="text-[11px] text-ink-500 mt-1">
                    OCR will extract text claims and verify against clinical literature
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="relative rounded-xl border border-ink-200 overflow-hidden bg-background-subtle p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={imagePreview}
                      alt="Uploaded screenshot"
                      className="w-14 h-14 object-cover rounded-lg border border-ink-200"
                    />
                    <div>
                      <p className="text-xs font-bold text-ink-900">{imageFile?.name}</p>
                      <p className="text-[10px] font-mono text-ink-500">
                        {Math.round((imageFile?.size || 0) / 1024)} KB • Ready for OCR Parsing
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={removeImage}
                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Category & Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase text-ink-500">Domain:</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-white border border-ink-200 rounded-lg text-xs font-medium px-3 py-1.5 text-ink-800 focus:outline-none focus:ring-2 focus:ring-verity-500/20"
              >
                <option value="general_health">General Health & Medicine</option>
                <option value="pharmacology">Pharmacology & Supplements</option>
                <option value="nutrition">Nutrition & Dietetics</option>
                <option value="viral_trend">Social Media Viral Trend</option>
                <option value="chronic_illness">Cardiology & Chronic Disease</option>
              </select>
            </div>

            <Button
              variant="verity"
              size="md"
              isLoading={isLoading}
              onClick={() => handleVerify()}
              leftIcon={<Sparkles className="w-4 h-4" />}
            >
              Verify Evidence
            </Button>
          </div>
        </div>

        {/* Sample claims quick bar */}
        <div className="pt-4 border-t border-ink-100 flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono text-ink-400">Try sample query:</span>
          {sampleQuickClaims.map((claim, idx) => (
            <button
              key={idx}
              onClick={() => {
                setClaimText(claim);
                handleVerify(claim);
              }}
              className="text-xs text-ink-700 bg-background-subtle border border-ink-200/80 hover:border-verity-400 hover:text-verity-900 px-2.5 py-1 rounded-md transition-all text-left"
            >
              {claim}
            </button>
          ))}
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && <VerificationSkeleton />}

      {/* Verification Results Section */}
      {!isLoading && result && (
        <div className="space-y-8 animate-fade-in">
          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-white rounded-xl border border-ink-200/80 shadow-soft">
            <div className="flex items-center gap-2">
              <FileSearch className="w-4 h-4 text-verity-600" />
              <span className="text-xs font-mono uppercase text-ink-600">
                REPORT ID: <strong className="text-ink-900">{result.id}</strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={isSaved ? 'verity' : 'outline'}
                size="sm"
                onClick={handleToggleSave}
                leftIcon={<Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />}
              >
                {isSaved ? 'Saved' : 'Bookmark'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                leftIcon={<Share2 className="w-3.5 h-3.5" />}
              >
                Share
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                leftIcon={<Printer className="w-3.5 h-3.5" />}
              >
                Print PDF
              </Button>
            </div>
          </div>

          {/* Core Verdict Card */}
          <VerdictCard
            verdict={result.verdict}
            verdictTitle={result.verdictTitle}
            confidenceScore={result.confidenceScore}
            executiveSummary={result.executiveSummary}
            verifiedByAiModel={result.verifiedByAiModel}
            timestamp={result.timestamp}
          />

          {/* 12-column Analysis Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column (8 cols): Breakdown, Evidence, Citations */}
            <div className="lg:col-span-8 space-y-8">
              {/* Claim Sentence Breakdown */}
              <ClaimBreakdownView breakdown={result.claimBreakdown} />

              {/* Real Evidence Panel from Backend */}
              {result.isFromBackend && result.backendEvidence && (
                <EvidencePanel
                  supporting={result.backendEvidence.supporting}
                  conflicting={result.backendEvidence.conflicting}
                  neutral={result.backendEvidence.neutral}
                />
              )}

              {/* Citations & Evidence List */}
              <CitationList citations={result.citations} />
            </div>

            {/* Right Column (4 cols): Consensus Meter & Clinical Context */}
            <div className="lg:col-span-4 space-y-6">
              <ConsensusMeter
                supports={result.consensusPercentage.supports}
                refutes={result.consensusPercentage.refutes}
                inconclusive={result.consensusPercentage.inconclusive}
              />

              <ClinicalNuanceCard
                clinicalContext={result.clinicalContext}
                nuanceExplanation={result.nuanceExplanation}
                scientificMechanism={result.scientificMechanism}
                potentialRisks={result.potentialRisks}
              />
            </div>
          </div>

          {/* Medical Disclaimer */}
          {result.isFromBackend && result.backendDisclaimer && (
            <div className="p-4 sm:p-5 rounded-xl bg-amber-50/60 border border-amber-200/80 shadow-soft">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 font-mono mb-1">
                    Medical Disclaimer
                  </h4>
                  <p className="text-xs sm:text-sm text-amber-800 leading-relaxed">
                    {result.backendDisclaimer}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
