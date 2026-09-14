import React, { useState, useEffect, useRef } from 'react';
import type { Question, ExamType, EvaluationResult } from '../types';
import { getSubQuestions } from '../utils/questionHelper';
import { TOEIC_QUESTIONS } from '../data/toeicQuestions';
import { IELTS_QUESTIONS } from '../data/ieltsQuestions';
import { AudioRecorderManager } from '../utils/audioRecorder';
import { evaluateSpeakingResponse } from '../utils/aiEvaluator';
import { useAuth } from '../context/AuthContext';
import {
  Award,
  Clock,
  Mic,
  Square,
  ArrowRight,
  Loader2
} from 'lucide-react';

interface FullExamRunnerProps {
  examType: ExamType;
  onBack: () => void;
  onFinishFullExam: (
    compositeEvaluation: EvaluationResult,
    partResults: { question: Question; transcript: string; evaluation: EvaluationResult }[]
  ) => void;
}

export const FullExamRunner: React.FC<FullExamRunnerProps> = ({
  examType,
  onFinishFullExam
}) => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentPartIdx, setCurrentPartIdx] = useState(0);
  const [currentSubQIdx, setCurrentSubQIdx] = useState(0);

  const [phase, setPhase] = useState<'loading' | 'prep' | 'recording' | 'review' | 'evaluating_step' | 'evaluating_master'>('loading');
  const [prepTimeLeft, setPrepTimeLeft] = useState(45);
  const [recordTimeLeft, setRecordTimeLeft] = useState(45);

  const [subQTranscripts, setSubQTranscripts] = useState<string[]>([]);
  const [subQAudios, setSubQAudios] = useState<string[]>([]);
  const [transcript, setTranscript] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [isMicAvailable, setIsMicAvailable] = useState(true);

  // Store completed part results
  const [partResults, setPartResults] = useState<{
    question: Question;
    transcript: string;
    evaluation: EvaluationResult;
  }[]>([]);

  const recorderRef = useRef<AudioRecorderManager | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Load Full Set of questions on mount
  useEffect(() => {
    async function loadFullSet() {
      setPhase('loading');
      let fullSet: Question[] = [];

      if (examType === 'TOEIC') {
        const p1 = TOEIC_QUESTIONS.find((q) => q.part === 1) || TOEIC_QUESTIONS[0];
        const p2 = TOEIC_QUESTIONS.find((q) => q.part === 2) || TOEIC_QUESTIONS[4];
        const p3 = TOEIC_QUESTIONS.find((q) => q.part === 3) || TOEIC_QUESTIONS[7];
        const p4 = TOEIC_QUESTIONS.find((q) => q.part === 4) || TOEIC_QUESTIONS[9];
        const p5 = TOEIC_QUESTIONS.find((q) => q.part === 5) || TOEIC_QUESTIONS[11];
        fullSet = [p1, p2, p3, p4, p5];
      } else {
        const p1 = IELTS_QUESTIONS.find((q) => q.part === 1) || IELTS_QUESTIONS[0];
        const p2 = IELTS_QUESTIONS.find((q) => q.part === 2) || IELTS_QUESTIONS[3];
        const p3 = IELTS_QUESTIONS.find((q) => q.part === 3) || IELTS_QUESTIONS[6];
        fullSet = [p1, p2, p3];
      }

      setQuestions(fullSet);
      setCurrentPartIdx(0);
      setCurrentSubQIdx(0);
      setPrepTimeLeft(fullSet[0].prepTimeSeconds);
      setRecordTimeLeft(fullSet[0].responseTimeSeconds);
      setSubQTranscripts([]);
      setSubQAudios([]);
      setPhase('prep');
    }
    loadFullSet();
  }, [examType]);

  const currentQuestion = questions[currentPartIdx];
  const subQuestions = currentQuestion ? getSubQuestions(currentQuestion) : [];
  const currentSubQuestionText = subQuestions[currentSubQIdx] || currentQuestion?.prompt;

  // Countdown timer cho Prep phase
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

  // Countdown timer cho Recording phase
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

  const handleStartRecording = async () => {
    setPhase('recording');
    recorderRef.current = new AudioRecorderManager();
    const success = await recorderRef.current.startRecording(
      (text) => setTranscript(text),
      (dataArray) => drawVisualizer(dataArray)
    );
    if (!success) setIsMicAvailable(false);
  };

  const handleStopRecording = async () => {
    let finalAudio = audioUrl;
    let finalText = transcript;

    if (recorderRef.current && recorderRef.current.isRecording) {
      const res = await recorderRef.current.stopRecording();
      finalAudio = res.audioUrl;
      setAudioUrl(res.audioUrl);
      if (res.transcript) {
        finalText = res.transcript;
        setTranscript(res.transcript);
      }
    }

    const updatedTrans = [...subQTranscripts];
    updatedTrans[currentSubQIdx] = finalText;
    setSubQTranscripts(updatedTrans);

    const updatedAud = [...subQAudios];
    updatedAud[currentSubQIdx] = finalAudio;
    setSubQAudios(updatedAud);

    setPhase('review');
  };

  const handleNextSubQuestionInPart = () => {
    const nextSubIdx = currentSubQIdx + 1;
    if (nextSubIdx < subQuestions.length) {
      setCurrentSubQIdx(nextSubIdx);
      setPrepTimeLeft(currentQuestion.prepTimeSeconds);
      setRecordTimeLeft(currentQuestion.responseTimeSeconds);
      setTranscript(subQTranscripts[nextSubIdx] || '');
      setAudioUrl(subQAudios[nextSubIdx] || '');
      setPhase('prep');
    }
  };

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

  // Submit current part and move to next part or generate Master Report
  const handleNextPart = async () => {
    setPhase('evaluating_step');

    const fullPartTranscript = subQuestions.map((sq, idx) => {
      const ans = subQTranscripts[idx] || transcript || 'Sample student response';
      return subQuestions.length > 1 ? `[${sq}]: ${ans}` : ans;
    }).join('\n\n');

    // Chấm điểm cho Part hiện tại
    const stepEval = await evaluateSpeakingResponse(
      examType,
      currentQuestion,
      fullPartTranscript,
      user?.apiKey
    );

    const updatedResults = [
      ...partResults,
      {
        question: currentQuestion,
        transcript: fullPartTranscript,
        evaluation: stepEval
      }
    ];

    setPartResults(updatedResults);

    if (currentPartIdx + 1 < questions.length) {
      // Chuyển sang Part tiếp theo
      const nextIdx = currentPartIdx + 1;
      const nextQ = questions[nextIdx];
      setCurrentPartIdx(nextIdx);
      setCurrentSubQIdx(0);
      setSubQTranscripts([]);
      setSubQAudios([]);
      setPrepTimeLeft(nextQ.prepTimeSeconds);
      setRecordTimeLeft(nextQ.responseTimeSeconds);
      setTranscript('');
      setAudioUrl('');
      setPhase('prep');
    } else {
      // Đã hoàn thành Full bộ đề thi -> Tạo Báo cáo Tổng hợp Master Report
      setPhase('evaluating_master');

      const totalScore = updatedResults.reduce((acc, r) => acc + r.evaluation.overallScore, 0);
      const avgScore = totalScore / updatedResults.length;

      let masterOverallScore = 170;
      let masterBandOrLevel = 'Level 7 (170/200)';

      if (examType === 'TOEIC') {
        masterOverallScore = Math.min(200, Math.round(avgScore));
        if (masterOverallScore >= 190) masterBandOrLevel = 'Level 8 (190-200/200)';
        else if (masterOverallScore >= 160) masterBandOrLevel = 'Level 7 (160-180/200)';
        else masterBandOrLevel = 'Level 6 (130-150/200)';
      } else {
        masterOverallScore = Math.min(9.0, Math.max(4.0, Math.round(avgScore * 2) / 2));
        masterBandOrLevel = `Band ${masterOverallScore.toFixed(1)}`;
      }

      const masterEvaluation: EvaluationResult = {
        overallScore: masterOverallScore,
        bandOrLevel: masterBandOrLevel,
        summaryFeedback: `Báo cáo tổng hợp Full Đề Thi ${examType} Speaking (${questions.length} Parts). Bạn đã hoàn thành xuất sắc bài thi với tổng điểm **${masterBandOrLevel}**. Phản xạ nói liên tục, phát âm tự nhiên.`,
        criteria: updatedResults[0].evaluation.criteria,
        pronunciationIssues: updatedResults.flatMap((r) => r.evaluation.pronunciationIssues).slice(0, 5),
        grammarFixes: updatedResults.flatMap((r) => r.evaluation.grammarFixes).slice(0, 3),
        actionableAdvice: [
          'Duy trì tốc độ nói ổn định qua tất cả các Part mà không bị ngắt quãng giữa chừng.',
          'Tiếp tục mở rộng vốn từ vựng Collocations chuyên ngành cho các chủ đề thảo luận.',
          'Thực hành luyện thi Full Đề định kỳ 1 tuần/lần để tăng sức bền tâm lý thi thật.'
        ],
        sampleAnswer: updatedResults.map((r) => `[${r.question.partTitle}]: ${r.evaluation.sampleAnswer}`).join('\n\n'),
        transcript: updatedResults.map((r) => `[${r.question.partTitle}]: ${r.transcript}`).join('\n\n')
      };

      onFinishFullExam(masterEvaluation, updatedResults);
    }
  };

  if (phase === 'loading' || !currentQuestion) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-4 max-w-2xl mx-auto my-12">
        <Loader2 className="w-10 h-10 text-cyan-400 animate-spin mx-auto" />
        <h3 className="text-lg font-bold text-white">Đang Khởi Tạo Bộ Đề Thi Full ({examType} Speaking)...</h3>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn">
      {/* Full Exam Header Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow inline-flex items-center gap-1.5 mb-2">
            <Award className="w-3.5 h-3.5" /> THI THỬ FULL ĐỀ ({examType} SPEAKING)
          </span>
          <h2 className="text-xl font-bold text-white">
            Tiến độ: Part {currentPartIdx + 1} / {questions.length} — {currentQuestion.partTitle}
          </h2>
        </div>

        {/* Step dots */}
        <div className="flex items-center gap-2">
          {questions.map((_, idx) => (
            <div
              key={idx}
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs font-mono transition ${
                idx < currentPartIdx
                  ? 'bg-emerald-500 text-slate-950 shadow'
                  : idx === currentPartIdx
                  ? 'bg-cyan-500 text-white ring-4 ring-cyan-500/20'
                  : 'bg-slate-800 text-slate-500'
              }`}
            >
              {idx < currentPartIdx ? '✓' : idx + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Part Exam Room Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div>
          <h3 className="text-lg font-bold text-cyan-300 mb-2">{currentQuestion.title}</h3>
          {currentQuestion.imageUrl && (
            <div className="mb-4 rounded-2xl overflow-hidden border border-slate-800 max-h-72 bg-slate-950 flex items-center justify-center">
              <img src={currentQuestion.imageUrl} alt={currentQuestion.title} className="w-full h-full object-contain" />
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
                  (Thu âm từng câu một)
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

          <div className="bg-slate-950 p-5 rounded-2xl border border-cyan-500/30">
            <p className="text-base text-white font-mono leading-relaxed font-bold">
              {currentSubQuestionText}
            </p>
          </div>
        </div>

        {/* Prep Phase */}
        {phase === 'prep' && (
          <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-950/40 border border-amber-500/30 rounded-2xl p-6 text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-bold">
              <Clock className="w-4 h-4 animate-spin" /> CHUẨN BỊ {subQuestions.length > 1 ? `CÂU ${currentSubQIdx + 1}` : `PART ${currentPartIdx + 1}`}
            </div>
            <div className="text-5xl font-black text-amber-400 font-mono tracking-wider">
              00:{prepTimeLeft < 10 ? `0${prepTimeLeft}` : prepTimeLeft}
            </div>
            <button
              onClick={handleStartRecording}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold rounded-xl text-xs shadow-lg inline-flex items-center gap-2 transition"
            >
              <Mic className="w-4 h-4" /> Bỏ Qua Chuẩn Bị & Bắt Đầu Thu Âm
            </button>
          </div>
        )}

        {/* Recording Phase */}
        {phase === 'recording' && (
          <div className="bg-gradient-to-r from-cyan-950/50 via-slate-900 to-indigo-950/50 border border-cyan-500/30 rounded-2xl p-6 text-center space-y-5">
            <div className="flex items-center justify-between max-w-md mx-auto">
              <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold flex items-center gap-1.5 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span> THU ÂM {subQuestions.length > 1 ? `CÂU ${currentSubQIdx + 1}` : `PART ${currentPartIdx + 1}`}
              </span>
              <span className="text-2xl font-black text-cyan-400 font-mono">
                {Math.floor(recordTimeLeft / 60)}:{recordTimeLeft % 60 < 10 ? `0${recordTimeLeft % 60}` : recordTimeLeft % 60}
              </span>
            </div>

            <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 h-24 flex items-center justify-center">
              <canvas ref={canvasRef} width={500} height={70} className="w-full h-full"></canvas>
            </div>

            <div className="bg-slate-950/90 p-4 rounded-xl border border-slate-800 text-left">
              <p className="text-xs text-slate-400 font-bold mb-1">STT Nhận diện giọng nói:</p>
              <p className="text-sm text-cyan-200 italic font-mono min-h-[30px]">
                {transcript || '(Hãy nói phát biểu vào micro...)'}
              </p>
            </div>

            <button
              onClick={handleStopRecording}
              className="px-8 py-3 bg-gradient-to-r from-rose-600 to-pink-600 text-white font-bold rounded-xl text-xs shadow-xl inline-flex items-center gap-2 transition"
            >
              <Square className="w-4 h-4" /> Dừng Thu Âm {subQuestions.length > 1 ? `Câu ${currentSubQIdx + 1}` : `Part ${currentPartIdx + 1}`}
            </button>
          </div>
        )}

        {/* Review & Next Step */}
        {(phase === 'review' || phase === 'evaluating_step' || phase === 'evaluating_master') && (
          <div className="space-y-4">
            {audioUrl && (
              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between gap-4">
                <span className="text-xs font-bold text-slate-300">Bản thu âm:</span>
                <audio src={audioUrl} controls className="h-8"></audio>
              </div>
            )}

            {!isMicAvailable && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs">
                Không thể truy cập Microphone. Bạn có thể gõ nội dung câu trả lời ở bên dưới.
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-300">
                Nội dung phát biểu {subQuestions.length > 1 ? `Câu ${currentSubQIdx + 1}` : `Part ${currentPartIdx + 1}`} của bạn:
              </label>
              <textarea
                rows={3}
                value={transcript}
                onChange={(e) => {
                  setTranscript(e.target.value);
                  const updated = [...subQTranscripts];
                  updated[currentSubQIdx] = e.target.value;
                  setSubQTranscripts(updated);
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-white font-mono"
              ></textarea>
            </div>

            {phase === 'review' && (
              <div className="flex justify-end gap-3 pt-2">
                {currentSubQIdx + 1 < subQuestions.length ? (
                  <button
                    onClick={handleNextSubQuestionInPart}
                    className="px-8 py-3.5 bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-extrabold rounded-2xl text-sm shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 transition"
                  >
                    Lưu Câu {currentSubQIdx + 1} & Sang Câu {currentSubQIdx + 2} <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleNextPart}
                    className="px-8 py-3.5 bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-extrabold rounded-2xl text-sm shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 transition"
                  >
                    {currentPartIdx + 1 < questions.length ? (
                      <>
                        Hoàn Thành Part {currentPartIdx + 1} & Sang Part {currentPartIdx + 2} <ArrowRight className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        Hoàn Thành Full Đề & Xem Báo Cáo Tổng Hợp
                      </>
                    )}
                  </button>
                )}
              </div>
            )}

            {(phase === 'evaluating_step' || phase === 'evaluating_master') && (
              <div className="bg-slate-950 p-6 rounded-2xl border border-indigo-500/30 text-center space-y-3">
                <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
                <h4 className="text-base font-bold text-white">
                  {phase === 'evaluating_master'
                    ? 'Hệ Thống Đang Phân Tích & Tổng Hợp Điểm Số Full Đề Thi...'
                    : `Đang Phân Tích & Chấm Bài Part ${currentPartIdx + 1}...`}
                </h4>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
