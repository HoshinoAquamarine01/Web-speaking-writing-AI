import React from 'react';
import { useAuth } from '../context/AuthContext';
import type { MainTab, SkillMode } from '../types';
import { Mic, User as UserIcon, LogOut, BarChart3, Award, Zap, PenTool, Search, Bookmark } from 'lucide-react';

interface NavbarProps {
  activeTab: MainTab;
  setActiveTab: (tab: MainTab) => void;
  skillMode: SkillMode;
  setSkillMode: (mode: SkillMode) => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  skillMode,
  setSkillMode,
  onOpenAuth
}) => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-slate-900/90 border-b border-slate-800 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Logo & Skill Switcher */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <div
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={() => setActiveTab('exam')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-cyan-500/20 flex-shrink-0">
              <Mic className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-2 leading-none">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300">
                  SPEAKING LAB
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full">
                  TOEIC & IELTS
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium leading-tight mt-1">
                Hệ thống Luyện thi, IPA Lab & Collocations
              </p>
            </div>
          </div>

          {/* Skill Mode Toggle Pill (Speaking 🎙️ / Writing ✍️) */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 shadow-inner">
            <button
              onClick={() => {
                setSkillMode('speaking');
                setActiveTab('exam');
              }}
              className={`px-3 py-1 rounded-lg text-xs font-extrabold transition flex items-center gap-1.5 ${
                skillMode === 'speaking'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Mic className="w-3.5 h-3.5" /> Speaking
            </button>
            <button
              onClick={() => {
                setSkillMode('writing');
                setActiveTab('exam');
              }}
              className={`px-3 py-1 rounded-lg text-xs font-extrabold transition flex items-center gap-1.5 ${
                skillMode === 'writing'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-600/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <PenTool className="w-3.5 h-3.5 text-pink-300" /> Writing
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-800/70 p-1.5 rounded-2xl border border-slate-700/60 shadow-inner">
          <button
            onClick={() => setActiveTab('exam')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'exam'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            Luyện thi Speaking
          </button>

          <button
            onClick={() => setActiveTab('shadowing')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'shadowing'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Shadowing
          </button>

          <button
            onClick={() => setActiveTab('dictation')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'dictation'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <PenTool className="w-3.5 h-3.5 text-purple-400" />
            Chép Chính Tả
          </button>

          <button
            onClick={() => setActiveTab('ipalab')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'ipalab'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <Search className="w-3.5 h-3.5 text-cyan-400" />
            Phòng Tra IPA
          </button>

          <button
            onClick={() => setActiveTab('vocab')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'vocab'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 text-emerald-400" />
            Sổ Tay Từ Vựng
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'dashboard'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Lịch Sử
          </button>
        </nav>

        {/* User profile & Actions */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {user ? (
            <div className="flex items-center gap-3 bg-slate-800/90 border border-slate-700/80 pl-3 pr-2 py-1.5 rounded-xl">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-semibold text-slate-200 leading-tight">{user.name}</p>
                  <p className="text-[10px] text-cyan-400 leading-tight">{user.email}</p>
                </div>
              </div>
              <button
                onClick={logout}
                title="Đăng xuất"
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-cyan-500/20 transition"
            >
              <UserIcon className="w-4 h-4" />
              Đăng nhập / Đăng ký
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
