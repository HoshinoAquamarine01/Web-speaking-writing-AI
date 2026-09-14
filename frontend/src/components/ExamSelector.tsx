import React, { useState } from 'react';
import type { ExamType, Question } from '../types';
import { TOEIC_QUESTIONS } from '../data/toeicQuestions';
import { IELTS_QUESTIONS } from '../data/ieltsQuestions';
import { generateAIQuestion } from '../utils/aiQuestionGenerator';
import { useAuth } from '../context/AuthContext';
import {
  Award,
  BookOpen,
  Clock,
  PenTool,
  Image as ImageIcon,
  CheckCircle2,
  ArrowRight,
  Bot,
  Loader2,
  Trophy
} from 'lucide-react';

interface ExamSelectorProps {
  onStartExam: (question: Question) => void;
  onStartFullExam: (examType: ExamType) => void;
}

export const ExamSelector: React.FC<ExamSelectorProps> = ({ onStartExam, onStartFullExam }) => {
  const { user } = useAuth();
  const [examType, setExamType] = useState<ExamType>('TOEIC');
  const [selectedPart, setSelectedPart] = useState<number | 'all'>('all');
  const [activeMode, setActiveMode] = useState<'preset' | 'custom' | 'ai_gen'>('preset');

  // Custom question state
  const [customTitle, setCustomTitle] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [customPrepTime, setCustomPrepTime] = useState(45);
  const [customResponseTime, setCustomResponseTime] = useState(60);

  // Generator state
  const [aiPart, setAiPart] = useState<number>(1);
  const [aiTopic, setAiTopic] = useState('');
  const [aiTarget, setAiTarget] = useState('Level 8 / Band 8.0');
  const [isGenerating, setIsGenerating] = useState(false);

  const questions = examType === 'TOEIC' ? TOEIC_QUESTIONS : IELTS_QUESTIONS;

  const filteredQuestions = selectedPart === 'all'
    ? questions
    : questions.filter((q) => q.part === selectedPart);

  const handleStartCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrompt.trim()) return;

    const customQ: Question = {
      id: 'custom-' + Date.now(),
      examType,
      part: 1,
      partTitle: `Đề thi tự chọn (${examType})`,
      title: customTitle.trim() || 'Câu hỏi tự nhập của bạn',
      prompt: customPrompt.trim(),
      prepTimeSeconds: customPrepTime,
      responseTimeSeconds: customResponseTime,
      sampleAnswer: 'Sample answer will be generated based on your topic during evaluation.'
    };
    onStartExam(customQ);
  };

  const handleGenerateAIExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (aiPart === 0) {
      onStartFullExam(examType);
      return;
    }
    setIsGenerating(true);

    const generatedQuestion = await generateAIQuestion(
      examType,
      aiPart,
      aiTopic,
      aiTarget,
      user?.apiKey
    );

    setIsGenerating(false);
    onStartExam(generatedQuestion);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl">
          <span className="px-3 py-1 text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-full inline-flex items-center gap-1.5 mb-4">
            Hệ Thống Luyện Thi Speaking Standard
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Luyện Thi Speaking <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-indigo-400">TOEIC & IELTS</span> Standard
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
            Hệ thống tự động chấm điểm chuẩn xác theo **4 tiêu chí**, phân tích lỗi phát âm IPA, chỉnh sửa ngữ pháp và đưa ra nhận xét chi tiết bằng **Tiếng Việt**.
          </p>
        </div>

        {/* Toggle TOEIC / IELTS */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
          <button
            onClick={() => {
              setExamType('TOEIC');
              setSelectedPart('all');
            }}
            className={`p-5 rounded-2xl border text-left transition-all relative overflow-hidden ${
              examType === 'TOEIC'
                ? 'bg-gradient-to-br from-cyan-600/30 via-cyan-900/40 to-slate-900 border-cyan-500 shadow-xl shadow-cyan-500/10 ring-2 ring-cyan-500/50'
                : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:border-slate-600 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-xl text-white">TOEIC Speaking</span>
              <Award className={`w-6 h-6 ${examType === 'TOEIC' ? 'text-cyan-400' : 'text-slate-500'}`} />
            </div>
            <div className="mt-2 text-xs text-slate-300">Thang điểm: <strong>0 - 200 điểm</strong> (Levels 1 - 8)</div>
            <div className="mt-1 text-[11px] text-cyan-300 font-medium">5 Parts • Phát âm, Trọng âm, Từ vựng, Phản xạ</div>
          </button>

          <button
            onClick={() => {
              setExamType('IELTS');
              setSelectedPart('all');
            }}
            className={`p-5 rounded-2xl border text-left transition-all relative overflow-hidden ${
              examType === 'IELTS'
                ? 'bg-gradient-to-br from-indigo-600/30 via-indigo-900/40 to-slate-900 border-indigo-500 shadow-xl shadow-indigo-500/10 ring-2 ring-indigo-500/50'
                : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:border-slate-600 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-xl text-white">IELTS Speaking</span>
              <BookOpen className={`w-6 h-6 ${examType === 'IELTS' ? 'text-indigo-400' : 'text-slate-500'}`} />
            </div>
            <div className="mt-2 text-xs text-slate-300">Thang điểm: <strong>Band 0.0 - 9.0</strong></div>
            <div className="mt-1 text-[11px] text-indigo-300 font-medium">3 Parts • Fluency, Lexical, Grammar, Pronunciation</div>
          </button>
        </div>
      </div>

      {/* FULL MOCK TEST PROMINENT BANNER */}
      <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-amber-950/60 border border-amber-500/40 rounded-3xl p-6 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
            <Trophy className="w-4 h-4 text-amber-400" /> THI THỬ FULL ĐỀ THI LẦN LƯỢT (FULL MOCK TEST)
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            Thi Thử Trọn Bộ Full Đề {examType} Speaking ({examType === 'TOEIC' ? '5 Parts' : '3 Parts'})
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Lần lượt thực hiện toàn bộ câu hỏi liên tục với thời gian thi thật. Hệ thống sẽ chấm Báo Cáo Tổng Hợp cho cả bộ đề!
          </p>
        </div>

        <button
          onClick={() => onStartFullExam(examType)}
          className="px-8 py-4 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black rounded-2xl text-sm shadow-xl shadow-amber-500/20 flex items-center gap-2 flex-shrink-0 transition scale-105 hover:scale-110"
        >
          <Trophy className="w-5 h-5" /> Bắt Đầu Thi Full Đề {examType} Ngay
        </button>
      </div>

      {/* Mode Navigation */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex flex-wrap bg-slate-900 p-1.5 rounded-2xl border border-slate-800 w-full md:w-auto gap-1">
          <button
            onClick={() => setActiveMode('preset')}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeMode === 'preset'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Luyện Từng Câu Có Sẵn ({examType})
          </button>

          <button
            onClick={() => setActiveMode('ai_gen')}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeMode === 'ai_gen'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bot className="w-4 h-4 text-purple-300" />
            Tự Động Tạo Đề Thi Từng Câu
          </button>

          <button
            onClick={() => setActiveMode('custom')}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeMode === 'custom'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <PenTool className="w-4 h-4" />
            Tự Nhập Đề Bài Riêng
          </button>
        </div>

        {activeMode === 'preset' && (
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedPart('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedPart === 'all'
                  ? 'bg-slate-700 text-white border border-slate-600'
                  : 'bg-slate-800/50 text-slate-400 hover:text-white'
              }`}
            >
              Tất cả Parts
            </button>
            {examType === 'TOEIC' ? (
              <>
                {[1, 2, 3, 4, 5].map((p) => (
                  <button
                    key={p}
                    onClick={() => setSelectedPart(p)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      selectedPart === p
                        ? 'bg-cyan-600 text-white shadow'
                        : 'bg-slate-800/50 text-slate-400 hover:text-white'
                    }`}
                  >
                    Part {p}
                  </button>
                ))}
              </>
            ) : (
              <>
                {[1, 2, 3].map((p) => (
                  <button
                    key={p}
                    onClick={() => setSelectedPart(p)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      selectedPart === p
                        ? 'bg-indigo-600 text-white shadow'
                        : 'bg-slate-800/50 text-slate-400 hover:text-white'
                    }`}
                  >
                    Part {p}
                  </button>
                ))}
              </>
            )}
          </div>
        )}
      </div>

      {/* Mode 1: Question Generator Tab */}
      {activeMode === 'ai_gen' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl max-w-3xl mx-auto space-y-6">
          <div className="flex items-center gap-3 text-purple-400">
            <Bot className="w-7 h-7" />
            <div>
              <h2 className="text-xl font-bold text-white">Tạo Đề Thi Mới ({examType} Speaking)</h2>
              <p className="text-xs text-slate-400">
                Tự động sáng tạo đề thi hoàn toàn mới chuẩn format thi thật, đầy đủ từ vựng gợi ý & bài trả lời mẫu!
              </p>
            </div>
          </div>

          <form onSubmit={handleGenerateAIExam} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Chọn Phần Thi (Part)
                </label>
                <select
                  value={aiPart}
                  onChange={(e) => setAiPart(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-purple-500 font-medium"
                >
                  {examType === 'TOEIC' ? (
                    <>
                      <option value={1}>Part 1: Read a Text Aloud (Đọc 2 đoạn văn - Q1, Q2)</option>
                      <option value={2}>Part 2: Describe a Picture (Miêu tả 2 bức tranh - Q3, Q4)</option>
                      <option value={3}>Part 3: Respond to Questions (Trả lời 3 câu hỏi - Q5-7)</option>
                      <option value={4}>Part 4: Respond using Info Provided (Trả lời 3 câu hỏi lịch trình - Q8-10)</option>
                      <option value={5}>Part 5: Express an Opinion (Trình bày quan điểm 60s - Q11)</option>
                      <option value={0}>🏆 Full Bộ Đề Thi TOEIC (Trọn bộ 11 câu 5 Parts)</option>
                    </>
                  ) : (
                    <>
                      <option value={1}>Part 1: Introduction & Interview (Phỏng vấn 4 câu)</option>
                      <option value={2}>Part 2: Cue Card (Bài nói 2 phút)</option>
                      <option value={3}>Part 3: Two-way Discussion (Thảo luận 4 câu chuyên sâu)</option>
                      <option value={0}>🏆 Full Bộ Đề Thi IELTS (Trọn bộ 3 Parts)</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Mục Tiêu Điểm / Band Target
                </label>
                <select
                  value={aiTarget}
                  onChange={(e) => setAiTarget(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-purple-500 font-medium"
                >
                  {examType === 'TOEIC' ? (
                    <>
                      <option value="Target Level 6 (130-150)">Target Level 6 (130 - 150 điểm)</option>
                      <option value="Target Level 7 (160-180)">Target Level 7 (160 - 180 điểm)</option>
                      <option value="Target Level 8 (190-200)">Target Level 8 (190 - 200 điểm)</option>
                    </>
                  ) : (
                    <>
                      <option value="Target Band 6.0 - 6.5">Target Band 6.0 - 6.5 (Khá)</option>
                      <option value="Target Band 7.0 - 7.5">Target Band 7.0 - 7.5 (Giỏi)</option>
                      <option value="Target Band 8.0 - 9.0">Target Band 8.0 - 9.0 (Xuất sắc)</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Chủ Đề Mong Muốn / Từ Khóa (Để trống nếu muốn chọn ngẫu nhiên)
              </label>
              <input
                type="text"
                placeholder="VD: Artificial Intelligence, Tourism, Job Interview, Remote Work..."
                value={aiTopic}
                onChange={(e) => setAiTopic(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full py-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-extrabold rounded-2xl text-sm shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Đang Tạo Đề Thi Mới...
                </>
              ) : (
                <>
                  Tạo Đề Thi Mới & Vấn Đáp Ngay
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* Mode 2: Preset Questions Grid */}
      {activeMode === 'preset' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredQuestions.map((q) => (
            <div
              key={q.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl p-6 flex flex-col justify-between shadow-xl transition-all duration-200 group hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    {q.partTitle}
                  </span>
                  {q.sampleBand && (
                    <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                      Target {q.sampleBand}
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition mb-2">
                  {q.title}
                </h3>

                {q.imageUrl && (
                  <div className="relative mb-3 rounded-2xl overflow-hidden border border-slate-800 aspect-video bg-slate-950">
                    <img src={q.imageUrl} alt={q.title} className="w-full h-full object-cover" />
                    <span className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur px-2 py-1 rounded-md text-[10px] font-semibold text-slate-300 flex items-center gap-1">
                      <ImageIcon className="w-3 h-3" /> Đề kèm ảnh
                    </span>
                  </div>
                )}

                <p className="text-xs text-slate-400 line-clamp-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800 font-mono leading-relaxed mb-4 whitespace-pre-line">
                  {q.prompt}
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-4 pt-3 border-t border-slate-800/80">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" /> Chuẩn bị: <strong>{q.prepTimeSeconds}s</strong>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-indigo-400" /> Làm bài: <strong>{q.responseTimeSeconds}s</strong>
                  </span>
                </div>

                <button
                  onClick={() => onStartExam(q)}
                  className="w-full py-3 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold rounded-2xl text-sm shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 group-hover:scale-[1.01] transition"
                >
                  Bắt Đầu Thi Ngay <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mode 3: Custom Question Form */}
      {activeMode === 'custom' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl max-w-3xl mx-auto">
          <div className="flex items-center gap-3 text-indigo-400 mb-6">
            <PenTool className="w-6 h-6" />
            <div>
              <h2 className="text-xl font-bold text-white">Tự Nhập Đề Bài Thi ({examType})</h2>
              <p className="text-xs text-slate-400">
                Nhập bất kỳ câu hỏi hoặc chủ đề nào bạn muốn luyện tập, hệ thống sẽ tự động chấm điểm theo 4 tiêu chí chuẩn {examType}.
              </p>
            </div>
          </div>

          <form onSubmit={handleStartCustom} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Tên Chủ Đề / Tiêu Đề
              </label>
              <input
                type="text"
                placeholder="VD: Describing my favorite vacation destination"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Nội Dung Câu Hỏi / Prompt Chi Tiết <span className="text-rose-400">*</span>
              </label>
              <textarea
                rows={4}
                required
                placeholder="Dán hoặc gõ nội dung câu hỏi tiếng Anh ở đây... (VD: Describe a movie you watched recently. You should say what movie it was, who you watched it with...)"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Thời Gian Chuẩn Bị (Giây)
                </label>
                <select
                  value={customPrepTime}
                  onChange={(e) => setCustomPrepTime(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value={15}>15 giây (TOEIC Part 3)</option>
                  <option value={30}>30 giây (TOEIC Part 4)</option>
                  <option value={45}>45 giây (TOEIC Part 1, 2, 5)</option>
                  <option value={60}>60 giây (IELTS Part 2 Cue Card)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Thời Gian Trả Lời (Giây)
                </label>
                <select
                  value={customResponseTime}
                  onChange={(e) => setCustomResponseTime(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value={45}>45 giây</option>
                  <option value={60}>60 giây</option>
                  <option value={90}>90 giây</option>
                  <option value={120}>120 giây (2 phút)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-2xl text-sm shadow-xl shadow-indigo-600/25 flex items-center justify-center gap-2 transition"
            >
              <CheckCircle2 className="w-5 h-5" /> Bắt Đầu Thu Âm Cho Đề Này
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
