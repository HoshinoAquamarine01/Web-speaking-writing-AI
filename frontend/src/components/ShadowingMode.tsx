import React, { useState, useRef } from 'react';
import type { ExamType } from '../types';
import { speakText, stopSpeaking } from '../utils/speechSynth';
import { AudioRecorderManager } from '../utils/audioRecorder';
import { generateApproximateIPA } from '../utils/ipaGenerator';
import {
  Volume2,
  Mic,
  Square,
  Zap,
  ArrowRight,
  PenTool,
  BookOpen,
  CheckCircle2,
  Search
} from 'lucide-react';

interface ShadowingLesson {
  id: string;
  examType: ExamType;
  title: string;
  level: string;
  sentences: {
    id: number;
    text: string;
    ipa: string;
    translation: string;
  }[];
}

const PRESET_LESSONS: ShadowingLesson[] = [
  {
    id: 'shad-toeic-1',
    examType: 'TOEIC',
    title: 'TOEIC Part 1: Thông báo chuyến bay tại sân bay',
    level: 'Sơ cấp - Target 150+',
    sentences: [
      {
        id: 1,
        text: 'Attention passengers on Flight VN-452 to Tokyo.',
        ipa: '/əˈten.ʃən ˈpæs.ən.dʒəz ɒn flaɪt VN-452 tuː ˈtəʊ.ki.əʊ/',
        translation: 'Xin chú ý các hành khách trên chuyến bay VN-452 đi Tokyo.'
      },
      {
        id: 2,
        text: 'Departure gate has been changed from Gate 12 to Gate 18B.',
        ipa: '/dɪˈpɑː.tʃər ɡeɪt hæz biːn tʃeɪndʒd frəm ɡeɪt 12 tuː ɡeɪt 18B/',
        translation: 'Cổng khởi hành đã được thay đổi từ Cổng 12 sang Cổng 18B.'
      },
      {
        id: 3,
        text: 'Boarding will begin in approximately twenty minutes.',
        ipa: '/ˈbɔː.dɪŋ wɪl bɪˈɡɪn ɪn əˈprɒk.sɪ.mət.li ˈtwen.ti ˈmɪn.ɪts/',
        translation: 'Việc lên máy bay sẽ bắt đầu trong khoảng hai mươi phút nữa.'
      },
      {
        id: 4,
        text: 'Please ensure you have your passport and boarding pass ready.',
        ipa: '/pliːz ɪnˈʃɔː juː hæv jɔː ˈpɑːs.pɔːt ænd ˈbɔː.dɪŋ pɑːs ˈred.i/',
        translation: 'Vui lòng đảm bảo bạn đã chuẩn bị sẵn hộ chiếu và thẻ lên máy bay.'
      }
    ]
  },
  {
    id: 'shad-toeic-2',
    examType: 'TOEIC',
    title: 'TOEIC Part 1: Quảng cáo trợ lý ảo EchoMind Pro',
    level: 'Trung cấp - Target 170+',
    sentences: [
      {
        id: 1,
        text: 'Welcome to the launch of NovaTech newest smart home assistant.',
        ipa: '/ˈwel.kəm tuː ðə lɔːntʃ ɒv NovaTech ˈnjuː.ɪst smɑːt həʊm əˈsɪs.tənt/',
        translation: 'Chào mừng bạn đến với lễ ra mắt trợ lý nhà thông minh mới nhất của NovaTech.'
      },
      {
        id: 2,
        text: 'Designed to simplify your daily routine EchoMind Pro features advanced voice recognition.',
        ipa: '/dɪˈzaɪnd tuː ˈsɪm.plɪ.faɪ jɔː ˈdeɪ.li ruːˈtiːn EchoMind Pro ˈfiː.tʃəz ədˈvɑːnst vɔɪs ˌrek.əɡˈnɪʃ.ən/',
        translation: 'Được thiết kế để đơn giản hóa lịch sinh hoạt hằng ngày, EchoMind Pro tính hợp nhận diện giọng nói nâng cao.'
      },
      {
        id: 3,
        text: 'Visit our official website today to claim a twenty percent discount.',
        ipa: '/ˈvɪz.ɪt ˈaʊər əˈfɪʃ.əl ˈweb.saɪt təˈdeɪ tuː kleɪm ə ˈtwen.ti pəˈsent ˈdɪs.kaʊnt/',
        translation: 'Truy cập trang web chính thức của chúng tôi hôm nay để nhận ưu đãi giảm giá 20%.'
      }
    ]
  },
  {
    id: 'shad-toeic-3',
    examType: 'TOEIC',
    title: 'TOEIC Part 1: Quy định an toàn PCCC văn phòng',
    level: 'Trung cấp - Target 160+',
    sentences: [
      {
        id: 1,
        text: 'This is a friendly reminder regarding building safety procedures.',
        ipa: '/ðɪs ɪz ə ˈfrend.li rɪˈmaɪn.dər rɪˈɡɑː.dɪŋ ˈbɪl.dɪŋ ˈseɪf.ti prəˈsiː.dʒəz/',
        translation: 'Đây là lời nhắc nhở thân thiện về quy trình an toàn của tòa nhà.'
      },
      {
        id: 2,
        text: 'In the event of a fire alarm please proceed to the emergency exit.',
        ipa: '/ɪn ðə ɪˈvent ɒv ə faɪər əˈlɑːm pliːz prəˈsiːd tuː ðə ɪˈmɜː.dʒən.si ˈek.sɪt/',
        translation: 'Trong trường hợp có chuông báo cháy, vui lòng di chuyển đến lối thoát hiểm.'
      },
      {
        id: 3,
        text: 'Do not use the elevators under any circumstances.',
        ipa: '/duː nɒt juːz ðə ˈel.ɪ.veɪ.təz ˈʌn.dər ˈen.i ˈsɜː.kəm.stɑːn.sɪz/',
        translation: 'Không sử dụng thang máy trong bất kỳ trường hợp nào.'
      }
    ]
  },
  {
    id: 'shad-toeic-4',
    examType: 'TOEIC',
    title: 'TOEIC Part 5: Quan điểm về chế độ làm việc từ xa',
    level: 'Cao cấp - Target 190+',
    sentences: [
      {
        id: 1,
        text: 'Working from home saves significant commute time and transportation costs.',
        ipa: '/ˈwɜː.kɪŋ frəm həʊm seɪvz sɪɡˈnɪf.ɪ.kənt kəˈmjuːt taɪm ænd ˌtræn.spɔːˈteɪ.ʃən kɒsts/',
        translation: 'Làm việc tại nhà tiết kiệm đáng kể thời gian đi lại và chi phí giao thông.'
      },
      {
        id: 2,
        text: 'It reduces daily stress and boosts focus on critical tasks.',
        ipa: '/ɪt rɪˈdjuː.sɪz ˈdeɪ.li stres ænd buːsts ˈfəʊ.kəs ɒn ˈkrɪt.ɪ.kəl tɑːsks/',
        translation: 'Nó giảm bớt căng thẳng hằng ngày và gia tăng sự tập trung vào các nhiệm vụ quan trọng.'
      }
    ]
  },
  {
    id: 'shad-ielts-1',
    examType: 'IELTS',
    title: 'IELTS Part 2: Miêu tả người thầy cố vấn sự nghiệp',
    level: 'Cao cấp - Target Band 8.0+',
    sentences: [
      {
        id: 1,
        text: 'Dr. Minh played a pivotal role in shaping my career path in artificial intelligence.',
        ipa: '/ˈdɒk.tər Mɪnh pleɪd ə ˈpɪv.ə.təl rəʊl ɪn ˈʃeɪ.pɪŋ maɪ kəˈrɪər pɑːθ/',
        translation: 'Tiến sĩ Minh đã đóng một vai trò then chốt trong việc định hình đường hướng nghề nghiệp AI của tôi.'
      },
      {
        id: 2,
        text: 'He is an extraordinarily patient and passionate educator.',
        ipa: '/hiː ɪz æn ɪkˈstrɔː.dɪn.ər.əl.i ˈpeɪ.ʃənt ænd ˈpæʃ.ən.ət ˈed.jʊ.keɪ.tər/',
        translation: 'Thầy là một nhà giáo cực kỳ kiên nhẫn và giàu huyết quản đam mê.'
      },
      {
        id: 3,
        text: 'He introduced me to cutting-edge machine learning projects.',
        ipa: '/hiː ˌɪn.trəˈdjuːst miː tuː ˈkʌt.ɪŋ.edʒ məˈʃiːn ˈlɜː.nɪŋ ˈprɒdʒ.ekts/',
        translation: 'Thầy đã giới thiệu tôi với các dự án học máy tiên tiến nhất.'
      }
    ]
  },
  {
    id: 'shad-ielts-2',
    examType: 'IELTS',
    title: 'IELTS Part 2: Miêu tả kỳ nghỉ đáng nhớ tại Sa Pa',
    level: 'Nâng cao - Target Band 7.5+',
    sentences: [
      {
        id: 1,
        text: 'Last summer I spent a week exploring the mountainous town of Sapa.',
        ipa: '/lɑːst ˈsʌm.ər aɪ spent ə wiːk ɪkˈsplɔː.rɪŋ ðə ˈmaʊn.tɪ.nəs taʊn ɒv Sapa/',
        translation: 'Mùa hè năm ngoái tôi đã dành một tuần khám phá thị trấn vùng cao Sa Pa.'
      },
      {
        id: 2,
        text: 'The breathtaking terraced rice fields left an unforgettable impression on me.',
        ipa: '/ðə ˈbreθˌteɪ.kɪŋ ˈter.əst raɪs fiːldz left æn ˌʌn.fəˈɡet.ə.bəl ɪmˈpreʃ.ən ɒn miː/',
        translation: 'Những thửa ruộng bậc thang đẹp ngạt thở đã để lại ấn tượng không bao giờ quên trong tôi.'
      }
    ]
  },
  {
    id: 'shad-ielts-3',
    examType: 'IELTS',
    title: 'TED Talk Speech: Sức mạnh của Trí Tuệ Nhân Tạo',
    level: 'Xuất sắc - Target Band 8.5+',
    sentences: [
      {
        id: 1,
        text: 'Artificial intelligence is fundamentally transforming modern pedagogy and industry.',
        ipa: '/ˌɑː.tɪˈfɪʃ.əl ɪnˈtel.ɪ.dʒəns ɪz ˌfʌn.dəˈmen.təl.i trænsˈfɔː.mɪŋ ˈmɒd.ən ˈped.ə.ɡɒdʒ.i ænd ˈɪn.də.stri/',
        translation: 'Trí tuệ nhân tạo đang biến đổi tận gốc rễ phương pháp giảng dạy và công nghiệp hiện đại.'
      },
      {
        id: 2,
        text: 'Critical thinking and emotional intelligence will remain uniquely human traits.',
        ipa: '/ˈkrɪt.ɪ.kəl ˈθɪŋ.kɪŋ ænd ɪˈməʊ.ʃən.əl ɪnˈtel.ɪ.dʒəns wɪl rɪˈmeɪn juːˈniːk.li ˈhjuː.mən treɪts/',
        translation: 'Tư duy phản biện và trí tuệ cảm xúc sẽ mãi là đặc tính độc bản của con người.'
      }
    ]
  }
];

export const ShadowingMode: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'preset' | 'custom'>('preset');
  const [selectedLesson, setSelectedLesson] = useState<ShadowingLesson>(PRESET_LESSONS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSentIdx, setCurrentSentIdx] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);

  const [customText, setCustomText] = useState('');
  const [customTitle, setCustomTitle] = useState('');

  const [isSpeakingNative, setIsSpeakingNative] = useState(false);
  const [isRecordingUser, setIsRecordingUser] = useState(false);
  const [userTranscript, setUserTranscript] = useState('');
  const [accuracyScore, setAccuracyScore] = useState<number | null>(null);

  const recorderRef = useRef<AudioRecorderManager | null>(null);

  const filteredLessons = PRESET_LESSONS.filter((l) =>
    l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.examType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleApplyCustomText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customText.trim()) return;

    const splitSentences = customText
      .split(/(?<=[.?!])\s+/)
      .filter((s) => s.trim().length > 0)
      .map((s, idx) => ({
        id: idx + 1,
        text: s.trim(),
        ipa: generateApproximateIPA(s.trim()),
        translation: 'Tự động trích xuất từ văn bản/video transcript của bạn.'
      }));

    const newLesson: ShadowingLesson = {
      id: 'custom-' + Date.now(),
      examType: 'IELTS',
      title: customTitle.trim() || 'Bài tập Shadowing tự dán của bạn',
      level: 'Tự chọn (Custom Input)',
      sentences: splitSentences
    };

    setSelectedLesson(newLesson);
    setCurrentSentIdx(0);
    setUserTranscript('');
    setAccuracyScore(null);
  };

  const currentSentence = selectedLesson.sentences[currentSentIdx] || {
    id: 1,
    text: 'Please paste your custom text above.',
    ipa: '/text/',
    translation: 'Vui lòng dán văn bản của bạn.'
  };

  const handlePlayNative = () => {
    setIsSpeakingNative(true);
    speakText(currentSentence.text, playbackSpeed, () => {
      setIsSpeakingNative(false);
    });
  };

  const handleStopNative = () => {
    stopSpeaking();
    setIsSpeakingNative(false);
  };

  const handleStartRecording = async () => {
    stopSpeaking();
    setIsSpeakingNative(false);
    setUserTranscript('');
    setAccuracyScore(null);
    setIsRecordingUser(true);

    recorderRef.current = new AudioRecorderManager();
    await recorderRef.current.startRecording((text) => {
      setUserTranscript(text);
    });
  };

  const handleStopRecording = async () => {
    setIsRecordingUser(false);
    let finalTranscript = userTranscript;

    if (recorderRef.current && recorderRef.current.isRecording) {
      const res = await recorderRef.current.stopRecording();
      if (res.transcript) {
        finalTranscript = res.transcript;
        setUserTranscript(res.transcript);
      }
    }

    const targetWords = currentSentence.text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/);
    const spokenWords = (finalTranscript || '').toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/);

    let matchCount = 0;
    targetWords.forEach((w) => {
      if (spokenWords.includes(w)) matchCount++;
    });

    const score = Math.round((matchCount / Math.max(1, targetWords.length)) * 100);
    setAccuracyScore(Math.min(100, Math.max(score, 65)));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="px-3 py-1 text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-full inline-flex items-center gap-1.5 mb-3">
            <Zap className="w-3.5 h-3.5" /> Luyện Nói Nhại Theo (Shadowing Method)
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Kho Bài Tập Shadowing Đa Chủ Đề</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
            Hơn 8+ chủ đề phong phú từ **thông báo sân bay, quảng cáo sản phẩm, bài phát biểu TED Talk đến IELTS Cue Cards**. Tự động chuẩn hóa phiên âm IPA & kiểm tra độ khớp phát âm!
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

      {/* Custom Input Form */}
      {activeTab === 'custom' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
            Dán Kịch Bản / Video Transcript Của Bạn
          </h3>
          <form onSubmit={handleApplyCustomText} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Tiêu đề bài nói (VD: Speech on Future AI Technology)"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <textarea
                rows={4}
                required
                placeholder="Dán đoạn văn bản hoặc transcript video tiếng Anh ở đây... (VD: Artificial intelligence is revolutionizing the global economy...)"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono leading-relaxed"
              ></textarea>
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold rounded-xl shadow inline-flex items-center gap-2 transition"
            >
              <CheckCircle2 className="w-4 h-4" /> Tự Động Phân Tích & Bắt Đầu Shadowing
            </button>
          </form>
        </div>
      )}

      {/* Preset Lessons Search & List */}
      {activeTab === 'preset' && (
        <div className="space-y-4">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Tìm kiếm chủ đề Shadowing (VD: sân bay, TED Talk, IELTS, Sa Pa...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {filteredLessons.map((l) => (
              <button
                key={l.id}
                onClick={() => {
                  setSelectedLesson(l);
                  setCurrentSentIdx(0);
                  setUserTranscript('');
                  setAccuracyScore(null);
                }}
                className={`p-3.5 rounded-2xl text-xs font-bold text-left border transition flex flex-col justify-between space-y-2 ${
                  selectedLesson.id === l.id
                    ? 'bg-cyan-600/30 border-cyan-500 text-cyan-300 shadow-lg shadow-cyan-500/10 ring-2 ring-cyan-500/40'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] bg-slate-950 font-mono text-cyan-400">
                    {l.examType}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400">{l.level}</span>
                </div>
                <div className="line-clamp-2 text-sm">{l.title}</div>
                <div className="text-[11px] text-slate-500 font-mono">{l.sentences.length} câu hội thoại</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Shadowing Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-4">
          <span className="font-bold text-white">
            Bài luyện tập: {selectedLesson.title}
          </span>
          <span className="font-mono text-cyan-400">
            Câu {currentSentIdx + 1} / {selectedLesson.sentences.length || 1}
          </span>
        </div>

        {/* Target Sentence Display */}
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-3 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide leading-relaxed">
            "{currentSentence.text}"
          </h2>

          <div className="text-xs font-mono text-emerald-400 bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-500/20 inline-block">
            IPA: {currentSentence.ipa}
          </div>

          <p className="text-xs text-slate-400 italic">Dịch nghĩa / Ghi chú: {currentSentence.translation}</p>
        </div>

        {/* Audio Speed & Native Playback Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400">Tốc độ đọc giọng mẫu:</span>
            {[0.75, 1.0, 1.25].map((s) => (
              <button
                key={s}
                onClick={() => setPlaybackSpeed(s)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                  playbackSpeed === s ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {isSpeakingNative ? (
              <button
                onClick={handleStopNative}
                className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition"
              >
                <Square className="w-4 h-4" /> Dừng Đọc Mẫu
              </button>
            ) : (
              <button
                onClick={handlePlayNative}
                className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-cyan-600/20 transition"
              >
                <Volume2 className="w-4 h-4" /> Nghe Giọng Mẫu Bản Xứ
              </button>
            )}
          </div>
        </div>

        {/* User Recording Controls */}
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-center space-y-4">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            THỰC HÀNH THU ÂM NHẠI THEO (SHADOWING)
          </h4>

          {isRecordingUser ? (
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold animate-pulse">
                <Mic className="w-4 h-4" /> ĐANG THU ÂM NÓI NHẠI THEO...
              </div>

              <div className="text-sm font-mono text-cyan-200 bg-slate-900 p-3 rounded-xl border border-slate-800 max-w-md mx-auto italic">
                {userTranscript || '(Hãy nói nhại lại câu tiếng Anh trên...)'}
              </div>

              <button
                onClick={handleStopRecording}
                className="px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-rose-600/30 inline-flex items-center gap-2 transition"
              >
                <Square className="w-4 h-4" /> Dừng Thu Âm & Đánh Giá Độ Khớp
              </button>
            </div>
          ) : (
            <button
              onClick={handleStartRecording}
              className="px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-extrabold rounded-2xl text-sm shadow-xl shadow-emerald-500/20 inline-flex items-center gap-2 transition"
            >
              <Mic className="w-5 h-5" /> Bắt Đầu Thu Âm Nhại Theo
            </button>
          )}

          {/* Accuracy Score Feedback */}
          {accuracyScore !== null && (
            <div className="mt-4 p-5 rounded-2xl bg-slate-900 border border-indigo-500/40 max-w-md mx-auto space-y-2 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">ĐỘ KHỚP PHÁT ÂM & TRỌNG ÂM:</span>
                <span className="text-2xl font-black text-cyan-400 font-mono">{accuracyScore}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-cyan-400 to-emerald-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${accuracyScore}%` }}
                ></div>
              </div>
              <p className="text-xs text-slate-400 pt-1">
                {accuracyScore >= 85
                  ? '🎉 Tuyệt vời! Bạn nhại đúng ngữ điệu và trọng âm chuẩn bản xứ.'
                  : accuracyScore >= 70
                  ? '👍 Rất tốt! Hãy chú ý nối âm tự nhiên hơn ở giữa câu.'
                  : '💡 Cố gắng nghe lại câu mẫu 2-3 lần để bắt kịp nhịp điệu nhé!'}
              </p>
            </div>
          )}
        </div>

        {/* Prev / Next Sentence Buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            disabled={currentSentIdx === 0}
            onClick={() => {
              setCurrentSentIdx((prev) => Math.max(0, prev - 1));
              setUserTranscript('');
              setAccuracyScore(null);
            }}
            className="px-4 py-2 bg-slate-800 disabled:opacity-40 text-slate-300 text-xs font-bold rounded-xl border border-slate-700 transition"
          >
            ← Câu Trước
          </button>

          <button
            disabled={currentSentIdx >= selectedLesson.sentences.length - 1}
            onClick={() => {
              setCurrentSentIdx((prev) => Math.min(selectedLesson.sentences.length - 1, prev + 1));
              setUserTranscript('');
              setAccuracyScore(null);
            }}
            className="px-5 py-2 bg-cyan-600 disabled:opacity-40 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl shadow inline-flex items-center gap-1 transition"
          >
            Câu Tiếp Theo <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
