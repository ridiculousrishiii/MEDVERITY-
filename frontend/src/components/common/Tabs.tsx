import React, { ReactNode } from 'react';

export interface TabItem {
  id: string;
  label: string;
  icon?: ReactNode;
  count?: number;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange, className = '' }) => {
  return (
    <div className={`flex border-b border-ink-200 gap-1 overflow-x-auto ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-2 py-3 px-4 text-sm font-medium border-b-2 whitespace-nowrap transition-all duration-150 ${
              isActive
                ? 'border-verity-600 text-ink-900 font-semibold bg-verity-50/40 rounded-t-lg'
                : 'border-transparent text-ink-500 hover:text-ink-800 hover:border-ink-300'
            }`}
          >
            {tab.icon && (
              <span className={isActive ? 'text-verity-600' : 'text-ink-400'}>{tab.icon}</span>
            )}
            <span>{tab.label}</span>
            {typeof tab.count === 'number' && (
              <span
                className={`text-[11px] font-mono px-2 py-0.5 rounded-full ${
                  isActive ? 'bg-verity-100 text-verity-800' : 'bg-ink-100 text-ink-600'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
