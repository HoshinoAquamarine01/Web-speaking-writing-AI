import React, { useState, useEffect, useRef } from 'react';
import type { Question, EvaluationResult } from '../types';
import { getSubQuestions } from '../utils/questionHelper';
import { AudioRecorderManager } from '../utils/audioRecorder';
import { evaluateSpeakingResponse } from '../utils/aiEvaluator';
import { useAuth } from '../context/AuthContext';
import {
  Mic,
  Square,
  Clock,
  ArrowLeft,
  ArrowRight,
  Volume2,
  AlertCircle,
  FileText,
  Play,
  RotateCcw,
  Loader2
} from 'lucide-react';

interface ExamRoomProps {
  question: Question;
  onBack: () => void;
  onFinishEvaluation: (result: EvaluationResult, transcript: string, audioUrl: string) => void;
}

export const ExamRoom: React.FC<ExamRoomProps> = ({ question, onBack, onFinishEvaluation }) => {
  const { user } = useAuth();
  const subQuestions = getSubQuestions(question);

  const [currentSubQIdx, setCurrentSubQIdx] = useState(0);

  const [phase, setPhase] = useState<'idle' | 'prep' | 'recording' | 'review' | 'evaluating'>('prep');
  const [prepTimeLeft, setPrepTimeLeft] = useState(question.prepTimeSeconds);
  const [recordTimeLeft, setRecordTimeLeft] = useState(question.responseTimeSeconds);

  // Separate records for each sub-question
  const [subQTranscripts, setSubQTranscripts] = useState<string[]>([]);
  const [subQAudios, setSubQAudios] = useState<string[]>([]);

  // Current active sub-question inputs
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [currentAudioUrl, setCurrentAudioUrl] = useState('');

  const [isMicAvailable, setIsMicAvailable] = useState(true);
  const [evalStepMessage, setEvalStepMessage] = useState('Đang phân tích bài nói...');

  const recorderRef = useRef<AudioRecorderManager | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const currentSubQuestionText = subQuestions[currentSubQIdx] || question.prompt;

  // Countdown timer cho Prep Phase
  useEffect(() => {
    let timer: any;
    if (phase === 'prep' && prepTimeLeft > 0) {
      timer = setInterval(() => {
        setPrepTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (phase === 'prep' && prepTimeLeft === 0) {
      handleStartRecording();
    }
    return () => clearInterval(timer);
  }, [phase, prepTimeLeft]);

  // Countdown timer cho Recording Phase
  useEffect(() => {
    let timer: any;
    if (phase === 'recording' && recordTimeLeft > 0) {
      timer = setInterval(() => {
        setRecordTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (phase === 'recording' && recordTimeLeft === 0) {
      handleStopRecording();
    }
    return () => clearInterval(timer);
  }, [phase, recordTimeLeft]);

  // Start recording
  const handleStartRecording = async () => {
    setPhase('recording');
    recorderRef.current = new AudioRecorderManager();

    const success = await recorderRef.current.startRecording(
      (text) => setCurrentTranscript(text),
      (dataArray) => drawVisualizer(dataArray)
    );

    if (!success) {
      setIsMicAvailable(false);
    }
  };

  // Stop recording
  const handleStopRecording = async () => {
    let finalAudio = currentAudioUrl;
    let finalText = currentTranscript;

    if (recorderRef.current && recorderRef.current.isRecording) {
      const res = await recorderRef.current.stopRecording();
      finalAudio = res.audioUrl;
      setCurrentAudioUrl(res.audioUrl);
      if (res.transcript) {
        finalText = res.transcript;
        setCurrentTranscript(res.transcript);
      }
    }

    // Save for current sub question
    const updatedTranscripts = [...subQTranscripts];
    updatedTranscripts[currentSubQIdx] = finalText;
    setSubQTranscripts(updatedTranscripts);

    const updatedAudios = [...subQAudios];
    updatedAudios[currentSubQIdx] = finalAudio;
    setSubQAudios(updatedAudios);

    setPhase('review');
  };

  // Move to next sub question
  const handleNextSubQuestion = () => {
    const nextIdx = currentSubQIdx + 1;
    if (nextIdx < subQuestions.length) {
      setCurrentSubQIdx(nextIdx);
      setPrepTimeLeft(question.prepTimeSeconds);
      setRecordTimeLeft(question.responseTimeSeconds);
      setCurrentTranscript(subQTranscripts[nextIdx] || '');
      setCurrentAudioUrl(subQAudios[nextIdx] || '');
      setPhase('prep');
    }
  };

  // Draw Audio Waveform
  const drawVisualizer = (dataArray: Uint8Array) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const barWidth = (width / dataArray.length) * 2;
    let x = 0;

    for (let i = 0; i < dataArray.length; i++) {
      const barHeight = (dataArray[i] / 255) * height;

      const gradient = ctx.createLinearGradient(0, height, 0, 0);
      gradient.addColorStop(0, '#06b6d4');
      gradient.addColorStop(1, '#6366f1');

      ctx.fillStyle = gradient;
      ctx.fillRect(x, height - barHeight, barWidth - 2, barHeight);
      x += barWidth;
    }
  };

  // Send all sub-question responses to AI Evaluator
  const handleEvaluate = async () => {
    setPhase('evaluating');

    const steps = [
      'Đang chuyển đổi giọng nói & nhận diện ngữ điệu từng câu...',
      'Phân tích 4 tiêu chí chấm điểm (Pronunciation, Fluency, Grammar, Vocabulary)...',
      'Phát hiện lỗi phát âm IPA & từ nhấn sai trong các câu trả lời...',
      'Tổng hợp bảng nhận xét & bài mẫu chuẩn cho bài thi...'
    ];

    for (let i = 0; i < steps.length; i++) {
      setEvalStepMessage(steps[i]);
      await new Promise((r) => setTimeout(r, 600));
    }

    // Combine all sub-question transcripts into full transcript text
    const fullCombinedTranscript = subQuestions.map((sq, idx) => {
      const subAns = subQTranscripts[idx] || currentTranscript || 'No response recorded';
      return subQuestions.length > 1 ? `[${sq}]: ${subAns}` : subAns;
    }).join('\n\n');

    const evaluation = await evaluateSpeakingResponse(
      question.examType,
      question,
      fullCombinedTranscript,
      user?.apiKey
    );

    const lastAudio = subQAudios[subQAudios.length - 1] || currentAudioUrl;
    onFinishEvaluation(evaluation, fullCombinedTranscript, lastAudio);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Quay lại danh sách đề
        </button>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            {question.examType} Speaking
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            {question.partTitle}
          </span>
        </div>
      </div>

      {/* Main Question & Sub-Question Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">{question.title}</h2>

          {question.imageUrl && (
            <div className="mb-4 rounded-2xl overflow-hidden border border-slate-800 max-h-80 bg-slate-950 flex items-center justify-center">
              <img src={question.imageUrl} alt={question.title} className="w-full h-full object-contain" />
            </div>
          )}

          {/* Sub-question progress tracker */}
          {subQuestions.length > 1 && (
            <div className="flex items-center justify-between bg-slate-950 p-4 rounded-2xl border border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded-xl text-xs font-bold font-mono">
                  Câu hỏi {currentSubQIdx + 1} / {subQuestions.length}
                </span>
                <span className="text-xs text-slate-400">
                  (Trả lời & Thu âm từng câu một)
                </span>
              </div>
              <div className="flex gap-1.5">
                {subQuestions.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold font-mono ${
                      idx < currentSubQIdx || (idx === currentSubQIdx && subQTranscripts[idx])
                        ? 'bg-emerald-500 text-slate-950 shadow'
                        : idx === currentSubQIdx
                        ? 'bg-cyan-500 text-white ring-2 ring-cyan-500/30'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {idx < currentSubQIdx || subQTranscripts[idx] ? '✓' : idx + 1}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Prompt / Sub-Question Box */}
          <div className="bg-slate-950 p-6 rounded-2xl border border-cyan-500/30 shadow-inner">
            <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>{subQuestions.length > 1 ? `CÂU HỎI HỌC VIÊN CẦN TRẢ LỜI (CÂU ${currentSubQIdx + 1}):` : 'ĐỀ BÀI & YÊU CẦU:'}</span>
            </h4>
            <p className="text-base sm:text-lg text-white font-mono leading-relaxed font-bold">
              {currentSubQuestionText}
            </p>
          </div>
        </div>

        {/* Prep Phase */}
        {phase === 'prep' && (
          <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-950/40 border border-amber-500/30 rounded-2xl p-6 text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-bold">
              <Clock className="w-4 h-4 animate-spin" /> THỜI GIAN CHUẨN BỊ {subQuestions.length > 1 ? `CÂU ${currentSubQIdx + 1}` : 'BÀI NÓI'}
            </div>
            <div className="text-5xl font-black text-amber-400 font-mono tracking-wider">
              00:{prepTimeLeft < 10 ? `0${prepTimeLeft}` : prepTimeLeft}
            </div>
            <p className="text-xs text-slate-400">Đọc kỹ câu hỏi và phác thảo các ý chính trong đầu trước khi phát biểu.</p>

            <button
              onClick={handleStartRecording}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-sm shadow-lg shadow-amber-500/20 inline-flex items-center gap-2 transition"
            >
              <Mic className="w-4 h-4" /> Bỏ qua chuẩn bị & Bắt đầu Thu âm ngay
            </button>
          </div>
        )}

        {/* Recording Phase */}
        {phase === 'recording' && (
          <div className="bg-gradient-to-r from-cyan-950/50 via-slate-900 to-indigo-950/50 border border-cyan-500/30 rounded-2xl p-6 text-center space-y-5">
            <div className="flex items-center justify-between max-w-md mx-auto">
              <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold flex items-center gap-1.5 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span> ĐANG THU ÂM CÂU {currentSubQIdx + 1}
              </span>
              <span className="text-2xl font-black text-cyan-400 font-mono">
                {Math.floor(recordTimeLeft / 60)}:{recordTimeLeft % 60 < 10 ? `0${recordTimeLeft % 60}` : recordTimeLeft % 60}
              </span>
            </div>

            {/* Waveform Canvas */}
            <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 h-24 flex items-center justify-center">
              <canvas ref={canvasRef} width={500} height={70} className="w-full h-full"></canvas>
            </div>

            {/* Live STT Transcript */}
            <div className="bg-slate-950/90 p-4 rounded-xl border border-slate-800 text-left">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-1">
                <Volume2 className="w-4 h-4 text-cyan-400" /> Nhận diện giọng nói thời gian thực (Live STT) - Câu {currentSubQIdx + 1}:
              </div>
              <p className="text-sm text-cyan-200 min-h-[40px] italic">
                {currentTranscript || '(Hãy cất tiếng nói rõ ràng vào micro...)'}
              </p>
            </div>

            {!isMicAvailable && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                Không thể truy cập Microphone. Bạn vẫn có thể gõ nội dung câu trả lời ở bên dưới để thử AI Chấm điểm.
              </div>
            )}

            <button
              onClick={handleStopRecording}
              className="px-8 py-3 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold rounded-xl text-sm shadow-xl shadow-rose-600/30 inline-flex items-center gap-2 transition"
            >
              <Square className="w-4 h-4" /> Dừng Thu Âm Câu {currentSubQIdx + 1}
            </button>
          </div>
        )}

        {/* Review & Next Sub-Question / Submit Phase */}
        {(phase === 'review' || phase === 'evaluating') && (
          <div className="space-y-5">
            {/* Playback current audio */}
            {currentAudioUrl && (
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                    <Play className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Bản thu âm Câu {currentSubQIdx + 1} của bạn</p>
                    <p className="text-xs text-slate-400">Nghe lại trước khi chuyển câu tiếp theo</p>
                  </div>
                </div>
                <audio src={currentAudioUrl} controls className="w-full sm:w-auto h-10"></audio>
              </div>
            )}

            {/* Editable Transcript Textbox */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-cyan-400" /> Nội dung nói cho Câu {currentSubQIdx + 1} (Transcript)
                </span>
                <span className="text-[11px] text-slate-500">
                  (Bạn có thể chỉnh sửa lại chữ nếu micro ghi âm bị thiếu từ)
                </span>
              </label>
              <textarea
                rows={3}
                value={currentTranscript}
                onChange={(e) => {
                  setCurrentTranscript(e.target.value);
                  const updated = [...subQTranscripts];
                  updated[currentSubQIdx] = e.target.value;
                  setSubQTranscripts(updated);
                }}
                placeholder="Nội dung bài nói cho câu này xuất hiện tại đây..."
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
              ></textarea>
            </div>

            {/* Action buttons */}
            {phase === 'review' && (
              <div className="flex flex-col sm:flex-row gap-3 justify-between items-center pt-2">
                <button
                  onClick={() => {
                    setPhase('prep');
                    setPrepTimeLeft(question.prepTimeSeconds);
                    setRecordTimeLeft(question.responseTimeSeconds);
                    setCurrentTranscript('');
                    setCurrentAudioUrl('');
                  }}
                  className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs border border-slate-700 flex items-center justify-center gap-2 transition"
                >
                  <RotateCcw className="w-4 h-4" /> Thu Âm Lại Câu {currentSubQIdx + 1}
                </button>

                {currentSubQIdx + 1 < subQuestions.length ? (
                  <button
                    onClick={handleNextSubQuestion}
                    className="px-8 py-3.5 bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-extrabold rounded-2xl text-sm shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 transition"
                  >
                    Lưu Câu {currentSubQIdx + 1} & Sang Câu {currentSubQIdx + 2} <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleEvaluate}
                    className="px-8 py-3.5 bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-slate-950 font-extrabold rounded-2xl text-sm shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 transition"
                  >
                    Hoàn Thành Tất Cả {subQuestions.length} Câu & Xem Kết Quả
                  </button>
                )}
              </div>
            )}

            {phase === 'evaluating' && (
              <div className="bg-slate-950 p-8 rounded-2xl border border-indigo-500/30 text-center space-y-4">
                <Loader2 className="w-10 h-10 text-cyan-400 animate-spin mx-auto" />
                <h3 className="text-lg font-bold text-white">Hệ Thống Đang Phân Tích & Chấm Điểm Bài Nói</h3>
                <p className="text-xs text-cyan-300 font-mono animate-pulse">{evalStepMessage}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
