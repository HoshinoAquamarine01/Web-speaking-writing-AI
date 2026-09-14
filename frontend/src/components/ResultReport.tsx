import React from 'react';
import type { EvaluationResult, Question, ExamType } from '../types';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Volume2,
  ArrowRight,
  RotateCcw,
  MessageSquareText,
  Lightbulb,
  Printer,
  Download
} from 'lucide-react';

interface ResultReportProps {
  examType: ExamType;
  question: Question;
  evaluation: EvaluationResult;
  audioUrl?: string;
  onRetake: () => void;
  onSelectNew: () => void;
}

export const ResultReport: React.FC<ResultReportProps> = ({
  examType,
  question,
  evaluation,
  audioUrl,
  onRetake,
  onSelectNew
}) => {
  const isToeic = examType === 'TOEIC';

  const handlePrintReport = () => {
    window.print();
  };

  const handleDownloadAudio = () => {
    if (!audioUrl) return;
    const a = document.createElement('a');
    a.href = audioUrl;
    a.download = `Speaking_Recording_${Date.now()}.webm`;
    a.click();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn print:text-black print:bg-white">
      {/* Printable / Download Header Bar */}
      <div className="flex items-center justify-between print:hidden">
        <span className="text-xs text-slate-400 font-mono">
          Báo cáo điểm số chi tiết ({examType} Speaking)
        </span>
        <div className="flex items-center gap-2">
          {audioUrl && (
            <button
              onClick={handleDownloadAudio}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-bold rounded-xl border border-slate-700 flex items-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5" /> Tải Giọng Âm (.webm)
            </button>
          )}
          <button
            onClick={handlePrintReport}
            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow flex items-center gap-1.5 transition"
          >
            <Printer className="w-3.5 h-3.5" /> Xuất Báo Cáo PDF / In
          </button>
        </div>
      </div>

      {/* Overall Score Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-6 sm:p-10 shadow-2xl">
        <div className="absolute -top-10 -right-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Báo Cáo Chấm Điểm Speaking ({examType})
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{question.title}</h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              {evaluation.summaryFeedback}
            </p>
          </div>

          {/* Big Score Gauge */}
          <div className="flex flex-col items-center justify-center bg-slate-900/90 border border-slate-700/80 p-6 rounded-3xl shadow-xl min-w-[200px]">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
              ĐIỂM OVERALL
            </span>
            <div className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300 font-mono my-1">
              {isToeic ? evaluation.overallScore : evaluation.overallScore.toFixed(1)}
            </div>
            <span className="text-xs font-extrabold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              {evaluation.bandOrLevel}
            </span>
          </div>
        </div>
      </div>

      {/* Audio Playback if available */}
      {audioUrl && (
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
          <div className="flex items-center gap-3">
            <Volume2 className="w-5 h-5 text-cyan-400" />
            <span className="text-xs font-bold text-white">Nghe lại giọng nói bài làm của bạn:</span>
          </div>
          <audio src={audioUrl} controls className="w-full sm:w-auto h-9"></audio>
        </div>
      )}

      {/* 4 Criteria Scores Breakdown */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-cyan-400" />
          <h2 className="text-xl font-bold text-white">Đánh Giá Chi Tiết 4 Tiêu Chí</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {evaluation.criteria.map((c, idx) => {
            const percent = (c.score / c.maxScore) * 100;
            return (
              <div
                key={idx}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-white">{c.name}</span>
                    <span className="text-sm font-extrabold text-cyan-400 font-mono">
                      {c.score}/{c.maxScore}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mb-3">{c.englishName}</div>

                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-3">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                    {c.comment}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pronunciation & IPA Analysis */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex items-center gap-3 text-rose-400">
          <Volume2 className="w-6 h-6" />
          <div>
            <h3 className="text-lg font-bold text-white">Phân Tích Phát Âm & Trọng Âm (Pronunciation Issues)</h3>
            <p className="text-xs text-slate-400">
              Các từ bạn đã phát âm chưa chuẩn hoặc cần sửa lại ngữ điệu/trọng âm
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {evaluation.pronunciationIssues.map((issue, idx) => (
            <div key={idx} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-rose-300 font-mono">{issue.word}</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  {issue.issueType === 'stress_error' ? 'Sai Trọng Âm' : 'Sai Phát Âm'}
                </span>
              </div>
              <div className="text-xs text-emerald-400 font-mono bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-500/20 inline-block">
                IPA Chuẩn: {issue.correctIpa}
              </div>
              {issue.userSpoken && (
                <div className="text-[11px] text-slate-400">
                  Cách đọc thực tế: <span className="text-slate-300 font-mono">{issue.userSpoken}</span>
                </div>
              )}
              <p className="text-xs text-slate-300 leading-relaxed border-t border-slate-800 pt-2 mt-1">
                💡 {issue.advice}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Grammar & Vocabulary Fixes */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex items-center gap-3 text-amber-400">
          <BookOpen className="w-6 h-6" />
          <div>
            <h3 className="text-lg font-bold text-white">Sửa Lỗi Ngữ Pháp & Cấu Trúc (Grammar Corrections)</h3>
            <p className="text-xs text-slate-400">Gợi ý cách sửa câu văn chính xác và tự nhiên như người bản xứ</p>
          </div>
        </div>

        <div className="space-y-3">
          {evaluation.grammarFixes.map((fix, idx) => (
            <div key={idx} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
              <div className="flex items-start gap-2 text-rose-400 text-xs font-mono">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-rose-300">Câu gốc bài nói:</span> "{fix.original}"
                </div>
              </div>
              <div className="flex items-start gap-2 text-emerald-400 text-xs font-mono bg-emerald-950/30 p-2.5 rounded-xl border border-emerald-500/20">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-emerald-300">Đề xuất sửa chuẩn:</span> "{fix.corrected}"
                </div>
              </div>
              <p className="text-xs text-slate-300 pl-6">💬 {fix.explanation}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Actionable Advice */}
      <div className="bg-gradient-to-br from-indigo-950/50 via-slate-900 to-cyan-950/50 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex items-center gap-3 text-cyan-400">
          <Lightbulb className="w-6 h-6" />
          <h3 className="text-lg font-bold text-white">Nhận Xét Cụ Thể: Cần Làm Gì Để Tăng Điểm</h3>
        </div>

        <ul className="space-y-3">
          {evaluation.actionableAdvice.map((adv, idx) => (
            <li key={idx} className="flex items-start gap-3 bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
              <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-bold text-xs flex items-center justify-center flex-shrink-0">
                {idx + 1}
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">{adv}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Sample Answer High Score */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-emerald-400">
            <MessageSquareText className="w-6 h-6" />
            <h3 className="text-lg font-bold text-white">Bài Trả Lời Mẫu Tham Khảo (Sample Band 8.0+)</h3>
          </div>
        </div>

        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
          <p className="text-sm text-emerald-200 font-mono leading-relaxed whitespace-pre-line">
            {evaluation.sampleAnswer}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-end pt-4 print:hidden">
        <button
          onClick={onRetake}
          className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-2xl text-sm border border-slate-700 flex items-center justify-center gap-2 transition"
        >
          <RotateCcw className="w-4 h-4" /> Thu Âm Thi Lại Đề Này
        </button>
        <button
          onClick={onSelectNew}
          className="px-8 py-3.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-extrabold rounded-2xl text-sm shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 transition"
        >
          Chọn Đề Thi Khác <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
