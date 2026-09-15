import type { WritingQuestion, WritingEvaluationResult, ExamType } from '../types';

export function getEffectiveWritingSampleAnswer(examType: ExamType, question: WritingQuestion): string {
  if (
    question.sampleAnswer &&
    !question.sampleAnswer.toLowerCase().includes('will be generated') &&
    !question.sampleAnswer.toLowerCase().includes('sample answer will')
  ) {
    return question.sampleAnswer;
  }

  const title = question.title || 'the designated topic';

  if (examType === 'TOEIC') {
    if (question.part === 1 && question.givenWords && question.givenWords.length >= 2) {
      return `The professional team is actively using the ${question.givenWords[0]} procedure to establish an effective ${question.givenWords[1]} for our current operations.`;
    } else if (question.part === 2) {
      return `Dear Support / Management Team,\n\nThank you for bringing your inquiry regarding ${title} to our attention.\n\nFirst, our department has instituted updated compliance guidelines to address all points raised in your request. All staff members have been instructed to align their daily workflows with these standards.\n\nSecond, we are pleased to confirm that full documentation and updated resources will be distributed via email by the end of this business week.\n\nPlease feel free to contact our office if you require any additional assistance.\n\nBest regards,\nCustomer Operations Manager`;
    } else {
      return `In today's rapidly evolving economic landscape, the question of how to effectively manage ${title} has generated significant discussion. I firmly maintain that adopting a proactive, strategic approach to this matter yields the greatest long-term advantages for contemporary organizations.\n\nFirst and foremost, prioritizing ${title} enhances operational efficiency and strengthens brand credibility. When an organization demonstrates clear dedication to core principles, it establishes trust among clients and key stakeholders alike. Furthermore, high-performing professionals naturally gravitate toward workplaces that foster innovation and professional development.\n\nSecondly, neglecting this critical aspect often leads to systemic inefficiencies and reduced competitiveness. Investing resources into structured training and clear communication channels ensures that potential risks are mitigated before they escalate.\n\nIn conclusion, strategic commitment to ${title} is indispensable for sustainable growth and corporate resilience in the modern market.`;
    }
  } else {
    // IELTS
    if (question.part === 1) {
      if (question.ieltsSubtype === 'general') {
        return `Dear Sir or Madam,\n\nI am writing to formally bring to your attention a matter of considerable importance regarding ${title}.\n\nFirst, I would like to outline the background of this situation. Over the past few weeks, issues related to this matter have caused notable inconvenience and disrupted daily schedules. To address this effectively, I strongly request that your office review current procedures and implement immediate corrective measures.\n\nSecondly, establishing a dedicated point of contact for ongoing communication would ensure transparency and prevent similar difficulties from recurring in the future.\n\nThank you for your prompt attention to this urgent matter. I look forward to your early response.\n\nYours faithfully,\nAlex Morgan`;
      }
      return `The presented statistical data provides a detailed analysis regarding ${title} over the specified timeframe.\n\nOverall, it is immediately apparent that most measured metrics experienced a overall upward trajectory, with the most pronounced increase recorded in the primary sector.\n\nIn the initial phase, key figures stood at a moderate level. Over subsequent years, steady growth was observed, culminating in a projected peak by the final period. Conversely, secondary indicators demonstrated minor fluctuations before stabilizing at a sustainable benchmark.`;
    } else {
      return `The discussion surrounding ${title} has become a paramount concern in modern discourse. While some commentators advocate for immediate systemic intervention, others argue that individual responsibility plays a far more decisive role. This essay will critically analyze both viewpoints before outlining why a synergistic approach provides the most sustainable resolution.\n\nOn the one hand, proponents of structured regulation emphasize that central authorities possess the fiscal capacity and legal mandate necessary to institute comprehensive policies regarding ${title}. State-sponsored initiatives ensure equitable access and establish standardized guidelines across all sectors of society. For instance, legislative frameworks mandate compliance, thereby protecting public interests on a broader scale.\n\nOn the other hand, defenders of personal autonomy contend that lasting transformation relies heavily on individual awareness and habit modification. Top-down regulations frequently encounter public resistance unless citizens actively embrace ethical choices in their daily lives. When individuals demonstrate digital mindfulness and personal accountability, bottom-up cultural shifts naturally take root.\n\nIn my perspective, regulatory frameworks and personal initiative are mutually reinforcing rather than mutually exclusive. Governments must provide infrastructure and legal safeguards, while citizens must fulfill their personal responsibilities.\n\nIn conclusion, addressing ${title} effectively requires a dual approach. Combining enlightened government policy with individual commitment represents the optimal strategy for long-term societal progress.`;
    }
  }
}

export async function evaluateWritingEssay(
  examType: ExamType,
  question: WritingQuestion,
  userEssay: string,
  apiKey?: string
): Promise<WritingEvaluationResult> {
  const essayText = userEssay.trim();
  const wordCount = essayText ? essayText.split(/\s+/).filter(Boolean).length : 0;

  // 1. Xử lý bài thi bỏ trống (0 từ)
  if (wordCount === 0) {
    if (examType === 'TOEIC') {
      return {
        overallScore: 0,
        bandOrLevel: 'Level 0 (0/200 điểm)',
        summaryFeedback: 'Thí sinh chưa nhập bất kỳ nội dung nào cho bài viết (0 từ). Bài làm bị chấm 0 điểm do bỏ trống.',
        criteria: [
          { name: 'Ngữ pháp & Cấu trúc câu', englishName: 'Grammatical Accuracy', score: 0, maxScore: 5.0, comment: 'Chưa nộp bài làm (0 từ).' },
          { name: 'Độ phù hợp với đề bài', englishName: 'Relevance to Stimulus', score: 0, maxScore: 5.0, comment: 'Chưa nộp bài làm (0 từ).' },
          { name: 'Vốn từ vựng công sở', englishName: 'Business Vocabulary', score: 0, maxScore: 5.0, comment: 'Chưa nộp bài làm (0 từ).' },
          { name: 'Bố cục & Sự mạch lạc', englishName: 'Organization & Clarity', score: 0, maxScore: 5.0, comment: 'Chưa nộp bài làm (0 từ).' }
        ],
        wordCount: 0,
        grammarFixes: [],
        vocabularyUpgrades: [],
        actionableAdvice: [
          'Hãy nhập bài viết của bạn vào khung soạn thảo trước khi nộp bài.',
          'Đảm bảo đáp ứng đủ số lượng từ tối thiểu của đề bài để đạt điểm tối ưu.'
        ],
        sampleAnswer: getEffectiveWritingSampleAnswer(examType, question),
        userEssay: '(Thí sinh chưa nhập nội dung bài viết)'
      };
    } else {
      return {
        overallScore: 0,
        bandOrLevel: 'Band 0.0',
        summaryFeedback: 'Thí sinh chưa nhập bất kỳ nội dung nào cho bài viết (0 từ). Bài làm bị chấm điểm Band 0.0 do bỏ trống theo đúng quy chuẩn IELTS.',
        criteria: [
          { name: 'Task Response / Task Achievement', englishName: 'Task Response (TR)', score: 0, maxScore: 9.0, comment: 'Chưa nộp bài làm (0 từ).' },
          { name: 'Coherence and Cohesion', englishName: 'Coherence & Cohesion (CC)', score: 0, maxScore: 9.0, comment: 'Chưa nộp bài làm (0 từ).' },
          { name: 'Lexical Resource', englishName: 'Lexical Resource (LR)', score: 0, maxScore: 9.0, comment: 'Chưa nộp bài làm (0 từ).' },
          { name: 'Grammatical Range and Accuracy', englishName: 'Grammar (GRA)', score: 0, maxScore: 9.0, comment: 'Chưa nộp bài làm (0 từ).' }
        ],
        wordCount: 0,
        grammarFixes: [],
        vocabularyUpgrades: [],
        actionableAdvice: [
          'Hãy nhập bài viết của bạn vào khung soạn thảo trước khi nộp bài.',
          'Nên phân chia bài viết thành các đoạn rõ ràng (Mở bài, Thân bài 1, Thân bài 2, Kết bài).'
        ],
        sampleAnswer: getEffectiveWritingSampleAnswer(examType, question),
        userEssay: '(Thí sinh chưa nhập nội dung bài viết)'
      };
    }
  }

  // 2. Thử gọi API thực tế nếu user nhập apiKey
  if (apiKey && apiKey.trim().length > 10) {
    try {
      const realEval = await evaluateWritingWithAPI(examType, question, essayText, wordCount, apiKey);
      if (realEval) return realEval;
    } catch (e) {
      console.warn('Lỗi khi chấm điểm Writing bằng API thực tế, chuyển sang Real-Text NLP Evaluator Engine:', e);
    }
  }

  // 3. Sử dụng Bộ Phân Tích Văn Bản Thực Tế (Real Dynamic NLP Text Evaluator)
  return await analyzeRealEssayText(examType, question, essayText, wordCount);
}

// Bộ Phân Tích Văn Bản Thực Tế (Phân tích đúng bài làm của thí sinh, KHÔNG dùng câu tĩnh)
async function analyzeRealEssayText(
  examType: ExamType,
  question: WritingQuestion,
  userEssay: string,
  wordCount: number
): Promise<WritingEvaluationResult> {
  const minWords = question.minWords || 150;
  const rawSentences = userEssay.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 0);
  const words = userEssay.toLowerCase().match(/\b[a-z']+\b/g) || [];
  const uniqueWords = new Set(words);
  const lexicalDiversity = words.length > 0 ? (uniqueWords.size / words.length) : 0;

  const grammarFixes: { original: string; corrected: string; explanation: string }[] = [];

  // --- A. Bộ Kiểm Tra Lỗi Chính Tả Tự Động (Spell Checker Engine - Datamuse 500k Lexicon) ---
  const validEnglishVocabulary = new Set([
    'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do',
    'at', 'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or', 'an', 'will', 'my', 'one', 'all', 'would',
    'there', 'their', 'what', 'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can', 'like',
    'time', 'no', 'just', 'him', 'know', 'take', 'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other',
    'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also', 'back', 'after', 'use', 'two', 'how', 'our',
    'work', 'first', 'well', 'way', 'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us', 'society',
    'technology', 'environment', 'government', 'important', 'different', 'business', 'education', 'solution', 'problem',
    'challenge', 'development', 'opportunity', 'advantage', 'disadvantage', 'opinion', 'reason', 'example', 'conclusion',
    'result', 'impact', 'effect', 'benefit', 'support', 'individual', 'community', 'international', 'global', 'economic',
    'social', 'financial', 'industry', 'process', 'management', 'employee', 'company', 'customer', 'service', 'product',
    'market', 'strategy', 'policy', 'system', 'research', 'analysis', 'level', 'future', 'career', 'study', 'knowledge',
    'skill', 'ability', 'action', 'activity', 'measure', 'increase', 'decrease', 'improve', 'reduce', 'provide', 'require',
    'create', 'discuss', 'consider', 'believe', 'suggest', 'maintain', 'foster', 'promote', 'ensure', 'enable', 'allow',
    'cause', 'lead', 'change', 'transform', 'help', 'need', 'show', 'present', 'effective', 'beneficial', 'detrimental',
    'crucial', 'pivotal', 'substantial', 'significant', 'essential', 'necessary', 'vital', 'positive', 'negative', 'modern',
    'traditional', 'personal', 'public', 'private', 'national', 'local', 'general', 'specific', 'main', 'major', 'minor',
    'overall', 'however', 'furthermore', 'moreover', 'consequently', 'therefore', 'firstly', 'secondly', 'finally', 'writing',
    'something', 'where', 'school', 'children', 'parent', 'family', 'student', 'teacher', 'university', 'college', 'workplace'
  ]);

  const typoDictionary: Record<string, { correct: string; exp: string }> = {
    'somthing': { correct: 'something', exp: 'Lỗi chính tả: Từ "somthing" thiếu chữ "e", viết đúng là "something".' },
    'writting': { correct: 'writing', exp: 'Lỗi chính tả: Từ "writting" thừa chữ "t", viết đúng là "writing".' },
    'tiem': { correct: 'time', exp: 'Lỗi chính tả: Từ "tiem" đảo ký tự, viết đúng là "time".' },
    'peopl': { correct: 'people', exp: 'Lỗi chính tả: Từ "peopl" thiếu chữ "e", viết đúng là "people".' },
    'skool': { correct: 'school', exp: 'Lỗi chính tả: Từ "skool" viết đúng là "school".' },
    'goodd': { correct: 'good', exp: 'Lỗi chính tả: "goodd" thừa chữ "d", viết đúng là "good".' },
    'workk': { correct: 'work', exp: 'Lỗi chính tả: "workk" thừa chữ "k", viết đúng là "work".' },
    'veryy': { correct: 'very', exp: 'Lỗi chính tả: "veryy" thừa chữ "y", viết đúng là "very".' },
    'plz': { correct: 'please', exp: 'Tránh dùng từ viết tắt nhắn tin "plz" trong bài viết luận chính thức.' },
    'isolate': { correct: 'isolated', exp: 'Trong ngữ cảnh tính từ chỉ cảm xúc ("feel isolated"), từ đúng là "isolated" (dạng quá khứ phân từ).' },
    'sociaty': { correct: 'society', exp: 'Lỗi chính tả: Từ "sociaty" viết đúng là "society".' },
    'tecnology': { correct: 'technology', exp: 'Lỗi chính tả: "tecnology" thiếu chữ "h", viết đúng là "technology".' },
    'imporant': { correct: 'important', exp: 'Lỗi chính tả: "imporant" thiếu chữ "t", viết đúng là "important".' },
    'diffrent': { correct: 'different', exp: 'Lỗi chính tả: "diffrent" thiếu chữ "e", viết đúng là "different".' },
    'goverment': { correct: 'government', exp: 'Lỗi chính tả: "goverment" thiếu chữ "n", viết đúng là "government".' },
    'enviroment': { correct: 'environment', exp: 'Lỗi chính tả: "enviroment" thiếu chữ "n", viết đúng là "environment".' },
    'peopel': { correct: 'people', exp: 'Lỗi chính tả: "peopel" viết đúng là "people".' },
    'thier': { correct: 'their', exp: 'Lỗi chính tả: "thier" viết đúng là "their".' },
    'recieve': { correct: 'receive', exp: 'Lỗi chính tả: "recieve" viết đúng là "receive" (quy tắc i trước e).' },
    'seperate': { correct: 'separate', exp: 'Lỗi chính tả: "seperate" viết đúng là "separate".' },
    'definately': { correct: 'definitely', exp: 'Lỗi chính tả: "definately" viết đúng là "definitely".' },
    'beutiful': { correct: 'beautiful', exp: 'Lỗi chính tả: "beutiful" viết đúng là "beautiful".' },
    'bussiness': { correct: 'business', exp: 'Lỗi chính tả: "bussiness" thừa chữ "s", viết đúng là "business".' },
    'succesful': { correct: 'successful', exp: 'Lỗi chính tả: "succesful" thiếu chữ "s", viết đúng là "successful".' },
    'concluson': { correct: 'conclusion', exp: 'Lỗi chính tả: "concluson" viết đúng là "conclusion".' },
    'differant': { correct: 'different', exp: 'Lỗi chính tả: "differant" viết đúng là "different".' },
    'devolopment': { correct: 'development', exp: 'Lỗi chính tả: "devolopment" viết đúng là "development".' },
    'devlopment': { correct: 'development', exp: 'Lỗi chính tả: "devlopment" viết đúng là "development".' },
    'privat': { correct: 'private', exp: 'Lỗi chính tả: "privat" thiếu chữ "e", viết đúng là "private".' },
    'publc': { correct: 'public', exp: 'Lỗi chính tả: "publc" thiếu chữ "i", viết đúng là "public".' },
    'opion': { correct: 'opinion', exp: 'Lỗi chính tả: "opion" viết đúng là "opinion".' },
    'impliment': { correct: 'implement', exp: 'Lỗi chính tả: "impliment" viết đúng là "implement".' },
    'soluton': { correct: 'solution', exp: 'Lỗi chính tả: "soluton" viết đúng là "solution".' },
    'interst': { correct: 'interest', exp: 'Lỗi chính tả: "interst" viết đúng là "interest".' },
    'knowlege': { correct: 'knowledge', exp: 'Lỗi chính tả: "knowlege" viết đúng là "knowledge".' },
    'edusation': { correct: 'education', exp: 'Lỗi chính tả: "edusation" viết đúng là "education".' },
    'benifit': { correct: 'benefit', exp: 'Lỗi chính tả: "benifit" viết đúng là "benefit".' },
    'chalenge': { correct: 'challenge', exp: 'Lỗi chính tả: "chalenge" viết đúng là "challenge".' },
    'problm': { correct: 'problem', exp: 'Lỗi chính tả: "problm" thiếu chữ "e", viết đúng là "problem".' },
    'dificult': { correct: 'difficult', exp: 'Lỗi chính tả: "dificult" viết đúng là "difficult".' },
    'isnt': { correct: "isn't", exp: 'Thiếu dấu nháy đơn trong từ gộp "isn\'t".' },
    'doesnt': { correct: "doesn't", exp: 'Thiếu dấu nháy đơn trong từ gộp "doesn\'t".' },
    'dont': { correct: "don't", exp: 'Thiếu dấu nháy đơn trong từ gộp "don\'t".' },
    'cant': { correct: "can't", exp: 'Thiếu dấu nháy đơn trong từ gộp "can\'t".' },
    'wont': { correct: "won't", exp: 'Thiếu dấu nháy đơn trong từ gộp "won\'t".' }
  };

  function calcLevenshtein(a: string, b: string): number {
    if (a === b) return 0;
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;
    const matrix: number[][] = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    return matrix[b.length][a.length];
  }

  // 1. Quét lỗi chính tả nhanh (Direct local dictionary & double ending)
  const unknownCandidateWords = new Set<string>();

  words.forEach((w) => {
    if (w === 'isolate' && userEssay.toLowerCase().includes('feel isolate')) {
      return;
    }

    // A1. Khớp từ điển trực tiếp
    if (typoDictionary[w]) {
      const entry = typoDictionary[w];
      const isAlreadyAdded = grammarFixes.some(f => f.original.toLowerCase() === w);
      if (!isAlreadyAdded) {
        grammarFixes.push({
          original: w,
          corrected: entry.correct,
          explanation: entry.exp
        });
      }
      return;
    }

    // A2. Phát hiện lặp ký tự đuôi (vd: goodd -> good, workk -> work, helpfull -> helpful)
    const doubleEndingMatch = w.match(/^([a-z]+?)([b-df-hj-np-tv-z])\2+$/);
    if (doubleEndingMatch && w.length >= 4) {
      const trimmedWord = w.replace(/([a-z])\1+$/, '$1');
      if (validEnglishVocabulary.has(trimmedWord)) {
        const isAlreadyAdded = grammarFixes.some(f => f.original.toLowerCase() === w);
        if (!isAlreadyAdded) {
          grammarFixes.push({
            original: w,
            corrected: trimmedWord,
            explanation: `Lỗi chính tả lặp ký tự đuôi "${w}": Viết đúng là "${trimmedWord}".`
          });
        }
        return;
      }
    }

    // A3. Gom nhóm từ không nằm trong cache từ vựng căn bản để tra cứu từ điển 500k+ từ
    if (w.length >= 3 && !validEnglishVocabulary.has(w) && !/^\d+$/.test(w)) {
      unknownCandidateWords.add(w);
    }
  });

  // A4. Kiểm tra từ điển Tiếng Anh Mở 500.000+ từ (Datamuse Lexicon)
  if (unknownCandidateWords.size > 0) {
    const candidateList = Array.from(unknownCandidateWords).slice(0, 25);
    try {
      const datamuseChecks = candidateList.map(async (w) => {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 2000);

          const exactRes = await fetch(`https://api.datamuse.com/words?sp=${encodeURIComponent(w)}&max=1`, {
            signal: controller.signal
          });
          clearTimeout(timeoutId);

          if (exactRes.ok) {
            const exactData = await exactRes.json();
            const isValidIn500k = Array.isArray(exactData) && exactData.length > 0 && exactData[0].word.toLowerCase() === w;

            if (!isValidIn500k) {
              // Tra từ gợi ý sửa lỗi trong 500k+ từ tiếng Anh
              const controller2 = new AbortController();
              const timeoutId2 = setTimeout(() => controller2.abort(), 2000);

              const sugRes = await fetch(`https://api.datamuse.com/words?sl=${encodeURIComponent(w)}&max=1`, {
                signal: controller2.signal
              });
              clearTimeout(timeoutId2);

              if (sugRes.ok) {
                const sugData = await sugRes.json();
                if (Array.isArray(sugData) && sugData.length > 0 && sugData[0].word) {
                  const suggested = sugData[0].word.toLowerCase();
                  if (suggested !== w && !grammarFixes.some(f => f.original.toLowerCase() === w)) {
                    grammarFixes.push({
                      original: w,
                      corrected: suggested,
                      explanation: `Lỗi chính tả: Từ "${w}" không có trong từ điển Tiếng Anh (500.000+ từ). Từ viết đúng là "${suggested}".`
                    });
                  }
                }
              }
            }
          }
        } catch {
          // Backup: Levenshtein offline nếu mất mạng/timeout
          let closestMatch = '';
          for (const validWord of validEnglishVocabulary) {
            if (Math.abs(validWord.length - w.length) <= 1) {
              const dist = calcLevenshtein(w, validWord);
              if (dist === 1) {
                closestMatch = validWord;
                break;
              }
            }
          }
          if (closestMatch && !grammarFixes.some(f => f.original.toLowerCase() === w)) {
            grammarFixes.push({
              original: w,
              corrected: closestMatch,
              explanation: `Lỗi chính tả: Từ "${w}" được viết đúng là "${closestMatch}".`
            });
          }
        }
      });

      await Promise.all(datamuseChecks);
    } catch {
      // Fallback silent
    }
  }

  // --- B. Phân tích quy tắc ngữ pháp & giới từ chi tiết ---
  rawSentences.forEach((sentence) => {
    const trimmed = sentence.trim();

    // 1. Cụm "feel isolate" -> "feel isolated"
    if (/\bfeel\s+isolate\b/i.test(trimmed)) {
      grammarFixes.push({
        original: trimmed,
        corrected: trimmed.replace(/\bfeel\s+isolate\b/i, 'feel isolated'),
        explanation: 'Sau động từ chỉ cảm giác như "feel", dùng tính từ dạng quá khứ phân từ "isolated" thay vì động từ nguyên mẫu "isolate".'
      });
    }

    // 2. Cụm "social media make" -> "social media makes"
    if (/\bsocial\s+media\s+make\b/i.test(trimmed)) {
      grammarFixes.push({
        original: trimmed,
        corrected: trimmed.replace(/\bsocial\s+media\s+make\b/i, 'social media makes'),
        explanation: 'Chủ ngữ "Social media" trong văn phong học thuật được tính là danh từ tập hợp số ít đi với động từ chia "makes".'
      });
    }

    // 3. Lỗi dùng cả Although/Even though và But trong cùng câu
    if (/^\b(although|even though|though)\b/i.test(trimmed) && /\bbut\b/i.test(trimmed)) {
      const fixed = trimmed.replace(/\bbut\b\s*/i, '');
      grammarFixes.push({
        original: trimmed,
        corrected: fixed,
        explanation: 'Trong tiếng Anh không sử dụng đồng thời liên từ "Although/Even though" và "but" trong cùng một câu ghép.'
      });
    }

    // 4. Lỗi dùng cả Because và So trong cùng câu
    if (/^\b(because|since|as)\b/i.test(trimmed) && /\bso\b/i.test(trimmed)) {
      const fixed = trimmed.replace(/\bso\b\s*/i, '');
      grammarFixes.push({
        original: trimmed,
        corrected: fixed,
        explanation: 'Không sử dụng đồng thời "Because" và "so" trong cùng một câu.'
      });
    }

    // 5. Lỗi giới từ: "discuss about" -> "discuss"
    if (/\bdiscuss\s+about\b/i.test(trimmed)) {
      grammarFixes.push({
        original: trimmed,
        corrected: trimmed.replace(/\bdiscuss\s+about\b/i, 'discuss'),
        explanation: 'Động từ "discuss" là ngoại động từ nên đi trực tiếp với tân ngữ, không sử dụng giới từ "about".'
      });
    }

    // 6. Lỗi giới từ: "depend of" -> "depend on"
    if (/\bdepend\s+of\b/i.test(trimmed)) {
      grammarFixes.push({
        original: trimmed,
        corrected: trimmed.replace(/\bdepend\s+of\b/i, 'depend on'),
        explanation: 'Động từ "depend" bắt buộc đi với giới từ "on" (hoặc "upon"), không dùng "depend of".'
      });
    }

    // 7. Lỗi giới từ: "interested on" -> "interested in"
    if (/\binterested\s+on\b/i.test(trimmed)) {
      grammarFixes.push({
        original: trimmed,
        corrected: trimmed.replace(/\binterested\s+on\b/i, 'interested in'),
        explanation: 'Cấu trúc tính từ: "be interested in something" (hứng thú với cái gì).'
      });
    }

    // 8. Lỗi giới từ: "different than" -> "different from"
    if (/\bdifferent\s+than\b/i.test(trimmed)) {
      grammarFixes.push({
        original: trimmed,
        corrected: trimmed.replace(/\bdifferent\s+than\b/i, 'different from'),
        explanation: 'Trong văn phong chuẩn tiếng Anh (Standard English), dùng "different from" thay vì "different than".'
      });
    }

    // 9. Lỗi hòa hợp chủ ngữ số ít (he/she/it/this + base verb)
    const svMatch = trimmed.match(/\b(he|she|it|this|that|everyone|everybody|company|government)\s+(make|take|help|give|need|want|allow|cause|show|lead|provide)\b/i);
    if (svMatch) {
      const sub = svMatch[1];
      const verb = svMatch[2];
      const fixedVerb = verb.endsWith('e') ? verb + 's' : verb + 'es';
      grammarFixes.push({
        original: svMatch[0],
        corrected: `${sub} ${fixedVerb}`,
        explanation: `Chủ ngữ số ít "${sub}" đi với động từ chia thì hiện tại đơn cần thêm "s/es" thành "${fixedVerb}".`
      });
    }

    // 10. Lỗi động từ khuyết thiếu + to (can to, should to, must to)
    const modalMatch = trimmed.match(/\b(can|could|should|must|will|would|may|might)\s+to\s+([a-z]+)\b/i);
    if (modalMatch) {
      grammarFixes.push({
        original: modalMatch[0],
        corrected: `${modalMatch[1]} ${modalMatch[2]}`,
        explanation: `Động từ khuyết thiếu "${modalMatch[1]}" đi trực tiếp với động từ nguyên mẫu không có "to".`
      });
    }

    // 11. Kiểm tra đầu câu chưa viết hoa
    if (/^[a-z]/.test(trimmed)) {
      const capitalized = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
      grammarFixes.push({
        original: trimmed.slice(0, 35) + '...',
        corrected: capitalized.slice(0, 35) + '...',
        explanation: 'Chữ cái đầu tiên của câu bắt buộc phải viết hoa.'
      });
    }
  });

  // --- C. Đề xuất nâng cấp từ vựng từ chính từ ngữ học viên đã viết ---
  const vocabularyUpgrades: { original: string; suggested: string; reason: string }[] = [];
  const upgradeDict: Record<string, { suggested: string; reason: string }> = {
    'good': { suggested: 'beneficial / advantageous / highly effective', reason: 'Thay thế tính từ đơn giản "good" bằng từ vựng học thuật cao cấp.' },
    'bad': { suggested: 'detrimental / adverse / counterproductive', reason: 'Nâng cấp tính từ "bad" bằng từ vựng mang tính phân tích chuyên sâu.' },
    'big': { suggested: 'substantial / considerable / paramount', reason: 'Sử dụng từ chỉ quy mô trang trọng thay cho "big".' },
    'important': { suggested: 'pivotal / crucial / fundamental', reason: 'Thay thế từ phổ thông "important" bằng collocations Band 8.0+.' },
    'problem': { suggested: 'pressing issue / formidable challenge', reason: 'Diễn đạt tính nghiêm trọng của vấn đề một cách chuyên nghiệp.' },
    'help': { suggested: 'facilitate / assist / foster', reason: 'Dùng động từ trang trọng hơn thay cho "help".' },
    'think': { suggested: 'contend / maintain / advocate', reason: 'Nâng cấp động từ bày tỏ quan điểm cá nhân trong bài luận.' },
    'make': { suggested: 'generate / yield / produce', reason: 'Dùng từ vựng diễn đạt sự tạo ra / kết quả chính xác hơn.' },
    'many': { suggested: 'a myriad of / a substantial number of', reason: 'Nâng cấp cụm từ chỉ số lượng học thuật.' },
    'a lot of': { suggested: 'a significant amount of / numerous', reason: 'Tránh dùng cụm nói "a lot of" trong bài viết luận chính thức.' },
    'thing': { suggested: 'aspect / factor / element', reason: 'Thay từ chung chung "thing" bằng từ chỉ khía cạnh cụ thể.' },
    'change': { suggested: 'transform / reshape / alter', reason: 'Dùng động từ miêu tả sự thay đổi mang tính tác động mạnh.' }
  };

  const foundWords = new Set<string>();
  words.forEach((w) => {
    if (upgradeDict[w] && !foundWords.has(w)) {
      foundWords.add(w);
      vocabularyUpgrades.push({
        original: w,
        suggested: upgradeDict[w].suggested,
        reason: upgradeDict[w].reason
      });
    }
  });
  if (userEssay.toLowerCase().includes('a lot of') && !foundWords.has('a lot of')) {
    vocabularyUpgrades.push({
      original: 'a lot of',
      suggested: upgradeDict['a lot of'].suggested,
      reason: upgradeDict['a lot of'].reason
    });
  }

  // --- D. ĐÁNH GIÁ ĐIỂM SỐ DỰA TRÊN THỰC TẾ CHẤM BÀI (Chấm Điểm Động) ---
  const hasConnectors = /\b(however|furthermore|moreover|consequently|therefore|on the other hand|in conclusion|firstly|secondly|in addition|nevertheless)\b/i.test(userEssay);
  const hasComplexStructures = /\b(which|that|although|whereas|while|because|if|in order to|due to|despite)\b/i.test(userEssay);
  const errorCount = grammarFixes.length;

  if (examType === 'TOEIC') {
    let score = 160;
    let level = 'Level 7 (160/200 điểm)';
    let graScore = 4.0;
    let trScore = 4.0;

    if (wordCount < 20) {
      score = 40; level = 'Level 2 (40/200 điểm - Rất ngắn)'; graScore = 1.0; trScore = 1.0;
    } else if (wordCount < 50) {
      score = 80; level = 'Level 4 (80/200 điểm - Sơ sài)'; graScore = 2.0; trScore = 2.0;
    } else if (wordCount < 100) {
      score = 120; level = 'Level 5 (120/200 điểm)'; graScore = 3.0; trScore = 3.0;
    } else if (wordCount < minWords) {
      const penaltyRatio = wordCount / minWords;
      score = Math.round(140 * penaltyRatio);
      level = `Level ${score >= 130 ? '6' : '5'} (${score}/200 điểm - Chưa đủ số từ)`;
      graScore = Math.max(1.5, 3.5 - (errorCount * 0.5));
      trScore = Math.max(1.5, 3.5 * penaltyRatio);
    } else {
      let base = 150;
      if (hasConnectors) base += 10;
      if (hasComplexStructures) base += 10;
      if (lexicalDiversity > 0.45) base += 10;
      base -= (errorCount * 15);

      score = Math.min(200, Math.max(60, base));
      if (score >= 190) level = `Level 8 (${score}/200 điểm - Xuất sắc)`;
      else if (score >= 160) level = `Level 7 (${score}/200 điểm - Tốt)`;
      else if (score >= 130) level = `Level 6 (${score}/200 điểm - Trung Bình)`;
      else level = `Level 5 (${score}/200 điểm)`;

      graScore = Math.min(5.0, Math.max(1.0, 4.0 - (errorCount * 0.6) + (hasComplexStructures ? 0.5 : 0)));
      trScore = Math.min(5.0, Math.max(1.0, 4.0 + (hasConnectors ? 0.5 : 0)));
    }

    return {
      overallScore: score,
      bandOrLevel: level,
      summaryFeedback: `Bài viết TOEIC của bạn gồm **${wordCount} từ** (${rawSentences.length} câu). ${
        wordCount < minWords
          ? `Bài viết chưa đạt đủ ${minWords} từ tối thiểu của đề bài nên bị trừ điểm tiêu chí nội dung.`
          : `Bài làm đạt ${score}/200 điểm. ${errorCount > 0 ? `Hệ thống phát hiện ${errorCount} lỗi ngữ pháp/chính tả cần khắc phục.` : 'Cấu trúc câu chính xác và trôi chảy.'}`
      }`,
      criteria: [
        { name: 'Ngữ pháp & Cấu trúc câu', englishName: 'Grammatical Accuracy', score: Math.round(graScore * 10) / 10, maxScore: 5.0, comment: `Đã phát hiện ${errorCount} lỗi ngữ pháp/chính tả thực tế trong bài làm.` },
        { name: 'Độ phù hợp với đề bài', englishName: 'Relevance to Stimulus', score: Math.round(trScore * 10) / 10, maxScore: 5.0, comment: wordCount < minWords ? `Mới đạt ${wordCount}/${minWords} từ quy định.` : 'Nội dung trả lời đi đúng trọng tâm yêu cầu đề bài.' },
        { name: 'Vốn từ vựng công sở', englishName: 'Business Vocabulary', score: Math.min(5.0, Math.max(1.0, Math.round((graScore + (lexicalDiversity > 0.4 ? 0.5 : 0)) * 10) / 10)), maxScore: 5.0, comment: `Chỉ số đa dạng từ vựng (Lexical Diversity) đạt ${(lexicalDiversity * 100).toFixed(0)}%.` },
        { name: 'Bố cục & Sự mạch lạc', englishName: 'Organization & Clarity', score: Math.min(5.0, Math.max(1.0, Math.round((trScore + (hasConnectors ? 0.5 : 0)) * 10) / 10)), maxScore: 5.0, comment: hasConnectors ? 'Bài viết có sử dụng liên từ nối đoạn mạch lạc.' : 'Nên bổ sung thêm các liên từ kết nối giữa các vế câu.' }
      ],
      wordCount,
      grammarFixes,
      vocabularyUpgrades,
      actionableAdvice: [
        wordCount < minWords ? `Viết thêm ít nhất ${minWords - wordCount} từ nữa để đạt độ dài tối chuẩn.` : 'Duy trì bố cục rõ ràng.',
        errorCount > 0 ? `Khắc phục ${errorCount} lỗi chính tả và ngữ pháp được chỉ ra ở trên.` : 'Phát huy sự chính xác trong từng câu văn.',
        hasConnectors ? 'Phát huy việc dùng liên từ nối giữa các đoạn.' : 'Sử dụng các từ nối như "Furthermore", "Consequently", "On the other hand".'
      ],
      sampleAnswer: getEffectiveWritingSampleAnswer(examType, question),
      userEssay
    };
  } else {
    // --- CHẤM ĐIỂM IELTS THỰC TẾ (IELTS Dynamic Scoring Engine) ---
    let trScore = 6.0;
    let ccScore = 6.0;
    let lrScore = 6.0;
    let graScore = 6.0;

    if (wordCount < 30) {
      trScore = 2.0; ccScore = 2.0; lrScore = 2.0; graScore = 2.0;
    } else if (wordCount < 70) {
      trScore = 3.5; ccScore = 3.5; lrScore = 4.0; graScore = 3.5;
    } else if (wordCount < 120) {
      trScore = 4.5; ccScore = 5.0; lrScore = 5.0; graScore = 4.5;
    } else if (wordCount < minWords) {
      const ratio = wordCount / minWords;
      trScore = Math.max(4.0, Math.round((5.5 * ratio) * 2) / 2);
      ccScore = 5.5;
      lrScore = lexicalDiversity > 0.45 ? 6.0 : 5.5;
      graScore = Math.max(4.0, Math.round((5.5 - (errorCount * 0.5)) * 2) / 2);
    } else {
      trScore = hasConnectors ? 6.5 : 6.0;
      if (wordCount >= minWords + 50 && rawSentences.length >= 6) trScore += 0.5;

      ccScore = hasConnectors ? 6.5 : 5.5;
      if (rawSentences.length >= 8 && hasConnectors) ccScore += 0.5;

      if (lexicalDiversity > 0.55) lrScore = 7.5;
      else if (lexicalDiversity > 0.45) lrScore = 6.5;
      else lrScore = 5.5;

      if (errorCount === 0) {
        graScore = hasComplexStructures ? 7.5 : 6.5;
        if (wordCount > minWords + 60 && lexicalDiversity > 0.5) graScore = 8.0;
      } else if (errorCount === 1) {
        graScore = 6.0;
      } else if (errorCount === 2) {
        graScore = 5.5;
      } else {
        graScore = Math.max(4.5, 5.0 - ((errorCount - 2) * 0.5));
      }
    }

    const rawAvg = (trScore + ccScore + lrScore + graScore) / 4;
    const roundedBand = Math.round(rawAvg * 2) / 2;

    return {
      overallScore: roundedBand,
      bandOrLevel: `Band ${roundedBand.toFixed(1)}`,
      summaryFeedback: `Bài viết IELTS Writing của bạn gồm **${wordCount} từ** (${rawSentences.length} câu) được đánh giá **Band ${roundedBand.toFixed(1)}**. ${
        wordCount < minWords
          ? `Lưu ý: Bài viết đạt ${wordCount}/${minWords} từ quy định. Thí sinh bị phạt điểm tiêu chí Task Response do chưa đủ số từ tối thiểu.`
          : `Bài làm có chỉ số phong phú từ vựng ${(lexicalDiversity * 100).toFixed(0)}%. ${errorCount > 0 ? `Đã phát hiện ${errorCount} lỗi ngữ pháp/chính tả thực tế trong bài làm.` : 'Cấu trúc câu đạt độ chính xác cao.'}`
      }`,
      criteria: [
        { name: 'Task Response / Task Achievement', englishName: 'Task Response (TR)', score: trScore, maxScore: 9.0, comment: wordCount < minWords ? `Mới đạt ${wordCount}/${minWords} từ tối thiểu.` : 'Phát triển lập luận tương đối rõ ràng và đi đúng trọng tâm.' },
        { name: 'Coherence and Cohesion', englishName: 'Coherence & Cohesion (CC)', score: ccScore, maxScore: 9.0, comment: hasConnectors ? 'Sử dụng tốt các từ nối liên kết đoạn.' : 'Nên thêm các từ nối tự nhiên để tăng độ mạch lạc.' },
        { name: 'Lexical Resource', englishName: 'Lexical Resource (LR)', score: lrScore, maxScore: 9.0, comment: `Đa dạng từ vựng đạt ${(lexicalDiversity * 100).toFixed(0)}%.` },
        { name: 'Grammatical Range and Accuracy', englishName: 'Grammar (GRA)', score: graScore, maxScore: 9.0, comment: errorCount > 0 ? `Bị trừ điểm do phát hiện ${errorCount} lỗi ngữ pháp/chính tả thực tế.` : 'Kết hợp tốt giữa câu đơn và câu phức.' }
      ],
      wordCount,
      grammarFixes,
      vocabularyUpgrades,
      actionableAdvice: [
        wordCount < minWords ? `Cần viết thêm ít nhất ${minWords - wordCount} từ nữa để tránh phạt điểm TR.` : 'Duy trì bố cục 4 đoạn chuẩn.',
        errorCount > 0 ? `Khắc phục ${errorCount} lỗi chính tả và ngữ pháp được liệt kê ở trên.` : 'Phát huy cấu trúc câu phức bằng các mệnh đề quan hệ.',
        hasConnectors ? 'Phát huy việc sử dụng các từ nối tự nhiên.' : 'Bổ sung các từ nối như "Furthermore", "Consequently", "In conclusion".'
      ],
      sampleAnswer: getEffectiveWritingSampleAnswer(examType, question),
      userEssay
    };
  }
}

async function evaluateWritingWithAPI(
  examType: ExamType,
  question: WritingQuestion,
  userEssay: string,
  wordCount: number,
  apiKey: string
): Promise<WritingEvaluationResult | null> {
  const promptText = `Bạn là Giám khảo chấm thi Writing ${examType} quốc tế chuyên nghiệp. Hãy chấm điểm THỰC TẾ bài viết sau của thí sinh theo đúng tiêu chuẩn chính thức:

Đề bài:
${question.title}
Prompt: ${question.prompt}

Bài làm THỰC TẾ của thí sinh (${wordCount} từ):
"""
${userEssay}
"""

QUY TẮC CHẤM ĐIỂM NGHIÊM NGẶT:
1. CHỈ trích dẫn và sửa các câu THỰC TẾ xuất hiện trong bài làm của thí sinh trong mục "grammarFixes". TUYỆT ĐỐI không đưa ra câu mẫu không có trong bài làm của thí sinh.
2. CHỈ gợi ý nâng cấp các từ ngữ THỰC TẾ thí sinh đã sử dụng trong mục "vocabularyUpgrades".
3. Tính toán điểm số chính xác dựa trên chất lượng bài làm thực tế. Phạt điểm nặng nếu chưa đạt ${question.minWords || 150} từ.

Hãy trả về duy nhất định dạng JSON theo cấu trúc:
{
  "overallScore": <ĐIỂM_OVERALL_THỰC_TẾ>,
  "bandOrLevel": "<CỤM_TỪ_ĐIỂM_VD_Band_6.0_hoặc_Level_7>",
  "summaryFeedback": "Nhận xét tổng quan bằng Tiếng Việt...",
  "criteria": [
    { "name": "Task Response / Achievement", "englishName": "Task Response", "score": <DIEM_TR>, "maxScore": ${examType === 'TOEIC' ? 5.0 : 9.0}, "comment": "Nhận xét chi tiết" },
    { "name": "Coherence and Cohesion", "englishName": "Coherence & Cohesion", "score": <DIEM_CC>, "maxScore": ${examType === 'TOEIC' ? 5.0 : 9.0}, "comment": "Nhận xét chi tiết" },
    { "name": "Lexical Resource", "englishName": "Lexical Resource", "score": <DIEM_LR>, "maxScore": ${examType === 'TOEIC' ? 5.0 : 9.0}, "comment": "Nhận xét chi tiết" },
    { "name": "Grammatical Range & Accuracy", "englishName": "Grammar", "score": <DIEM_GRA>, "maxScore": ${examType === 'TOEIC' ? 5.0 : 9.0}, "comment": "Nhận xét chi tiết" }
  ],
  "grammarFixes": [
    { "original": "câu gốc sai THỰC TẾ của thí sinh", "corrected": "câu sửa đúng", "explanation": "giải thích tiếng Việt" }
  ],
  "vocabularyUpgrades": [
    { "original": "từ đơn giản THỰC TẾ trong bài của thí sinh", "suggested": "từ học thuật nâng cao", "reason": "lý do nâng cấp" }
  ],
  "actionableAdvice": [
    "Lời khuyên 1",
    "Lời khuyên 2"
  ]
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
          wordCount,
          sampleAnswer: question.sampleAnswer,
          userEssay
        };
      }
    } catch (err) {
      console.warn('Lỗi khi gọi Gemini API cho Writing, chuyển sang OpenAI/Fallback:', err);
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
      response_format: { type: 'json_object' }
    })
  });

  if (!res.ok) return null;
  const data = await res.json();
  const parsed = JSON.parse(data.choices[0].message.content);

  return {
    ...parsed,
    wordCount,
    sampleAnswer: question.sampleAnswer,
    userEssay
  };
}
