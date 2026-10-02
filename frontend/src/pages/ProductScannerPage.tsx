import React, { useState, useRef } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { AdditiveRiskTable } from '../components/product/AdditiveRiskTable';
import { productService } from '../services/productService';
import { ProductScanResult } from '../types';
import { useToast } from '../context/ToastContext';
import {
  ScanLine,
  Sparkles,
  Camera,
  Barcode,
  CheckCircle2,
  FileText,
  X,
} from 'lucide-react';

export const ProductScannerPage: React.FC = () => {
  const { addToast } = useToast();
  const [productQuery, setProductQuery] = useState('Electrolyte Energy Hydro-Blast');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ProductScanResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setProductQuery(`OCR Scan: ${file.name.replace(/\.[^/.]+$/, "")}`);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleScan = async (queryToUse?: string) => {
    const q = queryToUse || productQuery;
    if (!q.trim() && !imageFile) {
      addToast({
        type: 'warning',
        title: 'Input Required',
        message: 'Please enter a product name, barcode, or upload a label photo.',
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await productService.scanProduct(q, imageFile);
      setResult(res);
      addToast({
        type: 'success',
        title: 'Product Scan Completed',
        message: `Evaluated ${res.ingredientsList.length} ingredients for safety & additives.`,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Scan error';
      addToast({
        type: 'error',
        title: 'Scan Error',
        message: msg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sampleProducts = [
    'Electrolyte Energy Hydro-Blast 500ml',
    'Ultra-Pure Collagen Peptides + Hyaluronic Acid',
    '8901234567890 (Energy Drink Barcode)',
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        badgeText="OCR & TOXICOLOGY"
        badgeVariant="sapphire"
        title="Product & Ingredient Label Scanner"
        description="Extract ingredients from packaged foods, supplements, and cosmetics via OCR to detect harmful E-numbers, banned dyes, and artificial sweeteners."
      />

      {/* Input Formulation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left (7 cols): Text or Barcode Search */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl bg-white border border-ink-200/90 shadow-card space-y-4">
          <Input
            label="Product Name, Brand, or Barcode Number"
            placeholder="e.g. Energy Drink 500ml, 8901234567890, Collagen Powder..."
            value={productQuery}
            onChange={(e) => setProductQuery(e.target.value)}
            leftIcon={<Barcode className="w-4 h-4" />}
          />

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-mono text-ink-400">Samples:</span>
              {sampleProducts.map((p, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setProductQuery(p);
                    handleScan(p);
                  }}
                  className="text-xs text-ink-700 bg-background-subtle border border-ink-200 hover:border-verity-400 px-2 py-1 rounded transition-colors"
                >
                  {p.split(' ')[0]}
                </button>
              ))}
            </div>

            <Button
              variant="verity"
              size="md"
              isLoading={isLoading}
              onClick={() => handleScan()}
              leftIcon={<Sparkles className="w-4 h-4" />}
            >
              Analyze Label
            </Button>
          </div>
        </div>

        {/* Right (5 cols): OCR Image Upload Box */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-white border border-ink-200/90 shadow-card flex flex-col justify-center">
          {!imagePreview ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-ink-300 hover:border-verity-500 rounded-xl p-6 text-center cursor-pointer bg-background-subtle/60 hover:bg-verity-50/20 transition-all flex flex-col items-center justify-center h-full min-h-[140px]"
            >
              <Camera className="w-7 h-7 text-ink-400 mb-2" />
              <p className="text-xs font-bold text-ink-900">Upload / Snap Ingredient Label</p>
              <p className="text-[11px] text-ink-500 mt-1">Automatic optical character recognition (OCR)</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          ) : (
            <div className="relative rounded-xl border border-ink-200 bg-background-subtle p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={imagePreview}
                  alt="Label preview"
                  className="w-14 h-14 object-cover rounded-lg border border-ink-200"
                />
                <div>
                  <p className="text-xs font-bold text-ink-900">{imageFile?.name}</p>
                  <p className="text-[10px] font-mono text-emerald-700 font-semibold">
                    OCR Image Attached
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
      </div>

      {/* Results View */}
      {result && !isLoading && (
        <div className="space-y-8 animate-fade-in">
          {/* Top Score Banner */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-ink-200/90 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase px-2.5 py-0.5 rounded bg-ink-100 text-ink-700">
                  {result.category}
                </span>
                <span className="text-xs font-mono text-ink-500">
                  Scanned: {new Date(result.scannedAt).toLocaleDateString()}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-ink-900">{result.productName}</h2>
              <p className="text-xs sm:text-sm text-ink-600 max-w-2xl leading-relaxed pt-1">
                {result.summary}
              </p>
            </div>

            <div className="flex items-center gap-4 shrink-0 font-mono">
              <div className="p-4 rounded-xl bg-background-subtle border border-ink-100 text-center">
                <span className="block text-3xl font-black text-ink-900">{result.safetyScore}/100</span>
                <span className="text-[10px] text-ink-500 uppercase">Toxicology Score</span>
              </div>
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                <span className="block text-3xl font-black text-emerald-800">{result.cleanScore}/100</span>
                <span className="text-[10px] text-emerald-700 uppercase font-bold">Clean Rating</span>
              </div>
            </div>
          </div>

          {/* 12-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left 8 cols: Additives Table & OCR Extracted Text */}
            <div className="lg:col-span-8 space-y-6">
              <AdditiveRiskTable ingredients={result.ingredientsList} />

              {/* Raw OCR Text */}
              {result.ocrExtractedText && (
                <div className="p-5 rounded-xl bg-white border border-ink-200/80 shadow-soft space-y-2 text-left">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-ink-500" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-ink-900 font-mono">
                      Extracted Label Text (OCR Output)
                    </h4>
                  </div>
                  <p className="text-xs font-mono text-ink-700 bg-background-subtle p-3 rounded-lg border border-ink-100 leading-relaxed">
                    {result.ocrExtractedText}
                  </p>
                </div>
              )}
            </div>

            {/* Right 4 cols: Recommendations & Toxicology Standards */}
            <div className="lg:col-span-4 space-y-6">
              <div className="p-6 rounded-xl bg-white border border-ink-200/90 shadow-soft space-y-3 text-left">
                <h4 className="text-xs font-bold uppercase tracking-wider text-ink-900 font-mono flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Product Recommendations
                </h4>
                <ul className="space-y-2">
                  {result.recommendations.map((rec: string, i: number) => (
                    <li key={i} className="text-xs text-ink-700 flex items-start gap-2 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Global Standards Card */}
              <div className="p-5 rounded-xl bg-background-subtle border border-ink-200 text-left space-y-2">
                <span className="text-xs font-mono uppercase tracking-wider text-ink-600 font-bold block">
                  Regulatory Compliance Database
                </span>
                <p className="text-xs text-ink-600 leading-relaxed">
                  Cross-checked against European Food Safety Authority (EFSA), US FDA Generally Recognized as Safe (GRAS) list, and WHO Codex Alimentarius.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
