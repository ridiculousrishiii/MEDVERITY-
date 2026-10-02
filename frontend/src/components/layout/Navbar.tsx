import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Logo } from '../common/Logo';
import { Button } from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import {
  Sparkles,
  Search,
  Menu,
  X,
  User as UserIcon,
  LogOut,
  ShieldCheck,
  Apple,
  ScanLine,
  Scale,
  History,
  LayoutDashboard,
  Zap,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { setCommandPaletteOpen, isMockMode, setIsMockMode } = useSettings();

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { name: 'Myth Verifier', path: '/verify', icon: <Sparkles className="w-4 h-4" /> },
    { name: 'Nutrition', path: '/nutrition', icon: <Apple className="w-4 h-4" /> },
    { name: 'Product Scanner', path: '/products', icon: <ScanLine className="w-4 h-4" /> },
    { name: 'BMI Calc', path: '/bmi', icon: <Scale className="w-4 h-4" /> },
    { name: 'History', path: '/history', icon: <History className="w-4 h-4" /> },
  ];

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-ink-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Logo size="md" />
            
            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-tight transition-all duration-150 ${
                      isActive
                        ? 'bg-ink-900 text-white shadow-sm'
                        : 'text-ink-600 hover:text-ink-900 hover:bg-ink-100/70'
                    }`}
                  >
                    {link.icon}
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Action Items */}
          <div className="flex items-center gap-2.5">
            {/* Command Palette Trigger */}
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 text-xs text-ink-500 bg-background-subtle border border-ink-200 rounded-lg hover:border-ink-300 hover:bg-ink-100 transition-colors shadow-soft"
              aria-label="Open Command Search"
            >
              <Search className="w-3.5 h-3.5 text-ink-400" />
              <span>Search claims...</span>
              <kbd className="font-mono text-[10px] bg-white text-ink-600 px-1.5 py-0.5 rounded border border-ink-200 shadow-2xs">
                ⌘K
              </kbd>
            </button>

            {/* Quick Engine Mode Badge */}
            <button
              onClick={() => setIsMockMode(!isMockMode)}
              title={isMockMode ? "Click to toggle Live API mode" : "Click to toggle Simulated Mode"}
              className={`hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium border transition-colors ${
                isMockMode
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                  : 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100'
              }`}
            >
              <Zap className="w-3 h-3" />
              <span>{isMockMode ? 'SIMULATED AI' : 'LIVE API'}</span>
            </button>

            {/* Verify CTA Button */}
            <Link to="/verify">
              <Button
                variant="verity"
                size="sm"
                leftIcon={<Sparkles className="w-3.5 h-3.5" />}
                className="hidden sm:inline-flex"
              >
                Verify Claim
              </Button>
            </Link>

            {/* User Dropdown / Auth CTA */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-lg border border-ink-200 hover:border-ink-300 hover:bg-ink-50 transition-colors"
                >
                  <img
                    src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover border border-ink-200"
                  />
                  <span className="text-xs font-semibold text-ink-800 hidden md:inline truncate max-w-[100px]">
                    {user.name.split(' ')[0]}
                  </span>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-elevated border border-ink-200 p-2 z-50 animate-slide-up">
                    <div className="px-3 py-2 border-b border-ink-100">
                      <p className="text-xs font-bold text-ink-900 truncate">{user.name}</p>
                      <p className="text-[11px] text-ink-500 font-mono truncate">{user.email}</p>
                      <div className="mt-1.5 flex items-center gap-1 text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 w-fit">
                        <ShieldCheck className="w-3 h-3" />
                        <span>{user.role}</span>
                      </div>
                    </div>
                    <div className="pt-1.5 space-y-0.5">
                      <Link
                        to="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs text-ink-700 hover:bg-ink-100 rounded-lg transition-colors"
                      >
                        <UserIcon className="w-3.5 h-3.5 text-ink-500" />
                        <span>Profile & Preferences</span>
                      </Link>
                      <Link
                        to="/history"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs text-ink-700 hover:bg-ink-100 rounded-lg transition-colors"
                      >
                        <History className="w-3.5 h-3.5 text-ink-500" />
                        <span>Saved Reports</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-700 hover:bg-rose-50 rounded-lg transition-colors text-left"
                      >
                        <LogOut className="w-3.5 h-3.5 text-rose-500" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    Join
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-ink-600 hover:text-ink-900 rounded-lg hover:bg-ink-100 transition-colors"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-ink-200 py-4 px-2 space-y-1 animate-slide-up bg-white">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                    isActive
                      ? 'bg-ink-900 text-white font-semibold'
                      : 'text-ink-700 hover:bg-ink-100'
                  }`}
                >
                  {link.icon}
                  <span>{link.name}</span>
                </Link>
              );
            })}
            <div className="pt-3 border-t border-ink-100 mt-2 space-y-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setCommandPaletteOpen(true);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-ink-600 bg-background-subtle rounded-lg border border-ink-200"
              >
                <Search className="w-4 h-4 text-ink-400" />
                <span>Quick Search (⌘K)</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
