import type { Question, ExamType } from '../types';

export async function generateAIQuestion(
  examType: ExamType,
  part: number,
  topicKeyword?: string,
  targetBandOrLevel?: string,
  userApiKey?: string
): Promise<Question> {
  const topic = topicKeyword?.trim() || getRandomTopic(examType);

  // Nếu user nhập OpenAI / Gemini API Key
  if (userApiKey && userApiKey.trim().length > 10) {
    try {
      const realAiQ = await generateWithAPI(examType, part, topic, userApiKey);
      if (realAiQ) return realAiQ;
    } catch (e) {
      console.warn('Lỗi khi gọi API thực tế để tạo đề thi, chuyển sang Smart AI Generator:', e);
    }
  }

  // AI Generator Engine thông minh tích hợp
  return generateSmartMockQuestion(examType, part, topic, targetBandOrLevel);
}

function getRandomTopic(examType: ExamType): string {
  const toeicTopics = [
    'Corporate Communication & Email Etiquette',
    'Sustainable Office Energy & Recycling',
    'Customer Service Experience in Retail',
    'Artificial Intelligence in Modern Workplace',
    'International Business Travel & Hospitality'
  ];
  const ieltsTopics = [
    'Impact of Social Media on Young Generation',
    'Urbanization and Sustainable City Living',
    'The Role of Traditional Culture in Modern Society',
    'Artificial Intelligence & The Future of Higher Education',
    'Preserving Biodiversity and National Parks'
  ];
  const pool = examType === 'TOEIC' ? toeicTopics : ieltsTopics;
  return pool[Math.floor(Math.random() * pool.length)];
}

function generateSmartMockQuestion(
  examType: ExamType,
  part: number,
  topic: string,
  targetBandOrLevel?: string
): Question {
  const timestamp = Date.now();

  if (examType === 'TOEIC') {
    if (part === 1) {
      return {
        id: `ai-toeic-p1-${timestamp}`,
        examType: 'TOEIC',
        part: 1,
        partTitle: 'Part 1: Read a Text Aloud (2 đoạn văn)',
        title: `Đọc 2 đoạn văn về chủ đề ${topic}`,
        prompt: `Part 1 gồm 2 đoạn văn (Câu 1 và Câu 2). Bạn có 45s chuẩn bị và 45s đọc thành tiếng từng đoạn:`,
        subQuestions: [
          `Đoạn 1 (Câu 1/2): Welcome to our annual company conference regarding ${topic}. Please be reminded that registration begins promptly at eight-thirty AM in the main foyer. All participants are requested to collect their official badges at the front desk.`,
          `Đoạn 2 (Câu 2/2): Thank you for choosing NovaTech solutions for your daily operations. Our modern tools for ${topic} feature advanced real-time monitoring and seamless cloud integration. Visit our website today to claim an exclusive 20% discount on early renewals!`
        ],
        prepTimeSeconds: 45,
        responseTimeSeconds: 45,
        sampleBand: targetBandOrLevel || 'Level 8 (190-200)',
        sampleAnswer: `Paragraph 1: Welcome to our annual company conference... Paragraph 2: Thank you for choosing NovaTech solutions...`,
        vocabularyTips: [
          { word: 'promptly', ipa: '/ˈprɒmpt.li/', meaning: 'Đúng giờ' },
          { word: 'seamless', ipa: '/ˈsiːm.ləs/', meaning: 'Mượt mà, liền mạch' }
        ]
      };
    } else if (part === 2) {
      return {
        id: `ai-toeic-p2-${timestamp}`,
        examType: 'TOEIC',
        part: 2,
        partTitle: 'Part 2: Describe a Picture (2 bức tranh)',
        title: `Miêu tả 2 bức tranh liên quan đến ${topic}`,
        imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
        prompt: `Part 2 gồm 2 bức tranh (Câu 3 và Câu 4). Bạn có 45s chuẩn bị và 45s mô tả chi tiết từng bức tranh:`,
        subQuestions: [
          `Bức tranh 1 (Câu 3/4 - Trong văn phòng): Mô tả một nhóm nhân viên đang thảo luận chiến lược về ${topic} quanh bàn làm việc. Chú ý thái độ, cử chỉ và trang phục của họ.`,
          `Bức tranh 2 (Câu 4/4 - Sự kiện công ty): Mô tả khung cảnh hội thảo ngoài trời liên quan đến ${topic}. Chú ý diễn giả trên sân khấu và khán giả bên dưới.`
        ],
        prepTimeSeconds: 45,
        responseTimeSeconds: 45,
        sampleBand: targetBandOrLevel || 'Level 7-8',
        sampleAnswer: `Picture 1: In this picture, a team of energetic professionals is collaborating around a wooden table regarding ${topic}... Picture 2: The second photo depicts an outdoor seminar with a speaker presenting on stage...`,
        vocabularyTips: [
          { word: 'collaborating', ipa: '/kəˈlæb.ə.reɪt.ɪŋ/', meaning: 'Cùng hợp tác' },
          { word: 'fostering', ipa: '/ˈfɒs.tər.ɪŋ/', meaning: 'Thúc đẩy, tạo nên' }
        ]
      };
    } else if (part === 3) {
      return {
        id: `ai-toeic-p3-${timestamp}`,
        examType: 'TOEIC',
        part: 3,
        partTitle: 'Part 3: Respond to Questions (3 câu hỏi)',
        title: `Phỏng vấn nghiên cứu thị trường về ${topic}`,
        prompt: `Imagine a market research company is interviewing you about "${topic}":`,
        subQuestions: [
          `Question 1 (15s): How often do you engage in activities related to ${topic}?`,
          `Question 2 (15s): What is the most important factor when choosing services for ${topic}?`,
          `Question 3 (30s): Would you recommend investing more time in ${topic} for young workers? Why or why not?`
        ],
        prepTimeSeconds: 15,
        responseTimeSeconds: 30,
        sampleBand: targetBandOrLevel || 'Level 8 (190-200)',
        sampleAnswer: `I engage in activities related to ${topic} almost daily. The most important factor for me is cost efficiency and reliability. Finally, I would strongly recommend young professionals to invest time in this area because it enhances productivity.`,
        vocabularyTips: [
          { word: 'efficiency', ipa: '/ɪˈfɪʃ.ən.si/', meaning: 'Hiệu quả' },
          { word: 'reliability', ipa: '/rɪˌlaɪ.əˈbɪl.ə.ti/', meaning: 'Sự tin cậy' }
        ]
      };
    } else if (part === 4) {
      return {
        id: `ai-toeic-p4-${timestamp}`,
        examType: 'TOEIC',
        part: 4,
        partTitle: 'Part 4: Respond using Info Provided (3 câu hỏi dựa trên lịch trình)',
        title: `Trả lời 3 câu hỏi dựa trên lịch trình hội thảo về ${topic}`,
        prompt: `**Schedule: Annual Corporate Workshop on ${topic}**
Location: Central Grand Hotel | Date: November 20, 2026

• 09:00 AM - 10:00 AM: Opening Presentation by Chief Director (Auditorium A)
• 10:30 AM - 12:00 PM: Practical Workshop on ${topic} Integration (Room 302) - Fee: $30
• 01:30 PM - 03:00 PM: Panel Discussion: Future Trends in ${topic} (Main Hall)`,
        subQuestions: [
          `Question 1 (15s): Hello, could you tell me who is giving the opening presentation at 9:00 AM?`,
          `Question 2 (15s): I heard the morning workshop on ${topic} is free. Is that correct?`,
          `Question 3 (30s): Could you please give me all details about the afternoon sessions after lunch?`
        ],
        prepTimeSeconds: 45,
        responseTimeSeconds: 30,
        sampleBand: targetBandOrLevel || 'Level 8 (190-200)',
        sampleAnswer: `The opening presentation at 9:00 AM will be given by the Chief Director in Auditorium A. Secondly, no, the workshop costs $30 to join. Finally, in the afternoon starting from 1:30 PM, there is a panel discussion on Future Trends in ${topic} in the Main Hall.`,
        vocabularyTips: [
          { word: 'presentation', ipa: '/ˌprez.ənˈteɪ.ʃən/', meaning: 'Bài thuyết trình' },
          { word: 'auditorium', ipa: '/ˌɔː.dɪˈtɔː.ri.əm/', meaning: 'Hội trường' }
        ]
      };
    } else {
      return {
        id: `ai-toeic-p5-${timestamp}`,
        examType: 'TOEIC',
        part: 5,
        partTitle: 'Part 5: Express an Opinion (Trình bày quan điểm 60s)',
        title: `Quan điểm cá nhân về ${topic}`,
        prompt: `Some experts argue that ${topic} should be mandatory for all modern enterprises, while others believe companies should focus solely on short-term profits. Which perspective do you agree with, and why? Support your opinion with specific reasons.`,
        prepTimeSeconds: 45,
        responseTimeSeconds: 60,
        sampleBand: targetBandOrLevel || 'Level 8 (190-200)',
        sampleAnswer: `I firmly believe that embracing ${topic} is essential for long-term corporate success. First, it boosts employee satisfaction and brand reputation. Second, it drives sustainable growth. Therefore, companies that prioritize this area will gain a competitive edge in the market.`,
        vocabularyTips: [
          { word: 'mandatory', ipa: '/ˈmæn.də.tər.i/', meaning: 'Bắt buộc' },
          { word: 'competitive edge', ipa: '/kəmˈpet.ɪ.tɪv edʒ/', meaning: 'Lợi thế cạnh tranh' }
        ]
      };
    }
  } else {
    // IELTS AI Generation
    if (part === 1) {
      return {
        id: `ai-ielts-p1-${timestamp}`,
        examType: 'IELTS',
        part: 1,
        partTitle: 'Part 1: Introduction & Interview (4 câu hỏi phỏng vấn)',
        title: `Phỏng vấn chủ đề ${topic}`,
        prompt: `The examiner will ask you 4 general questions about "${topic}":`,
        subQuestions: [
          `Question 1: Is ${topic} popular in your country?`,
          `Question 2: How has people's attitude toward ${topic} changed over the last decade?`,
          `Question 3: Do you think ${topic} will play a bigger role in the future?`,
          `Question 4: What personal benefits do you get from engaging with ${topic}?`
        ],
        prepTimeSeconds: 15,
        responseTimeSeconds: 60,
        sampleBand: targetBandOrLevel || 'Band 8.0',
        sampleAnswer: `Yes, ${topic} is immensely popular in my country, especially among urban residents. Over the last decade, people have become far more conscious of its benefits due to widespread media coverage. Looking ahead, I am convinced that ${topic} will continue to dominate modern conversations. Personally, it helps me expand my perspectives.`,
        vocabularyTips: [
          { word: 'immensely', ipa: '/ɪˈmens.li/', meaning: 'Cực kỳ, vô cùng' },
          { word: 'conscious', ipa: '/ˈkɒn.ʃəs/', meaning: 'Nhận thức được' }
        ]
      };
    } else if (part === 2) {
      return {
        id: `ai-ielts-p2-${timestamp}`,
        examType: 'IELTS',
        part: 2,
        partTitle: 'Part 2: Cue Card 2 phút (Bài nói cá nhân)',
        title: `Describe a memorable experience related to ${topic}`,
        prompt: `**Describe a memorable experience or event involving ${topic}.**

You should say:
- What the experience was and when it took place
- Who was involved with you
- What happened during the event
- And explain why this experience regarding ${topic} was so memorable to you.`,
        prepTimeSeconds: 60,
        responseTimeSeconds: 120,
        sampleBand: targetBandOrLevel || 'Band 8.5',
        sampleAnswer: `I would like to talk about a memorable experience involving ${topic} that occurred about two years ago. I participated in an international seminar focused on this exact subject alongside my university peers. The workshop provided profound insights and sparked my interest in pursuing further research. It was a transformative moment that reshaped my academic goals.`,
        vocabularyTips: [
          { word: 'profound insights', ipa: '/prəˈfaʊnd ˈɪn.saɪts/', meaning: 'Góc nhìn sâu sắc' },
          { word: 'transformative', ipa: '/trænsˈfɔː.mə.tɪv/', meaning: 'Mang tính thay đổi hoàn toàn' }
        ]
      };
    } else {
      return {
        id: `ai-ielts-p3-${timestamp}`,
        examType: 'IELTS',
        part: 3,
        partTitle: 'Part 3: Two-way Discussion (4 câu thảo luận sâu)',
        title: `Thảo luận chuyên sâu về ${topic}`,
        prompt: `4 Deep-dive analytical discussion questions on "${topic}":`,
        subQuestions: [
          `Question 1: What are the main social or economic challenges associated with ${topic}?`,
          `Question 2: How can governments balance technological progress in ${topic} with ethical concerns?`,
          `Question 3: Will future generations view ${topic} differently than we do today?`,
          `Question 4: What effective policy changes should be implemented to address challenges in ${topic}?`
        ],
        prepTimeSeconds: 30,
        responseTimeSeconds: 90,
        sampleBand: targetBandOrLevel || 'Band 8.5',
        sampleAnswer: `The main challenge regarding ${topic} lies in ensuring equitable access across different social strata. Governments must establish transparent ethical guidelines to prevent misuse while fostering innovation. In the future, younger generations will likely take these technological advancements for granted as an integral part of daily life.`,
        vocabularyTips: [
          { word: 'equitable access', ipa: '/ˈek.wɪ.tə.bəl ˈæk.ses/', meaning: 'Quyền truy cập bình đẳng' },
          { word: 'integral', ipa: '/ˈɪn.tɪ.ɡrəl/', meaning: 'Không thể thiếu, gắn liền' }
        ]
      };
    }
  }
}

async function generateWithAPI(
  examType: ExamType,
  part: number,
  topic: string,
  apiKey: string
): Promise<Question | null> {
  const promptText = `Bạn là Giám khảo ra đề thi Speaking ${examType}. Hãy tạo 1 câu hỏi đề thi mới thuộc Part ${part} về chủ đề "${topic}".

Trả về định dạng JSON duy nhất:
{
  "title": "Tiêu đề câu hỏi Tiếng Việt",
  "partTitle": "Part ${part}: Tên Part",
  "prompt": "Nội dung câu hỏi tiếng Anh hoàn chỉnh",
  "prepTimeSeconds": ${examType === 'TOEIC' ? 45 : 60},
  "responseTimeSeconds": ${examType === 'TOEIC' ? 45 : 120},
  "sampleBand": "Band 8.0",
  "sampleAnswer": "Bài trả lời mẫu Band cao bằng Tiếng Anh",
  "vocabularyTips": [
    { "word": "từ mới", "ipa": "/IPA/", "meaning": "nghĩa tiếng Việt" }
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
    id: `ai-generated-${Date.now()}`,
    examType,
    part,
    ...parsed
  };
}
