import React, { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import OnboardingWizard from './components/OnboardingWizard';
import Dashboard from './components/Dashboard';
import Toast from './components/Toast';
import { useToast } from './hooks/useToast';

interface User {
  firstName: string;
  role: string;
  onboardingComplete: boolean;
  email?: string;
}

type AppState = 'login' | 'onboarding' | 'dashboard';

function App() {
  const { toast, showToast, hideToast } = useToast();
  const [appState, setAppState] = useState<AppState>('login');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for existing session
    const rememberToken = localStorage.getItem('muncho_remember_token');
    if (rememberToken) {
      const tokenData = JSON.parse(rememberToken);
      if (Date.now() < tokenData.expiry) {
        // Auto-login with remembered session
        const mockUser = { firstName: 'Akash', role: 'admin', onboardingComplete: false };
        setUser(mockUser);
        
        // Check onboarding status
        const onboardingComplete = localStorage.getItem('muncho_onboarding_complete') === 'true';
        const onboardingProgress = localStorage.getItem('muncho_onboarding_progress');
        
        if (onboardingComplete) {
          setAppState('dashboard');
        } else if (onboardingProgress) {
          setAppState('onboarding');
        } else {
          setAppState('onboarding');
        }
      } else {
        localStorage.removeItem('muncho_remember_token');
      }
    }
  }, []);

  const handleLoginSuccess = (userData: User) => {
    setUser(userData);
    
    // Check onboarding status
    const onboardingComplete = localStorage.getItem('muncho_onboarding_complete') === 'true';
    const onboardingProgress = localStorage.getItem('muncho_onboarding_progress');
    
    if (onboardingComplete || userData.onboardingComplete) {
      setAppState('dashboard');
    } else if (onboardingProgress) {
      setAppState('onboarding');
      showToast('Resuming your setup where you left off...', 'info');
    } else {
      setAppState('onboarding');
    }
  };

  const handleOnboardingComplete = () => {
    setAppState('dashboard');
    showToast('🎉 Your Muncho CRM is ready! Welcome aboard!', 'success');
  };

  const handleOnboardingSaveAndExit = () => {
    setAppState('dashboard');
    showToast('Progress saved. You can resume setup anytime.', 'info');
  };

  const handleLogout = () => {
    setUser(null);
    setAppState('login');
    localStorage.removeItem('muncho_remember_token');
    localStorage.removeItem('muncho_onboarding_progress');
    showToast('You have been logged out successfully.', 'info');
  };

  const renderCurrentState = () => {
    switch (appState) {
      case 'login':
        return (
          <LoginPage 
            onShowToast={showToast} 
            onLoginSuccess={handleLoginSuccess}
          />
        );
      case 'onboarding':
        return (
          <OnboardingWizard
            userEmail={user?.email || 'demo@restaurant.com'}
            onComplete={handleOnboardingComplete}
            onSaveAndExit={handleOnboardingSaveAndExit}
          />
        );
      case 'dashboard':
        return (
          <Dashboard
            user={user!}
            onLogout={handleLogout}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {renderCurrentState()}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
    </div>
  );
}

export default App;