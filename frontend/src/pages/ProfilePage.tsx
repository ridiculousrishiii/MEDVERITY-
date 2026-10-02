import React, { useState } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Badge } from '../components/common/Badge';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import {
  User,
  Sliders,
  Bell,
  Save,
  CheckCircle2,
  Zap,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { isMockMode, setIsMockMode, citationFormat, setCitationFormat } = useSettings();

  const [name, setName] = useState(user?.name || 'Dr. Sarah Lin, MD');
  const [email, setEmail] = useState(user?.email || 's.lin@medverity-health.org');
  const [institution, setInstitution] = useState(user?.institution || 'Johns Hopkins Medicine');
  const [specialty, setSpecialty] = useState(user?.specialty || 'Internal Medicine & Preventive Cardiology');
  const [strictness, setStrictness] = useState(user?.preferences?.strictnessLevel || 'conservative');
  const [emailAlerts, setEmailAlerts] = useState(user?.preferences?.emailAlerts ?? true);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      name,
      email,
      institution,
      specialty,
      preferences: {
        mockMode: isMockMode,
        emailAlerts,
        citationFormat,
        strictnessLevel: strictness as 'conservative' | 'balanced' | 'broad',
      },
    });
  };

  return (
    <div className="space-y-8 animate-fade-in text-left">
      <PageHeader
        badgeText="PRACTITIONER SETTINGS"
        badgeVariant="verity"
        title="Profile & Clinical Preferences"
        description="Configure your medical research credentials, citation styling preferences, and AI inference pipeline modes."
      />

      <form onSubmit={handleSave} className="space-y-8">
        {/* 12-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column (7 cols): User Credentials */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-ink-200/90 shadow-card space-y-6">
              <div className="flex items-center gap-4 border-b border-ink-100 pb-6">
                <img
                  src={user?.avatarUrl || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300'}
                  alt={name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-emerald-500 shadow-soft"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-ink-900">{name}</h2>
                    {user?.verifiedBadge && (
                      <Badge variant="verity" size="sm" dot>
                        Verified Clinician
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs font-mono text-ink-500">{email}</p>
                </div>
              </div>

              <div className="space-y-4">
                <Input
                  label="Full Name / Academic Title"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  leftIcon={<User className="w-4 h-4" />}
                />

                <Input
                  label="Institutional Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Primary Institution / Hospital"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                  />
                  <Input
                    label="Medical Specialty / Focus"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Notification Preferences */}
            <div className="p-6 rounded-2xl bg-white border border-ink-200/90 shadow-soft space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-ink-900 font-mono flex items-center gap-2">
                <Bell className="w-4 h-4 text-ink-500" />
                Evidence Surveillance Alerts
              </h3>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="w-4 h-4 text-verity-600 rounded border-ink-300 focus:ring-verity-500"
                />
                <span className="text-xs text-ink-700">
                  Receive weekly digests of debunked viral health trends in my specialty
                </span>
              </label>
            </div>
          </div>

          {/* Right Column (5 cols): AI Engine & Citation Settings */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl bg-white border border-ink-200/90 shadow-card space-y-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-ink-900 font-mono flex items-center gap-2">
                <Sliders className="w-4 h-4 text-verity-600" />
                Inference & Evidence Rigor
              </h3>

              {/* Mock Engine Toggle */}
              <div className="p-4 rounded-xl bg-background-subtle border border-ink-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-ink-900">Engine Source Mode</span>
                  <Badge variant={isMockMode ? 'verity' : 'sapphire'} size="sm">
                    {isMockMode ? 'Simulated AI' : 'Live FastAPI'}
                  </Badge>
                </div>
                <p className="text-[11px] text-ink-500 leading-relaxed">
                  Switch between offline simulated biomedical consensus and live FastAPI endpoint (<code>http://localhost:8000/api</code>).
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsMockMode(!isMockMode)}
                  leftIcon={<Zap className="w-3.5 h-3.5" />}
                  className="mt-2 w-full text-xs"
                >
                  Switch to {isMockMode ? 'Live API Backend' : 'Simulated Engine'}
                </Button>
              </div>

              {/* Citation Format */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase text-ink-700 font-mono">
                  Preferred Citation Schema
                </label>
                <select
                  value={citationFormat}
                  onChange={(e) => setCitationFormat(e.target.value as 'APA' | 'Vancouver' | 'AMA')}
                  className="w-full bg-white border border-ink-200 rounded-lg p-2.5 text-xs font-semibold text-ink-800 focus:outline-none"
                >
                  <option value="Vancouver">Vancouver Style (Biomedical Default)</option>
                  <option value="AMA">American Medical Association (AMA)</option>
                  <option value="APA">APA 7th Edition</option>
                </select>
              </div>

              {/* Strictness Level */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase text-ink-700 font-mono">
                  Evidence Threshold Level
                </label>
                <select
                  value={strictness}
                  onChange={(e) => setStrictness(e.target.value as 'conservative' | 'balanced' | 'broad')}
                  className="w-full bg-white border border-ink-200 rounded-lg p-2.5 text-xs font-semibold text-ink-800 focus:outline-none"
                >
                  <option value="conservative">Conservative (Level 1 Systematic Reviews Only)</option>
                  <option value="balanced">Balanced (Meta-Analyses + Large Cohorts)</option>
                  <option value="broad">Broad (Includes Observational & Emerging Trials)</option>
                </select>
              </div>
            </div>

            {/* Compliance Confirmation */}
            <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900 space-y-2">
              <div className="flex items-center gap-1.5 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Verified Clinical User</span>
              </div>
              <p className="leading-snug">
                Your account is accredited for evidence exports and automated DOI metadata retrieval.
              </p>
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-ink-200/70">
          <Button
            type="submit"
            variant="verity"
            size="md"
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save All Preferences
          </Button>
        </div>
      </form>
    </div>
  );
};
