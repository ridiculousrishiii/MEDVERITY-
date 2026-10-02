import React from 'react';
import { useToast } from '../../context/ToastContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />,
          error: <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />,
          warning: <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />,
          info: <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />,
        };

        const borderStyles = {
          success: 'border-emerald-200 bg-white shadow-card',
          error: 'border-rose-200 bg-white shadow-card',
          warning: 'border-amber-200 bg-white shadow-card',
          info: 'border-blue-200 bg-white shadow-card',
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start justify-between gap-3 p-3.5 rounded-xl border ${borderStyles[toast.type]} animate-slide-up transition-all`}
          >
            <div className="flex items-start gap-2.5">
              {icons[toast.type]}
              <div>
                <h4 className="text-xs font-bold text-ink-900 leading-snug">{toast.title}</h4>
                {toast.message && <p className="text-xs text-ink-600 mt-0.5 leading-normal">{toast.message}</p>}
              </div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-ink-400 hover:text-ink-700 p-0.5 rounded transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
