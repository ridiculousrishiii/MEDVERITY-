import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/layout/PageHeader';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { VerdictBadge } from '../components/common/Badge';
import { Drawer } from '../components/common/Drawer';
import { VerdictCard } from '../components/verification/VerdictCard';
import { CitationList } from '../components/verification/CitationList';
import { ClaimBreakdownView } from '../components/verification/ClaimBreakdownView';
import { historyService } from '../services/historyService';
import { VerificationResult } from '../types';
import { useToast } from '../context/ToastContext';
import {
  History,
  Search,
  Download,
  Trash2,
  Bookmark,
  Eye,
  RotateCw,
} from 'lucide-react';

export const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [items, setItems] = useState<VerificationResult[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [verdictFilter, setVerdictFilter] = useState('all');
  const [onlySaved, setOnlySaved] = useState(false);
  const [selectedItem, setSelectedItem] = useState<VerificationResult | null>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const data = await historyService.getAll();
    setItems(data);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = await historyService.deleteItem(id);
    setItems(updated);
    if (selectedItem?.id === id) setSelectedItem(null);
    addToast({
      type: 'info',
      title: 'Item Deleted',
      message: 'Verification record removed from local storage.',
    });
  };

  const handleExportJson = () => {
    historyService.exportAsJson(items);
    addToast({ type: 'success', title: 'Export Generated', message: 'Downloaded history JSON.' });
  };

  const handleExportCsv = () => {
    historyService.exportAsCsv(items);
    addToast({ type: 'success', title: 'Export Generated', message: 'Downloaded history CSV.' });
  };

  // Filter items
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.query.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.executiveSummary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesVerdict = verdictFilter === 'all' || item.verdict === verdictFilter;
    const matchesSaved = !onlySaved || !!item.saved;
    return matchesSearch && matchesCategory && matchesVerdict && matchesSaved;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        badgeText="CLINICAL AUDIT LOG"
        badgeVariant="verity"
        title="Verification History & Saved Reports"
        description="Filter past evidence assessments, re-inspect full clinical citations, and batch export structured reports."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCsv}
              leftIcon={<Download className="w-3.5 h-3.5" />}
            >
              Export CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportJson}
              leftIcon={<Download className="w-3.5 h-3.5" />}
            >
              Export JSON
            </Button>
          </div>
        }
      />

      {/* Filter Bar */}
      <div className="p-5 rounded-2xl bg-white border border-ink-200/90 shadow-soft space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-5">
            <Input
              placeholder="Filter by keyword or claim text..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-white border border-ink-200 rounded-lg p-2.5 text-xs font-semibold text-ink-800 focus:outline-none"
            >
              <option value="all">All Domains</option>
              <option value="general_health">General Health</option>
              <option value="pharmacology">Pharmacology & Supplements</option>
              <option value="nutrition">Nutrition & Dietetics</option>
              <option value="viral_trend">Social Media Trends</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <select
              value={verdictFilter}
              onChange={(e) => setVerdictFilter(e.target.value)}
              className="w-full bg-white border border-ink-200 rounded-lg p-2.5 text-xs font-semibold text-ink-800 focus:outline-none"
            >
              <option value="all">All Verdicts</option>
              <option value="confirmed_true">Verified Facts</option>
              <option value="false_debunked">Debunked / False</option>
              <option value="misleading_nuanced">Nuanced / Misleading</option>
              <option value="unproven_inconclusive">Inconclusive</option>
            </select>
          </div>

          <div className="md:col-span-2 flex items-center justify-end">
            <button
              onClick={() => setOnlySaved(!onlySaved)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-colors ${
                onlySaved
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-background-subtle text-ink-600 border-ink-200'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${onlySaved ? 'fill-current' : ''}`} />
              <span>Saved Only</span>
            </button>
          </div>
        </div>
      </div>

      {/* History Items List */}
      <div className="bg-white rounded-2xl border border-ink-200/90 shadow-soft overflow-hidden">
        {filteredItems.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <History className="w-10 h-10 text-ink-300 mx-auto" />
            <h4 className="text-sm font-bold text-ink-800">No matching verification records</h4>
            <p className="text-xs text-ink-500 max-w-sm mx-auto">
              Try adjusting your domain filters or search query to find past medical analyses.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-ink-100">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="p-5 sm:p-6 hover:bg-background-subtle/70 transition-colors cursor-pointer space-y-3 group text-left"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-ink-100 text-ink-700 font-semibold">
                      {item.category.replace('_', ' ')}
                    </span>
                    <VerdictBadge verdict={item.verdict} size="sm" />
                    {item.saved && (
                      <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-200">
                        Bookmarked
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-ink-400">
                      {new Date(item.timestamp).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                    </span>
                    <button
                      onClick={(e) => handleDelete(item.id, e)}
                      className="text-ink-400 hover:text-rose-600 p-1 rounded transition-colors"
                      title="Delete record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-base font-bold text-ink-900 group-hover:text-verity-800 transition-colors">
                  "{item.query}"
                </h3>

                <p className="text-xs text-ink-600 line-clamp-2 leading-relaxed">
                  {item.executiveSummary}
                </p>

                <div className="flex items-center justify-between pt-1 border-t border-ink-100 text-[11px] font-mono text-ink-500">
                  <div className="flex items-center gap-3">
                    <span>Evidence Confidence: <strong>{item.confidenceScore}%</strong></span>
                    <span>•</span>
                    <span>{item.citations.length} Indexed Studies</span>
                  </div>
                  <span className="text-verity-700 font-semibold group-hover:underline flex items-center gap-1">
                    <Eye className="w-3 h-3" /> Quick Inspect
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detailed Inspection Drawer */}
      <Drawer
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        title="Clinical Assessment Detail"
        subtitle={selectedItem ? `ID: ${selectedItem.id}` : undefined}
        width="xl"
      >
        {selectedItem && (
          <div className="space-y-6 animate-fade-in text-left">
            <div className="flex items-center justify-between">
              <Button
                variant="verity"
                size="sm"
                onClick={() => navigate(`/verify?q=${encodeURIComponent(selectedItem.query)}`)}
                leftIcon={<RotateCw className="w-3.5 h-3.5" />}
              >
                Re-Analyze in Workspace
              </Button>
            </div>

            <VerdictCard
              verdict={selectedItem.verdict}
              verdictTitle={selectedItem.verdictTitle}
              confidenceScore={selectedItem.confidenceScore}
              executiveSummary={selectedItem.executiveSummary}
              verifiedByAiModel={selectedItem.verifiedByAiModel}
              timestamp={selectedItem.timestamp}
            />

            <ClaimBreakdownView breakdown={selectedItem.claimBreakdown} />

            <CitationList citations={selectedItem.citations} />
          </div>
        )}
      </Drawer>
    </div>
  );
};
