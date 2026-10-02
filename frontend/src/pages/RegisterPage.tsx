import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from '../components/common/Logo';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { useAuth } from '../context/AuthContext';
import { RegisterPayload } from '../services/authService';
import { ShieldCheck, Mail, Lock, User, ArrowRight, Building } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<RegisterPayload['role']>('Healthcare Professional');
  const [institution, setInstitution] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    setIsLoading(true);
    try {
      await register({
        name,
        email,
        password,
        role,
        institution,
      });
      navigate('/dashboard');
    } catch {
      // Toast handled in auth context
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center py-10 px-4 animate-fade-in">
      <div className="w-full max-w-lg space-y-6 text-center">
        <div className="flex justify-center mb-2">
          <Logo size="lg" />
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold text-ink-900 tracking-tight font-sans">
            Create your MEDVERITY Account
          </h1>
          <p className="text-xs text-ink-500 font-sans">
            Join the clinical intelligence network for medical researchers and patients
          </p>
        </div>

        <div className="p-8 rounded-2xl bg-white border border-ink-200/90 shadow-card text-left">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name & Title"
              placeholder="e.g. Dr. Alex Morgan, MD or Jane Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              leftIcon={<User className="w-4 h-4" />}
              required
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="name@organization.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
              required
            />

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink-700">
                Primary Clinical Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as RegisterPayload['role'])}
                className="w-full bg-white border border-ink-200 rounded-lg p-2.5 text-sm text-ink-900 focus:outline-none focus:ring-2 focus:ring-verity-500/20"
              >
                <option value="Healthcare Professional">Healthcare Professional / Physician / Dietitian</option>
                <option value="Academic Researcher">Academic Researcher / Bio-Scientist</option>
                <option value="Medical Student">Medical / Nursing Student</option>
                <option value="General User">Informed Patient / Health Consumer</option>
              </select>
            </div>

            <Input
              label="Affiliated Institution (Optional)"
              placeholder="e.g. Harvard Medical School, Mayo Clinic, Self"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              leftIcon={<Building className="w-4 h-4" />}
            />

            <Input
              label="Create Secure Password"
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
              required
            />

            <Button
              type="submit"
              variant="verity"
              size="lg"
              isLoading={isLoading}
              className="w-full mt-2"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Complete Registration
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-ink-100 text-center text-xs text-ink-500">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-verity-700 hover:underline">
              Sign in here
            </Link>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-[11px] font-mono text-ink-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Open Evidence Platform • Compliant with Biomedical Standards</span>
        </div>
      </div>
    </div>
  );
};
