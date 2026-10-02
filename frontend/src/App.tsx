import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute } from './components/common/ProtectedRoute';

import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { VerifyPage } from './pages/VerifyPage';
import { NutritionPage } from './pages/NutritionPage';
import { ProductScannerPage } from './pages/ProductScannerPage';
import { BMICalculatorPage } from './pages/BMICalculatorPage';
import { HistoryPage } from './pages/HistoryPage';
import { ProfilePage } from './pages/ProfilePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const App: React.FC = () => {
  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <SettingsProvider>
            <AppLayout>
              <Routes>
                {/* Core Public & App Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                <Route path="/verify" element={<ProtectedRoute><VerifyPage /></ProtectedRoute>} />
                <Route path="/nutrition" element={<ProtectedRoute><NutritionPage /></ProtectedRoute>} />
                <Route path="/products" element={<ProtectedRoute><ProductScannerPage /></ProtectedRoute>} />
                <Route path="/bmi" element={<ProtectedRoute><BMICalculatorPage /></ProtectedRoute>} />
                <Route path="/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                
                {/* Auth Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />

                {/* Catch-all 404 */}
                <Route path="/404" element={<NotFoundPage />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
            </AppLayout>
          </SettingsProvider>
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
};

export default App;
