import React, { useState, useEffect } from 'react';
import { fetchWordDefinition, type DictionaryEntry } from '../services/dictionaryApi';
import { speakText } from '../utils/speechSynth';
import { useAuth } from '../context/AuthContext';
import type { SavedWord } from '../types';
import {
  Volume2,
  Search,
  Bookmark,
  Check,
  Trash2,
  BookOpen,
  Plus,
  Loader2,
  ExternalLink,
  Languages
} from 'lucide-react';

interface CollocationItem {
  id: string;
  phrase: string;
  ipa: string;
  meaning: string;
  topic: string;
  band: string;
  sampleSentence: string;
  explanation: string;
}

const COLLOCATIONS_DATA: CollocationItem[] = [
  {
    id: 'col-1',
    phrase: 'pivotal role',
    ipa: '/ˈpɪv.ə.təl rəʊl/',
    meaning: 'Vai trò then chốt / cực kỳ quan trọng',
    topic: 'Career & Work',
    band: 'Band 8.0+ / TOEIC 190+',
    sampleSentence: 'Dr. Minh played a pivotal role in shaping my career path in artificial intelligence.',
    explanation: 'Thay thế cho cụm thông thường "very important role" để tăng điểm Lexical Resource.'
  },
  {
    id: 'col-2',
    phrase: 'paramount importance',
    ipa: '/ˈpær.ə.maʊnt ɪmˈpɔː.təns/',
    meaning: 'Tầm quan trọng tối thượng',
    topic: 'Society & Education',
    band: 'Band 8.5+ / TOEIC 200',
    sampleSentence: 'Maintaining environmental protection is of paramount importance for future generations.',
    explanation: 'Cấu trúc "be of paramount importance" cực kỳ sang trọng trong bài phát biểu Part 3.'
  },
  {
    id: 'col-3',
    phrase: 'cutting-edge technology',
    ipa: '/ˈkʌt.ɪŋ.edʒ tekˈnɒl.ə.dʒi/',
    meaning: 'Công nghệ tiên tiến / đi đầu',
    topic: 'Technology & AI',
    band: 'Band 7.5+ / TOEIC 180+',
    sampleSentence: 'Our company specializes in developing cutting-edge machine learning solutions.',
    explanation: 'Từ vựng Collocation tự nhiên cho các câu hỏi về công nghệ và AI.'
  },
  {
    id: 'col-4',
    phrase: 'indispensable asset',
    ipa: '/ˌɪn.dɪˈspen.sə.bəl ˈæt.set/',
    meaning: 'Tài sản / yếu tố không thể thiếu',
    topic: 'Business & Career',
    band: 'Band 8.0+ / TOEIC 190+',
    sampleSentence: 'Effective communication skills are an indispensable asset for any project manager.',
    explanation: 'Dùng "indispensable asset" thay vì "useful skill" để ấn tượng giám khảo.'
  },
  {
    id: 'col-5',
    phrase: 'sustainable development',
    ipa: '/səˈsteɪ.nə.bəl dɪˈvel.əp.mənt/',
    meaning: 'Phát triển bền vững',
    topic: 'Environment & Economy',
    band: 'Band 7.5+ / TOEIC 170+',
    sampleSentence: 'Governments must balance economic growth with sustainable development goals.',
    explanation: 'Collocation học thuật chuẩn cho các chủ đề môi trường và kinh tế.'
  },
  {
    id: 'col-6',
    phrase: 'foster creative thinking',
    ipa: '/ˈfɒs.tər kriˈeɪ.tɪv ˈθɪŋ.kɪŋ/',
    meaning: 'Nuôi dưỡng / thúc đẩy tư duy sáng tạo',
    topic: 'Education & Growth',
    band: 'Band 8.0+ / TOEIC 185+',
    sampleSentence: 'Interactive workshops foster creative thinking among young researchers.',
    explanation: 'Động từ "foster" dùng tự nhiên hơn "encourage" hoặc "make".'
  }
];

export const VocabNotebook: React.FC = () => {
  const { user } = useAuth();
  const userId = user?.id || 'guest';

  const [activeTab, setActiveTab] = useState<'dictionary' | 'saved' | 'collocations'>('dictionary');

  // Dictionary Search State
  const [dictionarySearchInput, setDictionarySearchInput] = useState('modern');
  const [searching, setSearching] = useState(false);
  const [dictionaryResult, setDictionaryResult] = useState<DictionaryEntry | null>(null);

  // Saved Words State (Per User)
  const [savedWords, setSavedWords] = useState<SavedWord[]>([]);
  const [savedSearchQuery, setSavedSearchQuery] = useState('');

  // Collocations State
  const [selectedTopic, setSelectedTopic] = useState<string>('ALL');
  const [collocationQuery, setCollocationQuery] = useState('');

  // Load initial demo search "modern" on mount
  useEffect(() => {
    async function loadDemo() {
      setSearching(true);
      const res = await fetchWordDefinition('modern');
      setDictionaryResult(res);
      setSearching(false);
    }
    loadDemo();
  }, []);

  // Load Saved Words for Current User
  useEffect(() => {
    const key = `speaking_app_saved_words_${userId}`;
    const raw = localStorage.getItem(key);
    if (raw) {
      try {
        setSavedWords(JSON.parse(raw));
      } catch (e) {
        setSavedWords([]);
      }
    } else {
      setSavedWords([]);
    }
  }, [userId]);

  // Persist Saved Words
  const saveSavedWordsToStorage = (words: SavedWord[]) => {
    setSavedWords(words);
    const key = `speaking_app_saved_words_${userId}`;
    localStorage.setItem(key, JSON.stringify(words));
  };

  // Perform Dictionary API Search
  const handleDictionarySearch = async (e?: React.FormEvent, wordToSearch?: string) => {
    if (e) e.preventDefault();
    const query = wordToSearch || dictionarySearchInput;
    if (!query.trim()) return;

    setSearching(true);
    const result = await fetchWordDefinition(query);
    setSearching(false);
    setDictionaryResult(result);
  };

  // Play audio (from API sound file or Web Speech Synthesis)
  const handlePlaySound = (word: string, audioUrl?: string) => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play().catch(() => speakText(word, 1.0));
    } else {
      speakText(word, 1.0);
    }
  };

  // Check if word is already saved in user's notebook
  const isWordSaved = (word: string) => {
    return savedWords.some((w) => w.word.toLowerCase() === word.toLowerCase());
  };

  // Toggle Save Word
  const handleToggleSaveWord = (entry: DictionaryEntry) => {
    if (isWordSaved(entry.word)) {
      const filtered = savedWords.filter((w) => w.word.toLowerCase() !== entry.word.toLowerCase());
      saveSavedWordsToStorage(filtered);
    } else {
      const firstMeaning = entry.meanings[0];
      const firstDef = firstMeaning?.definitions[0];

      const newSaved: SavedWord = {
        id: 'saved-' + Date.now(),
        userId,
        word: entry.word,
        phonetic: entry.phonetic,
        partOfSpeech: firstMeaning?.partOfSpeech,
        definition: entry.vietnameseMeaning || firstDef?.definition,
        example: firstDef?.example,
        audioUrl: entry.audioUrl,
        savedAt: new Date().toLocaleDateString('vi-VN')
      };
      saveSavedWordsToStorage([newSaved, ...savedWords]);
    }
  };

  // Remove saved word
  const handleRemoveSavedWord = (id: string) => {
    const filtered = savedWords.filter((w) => w.id !== id);
    saveSavedWordsToStorage(filtered);
  };

  // Filtered saved words
  const filteredSavedWords = savedWords.filter((w) =>
    w.word.toLowerCase().includes(savedSearchQuery.toLowerCase()) ||
    (w.definition || '').toLowerCase().includes(savedSearchQuery.toLowerCase())
  );

  // Filtered collocations
  const filteredCollocations = COLLOCATIONS_DATA.filter((item) => {
    const matchesTopic = selectedTopic === 'ALL' || item.topic === selectedTopic;
    const matchesSearch = item.phrase.toLowerCase().includes(collocationQuery.toLowerCase()) ||
                          item.meaning.toLowerCase().includes(collocationQuery.toLowerCase());
    return matchesTopic && matchesSearch;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="px-3 py-1 text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full inline-flex items-center gap-1.5 mb-3">
            <Bookmark className="w-3.5 h-3.5" /> Sổ Tay Từ Vựng Thông Minh & Dictionary API
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Tra Từ Điển Phiên Âm IPA & Nghĩa Tiếng Việt</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
            Tra cứu từ điển tiếng Anh trực tuyến với **Phiên Âm IPA Chuẩn**, **Phát Âm Âm Thanh Bản Xứ** và **Nghĩa Tiếng Việt**. Lưu trữ sổ tay riêng biệt cho tài khoản <strong>{user?.name || 'Học viên'}</strong>.
          </p>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-slate-800 gap-1">
        <button
          onClick={() => setActiveTab('dictionary')}
          className={`flex-1 py-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
            activeTab === 'dictionary'
              ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Search className="w-4 h-4" /> Tra Cứu Từ Điển IPA & Nghĩa Tiếng Việt
        </button>

        <button
          onClick={() => setActiveTab('saved')}
          className={`flex-1 py-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 relative ${
            activeTab === 'saved'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Bookmark className="w-4 h-4" /> Sổ Tay Cá Nhân Của Tôi
          {savedWords.length > 0 && (
            <span className="ml-1 px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-mono text-[10px] font-black">
              {savedWords.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('collocations')}
          className={`flex-1 py-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
            activeTab === 'collocations'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Collocations Band 8.0+
        </button>
      </div>

      {/* TAB 1: DICTIONARY LOOKUP */}
      {activeTab === 'dictionary' && (
        <div className="space-y-6">
          {/* Search Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Search className="w-4 h-4 text-cyan-400" /> Tra Cứu Từ Vựng Tiếng Anh Bản Xứ
            </h3>
            <form onSubmit={(e) => handleDictionarySearch(e)} className="flex gap-2">
              <input
                type="text"
                placeholder="Nhập từ tiếng Anh cần tra... (VD: modern, resilience, infrastructure, collaborative)"
                value={dictionarySearchInput}
                onChange={(e) => setDictionarySearchInput(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
              />
              <button
                type="submit"
                disabled={searching}
                className="px-8 py-3 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-bold rounded-2xl text-xs shadow-lg flex items-center gap-2 transition"
              >
                {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                Tra Từ Điển
              </button>
            </form>

            {/* Quick Word Chips */}
            <div className="flex items-center gap-2 pt-2 flex-wrap">
              <span className="text-xs text-slate-400 font-bold">Từ gợi ý tra nhanh:</span>
              {['modern', 'resilience', 'infrastructure', 'collaborative', 'indispensable', 'sustainability'].map((w) => (
                <button
                  key={w}
                  onClick={() => {
                    setDictionarySearchInput(w);
                    handleDictionarySearch(undefined, w);
                  }}
                  className="px-3 py-1 rounded-xl bg-slate-950 hover:bg-slate-800 text-cyan-300 text-xs font-mono border border-slate-800 transition"
                >
                  {w}
                </button>
              ))}
            </div>
          </div>

          {/* Dictionary Entry Card Result */}
          {searching ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-4">
              <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
              <p className="text-sm font-bold text-white">Đang tải thông tin từ điển & phiên âm IPA...</p>
            </div>
          ) : dictionaryResult && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-fadeIn">
              {/* Header section */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-wide">
                      {dictionaryResult.word}
                    </h2>
                    {dictionaryResult.phonetic && (
                      <span className="px-3.5 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-xl text-base font-mono font-bold shadow">
                        IPA: {dictionaryResult.phonetic}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                    <ExternalLink className="w-3.5 h-3.5 text-cyan-400" /> Nguồn phát âm & phiên âm từ điển Anh-Anh chuẩn
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handlePlaySound(dictionaryResult.word, dictionaryResult.audioUrl)}
                    className="px-6 py-3.5 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-extrabold rounded-2xl text-xs shadow-lg shadow-cyan-600/30 flex items-center gap-2 transition transform active:scale-95"
                  >
                    <Volume2 className="w-4 h-4" /> Nghe Phát Âm Mẫu Bản Xứ
                  </button>

                  <button
                    onClick={() => handleToggleSaveWord(dictionaryResult)}
                    className={`px-6 py-3.5 font-extrabold rounded-2xl text-xs shadow-lg flex items-center gap-2 transition ${
                      isWordSaved(dictionaryResult.word)
                        ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/20'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                    }`}
                  >
                    {isWordSaved(dictionaryResult.word) ? (
                      <>
                        <Check className="w-4 h-4" /> Đã Lưu Vào Sổ Tay
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" /> ⭐ Lưu Vào Sổ Tay
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Prominent Vietnamese Meaning Callout */}
              {dictionaryResult.vietnameseMeaning && (
                <div className="bg-gradient-to-r from-cyan-950/70 via-slate-950 to-indigo-950/70 p-5 rounded-2xl border border-cyan-500/40 shadow-inner space-y-1">
                  <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                    <Languages className="w-4 h-4" /> NGHĨA TIẾNG VIỆT
                  </div>
                  <div className="text-xl font-extrabold text-white font-mono">
                    {dictionaryResult.vietnameseMeaning}
                  </div>
                </div>
              )}

              {/* Meanings & Definitions */}
              <div className="space-y-6">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  ĐỊNH NGHĨA CHI TIẾT & VÍ DỤ MINH HỌA
                </h4>
                {dictionaryResult.meanings.map((meaning, idx) => (
                  <div key={idx} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                    <div className="inline-block px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-bold uppercase tracking-wider font-mono">
                      Từ loại: {meaning.partOfSpeech}
                    </div>

                    <div className="space-y-3 pl-2 border-l-2 border-cyan-500/40">
                      {meaning.definitions.map((def, dIdx) => (
                        <div key={dIdx} className="space-y-1.5">
                          <p className="text-sm text-slate-200 leading-relaxed font-sans">
                            <strong className="text-cyan-400 font-mono">{dIdx + 1}.</strong> {def.definition}
                          </p>

                          {def.example && (
                            <p className="text-xs text-slate-300 italic bg-slate-900 p-3 rounded-xl border border-slate-800 font-mono">
                              Ví dụ: "{def.example}"
                            </p>
                          )}

                          {def.synonyms && def.synonyms.length > 0 && (
                            <div className="flex items-center gap-1.5 text-xs pt-1 flex-wrap">
                              <span className="text-slate-500 font-bold">Từ đồng nghĩa:</span>
                              {def.synonyms.map((syn, sIdx) => (
                                <span key={sIdx} className="px-2 py-0.5 bg-slate-900 text-cyan-300 rounded-lg text-[11px] font-mono border border-slate-800">
                                  {syn}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SAVED WORDS PER USER */}
      {activeTab === 'saved' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-indigo-400" /> Danh Sách Từ Vựng Đã Lưu (Học viên: {user?.name || 'Guest'})
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Tổng số từ đã lưu trong sổ tay: <strong className="text-cyan-400 font-mono">{savedWords.length}</strong> từ vựng.
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Lọc từ vựng đã lưu..."
                value={savedSearchQuery}
                onChange={(e) => setSavedSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {savedWords.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-4">
              <BookOpen className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-slate-300">Sổ tay từ vựng của bạn đang trống!</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Hãy chuyển sang tab <strong>"Tra Cứu Từ Điển IPA & Nghĩa Tiếng Việt"</strong> và bấm nút <strong>"⭐ Lưu Vào Sổ Tay"</strong> để lưu các từ hay vào đây nhé.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredSavedWords.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl p-6 shadow-xl space-y-3 flex flex-col justify-between transition group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      {item.partOfSpeech && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wider font-mono">
                          {item.partOfSpeech}
                        </span>
                      )}
                      <span className="text-[10px] text-slate-500 font-mono">
                        Lưu ngày: {item.savedAt}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-xl font-extrabold text-white group-hover:text-cyan-300 font-mono transition">
                        {item.word}
                      </h3>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handlePlaySound(item.word, item.audioUrl)}
                          className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded-xl transition"
                          title="Nghe phát âm"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleRemoveSavedWord(item.id)}
                          className="p-2 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition"
                          title="Xóa khỏi sổ tay"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {item.phonetic && (
                      <div className="text-xs font-mono text-emerald-400 my-1 font-bold">IPA: {item.phonetic}</div>
                    )}

                    {item.definition && (
                      <div className="text-xs text-slate-200 mt-2 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800">
                        <strong className="text-cyan-400 font-mono">Nghĩa:</strong> {item.definition}
                      </div>
                    )}

                    {item.example && (
                      <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800/80 text-xs text-slate-400 italic font-mono mt-2">
                        Ví dụ: "{item.example}"
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: COLLOCATIONS BAND 8.0+ */}
      {activeTab === 'collocations' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="flex flex-wrap bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
              {['ALL', 'Career & Work', 'Technology & AI', 'Education & Growth', 'Environment & Economy'].map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTopic(t)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                    selectedTopic === t ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t === 'ALL' ? 'Tất Cả Chủ Đề' : t}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Tìm kiếm cụm từ..."
                value={collocationQuery}
                onChange={(e) => setCollocationQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCollocations.map((item) => (
              <div
                key={item.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl p-6 shadow-xl space-y-3 flex flex-col justify-between transition group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      {item.topic}
                    </span>
                    <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                      {item.band}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-xl font-black text-white group-hover:text-cyan-300 font-mono transition">
                      {item.phrase}
                    </h3>
                    <button
                      onClick={() => handlePlaySound(item.phrase)}
                      className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded-xl transition"
                      title="Nghe phát âm cụm từ"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-xs font-mono text-emerald-400 my-1 font-bold">IPA: {item.ipa}</div>
                  <div className="text-xs font-bold text-slate-200">Nghĩa: {item.meaning}</div>

                  <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800/80 text-xs text-slate-300 italic font-mono mt-3">
                    "{item.sampleSentence}"
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/60 text-[11px] text-slate-400">
                  💡 {item.explanation}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
