'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  bio?: string;
  profileImage?: string;
  role: 'tenant' | 'landlord' | 'broker' | 'staff' | 'admin';
  isApproved?: boolean; // For staff: true when approved by admin
}

interface AuthResult {
  success: boolean;
  message?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (userData: Omit<User, 'id'> & { password: string }) => Promise<AuthResult>;
  updateUser: (updates: Partial<Omit<User, 'id'>>) => Promise<AuthResult>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<AuthResult>;
  getAllStaff: () => User[];
  approveStaff: (staffId: string) => Promise<AuthResult>;
  disapproveStaff: (staffId: string) => Promise<AuthResult>;
  deleteUser: (userId: string) => Promise<AuthResult>;
  logout: () => void;
  isLoading: boolean;
}

type StoredUser = User & { password: string };

const SESSION_KEY = 'rentapp_user';
const USERS_KEY = 'rentapp_users';

const loadStoredUsers = (): StoredUser[] => {
  if (typeof window === 'undefined') return [];

  const raw = localStorage.getItem(USERS_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch (error) {
    console.error('Error parsing stored users:', error);
  }

  localStorage.removeItem(USERS_KEY);
  return [];
};

const saveStoredUsers = (users: StoredUser[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

const sanitizeStoredUser = (stored: StoredUser): User => {
  const { password: _unusedPassword, ...rest } = stored;
  void _unusedPassword;

  const derivedFirst = rest.firstName ?? rest.name?.split(' ')[0] ?? '';
  const derivedLast = rest.lastName ?? rest.name?.split(' ').slice(1).join(' ') ?? '';

  return {
    ...rest,
    firstName: derivedFirst || undefined,
    lastName: derivedLast || undefined,
    name: (rest.name ?? `${derivedFirst} ${derivedLast}`).trim() || rest.email,
    profileImage: rest.profileImage || '/images/reed-richards.png',
  };
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem(SESSION_KEY);
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem(SESSION_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<AuthResult> => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      const normalizedEmail = email.trim().toLowerCase();
      const storedUsers = loadStoredUsers();
      const matchedIndex = storedUsers.findIndex((entry) => entry.email.toLowerCase() === normalizedEmail);
      const matchedUser = matchedIndex >= 0 ? storedUsers[matchedIndex] : undefined;

      if (!matchedUser) {
        setIsLoading(false);
        return {
          success: false,
          message: 'User not registered. Please create an account.'
        };
      }

      if (!matchedUser.password) {
        const migratedUser: StoredUser = {
          ...matchedUser,
          password,
          profileImage: matchedUser.profileImage || '/images/reed-richards.png',
        };

        storedUsers[matchedIndex] = migratedUser;
        saveStoredUsers(storedUsers);

        const legacySafeUser = sanitizeStoredUser(migratedUser);

        setUser(legacySafeUser);
        localStorage.setItem(SESSION_KEY, JSON.stringify(legacySafeUser));
        setIsLoading(false);
        return {
          success: true,
          message: 'Account updated. You are now logged in.'
        };
      }

      if (matchedUser.password !== password) {
        setIsLoading(false);
        return {
          success: false,
          message: 'Incorrect password. Please try again.'
        };
      }

      const safeUser = sanitizeStoredUser(matchedUser);

      setUser(safeUser);
      localStorage.setItem(SESSION_KEY, JSON.stringify(safeUser));
      setIsLoading(false);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return {
        success: false,
        message: 'Login failed. Please try again.'
      };
    }
  };

  const register = async (userData: Omit<User, 'id'> & { password: string }): Promise<AuthResult> => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const normalizedEmail = userData.email.trim().toLowerCase();
      const storedUsers = loadStoredUsers();

      if (storedUsers.some((entry) => entry.email.toLowerCase() === normalizedEmail)) {
        setIsLoading(false);
        return {
          success: false,
          message: 'An account with this email already exists. Please log in instead.'
        };
      }

      const profileImage = userData.profileImage?.trim() || '/images/reed-richards.png';
      const firstName = userData.firstName?.trim() || '';
      const lastName = userData.lastName?.trim() || '';
      const displayName = (userData.name ?? `${firstName} ${lastName}`).trim() || userData.email;

      const newUser: User = {
        id: Date.now().toString(),
        name: displayName,
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        email: userData.email,
        phone: userData.phone,
        bio: userData.bio,
        profileImage,
        role: userData.role,
        // Staff accounts require admin approval
        isApproved: userData.role === 'staff' ? false : undefined
      };

      const storedUserRecord: StoredUser = {
        ...newUser,
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        password: userData.password
      };

      saveStoredUsers([...storedUsers, storedUserRecord]);

      setUser(newUser);
      localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
      setIsLoading(false);
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      setIsLoading(false);
      return {
        success: false,
        message: 'Registration failed. Please try again.'
      };
    }
  };

  const updateUser = async (updates: Partial<Omit<User, 'id'>>): Promise<AuthResult> => {
    setIsLoading(true);

    try {
      if (!user) {
        setIsLoading(false);
        return {
          success: false,
          message: 'No authenticated user found.'
        };
      }

      await new Promise(resolve => setTimeout(resolve, 600));

      const storedUsers = loadStoredUsers();
      const userIndex = storedUsers.findIndex(entry => entry.id === user.id);

      if (userIndex === -1) {
        setIsLoading(false);
        return {
          success: false,
          message: 'Unable to locate account information.'
        };
      }

      const currentUser = storedUsers[userIndex];
      const trimmedEmail = updates.email?.trim();
      const updatedFirstName = updates.firstName?.trim() ?? currentUser.firstName ?? '';
      const updatedLastName = updates.lastName?.trim() ?? currentUser.lastName ?? '';
      const providedName = updates.name?.trim();
      const combinedName = (providedName || `${updatedFirstName} ${updatedLastName}`).trim() || currentUser.name;

      if (
        trimmedEmail &&
        trimmedEmail.toLowerCase() !== currentUser.email.toLowerCase() &&
        storedUsers.some((entry, index) => index !== userIndex && entry.email.toLowerCase() === trimmedEmail.toLowerCase())
      ) {
        setIsLoading(false);
        return {
          success: false,
          message: 'Another account already uses this email address.'
        };
      }

      const updatedRecord: StoredUser = {
        ...currentUser,
        name: combinedName,
        firstName: updatedFirstName || undefined,
        lastName: updatedLastName || undefined,
        email: trimmedEmail ?? currentUser.email,
        phone: updates.phone ?? currentUser.phone,
        bio: updates.bio ?? currentUser.bio,
        profileImage: updates.profileImage ?? currentUser.profileImage,
        role: updates.role ?? currentUser.role,
        isApproved: updates.isApproved !== undefined ? updates.isApproved : currentUser.isApproved,
      };

      storedUsers[userIndex] = updatedRecord;
      saveStoredUsers(storedUsers);

      const safeUserWithoutPassword = sanitizeStoredUser(updatedRecord);
      setUser(safeUserWithoutPassword);
      localStorage.setItem(SESSION_KEY, JSON.stringify(safeUserWithoutPassword));
      setIsLoading(false);
      return { success: true };
    } catch (error) {
      console.error('Update profile error:', error);
      setIsLoading(false);
      return {
        success: false,
        message: 'Could not update profile. Please try again.'
      };
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<AuthResult> => {
    setIsLoading(true);

    try {
      if (!user) {
        setIsLoading(false);
        return {
          success: false,
          message: 'You must be logged in to change your password.'
        };
      }

      await new Promise(resolve => setTimeout(resolve, 600));

      const storedUsers = loadStoredUsers();
      const userIndex = storedUsers.findIndex(entry => entry.id === user.id);

      if (userIndex === -1) {
        setIsLoading(false);
        return {
          success: false,
          message: 'Account could not be found.'
        };
      }

      const currentRecord = storedUsers[userIndex];

      if (currentRecord.password !== currentPassword) {
        setIsLoading(false);
        return {
          success: false,
          message: 'Current password is incorrect.'
        };
      }

      storedUsers[userIndex] = {
        ...currentRecord,
        password: newPassword
      };

      saveStoredUsers(storedUsers);
      setIsLoading(false);
      return { success: true };
    } catch (error) {
      console.error('Change password error:', error);
      setIsLoading(false);
      return {
        success: false,
        message: 'Unable to change password. Please try again.'
      };
    }
  };

  const getAllStaff = (): User[] => {
    const storedUsers = loadStoredUsers();
    return storedUsers
      .filter((stored) => stored.role === 'staff')
      .map((stored) => sanitizeStoredUser(stored));
  };

  const approveStaff = async (staffId: string): Promise<AuthResult> => {
    try {
      if (!user || user.role !== 'admin') {
        return {
          success: false,
          message: 'Only admins can approve staff accounts.'
        };
      }

      const storedUsers = loadStoredUsers();
      const staffIndex = storedUsers.findIndex((u) => u.id === staffId && u.role === 'staff');

      if (staffIndex === -1) {
        return {
          success: false,
          message: 'Staff member not found.'
        };
      }

      storedUsers[staffIndex] = {
        ...storedUsers[staffIndex],
        isApproved: true
      };

      saveStoredUsers(storedUsers);
      return { success: true };
    } catch (error) {
      console.error('Approve staff error:', error);
      return {
        success: false,
        message: 'Failed to approve staff account.'
      };
    }
  };

  const disapproveStaff = async (staffId: string): Promise<AuthResult> => {
    try {
      if (!user || user.role !== 'admin') {
        return {
          success: false,
          message: 'Only admins can disapprove staff accounts.'
        };
      }

      const storedUsers = loadStoredUsers();
      const staffIndex = storedUsers.findIndex((u) => u.id === staffId && u.role === 'staff');

      if (staffIndex === -1) {
        return {
          success: false,
          message: 'Staff member not found.'
        };
      }

      storedUsers[staffIndex] = {
        ...storedUsers[staffIndex],
        isApproved: false
      };

      saveStoredUsers(storedUsers);
      return { success: true };
    } catch (error) {
      console.error('Disapprove staff error:', error);
      return {
        success: false,
        message: 'Failed to disapprove staff account.'
      };
    }
  };

  const deleteUser = async (userId: string): Promise<AuthResult> => {
    try {
      if (!user || user.role !== 'admin') {
        return {
          success: false,
          message: 'Only admins can delete users.'
        };
      }

      // Prevent deleting yourself
      if (userId === user.id) {
        return {
          success: false,
          message: 'You cannot delete your own account.'
        };
      }

      const storedUsers = loadStoredUsers();
      const filteredUsers = storedUsers.filter((u) => u.id !== userId);

      if (filteredUsers.length === storedUsers.length) {
        return {
          success: false,
          message: 'User not found.'
        };
      }

      saveStoredUsers(filteredUsers);
      return { success: true };
    } catch (error) {
      console.error('Delete user error:', error);
      return {
        success: false,
        message: 'Failed to delete user.'
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    register,
    updateUser,
    changePassword,
    getAllStaff,
    approveStaff,
    disapproveStaff,
    deleteUser,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
