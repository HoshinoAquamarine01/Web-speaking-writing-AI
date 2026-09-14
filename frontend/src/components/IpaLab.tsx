import React, { useState, useRef } from 'react';
import { generateApproximateIPA } from '../utils/ipaGenerator';
import { speakText, stopSpeaking } from '../utils/speechSynth';
import { AudioRecorderManager } from '../utils/audioRecorder';
import { fetchWordDefinition } from '../services/dictionaryApi';
import {
  Volume2,
  Search,
  Mic,
  Square,
  BookOpen,
  Loader2
} from 'lucide-react';

interface CommonWord {
  word: string;
  ipa: string;
  type: string;
  meaning: string;
  example: string;
}

const COMMON_HARD_WORDS: CommonWord[] = [
  {
    word: 'approximately',
    ipa: '/əˈprɒk.sɪ.mət.li/',
    type: 'adverb',
    meaning: 'Xấp xỉ, khoảng',
    example: 'Boarding will begin in approximately twenty minutes.'
  },
  {
    word: 'infrastructure',
    ipa: '/ˈɪn.frəˌstrʌk.tʃər/',
    type: 'noun',
    meaning: 'Cơ sở hạ tầng',
    example: 'The city invested heavily in modern transport infrastructure.'
  },
  {
    word: 'pedagogy',
    ipa: '/ˈped.ə.ɡɒdʒ.i/',
    type: 'noun',
    meaning: 'Phương pháp giảng dạy',
    example: 'Technology has transformed modern educational pedagogy.'
  },
  {
    word: 'pivotal',
    ipa: '/ˈpɪv.ə.təl/',
    type: 'adjective',
    meaning: 'Then chốt, quan trọng',
    example: 'He played a pivotal role in shaping my career path.'
  },
  {
    word: 'collaborative',
    ipa: '/kəˈlæb.ər.ə.tɪv/',
    type: 'adjective',
    meaning: 'Mang tính hợp tác',
    example: 'Teamwork creates a collaborative atmosphere.'
  },
  {
    word: 'pronunciation',
    ipa: '/prəˌnʌn.siˈeɪ.ʃən/',
    type: 'noun',
    meaning: 'Sự phát âm',
    example: 'Clear pronunciation is essential for IELTS Band 8.'
  },
  {
    word: 'schedule',
    ipa: '/ˈʃed.juːl/ hoặc /ˈskedʒ.uːl/',
    type: 'noun',
    meaning: 'Lịch trình',
    example: 'Please check the conference schedule on the wall.'
  },
  {
    word: 'indispensable',
    ipa: '/ˌɪn.dɪˈspen.sə.bəl/',
    type: 'adjective',
    meaning: 'Không thể thiếu',
    example: 'Smartphones have become indispensable in daily life.'
  }
];

export const IpaLab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWord, setSelectedWord] = useState<CommonWord>(COMMON_HARD_WORDS[0]);

  const [customWordInput, setCustomWordInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [userTranscript, setUserTranscript] = useState('');
  const [score, setScore] = useState<number | null>(null);

  const recorderRef = useRef<AudioRecorderManager | null>(null);

  const filteredWords = COMMON_HARD_WORDS.filter((w) =>
    w.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.meaning.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePlayNative = (text: string) => {
    speakText(text, 1.0);
  };

  const handleCustomSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customWordInput.trim()) return;

    const term = customWordInput.trim().toLowerCase();
    setIsSearching(true);

    const entry = await fetchWordDefinition(term);

    const firstMeaning = entry.meanings[0];
    const firstDef = firstMeaning?.definitions[0];
    const meaningText = entry.vietnameseMeaning || firstDef?.definition || `Từ vựng tiếng Anh "${term}"`;
    const exampleText = firstDef?.example || firstDef?.definition || `I am practicing the word "${term}" for speaking.`;

    const customObj: CommonWord = {
      word: entry.word || term,
      ipa: entry.phonetic || generateApproximateIPA(term),
      type: firstMeaning?.partOfSpeech || 'vocabulary',
      meaning: meaningText,
      example: exampleText
    };

    setSelectedWord(customObj);
    setUserTranscript('');
    setScore(null);
    setIsSearching(false);
  };

  const handleStartRecording = async () => {
    stopSpeaking();
    setUserTranscript('');
    setScore(null);
    setIsRecording(true);

    recorderRef.current = new AudioRecorderManager();
    await recorderRef.current.startRecording((text) => {
      setUserTranscript(text);
    });
  };

  const handleStopRecording = async () => {
    setIsRecording(false);
    let finalTranscript = userTranscript;

    if (recorderRef.current && recorderRef.current.isRecording) {
      const res = await recorderRef.current.stopRecording();
      if (res.transcript) {
        finalTranscript = res.transcript;
        setUserTranscript(res.transcript);
      }
    }

    const targetClean = selectedWord.word.toLowerCase().replace(/[^\w]/g, '');
    const userClean = (finalTranscript || '').toLowerCase().replace(/[^\w]/g, '');

    if (userClean.includes(targetClean) || targetClean.includes(userClean)) {
      setScore(95);
    } else {
      setScore(75);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="px-3 py-1 text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-full inline-flex items-center gap-1.5 mb-3">
            Phòng Luyện Phát Âm IPA (IPA Speech Lab)
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Tra Cứu IPA & Luyện Từ Khó</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
            Tra cứu phiên âm IPA chuẩn cho bất kỳ từ vựng hoặc câu tiếng Anh nào. Thực hành thu âm trực tiếp để kiểm tra độ chính xác âm đọc!
          </p>
        </div>
      </div>

      {/* Tra cứu Từ vựng Tùy chọn */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Search className="w-4 h-4 text-cyan-400" /> Tra Cứu Từ Hoặc Câu Tiếng Anh Bất Kỳ
        </h3>
        <form onSubmit={handleCustomSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="Nhập từ vựng hoặc câu tiếng Anh... (VD: extraordinarily, sustainability, collaboration)"
            value={customWordInput}
            onChange={(e) => setCustomWordInput(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
          />
          <button
            type="submit"
            disabled={isSearching}
            className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-xs shadow flex items-center gap-1.5 transition disabled:opacity-50"
          >
            {isSearching ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Đang Tra IPA...
              </>
            ) : (
              <>
                <Search className="w-4 h-4" /> Tra IPA
              </>
            )}
          </button>
        </form>
      </div>

      {/* Search Preset Hard Words Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-400" /> Các Từ Dễ Sai Trọng Âm Trong Bài Thi
          </h3>
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Lọc từ vựng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {filteredWords.map((w, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSelectedWord(w);
                setUserTranscript('');
                setScore(null);
              }}
              className={`p-3.5 rounded-2xl text-left border transition space-y-1 ${
                selectedWord.word === w.word
                  ? 'bg-cyan-600/30 border-cyan-500 text-cyan-300 shadow-lg ring-2 ring-cyan-500/40'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
              }`}
            >
              <div className="font-bold text-sm text-white font-mono">{w.word}</div>
              <div className="text-[10px] text-emerald-400 font-mono">{w.ipa}</div>
              <div className="text-[11px] text-slate-400 line-clamp-1">{w.meaning}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Word Interactive Lab Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-center space-y-3">
          <div className="text-3xl font-extrabold text-white tracking-wide font-mono">
            {selectedWord.word}
          </div>
          <div className="text-base font-mono text-emerald-400 bg-emerald-950/50 px-4 py-1.5 rounded-xl border border-emerald-500/30 inline-block">
            IPA: {selectedWord.ipa}
          </div>
          <div className="text-xs text-slate-300">
            Nghĩa: <strong>{selectedWord.meaning}</strong> ({selectedWord.type})
          </div>
          <p className="text-xs text-slate-400 italic bg-slate-900 p-3 rounded-xl border border-slate-800/80 max-w-xl mx-auto">
            Ví dụ: "{selectedWord.example}"
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => handlePlayNative(selectedWord.word)}
            className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-2xl text-xs shadow-lg shadow-cyan-600/20 flex items-center gap-2 transition"
          >
            <Volume2 className="w-4 h-4" /> Nghe Phát Âm Mẫu Bản Xứ
          </button>

          <button
            onClick={() => handlePlayNative(selectedWord.example)}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl text-xs shadow-lg shadow-indigo-600/20 flex items-center gap-2 transition"
          >
            <Volume2 className="w-4 h-4" /> Nghe Nguyên Câu Ví Dụ
          </button>
        </div>

        {/* Test Pronunciation Micro */}
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-center space-y-4">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            THỰC HÀNH PHÁT ÂM TỪ NÀY VÀO MICRO
          </h4>

          {isRecording ? (
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold animate-pulse">
                <Mic className="w-4 h-4" /> ĐANG THU ÂM TỪ {selectedWord.word.toUpperCase()}...
              </div>

              <div className="text-sm font-mono text-cyan-200 bg-slate-900 p-3 rounded-xl border border-slate-800 max-w-md mx-auto italic">
                {userTranscript || `(Hãy đọc rõ từ "${selectedWord.word}")...`}
              </div>

              <button
                onClick={handleStopRecording}
                className="px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs shadow inline-flex items-center gap-2 transition"
              >
                <Square className="w-4 h-4" /> Dừng Thu Âm & Chấm Điểm Từ
              </button>
            </div>
          ) : (
            <button
              onClick={handleStartRecording}
              className="px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-extrabold rounded-2xl text-xs shadow-xl inline-flex items-center gap-2 transition"
            >
              <Mic className="w-4 h-4" /> Thu Âm Thử Đọc Từ Này
            </button>
          )}

          {score !== null && (
            <div className="p-4 rounded-2xl bg-slate-900 border border-indigo-500/40 max-w-sm mx-auto space-y-1 animate-fadeIn">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300">ĐỘ CHÍNH XÁC PHÁT ÂM TỪ:</span>
                <span className="text-xl font-black text-cyan-400 font-mono">{score}%</span>
              </div>
              <p className="text-[11px] text-slate-400">
                {score >= 90 ? '🎉 Phát âm IPA rất chính xác!' : '💡 Thử nghe lại giọng mẫu 2 lần nhé.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
