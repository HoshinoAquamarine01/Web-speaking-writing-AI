import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { ExamSelector } from './components/ExamSelector';
import { ExamRoom } from './components/ExamRoom';
import { FullExamRunner } from './components/FullExamRunner';
import { WritingSelector } from './components/WritingSelector';
import { WritingRoom } from './components/WritingRoom';
import { ResultReport } from './components/ResultReport';
import { UserDashboard } from './components/UserDashboard';
import { ShadowingMode } from './components/ShadowingMode';
import { DictationMode } from './components/DictationMode';
import { IpaLab } from './components/IpaLab';
import { VocabNotebook } from './components/VocabNotebook';
import type { Question, WritingQuestion, EvaluationResult, TestSubmission, MainTab, ExamType, SkillMode } from './types';
import { HelpCircle, X, ShieldCheck } from 'lucide-react';

function MainApp() {
  const { user, saveSubmission } = useAuth();
  const [activeTab, setActiveTab] = useState<MainTab>('exam');
  const [skillMode, setSkillMode] = useState<SkillMode>('speaking');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);

  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [selectedWritingQuestion, setSelectedWritingQuestion] = useState<WritingQuestion | null>(null);
  const [fullExamType, setFullExamType] = useState<ExamType | null>(null);

  const [currentEvaluationData, setCurrentEvaluationData] = useState<{
    evaluation: EvaluationResult;
    question: Question;
    transcript: string;
    audioUrl: string;
  } | null>(null);

  const handleStartExam = (q: Question) => {
    setSelectedQuestion(q);
    setFullExamType(null);
    setCurrentEvaluationData(null);
  };

  const handleStartFullExam = (examType: ExamType) => {
    setFullExamType(examType);
    setSelectedQuestion(null);
    setCurrentEvaluationData(null);
  };

  const handleFinishEvaluation = (
    evaluation: EvaluationResult,
    transcript: string,
    audioUrl: string
  ) => {
    if (!selectedQuestion) return;

    const data = {
      evaluation,
      question: selectedQuestion,
      transcript,
      audioUrl
    };
    setCurrentEvaluationData(data);

    const submission: TestSubmission = {
      id: 'sub-' + Date.now(),
      userId: user?.id || 'guest',
      timestamp: new Date().toISOString(),
      examType: selectedQuestion.examType,
      questionId: selectedQuestion.id,
      questionTitle: selectedQuestion.title,
      questionPrompt: selectedQuestion.prompt,
      transcript,
      audioBlobUrl: audioUrl,
      evaluation
    };
    saveSubmission(submission);
  };

  const handleFinishFullExam = (
    compositeEvaluation: EvaluationResult,
    partResults: { question: Question; transcript: string; evaluation: EvaluationResult }[]
  ) => {
    if (!fullExamType) return;

    const masterQuestion: Question = {
      id: `full-exam-${Date.now()}`,
      examType: fullExamType,
      part: 1,
      partTitle: `Full Exam Test (${fullExamType})`,
      title: `Bài Thi Thử Trọn Bộ Full ${fullExamType} Speaking (${partResults.length} Parts)`,
      prompt: partResults.map((r, i) => `[Part ${i + 1} - ${r.question.partTitle}]: ${r.question.title}`).join('\n'),
      prepTimeSeconds: 45,
      responseTimeSeconds: 60,
      sampleAnswer: compositeEvaluation.sampleAnswer
    };

    setCurrentEvaluationData({
      evaluation: compositeEvaluation,
      question: masterQuestion,
      transcript: compositeEvaluation.transcript,
      audioUrl: ''
    });

    setFullExamType(null);

    const submission: TestSubmission = {
      id: 'sub-full-' + Date.now(),
      userId: user?.id || 'guest',
      timestamp: new Date().toISOString(),
      examType: fullExamType,
      questionId: masterQuestion.id,
      questionTitle: masterQuestion.title,
      questionPrompt: masterQuestion.prompt,
      transcript: compositeEvaluation.transcript,
      evaluation: compositeEvaluation
    };
    saveSubmission(submission);
  };

  const handleViewPastSubmission = (sub: TestSubmission) => {
    setSelectedQuestion({
      id: sub.questionId || 'past-q',
      examType: sub.examType,
      part: 1,
      partTitle: `${sub.examType} Practice`,
      title: sub.questionTitle,
      prompt: sub.questionPrompt,
      prepTimeSeconds: 45,
      responseTimeSeconds: 60,
      sampleAnswer: sub.evaluation.sampleAnswer
    });

    setCurrentEvaluationData({
      evaluation: sub.evaluation,
      question: {
        id: sub.questionId || 'past-q',
        examType: sub.examType,
        part: 1,
        partTitle: `${sub.examType} Practice`,
        title: sub.questionTitle,
        prompt: sub.questionPrompt,
        prepTimeSeconds: 45,
        responseTimeSeconds: 60,
        sampleAnswer: sub.evaluation.sampleAnswer
      },
      transcript: sub.transcript,
      audioUrl: sub.audioBlobUrl || ''
    });

    setActiveTab('exam');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-white flex flex-col justify-between">
      <div>
        <Navbar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            if (tab !== 'exam') {
              setSelectedQuestion(null);
              setSelectedWritingQuestion(null);
              setFullExamType(null);
              setCurrentEvaluationData(null);
            }
          }}
          skillMode={skillMode}
          setSkillMode={(mode) => {
            setSkillMode(mode);
            setSelectedQuestion(null);
            setSelectedWritingQuestion(null);
            setFullExamType(null);
            setCurrentEvaluationData(null);
          }}
          onOpenAuth={() => setIsAuthModalOpen(true)}
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
          {currentEvaluationData ? (
            <ResultReport
              examType={currentEvaluationData.question.examType}
              question={currentEvaluationData.question}
              evaluation={currentEvaluationData.evaluation}
              audioUrl={currentEvaluationData.audioUrl}
              onRetake={() => setCurrentEvaluationData(null)}
              onSelectNew={() => {
                setSelectedQuestion(null);
                setFullExamType(null);
                setCurrentEvaluationData(null);
              }}
            />
          ) : fullExamType ? (
            <FullExamRunner
              examType={fullExamType}
              onBack={() => setFullExamType(null)}
              onFinishFullExam={handleFinishFullExam}
            />
          ) : selectedQuestion ? (
            <ExamRoom
              question={selectedQuestion}
              onBack={() => setSelectedQuestion(null)}
              onFinishEvaluation={handleFinishEvaluation}
            />
          ) : selectedWritingQuestion ? (
            <WritingRoom
              question={selectedWritingQuestion}
              onBack={() => setSelectedWritingQuestion(null)}
            />
          ) : activeTab === 'shadowing' ? (
            <ShadowingMode />
          ) : activeTab === 'dictation' ? (
            <DictationMode />
          ) : activeTab === 'ipalab' ? (
            <IpaLab />
          ) : activeTab === 'vocab' ? (
            <VocabNotebook />
          ) : activeTab === 'dashboard' ? (
            <UserDashboard onViewSubmission={handleViewPastSubmission} />
          ) : skillMode === 'writing' ? (
            <WritingSelector
              onStartWriting={(q) => setSelectedWritingQuestion(q)}
            />
          ) : (
            <ExamSelector
              onStartExam={handleStartExam}
              onStartFullExam={handleStartFullExam}
            />
          )}
        </main>
      </div>

      {/* Modern Footer */}
      <footer className="bg-slate-900/90 border-t border-slate-800/80 text-slate-400 py-8 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-white text-sm tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-indigo-300">
              AI SPEAKING MASTER
            </span>
            <span>• Hệ thống Luyện Thi, Tra IPA & Collocations Tiếng Việt</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowGuideModal(true)}
              className="hover:text-cyan-400 transition flex items-center gap-1 font-semibold"
            >
              <HelpCircle className="w-3.5 h-3.5" /> Hướng Dẫn Thang Điểm TOEIC & IELTS
            </button>
            <span className="text-slate-700">|</span>
            <span className="flex items-center gap-1 text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> AI Engine Online
            </span>
          </div>
        </div>
      </footer>

      {/* Guide Modal */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setShowGuideModal(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-center gap-2 text-slate-300 font-bold mb-2">
              <ShieldCheck className="w-5 h-5 text-cyan-400" /> Thang Điểm & 4 Tiêu Chí Chấm Thi Standard
            </div>

            <div className="space-y-4 text-xs text-slate-300">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <h4 className="font-bold text-cyan-300 text-sm">📘 HỆ THỐNG THANG ĐIỂM TOEIC SPEAKING (0 - 200)</h4>
                <p>• <strong>Level 8 (190 - 200 điểm)</strong>: Phát âm rất chuẩn, ngữ điệu tự nhiên, phản xạ linh hoạt.</p>
                <p>• <strong>Level 7 (160 - 180 điểm)</strong>: Truyền đạt rõ ràng, ngữ pháp chính xác, ít lỗi nhỏ.</p>
                <p>• <strong>Level 6 (130 - 150 điểm)</strong>: Trả lời đúng trọng tâm, đôi lúc còn vấp ngắt quãng.</p>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <h4 className="font-bold text-indigo-300 text-sm">📕 HỆ THỐNG THANG ĐIỂM IELTS SPEAKING (Band 0.0 - 9.0)</h4>
                <p>• <strong>Fluency and Coherence (FC)</strong>: Độ lưu loát, liên kết câu và khả năng phát triển ý tưởng.</p>
                <p>• <strong>Lexical Resource (LR)</strong>: Vốn từ vựng phong phú, sử dụng Collocations / Idioms tự nhiên.</p>
                <p>• <strong>Grammatical Range and Accuracy (GRA)</strong>: Sự đa dạng các dạng câu phức và độ chính xác ngữ pháp.</p>
                <p>• <strong>Pronunciation (P)</strong>: Phát âm rõ nghĩa, nhấn đúng trọng âm từ và ngữ điệu câu bổng trầm.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
