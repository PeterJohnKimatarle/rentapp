'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePreventScroll } from '@/hooks/usePreventScroll';

interface LoginPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginPopup: React.FC<LoginPopupProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  
  const { login } = useAuth();
  const router = useRouter();

  // Prevent background scrolling when popup is open
  usePreventScroll(isOpen);

  // Handle popup position adjustment when inputs are focused
  useEffect(() => {
    if (!isOpen) return;

    const handleFocus = () => setIsInputFocused(true);
    const handleBlur = () => {
      // Small delay to check if another input is being focused
      setTimeout(() => {
        const activeElement = document.activeElement;
        if (activeElement !== emailInputRef.current && activeElement !== passwordInputRef.current) {
          setIsInputFocused(false);
        }
      }, 100);
    };

    const emailInput = emailInputRef.current;
    const passwordInput = passwordInputRef.current;

    if (emailInput) {
      emailInput.addEventListener('focus', handleFocus);
      emailInput.addEventListener('blur', handleBlur);
    }
    if (passwordInput) {
      passwordInput.addEventListener('focus', handleFocus);
      passwordInput.addEventListener('blur', handleBlur);
    }

    return () => {
      if (emailInput) {
        emailInput.removeEventListener('focus', handleFocus);
        emailInput.removeEventListener('blur', handleBlur);
      }
      if (passwordInput) {
        passwordInput.removeEventListener('focus', handleFocus);
        passwordInput.removeEventListener('blur', handleBlur);
      }
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        handleClose();
        // Redirect all users (staff, admin, members) to homepage after login
        router.push('/');
      } else {
        setError(result.message ?? 'Invalid email or password');
      }
    } catch {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setPassword('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50"
      style={{ touchAction: 'none', minHeight: '100vh', height: '100%' }}
      onClick={(e) => e.stopPropagation()}
    >
      <div 
        ref={popupRef}
        className="bg-white rounded-xl max-w-md w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col transition-transform duration-300 ease-in-out"
        style={{
          transform: isInputFocused ? 'translateY(-150px)' : 'translateY(0)',
        }}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
          <h3 className="text-xl font-semibold text-black">Login to Rentapp</h3>
          <button
            onClick={handleClose}
            className="text-white transition-colors rounded-lg p-2 cursor-pointer"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            onMouseEnter={(e: React.MouseEvent) => (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(239, 68, 68, 1)'}
            onMouseLeave={(e: React.MouseEvent) => (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(239, 68, 68, 0.8)'}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto flex-1">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Email Field */}
            <div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  ref={emailInputRef}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  ref={passwordInputRef}
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 pt-3">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </form>

          {/* Registration Prompt */}
          <div className="mt-4 text-center">
            <p className="text-gray-600 text-sm mb-2">
              Don&apos;t have an account?
            </p>
            <Link 
              href="/register" 
              onClick={onClose}
              className="text-blue-500 hover:text-blue-600 font-medium underline"
            >
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPopup;
