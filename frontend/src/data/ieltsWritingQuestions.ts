import type { WritingQuestion } from '../types';

export const IELTS_WRITING_QUESTIONS: WritingQuestion[] = [
  // --- TASK 1: Academic / General ---
  {
    id: 'ielts-w-t1-01',
    examType: 'IELTS',
    ieltsSubtype: 'academic',
    part: 1,
    partTitle: 'Task 1 (Academic): Report Writing (Biểu đồ / Sơ đồ - Min 150 words)',
    title: 'Biểu đồ cột: Tỷ lệ sử dụng năng lượng tái tạo tại 4 quốc gia (2010 - 2025)',
    prompt: `**The chart below shows the percentage of electricity generated from renewable energy sources in four European countries between 2010 and 2025.**

📊 **Data Summary (Tỷ lệ phần trăm %):**
- **Sweden**: 2010 (45%) | 2018 (55%) | 2025 (65%)
- **Germany**: 2010 (30%) | 2018 (42%) | 2025 (50%)
- **Spain**: 2010 (20%) | 2018 (28%) | 2025 (35%)
- **United Kingdom**: 2010 (10%) | 2018 (25%) | 2025 (45%)

Summarise the information by selecting and reporting the main features, and make comparisons where relevant.

*(Write at least 150 words. Recommended time: 20 minutes)*`,
    chartData: {
      chartTitle: 'Percentage of Electricity Generated from Renewable Energy Sources',
      chartType: 'bar',
      unit: '%',
      categories: ['2010', '2018', '2025 (Dự báo)'],
      series: [
        { name: 'Sweden', color: '#8b5cf6', values: [45, 55, 65] },
        { name: 'Germany', color: '#06b6d4', values: [30, 42, 50] },
        { name: 'Spain', color: '#f59e0b', values: [20, 28, 35] },
        { name: 'United Kingdom', color: '#ec4899', values: [10, 25, 45] }
      ]
    },
    minWords: 150,
    timeLimitMinutes: 20,
    sampleBand: 'Band 8.5',
    sampleAnswer: `The bar chart illustrates the proportion of electricity produced from renewable resources in Germany, Sweden, Spain, and the UK from 2010 to 2025, including projected figures for 2025.

Overall, it is clear that Sweden maintained the highest percentage of renewable energy usage throughout the fifteen-year period, while the UK experienced the most dramatic growth among all four nations.

In 2010, Sweden led the group with renewables accounting for 45% of its total electricity generation. Germany followed closely at 30%, whereas Spain and the UK recorded lower shares of 20% and 10%, respectively. By 2018, all countries demonstrated steady upward trends, with Sweden reaching 55% and Germany climbing to 42%.

Looking at the projections for 2025, Sweden is anticipated to remain the dominant consumer of clean energy at 65%. Notably, the UK is expected to undergo a significant transformation, with its green energy contribution reaching 45%—a more than fourfold increase compared to its initial 2010 figure. Meanwhile, Spain and Germany are forecasted to stabilize at 35% and 50%, respectively.`,
    vocabularyTips: [
      { word: 'proportion', meaning: 'Tỷ lệ' },
      { word: 'demonstrated', meaning: 'Thể hiện, thể hiện rõ' },
      { word: 'fourfold increase', meaning: 'Tăng gấp 4 lần' }
    ]
  },
  {
    id: 'ielts-w-t1-02',
    examType: 'IELTS',
    ieltsSubtype: 'general',
    part: 1,
    partTitle: 'Task 1 (General Training): Letter Writing (Viết thư - Min 150 words)',
    title: 'Viết thư cho chủ nhà báo cáo sự cố hư hỏng căn hộ',
    prompt: `**You are living in a rented apartment. Recently, there has been a problem with the heating system that your landlord has failed to repair despite your previous phone calls.**

Write a letter to your landlord. In your letter:
- Describe the problem with the heating system
- Explain how this problem is affecting your daily life
- State clearly what action you expect the landlord to take and by when.

*(Write at least 150 words. Recommended time: 20 minutes)*`,
    minWords: 150,
    timeLimitMinutes: 20,
    sampleBand: 'Band 8.0',
    sampleAnswer: `Dear Mr. Smith,

I am writing to formally bring to your attention a serious issue regarding the heating system in Apartment 4B, which I have been renting since January.

Despite notifying your office by phone on two separate occasions last week, the main radiator in the living room remains completely non-functional. The temperature inside the apartment has dropped significantly due to the ongoing winter freeze, making it uncomfortably cold to study or sleep. Furthermore, the master bedroom heater has started making loud rattling noises throughout the night.

Given that freezing temperatures are forecasted for the remainder of the week, this situation requires urgent rectification. I request that you arrange for a certified heating technician to inspect and repair the heating unit no later than Friday, November 18th. 

Should the repairs not be completed by this deadline, I will have no alternative but to hire an independent repair service and deduct the costs from next month's rent.

I look forward to your prompt response.

Yours sincerely,
Alex Turner`,
    vocabularyTips: [
      { word: 'non-functional', meaning: 'Không hoạt động' },
      { word: 'rectification', meaning: 'Sự sửa chữa, khắc phục' },
      { word: 'certified technician', meaning: 'Kỹ thuật viên chứng chỉ' }
    ]
  },

  // --- TASK 2: Essay Writing ---
  {
    id: 'ielts-w-t2-01',
    examType: 'IELTS',
    part: 2,
    partTitle: 'Task 2: Essay Writing (Bài luận phân tích - Minimum 250 words)',
    title: 'Chủ đề: Tác động của Mạng Xã Hội tới Mối Quan Hệ Xã Hội',
    prompt: `**Write about the following topic:**

*Some people believe that social media has brought people closer together, while others argue that it has made individuals more isolated than ever.*

Discuss both views and give your own opinion.

*(Write at least 250 words. Recommended time: 40 minutes)*`,
    minWords: 250,
    timeLimitMinutes: 40,
    sampleBand: 'Band 8.5',
    sampleAnswer: `In the digital era, the ubiquitous presence of social networking platforms has reshaped how human beings communicate. While proponents argue that social media fosters global connectivity and bridges geographical divides, critics contend that it breeds psychological isolation and undermines genuine face-to-face relationships. This essay will examine both perspectives before presenting a nuanced conclusion.

On the one hand, advocates of digital platforms emphasize their unmatched ability to dismantle spatial barriers. Social networks such as Facebook, WhatsApp, and LinkedIn empower individuals to maintain instantaneous contact with family members and peers across international borders. Furthermore, online communities provide marginalized groups or people with niche interests a welcoming space to exchange ideas and offer mutual emotional support. For instance, elderly individuals living alone often find solace in virtual groups, enabling them to feel connected to society despite mobility constraints.

On the other hand, skeptics highlight the detrimental impact of superficial online interactions on real-world bonds. Virtual communication often lacks the subtle non-verbal cues, empathy, and warmth inherent in personal encounters. When individuals prioritize curating digital personas over cultivating authentic relationships, the quality of interpersonal connections diminishes. Moreover, excessive screen time frequently leads to "Phubbing"—the practice of ignoring companions in favor of smartphone notifications—which erodes trust and intimacy in families and friendships.

In my opinion, social media is a double-edged sword whose impact depends on user intentionality. While it offers invaluable tools for international communication, substituting virtual engagement for real-life human interaction inevitably leads to emotional detachment. Therefore, individuals must practice digital mindfulness by setting strict boundaries on screen time.

In conclusion, although social media has expanded global networks, it cannot replace the depth of physical togetherness. A balanced lifestyle that prioritizes meaningful face-to-face interaction is essential to prevent digital isolation.`,
    vocabularyTips: [
      { word: 'ubiquitous', meaning: 'Phổ biến khắp nơi' },
      { word: 'dismantle spatial barriers', meaning: 'Xóa bỏ rào cản không gian' },
      { word: 'detrimental impact', meaning: 'Tác động có hại' },
      { word: 'digital mindfulness', meaning: 'Sự tỉnh thức khi dùng công nghệ' }
    ]
  }
];
