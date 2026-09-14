import React, { useState } from 'react';
import type { ExamType } from '../types';
import { speakText, stopSpeaking } from '../utils/speechSynth';
import {
  Volume2,
  CheckCircle2,
  RotateCcw,
  PenTool,
  HelpCircle,
  BookOpen,
  Search,
  ChevronLeft,
  ChevronRight,
  Square,
  ListOrdered,
  FileText
} from 'lucide-react';

interface DictationLesson {
  id: string;
  examType: ExamType;
  title: string;
  level: string;
  originalText: string;
  hintVocabulary: string[];
}

const PRESET_LESSONS: DictationLesson[] = [
  {
    id: 'dic-toeic-1',
    examType: 'TOEIC',
    title: 'TOEIC Part 1: Quảng cáo thiết bị EchoMind Pro',
    level: 'Target 160-180 (Trung cấp)',
    originalText: 'Designed to simplify your daily routine, EchoMind Pro features advanced voice recognition. It provides real-time energy monitoring and seamless integration with all your smart appliances.',
    hintVocabulary: ['simplify', 'recognition', 'seamless', 'appliances']
  },
  {
    id: 'dic-toeic-2',
    examType: 'TOEIC',
    title: 'TOEIC Part 1: Thông báo thay đổi cổng khởi hành',
    level: 'Target 150+ (Cơ bản)',
    originalText: 'Attention passengers on Flight VN-452 to Tokyo. Departure gate has been changed from Gate 12 to Gate 18B due to maintenance work on the main runway.',
    hintVocabulary: ['passengers', 'departure', 'maintenance', 'runway']
  },
  {
    id: 'dic-toeic-3',
    examType: 'TOEIC',
    title: 'TOEIC Part 1: Dự báo thời tiết & Giao thông cao tốc',
    level: 'Target 170+ (Trung cấp)',
    originalText: 'Commuter traffic along Highway 101 is experiencing heavy delays due to ongoing road repairs near Exit 5. Drivers are strongly advised to take alternative routes.',
    hintVocabulary: ['commuter', 'experiencing', 'alternative', 'utilize']
  },
  {
    id: 'dic-toeic-4',
    examType: 'TOEIC',
    title: 'TOEIC Part 5: Lợi ích làm việc nhóm trong doanh nghiệp',
    level: 'Target 190+ (Nâng cao)',
    originalText: 'Team members bring diverse skills and perspectives. This enables faster problem solving and creative brainstorming for major commercial projects.',
    hintVocabulary: ['perspectives', 'brainstorming', 'commercial', 'enabling']
  },
  {
    id: 'dic-ielts-1',
    examType: 'IELTS',
    title: 'IELTS Part 3: Vai trò của công nghệ và thầy cô',
    level: 'Target Band 7.5-8.5 (Nâng cao)',
    originalText: 'Technology has fundamentally transformed modern pedagogy. It shifts teachers from traditional knowledge authority figures to facilitators of learning.',
    hintVocabulary: ['fundamentally', 'pedagogy', 'facilitators', 'authority']
  },
  {
    id: 'dic-ielts-2',
    examType: 'IELTS',
    title: 'IELTS Part 1: Quê hương Đà Nẵng & Cơ sở hạ tầng',
    level: 'Target Band 6.5-7.5 (Khá)',
    originalText: 'What I appreciate most about my hometown is the perfect blend of modern infrastructure. It offers peaceful natural surroundings along the coastline.',
    hintVocabulary: ['infrastructure', 'surroundings', 'coastline', 'appreciate']
  },
  {
    id: 'dic-ielts-3',
    examType: 'IELTS',
    title: 'IELTS Part 2: Thiết bị tai nghe chống ồn chủ động',
    level: 'Target Band 8.0+ (Nâng cao)',
    originalText: 'The active noise-cancellation technology effectively blocks out ambient background noise. It allows me to enter a state of deep focus.',
    hintVocabulary: ['cancellation', 'effectively', 'ambient', 'indispensable']
  },
  {
    id: 'dic-ielts-4',
    examType: 'IELTS',
    title: 'IELTS Part 3: Trách nhiệm bảo vệ môi trường toàn cầu',
    level: 'Target Band 8.5+ (Xuất sắc)',
    originalText: 'Environmental conservation requires a collaborative effort. Governments must establish strict regulatory frameworks while individuals adopt sustainable habits.',
    hintVocabulary: ['conservation', 'collaborative', 'regulatory', 'sustainable']
  }
];

function getSentences(text: string): string[] {
  const clean = text.trim();
  const matched = clean.match(/[^.!?]+[.!?]+/g);
  if (matched && matched.length > 0) {
    return matched.map((s) => s.trim());
  }
  return [clean];
}

function cleanStr(s: string) {
  return s.toLowerCase().replace(/[^\w\s]/g, '').trim();
}

export const DictationMode: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'preset' | 'custom'>('preset');
  const [selectedLesson, setSelectedLesson] = useState<DictationLesson>(PRESET_LESSONS[0]);
  const [searchQuery, setSearchQuery] = useState('');

  const [customTitle, setCustomTitle] = useState('');
  const [customText, setCustomText] = useState('');

  // Mode: sentence by sentence vs full passage
  const [mode, setMode] = useState<'sentence' | 'full'>('sentence');
  const [currentSentenceIdx, setCurrentSentenceIdx] = useState(0);

  // Store user input for each sentence index
  const [sentenceInputs, setSentenceInputs] = useState<{ [idx: number]: string }>({});
  const [fullInput, setFullInput] = useState('');

  const [isPlaying, setIsPlaying] = useState(false);
  const [playingIdx, setPlayingIdx] = useState<number | 'full' | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [showResult, setShowResult] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const sentences = getSentences(selectedLesson.originalText);

  const filteredLessons = PRESET_LESSONS.filter((l) =>
    l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.examType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const resetStateForLesson = (lesson: DictationLesson) => {
    setSelectedLesson(lesson);
    setSentenceInputs({});
    setFullInput('');
    setCurrentSentenceIdx(0);
    setShowResult(false);
    setShowHint(false);
    stopSpeaking();
    setIsPlaying(false);
    setPlayingIdx(null);
  };

  const handleApplyCustomText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customText.trim()) return;

    const words = customText.trim().split(/\s+/);
    const hints = words.filter((w) => w.length > 6).slice(0, 5);

    const newLesson: DictationLesson = {
      id: 'custom-' + Date.now(),
      examType: 'IELTS',
      title: customTitle.trim() || 'Bài tập Chép chính tả tự nhập của bạn',
      level: 'Tự chọn (Custom Input)',
      originalText: customText.trim(),
      hintVocabulary: hints
    };

    resetStateForLesson(newLesson);
    setActiveTab('preset');
  };

  const handlePlaySentence = (idx: number) => {
    const targetSentence = sentences[idx];
    if (!targetSentence) return;

    setIsPlaying(true);
    setPlayingIdx(idx);
    speakText(targetSentence, playbackSpeed, () => {
      setIsPlaying(false);
      setPlayingIdx(null);
    });
  };

  const handlePlayFull = () => {
    setIsPlaying(true);
    setPlayingIdx('full');
    speakText(selectedLesson.originalText, playbackSpeed, () => {
      setIsPlaying(false);
      setPlayingIdx(null);
    });
  };

  const handleStopAudio = () => {
    stopSpeaking();
    setIsPlaying(false);
    setPlayingIdx(null);
  };

  // Compute accuracy
  const calculateResult = () => {
    if (mode === 'sentence') {
      let totalTargetWords = 0;
      let totalCorrectWords = 0;

      const sentenceDiffs = sentences.map((sText, sIdx) => {
        const uText = sentenceInputs[sIdx] || '';
        const tWords = cleanStr(sText).split(/\s+/).filter(Boolean);
        const uWords = cleanStr(uText).split(/\s+/).filter(Boolean);

        let correct = 0;
        const diffs = tWords.map((tW, wIdx) => {
          const uW = uWords[wIdx];
          const isCorrect = uW && uW === tW;
          if (isCorrect) correct++;
          return { target: tW, user: uW || '', isCorrect };
        });

        totalTargetWords += tWords.length;
        totalCorrectWords += correct;

        const sentenceAccuracy = Math.round((correct / Math.max(1, tWords.length)) * 100);

        return {
          sentenceIdx: sIdx,
          targetSentence: sText,
          userSentence: uText,
          accuracy: sentenceAccuracy,
          wordDiffs: diffs
        };
      });

      const overallAccuracy = Math.round((totalCorrectWords / Math.max(1, totalTargetWords)) * 100);
      return { overallAccuracy, sentenceDiffs };
    } else {
      const tWords = cleanStr(selectedLesson.originalText).split(/\s+/).filter(Boolean);
      const uWords = cleanStr(fullInput).split(/\s+/).filter(Boolean);

      let correct = 0;
      const diffs = tWords.map((tW, wIdx) => {
        const uW = uWords[wIdx];
        const isCorrect = uW && uW === tW;
        if (isCorrect) correct++;
        return { target: tW, user: uW || '', isCorrect };
      });

      const overallAccuracy = Math.round((correct / Math.max(1, tWords.length)) * 100);
      return { overallAccuracy, sentenceDiffs: [{ sentenceIdx: 0, targetSentence: selectedLesson.originalText, userSentence: fullInput, accuracy: overallAccuracy, wordDiffs: diffs }] };
    }
  };

  const resultData = showResult ? calculateResult() : null;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn pb-12">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="px-3 py-1 text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-full inline-flex items-center gap-1.5 mb-3">
            <PenTool className="w-3.5 h-3.5" /> Phương Pháp Luyện Nghe Chép Chính Tả Từng Câu (Sentence Dictation)
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Luyện Nghe & Chép Chính Tả Từng Câu</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
            Hệ thống tự động phân tách bài đọc thành **từng câu đơn**, cho phép bạn nghe đi nghe lại từng câu chuẩn bản xứ và gõ chính tả chính xác 100%!
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab('preset')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'preset' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" /> Đề Mẫu ({PRESET_LESSONS.length})
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'custom' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" /> Tự Dán Văn Bản
          </button>
        </div>
      </div>

      {/* Custom Text Form */}
      {activeTab === 'custom' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
            <PenTool className="w-4 h-4" /> Dán Văn Bản Hoặc Transcript Bạn Muốn Chép Chính Tả Từng Câu
          </div>
          <form onSubmit={handleApplyCustomText} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Tiêu đề đoạn văn (VD: BBC News Audio Clip 1)"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <textarea
                rows={4}
                required
                placeholder="Dán đoạn văn bản tiếng Anh ở đây... Hệ thống sẽ tự động tách thành từng câu đọc riêng biệt!"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono leading-relaxed"
              ></textarea>
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow inline-flex items-center gap-2 transition"
            >
              <CheckCircle2 className="w-4 h-4" /> Tách Thành Bài Tập Chép Từng Câu
            </button>
          </form>
        </div>
      )}

      {/* Preset Lessons Selector */}
      {activeTab === 'preset' && (
        <div className="space-y-4">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Tìm kiếm chủ đề Dictation (VD: EchoMind, Đà Nẵng, giao thông, môi trường...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {filteredLessons.map((l) => (
              <button
                key={l.id}
                onClick={() => resetStateForLesson(l)}
                className={`p-3.5 rounded-2xl text-xs font-bold text-left border transition flex flex-col justify-between space-y-2 ${
                  selectedLesson.id === l.id
                    ? 'bg-gradient-to-br from-indigo-900/60 to-purple-950/60 border-indigo-500 text-indigo-200 shadow-lg shadow-indigo-500/10 ring-2 ring-indigo-500/40'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] bg-slate-950 font-mono text-cyan-400 font-bold">
                    {l.examType}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400">{l.level}</span>
                </div>
                <div className="line-clamp-2 text-xs font-bold leading-snug">{l.title}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Dictation Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="px-3 py-0.5 rounded-full text-[11px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 inline-block mb-1">
              {selectedLesson.examType} Dictation • {sentences.length} câu
            </span>
            <h3 className="text-lg font-bold text-white leading-snug">{selectedLesson.title}</h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHint(!showHint)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-semibold rounded-xl border border-slate-700 flex items-center gap-1.5 transition"
            >
              <HelpCircle className="w-3.5 h-3.5" /> {showHint ? 'Ẩn Từ Gợi Ý' : 'Gợi Ý Từ Vựng'}
            </button>
          </div>
        </div>

        {/* Vocabulary Hints */}
        {showHint && (
          <div className="bg-cyan-950/40 p-4 rounded-2xl border border-cyan-500/30 text-xs space-y-1 animate-fadeIn">
            <span className="font-bold text-cyan-300">💡 Từ vựng chìa khóa xuất hiện trong bài:</span>
            <div className="flex flex-wrap gap-2 pt-1">
              {selectedLesson.hintVocabulary.map((word, i) => (
                <span key={i} className="px-2.5 py-1 bg-slate-900 text-cyan-200 font-mono rounded-lg border border-slate-800 font-bold">
                  {word}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Mode Switch: Chép Từng Câu (Recommended) vs Chép Cả Đoạn */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-950 p-3 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setMode('sentence')}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-1.5 ${
                mode === 'sentence'
                  ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ListOrdered className="w-4 h-4" /> Chép Từng Câu ({sentences.length} câu) ⭐
            </button>
            <button
              onClick={() => setMode('full')}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-1.5 ${
                mode === 'full'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" /> Chép Cả Đoạn Văn
            </button>
          </div>

          {/* Speed Controls */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400">Tốc độ đọc:</span>
            {[0.75, 1.0].map((s) => (
              <button
                key={s}
                onClick={() => setPlaybackSpeed(s)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  playbackSpeed === s ? 'bg-indigo-600 text-white shadow' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {s === 0.75 ? '0.75x (Chậm)' : '1.0x (Chuẩn)'}
              </button>
            ))}
          </div>
        </div>

        {/* MODE 1: SENTENCE BY SENTENCE DICTATION */}
        {mode === 'sentence' && (
          <div className="space-y-6">
            {/* Sentence Tabs Navigation Bar */}
            <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
              <div className="flex items-center gap-1.5">
                {sentences.map((_, idx) => {
                  const isFilled = Boolean(sentenceInputs[idx]?.trim());
                  const isCurrent = idx === currentSentenceIdx;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        setCurrentSentenceIdx(idx);
                        setShowResult(false);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 ${
                        isCurrent
                          ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30 ring-2 ring-cyan-400/50'
                          : isFilled
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      <span>Câu {idx + 1}</span>
                      {isFilled && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                    </button>
                  );
                })}
              </div>

              <div className="text-xs font-mono text-slate-400 flex-shrink-0">
                Tiến trình: <strong className="text-cyan-300">{Object.keys(sentenceInputs).filter(k => sentenceInputs[Number(k)]?.trim()).length} / {sentences.length} câu</strong>
              </div>
            </div>

            {/* Active Sentence Player Card */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-5 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-xl text-xs font-extrabold font-mono">
                    CÂU {currentSentenceIdx + 1} / {sentences.length}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    (Nhấn phát audio bên cạnh để nghe đi nghe lại)
                  </span>
                </div>

                {/* Sentence Audio Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (isPlaying && playingIdx === currentSentenceIdx) {
                        handleStopAudio();
                      } else {
                        handlePlaySentence(currentSentenceIdx);
                      }
                    }}
                    className={`px-5 py-2.5 rounded-xl font-extrabold text-xs shadow-lg flex items-center gap-2 transition ${
                      isPlaying && playingIdx === currentSentenceIdx
                        ? 'bg-amber-600 hover:bg-amber-500 text-white'
                        : 'bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white shadow-cyan-500/20'
                    }`}
                  >
                    {isPlaying && playingIdx === currentSentenceIdx ? (
                      <>
                        <Square className="w-4 h-4" /> Dừng Đọc
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-4 h-4 animate-pulse" /> Phát Câu {currentSentenceIdx + 1}
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handlePlaySentence(currentSentenceIdx)}
                    className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold border border-slate-700 transition"
                    title="Nghe lại câu hiện tại"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Active Sentence Input Box */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-300">
                  Gõ lại chính xác nội dung Tiếng Anh của <span className="text-cyan-300">Câu {currentSentenceIdx + 1}</span>:
                </label>
                <textarea
                  rows={3}
                  value={sentenceInputs[currentSentenceIdx] || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSentenceInputs((prev) => ({ ...prev, [currentSentenceIdx]: val }));
                    setShowResult(false);
                  }}
                  placeholder={`Lắng nghe audio câu ${currentSentenceIdx + 1} và gõ lại ở đây...`}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono leading-relaxed"
                ></textarea>
              </div>

              {/* Prev / Next Sentence Stepper */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => {
                    if (currentSentenceIdx > 0) {
                      const prevIdx = currentSentenceIdx - 1;
                      setCurrentSentenceIdx(prevIdx);
                      handlePlaySentence(prevIdx);
                    }
                  }}
                  disabled={currentSentenceIdx === 0}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold rounded-xl border border-slate-800 flex items-center gap-1.5 transition disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4" /> Câu Trước
                </button>

                <button
                  onClick={() => {
                    if (currentSentenceIdx < sentences.length - 1) {
                      const nextIdx = currentSentenceIdx + 1;
                      setCurrentSentenceIdx(nextIdx);
                      handlePlaySentence(nextIdx);
                    }
                  }}
                  disabled={currentSentenceIdx === sentences.length - 1}
                  className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl shadow flex items-center gap-1.5 transition disabled:opacity-40"
                >
                  Câu Tiếp Theo <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODE 2: FULL PASSAGE DICTATION */}
        {mode === 'full' && (
          <div className="space-y-4">
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-slate-300 block">Nghe Toàn Bộ Đoạn Văn</span>
                <span className="text-[11px] text-slate-400">Phát toàn bộ {sentences.length} câu từ đầu đến cuối</span>
              </div>
              <button
                onClick={isPlaying && playingIdx === 'full' ? handleStopAudio : handlePlayFull}
                className={`px-8 py-3 rounded-2xl font-extrabold text-xs shadow-xl flex items-center gap-2 transition ${
                  isPlaying && playingIdx === 'full'
                    ? 'bg-amber-600 hover:bg-amber-500 text-white'
                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-600/20'
                }`}
              >
                <Volume2 className="w-5 h-5 animate-pulse" /> {isPlaying && playingIdx === 'full' ? 'Dừng Nghe Audio' : 'Phát Toàn Bộ Audio'}
              </button>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-300">
                Gõ lại toàn bộ đoạn văn nghe được:
              </label>
              <textarea
                rows={6}
                value={fullInput}
                onChange={(e) => {
                  setFullInput(e.target.value);
                  setShowResult(false);
                }}
                placeholder="Lắng nghe toàn bộ audio và bắt đầu gõ chính tả ở đây..."
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-purple-500 font-mono leading-relaxed"
              ></textarea>
            </div>
          </div>
        )}

        {/* Bottom Actions Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <button
            onClick={() => {
              setSentenceInputs({});
              setFullInput('');
              setShowResult(false);
            }}
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs border border-slate-700 flex items-center justify-center gap-2 transition"
          >
            <RotateCcw className="w-4 h-4" /> Làm Lại Toàn Bài
          </button>

          <button
            onClick={() => setShowResult(true)}
            className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-extrabold rounded-xl text-xs shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-2 transition"
          >
            <CheckCircle2 className="w-4 h-4" /> Kiểm Tra Đáp Án Chính Tả Tất Cả Các Câu
          </button>
        </div>

        {/* Detailed Result Report */}
        {showResult && resultData && (
          <div className="bg-slate-950 p-6 rounded-2xl border border-cyan-500/40 space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">KẾT QUẢ ĐỘ CHÍNH XÁC CHÍNH TẢ TOÀN BÀI:</span>
                <span className="text-xs text-slate-400">So sánh từng từ gõ của bạn với văn bản gốc chuẩn bản xứ</span>
              </div>
              <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-300 font-mono">
                {resultData.overallAccuracy}%
              </span>
            </div>

            {/* Per-Sentence Detailed Comparison */}
            <div className="space-y-4">
              <h5 className="text-xs font-bold text-slate-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> So Sánh Chi Tiết Từng Câu (Xanh = Đúng, Đỏ = Thiếu/Sai):
              </h5>

              {resultData.sentenceDiffs.map((sDiff, idx) => (
                <div key={idx} className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                    <span className="text-xs font-bold text-cyan-300 font-mono">
                      Câu {sDiff.sentenceIdx + 1} / {sentences.length}
                    </span>
                    <span className="text-xs font-extrabold text-emerald-400 font-mono">
                      Độ chính xác: {sDiff.accuracy}%
                    </span>
                  </div>

                  {/* Word-by-word diff */}
                  <div className="flex flex-wrap gap-1.5 bg-slate-950 p-3 rounded-lg border border-slate-800/80 leading-loose">
                    {sDiff.wordDiffs.map((wDiff, wIdx) => (
                      <span
                        key={wIdx}
                        className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
                          wDiff.isCorrect
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/30 line-through'
                        }`}
                        title={wDiff.isCorrect ? 'Chính xác' : `Từ gốc chuẩn: ${wDiff.target}`}
                      >
                        {wDiff.user || `[${wDiff.target}]`}
                      </span>
                    ))}
                  </div>

                  {/* Original Sentence */}
                  <div className="text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/60 font-mono">
                    <span className="font-bold text-emerald-400 block mb-0.5">Văn bản gốc chuẩn bản xứ:</span>
                    <p className="text-slate-200 font-bold">{sDiff.targetSentence}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
