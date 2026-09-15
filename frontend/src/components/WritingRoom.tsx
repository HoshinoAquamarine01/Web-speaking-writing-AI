import React, { useState, useEffect } from 'react';
import type { WritingQuestion, WritingEvaluationResult } from '../types';
import { evaluateWritingEssay } from '../utils/aiWritingEvaluator';
import { WritingChart } from './WritingChart';
import { useAuth } from '../context/AuthContext';
import {
  Clock,
  Send,
  Loader2,
  ArrowLeft,
  FileText,
  AlertTriangle,
  Sparkles,
  Award,
  BookOpen,
  CheckCircle2,
  XCircle,
  TrendingUp,
  RefreshCw,
  Lightbulb,
  Copy,
  Check,
  X
} from 'lucide-react';

interface WritingRoomProps {
  question: WritingQuestion;
  onBack: () => void;
}

export const WritingRoom: React.FC<WritingRoomProps> = ({ question, onBack }) => {
  const { user } = useAuth();
  const [essay, setEssay] = useState('');
  const [timeLeftSeconds, setTimeLeftSeconds] = useState((question.timeLimitMinutes || 20) * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<WritingEvaluationResult | null>(null);
  const [copiedSample, setCopiedSample] = useState(false);
  const [showSampleModal, setShowSampleModal] = useState(false);

  const wordCount = essay.trim() ? essay.trim().split(/\s+/).filter(Boolean).length : 0;
  const minWords = question.minWords || 150;
  const isWordCountMet = wordCount >= minWords;

  // Countdown timer
  useEffect(() => {
    let timer: any;
    if (isTimerRunning && timeLeftSeconds > 0) {
      timer = setInterval(() => {
        setTimeLeftSeconds((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTimerRunning, timeLeftSeconds]);

  const minutesLeft = Math.floor(timeLeftSeconds / 60);
  const secondsLeft = timeLeftSeconds % 60;

  const handleSubmitForEvaluation = async () => {
    setIsTimerRunning(false);
    setIsEvaluating(true);

    const result = await evaluateWritingEssay(
      question.examType,
      question,
      essay,
      user?.apiKey
    );

    setIsEvaluating(false);
    setEvaluation(result);
  };

  const handleCopySample = () => {
    navigator.clipboard.writeText(question.sampleAnswer);
    setCopiedSample(true);
    setTimeout(() => setCopiedSample(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Quay Lại Danh Sách Đề
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSampleModal(true)}
            className="px-3.5 py-2 bg-gradient-to-r from-emerald-600/30 to-teal-600/30 hover:from-emerald-600/40 hover:to-teal-600/40 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow"
          >
            <BookOpen className="w-4 h-4 text-emerald-400" /> Xem Bài Mẫu ({question.sampleBand || 'Band 8.0+'})
          </button>

          <div className={`px-4 py-2 rounded-xl border text-xs font-extrabold flex items-center gap-2 font-mono ${
            timeLeftSeconds < 180
              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
              : 'bg-slate-900 text-purple-300 border-purple-500/30'
          }`}>
            <Clock className="w-4 h-4" />
            {minutesLeft < 10 ? `0${minutesLeft}` : minutesLeft}:{secondsLeft < 10 ? `0${secondsLeft}` : secondsLeft}
          </div>
        </div>
      </div>

      {/* Main Container */}
      {!evaluation ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Prompt & Stimulus */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-full text-xs font-bold">
                  {question.partTitle}
                </span>
                {question.sampleBand && (
                  <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 font-bold">
                    Target {question.sampleBand}
                  </span>
                )}
              </div>

              <h2 className="text-lg font-bold text-white leading-snug">
                {question.title}
              </h2>

              {question.chartData ? (
                <WritingChart chartData={question.chartData} />
              ) : question.imageUrl ? (
                <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 max-h-64 flex items-center justify-center">
                  <img src={question.imageUrl} alt={question.title} className="w-full h-full object-contain max-h-64" />
                </div>
              ) : null}

              {/* Given words banner for TOEIC Part 1 */}
              {question.givenWords && question.givenWords.length > 0 && (
                <div className="bg-purple-950/40 border border-purple-500/30 p-4 rounded-2xl space-y-2">
                  <span className="text-xs text-purple-300 font-bold block">
                    ⚠️ Bắt buộc dùng 2 từ gợi ý dưới đây:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {question.givenWords.map((word, idx) => (
                      <span key={idx} className="px-3 py-1 bg-purple-600/30 text-purple-200 border border-purple-500/40 rounded-xl text-xs font-mono font-extrabold">
                        {word}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs text-slate-300 font-mono leading-relaxed whitespace-pre-line">
                {question.prompt}
              </div>

              {/* Sample Answer Banner in Left Column */}
              <div className="bg-gradient-to-r from-emerald-950/40 to-teal-950/40 border border-emerald-500/30 p-4 rounded-2xl flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-emerald-400" /> Bài Viết Mẫu {question.sampleBand || 'Band 8.0+'}
                  </span>
                  <p className="text-[11px] text-slate-400">Tham khảo cấu trúc & từ vựng đạt điểm cao</p>
                </div>
                <button
                  onClick={() => setShowSampleModal(true)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-extrabold shadow transition flex-shrink-0"
                >
                  Xem Ngay
                </button>
              </div>

              {/* Vocabulary Tips */}
              {question.vocabularyTips && question.vocabularyTips.length > 0 && (
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Từ vựng gợi ý hữu ích:
                  </span>
                  <div className="grid grid-cols-1 gap-2">
                    {question.vocabularyTips.map((tip, idx) => (
                      <div key={idx} className="p-2.5 bg-slate-950 rounded-xl border border-slate-800/80 text-xs flex justify-between items-center">
                        <span className="font-bold text-purple-300">{tip.word}</span>
                        <span className="text-slate-400">{tip.meaning}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Essay Editor */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 flex flex-col justify-between min-h-[500px]">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-purple-400" /> Khung Soạn Thảo Bài Viết
                  </span>

                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-xl text-xs font-mono font-bold border transition ${
                      isWordCountMet
                        ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                        : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                    }`}>
                      Số từ: {wordCount} {question.minWords ? `/ ${question.minWords} từ` : 'từ'}
                    </span>
                  </div>
                </div>

                {!isWordCountMet && question.minWords && (
                  <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-[11px] flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    <span>Hãy viết thêm ít nhất <strong>{minWords - wordCount} từ</strong> nữa để đạt yêu cầu độ dài.</span>
                  </div>
                )}

                <textarea
                  rows={16}
                  value={essay}
                  onChange={(e) => setEssay(e.target.value)}
                  placeholder="Gõ hoặc dán bài viết tiếng Anh của bạn ở đây... (Hệ thống sẽ tự động đếm từ và chấm điểm ngữ pháp)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm text-white placeholder-slate-600 font-mono leading-relaxed focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition resize-y min-h-[320px]"
                ></textarea>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  onClick={() => setEssay('')}
                  disabled={!essay || isEvaluating}
                  className="w-full sm:w-auto px-4 py-2.5 text-xs text-slate-400 hover:text-rose-400 transition font-bold disabled:opacity-30"
                >
                  Xóa bài làm
                </button>

                <button
                  onClick={handleSubmitForEvaluation}
                  disabled={isEvaluating}
                  className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold rounded-2xl text-sm shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2 transition disabled:opacity-50"
                >
                  {isEvaluating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" /> AI Đang Chấm Bài Viết...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Nộp Bài & Nộp Điểm AI Ngay
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Evaluation Result Report */
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-8 animate-fadeIn">
          {/* Header Band / Level Badge */}
          <div className="bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/60 border border-purple-500/40 rounded-3xl p-6 sm:p-8 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold mb-3">
              <Award className="w-4 h-4 text-purple-400" /> BÁO CÁO CHẤM ĐIỂM {question.examType} WRITING
            </div>

            <h1 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-300 tracking-tight my-2">
              {evaluation.bandOrLevel}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed mt-2 font-medium">
              {evaluation.summaryFeedback}
            </p>

            <div className="mt-4 inline-flex items-center gap-2 px-4 py-1 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400 font-mono">
              <span>Độ dài bài viết: <strong>{evaluation.wordCount} từ</strong></span>
            </div>
          </div>

          {/* 4 Criteria Scores */}
          <div>
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-400" /> Đánh Giá Theo 4 Tiêu Chí Standard
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {evaluation.criteria.map((item, idx) => (
                <div key={idx} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-300">{item.name}</span>
                    <span className="text-xs font-extrabold text-emerald-400 font-mono">
                      {item.score} / {item.maxScore}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.comment}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Grammar Fixes */}
          {evaluation.grammarFixes && evaluation.grammarFixes.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <XCircle className="w-5 h-5 text-rose-400" /> Sửa Lỗi Ngữ Pháp & Chính Tả Chi Tiết
              </h3>
              <div className="space-y-3">
                {evaluation.grammarFixes.map((fix, idx) => (
                  <div key={idx} className="bg-slate-950 p-4 rounded-2xl border border-rose-500/20 space-y-2">
                    <div className="text-xs text-rose-300 flex items-center gap-2 font-mono">
                      <span className="px-2 py-0.5 bg-rose-500/20 rounded font-bold">Gốc:</span>
                      <span className="line-through">{fix.original}</span>
                    </div>
                    <div className="text-xs text-emerald-300 flex items-center gap-2 font-mono">
                      <span className="px-2 py-0.5 bg-emerald-500/20 rounded font-bold">Sửa:</span>
                      <span className="font-bold">{fix.corrected}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 italic pt-1 border-t border-slate-900">
                      💡 <strong>Giải thích:</strong> {fix.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Vocabulary Upgrades */}
          {evaluation.vocabularyUpgrades && evaluation.vocabularyUpgrades.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" /> Đề Xuất Nâng Cấp Từ Vựng Học Thuật (Band 8.0+)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {evaluation.vocabularyUpgrades.map((up, idx) => (
                  <div key={idx} className="bg-slate-950 p-4 rounded-2xl border border-amber-500/20 space-y-1 text-xs">
                    <div className="flex items-center justify-between font-mono">
                      <span className="text-slate-400">{up.original}</span>
                      <span className="text-amber-300 font-bold flex items-center gap-1">
                        ➜ {up.suggested}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">{up.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actionable Advice */}
          {evaluation.actionableAdvice && (
            <div className="bg-purple-950/30 border border-purple-500/30 rounded-2xl p-5 space-y-3">
              <h4 className="text-xs font-bold text-purple-300 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-purple-400" /> Lời Khuyên Cải Thiện Cho Bài Viết Tiếp Theo:
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {evaluation.actionableAdvice.map((adv, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-purple-400">•</span>
                    <span>{adv}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Sample Answer Section */}
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-400" /> Bài Viết Mẫu Chuẩn Band Cao (Sample Essay)
              </h3>
              <button
                onClick={handleCopySample}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
              >
                {copiedSample ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> Đã Copy
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy Bài Mẫu
                  </>
                )}
              </button>
            </div>

            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-xs text-slate-200 font-mono leading-relaxed whitespace-pre-line">
              {evaluation.sampleAnswer}
            </div>
          </div>

          {/* Bottom Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-800">
            <button
              onClick={() => {
                setEvaluation(null);
                setIsTimerRunning(true);
              }}
              className="w-full sm:w-auto px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl text-xs transition flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Viết Lại Bài Này
            </button>

            <button
              onClick={onBack}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-2xl text-xs shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2 transition"
            >
              <CheckCircle2 className="w-4 h-4" /> Chọn Đề Thi Writing Mới
            </button>
          </div>
        </div>
      )}

      {/* Model Essay Modal Backdrop */}
      {showSampleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowSampleModal(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-2xl">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-white">
                  Bài Viết Mẫu Tham Khảo ({question.sampleBand || 'Band 8.0+'})
                </h3>
                <p className="text-xs text-slate-400">
                  Phân tích cấu trúc câu và collocations chất lượng cao
                </p>
              </div>
            </div>

            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 font-mono text-xs text-slate-200 leading-relaxed whitespace-pre-line select-text">
              {question.sampleAnswer}
            </div>

            {question.vocabularyTips && question.vocabularyTips.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" /> Từ Vựng Nâng Cao Trong Bài Mẫu:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {question.vocabularyTips.map((tip, idx) => (
                    <div key={idx} className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-xs flex justify-between items-center">
                      <span className="font-bold text-amber-300 font-mono">{tip.word}</span>
                      <span className="text-slate-400">{tip.meaning}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <button
                onClick={handleCopySample}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 flex items-center gap-2 transition"
              >
                {copiedSample ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" /> Đã Coppy Vào Clipboard
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-cyan-400" /> Copy Bài Mẫu
                  </>
                )}
              </button>

              <button
                onClick={() => setShowSampleModal(false)}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow transition"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
