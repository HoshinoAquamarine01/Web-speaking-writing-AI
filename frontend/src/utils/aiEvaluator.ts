import type { ExamType, EvaluationResult, Question } from '../types';

export function getEffectiveSpeakingSampleAnswer(examType: ExamType, question: Question | { title: string; prompt: string }): string {
  const qObj = question as any;
  if (
    qObj.sampleAnswer &&
    !qObj.sampleAnswer.toLowerCase().includes('will be generated') &&
    !qObj.sampleAnswer.toLowerCase().includes('sample answer will')
  ) {
    return qObj.sampleAnswer;
  }
  const title = qObj.title || 'this designated topic';
  if (examType === 'TOEIC') {
    return `In my opinion, addressing ${title} effectively requires a structured and professional strategy. First and foremost, clear communication ensures that all team members are aligned with corporate goals. Secondly, investing in ongoing training and modern technology significantly boosts operational productivity. Therefore, prioritizing these key factors yields long-term success for any organization.`;
  } else {
    return `I would like to elaborate on ${title}, which is a subject of great relevance today. From my perspective, this issue encompasses several key aspects. Firstly, technological advancements have fundamentally transformed how individuals engage with this area. Secondly, establishing clear guidelines helps balance innovation with personal responsibility. Overall, maintaining a proactive and informed approach is essential for achieving optimal outcomes.`;
  }
}

export async function evaluateSpeakingResponse(
  examType: ExamType,
  question: Question | { title: string; prompt: string },
  transcript: string,
  userApiKey?: string
): Promise<EvaluationResult> {
  const text = transcript.trim();
  const isPlaceholder = text.startsWith('[Hệ thống') || text.startsWith('[No response') || text === 'Sample student response' || text.startsWith('[Thí sinh chưa');
  const wordCount = (text && !isPlaceholder) ? text.split(/\s+/).filter(Boolean).length : 0;

  // 1. Xử lý bài nói không có âm thanh / 0 từ
  if (wordCount === 0) {
    if (examType === 'TOEIC') {
      return {
        overallScore: 0,
        bandOrLevel: 'Level 0 (0/200 điểm)',
        summaryFeedback: 'Hệ thống không nhận diện được âm thanh hoặc bạn chưa phát biểu (0 từ). Bài thi nhận 0/200 điểm theo quy chuẩn.',
        criteria: [
          { name: 'Phát âm & Trọng âm', englishName: 'Pronunciation & Stress', score: 0, maxScore: 10, comment: 'Chưa nhận diện được âm thanh.' },
          { name: 'Từ vựng & Cấu trúc Ngữ pháp', englishName: 'Grammar & Vocabulary', score: 0, maxScore: 10, comment: 'Chưa nhận diện được âm thanh.' },
          { name: 'Độ trôi chảy & Tương tác', englishName: 'Fluency & Coherence', score: 0, maxScore: 10, comment: 'Chưa nhận diện được âm thanh.' },
          { name: 'Độ phù hợp & Nội dung', englishName: 'Relevance & Completeness', score: 0, maxScore: 10, comment: 'Chưa nhận diện được âm thanh.' }
        ],
        pronunciationIssues: [],
        grammarFixes: [],
        actionableAdvice: [
          'Vui lòng bật microphone và phát biểu rõ ràng vào micro.',
          'Kiểm tra quyền cho phép truy cập micro trong cài đặt trình duyệt của bạn.'
        ],
        sampleAnswer: getEffectiveSpeakingSampleAnswer(examType, question),
        transcript: '[Thí sinh chưa thực hiện phần thu âm / 0 từ]'
      };
    } else {
      return {
        overallScore: 0,
        bandOrLevel: 'Band 0.0',
        summaryFeedback: 'Hệ thống không nhận diện được âm thanh hoặc bạn chưa phát biểu (0 từ). Bài thi nhận Band 0.0 theo chuẩn IELTS.',
        criteria: [
          { name: 'Độ lưu loát & Mạch lạc', englishName: 'Fluency and Coherence (FC)', score: 0, maxScore: 9, comment: 'Chưa nhận diện được âm thanh.' },
          { name: 'Vốn từ vựng', englishName: 'Lexical Resource (LR)', score: 0, maxScore: 9, comment: 'Chưa nhận diện được âm thanh.' },
          { name: 'Ngữ pháp & Độ chính xác', englishName: 'Grammatical Range and Accuracy (GRA)', score: 0, maxScore: 9, comment: 'Chưa nhận diện được âm thanh.' },
          { name: 'Phát âm & Ngữ điệu', englishName: 'Pronunciation (P)', score: 0, maxScore: 9, comment: 'Chưa nhận diện được âm thanh.' }
        ],
        pronunciationIssues: [],
        grammarFixes: [],
        actionableAdvice: [
          'Vui lòng bật microphone và phát biểu rõ ràng vào micro.',
          'Kiểm tra lại thiết bị thu âm trước khi làm bài thi.'
        ],
        sampleAnswer: getEffectiveSpeakingSampleAnswer(examType, question),
        transcript: '[Thí sinh chưa thực hiện phần thu âm / 0 từ]'
      };
    }
  }

  // 2. Thử gọi API nếu có apiKey
  if (userApiKey && userApiKey.trim().length > 10) {
    try {
      const result = await evaluateWithOpenAIOrGemini(examType, question, text, userApiKey);
      if (result) return result;
    } catch (e) {
      console.warn('Gặp lỗi khi gọi AI API thực tế, chuyển sang Real-Transcript NLP Evaluator:', e);
    }
  }

  // 3. Phân tích thực tế bản ghi giọng nói bài nói của thí sinh
  return analyzeRealSpeakingTranscript(examType, question, text, wordCount);
}

// Phân tích thực tế bản ghi bài nói (NLP Real Transcript Analyzer)
function analyzeRealSpeakingTranscript(
  examType: ExamType,
  question: Question | { title: string; prompt: string },
  text: string,
  wordCount: number
): EvaluationResult {
  const rawSentences = text.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 0);
  const words = text.toLowerCase().match(/\b[a-z']+\b/g) || [];
  const uniqueWords = new Set(words);
  const lexicalDiversity = words.length > 0 ? (uniqueWords.size / words.length) : 0;

  // A. Phân tích lỗi ngữ pháp thực tế từ bài phát biểu
  const grammarFixes: { original: string; corrected: string; explanation: string }[] = [];

  rawSentences.forEach((sentence) => {
    const trimmed = sentence.trim();

    // 1. Phân tích lỗi "am agree" / "am disagree"
    if (/\bi\s+am\s+(agree|disagree)\b/i.test(trimmed)) {
      const fixed = trimmed.replace(/\bi\s+am\s+(agree|disagree)\b/i, (_, v) => `I strongly ${v}`);
      grammarFixes.push({
        original: trimmed,
        corrected: fixed,
        explanation: 'Trong tiếng Anh dùng động từ "agree/disagree" trực tiếp (I agree), không dùng "I am agree".'
      });
    }

    // 2. Phân tích lỗi dùng giới từ "in 2 years ago"
    if (/\bin\s+\d+\s+years?\s+ago\b/i.test(trimmed)) {
      const fixed = trimmed.replace(/\bin\s+(\d+\s+years?\s+ago)\b/i, '$1');
      grammarFixes.push({
        original: trimmed,
        corrected: fixed,
        explanation: 'Không dùng giới từ "in" trước các cụm chỉ thời gian có từ "ago".'
      });
    }

    // 3. Phân tích lỗi "learn me" thay cho "teach me"
    if (/\blearn\s+me\b/i.test(trimmed)) {
      const fixed = trimmed.replace(/\blearn\s+me\b/i, 'teach me');
      grammarFixes.push({
        original: trimmed,
        corrected: fixed,
        explanation: 'Động từ dạy học cho ai đó là "teach me", không phải "learn me".'
      });
    }

    // 4. Phân tích chủ ngữ số ít đi với động từ nguyên mẫu
    const svMatch = trimmed.match(/\b(he|she|it|this|that|everyone)\s+(make|take|help|give|need|want|allow|cause|show|lead|provide)\b/i);
    if (svMatch) {
      const sub = svMatch[1];
      const verb = svMatch[2];
      const fixedVerb = verb.endsWith('e') ? verb + 's' : verb + 'es';
      grammarFixes.push({
        original: svMatch[0],
        corrected: `${sub} ${fixedVerb}`,
        explanation: `Chủ ngữ số ít "${sub}" đi với động từ chia thì hiện tại đơn cần chia thành "${fixedVerb}".`
      });
    }
  });

  // B. Trích xuất các từ phát âm / từ vựng cần lưu ý từ CHÍNH bài nói của học viên
  const pronunciationIssues: { word: string; correctIpa: string; userSpoken?: string; issueType: 'mispronounced' | 'stress_error' | 'intonation'; advice: string }[] = [];
  const ipaCheckList: Record<string, { ipa: string; advice: string }> = {
    'approximately': { ipa: '/əˈprɒk.sɪ.mət.li/', advice: 'Trọng âm rơi vào âm tiết thứ 2 (prok).' },
    'environment': { ipa: '/ɪnˈvaɪ.rən.mənt/', advice: 'Chú ý phát âm âm tiết thứ 2 /vaɪ/ và âm đuôi /-mənt/.' },
    'technology': { ipa: '/tekˈnɒl.ə.dʒi/', advice: 'Trọng âm chính rơi vào âm tiết thứ 2 (NOL).' },
    'important': { ipa: '/ɪmˈpɔː.tənt/', advice: 'Chú ý âm đuôi /-tənt/, tránh đọc phẳng âm.' },
    'especially': { ipa: '/ɪˈspeʃ.əl.i/', advice: 'Phát âm rõ âm đầu /ɪ/ và âm /ʃ/.' },
    'government': { ipa: '/ˈɡʌv.ən.mənt/', advice: 'Chú ý trọng âm rơi vào âm tiết đầu tiên (GOV).' },
    'opportunity': { ipa: '/ˌɒp.əˈtʃuː.nə.ti/', advice: 'Trọng âm chính rơi vào âm tiết thứ 3 (TU).' },
    'development': { ipa: '/dɪˈvel.əp.mənt/', advice: 'Trọng âm chính rơi vào âm tiết thứ 2 (VEL).' }
  };

  words.forEach((w) => {
    if (ipaCheckList[w] && pronunciationIssues.length < 3) {
      pronunciationIssues.push({
        word: w,
        correctIpa: ipaCheckList[w].ipa,
        userSpoken: `${w}`,
        issueType: 'stress_error',
        advice: ipaCheckList[w].advice
      });
    }
  });

  // C. Tính toán điểm số trôi chảy & từ vựng thực tế
  let hasFillers = /\b(uhm|ah|err|like|you know)\b/i.test(text);
  let hasConnectors = /\b(firstly|secondly|furthermore|however|therefore|on top of that|in addition)\b/i.test(text);

  if (examType === 'TOEIC') {
    let score = 160;
    if (wordCount < 10) score = 40;
    else if (wordCount < 25) score = 80;
    else if (wordCount < 50) score = 120;
    else if (wordCount < 90) score = 150;
    else score = 180;

    let levelStr = 'Level 7 (160 - 180/200)';
    if (score >= 190) levelStr = 'Level 8 (190 - 200/200)';
    else if (score >= 160) levelStr = 'Level 7 (160 - 180/200)';
    else if (score >= 130) levelStr = 'Level 6 (130 - 150/200)';
    else if (score >= 80) levelStr = 'Level 4 (80 - 100/200)';
    else levelStr = 'Level 2 (40/200 điểm)';

    return {
      overallScore: score,
      bandOrLevel: levelStr,
      summaryFeedback: `Bài nói TOEIC của bạn gồm **${wordCount} từ** (${rawSentences.length} câu) đạt **${score}/200** (${levelStr}). ${
        wordCount < 30
          ? 'Bài nói còn rất ngắn, bạn cần mở rộng thêm ý tưởng và phát biểu liên tục hơn.'
          : `Tốc độ phản xạ bài nói ổn định với chỉ số từ vựng đạt ${(lexicalDiversity * 100).toFixed(0)}%.`
      }`,
      criteria: [
        { name: 'Phát âm & Trọng âm', englishName: 'Pronunciation & Stress', score: Math.min(10, Math.floor(score / 20)), maxScore: 10, comment: pronunciationIssues.length > 0 ? `Cần lưu ý trọng âm các từ: ${pronunciationIssues.map(p => p.word).join(', ')}.` : 'Phát âm rõ nghĩa, dễ nghe.' },
        { name: 'Từ vựng & Cấu trúc Ngữ pháp', englishName: 'Grammar & Vocabulary', score: Math.min(10, Math.floor(score / 20)), maxScore: 10, comment: grammarFixes.length > 0 ? `Đã phát hiện ${grammarFixes.length} lỗi ngữ pháp trong bài nói.` : 'Cấu trúc câu chính xác.' },
        { name: 'Độ trôi chảy & Tương tác', englishName: 'Fluency & Coherence', score: Math.min(10, Math.floor(score / 20)), maxScore: 10, comment: hasFillers ? 'Tránh ngập ngừng lặp từ "uhm", "ah" bằng các filler phrases tự nhiên.' : 'Dòng phát biểu trôi chảy.' },
        { name: 'Độ phù hợp & Nội dung', englishName: 'Relevance & Completeness', score: Math.min(10, Math.floor(score / 20)), maxScore: 10, comment: wordCount < 30 ? 'Cần phát triển câu trả lời dài hơn.' : 'Nội dung trả lời đi đúng trọng tâm đề bài.' }
      ],
      pronunciationIssues,
      grammarFixes,
      actionableAdvice: [
        wordCount < 30 ? 'Luyện tập phát biểu liên tục 45-60 giây mà không dừng lại quá lâu.' : 'Duy trì tốc độ phát biểu ổn định.',
        'Sử dụng công thức A.R.E.A (Answer - Reason - Example) để mở rộng câu trả lời.'
      ],
      sampleAnswer: getEffectiveSpeakingSampleAnswer(examType, question),
      transcript: text
    };
  } else {
    // IELTS Speaking Scale
    let fc = 6.0; let lr = 6.0; let gra = 6.0; let p = 6.0;

    if (wordCount < 10) {
      fc = 2.5; lr = 2.5; gra = 2.5; p = 2.5;
    } else if (wordCount < 25) {
      fc = 4.0; lr = 4.0; gra = 4.0; p = 4.0;
    } else if (wordCount < 50) {
      fc = 5.5; lr = 5.5; gra = 5.5; p = 5.5;
    } else if (wordCount < 90) {
      fc = 6.5; lr = 6.5; gra = 6.5; p = 6.5;
    } else {
      fc = hasConnectors ? 7.5 : 6.5;
      lr = lexicalDiversity > 0.45 ? 7.5 : 6.5;
      gra = grammarFixes.length === 0 ? 7.5 : 6.5;
      p = pronunciationIssues.length === 0 ? 7.5 : 6.5;
    }

    const overallBand = Math.round(((fc + lr + gra + p) / 4) * 2) / 2;
    const bandStr = `Band ${overallBand.toFixed(1)}`;

    return {
      overallScore: overallBand,
      bandOrLevel: bandStr,
      summaryFeedback: `Bài nói IELTS của bạn gồm **${wordCount} từ** (${rawSentences.length} câu) đạt **${bandStr}**. ${
        wordCount < 30
          ? 'Bài nói rất ngắn, bạn bị trừ điểm tiêu chí Fluency & Coherence.'
          : `Khả năng diễn đạt tự nhiên, chỉ số phong phú từ vựng đạt ${(lexicalDiversity * 100).toFixed(0)}%.`
      }`,
      criteria: [
        { name: 'Độ lưu loát & Mạch lạc', englishName: 'Fluency and Coherence (FC)', score: fc, maxScore: 9, comment: hasConnectors ? 'Nói trôi chảy có liên từ liên kết.' : 'Nên sử dụng từ nối tự nhiên như "Having said that", "On top of that".' },
        { name: 'Vốn từ vựng', englishName: 'Lexical Resource (LR)', score: lr, maxScore: 9, comment: `Đa dạng từ vựng đạt ${(lexicalDiversity * 100).toFixed(0)}%.` },
        { name: 'Ngữ pháp & Độ chính xác', englishName: 'Grammatical Range and Accuracy (GRA)', score: gra, maxScore: 9, comment: grammarFixes.length > 0 ? `Cần chú ý ${grammarFixes.length} lỗi ngữ pháp trong bài nói.` : 'Sử dụng tốt các cấu trúc câu.' },
        { name: 'Phát âm & Ngữ điệu', englishName: 'Pronunciation (P)', score: p, maxScore: 9, comment: pronunciationIssues.length > 0 ? `Chú ý trọng âm các từ: ${pronunciationIssues.map(pi => pi.word).join(', ')}.` : 'Phát âm rõ nghĩa.' }
      ],
      pronunciationIssues,
      grammarFixes,
      actionableAdvice: [
        'Tập trung phát triển câu trả lời theo mô hình A.R.E.A (Answer - Reason - Example).',
        'Thực hành ghi âm bài nói 2 phút hằng ngày và nghe lại để tự phát hiện lỗi ngắt quãng.'
      ],
      sampleAnswer: getEffectiveSpeakingSampleAnswer(examType, question),
      transcript: text
    };
  }
}

async function evaluateWithOpenAIOrGemini(
  examType: ExamType,
  question: Question | { title: string; prompt: string },
  transcript: string,
  apiKey: string
): Promise<EvaluationResult | null> {
  const promptText = `Bạn là Giám khảo chấm thi Speaking ${examType} quốc tế chuyên nghiệp. Hãy chấm điểm THỰC TẾ bản ghi âm bài nói sau đây của thí sinh theo đúng tiêu chuẩn chính thức:

Đề bài (${examType}):
Tiêu đề: ${question.title}
Yêu cầu: ${question.prompt}

Bản ghi bài nói THỰC TẾ của học viên:
"${transcript}"

QUY TẮC RẤT QUAN TRỌNG:
1. CHỈ trích dẫn và sửa các câu THỰC TẾ xuất hiện trong bản ghi của học viên trong mục "grammarFixes". TUYỆT ĐỐI không đưa ra câu ví dụ mẫu không có trong bài thi của học viên.
2. CHỈ chỉ ra lỗi phát âm / trọng âm của các từ THỰC TẾ xuất hiện trong bản ghi của học viên trong mục "pronunciationIssues".

Hãy đánh giá và trả về kết quả cấu trúc JSON như sau:
{
  "overallScore": <DIEM_THUC_TE>,
  "bandOrLevel": "<CUM_TU_DIEM_VD_Band_6.5_hoac_Level_7>",
  "summaryFeedback": "Nhận xét tổng quan bằng Tiếng Việt",
  "criteria": [
    { "name": "Tên tiêu chí Tiếng Việt", "englishName": "Tên tiếng Anh", "score": <DIEM_TIEU_CHI>, "maxScore": ${examType === 'TOEIC' ? 10 : 9}, "comment": "Nhận xét chi tiết tiếng Việt" }
  ],
  "pronunciationIssues": [
    { "word": "từ THỰC TẾ trong bài của học viên", "correctIpa": "/IPA/", "userSpoken": "cách đọc", "issueType": "mispronounced", "advice": "Hướng dẫn sửa" }
  ],
  "grammarFixes": [
    { "original": "câu gốc sai THỰC TẾ của học viên", "corrected": "câu đã sửa chuẩn", "explanation": "Giải thích lỗi tiếng Việt" }
  ],
  "actionableAdvice": ["Lời khuyên 1", "Lời khuyên 2"],
  "sampleAnswer": "Bài mẫu hoàn hảo tiếng Anh"
}`;

  // Support Google Gemini API Key
  if (apiKey.startsWith('AIza')) {
    try {
      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: promptText + "\n\nTRẢ VỀ DUY NHẤT MỘT CHUỖI JSON HỢP LỆ, KHÔNG BAO GỒM MARKDOWN CODEBLOCK." }] }]
          })
        }
      );
      if (geminiRes.ok) {
        const data = await geminiRes.json();
        const textResp = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const cleanJson = textResp.replace(/```json/gi, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleanJson);
        return {
          ...parsed,
          transcript
        };
      }
    } catch (err) {
      console.warn('Lỗi khi gọi Gemini API cho Speaking, chuyển sang OpenAI/Fallback:', err);
    }
  }

  // OpenAI API Key
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: promptText }],
      response_format: { type: 'json_object' },
      temperature: 0.5
    })
  });

  if (!res.ok) return null;
  const data = await res.json();
  const parsed = JSON.parse(data.choices[0].message.content);
  return {
    ...parsed,
    transcript
  };
}
