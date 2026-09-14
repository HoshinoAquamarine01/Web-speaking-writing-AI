import type { Question } from '../types';

export const IELTS_QUESTIONS: Question[] = [
  // --- PART 1: Introduction & Interview ---
  {
    id: 'ielts-p1-01',
    examType: 'IELTS',
    part: 1,
    partTitle: 'Part 1: Introduction & Interview (Phỏng vấn 4 câu)',
    title: 'Topic 1: Hometown & Daily Routine',
    prompt: `The examiner will ask you 4 general questions about yourself and everyday topics:`,
    subQuestions: [
      '1. Can you describe your hometown?',
      '2. What do you like most about living in your hometown?',
      '3. Do you prefer working/studying in the morning or in the evening? Why?',
      '4. Do you plan to continue living in your hometown in the future?'
    ],
    prepTimeSeconds: 15,
    responseTimeSeconds: 45,
    sampleBand: 'Band 8.0',
    sampleAnswer: `I come from Da Nang, a vibrant coastal city in central Vietnam famous for its sandy beaches and bridges. What I appreciate most about my hometown is the perfect blend of modern infrastructure and peaceful natural surroundings. As for my daily routine, I'm definitely a morning person because my concentration peaks early in the day. In the future, I intend to stay in my hometown due to its high quality of life.`,
    vocabularyTips: [
      { word: 'vibrant', ipa: '/ˈvaɪ.brənt/', meaning: 'Sôi động, đầy sức sống' },
      { word: 'infrastructure', ipa: '/ˈɪn.frəˌstrʌk.tʃər/', meaning: 'Cơ sở hạ tầng' },
      { word: 'concentration', ipa: '/ˌkɒn.sənˈtreɪ.ʃən/', meaning: 'Sự tập trung' }
    ]
  },
  {
    id: 'ielts-p1-02',
    examType: 'IELTS',
    part: 1,
    partTitle: 'Part 1: Introduction & Interview (Phỏng vấn 4 câu)',
    title: 'Topic 2: Music & Audio Habits',
    prompt: `4 General questions on music preferences and daily listening:`,
    subQuestions: [
      '1. What genre of music do you enjoy listening to most?',
      '2. Did you learn to play any musical instrument when you were a child?',
      '3. How has the way people listen to music changed compared to the past?',
      '4. When do you usually listen to music during the day?'
    ],
    prepTimeSeconds: 15,
    responseTimeSeconds: 45,
    sampleBand: 'Band 8.5',
    sampleAnswer: `I'm an avid fan of indie pop and acoustic music because the soothing melodies help me unwind after long working hours. Back in primary school, I took piano lessons for about two years. Nowadays, music streaming platforms like Spotify have made music accessible on-demand anywhere. I usually listen to music during my daily commute and before going to sleep.`,
    vocabularyTips: [
      { word: 'soothing', ipa: '/ˈsuː.ðɪŋ/', meaning: 'Dễ chịu, êm dịu' },
      { word: 'rusty', ipa: '/ˈrʌs.ti/', meaning: 'Mai một (kỹ năng)' },
      { word: 'on-demand', ipa: '/ˌɒn.dɪˈmɑːnd/', meaning: 'Theo yêu cầu' }
    ]
  },
  {
    id: 'ielts-p1-03',
    examType: 'IELTS',
    part: 1,
    partTitle: 'Part 1: Introduction & Interview (Phỏng vấn 4 câu)',
    title: 'Topic 3: Travel & Holidays',
    prompt: `4 General questions regarding travel experiences:`,
    subQuestions: [
      '1. Do you prefer traveling alone or with a group of friends?',
      '2. What was the most memorable place you visited recently?',
      '3. Where would you like to travel in the future if you had the chance?',
      '4. What is the best season to visit your country for foreign tourists?'
    ],
    prepTimeSeconds: 15,
    responseTimeSeconds: 45,
    sampleBand: 'Band 8.0',
    sampleAnswer: `I generally prefer traveling with a close group of friends because sharing experiences makes trips far more enjoyable. Last summer, I spent a week exploring Sapa. In the future, I dream of visiting Iceland. Spring and autumn are definitely the best seasons to visit Vietnam due to pleasant weather.`,
    vocabularyTips: [
      { word: 'spontaneous', ipa: '/spɒnˈteɪ.ni.əs/', meaning: 'Bộc phát, tự nhiên' },
      { word: 'breathtaking', ipa: '/ˈbreθˌteɪ.kɪŋ/', meaning: 'Đẹp đến ngạt thở' }
    ]
  },

  // --- PART 2: Cue Cards ---
  {
    id: 'ielts-p2-01',
    examType: 'IELTS',
    part: 2,
    partTitle: 'Part 2: Cue Card (Individual Long Turn - Bài nói 2 phút)',
    title: 'Describe a person who has strongly influenced your career or life choices',
    prompt: `**Describe a person who has strongly influenced your career or life choices.**

You should say:
- Who this person is and how you met them
- What kind of personality they have
- How they helped or influenced you
- And explain why their influence was so significant to you.`,
    prepTimeSeconds: 60,
    responseTimeSeconds: 120,
    sampleBand: 'Band 8.5',
    sampleAnswer: `I would like to talk about my former university lecturer, Dr. Minh, who played a pivotal role in shaping my career path in artificial intelligence. I first met him during my sophomore year when I attended his introductory computer science course. 

Dr. Minh is an extraordinarily patient and passionate educator with a knack for explaining complex algorithms in an engaging, relatable manner. Whenever students struggled with coding challenges, he would willingly dedicate extra hours to guide us through debugging.

His influence was profound because he encouraged me to pursue independent research when I lacked self-confidence. He introduced me to cutting-edge machine learning projects and recommended valuable internships. Thanks to his mentorship, I gained the determination to specialize in software engineering. I remain immensely grateful for his guidance.`,
    vocabularyTips: [
      { word: 'pivotal role', ipa: '/ˈpɪv.ə.təl rəʊl/', meaning: 'Vai trò then chốt' },
      { word: 'mentorship', ipa: '/ˈmen.tɔː.ʃɪp/', meaning: 'Sự cố vấn' }
    ]
  },
  {
    id: 'ielts-p2-02',
    examType: 'IELTS',
    part: 2,
    partTitle: 'Part 2: Cue Card (Individual Long Turn - Bài nói 2 phút)',
    title: 'Describe an exciting piece of technology you use regularly',
    prompt: `**Describe an exciting piece of technology you use regularly.**

You should say:
- What this technology item is
- How long you have been using it
- What you mainly use it for
- And explain why you find it exciting or indispensable in your daily life.`,
    prepTimeSeconds: 60,
    responseTimeSeconds: 120,
    sampleBand: 'Band 8.0',
    sampleAnswer: `The technological device I would like to describe is my noise-canceling wireless headphones, which I acquired about a year ago. 

I utilize these headphones primarily while working in bustling coffee shops or commuting on noisy public buses. The active noise-cancellation technology effectively blocks out ambient background noise, allowing me to enter a state of deep focus whether I am coding, listening to educational podcasts, or taking client video calls.

What makes this device indispensable to me is its remarkable battery life and seamless Bluetooth multi-point connection. It has significantly elevated my daily productivity and reduced mental fatigue from urban noise pollution.`,
    vocabularyTips: [
      { word: 'indispensable', ipa: '/ˌɪn.dɪˈspen.sə.bəl/', meaning: 'Không thể thiếu' },
      { word: 'ambient noise', ipa: '/ˈæm.bi.ənt nɔɪz/', meaning: 'Tiếng ồn xung quanh' }
    ]
  },
  {
    id: 'ielts-p2-03',
    examType: 'IELTS',
    part: 2,
    partTitle: 'Part 2: Cue Card (Individual Long Turn - Bài nói 2 phút)',
    title: 'Describe a skill you learned that took a long time to master',
    prompt: `**Describe a skill you learned that took a long time to master.**

You should say:
- What the skill is
- Why you decided to learn it
- How you practiced it over time
- And explain how you felt when you finally mastered it.`,
    prepTimeSeconds: 60,
    responseTimeSeconds: 120,
    sampleBand: 'Band 8.5',
    sampleAnswer: `A challenging skill that required considerable perseverance for me to master was public speaking in English. Initially, I used to experience severe stage fright whenever I had to address an audience in a non-native language.

To overcome this hurdle, I enrolled in a local public speaking club two years ago. I forced myself to deliver weekly presentations, recorded my speeches to analyze body language, and practiced vocal modulation. Over months of consistent practice, my anxiety gradually turned into self-assurance.

When I successfully delivered a keynote speech at a regional tech seminar last month without stuttering, I felt an immense sense of personal pride and fulfillment.`,
    vocabularyTips: [
      { word: 'perseverance', ipa: '/ˌpɜː.sɪˈvɪə.rəns/', meaning: 'Sự kiên trì' },
      { word: 'self-assurance', ipa: '/ˌself.əˈʃɔː.rəns/', meaning: 'Sự tự tin' }
    ]
  },

  // --- PART 3: Two-way Discussion ---
  {
    id: 'ielts-p3-01',
    examType: 'IELTS',
    part: 3,
    partTitle: 'Part 3: Two-way Discussion (Thảo luận chiều sâu 4 câu)',
    title: 'Topic 1: Technology & Education in the Modern Era',
    prompt: `4 Deep-dive analytical questions related to technology in education:`,
    subQuestions: [
      '1. How has technology changed the relationship between teachers and students in recent years?',
      '2. Do you think AI tools could ever replace human mentors in education?',
      '3. What skills will be most essential for young workers in the next decade?',
      '4. What measures can educational institutions take to ensure digital equality for all students?'
    ],
    prepTimeSeconds: 20,
    responseTimeSeconds: 60,
    sampleBand: 'Band 8.0',
    sampleAnswer: `Technology has fundamentally transformed modern pedagogy by shifting teachers from traditional knowledge authority figures to facilitators of learning. While AI tools provide instantaneous access to information, I firmly believe they can never replace human mentors due to the lack of empathy and moral guidance. In the coming decade, critical thinking and emotional intelligence will be paramount. Schools must subsidize digital devices to ensure equal access.`,
    vocabularyTips: [
      { word: 'pedagogy', ipa: '/ˈped.ə.ɡɒdʒ.i/', meaning: 'Phương pháp giảng dạy' },
      { word: 'facilitators', ipa: '/fəˈsɪl.ɪ.teɪ.təz/', meaning: 'Người hỗ trợ/điều phối' }
    ]
  },
  {
    id: 'ielts-p3-02',
    examType: 'IELTS',
    part: 3,
    partTitle: 'Part 3: Two-way Discussion (Thảo luận chiều sâu 4 câu)',
    title: 'Topic 2: Environmental Conservation & Sustainable Living',
    prompt: `4 Deep-dive analytical questions regarding environmental responsibility:`,
    subQuestions: [
      '1. Should environmental protection be the responsibility of governments or individual citizens?',
      '2. How effective are international climate agreements in curbing global pollution?',
      '3. How can schools encourage eco-friendly habits among young children?',
      '4. What major changes in consumer behavior will be necessary to achieve long-term sustainability?'
    ],
    prepTimeSeconds: 20,
    responseTimeSeconds: 60,
    sampleBand: 'Band 8.5',
    sampleAnswer: `In my view, environmental conservation requires a collaborative effort where governments establish strict regulatory frameworks while individuals adopt sustainable lifestyles. International treaties set crucial emission targets, but their effectiveness depends heavily on national enforcement. Schools can instill environmental stewardship early on by integrating hands-on recycling projects. Finally, consumers must reduce single-use plastics and support renewable energy.`,
    vocabularyTips: [
      { word: 'regulatory framework', ipa: '/ˈreɡ.jə.lə.tər.i ˈfreɪm.wɜːk/', meaning: 'Khung pháp lý điều hành' },
      { word: 'stewardship', ipa: '/ˈstjuː.əd.ʃɪp/', meaning: 'Trách nhiệm quản lý/bảo vệ' }
    ]
  }
];
