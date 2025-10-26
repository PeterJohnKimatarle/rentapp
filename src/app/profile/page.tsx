"use client";

import Layout from '@/components/Layout';
import { User, Edit, X, Building, Bookmark, Mail } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import LoginPopup from '@/components/LoginPopup';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [isPasswordPopupOpen, setIsPasswordPopupOpen] = useState(false);
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
  
  const { user, isAuthenticated } = useAuth();

  // Block background scroll when popup is open
  useEffect(() => {
    if (isEditPopupOpen || isPasswordPopupOpen || isLoginPopupOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [isEditPopupOpen, isPasswordPopupOpen, isLoginPopupOpen]);
  
  // User data from auth context or default values
  const [userData, setUserData] = useState({
    firstName: user?.name?.split(' ')[0] || 'Guest',
    lastName: user?.name?.split(' ')[1] || 'User',
    email: user?.email || 'guest@example.com',
    phone: user?.phone || '+1 (555) 000-0000',
    bio: user?.bio || 'Welcome to Rentapp! Please login to customize your profile.'
  });

  const [formData, setFormData] = useState(userData);

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleEdit = () => {
    if (!isAuthenticated) {
      setIsLoginPopupOpen(true);
      return;
    }
    setIsEditPopupOpen(true);
    setFormData(userData);
  };

  const handleSave = () => {
    setUserData(formData);
    setIsEditPopupOpen(false);
    // In a real app, you would save to backend here
    alert('Profile updated successfully!');
  };

  const handleCancel = () => {
    setFormData(userData);
    setIsEditPopupOpen(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePasswordChange = () => {
    if (!isAuthenticated) {
      setIsLoginPopupOpen(true);
      return;
    }
    setIsPasswordPopupOpen(true);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handlePasswordSave = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      alert('New password must be at least 6 characters long!');
      return;
    }
    // In a real app, you would validate current password and save new password to backend
    alert('Password changed successfully!');
    setIsPasswordPopupOpen(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handlePasswordCancel = () => {
    setIsPasswordPopupOpen(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handlePasswordInputChange = (field: string, value: string) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-black mb-4">
              My Profile
            </h1>
          </div>

          {/* Profile Card */}
          <div className="bg-white rounded-lg shadow-sm mb-8 border border-blue-500 border-2 shadow-blue-100">
            <div className="p-8">
              {/* Profile Header */}
              <div className="flex items-center space-x-6 mb-6">
                {/* Profile Image */}
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="w-12 h-12 text-gray-400" />
                  </div>
                </div>

                {/* User Info */}
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-black mb-2">
                    {isAuthenticated ? `${userData.firstName} ${userData.lastName}` : 'Guest User'}
                  </h2>
                  <p className="text-gray-600 mb-1">{userData.email}</p>
                  <p className="text-gray-600">{userData.phone}</p>
                </div>
              </div>

              {/* Bio Section */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">About</h3>
                <p className="text-gray-600">{userData.bio}</p>
              </div>

              {/* Authentication Status */}
              {!isAuthenticated && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-blue-700 text-sm">
                    Please login or register to access all profile features
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-center space-x-4">
                {isAuthenticated ? (
                  <>
                    <button
                      onClick={handlePasswordChange}
                      className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-200"
                    >
                      Change Password
                    </button>
                    <button
                      onClick={handleEdit}
                      className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center space-x-2"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Edit Profile</span>
                    </button>
                  </>
                ) : (
                  <div className="text-center text-gray-500 py-4">
                    <p className="text-sm">Please use the navigation menu to login or register</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/my-properties"
              className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-blue-500 border-2 shadow-blue-100 flex items-center space-x-4"
            >
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Building className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-black">My Properties</h3>
            </a>

            <a
              href="/bookmarks"
              className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-blue-500 border-2 shadow-blue-100 flex items-center space-x-4"
            >
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Bookmark className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-black">Bookmarks</h3>
            </a>

            <a
              href="/contact"
              className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-blue-500 border-2 shadow-blue-100 flex items-center space-x-4"
            >
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-black">Support</h3>
            </a>
          </div>
        </div>
      </div>

      {/* Edit Profile Popup */}
      {isEditPopupOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50" onClick={(e) => e.stopPropagation()}>
          <div className="bg-white rounded-xl max-w-2xl w-full mx-4 max-h-[70vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
              <h3 className="text-xl font-semibold text-black">Edit Profile</h3>
              <button
                onClick={handleCancel}
                className="text-white transition-colors rounded-lg p-2 cursor-pointer"
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                onMouseEnter={(e: React.MouseEvent) => (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(239, 68, 68, 1)'}
                onMouseLeave={(e: React.MouseEvent) => (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(0, 0, 0, 0.5)'}
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4 overflow-y-auto flex-1">
            
            <div className="space-y-3">
              {/* Profile Image and Basic Info Section */}
              <div className="flex items-start space-x-4">
                {/* Profile Image */}
                <div className="flex-shrink-0">
                  <button 
                    className="w-28 h-28 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors duration-200"
                    onClick={() => {
                      // Handle image change here
                      console.log('Change image clicked');
                    }}
                  >
                    <User className="w-14 h-14 text-gray-400" />
                  </button>
                </div>

                {/* Basic Info Fields */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="First Name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>

                <div>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Last Name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>

                <div>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>

                <div>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Phone"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>

                </div>
              </div>

              {/* Bio Section */}
              <div className="pt-3 border-t border-gray-200">
                <textarea
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                  placeholder="Bio"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-row gap-3 pt-3">
                <button
                  onClick={handleSave}
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-200 flex-1"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors duration-200 flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Popup */}
      {isPasswordPopupOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50" onClick={(e) => e.stopPropagation()}>
          <div className="bg-white rounded-xl max-w-md w-full mx-4 max-h-[70vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
              <h3 className="text-xl font-semibold text-black">Change Password</h3>
              <button
                onClick={handlePasswordCancel}
                className="text-white transition-colors rounded-lg p-2 cursor-pointer"
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                onMouseEnter={(e: React.MouseEvent) => (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(239, 68, 68, 1)'}
                onMouseLeave={(e: React.MouseEvent) => (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(0, 0, 0, 0.5)'}
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4 overflow-y-auto flex-1">
              <div className="space-y-4">
                <div>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => handlePasswordInputChange('currentPassword', e.target.value)}
                    placeholder="Current Password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>

                <div>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => handlePasswordInputChange('newPassword', e.target.value)}
                    placeholder="New Password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>

                <div>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => handlePasswordInputChange('confirmPassword', e.target.value)}
                    placeholder="Confirm New Password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-row gap-3 pt-3">
                  <button
                    onClick={handlePasswordSave}
                    className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-200 flex-1"
                  >
                    Save
                  </button>
                  <button
                    onClick={handlePasswordCancel}
                    className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors duration-200 flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Login Popup */}
      <LoginPopup
        isOpen={isLoginPopupOpen}
        onClose={() => setIsLoginPopupOpen(false)}
      />
    </Layout>
  );
}