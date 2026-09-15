import React, { useState } from 'react';
import type { WritingQuestion, ExamType } from '../types';
import { TOEIC_WRITING_QUESTIONS } from '../data/toeicWritingQuestions';
import { IELTS_WRITING_QUESTIONS } from '../data/ieltsWritingQuestions';
import { generateAIWritingQuestion } from '../utils/aiWritingGenerator';
import { WritingChart } from './WritingChart';
import { useAuth } from '../context/AuthContext';
import {
  PenTool,
  Award,
  BookOpen,
  Clock,
  CheckCircle2,
  ArrowRight,
  Bot,
  Loader2,
  Image as ImageIcon,
  FileText
} from 'lucide-react';

interface WritingSelectorProps {
  onStartWriting: (question: WritingQuestion) => void;
}

export const WritingSelector: React.FC<WritingSelectorProps> = ({ onStartWriting }) => {
  const { user, updateApiKey } = useAuth();
  const [examType, setExamType] = useState<ExamType>('TOEIC');
  const [selectedPart, setSelectedPart] = useState<number | string>('all');
  const [activeMode, setActiveMode] = useState<'preset' | 'custom' | 'ai_gen'>('preset');

  // Custom question state
  const [customTitle, setCustomTitle] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [customMinWords, setCustomMinWords] = useState(150);
  const [customTimeLimit, setCustomTimeLimit] = useState(20);

  // Generator state
  const [aiPart, setAiPart] = useState<number | string>(1);
  const [aiTopic, setAiTopic] = useState('');
  const [aiTarget, setAiTarget] = useState('Level 7 / Band 7.5');
  const [isGenerating, setIsGenerating] = useState(false);

  const questions = examType === 'TOEIC' ? TOEIC_WRITING_QUESTIONS : IELTS_WRITING_QUESTIONS;

  const filteredQuestions = selectedPart === 'all'
    ? questions
    : questions.filter((q) => {
        if (examType === 'TOEIC') {
          return q.part === Number(selectedPart);
        } else {
          if (selectedPart === 1) return q.part === 1 && (q.ieltsSubtype === 'academic' || !q.ieltsSubtype);
          if (selectedPart === '1_general') return q.part === 1 && q.ieltsSubtype === 'general';
          if (selectedPart === 2) return q.part === 2;
          return q.part === Number(selectedPart);
        }
      });

  const handleStartCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrompt.trim()) return;

    const customQ: WritingQuestion = {
      id: 'custom-writing-' + Date.now(),
      examType,
      part: 1,
      partTitle: `Đề thi tự chọn (${examType} Writing)`,
      title: customTitle.trim() || 'Đề bài Writing tự nhập của bạn',
      prompt: customPrompt.trim(),
      minWords: customMinWords,
      timeLimitMinutes: customTimeLimit,
      sampleAnswer: `Dear Management / Examiner,\n\nI am writing to express my perspective regarding ${customTitle.trim() || 'this topic'}.\n\nFirst, addressing this matter effectively requires a strategic approach. It is essential to ensure that clear guidelines are established to maintain productivity and quality. Furthermore, providing adequate training and resources empowers individuals to overcome challenges and achieve optimal results.\n\nSecond, ongoing feedback and open communication play a vital role in long-term success. By fostering collaboration and continuous learning, we can achieve sustainable progress.\n\nThank you for considering this proposal.\n\nBest regards,\nCandidate`
    };
    onStartWriting(customQ);
  };

  const handleGenerateAIExam = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    const actualPart = aiPart === '1_general' ? 1 : Number(aiPart);
    const ieltsSubtype = examType === 'IELTS'
      ? (aiPart === '1_general' ? 'general' : aiPart === 1 ? 'academic' : undefined)
      : undefined;

    const generatedQuestion = await generateAIWritingQuestion(
      examType,
      actualPart,
      aiTopic,
      aiTarget,
      user?.apiKey,
      ieltsSubtype
    );

    setIsGenerating(false);
    onStartWriting(generatedQuestion);
  };


  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 border border-slate-800 p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl">
          <span className="px-3 py-1 text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full inline-flex items-center gap-1.5 mb-4">
            <PenTool className="w-3.5 h-3.5" /> Hệ Thống Luyện Thi Writing Standard
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Luyện Thi Writing <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-300">TOEIC & IELTS</span> Standard
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
            Phòng thi viết trực tuyến tích hợp bộ đếm từ theo thời gian thực, đồng hồ đếm ngược, và trí tuệ nhân tạo chấm điểm chi tiết theo **4 tiêu chí chuẩn quốc tế** bằng **Tiếng Việt**.
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
                ? 'bg-gradient-to-br from-purple-600/30 via-purple-900/40 to-slate-900 border-purple-500 shadow-xl shadow-purple-500/10 ring-2 ring-purple-500/50'
                : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:border-slate-600 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-xl text-white">TOEIC Writing</span>
              <Award className={`w-6 h-6 ${examType === 'TOEIC' ? 'text-purple-400' : 'text-slate-500'}`} />
            </div>
            <div className="mt-2 text-xs text-slate-300">Thang điểm: <strong>0 - 200 điểm</strong> (3 Parts)</div>
            <div className="mt-1 text-[11px] text-purple-300 font-medium">Viết câu từ ảnh • Trả lời Email • Bài luận Opinion</div>
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
              <span className="font-extrabold text-xl text-white">IELTS Writing</span>
              <BookOpen className={`w-6 h-6 ${examType === 'IELTS' ? 'text-indigo-400' : 'text-slate-500'}`} />
            </div>
            <div className="mt-2 text-xs text-slate-300">Thang điểm: <strong>Band 0.0 - 9.0</strong> (2 Tasks)</div>
            <div className="mt-1 text-[11px] text-indigo-300 font-medium">Task 1: Biểu đồ/Thư (150 words) • Task 2: Essay (250 words)</div>
          </button>
        </div>
      </div>

      {/* Mode Navigation */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex flex-wrap bg-slate-900 p-1.5 rounded-2xl border border-slate-800 w-full md:w-auto gap-1">
          <button
            onClick={() => setActiveMode('preset')}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeMode === 'preset'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Luyện Đề Bài Có Sẵn ({examType})
          </button>

          <button
            onClick={() => setActiveMode('ai_gen')}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeMode === 'ai_gen'
                ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md shadow-pink-600/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bot className="w-4 h-4 text-pink-300" />
            Tự Động Tạo Đề Bài Mới
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
              Tất cả Parts/Tasks
            </button>
            {examType === 'TOEIC' ? (
              <>
                {[1, 2, 3].map((p) => (
                  <button
                    key={p}
                    onClick={() => setSelectedPart(p)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      selectedPart === p
                        ? 'bg-purple-600 text-white shadow'
                        : 'bg-slate-800/50 text-slate-400 hover:text-white'
                    }`}
                  >
                    Part {p}
                  </button>
                ))}
              </>
            ) : (
              <>
                <button
                  onClick={() => setSelectedPart(1)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    selectedPart === 1
                      ? 'bg-indigo-600 text-white shadow'
                      : 'bg-slate-800/50 text-slate-400 hover:text-white'
                  }`}
                >
                  Task 1 Academic (Biểu đồ)
                </button>
                <button
                  onClick={() => setSelectedPart('1_general')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    selectedPart === '1_general'
                      ? 'bg-indigo-600 text-white shadow'
                      : 'bg-slate-800/50 text-slate-400 hover:text-white'
                  }`}
                >
                  Task 1 General (Viết thư)
                </button>
                <button
                  onClick={() => setSelectedPart(2)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    selectedPart === 2
                      ? 'bg-indigo-600 text-white shadow'
                      : 'bg-slate-800/50 text-slate-400 hover:text-white'
                  }`}
                >
                  Task 2 Essay
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Mode 1: AI Generator Tab */}
      {activeMode === 'ai_gen' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl max-w-3xl mx-auto space-y-6">
          <div className="flex items-center gap-3 text-pink-400">
            <Bot className="w-7 h-7" />
            <div>
              <h2 className="text-xl font-bold text-white">Tạo Đề Thi Writing Mới ({examType})</h2>
              <p className="text-xs text-slate-400">
                Sáng tạo đề thi viết hoàn toàn mới chuẩn định dạng thi thật kèm bài luận mẫu Band cao!
              </p>
            </div>
          </div>

          <form onSubmit={handleGenerateAIExam} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Chọn Phần Thi / Task
                </label>
                <select
                  value={aiPart}
                  onChange={(e) => {
                    const val = e.target.value;
                    setAiPart(val === '1_general' ? '1_general' : Number(val));
                  }}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-purple-500 font-medium"
                >
                  {examType === 'TOEIC' ? (
                    <>
                      <option value={1}>Part 1: Write a Sentence (Viết câu từ ảnh + 2 từ gợi ý)</option>
                      <option value={2}>Part 2: Respond to Request (Trả lời Email công việc)</option>
                      <option value={3}>Part 3: Write an Opinion Essay (Bài luận quan điểm 300 từ)</option>
                    </>
                  ) : (
                    <>
                      <option value={1}>Task 1 (Academic): Report Writing (Biểu đồ / Sơ đồ - 150 từ)</option>
                      <option value="1_general">Task 1 (General Training): Letter Writing (Viết thư - 150 từ)</option>
                      <option value={2}>Task 2: Essay Writing (Bài luận phân tích - 250 từ)</option>
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
                Chủ Đề Mong Muốn / Từ Khóa (Để trống nếu muốn ngẫu nhiên)
              </label>
              <input
                type="text"
                placeholder="VD: Artificial Intelligence, Remote Work, Environmental Protection..."
                value={aiTopic}
                onChange={(e) => setAiTopic(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono"
              />
            </div>

            {/* API Key Input Section for Real AI Generation */}
            <div className="bg-purple-950/40 border border-purple-500/30 p-4 rounded-2xl space-y-2">
              <label className="block text-xs font-bold text-purple-300 flex items-center justify-between">
                <span>🔑 OpenAI / AI API Key (Tùy chọn cho AI thực tế):</span>
                <span className="text-[10px] text-purple-400 font-normal">
                  {user?.apiKey ? '✅ Đã lưu API Key' : 'Tự động tạo hoặc dùng API Key riêng'}
                </span>
              </label>
              <input
                type="password"
                placeholder="Nhập sk-... (OpenAI / Gemini API Key) để AI tạo đề 100% thời gian thực"
                value={user?.apiKey || ''}
                onChange={(e) => updateApiKey(e.target.value)}
                className="w-full bg-slate-950 border border-purple-500/40 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 font-mono focus:outline-none focus:border-purple-400"
              />
              <p className="text-[11px] text-slate-400">
                💡 Khi nhập API Key, hệ thống sẽ kết nối trực tiếp đến mô hình LLM để tự động sáng tạo đề thi Writing, bài luận mẫu & từ vựng hoàn toàn mới không rập khuôn.
              </p>
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold rounded-2xl text-sm shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> AI Đang Tạo Đề Thi Writing Mới...
                </>
              ) : (
                <>
                  <Bot className="w-4 h-4" /> AI Tạo Đề Thi Writing Mới & Soạn Thảo Ngay
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
                  <div className="flex items-center gap-1.5">
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      {q.partTitle}
                    </span>
                    {q.ieltsSubtype && (
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        q.ieltsSubtype === 'general'
                          ? 'bg-blue-500/10 text-blue-300 border-blue-500/20'
                          : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                      }`}>
                        {q.ieltsSubtype === 'general' ? 'General Training' : 'Academic'}
                      </span>
                    )}
                  </div>
                  {q.sampleBand && (
                    <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                      Target {q.sampleBand}
                    </span>
                  )}
                </div>


                <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition mb-2">
                  {q.title}
                </h3>

                {q.chartData ? (
                  <WritingChart chartData={q.chartData} />
                ) : q.imageUrl ? (
                  <div className="relative mb-3 rounded-2xl overflow-hidden border border-slate-800 aspect-video bg-slate-950">
                    <img src={q.imageUrl} alt={q.title} className="w-full h-full object-cover" />
                    <span className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur px-2 py-1 rounded-md text-[10px] font-semibold text-slate-300 flex items-center gap-1">
                      <ImageIcon className="w-3 h-3" /> Đề kèm ảnh
                    </span>
                  </div>
                ) : null}

                {q.givenWords && q.givenWords.length > 0 && (
                  <div className="mb-3 flex items-center gap-2 bg-slate-950 p-2.5 rounded-xl border border-purple-500/30">
                    <span className="text-xs text-purple-300 font-bold">2 từ gợi ý:</span>
                    <div className="flex gap-2">
                      {q.givenWords.map((w, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-purple-500/20 text-purple-200 rounded text-xs font-mono font-bold">
                          {w}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <p className="text-xs text-slate-400 line-clamp-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800 font-mono leading-relaxed mb-4 whitespace-pre-line">
                  {q.prompt}
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-4 pt-3 border-t border-slate-800/80">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-purple-400" /> Thời gian: <strong>{q.timeLimitMinutes} phút</strong>
                  </span>
                  {q.minWords && (
                    <span className="flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-indigo-400" /> Yêu cầu: <strong>≥ {q.minWords} từ</strong>
                    </span>
                  )}
                </div>

                <button
                  onClick={() => onStartWriting(q)}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-2xl text-sm shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 group-hover:scale-[1.01] transition"
                >
                  Vào Phòng Thi Viết <ArrowRight className="w-4 h-4" />
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
              <h2 className="text-xl font-bold text-white">Tự Nhập Đề Bài Writing ({examType})</h2>
              <p className="text-xs text-slate-400">
                Nhập đề bài hoặc chủ đề bất kỳ bạn muốn luyện viết, hệ thống AI sẽ chấm điểm và chỉnh sửa ngữ pháp chi tiết.
              </p>
            </div>
          </div>

          <form onSubmit={handleStartCustom} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Tên Chủ Đề / Tiêu Đề Bài Viết
              </label>
              <input
                type="text"
                placeholder="VD: Writing an email to apologize for a missing invoice"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Nội Dung Đề Bài Chi Tiết <span className="text-rose-400">*</span>
              </label>
              <textarea
                rows={4}
                required
                placeholder="Dán hoặc gõ nội dung đề bài Writing tiếng Anh ở đây..."
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Số Từ Tối Thiểu (Words)
                </label>
                <select
                  value={customMinWords}
                  onChange={(e) => setCustomMinWords(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value={8}>8 từ (TOEIC Part 1)</option>
                  <option value={80}>80 từ (TOEIC Part 2 Email)</option>
                  <option value={150}>150 từ (IELTS Task 1)</option>
                  <option value={250}>250 từ (IELTS Task 2 Essay)</option>
                  <option value={300}>300 từ (TOEIC Part 3 Essay)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Thời Gian Làm Bài (Phút)
                </label>
                <select
                  value={customTimeLimit}
                  onChange={(e) => setCustomTimeLimit(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value={5}>5 phút</option>
                  <option value={20}>20 phút (Task 1 / Email)</option>
                  <option value={30}>30 phút (TOEIC Essay)</option>
                  <option value={40}>40 phút (IELTS Essay)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-2xl text-sm shadow-xl shadow-purple-600/25 flex items-center justify-center gap-2 transition"
            >
              <CheckCircle2 className="w-5 h-5" /> Bắt Đầu Soạn Thảo Bài Viết
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
