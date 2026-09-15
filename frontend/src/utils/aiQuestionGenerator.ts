import type { Question, ExamType } from '../types';

export async function generateAIQuestion(
  examType: ExamType,
  part: number,
  topicKeyword?: string,
  targetBandOrLevel?: string,
  userApiKey?: string
): Promise<Question> {
  const topic = topicKeyword?.trim() || getRandomTopic(examType);

  if (userApiKey && userApiKey.trim().length > 10) {
    try {
      const realAiQ = await generateWithAPI(examType, part, topic, userApiKey);
      if (realAiQ) return realAiQ;
    } catch (e) {
      console.warn('Lỗi khi gọi API thực tế để tạo đề thi, chuyển sang Smart AI Generator:', e);
    }
  }

  return generateDynamicSpeakingQuestion(examType, part, topic, targetBandOrLevel);
}

function getRandomTopic(examType: ExamType): string {
  const toeicTopics = [
    'Corporate Communication & Email Etiquette',
    'Sustainable Office Energy & Recycling',
    'Customer Service Experience in Retail',
    'Artificial Intelligence in Modern Workplace',
    'International Business Travel & Hospitality',
    'Employee Health, Safety & Wellness',
    'Logistics, Supply Chain & Inventory Control',
    'Financial Auditing & Quarterly Budgeting',
    'Digital Marketing & Social Media Strategy',
    'Remote Team Collaboration & Hybrid Work',
    'Project Management & Milestone Deadlines',
    'Staff Training & Professional Development'
  ];

  const ieltsTopics = [
    'Impact of Social Media on Young Generation',
    'Urbanization and Sustainable City Living',
    'The Role of Traditional Culture in Modern Society',
    'Artificial Intelligence & The Future of Higher Education',
    'Preserving Biodiversity and National Parks',
    'Global Tourism vs Environmental Conservation',
    'Work-Life Balance in Fast-Paced Modern Cities',
    'The Evolution of Transportation & Smart Vehicles',
    'Lifelong Learning & Adult Education',
    'Consumer Culture & E-Commerce Boom',
    'Public Healthcare Systems vs Private Care',
    'Renewable Energy Transition in Developing Nations'
  ];

  const pool = examType === 'TOEIC' ? toeicTopics : ieltsTopics;
  return pool[Math.floor(Math.random() * pool.length)];
}

// Curated image pool for TOEIC Part 2
const TOEIC_PICTURE_TEMPLATES = [
  {
    url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    title: 'Thảo luận nhóm trong văn phòng hiện đại',
    sub1: 'Bức tranh 1 (Câu 3/4 - Trong phòng họp): Mô tả nhóm đồng nghiệp trẻ đang làm việc với máy tính xách tay quanh bàn gỗ. Chú ý tư thế, đồ dùng trên bàn và biểu cảm của họ.',
    sub2: 'Bức tranh 2 (Câu 4/4 - Sự kiện công ty): Mô tả khung cảnh hội thảo doanh nghiệp với diễn giả đang trình bày báo cáo trên màn hình chiếu.',
    sample: 'Picture 1: In this picture, a group of young professionals is collaborating around a wooden table in a modern office space equipped with laptops and notebooks... Picture 2: The second photo depicts a corporate seminar where a presenter is sharing key financial metrics on a projector screen.'
  },
  {
    url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=800&q=80',
    title: 'Kỹ sư ngoài công trường xây dựng',
    sub1: 'Bức tranh 1 (Câu 3/4 - Công trường): Mô tả các kỹ sư đeo mũ bảo hiểm màu vàng và mặc áo phản quang đang xem bản thiết kế xây dựng ngoài trời.',
    sub2: 'Bức tranh 2 (Câu 4/4 - Kho hàng): Mô tả nhân viên kho đang vận hành xe nâng hàng (forklift) để xếp các kiện hàng lên kệ cao.',
    sample: 'Picture 1: In this photo, two civil engineers wearing yellow safety helmets and high-visibility vests are carefully examining blueprint diagrams spread on a metal table... Picture 2: The second image shows a warehouse worker operating a forklift truck to place heavy cardboard boxes onto high industrial shelves.'
  },
  {
    url: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=800&q=80',
    title: 'Phục vụ khách hàng tại quán cà phê & cửa hàng',
    sub1: 'Bức tranh 1 (Câu 3/4 - Quán Cafe): Mô tả quầy pha chế cà phê với barista đang rót đồ uống cho khách hàng đứng chờ ở quầy thanh toán.',
    sub2: 'Bức tranh 2 (Câu 4/4 - Cửa hàng bán lẻ): Mô tả nhân viên thu ngân đang quét mã vạch sản phẩm tại quầy tính tiền siêu thị.',
    sample: 'Picture 1: This photograph captures a cozy coffee shop setting where a skilled barista in a dark apron is crafting a latte while a customer waits at the wooden counter... Picture 2: The second photo shows a friendly cashier scanning items at a modern grocery store checkout aisle.'
  },
  {
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    title: 'Thuyết trình dự án trước đối tác',
    sub1: 'Bức tranh 1 (Câu 3/4 - Phòng hội nghị): Mô tả một người quản lý nữ đang đứng giải thích biểu đồ trên bảng trắng trước toàn thể ban giám đốc.',
    sub2: 'Bức tranh 2 (Câu 4/4 - Sảnh chờ khách sạn): Mô tả hai đối tác kinh doanh đang bắt tay nhau ở sảnh chờ sau khi ký kết hợp đồng.',
    sample: 'Picture 1: In this image, a female manager is standing near a whiteboard, confidently delivering a project presentation to her attentive team members... Picture 2: The second photograph illustrates two executives shaking hands warmly in a hotel lobby after completing a business negotiation.'
  }
];

function generateDynamicSpeakingQuestion(
  examType: ExamType,
  part: number,
  topic: string,
  targetBandOrLevel?: string
): Question {
  const timestamp = Date.now();
  const randSeed = Math.floor(Math.random() * 4);

  if (examType === 'TOEIC') {
    if (part === 1) {
      const templatesP1 = [
        {
          p1: `Attention passengers on Flight VN-452 regarding ${topic}. Please be reminded that departure gate has been moved to Gate 18B due to routine maintenance. Boarding will begin promptly at nine o'clock.`,
          p2: `Thank you for contacting NovaTech Solutions for your ${topic} needs. Our automated system is currently experiencing high call volume. Please stay on the line, and an agent will assist you shortly.`
        },
        {
          p1: `Welcome to the annual company orientation on ${topic}. All newly hired employees are required to sign in at the front desk and collect their official ID badges before entering the main hall.`,
          p2: `Good morning, staff members! Starting next Monday, our facility will initiate a new energy-saving program focusing on ${topic}. Please ensure all computers and lights are powered off before leaving.`
        },
        {
          p1: `Attention shoppers! For the next two hours only, our store is offering an exclusive 30% discount on all items related to ${topic}. Visit aisle 4 now to take advantage of these limited-time savings!`,
          p2: `This is a public service announcement regarding upcoming road repairs for ${topic}. Traffic along Metro Highway will be detoured through Exit 12 from 8:00 AM to 5:00 PM this weekend.`
        }
      ];
      const selectedT = templatesP1[randSeed % templatesP1.length];

      return {
        id: `ai-toeic-p1-${timestamp}`,
        examType: 'TOEIC',
        part: 1,
        partTitle: 'Part 1: Read a Text Aloud (2 đoạn văn)',
        title: `Đọc 2 đoạn văn thông báo về chủ đề: ${topic}`,
        prompt: `Part 1 gồm 2 đoạn văn (Câu 1 và Câu 2). Bạn có 45s chuẩn bị và 45s đọc thành tiếng từng đoạn:`,
        subQuestions: [
          `Đoạn 1 (Câu 1/2): ${selectedT.p1}`,
          `Đoạn 2 (Câu 2/2): ${selectedT.p2}`
        ],
        prepTimeSeconds: 45,
        responseTimeSeconds: 45,
        sampleBand: targetBandOrLevel || 'Level 8 (190-200)',
        sampleAnswer: `Paragraph 1: ${selectedT.p1} Paragraph 2: ${selectedT.p2}`,
        vocabularyTips: [
          { word: 'promptly', ipa: '/ˈprɒmpt.li/', meaning: 'Đúng giờ, ngay lập tức' },
          { word: 'orientation', ipa: '/ˌɔː.ri.enˈteɪ.ʃən/', meaning: 'Buổi định hướng' },
          { word: 'exclusive', ipa: '/ɪkˈskluː.sɪv/', meaning: 'Dành riêng, độc quyền' }
        ]
      };
    } else if (part === 2) {
      const picT = TOEIC_PICTURE_TEMPLATES[randSeed % TOEIC_PICTURE_TEMPLATES.length];

      return {
        id: `ai-toeic-p2-${timestamp}`,
        examType: 'TOEIC',
        part: 2,
        partTitle: 'Part 2: Describe a Picture (2 bức tranh)',
        title: `Miêu tả bức tranh: ${picT.title} (${topic})`,
        imageUrl: picT.url,
        prompt: `Part 2 gồm 2 bức tranh (Câu 3 và Câu 4). Bạn có 45s chuẩn bị và 45s mô tả chi tiết từng bức tranh:`,
        subQuestions: [
          picT.sub1,
          picT.sub2
        ],
        prepTimeSeconds: 45,
        responseTimeSeconds: 45,
        sampleBand: targetBandOrLevel || 'Level 7-8',
        sampleAnswer: picT.sample,
        vocabularyTips: [
          { word: 'collaborating', ipa: '/kəˈlæb.ə.reɪt.ɪŋ/', meaning: 'Cùng hợp tác' },
          { word: 'attentive', ipa: '/əˈten.tɪv/', meaning: 'Chăm chú lắng nghe' }
        ]
      };
    } else if (part === 3) {
      const p3Scenarios = [
        {
          context: `Imagine a market research firm is surveying you about "${topic}":`,
          q1: `Question 1 (15s): How frequently do you use services or products related to ${topic}?`,
          q2: `Question 2 (15s): What is the single most important factor when choosing a provider for ${topic}?`,
          q3: `Question 3 (30s): Would you recommend your friends or family to adopt new solutions for ${topic}? Why or why not?`
        },
        {
          context: `Imagine a business magazine reporter is interviewing you regarding your views on "${topic}":`,
          q1: `Question 1 (15s): When was the last time you participated in an activity involving ${topic}?`,
          q2: `Question 2 (15s): Where do you usually get reliable information about ${topic}?`,
          q3: `Question 3 (30s): In your opinion, what major challenges do companies face when implementing ${topic}?`
        }
      ];
      const p3S = p3Scenarios[randSeed % p3Scenarios.length];

      return {
        id: `ai-toeic-p3-${timestamp}`,
        examType: 'TOEIC',
        part: 3,
        partTitle: 'Part 3: Respond to Questions (3 câu hỏi)',
        title: `Khảo sát ý kiến về chủ đề ${topic}`,
        prompt: p3S.context,
        subQuestions: [p3S.q1, p3S.q2, p3S.q3],
        prepTimeSeconds: 15,
        responseTimeSeconds: 30,
        sampleBand: targetBandOrLevel || 'Level 8 (190-200)',
        sampleAnswer: `I engage with ${topic} on a regular basis, usually several times a week. The most essential factor for me is cost efficiency combined with high reliability. Finally, I would definitely recommend it because it significantly improves daily convenience and time management.`,
        vocabularyTips: [
          { word: 'reliability', ipa: '/rɪˌlaɪ.əˈbɪl.ə.ti/', meaning: 'Độ tin cậy' },
          { word: 'efficiency', ipa: '/ɪˈfɪʃ.ən.si/', meaning: 'Tính hiệu quả' }
        ]
      };
    } else if (part === 4) {
      const p4Schedules = [
        {
          title: `Lịch trình Hội thảo Quốc tế về ${topic}`,
          schedule: `**Schedule: Annual Global Forum on ${topic}**
Location: Grand Hyatt Hotel | Date: December 10, 2026

• 09:00 AM - 10:15 AM: Keynote Speech: "Innovations in ${topic}" by Dr. Robert Miller (Auditorium A)
• 10:45 AM - 12:00 PM: Interactive Workshop: Best Practices for ${topic} (Room 402) - Registration Fee: $35
• 01:30 PM - 03:00 PM: Panel Discussion: Future Outlook and Regulations (Main Hall)`,
          q1: `Question 1 (15s): Hello! Who will be delivering the opening keynote speech at 9:00 AM?`,
          q2: `Question 2 (15s): Is the morning workshop on ${topic} free for all registered attendees?`,
          q3: `Question 3 (30s): Could you please detail all the sessions taking place in the afternoon?`
        },
        {
          title: `Lịch công tác & Khóa đào tạo nội bộ về ${topic}`,
          schedule: `**Schedule: Internal Executive Seminar on ${topic}**
Location: Corporate Training Center | Date: November 18, 2026

• 08:30 AM - 09:30 AM: Welcome Remarks & Breakfast Networking (Cafeteria)
• 10:00 AM - 11:30 AM: Practical Session: Integrating ${topic} into Operations (Lab 2)
• 02:00 PM - 03:30 PM: Q&A Strategy Session with Senior Directors (Conference Room B)`,
          q1: `Question 1 (15s): Hi, what time does the welcome remarks and breakfast start?`,
          q2: `Question 2 (15s): I heard the practical session is held in Conference Room B. Is that correct?`,
          q3: `Question 3 (30s): Can you give me the full details of what is happening after lunch?`
        }
      ];
      const p4Item = p4Schedules[randSeed % p4Schedules.length];

      return {
        id: `ai-toeic-p4-${timestamp}`,
        examType: 'TOEIC',
        part: 4,
        partTitle: 'Part 4: Respond using Info Provided (3 câu hỏi theo lịch trình)',
        title: p4Item.title,
        prompt: p4Item.schedule,
        subQuestions: [p4Item.q1, p4Item.q2, p4Item.q3],
        prepTimeSeconds: 45,
        responseTimeSeconds: 30,
        sampleBand: targetBandOrLevel || 'Level 8 (190-200)',
        sampleAnswer: `According to the schedule, the keynote speech at 9:00 AM will be given by Dr. Robert Miller in Auditorium A. Secondly, no, the morning workshop costs $35 to attend. Finally, in the afternoon from 1:30 PM, there is a panel discussion on Future Outlook in the Main Hall.`,
        vocabularyTips: [
          { word: 'auditorium', ipa: '/ˌɔː.dɪˈtɔː.ri.əm/', meaning: 'Hội trường lớn' },
          { word: 'executive', ipa: '/ɪɡˈzek.jə.tɪv/', meaning: 'Cấp quản lý, điều hành' }
        ]
      };
    } else {
      const p5Prompts = [
        `Some corporate leaders insist that ${topic} should be compulsory for all employees, while others believe staff should have complete freedom to choose. Which perspective do you agree with, and why?`,
        `Many companies are investing heavily in ${topic} to stay competitive, whereas others prioritize reducing operational expenses. Which strategy do you think is more effective for long-term growth?`,
        `Some experts claim that implementing ${topic} improves overall productivity, while critics argue it leads to unnecessary overhead costs. What is your position on this issue?`
      ];
      const selectedP5 = p5Prompts[randSeed % p5Prompts.length];

      return {
        id: `ai-toeic-p5-${timestamp}`,
        examType: 'TOEIC',
        part: 5,
        partTitle: 'Part 5: Express an Opinion (Trình bày quan điểm 60s)',
        title: `Quan điểm cá nhân về: ${topic}`,
        prompt: `${selectedP5} Give specific reasons and examples to support your answer. *(60 seconds response)*`,
        prepTimeSeconds: 45,
        responseTimeSeconds: 60,
        sampleBand: targetBandOrLevel || 'Level 8 (190-200)',
        sampleAnswer: `I firmly believe that embracing ${topic} is crucial for corporate sustainability. Firstly, it enhances operational efficiency and boosts employee motivation. For example, companies that adopt modern standards attract top-tier talent. Secondly, it strengthens brand reputation among clients. Therefore, investing in this area yields long-term advantages.`,
        vocabularyTips: [
          { word: 'compulsory', ipa: '/kəmˈpʌl.sər.i/', meaning: 'Bắt buộc' },
          { word: 'overhead costs', ipa: '/ˈəʊ.və.hed kɒsts/', meaning: 'Chi phí vận hành cố định' },
          { word: 'sustainability', ipa: '/səˌsteɪ.nəˈbɪl.ə.ti/', meaning: 'Sự bền vững' }
        ]
      };
    }
  } else {
    // IELTS AI Generation
    if (part === 1) {
      const ieltsP1Sets = [
        {
          q1: `Is ${topic} popular among people in your country?`,
          q2: `Did you have an interest in ${topic} when you were a child?`,
          q3: `How has technological advancement influenced ${topic} in recent years?`,
          q4: `Do you think ${topic} will become more important in the future?`
        },
        {
          q1: `How often do you personally engage with or discuss ${topic}?`,
          q2: `What are some common misconceptions people have about ${topic}?`,
          q3: `Do young people and older generations view ${topic} differently in your society?`,
          q4: `Would you like to learn more about ${topic} in the near future?`
        }
      ];
      const p1Selected = ieltsP1Sets[randSeed % ieltsP1Sets.length];

      return {
        id: `ai-ielts-p1-${timestamp}`,
        examType: 'IELTS',
        part: 1,
        partTitle: 'Part 1: Introduction & Interview (4 câu hỏi phỏng vấn)',
        title: `Phỏng vấn IELTS Part 1: ${topic}`,
        prompt: `The examiner will ask you 4 general questions about "${topic}":`,
        subQuestions: [
          `Question 1: ${p1Selected.q1}`,
          `Question 2: ${p1Selected.q2}`,
          `Question 3: ${p1Selected.q3}`,
          `Question 4: ${p1Selected.q4}`
        ],
        prepTimeSeconds: 15,
        responseTimeSeconds: 60,
        sampleBand: targetBandOrLevel || 'Band 8.0',
        sampleAnswer: `Yes, ${topic} is extremely popular in my country, particularly among young adults living in major cities. Looking back, my interest in this topic grew during my high school years. Technology has transformed how we approach it, making information far more accessible. I am convinced it will play an even greater role in the future.`,
        vocabularyTips: [
          { word: 'particularly', ipa: '/pəˈtɪk.jə.lə.li/', meaning: 'Đặc biệt là' },
          { word: 'misconceptions', ipa: '/ˌmɪs.kənˈsep.ʃənz/', meaning: 'Quan niệm sai lầm' }
        ]
      };
    } else if (part === 2) {
      const p2Cards = [
        {
          prompt: `**Describe a memorable experience or project involving ${topic}.**\n\nYou should say:\n- What the event/project was and when it happened\n- Who was involved with you\n- What challenges you faced during this experience\n- And explain why this experience regarding ${topic} was so significant to you.`
        },
        {
          prompt: `**Describe a person or organization that has made a major contribution to ${topic}.**\n\nYou should say:\n- Who this person or organization is\n- What specific achievements they have accomplished\n- How you learned about their work\n- And explain how their work on ${topic} inspires you.`
        }
      ];
      const cardSelected = p2Cards[randSeed % p2Cards.length];

      return {
        id: `ai-ielts-p2-${timestamp}`,
        examType: 'IELTS',
        part: 2,
        partTitle: 'Part 2: Cue Card 2 phút (Bài nói cá nhân)',
        title: `IELTS Cue Card: Describe ${topic}`,
        prompt: cardSelected.prompt,
        prepTimeSeconds: 60,
        responseTimeSeconds: 120,
        sampleBand: targetBandOrLevel || 'Band 8.5',
        sampleAnswer: `I would like to share an insightful experience related to ${topic} that occurred about two years ago. I participated in a national conference focused on this field alongside my colleagues. The event offered valuable insights into current industry trends and challenged my existing perspectives. It served as a major turning point in my personal development.`,
        vocabularyTips: [
          { word: 'insightful', ipa: '/ˈɪn.saɪt.fəl/', meaning: 'Sâu sắc, bổ ích' },
          { word: 'turning point', ipa: '/ˈtɜː.nɪŋ pɔɪnt/', meaning: 'Bước ngoặt quan trọng' }
        ]
      };
    } else {
      const p3DeepSets = [
        {
          q1: `What are the primary economic and social implications of ${topic}?`,
          q2: `How can governments balance innovation in ${topic} with strict ethical regulations?`,
          q3: `Do you believe future generations will hold different values regarding ${topic}?`,
          q4: `What long-term policy measures should be implemented to manage challenges in ${topic}?`
        },
        {
          q1: `In what ways has global globalization impacted ${topic} across different countries?`,
          q2: `Should educational institutions integrate ${topic} into the core curriculum?`,
          q3: `What role do non-governmental organizations (NGOs) play in promoting awareness of ${topic}?`,
          q4: `How might environmental factors influence the development of ${topic} over the next decade?`
        }
      ];
      const p3Selected = p3DeepSets[randSeed % p3DeepSets.length];

      return {
        id: `ai-ielts-p3-${timestamp}`,
        examType: 'IELTS',
        part: 3,
        partTitle: 'Part 3: Two-way Discussion (4 câu thảo luận sâu)',
        title: `Thảo luận chuyên sâu IELTS Part 3: ${topic}`,
        prompt: `4 Deep-dive analytical discussion questions on "${topic}":`,
        subQuestions: [
          `Question 1: ${p3Selected.q1}`,
          `Question 2: ${p3Selected.q2}`,
          `Question 3: ${p3Selected.q3}`,
          `Question 4: ${p3Selected.q4}`
        ],
        prepTimeSeconds: 30,
        responseTimeSeconds: 90,
        sampleBand: targetBandOrLevel || 'Band 8.5',
        sampleAnswer: `The primary implication of ${topic} centers on ensuring equitable distribution of resources. Governments must formulate robust regulatory frameworks to safeguard public interest while fostering technological growth. In the coming decades, changing social norms will likely reshape how future generations engage with this issue.`,
        vocabularyTips: [
          { word: 'implications', ipa: '/ˌɪm.plɪˈkeɪ.ʃənz/', meaning: 'Tác động, hệ quả' },
          { word: 'equitable', ipa: '/ˈek.wɪ.tə.bəl/', meaning: 'Công bằng, bình đẳng' },
          { word: 'frameworks', ipa: '/ˈfreɪm.wɜːks/', meaning: 'Khuôn khổ pháp lý' }
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
  const promptText = `Bạn là Giám khảo ra đề thi Speaking ${examType} quốc tế chuyên nghiệp. Hãy tạo 1 câu hỏi đề thi hoàn toàn MỚI ĐỘC ĐÁO thuộc Part ${part} về chủ đề "${topic}".

Đảm bảo đề thi tự nhiên, từ vựng phong phú, chuẩn cấu trúc đề thi thật và mang tính phân tích cao.

Trả về duy nhất định dạng JSON theo cấu trúc:
{
  "title": "Tiêu đề câu hỏi Tiếng Việt",
  "partTitle": "${examType} Speaking Part ${part}",
  "prompt": "Nội dung câu hỏi tiếng Anh hoàn chỉnh với ngữ cảnh rõ ràng",
  "subQuestions": ["Câu hỏi phụ 1", "Câu hỏi phụ 2", "Câu hỏi phụ 3"],
  "prepTimeSeconds": ${examType === 'TOEIC' ? (part === 1 ? 45 : 30) : (part === 2 ? 60 : 15)},
  "responseTimeSeconds": ${examType === 'TOEIC' ? (part === 5 ? 60 : 45) : (part === 2 ? 120 : 60)},
  "sampleBand": "Band 8.5 / Level 8",
  "sampleAnswer": "Bài trả lời mẫu Band cao bằng Tiếng Anh dài, tự nhiên và phong phú từ vựng",
  "vocabularyTips": [
    { "word": "từ mới", "ipa": "/IPA/", "meaning": "nghĩa tiếng Việt" }
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
          id: `ai-generated-speaking-${Date.now()}`,
          examType,
          part,
          ...parsed
        };
      }
    } catch (err) {
      console.warn('Lỗi khi gọi Gemini API tạo đề thi Speaking, chuyển sang OpenAI/Fallback:', err);
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
    id: `ai-generated-speaking-${Date.now()}`,
    examType,
    part,
    ...parsed
  };
}
