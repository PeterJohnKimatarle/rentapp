"use client";

import Layout from '@/components/Layout';
import { User, X, Building, Heart, Mail, Pencil } from 'lucide-react';
import { useEffect, useState } from 'react';
import { usePreventScroll } from '@/hooks/usePreventScroll';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfilePage() {
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [isPasswordPopupOpen, setIsPasswordPopupOpen] = useState(false);
  const { user, updateUser, changePassword } = useAuth();

  // Block background scroll when popup is open
  usePreventScroll(isEditPopupOpen || isPasswordPopupOpen);

  const [userData, setUserData] = useState({
    name: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: '',
    profileImage: '',
    role: 'tenant' as 'tenant' | 'landlord' | 'broker'
  });

  const [formData, setFormData] = useState(userData);
  const [saveError, setSaveError] = useState('');
  const [isSavingChanges, setIsSavingChanges] = useState(false);
  const [isUpdatingImage, setIsUpdatingImage] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    if (!user) return;
    const derivedFirst = user.firstName ?? user.name?.split(' ')[0] ?? '';
    const derivedLast = user.lastName ?? user.name?.split(' ').slice(1).join(' ')?.trim() ?? '';
    setUserData({
      name: user.name,
      firstName: derivedFirst,
      lastName: derivedLast,
      email: user.email,
      phone: user.phone ?? '',
      bio: user.bio ?? '',
      profileImage: user.profileImage ?? '',
      role: user.role
    });
  }, [user]);

  useEffect(() => {
    setFormData(userData);
  }, [userData]);

  const handleEdit = () => {
    setIsEditPopupOpen(true);
    setSaveError('');
  };

  const handleSave = async () => {
    setSaveError('');
    setIsSavingChanges(true);

    const combinedName = `${formData.firstName} ${formData.lastName}`.trim();

    const result = await updateUser({
      name: combinedName || formData.name || userData.name,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      bio: formData.bio,
      profileImage: formData.profileImage,
      role: formData.role
    });

    setIsSavingChanges(false);

    if (result.success) {
      setIsEditPopupOpen(false);
    } else {
      setSaveError(result.message ?? 'Unable to update profile. Please try again.');
    }
  };

  const handleCancel = () => {
    setFormData(userData);
    setIsEditPopupOpen(false);
    setSaveError('');
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => {
      if (field === 'firstName' || field === 'lastName') {
        const updated = {
          ...prev,
          [field]: value,
        };
        const combined = `${updated.firstName} ${updated.lastName}`.trim();
        return {
          ...updated,
          name: combined || updated.name,
        };
      }

      return {
        ...prev,
        [field]: value,
      };
    });
  };

  const handleProfileImageChange = async (file: File | null) => {
    if (!file) return;

    setIsUpdatingImage(true);
    setSaveError('');

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      setFormData(prev => ({
        ...prev,
        profileImage: result
      }));
      setIsUpdatingImage(false);
    };
    reader.readAsDataURL(file);
  };

  const handlePasswordChange = () => {
    setIsPasswordPopupOpen(true);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setPasswordError('');
    setPasswordSuccess('');
  };

  const handlePasswordSave = async () => {
    setPasswordError('');
    setPasswordSuccess('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }

    setIsChangingPassword(true);

    const result = await changePassword(passwordData.currentPassword, passwordData.newPassword);

    setIsChangingPassword(false);

    if (result.success) {
      setPasswordSuccess('Password updated successfully.');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setTimeout(() => {
        setIsPasswordPopupOpen(false);
        setPasswordSuccess('');
      }, 800);
    } else {
      setPasswordError(result.message ?? 'Unable to change password.');
    }
  };

  const handlePasswordCancel = () => {
    setIsPasswordPopupOpen(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setPasswordError('');
    setPasswordSuccess('');
  };

  const handlePasswordInputChange = (field: string, value: string) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!user) {
    return (
      <Layout>
        <div className="bg-gray-50 py-16">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Profile</h1>
            <p className="text-gray-600 mb-6">Please log in to view your profile information.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-gray-50 py-8">
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
                  {userData.profileImage ? (
                    <img
                      src={userData.profileImage}
                      alt={userData.name}
                      className="w-24 h-24 rounded-full object-cover border-2 border-blue-500"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center border-2 border-blue-500">
                      <User className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-black mb-2">
                    {userData.name || `${userData.firstName} ${userData.lastName}`.trim() || 'Unnamed user'}
                  </h2>
                  <p className="text-gray-600 mb-1">{userData.email || 'No email provided'}</p>
                  <p className="text-gray-600">{userData.phone || 'No phone number provided'}</p>
                </div>
              </div>

              {/* Bio Section */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">About</h3>
                <p className="text-gray-600">{userData.bio || 'No bio available yet.'}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handlePasswordChange}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-200 whitespace-nowrap"
                >
                  Change Password
                </button>
                <button
                  onClick={handleEdit}
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 whitespace-nowrap"
                >
                  Edit Profile
                </button>
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
                <Heart className="w-4 h-4 text-white" />
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
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50" style={{ touchAction: 'none', minHeight: '100vh', height: '100%' }} onClick={(e) => e.stopPropagation()}>
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
                  <label className="relative block w-28 h-28 rounded-full overflow-hidden cursor-pointer">
                    {formData.profileImage ? (
                      <img
                        src={formData.profileImage}
                        alt={formData.name || 'Profile preview'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <User className="w-14 h-14 text-gray-400" />
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(event) => handleProfileImageChange(event.target.files?.[0] ?? null)}
                    />
                    <div className="absolute bottom-2 right-2 bg-black/60 text-white rounded-full p-1.5 flex items-center justify-center">
                      {isUpdatingImage ? (
                        <span className="text-[10px] px-1">…</span>
                      ) : (
                        <Pencil size={14} />
                      )}
                    </div>
                  </label>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus-border-transparent text-sm"
                  />
                </div>

                <div>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus-border-transparent text-sm"
                  />
                </div>

                <div>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Phone"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus-border-transparent text-sm"
                  />
                </div>

                <div>
                  <select
                    value={formData.role}
                    onChange={(e) => handleInputChange('role', e.target.value as typeof formData.role)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus-border-transparent text-sm bg-white"
                  >
                    <option value="tenant">Tenant</option>
                    <option value="landlord">Landlord</option>
                    <option value="broker">Broker</option>
                  </select>
                </div>

                </div>
              </div>

              {/* Bio Section */}
              <div className="pt-3 border-t border-gray-200">
                {saveError && (
                  <div className="mb-3 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
                    {saveError}
                  </div>
                )}
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
                  disabled={isSavingChanges}
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-200 flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSavingChanges ? 'Saving...' : 'Save'}
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
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50" style={{ touchAction: 'none', minHeight: '100vh', height: '100%' }} onClick={(e) => e.stopPropagation()}>
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

                {passwordError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
                    {passwordError}
                  </div>
                )}

                {passwordSuccess && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-lg text-sm">
                    {passwordSuccess}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-row gap-3 pt-3">
                  <button
                    onClick={handlePasswordSave}
                    disabled={isChangingPassword}
                    className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-200 flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isChangingPassword ? 'Saving...' : 'Save'}
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

    </Layout>
  );
}