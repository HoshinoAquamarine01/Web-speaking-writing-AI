import type { WritingQuestion, WritingChartData, ExamType } from '../types';

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

  return generateDynamicWritingQuestion(examType, part, topic, targetBandOrLevel, ieltsSubtype);
}

function getRandomWritingTopic(examType: ExamType, part?: number, ieltsSubtype?: 'academic' | 'general'): string {
  const toeicTopics = [
    'Customer Feedback & Complaint Handling',
    'Office Energy Efficiency & Sustainability',
    'Employee Work-Life Balance & Wellness',
    'Corporate Software Integration & Security',
    'Logistics & Inventory Management',
    'Quarterly Budget Allocation & Procurement',
    'Staff Relocation & Remote Policy',
    'Marketing Campaign & Product Launch'
  ];

  const ieltsAcademicTopics = [
    'Global Renewable Energy Trends',
    'Urbanization and Metropolitan Population Shifts',
    'Higher Education Graduation & Employment Rates',
    'Public Transport Usage Across Major Capital Cities',
    'Export Statistics of High-Tech Components',
    'Water Usage Across Agricultural, Industrial and Domestic Sectors',
    'Household Expenditure Breakdown in Developed Nations',
    'International Airline Passenger Numbers'
  ];

  const ieltsGeneralTopics = [
    'Noise Complaint to Apartment Landlord',
    'Request for Extended Sick Leave to Manager',
    'Inquiring About Course Enrollment at a Local College',
    'Letter of Apology to a Friend for Missing a Reunion',
    'Feedback to Airport Management Regarding Lost Luggage',
    'Requesting Refund for a Defective Home Appliance',
    'Applying for a Volunteer Position at a Community Center'
  ];

  const ieltsEssayTopics = [
    'Impact of Social Media on Youth Isolation',
    'Government Funding for Space Exploration vs Public Health',
    'The Shift Toward E-commerce and Retail Store Decline',
    'Artificial Intelligence and Future Employment Rights',
    'Preserving Cultural Heritage in Modern Urbanization',
    'Mandatory Physical Education in School Curricula',
    'Taxation on Sugary Foods to Combat Obesity',
    'Remote Work Impact on Family Dynamics and Productivity'
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

// Generate dynamic chart data for IELTS Task 1 Academic
function generateDynamicChartData(topic: string): WritingChartData {
  const chartTypes: ('bar' | 'line' | 'pie')[] = ['bar', 'line', 'pie'];
  const chartType = chartTypes[Math.floor(Math.random() * chartTypes.length)];

  const categoryPresets = [
    ['2010', '2015', '2020', '2025 (Projected)'],
    ['2012', '2016', '2020', '2024'],
    ['Q1', 'Q2', 'Q3', 'Q4']
  ];
  const categories = categoryPresets[Math.floor(Math.random() * categoryPresets.length)];

  const countrySets = [
    [
      { name: 'United Kingdom', color: '#06b6d4', values: [35, 48, 62, 75] },
      { name: 'Germany', color: '#8b5cf6', values: [42, 55, 68, 82] },
      { name: 'Japan', color: '#10b981', values: [50, 45, 40, 38] },
      { name: 'Australia', color: '#f59e0b', values: [20, 32, 45, 60] }
    ],
    [
      { name: 'Urban Sector', color: '#ec4899', values: [120, 180, 240, 310] },
      { name: 'Suburban Sector', color: '#3b82f6', values: [90, 110, 130, 150] },
      { name: 'Rural Sector', color: '#14b8a6', values: [60, 55, 45, 35] }
    ]
  ];

  const series = countrySets[Math.floor(Math.random() * countrySets.length)];

  return {
    chartTitle: `Statistical Analysis of ${topic}`,
    chartType,
    unit: chartType === 'pie' ? 'Percentage (%)' : 'Index / Units (in Millions)',
    categories,
    series
  };
}

function generateDynamicWritingQuestion(
  examType: ExamType,
  part: number,
  topic: string,
  targetBandOrLevel?: string,
  ieltsSubtype?: 'academic' | 'general'
): WritingQuestion {
  const timestamp = Date.now();
  const randSeed = Math.floor(Math.random() * 4);

  if (examType === 'TOEIC') {
    if (part === 1) {
      const wordPairs = [
        { words: ['collaborate', 'solution'], img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80' },
        { words: ['inspect', 'equipment'], img: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=800&q=80' },
        { words: ['deliver', 'shipment'], img: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80' },
        { words: ['present', 'proposal'], img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80' }
      ];
      const selectedPair = wordPairs[randSeed % wordPairs.length];

      return {
        id: `ai-toeic-w-p1-${timestamp}`,
        examType: 'TOEIC',
        part: 1,
        partTitle: 'Part 1: Write a Sentence Based on a Picture (Viết câu từ bức tranh)',
        title: `Mô tả bức tranh về chủ đề: ${topic}`,
        imageUrl: selectedPair.img,
        prompt: `Viết 1 câu hoàn chỉnh bằng tiếng Anh mô tả bức tranh liên quan đến "${topic}", bắt buộc sử dụng đúng 2 từ gợi ý dưới đây:`,
        givenWords: selectedPair.words,
        minWords: 8,
        timeLimitMinutes: 3,
        sampleBand: targetBandOrLevel || 'Score 5/5',
        sampleAnswer: `The team members are actively using the ${selectedPair.words[0]} process to implement a reliable ${selectedPair.words[1]} for ${topic}.`,
        vocabularyTips: [
          { word: selectedPair.words[0], meaning: 'Từ gợi ý 1' },
          { word: selectedPair.words[1], meaning: 'Từ gợi ý 2' }
        ]
      };
    } else if (part === 2) {
      const emailScenarios = [
        {
          from: 'Laura Vance <lvance@globalcorp.com>',
          subject: `Request for Urgent Clarification on ${topic}`,
          body: `Our regional managers held a meeting yesterday to review our current procedures on ${topic}. We noticed several inconsistencies in the latest documentation.\nCould you please clarify the main policy guidelines and confirm when an updated manual will be distributed to all departments?`,
          directions: [
            `1. Explain the current guidelines regarding ${topic}.`,
            `2. Provide a clear timeline for distributing the updated documentation.`
          ]
        },
        {
          from: 'Marcus Thorne <mthorne@enterprisesolutions.org>',
          subject: `Inquiry Regarding Upcoming Workshop on ${topic}`,
          body: `Our department is interested in enrolling staff in your upcoming training module on ${topic}. However, we require additional details before finalizing our budget approval.\nCould you please provide information about course pricing and available schedules for next month?`,
          directions: [
            `1. Provide pricing details and group discounts for ${topic}.`,
            `2. Outline available schedule options and enrollment deadlines.`
          ]
        }
      ];
      const emailS = emailScenarios[randSeed % emailScenarios.length];

      return {
        id: `ai-toeic-w-p2-${timestamp}`,
        examType: 'TOEIC',
        part: 2,
        partTitle: 'Part 2: Respond to a Written Request (Trả lời Email)',
        title: `Trả lời Email yêu cầu giải quyết về ${topic}`,
        prompt: `**Read the email below regarding ${topic}:**\n\nFrom: ${emailS.from}\nTo: Service Desk <support@enterprisesolutions.com>\nSubject: ${emailS.subject}\n\nDear Team,\n${emailS.body}\n\nBest regards,\nLaura Vance\n\n---\n**Directions**: Respond to the email. In your email, address **TWO** items:\n${emailS.directions[0]}\n${emailS.directions[1]}`,
        minWords: 80,
        timeLimitMinutes: 20,
        sampleBand: targetBandOrLevel || 'Level 8 (190-200)',
        sampleAnswer: `Dear Ms. Vance,\n\nThank you for reaching out regarding our guidelines on ${topic}.\n\nFirst, our current policy mandates that all regional offices align their quarterly reports with our standard compliance framework. Second, our team is finalizing the revised documentation, and the updated manual will be distributed via email to all department heads next Monday by 9:00 AM.\n\nPlease let me know if you require further assistance.\n\nBest regards,\nCustomer Support Team`,
        vocabularyTips: [
          { word: 'compliance', meaning: 'Sự tuân thủ quy định' },
          { word: 'framework', meaning: 'Khuôn khổ làm việc' }
        ]
      };
    } else {
      const p3EssayPrompts = [
        `Some corporate leaders believe that prioritizing ${topic} is essential for company survival in the modern market, while others think businesses should focus exclusively on immediate short-term profits. Which viewpoint do you agree with, and why?`,
        `In many modern organizations, management mandates regular training in ${topic} for all employees. Others argue that professional development should be optional. Discuss both views and give your opinion.`
      ];
      const selectedP3Prompt = p3EssayPrompts[randSeed % p3EssayPrompts.length];

      return {
        id: `ai-toeic-w-p3-${timestamp}`,
        examType: 'TOEIC',
        part: 3,
        partTitle: 'Part 3: Write an Opinion Essay (Bài luận quan điểm)',
        title: `Quan điểm cá nhân về: ${topic}`,
        prompt: `**Read the prompt below. You have 30 minutes to write your essay:**\n\n${selectedP3Prompt}\n\nSupport your position with clear reasons and concrete examples. *(Minimum 300 words)*`,
        minWords: 300,
        timeLimitMinutes: 30,
        sampleBand: targetBandOrLevel || 'Level 8 (190-200)',
        sampleAnswer: `In today's dynamic global marketplace, the question of whether enterprises should invest heavily in ${topic} or focus solely on short-term profits has sparked widespread debate. I firmly advocate for the perspective that prioritizing ${topic} is fundamental to long-term commercial sustainability and competitive advantage.\n\nFirst and foremost, investing in ${topic} fosters brand loyalty and customer trust. Modern consumers are increasingly conscious of corporate ethics and operational efficiency. When a firm demonstrates a genuine commitment to ${topic}, it differentiates itself from competitors.\n\nSecondly, prioritizing this domain boosts internal workforce morale and talent retention. High-performing professionals prefer working for forward-thinking organizations.\n\nIn conclusion, strategic investment in ${topic} provides the foundation for resilient business growth and market leadership.`,
        vocabularyTips: [
          { word: 'sustainability', meaning: 'Sự phát triển bền vững' },
          { word: 'competitive advantage', meaning: 'Lợi thế cạnh tranh' }
        ]
      };
    }
  } else {
    // IELTS AI Generation
    if (part === 1) {
      if (ieltsSubtype === 'general') {
        const gtLetters = [
          {
            title: `Viết thư phàn nàn / yêu cầu giải quyết về ${topic}`,
            prompt: `**You recently encountered a situation regarding "${topic}". Write a letter to the relevant authority to express your concerns.**\n\nIn your letter:\n- Explain the background of the situation regarding ${topic}.\n- Describe how it has affected your daily schedule or work.\n- Suggest 2 specific solutions or next steps you would like to see taken.\n\n*(Write at least 150 words. Recommended time: 20 minutes. Begin your letter as follows: "Dear Sir or Madam,")*`
          },
          {
            title: `Viết thư đề nghị / hỏi thông tin về ${topic}`,
            prompt: `**You are planning to participate in a program related to "${topic}". Write a letter to the organizer to request detailed information.**\n\nIn your letter:\n- Introduce yourself and state your interest in ${topic}.\n- Ask 2 specific questions regarding fees, schedules, or prerequisites.\n- Explain how this opportunity will help your personal or professional goals.\n\n*(Write at least 150 words. Recommended time: 20 minutes. Begin your letter as follows: "Dear Sir or Madam,")*`
          }
        ];
        const gtSel = gtLetters[randSeed % gtLetters.length];

        return {
          id: `ai-ielts-w-t1-gt-${timestamp}`,
          examType: 'IELTS',
          part: 1,
          ieltsSubtype: 'general',
          partTitle: 'Task 1 (General Training): Letter Writing (Viết thư - Min 150 words)',
          title: gtSel.title,
          prompt: gtSel.prompt,
          minWords: 150,
          timeLimitMinutes: 20,
          sampleBand: targetBandOrLevel || 'Band 8.0',
          sampleAnswer: `Dear Sir or Madam,\n\nI am writing this letter to bring to your urgent attention a matter regarding ${topic} that occurred recently.\n\nFirst, I would like to explain that this situation has caused significant disruption to my daily routine. It has resulted in unexpected delays and inconvenience. To remedy this issue, I strongly suggest that your management review the current procedures and implement clearer guidelines immediately.\n\nSecondly, establishing a direct point of contact for follow-up inquiries would greatly help prevent similar occurrences.\n\nThank you for your prompt attention to this matter. I look forward to hearing from you soon.\n\nYours faithfully,\nAlex Morgan`,
          vocabularyTips: [
            { word: 'bring to your attention', meaning: 'Thu hút sự chú ý tới vấn đề' },
            { word: 'remedy this issue', meaning: 'Khắc phục sự cố này' }
          ]
        };
      }

      // Academic Task 1: Generate dynamic chart
      const dynamicChart = generateDynamicChartData(topic);

      return {
        id: `ai-ielts-w-t1-acad-${timestamp}`,
        examType: 'IELTS',
        part: 1,
        ieltsSubtype: 'academic',
        partTitle: 'Task 1 (Academic): Report Writing (Mô tả dữ liệu / Sơ đồ - Min 150 words)',
        title: `Mô tả biểu đồ liên quan đến ${topic}`,
        prompt: `**The chart below illustrates trends and statistics regarding "${topic}" across different sectors/countries.**\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant. *(Write at least 150 words. Recommended time: 20 minutes)*`,
        chartData: dynamicChart,
        minWords: 150,
        timeLimitMinutes: 20,
        sampleBand: targetBandOrLevel || 'Band 8.0',
        sampleAnswer: `The ${dynamicChart.chartType} chart illustrates statistical data concerning ${topic} across various categories over the specified timeframe.\n\nOverall, it is evident that most measured sectors experienced a noticeable upward trend in relation to ${topic}, with the most pronounced increase recorded in ${dynamicChart.series[0].name}.\n\nInitially, ${dynamicChart.series[0].name} held a strong position at ${dynamicChart.series[0].values[0]} ${dynamicChart.unit}. By the final period, figures projected a peak at ${dynamicChart.series[0].values[dynamicChart.series[0].values.length - 1]} ${dynamicChart.unit}, maintaining its dominant status.`,
        vocabularyTips: [
          { word: 'pronounced', meaning: 'Rõ rệt, đáng chú ý' },
          { word: 'projected', meaning: 'Dự báo, được ước tính' }
        ]
      };
    } else {
      const essayPrompts = [
        `*Some people argue that government intervention is mandatory to address issues surrounding ${topic}, while others believe individual personal choices play a far more vital role.*\n\nDiscuss both views and give your own opinion.`,
        `*In many countries, problems associated with ${topic} are increasing rapidly. What are the primary causes of this trend, and what effective measures can be taken by governments and individuals to solve it?*`,
        `*While some experts believe that technological advances have simplified ${topic}, others argue that it has introduced unprecedented modern drawbacks.*\n\nDo the advantages of this trend outweigh the disadvantages?`
      ];
      const essaySelected = essayPrompts[randSeed % essayPrompts.length];

      return {
        id: `ai-ielts-w-t2-${timestamp}`,
        examType: 'IELTS',
        part: 2,
        partTitle: 'Task 2: Essay Writing (Bài luận phân tích - Min 250 words)',
        title: `Bài luận phân tích quan điểm về: ${topic}`,
        prompt: `**Write about the following topic:**\n\n${essaySelected}\n\n*(Write at least 250 words. Recommended time: 40 minutes)*`,
        minWords: 250,
        timeLimitMinutes: 40,
        sampleBand: targetBandOrLevel || 'Band 8.5',
        sampleAnswer: `The debate concerning ${topic} remains a subject of intense discussion in modern society. This essay will examine key perspectives before arguing that a balanced, multi-faceted approach yields the most sustainable outcomes.\n\nOn the one hand, proponents emphasize the necessity of systemic regulation. Central authorities possess the fiscal capacity required to institute mandatory laws and infrastructure projects concerning ${topic}.\n\nOn the other hand, advocates of personal responsibility argue that lasting change depends on individual commitment and daily habit modifications.\n\nIn conclusion, while legal regulations set essential baseline standards, personal choices determine overall success. Therefore, joint efforts between state entities and citizens are imperative.`,
        vocabularyTips: [
          { word: 'systemic regulation', meaning: 'Quy định có tính hệ thống' },
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

  const promptText = `Bạn là Giám khảo ra đề thi Writing ${examType} quốc tế chuyên nghiệp. Hãy tạo 1 đề thi mới độc đáo, không trùng lặp thuộc ${taskDesc} về chủ đề "${topic}".

Trả về duy nhất định dạng JSON theo cấu trúc:
{
  "title": "Tiêu đề câu hỏi Tiếng Việt",
  "partTitle": "${examType} Writing ${taskDesc}",
  "prompt": "Nội dung đề thi tiếng Anh hoàn chỉnh với đầy đủ ngữ cảnh",
  "givenWords": ["word1", "word2"],
  "minWords": ${examType === 'TOEIC' ? (part === 3 ? 300 : 80) : (part === 1 ? 150 : 250)},
  "timeLimitMinutes": ${examType === 'TOEIC' ? (part === 3 ? 30 : 20) : (part === 1 ? 20 : 40)},
  "sampleBand": "Band 8.5 / Level 8",
  "sampleAnswer": "Bài viết mẫu hoàn chỉnh bằng Tiếng Anh dài và chất lượng",
  "vocabularyTips": [
    { "word": "từ mới", "meaning": "nghĩa tiếng Việt" }
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
          id: `ai-writing-${Date.now()}`,
          examType,
          part,
          ieltsSubtype,
          ...parsed
        };
      }
    } catch (err) {
      console.warn('Lỗi khi gọi Gemini API tạo đề thi Writing, chuyển sang OpenAI/Fallback:', err);
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
    id: `ai-writing-${Date.now()}`,
    examType,
    part,
    ieltsSubtype,
    ...parsed
  };
}
