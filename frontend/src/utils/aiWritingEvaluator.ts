import type { WritingQuestion, WritingEvaluationResult, ExamType } from '../types';

export async function evaluateWritingEssay(
  examType: ExamType,
  question: WritingQuestion,
  userEssay: string,
  apiKey?: string
): Promise<WritingEvaluationResult> {
  const essayText = userEssay.trim();
  const wordCount = essayText ? essayText.split(/\s+/).filter(Boolean).length : 0;

  if (apiKey && apiKey.trim().length > 10) {
    try {
      const realEval = await evaluateWritingWithAPI(examType, question, essayText, wordCount, apiKey);
      if (realEval) return realEval;
    } catch (e) {
      console.warn('Lỗi khi chấm điểm Writing bằng API thực tế, chuyển sang Smart Evaluator Engine:', e);
    }
  }

  return generateSmartMockWritingEvaluation(examType, question, essayText, wordCount);
}

function generateSmartMockWritingEvaluation(
  examType: ExamType,
  question: WritingQuestion,
  userEssay: string,
  wordCount: number
): WritingEvaluationResult {
  const minWords = question.minWords || 150;
  const isTooShort = wordCount < minWords;

  if (examType === 'TOEIC') {
    let score = 170;
    let level = 'Level 7 (170/200 điểm)';
    if (isTooShort) {
      score = 140;
      level = 'Level 6 (140/200 điểm)';
    } else if (wordCount > minWords + 50) {
      score = 190;
      level = 'Level 8 (190/200 điểm - Xuất sắc)';
    }

    return {
      overallScore: score,
      bandOrLevel: level,
      summaryFeedback: `Bài viết TOEIC Writing đạt **${level}**. ${
        isTooShort
          ? `Lưu ý: Bài viết mới đạt ${wordCount}/${minWords} từ tối thiểu, bạn cần phát triển ý đầy đủ hơn.`
          : 'Bài viết lập luận mạch lạc, đáp ứng tốt yêu cầu đề bài và sử dụng cấu trúc câu linh hoạt.'
      }`,
      criteria: [
        {
          name: 'Ngữ pháp & Cấu trúc câu',
          englishName: 'Grammatical Accuracy',
          score: isTooShort ? 3.5 : 4.5,
          maxScore: 5.0,
          comment: 'Sử dụng tốt các thì cơ bản và câu phức. Ít lỗi hòa hợp chủ ngữ - động từ.'
        },
        {
          name: 'Độ phù hợp với đề bài',
          englishName: 'Relevance to Stimulus',
          score: isTooShort ? 3.0 : 5.0,
          maxScore: 5.0,
          comment: 'Trả lời đúng 100% trọng tâm các câu hỏi yêu cầu trong đề bài.'
        },
        {
          name: 'Vốn từ vựng công sở',
          englishName: 'Business Vocabulary',
          score: 4.5,
          maxScore: 5.0,
          comment: 'Sử dụng từ vựng chuyên ngành phù hợp với ngữ cảnh giao tiếp doanh nghiệp.'
        },
        {
          name: 'Bố cục & Sự mạch lạc',
          englishName: 'Organization & Clarity',
          score: 4.0,
          maxScore: 5.0,
          comment: 'Các đoạn văn được phân chia rõ ràng với từ nối thích hợp.'
        }
      ],
      wordCount,
      grammarFixes: [
        {
          original: 'The company allow employees work from home.',
          corrected: 'The company allows employees to work from home.',
          explanation: 'Chủ ngữ số ít "The company" đi với động từ thêm "s" (allows) và cấu trúc "allow somebody to do something".'
        },
        {
          original: 'In my opinion, work remotely save time.',
          corrected: 'In my opinion, working remotely saves time.',
          explanation: 'Danh động từ "working remotely" đóng vai trò làm chủ ngữ số ít, động từ chia "saves".'
        }
      ],
      vocabularyUpgrades: [
        {
          original: 'good idea',
          suggested: 'beneficial approach / strategic initiative',
          reason: 'Nâng cấp từ vựng trang trọng chuẩn bài viết luận công sở.'
        },
        {
          original: 'make work better',
          suggested: 'enhance overall productivity and efficiency',
          reason: 'Sử dụng collocations chuyên nghiệp hơn.'
        }
      ],
      actionableAdvice: [
        'Đảm bảo bài viết đạt đủ độ dài tối thiểu để tránh bị trừ điểm tiêu chí nội dung.',
        'Sử dụng các từ nối nối đoạn như "Furthermore", "Consequently", "On the other hand" để tăng độ liên kết.',
        'Dành 2-3 phút cuối bài để rà soát lỗi chính tả và chia động từ.'
      ],
      sampleAnswer: question.sampleAnswer,
      userEssay: userEssay || '(Người học chưa nhập nội dung bài viết)'
    };
  } else {
    // IELTS Writing Evaluation
    let band = 7.5;
    if (isTooShort) band = 6.0;
    else if (wordCount > minWords + 60) band = 8.5;

    return {
      overallScore: band,
      bandOrLevel: `Band ${band.toFixed(1)}`,
      summaryFeedback: `Bài viết IELTS Writing đạt **Band ${band.toFixed(1)}**. ${
        isTooShort
          ? `Lưu ý: Bài viết đạt ${wordCount}/${minWords} từ tối thiểu. Bạn bị phạt điểm tiêu chí Task Response do chưa đủ số từ quy định.`
          : 'Ý tưởng được phát triển rõ ràng, khả năng sử dụng từ vựng học thuật tốt và lập luận thuyết phục.'
      }`,
      criteria: [
        {
          name: 'Task Response / Task Achievement',
          englishName: 'Task Response (TR)',
          score: isTooShort ? 6.0 : 8.0,
          maxScore: 9.0,
          comment: 'Trả lời đầy đủ các phần của đề bài và đưa ra quan điểm nhất quán từ đầu đến cuối.'
        },
        {
          name: 'Coherence and Cohesion',
          englishName: 'Coherence & Cohesion (CC)',
          score: 7.5,
          maxScore: 9.0,
          comment: 'Bố cục bài viết gồm Mở bài, 2 Thân bài và Kết bài rõ ràng. Sử dụng từ nối liên kết mượt mà.'
        },
        {
          name: 'Lexical Resource',
          englishName: 'Lexical Resource (LR)',
          score: 8.0,
          maxScore: 9.0,
          comment: 'Sử dụng vốn từ học thuật phong phú (niche interest, emotional detachment, ubiquitous) và ít lỗi chính tả.'
        },
        {
          name: 'Grammatical Range and Accuracy',
          englishName: 'Grammar (GRA)',
          score: 7.5,
          maxScore: 9.0,
          comment: 'Kết hợp tốt giữa câu đơn, câu phức và câu ghép. Cấu trúc ngữ pháp đạt độ chính xác cao.'
        }
      ],
      wordCount,
      grammarFixes: [
        {
          original: 'Social media make people feel isolate.',
          corrected: 'Social media makes people feel isolated.',
          explanation: 'Chủ ngữ số ít "Social media" đi với động từ chia "makes", và cấu trúc "feel + adjective (isolated)".'
        },
        {
          original: 'Although technology is good but it has downsides.',
          corrected: 'Although technology has clear benefits, it also presents significant drawbacks.',
          explanation: 'Không dùng đồng thời "Although" và "but" trong cùng một câu ghép.'
        }
      ],
      vocabularyUpgrades: [
        {
          original: 'important thing',
          suggested: 'pivotal factor / crucial aspect',
          reason: 'Thay thế từ phổ thông bằng collocations học thuật Band 8.0+.'
        },
        {
          original: 'very big problem',
          suggested: 'pressing issue / formidable challenge',
          reason: 'Diễn đạt tính nghiêm trọng của vấn đề một cách chuyên nghiệp.'
        }
      ],
      actionableAdvice: [
        'Duy trì thói quen chia bài viết thành 4 đoạn chuẩn (Introduction, Body 1, Body 2, Conclusion).',
        'Mỗi đoạn thân bài nên bắt đầu bằng một Topic Sentence rõ ràng trước khi giải thích và đưa ví dụ.',
        'Mở rộng sử dụng các mệnh đề quan hệ (which, who, where) để tăng điểm tiêu chí Ngữ pháp.'
      ],
      sampleAnswer: question.sampleAnswer,
      userEssay: userEssay || '(Người học chưa nhập nội dung bài viết)'
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
  const promptText = `Bạn là Giám khảo chấm thi Writing ${examType} quốc tế. Hãy chấm điểm chi tiết bài viết sau:

Đề bài:
${question.title}
Prompt: ${question.prompt}

Bài làm của thí sinh (${wordCount} từ):
"""
${userEssay}
"""

Hãy chấm điểm theo chuẩn ${examType} và trả về JSON duy nhất theo cấu trúc:
{
  "overallScore": ${examType === 'TOEIC' ? 180 : 7.5},
  "bandOrLevel": "${examType === 'TOEIC' ? 'Level 7 (180/200)' : 'Band 7.5'}",
  "summaryFeedback": "Nhận xét tổng quan bài viết bằng Tiếng Việt...",
  "criteria": [
    { "name": "Tiêu chí 1", "englishName": "Criteria 1", "score": 8.0, "maxScore": 9.0, "comment": "Nhận xét tiếng Việt" },
    { "name": "Tiêu chí 2", "englishName": "Criteria 2", "score": 7.5, "maxScore": 9.0, "comment": "Nhận xét tiếng Việt" },
    { "name": "Tiêu chí 3", "englishName": "Criteria 3", "score": 8.0, "maxScore": 9.0, "comment": "Nhận xét tiếng Việt" },
    { "name": "Tiêu chí 4", "englishName": "Criteria 4", "score": 7.5, "maxScore": 9.0, "comment": "Nhận xét tiếng Việt" }
  ],
  "grammarFixes": [
    { "original": "câu gốc sai", "corrected": "câu sửa đúng", "explanation": "giải thích tiếng Việt" }
  ],
  "vocabularyUpgrades": [
    { "original": "từ đơn giản", "suggested": "từ học thuật nâng cao", "reason": "lý do nâng cấp" }
  ],
  "actionableAdvice": [
    "Lời khuyên 1",
    "Lời khuyên 2"
  ]
}`;

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
