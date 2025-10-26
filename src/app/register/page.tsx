'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, Home, Building, Users, ArrowLeft } from 'lucide-react';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'tenant' as 'tenant' | 'landlord' | 'broker',
    bio: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { register } = useAuth();
  const router = useRouter();

  const handleBackClick = () => {
    // Check if there's history to go back to
    if (window.history.length > 1) {
      router.back();
    } else {
      // Fallback to home page if no history
      router.push('/');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);

    try {
      const success = await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role,
        bio: formData.bio
      });

      if (success) {
        router.push('/profile');
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const roleOptions = [
    { value: 'tenant', label: 'Tenant', icon: Home, description: 'Looking for properties to rent' },
    { value: 'landlord', label: 'Landlord', icon: Building, description: 'Own properties to rent out' },
    { value: 'broker', label: 'Broker', icon: Users, description: 'Help others find properties' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Back Button */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-md mx-auto flex items-center space-x-4">
          <button
            onClick={handleBackClick}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">Back</span>
          </button>
          <div className="flex-1 text-center">
            <h1 className="text-lg font-semibold text-gray-900">Create Account</h1>
          </div>
          <div className="w-16"></div> {/* Spacer for centering */}
        </div>
      </div>

      {/* Registration Form */}
      <div className="py-8">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Form Header */}
          <div className="bg-blue-600 px-6 py-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Join Rentapp</h2>
            <p className="text-blue-100">Create your account to get started</p>
          </div>

        {/* Form */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Name Field */}
            <div>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Full name"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Email address"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  required
                />
              </div>
            </div>

            {/* Phone Field */}
            <div>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Phone number"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">I am a:</label>
              <div className="space-y-2">
                {roleOptions.map((option) => {
                  const IconComponent = option.icon;
                  return (
                    <label
                      key={option.value}
                      className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                        formData.role === option.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <input
                        type="radio"
                        name="role"
                        value={option.value}
                        checked={formData.role === option.value}
                        onChange={(e) => handleInputChange('role', e.target.value)}
                        className="sr-only"
                      />
                      <IconComponent className="text-gray-600 mr-3" size={20} />
                      <div>
                        <div className="font-medium text-gray-900">{option.label}</div>
                        <div className="text-sm text-gray-500">{option.description}</div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
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

            {/* Confirm Password Field */}
            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  placeholder="Confirm password"
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Bio Field */}
            <div>
              <textarea
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="Tell us about yourself (optional)"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                'Creating Account...'
              ) : (
                <>
                  Create Account
                  <ArrowRight className="ml-2" size={20} />
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link href="/" className="text-blue-500 hover:text-blue-600 font-medium">
                Login here
              </Link>
            </p>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
