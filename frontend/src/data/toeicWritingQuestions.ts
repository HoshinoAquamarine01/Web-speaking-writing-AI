import type { WritingQuestion } from '../types';

export const TOEIC_WRITING_QUESTIONS: WritingQuestion[] = [
  // --- PART 1: Write a Sentence Based on a Picture ---
  {
    id: 'toeic-w-p1-01',
    examType: 'TOEIC',
    part: 1,
    partTitle: 'Part 1: Write a Sentence Based on a Picture (Viết câu từ bức tranh)',
    title: 'Câu 1: Cuộc họp văn phòng công ty',
    imageUrl: 'https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?auto=format&fit=crop&w=800&q=80',
    prompt: 'Viết 1 câu hoàn chỉnh mô tả bức tranh bằng tiếng Anh, sử dụng chính xác 2 từ gợi ý dưới đây mà không thay đổi dạng từ:',
    givenWords: ['discuss', 'presentation'],
    minWords: 8,
    timeLimitMinutes: 3,
    sampleBand: 'Score 5/5',
    sampleAnswer: 'The team members are discussing key metrics while watching the presentation on the laptop.',
    vocabularyTips: [
      { word: 'metrics', meaning: 'Chỉ số đo lường' },
      { word: 'presentation', meaning: 'Bài thuyết trình' }
    ]
  },
  {
    id: 'toeic-w-p1-02',
    examType: 'TOEIC',
    part: 1,
    partTitle: 'Part 1: Write a Sentence Based on a Picture (Viết câu từ bức tranh)',
    title: 'Câu 2: Kỹ sư tại công trường xây dựng',
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=800&q=80',
    prompt: 'Viết 1 câu hoàn chỉnh mô tả bức tranh bằng tiếng Anh, sử dụng chính xác 2 từ gợi ý:',
    givenWords: ['engineer', 'examine'],
    minWords: 8,
    timeLimitMinutes: 3,
    sampleBand: 'Score 5/5',
    sampleAnswer: 'The senior engineer is examining the architectural blueprint on the table with his colleague.',
    vocabularyTips: [
      { word: 'architectural', meaning: 'Thuộc về kiến trúc' },
      { word: 'blueprint', meaning: 'Bản thiết kế xây dựng' }
    ]
  },
  {
    id: 'toeic-w-p1-03',
    examType: 'TOEIC',
    part: 1,
    partTitle: 'Part 1: Write a Sentence Based on a Picture (Viết câu từ bức tranh)',
    title: 'Câu 3: Khách hàng tại quán cà phê',
    imageUrl: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=800&q=80',
    prompt: 'Viết 1 câu hoàn chỉnh mô tả bức tranh bằng tiếng Anh, sử dụng chính xác 2 từ gợi ý:',
    givenWords: ['customer', 'pay'],
    minWords: 8,
    timeLimitMinutes: 3,
    sampleBand: 'Score 5/5',
    sampleAnswer: 'A female customer is using her credit card to pay for her coffee order at the counter.',
    vocabularyTips: [
      { word: 'counter', meaning: 'Quầy thu ngân' }
    ]
  },

  // --- PART 2: Respond to a Written Request ---
  {
    id: 'toeic-w-p2-01',
    examType: 'TOEIC',
    part: 2,
    partTitle: 'Part 2: Respond to a Written Request (Trả lời Email yêu cầu)',
    title: 'Phản hồi Email khiếu nại giao hàng chậm trễ',
    prompt: `**Read the following email from a client:**

From: Robert Harrison <rharrison@logistics-plus.com>
To: Customer Support <support@officegear.com>
Subject: Urgent: Delayed Office Furniture Delivery (Order #9042)

Dear Support Team,
I am writing regarding order #9042 for twenty ergonomic office chairs placed on October 5th. According to your confirmation, the items were scheduled to arrive yesterday morning. However, we have not received the shipment yet. Our team cannot set up the new conference room without these chairs. 
Please let me know when we can expect delivery and whether any compensation will be provided.

Sincerely,
Robert Harrison

---
**Directions**: Respond to the email as if you are a Customer Support Representative at OfficeGear. In your email, respond to **TWO** requests:
1. Provide an explanation for the delay and give a new confirmed delivery time.
2. Offer a solution or discount/compensation for the inconvenience.`,
    minWords: 80,
    timeLimitMinutes: 20,
    sampleBand: 'Level 8 (190-200)',
    sampleAnswer: `Dear Mr. Harrison,

Thank you for contacting OfficeGear Support. I sincerely apologize for the delay regarding your order #9042 for twenty ergonomic chairs.

Due to an unexpected logistics disruption caused by severe weather near our regional warehouse, shipment dispatches were temporarily delayed yesterday. I am pleased to inform you that your items are currently en route and guaranteed to arrive at your office tomorrow by 10:00 AM.

To compensate for the inconvenience caused to your conference room setup, we have applied a 15% refund to your credit card and enclosed a $50 coupon code for your next purchase.

If you have any further questions, please feel free to reach out to me directly.

Best regards,
Nguyen Van A
Customer Support Specialist, OfficeGear`,
    vocabularyTips: [
      { word: 'disruption', meaning: 'Sự gián đoạn' },
      { word: 'en route', meaning: 'Đang trên đường giao' },
      { word: 'compensate', meaning: 'Bồi thường, bù đắp' }
    ]
  },

  // --- PART 3: Write an Opinion Essay ---
  {
    id: 'toeic-w-p3-01',
    examType: 'TOEIC',
    part: 3,
    partTitle: 'Part 3: Write an Opinion Essay (Bài luận quan điểm cá nhân)',
    title: 'Chủ đề: Làm việc từ xa (Remote Work vs. Office Work)',
    prompt: `**Read the question below. You have 30 minutes to plan, write, and revise your essay.**

Some companies allow employees to work remotely from home, while others insist that employees work in the corporate office every day. 

Which work arrangement do you prefer, and why? Support your opinion with specific reasons and examples. 

*(An effective essay usually contains at least 300 words).*`,
    minWords: 300,
    timeLimitMinutes: 30,
    sampleBand: 'Level 8 (190-200)',
    sampleAnswer: `In the modern corporate landscape, the debate surrounding remote work versus traditional office employment has gained significant momentum. While some organizations advocate for full-time office presence to maintain supervision, I strongly believe that a flexible hybrid work model—combining remote work with key in-person office days—is the most beneficial approach for both employers and employees.

First and foremost, remote work substantially reduces daily commute times, which directly contributes to enhanced employee well-being and productivity. Commuting in heavily congested urban areas often leads to physical exhaustion and heightened stress before the workday even commences. By working from home, professionals save valuable hours that can be reallocated toward focused work, personal exercise, or family responsibilities. For instance, studies have shown that remote workers frequently report higher job satisfaction and lower rates of burnout because they enjoy greater autonomy over their schedules.

Secondly, working remotely allows employees to tailor their environment for deep concentration. Corporate offices are frequently filled with noise, unexpected interruptions, and unnecessary impromptu meetings that disrupt complex tasks. In contrast, a quiet home workspace enables individuals to focus intensely on detailed projects such as software development, financial analysis, or strategic planning. Consequently, the quality and accuracy of work output often improve significantly when workers are given space to work uninterrupted.

However, recognizing the value of face-to-face collaboration is equally vital. In-person interactions foster team bonding, facilitate spontaneous brainstorming, and strengthen corporate culture in ways that virtual video calls cannot fully replicate. Therefore, requiring employees to gather at the office two days a week strikes an ideal equilibrium between independent focus and team cohesion.

In conclusion, flexible remote work policies represent the future of modern employment. By granting employees autonomy while maintaining periodic office check-ins, companies can maximize productivity, boost morale, and retain top talent in an increasingly competitive global economy.`,
    vocabularyTips: [
      { word: 'momentum', meaning: 'Đà phát triển, thế đẩy' },
      { word: 'autonomy', meaning: 'Sự tự chủ' },
      { word: 'impromptu', meaning: 'Bất ngờ, ngẫu hứng' },
      { word: 'equilibrium', meaning: 'Trạng thái cân bằng' }
    ]
  }
];
