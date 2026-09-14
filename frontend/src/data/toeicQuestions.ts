import type { Question } from '../types';

export const TOEIC_QUESTIONS: Question[] = [
  // --- PART 1: Read a Text Aloud ---
  {
    id: 'toeic-p1-01',
    examType: 'TOEIC',
    part: 1,
    partTitle: 'Part 1: Read a Text Aloud (Đọc thành tiếng 2 đoạn văn)',
    title: 'Đọc 2 đoạn văn thông báo hàng không & sản phẩm công nghệ',
    prompt: `Part 1 gồm 2 đoạn văn (Câu 1 và Câu 2). Bạn sẽ đọc lần lượt từng đoạn thành tiếng với thời gian chuẩn bị 45s và thu âm 45s mỗi đoạn.`,
    subQuestions: [
      'Đoạn 1 (Câu 1/2): Attention passengers on Flight VN-452 to Tokyo. Departure gate has been changed from Gate 12 to Gate 18B due to maintenance work on the main runway. Boarding will begin in approximately twenty minutes. Please ensure you have your passport and boarding pass ready for inspection. We appreciate your patience and wish you a pleasant flight.',
      'Đoạn 2 (Câu 2/2): Welcome to the launch of NovaTech\'s newest smart home assistant, the EchoMind Pro. Designed to simplify your daily routine, EchoMind Pro features advanced voice recognition, real-time energy monitoring, and seamless integration with all your smart appliances. Visit our website today to claim a special 20% discount on pre-orders!'
    ],
    prepTimeSeconds: 45,
    responseTimeSeconds: 45,
    sampleBand: 'Level 8 (190-200)',
    sampleAnswer: `Paragraph 1: Attention passengers on Flight VN-452 to Tokyo... Paragraph 2: Welcome to the launch of NovaTech's newest smart home assistant...`,
    vocabularyTips: [
      { word: 'approximately', ipa: '/əˈprɒk.sɪ.mət.li/', meaning: 'Xấp xỉ, khoảng' },
      { word: 'seamless', ipa: '/ˈsiːm.ləs/', meaning: 'Mượt mà, liền mạch' }
    ]
  },
  {
    id: 'toeic-p1-02',
    examType: 'TOEIC',
    part: 1,
    partTitle: 'Part 1: Read a Text Aloud (Đọc thành tiếng 2 đoạn văn)',
    title: 'Đọc 2 đoạn văn thông báo an toàn & dự báo thời tiết',
    prompt: `Part 1 gồm 2 đoạn văn (Câu 1 và Câu 2). Bạn sẽ đọc lần lượt từng đoạn thành tiếng với thời gian chuẩn bị 45s và thu âm 45s mỗi đoạn.`,
    subQuestions: [
      'Đoạn 1 (Câu 1/2): This is a friendly reminder for all corporate staff regarding building safety procedures. In the event of a fire alarm, please remain calm and proceed immediately to the nearest emergency exit. Do not use the elevators under any circumstances. Fire wardens wearing bright yellow vests will guide you safely to the assembly area outside.',
      'Đoạn 2 (Câu 2/2): Good morning Metro City! Today expect sunny skies with temperatures peaking at twenty-eight degrees Celsius. However, commuter traffic along Highway 101 is experiencing heavy delays due to ongoing road repairs near Exit 5. Drivers are strongly advised to take alternative routes or utilize public transport. Stay tuned for our hourly updates.'
    ],
    prepTimeSeconds: 45,
    responseTimeSeconds: 45,
    sampleBand: 'Level 8 (190-200)',
    sampleAnswer: `Paragraph 1: This is a friendly reminder for all corporate staff... Paragraph 2: Good morning Metro City! Today expect sunny skies...`,
    vocabularyTips: [
      { word: 'procedures', ipa: '/prəˈsiː.dʒəz/', meaning: 'Quy trình' },
      { word: 'commuter', ipa: '/kəˈmjuː.tər/', meaning: 'Người đi làm xa' }
    ]
  },

  // --- PART 2: Describe a Picture ---
  {
    id: 'toeic-p2-01',
    examType: 'TOEIC',
    part: 2,
    partTitle: 'Part 2: Describe a Picture (Miêu tả 2 bức tranh)',
    title: 'Miêu tả 2 bức tranh: Phòng họp & Công trường xây dựng',
    imageUrl: 'https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?auto=format&fit=crop&w=800&q=80',
    prompt: `Part 2 gồm 2 bức tranh (Câu 3 và Câu 4). Bạn sẽ miêu tả lần lượt từng bức tranh với thời gian chuẩn bị 45s và nói 45s mỗi bức.`,
    subQuestions: [
      'Bức tranh 1 (Câu 3/4 - Trong phòng họp): Mô tả cuộc họp thảo luận tại văn phòng công ty. Chú ý số lượng người, trang phục, hành động của từng người và không khí làm việc.',
      'Bức tranh 2 (Câu 4/4 - Ngoài công trường): Mô tả các kỹ sư đang làm việc ngoài công trường xây dựng. Chú ý đến đồ bảo hộ (mũ bảo hiểm, áo phản quang) và tài liệu bản vẽ.'
    ],
    prepTimeSeconds: 45,
    responseTimeSeconds: 45,
    sampleBand: 'Level 8 (190-200)',
    sampleAnswer: `Picture 1: In this picture, a group of colleagues is sitting around a wooden table in a modern conference room... Picture 2: The photo depicts two civil engineers wearing hard hats and high-visibility vests examining blueprints...`,
    vocabularyTips: [
      { word: 'collaborative', ipa: '/kəˈlæb.ər.ə.tɪv/', meaning: 'Mang tính hợp tác' },
      { word: 'blueprint', ipa: '/ˈbluː.prɪnt/', meaning: 'Bản thiết kế xây dựng' }
    ]
  },
  {
    id: 'toeic-p2-02',
    examType: 'TOEIC',
    part: 2,
    partTitle: 'Part 2: Describe a Picture (Mô tả bức tranh)',
    title: 'Kỹ sư công trình làm việc tại công trường',
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=800&q=80',
    prompt: `Miêu tả các kỹ sư đang làm việc ngoài công trường xây dựng. Chú ý đến đồ bảo hộ (mũ bảo hiểm, áo phản quang), tài liệu bản vẽ và hoạt động của từng người.`,
    prepTimeSeconds: 45,
    responseTimeSeconds: 45,
    sampleBand: 'Level 8 (190-200)',
    sampleAnswer: `The photo depicts an outdoor construction site on a clear day. In the foreground, two civil engineers wearing hard hats and high-visibility yellow vests are examining blueprint documents spread over a metal table. One engineer is pointing to a specific structure diagram while talking to his colleague. In the background, heavy machinery including a crane and scaffolding can be seen.`,
    vocabularyTips: [
      { word: 'high-visibility', ipa: '/haɪ vɪz.əˈbɪl.ə.ti/', meaning: 'Phản quang' },
      { word: 'blueprint', ipa: '/ˈbluː.prɪnt/', meaning: 'Bản thiết kế xây dựng' }
    ]
  },
  {
    id: 'toeic-p2-03',
    examType: 'TOEIC',
    part: 2,
    partTitle: 'Part 2: Describe a Picture (Mô tả bức tranh)',
    title: 'Khách hàng order cà phê tại quán Cafe',
    imageUrl: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=800&q=80',
    prompt: `Miêu tả khung cảnh một quán cà phê ấm cúng với quầy thu ngân và các vị khách đang thưởng thức đồ uống.`,
    prepTimeSeconds: 45,
    responseTimeSeconds: 45,
    sampleBand: 'Level 7 (160-180)',
    sampleAnswer: `This image shows the interior of a cozy coffee shop. A barista in a dark apron is preparing a beverage behind the wooden counter. Opposite him, a female customer is holding a credit card to pay for her order. On the counter, there are pastry display cases filled with fresh croissants and muffins. The warm lighting creates a relaxing ambiance for patrons.`,
    vocabularyTips: [
      { word: 'barista', ipa: '/bəˈriː.stə/', meaning: 'Nhân viên pha chế' },
      { word: 'ambiance', ipa: '/ˈæm.bi.əns/', meaning: 'Không khí, bầu không khí' }
    ]
  },

  // --- PART 3: Respond to Questions ---
  {
    id: 'toeic-p3-01',
    examType: 'TOEIC',
    part: 3,
    partTitle: 'Part 3: Respond to Questions (Trả lời câu hỏi)',
    title: 'Chủ đề: Thói quen mua sắm trực tuyến (Online Shopping)',
    prompt: `Imagine an online market research company is interviewing you about shopping habits:`,
    subQuestions: [
      'Question 1 (15s): How often do you shop online, and what items do you usually buy?',
      'Question 2 (15s): What is the main advantage of shopping online compared to visiting physical stores?',
      'Question 3 (30s): Would you recommend shopping online to older family members? Why or why not?'
    ],
    prepTimeSeconds: 15,
    responseTimeSeconds: 30,
    sampleBand: 'Level 8 (190-200)',
    sampleAnswer: `I shop online about twice a week, mostly buying electronics, books, and clothes. The main advantage of online shopping is convenience and time saving because I can browse hundreds of products from home without traveling. Finally, I would definitely recommend it to older family members because it delivers heavy items right to their doorstep.`,
    vocabularyTips: [
      { word: 'convenience', ipa: '/kənˈviː.ni.əns/', meaning: 'Sự tiện lợi' },
      { word: 'doorstep', ipa: '/ˈdɔː.step/', meaning: 'Bậc thềm nhà' }
    ]
  },
  {
    id: 'toeic-p3-02',
    examType: 'TOEIC',
    part: 3,
    partTitle: 'Part 3: Respond to Questions (Trả lời câu hỏi)',
    title: 'Chủ đề: Phương tiện giao thông công cộng (Public Transit)',
    prompt: `Imagine a city planning magazine is surveying citizens about commuting choices:`,
    subQuestions: [
      'Question 1 (15s): What mode of public transit do you use most frequently?',
      'Question 2 (15s): How long does your typical daily commute take?',
      'Question 3 (30s): In your opinion, what improvements should the city make to public transportation?'
    ],
    prepTimeSeconds: 15,
    responseTimeSeconds: 30,
    sampleBand: 'Level 8 (190-200)',
    sampleAnswer: `I use the metro system most frequently because it is punctual and avoids road traffic jams. My daily commute usually takes around thirty minutes each way. To improve public transport, I think city planners should increase bus frequencies during peak hours and introduce contactless digital payment options across all transit lines.`,
    vocabularyTips: [
      { word: 'punctual', ipa: '/ˈpʌŋk.tʃu.əl/', meaning: 'Đúng giờ' },
      { word: 'contactless', ipa: '/ˈkɒn.tækt.ləs/', meaning: 'Không tiếp xúc' }
    ]
  },

  // --- PART 4: Respond to Questions Using Information Provided ---
  {
    id: 'toeic-p4-01',
    examType: 'TOEIC',
    part: 4,
    partTitle: 'Part 4: Respond using Information Provided (Trả lời dựa trên thông tin cho sẵn)',
    title: 'Lịch trình Hội thảo Công nghệ GreenTech 2026',
    prompt: `**GreenTech Annual Conference Schedule**
Date: October 15, 2026 | Location: Grand Convention Hall

• 09:00 AM - 10:00 AM: Keynote Speech: "Future of Clean Energy" by Dr. Sarah Jenkins (Main Auditorium)
• 10:30 AM - 12:00 PM: Workshop: "Solar Tech Integration" (Room 204) - Fee: $25
• 01:30 PM - 03:00 PM: Panel Discussion: "Reducing Carbon Footprints in Logistics" (Room 101)
• 03:30 PM - 05:00 PM: Networking Session & Tech Demo (Exhibition Hall)`,
    subQuestions: [
      'Question 1 (15s): Hello, I am planning to attend the conference. Could you tell me who is giving the opening speech at 9:00 AM?',
      'Question 2 (15s): Is the Solar Tech Integration workshop free to attend?',
      'Question 3 (30s): What events are scheduled in the afternoon starting from 1:30 PM?'
    ],
    prepTimeSeconds: 45,
    responseTimeSeconds: 30,
    sampleBand: 'Level 8 (190-200)',
    sampleAnswer: `According to the schedule, the keynote speech at 9:00 AM will be given by Dr. Sarah Jenkins on the topic "Future of Clean Energy" in the Main Auditorium. Regarding the afternoon panel discussion on "Reducing Carbon Footprints in Logistics" at 1:30 PM, there is no fee mentioned, so it is included with your general admission pass.`,
    vocabularyTips: [
      { word: 'keynote speech', ipa: '/ˈkiː.nəʊt spiːtʃ/', meaning: 'Bài phát biểu chủ đề chính' },
      { word: 'general admission', ipa: '/ˈdʒen.ər.əl ədˈmɪʃ.ən/', meaning: 'Vé vào cửa phổ thông' }
    ]
  },

  // --- PART 5: Express an Opinion ---
  {
    id: 'toeic-p5-01',
    examType: 'TOEIC',
    part: 5,
    partTitle: 'Part 5: Express an Opinion (Trình bày quan điểm)',
    title: 'Chủ đề: Làm việc tại nhà (Remote Work)',
    prompt: `Some companies allow employees to work remotely from home, while others insist that employees work in the office every day. Which work arrangement do you prefer, and why? Give specific reasons and details to support your opinion.`,
    prepTimeSeconds: 45,
    responseTimeSeconds: 60,
    sampleBand: 'Level 8 (190-200)',
    sampleAnswer: `In my opinion, a hybrid work model that allows employees to work remotely at least two days a week is the best option. Firstly, working from home saves significant commute time and transportation costs, which reduces stress and boosts daily productivity. For example, working remotely allows me to focus deeply without frequent office distractions. Secondly, remote work fosters trust between employers and staff. Therefore, I strongly support flexible working arrangements.`,
    vocabularyTips: [
      { word: 'commute time', ipa: '/kəˈmjuːt taɪm/', meaning: 'Thời gian đi lại' },
      { word: 'distractions', ipa: '/dɪˈstræk.ʃənz/', meaning: 'Sự xao nhãng' }
    ]
  }
];
