import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, TestSubmission } from '../types';

interface AuthContextType {
  user: User | null;
  submissions: TestSubmission[];
  login: (email: string, name?: string) => void;
  register: (name: string, email: string) => void;
  guestLogin: () => void;
  logout: () => void;
  updateApiKey: (key: string) => void;
  saveSubmission: (submission: TestSubmission) => void;
  deleteSubmission: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'speaking_app_user_v1';
const SUBMISSIONS_STORAGE_KEY = 'speaking_app_submissions_v1';
const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(USER_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing user from localStorage', e);
      }
    }
    return {
      id: 'demo-user-1',
      name: 'Nguyễn Văn A',
      email: 'demo@speaking.ai',
      createdAt: new Date().toISOString()
    };
  });

  const [submissions, setSubmissions] = useState<TestSubmission[]>(() => {
    const saved = localStorage.getItem(SUBMISSIONS_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing submissions from localStorage', e);
      }
    }
    return [];
  });

  // Tự động đồng bộ Lịch sử bài thi từ Backend Server Database khi khởi động
  useEffect(() => {
    async function fetchFromBackend() {
      if (!user) return;
      try {
        const res = await fetch(`${API_BASE}/submissions?userId=${user.id}`);
        if (res.ok) {
          const backendData = await res.json();
          if (Array.isArray(backendData) && backendData.length > 0) {
            setSubmissions(backendData);
            localStorage.setItem(SUBMISSIONS_STORAGE_KEY, JSON.stringify(backendData));
          }
        }
      } catch (e) {
        console.warn('Backend server chưa được kết nối, đang dùng LocalStorage persistence:', e);
      }
    }
    fetchFromBackend();
  }, [user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem(SUBMISSIONS_STORAGE_KEY, JSON.stringify(submissions));
  }, [submissions]);

  const login = async (email: string, name?: string) => {
    const newUser: User = {
      id: 'user-' + Date.now(),
      name: name || email.split('@')[0] || 'Học viên',
      email,
      createdAt: new Date().toISOString()
    };
    setUser(newUser);

    // Gửi request đồng bộ tới Backend REST API
    try {
      await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name: newUser.name })
      });
    } catch (e) {
      console.warn('Gặp lỗi kết nối Backend API:', e);
    }
  };

  const register = (name: string, email: string) => {
    login(email, name);
  };

  const guestLogin = () => {
    const guestUser: User = {
      id: 'guest-' + Date.now(),
      name: 'Học viên Khách',
      email: 'guest@speaking.ai',
      createdAt: new Date().toISOString()
    };
    setUser(guestUser);
  };

  const logout = () => {
    setUser(null);
  };

  const updateApiKey = (key: string) => {
    if (user) {
      setUser({ ...user, apiKey: key });
    }
  };

  const saveSubmission = async (submission: TestSubmission) => {
    setSubmissions((prev) => [submission, ...prev]);

    // Lưu trực tiếp bài thi vào Backend Database
    try {
      await fetch(`${API_BASE}/submissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission)
      });
    } catch (e) {
      console.warn('Gặp lỗi lưu bài thi lên Backend Database:', e);
    }
  };

  const deleteSubmission = async (id: string) => {
    setSubmissions((prev) => prev.filter((s) => s.id !== id));

    // Xóa bài thi khỏi Backend Database
    try {
      await fetch(`${API_BASE}/submissions/${id}`, {
        method: 'DELETE'
      });
    } catch (e) {
      console.warn('Gặp lỗi xóa bài thi trên Backend Database:', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        submissions,
        login,
        register,
        guestLogin,
        logout,
        updateApiKey,
        saveSubmission,
        deleteSubmission
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
