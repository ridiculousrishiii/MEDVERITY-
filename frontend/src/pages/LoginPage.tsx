import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from '../components/common/Logo';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Mail, Lock, ArrowRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('s.lin@medverity-health.org');
  const [password, setPassword] = useState('••••••••••••');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      await login({ email, password, rememberMe });
      navigate('/dashboard');
    } catch {
      // toast is handled in auth context
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center py-10 px-4 animate-fade-in">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="flex justify-center mb-2">
          <Logo size="lg" />
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold text-ink-900 tracking-tight font-sans">
            Sign in to MEDVERITY
          </h1>
          <p className="text-xs text-ink-500 font-sans">
            Access peer-reviewed health intelligence & verification archives
          </p>
        </div>

        <div className="p-8 rounded-2xl bg-white border border-ink-200/90 shadow-card text-left">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="name@institution.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
              required
            />

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-ink-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-ink-300 text-verity-600 focus:ring-verity-500"
                />
                <span>Remember session</span>
              </label>

              <Link
                to="/forgot-password"
                className="font-medium text-verity-700 hover:text-verity-900 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="verity"
              size="lg"
              isLoading={isLoading}
              className="w-full mt-2"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In to Platform
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-ink-100 text-center text-xs text-ink-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-verity-700 hover:underline">
              Create one here
            </Link>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-[11px] font-mono text-ink-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>256-bit Encrypted Medical Session</span>
        </div>
      </div>
    </div>
  );
};
