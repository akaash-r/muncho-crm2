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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize app
    const initializeApp = async () => {
      try {
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
      } catch (error) {
        console.error('Error initializing app:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
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

  // Show loading screen while initializing
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Muncho CRM...</p>
        </div>
      </div>
    );
  }

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