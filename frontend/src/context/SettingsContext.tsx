import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { API_CONFIG } from '../services/api';
import { useToast } from './ToastContext';

interface SettingsContextType {
  isMockMode: boolean;
  setIsMockMode: (val: boolean) => void;
  citationFormat: 'APA' | 'Vancouver' | 'AMA';
  setCitationFormat: (val: 'APA' | 'Vancouver' | 'AMA') => void;
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (val: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isMockMode, setIsMockModeState] = useState<boolean>(true);
  const [citationFormat, setCitationFormatState] = useState<'APA' | 'Vancouver' | 'AMA'>('Vancouver');
  const [commandPaletteOpen, setCommandPaletteOpen] = useState<boolean>(false);
  const { addToast } = useToast();

  useEffect(() => {
    const savedMock = localStorage.getItem('medverity_mock_mode');
    if (savedMock !== null) {
      const parsed = savedMock === 'true';
      setIsMockModeState(parsed);
      API_CONFIG.isMockEnabled = parsed;
    }
  }, []);

  const setIsMockMode = (val: boolean) => {
    setIsMockModeState(val);
    API_CONFIG.isMockEnabled = val;
    localStorage.setItem('medverity_mock_mode', String(val));
    addToast({
      type: 'info',
      title: val ? 'Simulated AI Engine Active' : 'Live FastAPI Backend Mode',
      message: val
        ? 'Using integrated biomedical literature simulation database.'
        : `Connecting to ${API_CONFIG.baseUrl}`,
    });
  };

  const setCitationFormat = (format: 'APA' | 'Vancouver' | 'AMA') => {
    setCitationFormatState(format);
    localStorage.setItem('medverity_citation_format', format);
  };

  // Global Keyboard Shortcut for Command Palette (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        isMockMode,
        setIsMockMode,
        citationFormat,
        setCitationFormat,
        commandPaletteOpen,
        setCommandPaletteOpen,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
