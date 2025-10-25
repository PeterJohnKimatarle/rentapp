"use client";

import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

export default function AuthTestPage() {
  const { user, isAuthenticated, loading, login, logout } = useAuth();
  const [testEmail, setTestEmail] = useState('test@example.com');
  const [testPassword, setTestPassword] = useState('password');

  const handleTestLogin = async () => {
    try {
      await login(testEmail, testPassword);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const checkLocalStorage = () => {
    const token = localStorage.getItem('rentapp_token');
    const userData = localStorage.getItem('rentapp_user');
    console.log('Token:', token);
    console.log('User Data:', userData);
    console.log('Auth State - User:', user);
    console.log('Auth State - isAuthenticated:', isAuthenticated);
    console.log('Auth State - loading:', loading);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Authentication Test Page</h1>
            
            <div className="space-y-6">
              {/* Current Auth State */}
              <div className="bg-gray-100 p-4 rounded-lg">
                <h2 className="text-xl font-semibold mb-3">Current Authentication State</h2>
                <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
                <p><strong>Is Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
                <p><strong>User:</strong> {user ? JSON.stringify(user, null, 2) : 'None'}</p>
              </div>

              {/* Test Login */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h2 className="text-xl font-semibold mb-3">Test Login</h2>
                <div className="space-y-3">
                  <input
                    type="email"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="password"
                    value={testPassword}
                    onChange={(e) => setTestPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <button
                    onClick={handleTestLogin}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Test Login
                  </button>
                </div>
              </div>

              {/* Debug Info */}
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h2 className="text-xl font-semibold mb-3">Debug Information</h2>
                <button
                  onClick={checkLocalStorage}
                  className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
                >
                  Check LocalStorage & Console
                </button>
                <p className="text-sm text-gray-600 mt-2">
                  Click the button above and check the browser console for detailed information.
                </p>
              </div>

              {/* Logout */}
              {isAuthenticated && (
                <div className="bg-red-50 p-4 rounded-lg">
                  <h2 className="text-xl font-semibold mb-3">Logout</h2>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}

              {/* Navigation */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h2 className="text-xl font-semibold mb-3">Test Pages</h2>
                <div className="space-x-3">
                  <a
                    href="/profile"
                    className="inline-block bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Go to Profile (Protected)
                  </a>
                  <a
                    href="/profile-test"
                    className="inline-block bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Go to Profile Test (Unprotected)
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
