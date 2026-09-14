import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, UserCheck, UserPlus } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, register, guestLogin } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    if (mode === 'login') {
      login(email, name);
    } else {
      register(name || 'Học viên', email);
    }
    onClose();
  };

  const handleGuest = () => {
    guestLogin();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl mx-auto bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-500 flex items-center justify-center mb-3 shadow-lg shadow-cyan-500/20">
            <UserCheck className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {mode === 'login' ? 'Đăng nhập Tài khoản' : 'Tạo Tài khoản mới'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Lưu giữ kết quả thi TOEIC & IELTS, theo dõi biểu đồ tiến bộ của bạn
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex bg-slate-800 p-1 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition ${
              mode === 'login' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Đăng nhập
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition ${
              mode === 'register' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Đăng ký
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Họ và tên</label>
              <input
                type="text"
                required
                placeholder="Nguyễn Văn A"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email</label>
            <input
              type="email"
              required
              placeholder="hocvien@speaking.ai"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Mật khẩu</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition"
          >
            {mode === 'login' ? <UserCheck className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
            {mode === 'login' ? 'Đăng nhập ngay' : 'Tạo tài khoản'}
          </button>
        </form>

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800"></div>
          </div>
          <span className="relative bg-slate-900 px-3 text-[11px] text-slate-500 font-semibold uppercase tracking-wider">
            Hoặc
          </span>
        </div>

        <button
          type="button"
          onClick={handleGuest}
          className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-semibold border border-slate-700 transition"
        >
          Dùng thử nhanh với Tài khoản Khách
        </button>
      </div>
    </div>
  );
};
