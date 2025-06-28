import React, { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff, Store, HelpCircle, AlertCircle } from 'lucide-react';
import LoginHelpModal from './LoginHelpModal';

interface LoginPageProps {
  onShowToast: (message: string, type: 'success' | 'error' | 'info') => void;
  onLoginSuccess: (userData: any) => void;
}

interface LoginAttempt {
  timestamp: number;
  count: number;
}

const LoginPage: React.FC<LoginPageProps> = ({ onShowToast, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState<LoginAttempt>({ timestamp: Date.now(), count: 0 });
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutEndTime, setLockoutEndTime] = useState<number | null>(null);
  
  const emailRef = useRef<HTMLInputElement>(null);
  const pageLoadTime = useRef(Date.now());

  useEffect(() => {
    // Auto-focus email field
    emailRef.current?.focus();

    // Track page abandon after 10 seconds
    const abandonTimer = setTimeout(() => {
      console.log('Event: login_abandon - User spent more than 10 seconds without submitting');
    }, 10000);

    return () => clearTimeout(abandonTimer);
  }, []);

  useEffect(() => {
    // Check for existing lockout
    const storedLockout = localStorage.getItem('muncho_login_lockout');
    if (storedLockout) {
      const lockoutData = JSON.parse(storedLockout);
      if (Date.now() < lockoutData.endTime) {
        setIsLocked(true);
        setLockoutEndTime(lockoutData.endTime);
      } else {
        localStorage.removeItem('muncho_login_lockout');
      }
    }

    // Check for existing attempts
    const storedAttempts = localStorage.getItem('muncho_login_attempts');
    if (storedAttempts) {
      const attempts = JSON.parse(storedAttempts);
      // Reset if more than 15 minutes have passed
      if (Date.now() - attempts.timestamp > 15 * 60 * 1000) {
        localStorage.removeItem('muncho_login_attempts');
        setLoginAttempts({ timestamp: Date.now(), count: 0 });
      } else {
        setLoginAttempts(attempts);
      }
    }
  }, []);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 8;
  };

  const isFormValid = (): boolean => {
    return validateEmail(email) && validatePassword(password) && !isLocked;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    
    if (errors.email && validateEmail(value)) {
      setErrors(prev => ({ ...prev, email: undefined }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    
    if (errors.password && validatePassword(value)) {
      setErrors(prev => ({ ...prev, password: undefined }));
    }
  };

  const handleFailedAttempt = () => {
    const newCount = loginAttempts.count + 1;
    const newAttempts = { timestamp: Date.now(), count: newCount };
    
    setLoginAttempts(newAttempts);
    localStorage.setItem('muncho_login_attempts', JSON.stringify(newAttempts));
    
    if (newCount >= 5) {
      const lockoutEnd = Date.now() + (15 * 60 * 1000); // 15 minutes
      setIsLocked(true);
      setLockoutEndTime(lockoutEnd);
      localStorage.setItem('muncho_login_lockout', JSON.stringify({ endTime: lockoutEnd }));
      setErrors(prev => ({ 
        ...prev, 
        general: 'Temporarily locked—try again in 15 minutes or reset your password.' 
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid()) return;

    setIsLoading(true);
    setErrors({});

    // Validate fields
    const newErrors: { email?: string; password?: string } = {};
    
    if (!validateEmail(email)) {
      newErrors.email = 'Enter a valid email.';
    }
    
    if (!validatePassword(password)) {
      newErrors.password = 'Password must be at least 8 characters.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Test credentials for demo
      const testCredentials = [
        { email: 'demo@restaurant.com', password: 'password123', user: { firstName: 'Akash', role: 'admin', onboardingComplete: false } },
        { email: 'owner@muncho.com', password: 'muncho2024', user: { firstName: 'Priya', role: 'owner', onboardingComplete: true } },
        { email: 'test@cafe.com', password: 'testpass', user: { firstName: 'Rahul', role: 'admin', onboardingComplete: false } }
      ];
      
      const validCredential = testCredentials.find(
        cred => cred.email === email && cred.password === password
      );
      
      if (validCredential) {
        // Clear login attempts on success
        localStorage.removeItem('muncho_login_attempts');
        localStorage.removeItem('muncho_login_lockout');
        
        if (rememberMe) {
          // Set remember me session (30 days)
          const expiry = new Date();
          expiry.setDate(expiry.getDate() + 30);
          localStorage.setItem('muncho_remember_token', JSON.stringify({ expiry: expiry.getTime() }));
        }
        
        onShowToast(`Welcome back, ${validCredential.user.firstName}!`, 'success');
        onLoginSuccess(validCredential.user);
        
      } else {
        handleFailedAttempt();
        setErrors({ general: 'Invalid email or password. Please try again.' });
      }
    } catch (error) {
      setErrors({ general: 'Something went wrong. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    console.log('Event: forgot_password_clicked');
    onShowToast('Password reset instructions will be sent to your email.', 'info');
  };

  const formatLockoutTime = (): string => {
    if (!lockoutEndTime) return '';
    const remaining = Math.ceil((lockoutEndTime - Date.now()) / 60000);
    return `${remaining} minute${remaining !== 1 ? 's' : ''}`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      {/* Logo */}
      <div className="mb-8">
        <div className="flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl shadow-lg">
          <Store className="w-8 h-8 text-white" />
        </div>
      </div>

      {/* Test Credentials Info */}
      <div className="w-full max-w-md mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">Test Credentials:</h3>
          <div className="text-xs text-blue-800 space-y-1">
            <div>• demo@restaurant.com / password123</div>
            <div>• owner@muncho.com / muncho2024</div>
            <div>• test@cafe.com / testpass</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Sign in to your Muncho account
            </h1>
            <p className="text-gray-600">Welcome back! Please enter your details.</p>
          </div>

          {/* Lockout Message */}
          {isLocked && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-red-800 text-sm font-medium">Account temporarily locked</p>
                <p className="text-red-700 text-sm">
                  Try again in {formatLockoutTime()} or reset your password.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                ref={emailRef}
                type="email"
                id="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="you@restaurant.com"
                disabled={isLocked}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.email
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-300 bg-white hover:border-gray-400'
                } ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.email}</span>
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                  disabled={isLocked}
                  className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.password
                      ? 'border-red-300 bg-red-50'
                      : 'border-gray-300 bg-white hover:border-gray-400'
                  } ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLocked}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.password}</span>
                </p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isLocked}
                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50"
              />
              <label htmlFor="remember" className="text-sm text-gray-700">
                <span className="font-medium">Remember Me</span>
                <span className="block text-gray-500">Keep me signed in on this device.</span>
              </label>
            </div>

            {/* General Error */}
            {errors.general && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.general}</span>
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isFormValid() || isLoading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          {/* Additional Links */}
          <div className="mt-6 space-y-4">
            <div className="text-center">
              <button
                onClick={handleForgotPassword}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
              >
                Forgot Password?
              </button>
            </div>

            <div className="text-center">
              <button
                onClick={() => setShowHelpModal(true)}
                className="text-gray-500 hover:text-gray-700 text-sm flex items-center justify-center space-x-1 mx-auto transition-colors"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Login Help</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-gray-500">
            powered by <span className="font-semibold">Reelo</span>
          </p>
        </div>
      </div>

      {/* Login Help Modal */}
      <LoginHelpModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
      />
    </div>
  );
};

export default LoginPage;