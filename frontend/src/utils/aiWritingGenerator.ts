import type { WritingQuestion, ExamType } from '../types';

export async function generateAIWritingQuestion(
  examType: ExamType,
  part: number,
  topicKeyword?: string,
  targetBandOrLevel?: string,
  userApiKey?: string,
  ieltsSubtype?: 'academic' | 'general'
): Promise<WritingQuestion> {
  const topic = topicKeyword?.trim() || getRandomWritingTopic(examType, part, ieltsSubtype);

  if (userApiKey && userApiKey.trim().length > 10) {
    try {
      const realAiQ = await generateWritingWithAPI(examType, part, topic, userApiKey, ieltsSubtype);
      if (realAiQ) return realAiQ;
    } catch (e) {
      console.warn('Lỗi khi gọi API thực tế để tạo đề thi Writing, chuyển sang Smart Generator:', e);
    }
  }

  return generateSmartMockWritingQuestion(examType, part, topic, targetBandOrLevel, ieltsSubtype);
}

function getRandomWritingTopic(examType: ExamType, part?: number, ieltsSubtype?: 'academic' | 'general'): string {
  const toeicTopics = [
    'Customer Feedback & Complaint Handling',
    'Office Energy Efficiency & Sustainability',
    'Employee Work-Life Balance & Wellness',
    'Corporate Software Integration',
    'Logistics & Inventory Management'
  ];
  const ieltsAcademicTopics = [
    'Global Energy Consumption Trends',
    'Urbanization and Population Movement',
    'Higher Education Graduation Rates',
    'Public Transport Usage Across Cities',
    'Export and Import Statistics of Tech Devices'
  ];
  const ieltsGeneralTopics = [
    'Noise Complaint to Apartment Landlord',
    'Request for Extended Sick Leave to Manager',
    'Inquiring About Course Enrollment at a Local College',
    'Letter of Apology to a Friend for Missing a Reunion',
    'Feedback to Airport Management Regarding Lost Luggage'
  ];
  const ieltsEssayTopics = [
    'Impact of Social Media on Youth Isolation',
    'Government Funding for Space Exploration vs Public Health',
    'The Shift Toward E-commerce and Retail Decline',
    'Artificial Intelligence and Future Employment Rights',
    'Preserving Cultural Heritage in Modern Urbanization'
  ];

  if (examType === 'TOEIC') {
    return toeicTopics[Math.floor(Math.random() * toeicTopics.length)];
  }

  if (part === 1) {
    if (ieltsSubtype === 'general') {
      return ieltsGeneralTopics[Math.floor(Math.random() * ieltsGeneralTopics.length)];
    }
    return ieltsAcademicTopics[Math.floor(Math.random() * ieltsAcademicTopics.length)];
  }

  return ieltsEssayTopics[Math.floor(Math.random() * ieltsEssayTopics.length)];
}

function generateSmartMockWritingQuestion(
  examType: ExamType,
  part: number,
  topic: string,
  targetBandOrLevel?: string,
  ieltsSubtype?: 'academic' | 'general'
): WritingQuestion {
  const timestamp = Date.now();

  if (examType === 'TOEIC') {
    if (part === 1) {
      return {
        id: `ai-toeic-w-p1-${timestamp}`,
        examType: 'TOEIC',
        part: 1,
        partTitle: 'Part 1: Write a Sentence Based on a Picture (Viết câu từ bức tranh)',
        title: `Mô tả bức tranh về chủ đề ${topic}`,
        imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
        prompt: `Viết 1 câu hoàn chỉnh bằng tiếng Anh mô tả bức tranh liên quan đến "${topic}", sử dụng chính xác 2 từ gợi ý:`,
        givenWords: ['collaborate', 'solution'],
        minWords: 8,
        timeLimitMinutes: 3,
        sampleBand: targetBandOrLevel || 'Score 5/5',
        sampleAnswer: `The software developers are collaborating at the table to find an innovative solution for ${topic}.`,
        vocabularyTips: [
          { word: 'collaborating', meaning: 'Cùng hợp tác' },
          { word: 'innovative', meaning: 'Mang tính đổi mới' }
        ]
      };
    } else if (part === 2) {
      return {
        id: `ai-toeic-w-p2-${timestamp}`,
        examType: 'TOEIC',
        part: 2,
        partTitle: 'Part 2: Respond to a Written Request (Trả lời Email)',
        title: `Trả lời Email yêu cầu giải quyết về ${topic}`,
        prompt: `**Read the email below regarding ${topic}:**

From: Laura Vance <lvance@globalcorp.com>
To: Service Desk <support@enterprisesolutions.com>
Subject: Request for Urgent Clarification on ${topic}

Dear Team,
Our regional managers held a conference yesterday to review our current policy on ${topic}. We noticed several inconsistencies in the latest documentation.
Could you please clarify the main policy guidelines and confirm when an updated manual will be distributed to all departments?

Best regards,
Laura Vance

---
**Directions**: Respond to the email. In your email, address **TWO** items:
1. Explain the current guidelines regarding ${topic}.
2. Provide a timeline for the distribution of the updated manual.`,
        minWords: 80,
        timeLimitMinutes: 20,
        sampleBand: targetBandOrLevel || 'Level 8 (190-200)',
        sampleAnswer: `Dear Ms. Vance,

Thank you for reaching out regarding our guidelines on ${topic}.

First, our current policy mandates that all regional offices align their quarterly reports with our standard compliance framework. Second, our team is currently finalizing the revised documentation, and the updated manual will be distributed via email to all department heads next Monday by 9:00 AM.

Please let me know if you require further assistance.

Best regards,
Customer Support Team`,
        vocabularyTips: [
          { word: 'mandates', meaning: 'Quy định bắt buộc' },
          { word: 'compliance', meaning: 'Sự tuân thủ' }
        ]
      };
    } else {
      return {
        id: `ai-toeic-w-p3-${timestamp}`,
        examType: 'TOEIC',
        part: 3,
        partTitle: 'Part 3: Write an Opinion Essay (Bài luận quan điểm)',
        title: `Quan điểm cá nhân về ${topic}`,
        prompt: `**Read the prompt below. You have 30 minutes to write your essay:**

Some corporate leaders believe that prioritizing ${topic} is essential for company survival in the modern market, while others think businesses should focus exclusively on immediate revenue. 

Which viewpoint do you agree with, and why? Support your position with clear reasons and concrete examples. *(Minimum 300 words)*`,
        minWords: 300,
        timeLimitMinutes: 30,
        sampleBand: targetBandOrLevel || 'Level 8 (190-200)',
        sampleAnswer: `In today's dynamic global marketplace, the question of whether enterprises should invest heavily in ${topic} or focus solely on short-term profits has sparked widespread debate. I firmly advocate for the perspective that prioritizing ${topic} is fundamental to long-term commercial sustainability and competitive advantage.

First and foremost, investing in ${topic} fosters brand loyalty and customer trust. Modern consumers are increasingly conscious of corporate ethics and operational efficiency. When a firm demonstrates a genuine commitment to ${topic}, it differentiates itself from competitors, attracting discerning clients who value sustainable practices over quick gains.

Secondly, prioritizing this domain boosts internal workforce morale and talent retention. High-performing professionals prefer working for forward-thinking organizations that value long-term strategy over temporary financial spikes.

In conclusion, strategic investment in ${topic} provides the foundation for resilient business growth and market leadership.`,
        vocabularyTips: [
          { word: 'sustainability', meaning: 'Sự phát triển bền vững' },
          { word: 'discerning', meaning: 'Sáng suốt, nhạy bén' }
        ]
      };
    }
  } else {
    // IELTS AI Generation
    if (part === 1) {
      if (ieltsSubtype === 'general') {
        return {
          id: `ai-ielts-w-t1-gt-${timestamp}`,
          examType: 'IELTS',
          part: 1,
          ieltsSubtype: 'general',
          partTitle: 'Task 1 (General Training): Letter Writing (Viết thư - Min 150 words)',
          title: `Viết thư về chủ đề: ${topic}`,
          prompt: `**You recently encountered a situation regarding "${topic}". Write a letter to express your thoughts and request appropriate action.**\n\nIn your letter:\n- Explain the background of the situation regarding ${topic}.\n- Describe how it has affected your daily work or personal schedule.\n- Suggest 2 specific solutions or next steps you would like to see taken.\n\n*(Write at least 150 words. Recommended time: 20 minutes. Begin your letter as follows: "Dear Sir or Madam,")*`,
          minWords: 150,
          timeLimitMinutes: 20,
          sampleBand: targetBandOrLevel || 'Band 8.0',
          sampleAnswer: `Dear Sir or Madam,\n\nI am writing this letter to bring to your urgent attention a matter regarding ${topic} that occurred recently.\n\nFirst, I would like to explain that this situation has caused significant disruption to my daily routine. It has resulted in unexpected delays and inconvenience for everyone involved. To remedy this issue, I strongly suggest that your management review the current procedures and implement clearer guidelines immediately.\n\nSecondly, establishing a direct point of contact for follow-up inquiries would greatly help prevent similar occurrences in the future.\n\nThank you for your prompt attention to this matter. I look forward to hearing from you soon.\n\nYours faithfully,\nAlex Morgan`,
          vocabularyTips: [
            { word: 'bring to your attention', meaning: 'Thu hút sự chú ý của bạn tới vấn đề' },
            { word: 'disruption', meaning: 'Sự gián đoạn, phiền phức' },
            { word: 'remedy this issue', meaning: 'Khắc phục sự cố này' },
            { word: 'prompt attention', meaning: 'Sự quan tâm xử lý kịp thời' }
          ]
        };
      }

      return {
        id: `ai-ielts-w-t1-acad-${timestamp}`,
        examType: 'IELTS',
        part: 1,
        ieltsSubtype: 'academic',
        partTitle: 'Task 1 (Academic): Report Writing (Mô tả dữ liệu / Sơ đồ - Min 150 words)',
        title: `Mô tả biểu đồ liên quan đến ${topic}`,
        prompt: `**The chart illustrates trends and statistics regarding ${topic} across major economies from 2015 to 2025.**

📊 **Data Summary (Bảng số liệu chi tiết - Đơn vị: Billion USD):**
- **China**: 2015 ($150B) | 2020 ($230B) | 2025 ($340B)
- **United States**: 2015 ($120B) | 2020 ($165B) | 2025 ($210B)
- **European Union**: 2015 ($95B) | 2020 ($110B) | 2025 ($135B)
- **Japan**: 2015 ($80B) | 2020 ($75B) | 2025 ($70B)

Summarise the information by selecting and reporting the main features, and make comparisons where relevant. *(Write at least 150 words. Recommended time: 20 minutes)*`,
        chartData: {
          chartTitle: `Statistical Trends of ${topic} (2015 - 2025)`,
          chartType: 'bar',
          unit: 'Billion USD',
          categories: ['2015', '2020', '2025 (Projected)'],
          series: [
            { name: 'China', color: '#06b6d4', values: [150, 230, 340] },
            { name: 'United States', color: '#8b5cf6', values: [120, 165, 210] },
            { name: 'European Union', color: '#10b981', values: [95, 110, 135] },
            { name: 'Japan', color: '#f59e0b', values: [80, 75, 70] }
          ]
        },
        minWords: 150,
        timeLimitMinutes: 20,
        sampleBand: targetBandOrLevel || 'Band 8.0',
        sampleAnswer: `The bar graph compares statistical data concerning ${topic} across four developed nations over a ten-year period between 2015 and 2025.\n\nOverall, it is evident that all measured countries witnessed a consistent upward trend in relation to ${topic}, with the most pronounced increase recorded in Nation A.\n\nIn 2015, Nation A held the highest initial figure at 40%, followed by Nation B at 30%. By 2025, figures for Nation A are projected to peak at 65%, maintaining its leading position.`,
        vocabularyTips: [
          { word: 'pronounced', meaning: 'Rõ rệt, đáng chú ý' },
          { word: 'projected', meaning: 'Dự báo' }
        ]
      };
    } else {
      return {
        id: `ai-ielts-w-t2-${timestamp}`,
        examType: 'IELTS',
        part: 2,
        partTitle: 'Task 2: Essay Writing (Bài luận phân tích - Min 250 words)',
        title: `Bài luận phân tích quan điểm về ${topic}`,
        prompt: `**Write about the following topic:**\n\n*Some people argue that government intervention is mandatory to address ${topic}, while others believe individual personal choices play a far more vital role.*\n\nDiscuss both views and give your own opinion. *(Write at least 250 words. Recommended time: 40 minutes)*`,
        minWords: 250,
        timeLimitMinutes: 40,
        sampleBand: targetBandOrLevel || 'Band 8.5',
        sampleAnswer: `The debate concerning whether state regulation or individual accountability holds greater efficacy in resolving issues surrounding ${topic} remains a subject of intense discussion. This essay will examine both perspectives before arguing that a synergistic approach combining policy enforcement with personal responsibility yields the most effective results.\n\nOn the one hand, proponents of state intervention emphasize the necessity of systemic regulation. Governments possess the authority and fiscal resources required to institute mandatory laws and infrastructure projects concerning ${topic}.\n\nOn the other hand, advocates of personal responsibility argue that lasting change depends on individual commitment and daily habit modifications.\n\nIn conclusion, while legal regulations set essential baseline standards, personal choices determine overall success. Therefore, joint efforts between state entities and citizens are imperative.`,
        vocabularyTips: [
          { word: 'synergistic', meaning: 'Mang tính đồng ứng, kết hợp' },
          { word: 'efficacy', meaning: 'Tính hiệu quả' },
          { word: 'imperative', meaning: 'Cấp thiết, bắt buộc' }
        ]
      };
    }
  }
}

async function generateWritingWithAPI(
  examType: ExamType,
  part: number,
  topic: string,
  apiKey: string,
  ieltsSubtype?: 'academic' | 'general'
): Promise<WritingQuestion | null> {
  const taskDesc = examType === 'IELTS'
    ? (part === 1
        ? (ieltsSubtype === 'general' ? 'Task 1 General Training (Viết thư 150 từ)' : 'Task 1 Academic (Mô tả biểu đồ / sơ đồ 150 từ)')
        : 'Task 2 Essay Writing (250 từ)')
    : `Part ${part}`;

  const promptText = `Bạn là Giám khảo ra đề thi Writing ${examType}. Hãy tạo 1 câu hỏi đề thi mới thuộc ${taskDesc} về chủ đề "${topic}".

Trả về định dạng JSON duy nhất:
{
  "title": "Tiêu đề câu hỏi Tiếng Việt",
  "partTitle": "${examType} Writing ${taskDesc}",
  "prompt": "Nội dung đề thi tiếng Anh hoàn chỉnh",
  "givenWords": ["word1", "word2"],
  "minWords": ${examType === 'TOEIC' ? (part === 3 ? 300 : 80) : (part === 1 ? 150 : 250)},
  "timeLimitMinutes": ${examType === 'TOEIC' ? (part === 3 ? 30 : 20) : (part === 1 ? 20 : 40)},
  "sampleBand": "Band 8.5 / Level 8",
  "sampleAnswer": "Bài viết mẫu hoàn chỉnh bằng Tiếng Anh",
  "vocabularyTips": [
    { "word": "từ mới", "meaning": "nghĩa tiếng Việt" }
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
    id: `ai-writing-${Date.now()}`,
    examType,
    part,
    ieltsSubtype,
    ...parsed
  };
}

