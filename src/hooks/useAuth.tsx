import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from "sonner";
import { User } from '@/utils/types';
import api from '@/utils/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  theme: "light" | "dark" | "system";
  setTheme: (theme: "light" | "dark" | "system") => void;
  updateUser: (userData: User) => void; // Add updateUser method
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Check if we should use mock data (default to true if not set)
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA !== 'false';

// Mock users for demonstration when not using the backend
const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@um-surabaya.ac.id',
    role: 'admin',
    status: 'active',
    department: 'Information Technology',
    phone: '+62-812-3456-7890',
    bio: 'System administrator responsible for classroom management system.'
  },
  {
    id: '2',
    name: 'Teacher User',
    email: 'teacher@um-surabaya.ac.id',
    role: 'teacher',
    status: 'active',
    department: 'Computer Science',
    phone: '+62-876-5432-1098',
    bio: 'Computer Science professor specializing in artificial intelligence and machine learning.'
  }
];

// Mock passwords (in a real app, these would be hashed)
const MOCK_PASSWORDS = {
  'admin@um-surabaya.ac.id': 'admin123',
  'teacher@um-surabaya.ac.id': 'teacher123'
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setThemeState] = useState<"light" | "dark" | "system">("light");

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if token is stored and not expired
        const token = localStorage.getItem('token');
        
        if (token) {
          if (USE_MOCK_DATA) {
            // If using mock data, get user from localStorage
            try {
              const storedUser = localStorage.getItem('umUser');
              if (storedUser) {
                setUser(JSON.parse(storedUser));
              }
            } catch (error) {
              console.error('Failed to parse stored user:', error);
              localStorage.removeItem('umUser');
              localStorage.removeItem('token');
            }
          } else {
            // If using real API, validate the token and get current user
            try {
              const userData = await api.auth.getCurrentUser();
              setUser(userData);
            } catch (error) {
              console.error('Failed to get current user:', error);
              // Token might be invalid or expired
              localStorage.removeItem('token');
            }
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Load theme preference from localStorage
    const storedTheme = localStorage.getItem('umTheme') as "light" | "dark" | "system" | null;
    if (storedTheme) {
      setThemeState(storedTheme);
      applyTheme(storedTheme);
    }
    
    initializeAuth();
  }, []);

  // Function to apply theme to document
  const applyTheme = (selectedTheme: "light" | "dark" | "system") => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    
    if (selectedTheme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(selectedTheme);
    }
  };

  const setTheme = (selectedTheme: "light" | "dark" | "system") => {
    setThemeState(selectedTheme);
    localStorage.setItem('umTheme', selectedTheme);
    applyTheme(selectedTheme);
  };

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    
    try {
      if (USE_MOCK_DATA) {
        // Mock login
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
        
        const foundUser = MOCK_USERS.find(u => u.email === email);
        
        if (!foundUser || MOCK_PASSWORDS[email as keyof typeof MOCK_PASSWORDS] !== password) {
          throw new Error('Invalid email or password');
        }
        
        setUser(foundUser);
        localStorage.setItem('umUser', JSON.stringify(foundUser));
        localStorage.setItem('token', 'mock-token'); // Mock token
      } else {
        // Real API login
        const response = await api.auth.login(email, password);
        setUser(response.user);
        localStorage.setItem('token', response.token);
      }
      
      toast.success(`Welcome back, ${user?.name || 'User'}!`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: string = "teacher"): Promise<void> => {
    setIsLoading(true);
    
    try {
      if (USE_MOCK_DATA) {
        // Mock register
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
        
        // Check if email already exists
        if (MOCK_USERS.some(u => u.email === email)) {
          throw new Error('Email already exists');
        }
        
        // Create new user
        const newUser: User = {
          id: `${MOCK_USERS.length + 1}`,
          name,
          email,
          role: role as "admin" | "teacher", // Use provided role
          status: "active"
        };
        
        // Log in the user automatically
        setUser(newUser);
        localStorage.setItem('umUser', JSON.stringify(newUser));
        localStorage.setItem('token', 'mock-token'); // Mock token
      } else {
        // Real API register with role
        const response = await api.auth.register(name, email, password, role);
        setUser(response.user);
        localStorage.setItem('token', response.token);
      }
      
      toast.success('Registration successful!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Registration failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setUser(null);
      localStorage.removeItem('umUser');
      localStorage.removeItem('token');
      
      toast.info('You have been logged out');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Add updateUser method
  const updateUser = (userData: User): void => {
    setUser(userData);
    if (USE_MOCK_DATA) {
      // Update user in localStorage for mock data
      localStorage.setItem('umUser', JSON.stringify(userData));
    } else {
      // In a real app, you'd call an API endpoint to update the user
      // api.auth.updateUser(userData);
    }
    toast.success('Profile updated successfully');
  };

  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    theme,
    setTheme,
    updateUser, // Add updateUser to context value
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
