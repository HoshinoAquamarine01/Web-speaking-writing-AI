import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import type { TestSubmission, ExamType } from '../types';
import {
  BarChart3,
  Award,
  Trash2,
  Calendar,
  Clock,
  ExternalLink
} from 'lucide-react';

interface UserDashboardProps {
  onViewSubmission: (sub: TestSubmission) => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ onViewSubmission }) => {
  const { user, submissions, deleteSubmission } = useAuth();
  const [filterType, setFilterType] = useState<ExamType | 'ALL'>('ALL');

  const filteredSubmissions = filterType === 'ALL'
    ? submissions
    : submissions.filter((s) => s.examType === filterType);

  const toeicSubs = submissions.filter((s) => s.examType === 'TOEIC');
  const ieltsSubs = submissions.filter((s) => s.examType === 'IELTS');

  const avgToeic = toeicSubs.length > 0
    ? Math.round(toeicSubs.reduce((acc, curr) => acc + curr.evaluation.overallScore, 0) / toeicSubs.length)
    : 0;

  const avgIelts = ieltsSubs.length > 0
    ? (ieltsSubs.reduce((acc, curr) => acc + curr.evaluation.overallScore, 0) / ieltsSubs.length).toFixed(1)
    : '0.0';

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 mb-2">
            <BarChart3 className="w-4 h-4" /> BẢNG THỐNG KÊ TIẾN ĐỘ HỌC TẬP
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Xin chào, {user?.name || 'Học viên'}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Theo dõi sự thay đổi điểm số TOEIC & IELTS Speaking qua từng bài luyện tập.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl text-center min-w-[120px]">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Tổng Bài Thi</span>
            <div className="text-3xl font-black text-white font-mono mt-1">{submissions.length}</div>
          </div>
          <div className="bg-slate-950 border border-cyan-500/30 p-4 rounded-2xl text-center min-w-[120px]">
            <span className="text-[10px] font-bold text-cyan-400 uppercase">ĐTB TOEIC</span>
            <div className="text-3xl font-black text-cyan-400 font-mono mt-1">{avgToeic}</div>
          </div>
          <div className="bg-slate-950 border border-indigo-500/30 p-4 rounded-2xl text-center min-w-[120px]">
            <span className="text-[10px] font-bold text-indigo-400 uppercase">ĐTB IELTS</span>
            <div className="text-3xl font-black text-indigo-400 font-mono mt-1">{avgIelts}</div>
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-cyan-400" /> Lịch Sử Bài Làm Đã Chấm
        </h2>

        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              filterType === 'ALL' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Tất cả ({submissions.length})
          </button>
          <button
            onClick={() => setFilterType('TOEIC')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              filterType === 'TOEIC' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            TOEIC ({toeicSubs.length})
          </button>
          <button
            onClick={() => setFilterType('IELTS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              filterType === 'IELTS' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            IELTS ({ieltsSubs.length})
          </button>
        </div>
      </div>

      {/* List of Submissions */}
      {filteredSubmissions.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-4">
          <div className="w-16 h-16 bg-slate-800 rounded-2xl mx-auto flex items-center justify-center text-slate-500">
            <Award className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">Chưa có bài thi nào được lưu</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Hãy bắt đầu chọn 1 bài thi TOEIC hoặc IELTS Speaking để nhận ngay báo cáo đánh giá 4 tiêu chí của AI!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredSubmissions.map((sub) => {
            const isToeic = sub.examType === 'TOEIC';
            return (
              <div
                key={sub.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl p-6 shadow-xl space-y-4 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                        isToeic
                          ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                          : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                      }`}
                    >
                      {sub.examType} Speaking
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(sub.timestamp).toLocaleDateString('vi-VN')}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2 line-clamp-1">
                    {sub.questionTitle}
                  </h3>

                  <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-2xl border border-slate-800/80 mb-3">
                    <div className="text-center px-3 border-r border-slate-800">
                      <span className="text-[9px] font-bold text-slate-500 block">ĐIỂM AI</span>
                      <span className="text-xl font-black text-cyan-400 font-mono">
                        {isToeic ? sub.evaluation.overallScore : sub.evaluation.overallScore.toFixed(1)}
                      </span>
                    </div>
                    <div className="text-xs text-slate-300 line-clamp-2">
                      {sub.evaluation.bandOrLevel} — {sub.evaluation.summaryFeedback}
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 italic bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/50">
                    "{sub.transcript}"
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                  <button
                    onClick={() => deleteSubmission(sub.id)}
                    className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition"
                    title="Xóa bài thi này"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onViewSubmission(sub)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-bold rounded-xl border border-slate-700 flex items-center gap-1.5 transition"
                  >
                    Xem Báo Cáo Chi Tiết <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
