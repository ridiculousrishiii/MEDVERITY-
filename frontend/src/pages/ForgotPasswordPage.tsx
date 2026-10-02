import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../components/common/Logo';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { authService } from '../services/authService';
import { useToast } from '../context/ToastContext';
import { Mail, CheckCircle2, ArrowLeft } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { addToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      await authService.requestPasswordReset(email);
      setIsSubmitted(true);
      addToast({
        type: 'success',
        title: 'Reset Link Dispatched',
        message: 'A secure recovery link has been sent to your email.',
      });
    } catch {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to send reset link.',
      });
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
            Password Recovery
          </h1>
          <p className="text-xs text-ink-500 font-sans">
            Enter your email to receive a password reset authentication token
          </p>
        </div>

        <div className="p-8 rounded-2xl bg-white border border-ink-200/90 shadow-card text-left">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Registered Email Address"
                type="email"
                placeholder="name@institution.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4" />}
                required
              />

              <Button
                type="submit"
                variant="verity"
                size="lg"
                isLoading={isLoading}
                className="w-full mt-2"
              >
                Send Password Reset Token
              </Button>
            </form>
          ) : (
            <div className="text-center py-4 space-y-3">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-ink-900">Check Your Inbox</h3>
              <p className="text-xs text-ink-600 leading-relaxed">
                We've sent recovery instructions to <strong>{email}</strong>. Follow the link to establish a new password.
              </p>
            </div>
          )}

          <div className="mt-6 pt-5 border-t border-ink-100 text-center text-xs">
            <Link
              to="/login"
              className="inline-flex items-center gap-1 font-bold text-verity-700 hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Sign In</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
